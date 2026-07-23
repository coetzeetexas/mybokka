-- New Shipping & Packaging additions: recyclable kraft mailers + reinforced
-- kraft tape. Sourced against Uline's *public* retail site — no B2B account
-- access, same constraint as every prior batch. Uline's product pages
-- return HTTP 403 to automated fetches this session (blocked outright, not
-- just intermittent), so nothing here was read directly off a live Uline
-- page; everything below comes from search-engine snippets of Uline's own
-- listing text (material/spec descriptions) plus third-party reseller
-- listings (for case-pack sizes and one anchor price).
--
-- STATUS: 7 of 8 products are now 'active' with real Uline case-price
-- tables (screenshots), confirmed and applied here: S-26297, S-26008,
-- S-24792, S-24791, S-24793, S-2350, S-24492. Only the custom-print
-- tape (no fixed SKU — priced per order, not a case lookup) is still
-- 'draft' with an ESTIMATED floor price.
-- CONFIRMED = read directly off Uline's own case-price table (screenshot
-- or page). ESTIMATED = scaled/inferred, not confirmed on a live page.
--
-- KX-SS-### continues the Shipping Supplies SKU sequence from KX-SS-009.

-- CONFIRMED directly from Uline's own case-price table (screenshot):
-- outside 14 x 16", inside 13 x 16", bag #6, qty/case 350 (NOT 100 as
-- originally estimated), 34 lbs/case (also far off the earlier 16 lb
-- guess), price per case $121 (1) / $116 (3) / $111 (5) / $106 (10+).
-- base_price at the ~45% markup convention (121 x 1.45 = 175.45).
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-paper-mailers-6-14x16-case-350',
  'Kraft Recyclable Paper Mailers #6, 14 x 16", Case of 350',
  'Double-wall 40 lb. kraft paper with a self-seal adhesive strip that closes instantly — no tape needed. Non-padded and lightweight, so it ships cheaper than a padded mailer when the contents don''t need cushioning. Fully curbside recyclable.',
  '14 x 16" kraft paper mailer, non-padded, self-seal, case of 350.',
  id, 175.45, 'KX-SS-010', 'S-26297', 34, 'active'
from categories where slug = 'shipping-packaging';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 168.20), (5, 160.95), (10, 153.70)) as t(min_quantity, unit_price)
where slug = 'kraft-recyclable-paper-mailers-6-14x16-case-350';

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
-- CONFIRMED directly from Uline's own case-price table (screenshot):
-- outside 7 x 9", inside 6 x 9", bag #0, qty/case 300 (NOT 100 as
-- originally estimated), 10 lbs/case, price per case $81 (1) / $79 (3)
-- / $76 (5) / $72 (10+). base_price at the ~45% markup convention
-- (81 x 1.45 = 117.45).
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-padded-mailers-0-7x9-case-300',
  'Kraft Recyclable Padded Mailers #0, 7 x 9", Case of 300',
  'Double-wall 40 lb. kraft paper with lightweight padding for postal savings — sized for small soft goods, phone accessories, and other items too delicate for a flat mailer but too small to need heavy cushioning. Curbside recyclable.',
  '7 x 9" kraft padded mailer, case of 300.',
  id, 117.45, 'KX-SS-011', 'S-26008', 10, 'active'
from categories where slug = 'shipping-packaging';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 114.55), (5, 110.20), (10, 104.40)) as t(min_quantity, unit_price)
where slug = 'kraft-recyclable-padded-mailers-0-7x9-case-300';

-- CONFIRMED directly from Uline's own case-price table (screenshot):
-- outside 12 x 9", inside 11 x 9", bag #2, long-side opening, qty/case
-- 100, 7 lbs/case, price per case $40 (1) / $39 (3) / $37 (5) / $34
-- (10+). base_price uses the qty-1 case price at the ~45% markup
-- convention (40 x 1.45 = 58.00).
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-padded-mailers-2-12x9-case-100',
  'Kraft Recyclable Padded Mailers #2, 12 x 9", Case of 100',
  'Double-wall 40 lb. kraft paper with lightweight padding for postal savings — a standard size for books, small soft goods, and phone accessories. Long-side opening. Curbside recyclable.',
  '12 x 9" kraft padded mailer, long-side opening, case of 100.',
  id, 58.00, 'KX-SS-012', 'S-24791', 7, 'active'
