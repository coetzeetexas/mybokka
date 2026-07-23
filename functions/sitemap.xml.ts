// Cloudflare Pages Function for /sitemap.xml
//
// Root cause: public/_redirects previously tried to proxy /sitemap.xml
// straight to the Supabase Edge Function using a 200 rewrite:
//   /sitemap.xml  https://<project>.supabase.co/functions/v1/sitemap  200
// Cloudflare Pages' _redirects only supports proxying to relative,
// same-site destinations -- it cannot proxy an external domain. That rule
// silently failed to match, so every request fell through to the SPA
// catch-all (/*  /index.html  200) and crawlers/browsers got the HTML
// shell instead of XML. Confirmed against Cloudflare's own docs: "Proxying
// will only support relative URLs on your site. You cannot proxy external
// domains."
//
// A Pages Function runs server-side and can fetch any origin, which is the
// supported way to do this. Functions also take priority over _redirects,
// so this now handles the route directly.

export const onRequestGet: PagesFunction = async () => {
  const upstream = await fetch(
    "https://gkngsxutwsyqpcudwbof.supabase.co/functions/v1/sitemap"
  );

  const body = await upstream.text();

  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
