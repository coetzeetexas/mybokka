// Supabase Edge Function (Deno). Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt
// Configure this function's URL as a Stripe webhook endpoint listening for checkout.session.completed.
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

interface CartLine {
  productId: string;
  variantId: string | null;
  quantity: number;
}

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=') as [string, string]));
  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

Deno.serve(async (req) => {
  const payload = await req.text();
  const signatureHeader = req.headers.get('stripe-signature');

  if (!signatureHeader || !(await verifyStripeSignature(payload, signatureHeader, WEBHOOK_SECRET))) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(payload);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Idempotency guard: Stripe may retry webhook delivery.
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_checkout_session_id', session.id)
      .maybeSingle();

    if (!existingOrder) {
      const orderNumber = `KX-${Date.now().toString(36).toUpperCase()}`;

      // KORIX ships anywhere within the US. Checkout's own
      // shipping_address_collection[allowed_countries]=['US'] already blocks
      // non-US addresses at the UI level, so this is a defensive backstop,
      // not the primary enforcement — catches the edge case of a session
      // created some other way (e.g. directly via the API) bypassing that
      // UI restriction, and refunds/cancels rather than silently fulfilling.
      const shippingAddress = session.shipping_details?.address ?? null;
      const isUS = shippingAddress?.country === 'US';

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_email: session.customer_details?.email ?? '',
          customer_name: session.customer_details?.name ?? null,
          shipping_address: shippingAddress,
          billing_address: session.customer_details?.address ?? null,
          subtotal: (session.amount_subtotal ?? 0) / 100,
          shipping_cost: (session.total_details?.amount_shipping ?? 0) / 100,
          tax: (session.total_details?.amount_tax ?? 0) / 100,
          total: (session.amount_total ?? 0) / 100,
          status: isUS ? 'paid' : 'cancelled',
          cancellation_reason: isUS ? null : 'shipping_outside_us',
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent ?? null,
        })
        .select('id')
        .single();

      if (!orderError && order) {
        const cart: CartLine[] = JSON.parse(session.metadata?.cart ?? '[]');

        const lineItemsRes = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${session.id}/line_items?limit=100`,
          { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } }
        );
        const lineItemsData = await lineItemsRes.json();
        const stripeLines: Array<{ description?: string; amount_total?: number; quantity?: number }> =
          lineItemsData.data ?? [];

        for (let i = 0; i < cart.length; i++) {
          const cartLine = cart[i];
          const stripeLine = stripeLines[i];

          await supabase.from('order_items').insert({
            order_id: order.id,
            product_id: cartLine.productId,
            variant_id: cartLine.variantId,
            product_name_snapshot: stripeLine?.description ?? 'Product',
            sku_snapshot: '',
            unit_price: stripeLine ? (stripeLine.amount_total ?? 0) / 100 / (stripeLine.quantity || 1) : 0,
            quantity: cartLine.quantity,
            line_total: (stripeLine?.amount_total ?? 0) / 100,
          });

          // Non-US orders are being refunded, not fulfilled — never decrement stock for them.
          if (isUS && cartLine.variantId) {
            await supabase.rpc('decrement_variant_stock', {
              variant_id: cartLine.variantId,
              qty: cartLine.quantity,
            });
          }
        }

        if (!isUS && session.payment_intent) {
          await fetch('https://api.stripe.com/v1/refunds', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              payment_intent: session.payment_intent,
              reason: 'requested_by_customer',
              'metadata[cancellation_reason]': 'shipping_outside_us',
            }).toString(),
          });
        }
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
