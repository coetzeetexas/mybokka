-- New Shipping & Packaging additions: recyclable kraft mailers + reinforced
-- kraft tape. Sourced against Uline's *public* retail site — no B2B account
-- access, same constraint as every prior batch. Uline's product pages
-- return HTTP 403 to automated fetches this session (blocked outright, not
-- just intermittent), so nothing here was read directly off a live Uline
-- page; everything below comes from search-engine snippets of Uline's own
-- listing text (material/spec descriptions) plus third-party reseller
-- listings (for case-pack sizes and one anchor price).
--
-- STATUS IS INTENTIONALLY 'draft', NOT 'active' (unlike prior batches) —
-- case quantities, weights, and prices below are ESTIMATES, not confirmed
-- Uline pricing, and this batch has more unverified numbers than usual.
-- Flip each row to 'active' in Supabase Studio once you've checked the
-- real case size / price / weight on uline.com or your Uline account.
-- CONFIRMED = came from Uline's own page text via search snippet.
-- ESTIMATED = scaled/inferred, not read directly off Uline's page.
--
-- KX-SS-### continues the Shipping Supplies SKU sequence from KX-SS-009.

-- ── Kraft Recyclable Paper Mailers ──────────────────────────────────────
-- Material/format CONFIRMED (double-wall 40 lb. kraft, non-padded,
-- self-seal — Uline's own product description). Case qty (100),
-- weight, and price are ESTIMATED — no case-pack or pricing data found
-- for this specific SKU.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-paper-mailers-6-14x16-case-100',
  'Kraft Recyclable Paper Mailers #6, 14 x 16", Case of 100',
  'Double-wall 40 lb. kraft paper with a self-seal adhesive strip that closes instantly — no tape needed. Non-padded and lightweight, so it ships cheaper than a padded mailer when the contents don''t need cushioning. Fully curbside recyclable.',
  '14 x 16" kraft paper mailer, non-padded, self-seal, case of 100.',
  id, 44.99, 'KX-SS-010', 'S-26297', 16, 'draft'
from categories where slug = 'shipping-packaging';

-- ── Kraft Recyclable Padded Mailers ──────────────────────────────────────
-- Material CONFIRMED (double-wall 40 lb. kraft, padded — Uline's own
-- product description). Case qty of 100 CONFIRMED for the #2 size via a
-- reseller listing (Iron Acres Sales / eBay, "Case of 100") — assumed
-- consistent across sibling sizes in the same line, not individually
-- confirmed for #0, #5, or #6 (the #5 size, S-24792, is now separately
-- CONFIRMED at qty 100 too — see below). Weight and price for #0/#2/#6
-- ESTIMATED by scaling from the #2 size's reseller retail price (which
-- already includes reseller margin, so treated as a ceiling reference,
-- not a wholesale cost — same discipline as the S-423 tape estimate in
-- the prior batch).
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-padded-mailers-0-7x9-case-100',
  'Kraft Recyclable Padded Mailers #0, 7 x 9", Case of 100',
  'Double-wall 40 lb. kraft paper with lightweight padding for postal savings — sized for small soft goods, phone accessories, and other items too delicate for a flat mailer but too small to need heavy cushioning. Curbside recyclable.',
  '7 x 9" kraft padded mailer, case of 100.',
  id, 32.99, 'KX-SS-011', 'S-26008', 11, 'draft'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-padded-mailers-2-12x9-case-100',
  'Kraft Recyclable Padded Mailers #2, 12 x 9", Case of 100',
  'Double-wall 40 lb. kraft paper with lightweight padding for postal savings — a standard size for books, small soft goods, and phone accessories. Curbside recyclable.',
  '12 x 9" kraft padded mailer, case of 100.',
  id, 45.99, 'KX-SS-012', 'S-24791', 18, 'draft'
from categories where slug = 'shipping-packaging';

