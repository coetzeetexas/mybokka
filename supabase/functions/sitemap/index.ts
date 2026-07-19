// Supabase Edge Function (Deno). Deploy with:
//   supabase functions deploy sitemap --no-verify-jwt
// Public, unauthenticated GET endpoint. Proxied to https://korixllc.com/sitemap.xml
// via a rule in public/_redirects — the static sitemap.xml this replaced
// had zero product or category URLs and couldn't stay in sync as the
// catalog changes; this queries the live DB on every request instead.
//
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_URL
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://korixllc.com';

function xmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry(loc: string, changefreq: string, priority: string, lastmod?: string) {
  return `
  <url>
    <loc>${xmlEscape(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('slug, updated_at, created_at').eq('status', 'active'),
    supabase.from('categories').select('slug').order('sort_order', { ascending: true }),
  ]);

  const staticPages = [
    urlEntry(`${SITE_URL}/`, 'weekly', '1.0'),
    urlEntry(`${SITE_URL}/shop`, 'daily', '0.9'),
    urlEntry(`${SITE_URL}/about`, 'monthly', '0.5'),
    urlEntry(`${SITE_URL}/shipping-returns`, 'monthly', '0.5'),
    urlEntry(`${SITE_URL}/faq`, 'monthly', '0.5'),
    urlEntry(`${SITE_URL}/terms`, 'yearly', '0.2'),
    urlEntry(`${SITE_URL}/privacy`, 'yearly', '0.2'),
    urlEntry(`${SITE_URL}/cookies`, 'yearly', '0.2'),
  ].join('');

  const categoryPages = (categories ?? [])
    .map((c) => urlEntry(`${SITE_URL}/shop/${c.slug}`, 'daily', '0.8'))
    .join('');

  const productPages = (products ?? [])
    .map((p) => {
      const lastmod = (p.updated_at ?? p.created_at)?.slice(0, 10);
      return urlEntry(`${SITE_URL}/product/${p.slug}`, 'weekly', '0.7', lastmod);
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticPages}${categoryPages}${productPages}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});
