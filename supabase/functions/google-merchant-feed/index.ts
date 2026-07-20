// Supabase Edge Function (Deno). Deploy with:
//   supabase functions deploy google-merchant-feed --no-verify-jwt
// Public, unauthenticated GET endpoint — Google's Merchant Center fetcher
// hits this URL directly on a schedule, the same way it would fetch a feed
// file hosted anywhere else. Register it in Merchant Center under
// Products > Feeds > add feed > Scheduled fetch, using this function's URL.
//
// KORIX ships anywhere within the US (see create-checkout-session /
// stripe-webhook). Merchant Center's shipping settings (Settings > Shipping
// and delivery) should be configured for nationwide US shipping to match.
//
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_URL
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://korixllc.com';

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface FeedProduct {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  brand_description: string | null;
  base_price: string;
  sku: string;
  category: { name: string } | null;
  product_images: { url: string; is_primary: boolean; sort_order: number }[];
  product_variants: { stock_quantity: number }[];
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: products, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, short_description, brand_description, base_price, sku, category:categories(name), product_images(url, is_primary, sort_order), product_variants(stock_quantity)'
    )
    .eq('status', 'active');

  if (error) {
    return new Response(`Feed generation failed: ${error.message}`, { status: 500 });
  }

  const items = ((products ?? []) as unknown as FeedProduct[])
    .map((product) => {
      const image =
        product.product_images.find((img) => img.is_primary) ??
        product.product_images.slice().sort((a, b) => a.sort_order - b.sort_order)[0];
      if (!image) return null; // Google requires an image; skip products that don't have one yet.

      // Mirrors ProductDetailPage's inStock logic: no variants means the
      // product itself isn't stock-tracked and is treated as available.
      const inStock =
        product.product_variants.length === 0 || product.product_variants.some((v) => v.stock_quantity > 0);

      const description = product.short_description ?? product.brand_description ?? product.name;
      const price = Number(product.base_price).toFixed(2);

      return `
    <item>
      <g:id>${xmlEscape(product.sku)}</g:id>
      <title>${xmlEscape(product.name)}</title>
      <description><![CDATA[${description}]]></description>
      <link>${xmlEscape(`${SITE_URL}/product/${product.slug}`)}</link>
      <g:image_link>${xmlEscape(image.url)}</g:image_link>
      <g:availability>${inStock ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${price} USD</g:price>
      <g:condition>new</g:condition>
      <g:brand>KORIX LLC</g:brand>
      <g:identifier_exists>false</g:identifier_exists>${
        product.category ? `\n      <g:product_type>${xmlEscape(product.category.name)}</g:product_type>` : ''
      }
    </item>`;
    })
    .filter(Boolean)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>KORIX LLC Product Feed</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <description>Quality-vetted industrial and specialty goods from KORIX LLC.</description>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});