-- CONFIRMED directly from Uline's own case-price table (screenshot):
-- outside 12 x 15", inside 10 3/4 x 15", bag #5, qty/case 100,
-- 11 lbs/case, price per case $58 (1) / $56 (3) / $54 (5) / $51 (10+).
-- base_price uses the qty-1 case price ($58) at the catalog's ~45%
-- markup convention (58 x 1.45 = 84.10); the 3/5/10+ case-price breaks
-- become bulk pricing tiers below at the same markup. Status flipped to
-- 'active' since these numbers are real, not estimated.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-padded-mailers-5-12x15-case-100',
  'Kraft Recyclable Padded Mailers #5, 12 x 15", Case of 100',
  'Same double-wall 40 lb. kraft paper and lightweight padding as our #2 mailer, sized up for larger soft goods that need more room without stepping up to a bulkier box. Curbside recyclable.',
  '12 x 15" kraft padded mailer, case of 100.',
  id, 84.10, 'KX-SS-013', 'S-24792', 11, 'active'
from categories where slug = 'shipping-packaging';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 81.20), (5, 78.30), (10, 73.95)) as t(min_quantity, unit_price)
where slug = 'kraft-recyclable-padded-mailers-5-12x15-case-100';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-padded-mailers-6-14x18-case-100',
  'Kraft Recyclable Padded Mailers #6, 14 x 18", Case of 100',
  'The largest size in our recyclable padded mailer line — double-wall 40 lb. kraft paper with lightweight padding, for bulkier soft goods that still don''t need a rigid box. Curbside recyclable.',
  '14 x 18" kraft padded mailer, case of 100.',
  id, 109.99, 'KX-SS-014', 'S-24793', 36, 'draft'
from categories where slug = 'shipping-packaging';