from categories where slug = 'shipping-packaging';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 56.55), (5, 53.65), (10, 49.30)) as t(min_quantity, unit_price)
where slug = 'kraft-recyclable-padded-mailers-2-12x9-case-100';

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

-- CONFIRMED directly from Uline's own case-price table (screenshot):
-- outside 14 x 18", inside 12 3/4 x 18", bag #6, qty/case 50 (NOT 100 —
-- corrects the earlier estimate, which also had weight off by 4.5x),
-- 8 lbs/case, price per case $40 (1) / $39 (3) / $37 (5) / $34 (10+).
-- base_price at the ~45% markup convention (40 x 1.45 = 58.00).
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'kraft-recyclable-padded-mailers-6-14x18-case-50',
  'Kraft Recyclable Padded Mailers #6, 14 x 18", Case of 50',
  'The largest size in our recyclable padded mailer line — double-wall 40 lb. kraft paper with lightweight padding, for bulkier soft goods that still don''t need a rigid box. Curbside recyclable.',
  '14 x 18" kraft padded mailer, case of 50.',
  id, 58.00, 'KX-SS-014', 'S-24793', 8, 'active'
from categories where slug = 'shipping-packaging';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 56.55), (5, 53.65), (10, 49.30)) as t(min_quantity, unit_price)
where slug = 'kraft-recyclable-padded-mailers-6-14x18-case-50';

-- ── Industrial Reinforced Kraft Tape ─────────────────────────────────────
-- Material/use-case CONFIRMED (fiberglass-reinforced kraft, water-
-- activated adhesive, recommended for 40-60 lb. boxes — Uline's own
-- product description). Grade #260 and rolls/case CONFIRMED via Uline's
-- own case-price table (screenshot) for both SKUs — case of 8 for the
-- 375' roll (corrects the earlier 10-roll estimate), case of 10 for the
-- 450' roll (matches the earlier estimate). Weight per roll/case is
-- still ESTIMATED — Uline's spec table doesn't list a weight column for
-- tape, only for the mailers.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'industrial-reinforced-kraft-tape-3x375-case-8',
  'Industrial Reinforced Kraft Tape, 3" x 375'', Case of 8 Rolls',
  'Fiberglass-reinforced kraft paper with a water-activated adhesive that bonds to corrugated even in dusty or dirty warehouse conditions — recommended for sealing 40-60 lb. boxes with a single pass. Requires a water-activated tape dispenser (sold separately).',
  '3" x 375'' fiberglass-reinforced kraft tape, grade #260, water-activated, case of 8 rolls.',
  id, 147.90, 'KX-SS-015', 'S-2350', 23, 'active'
from categories where slug = 'shipping-packaging';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 142.10), (6, 134.85), (10, 129.05)) as t(min_quantity, unit_price)
where slug = 'industrial-reinforced-kraft-tape-3x375-case-8';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'industrial-reinforced-kraft-tape-3x450-black-case-10',
  'Industrial Reinforced Kraft Tape, 3" x 450", Black, Case of 10 Rolls',
  'Same fiberglass-reinforced, water-activated kraft tape as our 375'' roll, in a longer 450'' length and black finish for tamper-evident or brand-differentiated sealing. Requires a water-activated tape dispenser (sold separately).',
  '3" x 450'' fiberglass-reinforced kraft tape, grade #260, black, water-activated, case of 10 rolls.',
  id, 278.40, 'KX-SS-016', 'S-24492', 34, 'active'
