// Supabase Edge Function (Deno). Deploy with: supabase functions deploy create-checkout-session
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, SITE_URL
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://korixllc.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartLine {
  productId: string;
  variantId: string | null;
  quantity: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { items } = (await req.json()) as { items: CartLine[] };
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Re-validate every price server-side — the client's submitted prices are never trusted.
    const validatedLines: { name: string; unitAmountCents: number; quantity: number }[] = [];

    for (const line of items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, base_price, status')
        .eq('id', line.productId)
        .eq('status', 'active')
        .single();

      if (productError || !product) {
        return new Response(JSON.stringify({ error: `Product ${line.productId} is unavailable` }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      let unitPrice = Number(product.base_price);
      let variantName: string | null = null;

      if (line.variantId) {
        const { data: variant, error: variantError } = await supabase
          .from('product_variants')
          .select('id, name, price_override, stock_quantity')
          .eq('id', line.variantId)
          .eq('product_id', line.productId)
          .single();

        if (variantError || !variant) {
          return new Response(JSON.stringify({ error: `Variant ${line.variantId} is unavailable` }), {
            status: 400,
            headers: corsHeaders,
          });
        }
        if (variant.stock_quantity < line.quantity) {
          return new Response(
            JSON.stringify({ error: `${product.name} (${variant.name}) does not have enough stock` }),
            { status: 400, headers: corsHeaders }
          );
        }
        unitPrice = variant.price_override ?? unitPrice;
        variantName = variant.name;
      }

      validatedLines.push({
        name: variantName ? `${product.name} — ${variantName}` : product.name,
        unitAmountCents: Math.round(unitPrice * 100),
        quantity: line.quantity,
      });
    }

    // Build the Checkout Session via Stripe's REST API directly (no SDK dependency,
    // avoids Deno npm-import resolution issues in the edge runtime).
    const params = new URLSearchParams();
    params.set('mode', 'payment');
    params.set('success_url', `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    params.set('cancel_url', `${SITE_URL}/checkout/cancel`);
    params.set('shipping_address_collection[allowed_countries][0]', 'US');
    // Generates a formal Stripe Invoice PDF for every paid order, in addition
    // to Stripe's standard payment receipt email.
    params.set('invoice_creation[enabled]', 'true');
    // NOTE: automatic_tax is intentionally NOT enabled. KORIX is not currently
    // registered to collect sales tax anywhere — do not add
    // `params.set('automatic_tax[enabled]', 'true')` back until that's actually
    // true. (Also, separately, Stripe requires a head office address under
    // Settings > Tax before it will even create a Checkout Session with tax
    // enabled — confirmed by testing — but the registration question comes first.)
    // Cart line references are carried in metadata so the webhook can reconcile
    // order_items and decrement stock without re-trusting client input.
    params.set('metadata[cart]', JSON.stringify(items));

    validatedLines.forEach((line, i) => {
      params.set(`line_items[${i}][quantity]`, String(line.quantity));
      params.set(`line_items[${i}][price_data][currency]`, 'usd');
      params.set(`line_items[${i}][price_data][unit_amount]`, String(line.unitAmountCents));
      params.set(`line_items[${i}][price_data][product_data][name]`, line.name);
    });

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      return new Response(JSON.stringify({ error: session.error?.message ?? 'Stripe error' }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
