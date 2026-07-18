// Supabase Edge Function (Deno). Deploy with: supabase functions deploy sync-stripe-catalog
// Mirrors active Supabase products into Stripe Products/Prices for Dashboard
// visibility and reporting. Not used by checkout itself — create-checkout-session
// always re-validates price from the products table directly, so this sync
// being stale or not yet run never affects what a customer is actually charged.
//
// Invoke manually after adding/changing products:
//   supabase functions invoke sync-stripe-catalog --project-ref <ref>
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function stripeRequest(path: string, params: URLSearchParams) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? `Stripe request to ${path} failed`);
  return data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, name, sku, base_price, status, stripe_product_id, stripe_price_id')
    .eq('status', 'active');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  let created = 0;
  let updated = 0;
  const errors: { slug: string; error: string }[] = [];

  for (const product of products ?? []) {
    try {
      const unitAmount = Math.round(Number(product.base_price) * 100);
      let stripeProductId = product.stripe_product_id as string | null;

      if (!stripeProductId) {
        const stripeProduct = await stripeRequest(
          'products',
          new URLSearchParams({
            name: product.name,
            'metadata[supabase_id]': product.id,
            'metadata[sku]': product.sku,
          })
        );
        stripeProductId = stripeProduct.id;
      } else {
        await stripeRequest(`products/${stripeProductId}`, new URLSearchParams({ name: product.name }));
      }

      // Stripe Prices are immutable — create a new one whenever the amount
      // differs from what's on record, rather than trying to edit in place.
      let stripePriceId = product.stripe_price_id as string | null;
      let needsNewPrice = !stripePriceId;

      if (stripePriceId) {
        const existingPrice = await fetch(`https://api.stripe.com/v1/prices/${stripePriceId}`, {
          headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
        }).then((r) => r.json());
        if (existingPrice.unit_amount !== unitAmount) needsNewPrice = true;
      }

      if (needsNewPrice && stripeProductId) {
        const price = await stripeRequest(
          'prices',
          new URLSearchParams({
            product: stripeProductId,
            currency: 'usd',
            unit_amount: String(unitAmount),
          })
        );
        stripePriceId = price.id;
      }

      await supabase
        .from('products')
        .update({ stripe_product_id: stripeProductId, stripe_price_id: stripePriceId })
        .eq('id', product.id);

      if (!product.stripe_product_id) created++;
      else updated++;
    } catch (err) {
      errors.push({ slug: product.slug, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  return new Response(JSON.stringify({ created, updated, total: products?.length ?? 0, errors }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