from categories where slug = 'shipping-packaging';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 266.80), (6, 255.20), (10, 243.60)) as t(min_quantity, unit_price)
where slug = 'industrial-reinforced-kraft-tape-3x450-black-case-10';

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
  (values ('Outside Dimensions', '14 x 16"', 1), ('Inside Dimensions', '13 x 16"', 2), ('Material', 'Double-wall 40 lb. kraft paper', 3), ('Style', 'Non-padded, self-seal', 4), ('Bundle Quantity', '350 mailers', 5), ('Recyclable', 'Curbside recyclable', 6)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-paper-mailers-6-14x16-case-350';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Outside Dimensions', '7 x 9"', 1), ('Inside Dimensions', '6 x 9"', 2), ('Material', 'Double-wall 40 lb. kraft paper, padded', 3), ('Bundle Quantity', '300 mailers', 4), ('Recyclable', 'Curbside recyclable', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-padded-mailers-0-7x9-case-300';

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
  (values ('Outside Dimensions', '14 x 18"', 1), ('Inside Dimensions', '12 3/4 x 18"', 2), ('Material', 'Double-wall 40 lb. kraft paper, padded', 3), ('Bundle Quantity', '50 mailers', 4), ('Recyclable', 'Curbside recyclable', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'kraft-recyclable-padded-mailers-6-14x18-case-50';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '3" x 375''', 1), ('Grade', '#260', 2), ('Material', 'Fiberglass-reinforced kraft paper', 3), ('Adhesive', 'Water-activated', 4), ('Recommended For', '40-60 lb. boxes', 5), ('Bundle Quantity', '8 rolls', 6)) as s(spec_name, spec_value, sort_order)
where slug = 'industrial-reinforced-kraft-tape-3x375-case-8';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '3" x 450"', 1), ('Color', 'Black', 2), ('Grade', '#260', 3), ('Material', 'Fiberglass-reinforced kraft paper', 4), ('Adhesive', 'Water-activated', 5), ('Bundle Quantity', '10 rolls', 6)) as s(spec_name, spec_value, sort_order)
where slug = 'industrial-reinforced-kraft-tape-3x450-black-case-10';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Minimum Order', '6 cases', 1), ('Plate Charge', '~$50 (1 color) / ~$75 (2 colors), one-time', 2), ('Pricing', 'Quoted per order — see Request a Quote', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'custom-printed-kraft-tape';

-- PSC classification, verified against real FSC definitions (not the
-- earlier assumption that everything here is 8135):
--   8105 - Bags and Sacks explicitly covers "Shipping and Protective
--     Envelopes" (confirmed via a real matching NSN: "Packing List
--     Envelope" filed under FSC 8105) — the 5 mailer products belong
--     here, not 8135.
--   8135 - Packaging and Packing Bulk Materials explicitly lists gummed
--     paper tape as an example — the 2 tape products and the custom-
--     print tape correctly stay under 8135.
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '8105 - Bags and Sacks', 99
from products
where slug in (
  'kraft-recyclable-paper-mailers-6-14x16-case-350',
  'kraft-recyclable-padded-mailers-0-7x9-case-300',
  'kraft-recyclable-padded-mailers-2-12x9-case-100',
  'kraft-recyclable-padded-mailers-5-12x15-case-100',
  'kraft-recyclable-padded-mailers-6-14x18-case-50'
);

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '8135 - Packaging and Packing Bulk Materials', 99
from products
where slug in (
  'industrial-reinforced-kraft-tape-3x375-case-8',
  'industrial-reinforced-kraft-tape-3x450-black-case-10',
  'custom-printed-kraft-tape'
);

-- ── Images ────────────────────────────────────────────────────────────
-- AI-generated product photography (marketing_studio_image), uploaded
-- to the product-images bucket with filenames matching each slug.
insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || v.image_file || '.png',
  name, 1, true
from products,
  (values
    ('kraft-recyclable-paper-mailers-6-14x16-case-350', 'kraft-recyclable-paper-mailers-6-14x16-case-350'),
    ('kraft-recyclable-padded-mailers-0-7x9-case-300', 'kraft-recyclable-padded-mailers-0-7x9-case-300'),
    ('kraft-recyclable-padded-mailers-2-12x9-case-100', 'kraft-recyclable-padded-mailers-2-12x9-case-100'),
    ('kraft-recyclable-padded-mailers-5-12x15-case-100', 'kraft-recyclable-padded-mailers-5-12x15-case-100'),
    ('kraft-recyclable-padded-mailers-6-14x18-case-50', 'kraft-recyclable-padded-mailers-6-14x18-case-50'),
    ('industrial-reinforced-kraft-tape-3x375-case-8', 'industrial-reinforced-kraft-tape-3x375-case-8'),
    ('industrial-reinforced-kraft-tape-3x450-black-case-10', 'industrial-reinforced-kraft-tape-3x450-black-case-10'),
    ('custom-printed-kraft-tape', 'custom-printed-kraft-tape')
  ) as v(slug, image_file)
where products.slug = v.slug;