-- ── Industrial Reinforced Kraft Tape ─────────────────────────────────────
-- Material/use-case CONFIRMED (fiberglass-reinforced kraft, water-
-- activated adhesive, recommended for 40-60 lb. boxes — Uline's own
-- product description). Case size of 10 rolls is ESTIMATED (a common
-- Uline case size for this tape referenced by a reseller, not confirmed
-- on Uline's own page for this exact SKU). Weight and price ESTIMATED.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'industrial-reinforced-kraft-tape-3x375-case-10',
  'Industrial Reinforced Kraft Tape, 3" x 375'', Case of 10 Rolls',
  'Fiberglass-reinforced kraft paper with a water-activated adhesive that bonds to corrugated even in dusty or dirty warehouse conditions — recommended for sealing 40-60 lb. boxes with a single pass. Requires a water-activated tape dispenser (sold separately).',
  '3" x 375'' fiberglass-reinforced kraft tape, water-activated, case of 10 rolls.',
  id, 149.99, 'KX-SS-015', 'S-2350', 29, 'draft'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'industrial-reinforced-kraft-tape-3x450-black-case-10',
  'Industrial Reinforced Kraft Tape, 3" x 450", Black, Case of 10 Rolls',
  'Same fiberglass-reinforced, water-activated kraft tape as our 375'' roll, in a longer 450'' length and black finish for tamper-evident or brand-differentiated sealing. Requires a water-activated tape dispenser (sold separately).',
  '3" x 450'' fiberglass-reinforced kraft tape, black, water-activated, case of 10 rolls.',
  id, 179.99, 'KX-SS-016', 'S-24492', 34, 'draft'
from categories where slug = 'shipping-packaging';

-- ── Custom Printed Kraft Tape ─────────────────────────────────────────────
-- Not a standard case-priced SKU — Uline prints this to order once a
-- buyer supplies artwork/ink colors, so there's no single fixed case
-- price. Minimum order (6 cases) and 1-color/2-color plate charges are
-- VENDOR-QUOTED figures found via search (a third-party post referencing
-- Uline's own custom-tape ordering page), not independently confirmed by
-- reading that page directly this session — treat as a starting point to
-- verify, not a locked-in cost. base_price below is a rough floor
-- (6-case minimum at our unprinted tape's per-case rate, plus the 1-color
-- plate charge) — NOT a real quote. This product should route buyers to
-- the Request a Quote / PO form rather than instant checkout, since the
-- real price depends on colors/artwork chosen; the product page copy
-- says so explicitly.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'custom-printed-kraft-tape',
  'Custom Printed Kraft Tape',
  'Your logo or brand name printed directly on reinforced kraft tape — turns every box into a branded touchpoint instead of a plain shipment. Ink color, artwork, and case quantity are quoted per order; a one-time plate charge applies for new artwork (roughly $50 for 1 color, $75 for 2 colors, per Uline''s standard custom-tape program). Minimum order is 6 cases. Submit your logo and preferred ink color through our Request a Quote form for an exact price.',
  'Custom-printed reinforced kraft tape, ink color and artwork to order. 6-case minimum. Price is a starting estimate — confirm via Request a Quote.',
  id, 649.99, 'KX-SS-017', null, 175, 'draft'
from categories where slug = 'shipping-packaging';

-- ── Specs ─────────────────────────────────────────────────────────────
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '14 x 16"', 1), ('Material', 'Double-wall 40 lb. kraft paper', 2), ('Style', 'Non-padded, self-seal', 3), ('Bundle Quantity', '100 mailers', 4), ('Recyclable', 'Curbside recyclable', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-paper-mailers-6-14x16-case-100';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '7 x 9"', 1), ('Material', 'Double-wall 40 lb. kraft paper, padded', 2), ('Bundle Quantity', '100 mailers', 3), ('Recyclable', 'Curbside recyclable', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-padded-mailers-0-7x9-case-100';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '12 x 9"', 1), ('Material', 'Double-wall 40 lb. kraft paper, padded', 2), ('Bundle Quantity', '100 mailers', 3), ('Recyclable', 'Curbside recyclable', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-padded-mailers-2-12x9-case-100';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Outside Dimensions', '12 x 15"', 1), ('Inside Dimensions', '10 3/4 x 15"', 2), ('Material', 'Double-wall 40 lb. kraft paper, padded', 3), ('Bundle Quantity', '100 mailers', 4), ('Recyclable', 'Curbside recyclable', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-padded-mailers-5-12x15-case-100';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '14 x 18"', 1), ('Material', 'Double-wall 40 lb. kraft paper, padded', 2), ('Bundle Quantity', '100 mailers', 3), ('Recyclable', 'Curbside recyclable', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-padded-mailers-6-14x18-case-100';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '3" x 375''', 1), ('Material', 'Fiberglass-reinforced kraft paper', 2), ('Adhesive', 'Water-activated', 3), ('Recommended For', '40-60 lb. boxes', 4), ('Bundle Quantity', '10 rolls', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'industrial-reinforced-kraft-tape-3x375-case-10';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '3" x 450"', 1), ('Color', 'Black', 2), ('Material', 'Fiberglass-reinforced kraft paper', 3), ('Adhesive', 'Water-activated', 4), ('Bundle Quantity', '10 rolls', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'industrial-reinforced-kraft-tape-3x450-black-case-10';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Minimum Order', '6 cases', 1), ('Plate Charge', '~$50 (1 color) / ~$75 (2 colors), one-time', 2), ('Pricing', 'Quoted per order — see Request a Quote', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'custom-printed-kraft-tape';

-- PSC 8135 (Packaging and Packing Bulk Materials) covers gummed/kraft
-- tape and mailers explicitly — same code used for the prior packaging
-- batch (see 20260727000000_psc_for_new_products.sql).
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '8135 - Packaging and Packing Bulk Materials', 99
from products
where slug in (
  'kraft-recyclable-paper-mailers-6-14x16-case-100',
  'kraft-recyclable-padded-mailers-0-7x9-case-100',
  'kraft-recyclable-padded-mailers-2-12x9-case-100',
  'kraft-recyclable-padded-mailers-5-12x15-case-100',
  'kraft-recyclable-padded-mailers-6-14x18-case-100',
  'industrial-reinforced-kraft-tape-3x375-case-10',
  'industrial-reinforced-kraft-tape-3x450-black-case-10',
  'custom-printed-kraft-tape'
);

-- No product_images rows here — see note in the commit message: no live
-- Supabase credentials in this session to generate + upload photography
-- or storage-bucket URLs. Add images the same way prior batches did
-- (generate, upload to the product-images bucket, insert into
-- product_images) once you can run this migration against the real
-- project.
