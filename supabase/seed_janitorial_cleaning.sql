-- New category: Janitorial & Cleaning Supplies. Sourced from the same real
-- Uline Spring/Summer 2026 print catalog pages the user uploaded and used
-- to cross-verify the rest of the catalog this session (facts only,
-- rewritten into original KORIX copy — no supplier marketing text or
-- photography reproduced, and no supplier name in any customer-facing
-- text, matching the rest of the catalog).
--
-- PSC codes verified against real Federal Supply Classification definitions
-- (not guessed): 7920 - Brooms, Brushes, Mops, and Sponges (cleaning tools/
-- kits) and 7930 - Cleaning and Polishing Compounds and Preparations
-- (Floor Science liquids) — both under FSG 79, Cleaning Equipment and
-- Supplies.
--
-- Pricing: base_price = confirmed per-case (or per-unit, where sold
-- individually) wholesale cost x the ~45% markup convention used
-- catalog-wide. CONFIRMED from the catalog's own price table for every
-- item below.
--
-- Weight: the catalog's price tables for this batch did NOT include a
-- LBS./CASE column (unlike the shipping-box and mailer tables earlier this
-- session) — every weight_lbs value below is an ESTIMATE (typical weight
-- for the item/case size), not read off a confirmed source. Flagged here,
-- not silently presented as verified; worth confirming actual shipping
-- weight before these carry meaningful order volume.
--
-- No product_images rows included — no rights to the supplier's own
-- photography; the storefront already renders a graceful "No image"
-- placeholder until real photos are added.
-- Run after supabase/migrations/20260717000000_ecommerce_schema.sql.

insert into categories (slug, name, description, sort_order)
values ('janitorial-cleaning', 'Janitorial & Cleaning Supplies', 'Cleaning tools, kits, and floor-care compounds for recurring facility maintenance.', 5)
on conflict (slug) do nothing;

-- ── 5S Dry Zone Cleaning Tool Kit ────────────────────────────────────────
-- CONFIRMED: steel dust pan, standing dust pan, 2 standard angle brooms,
-- contractor push broom, black counter brush. $92 each (single price, no
-- volume tier in the source table). weight_lbs 15 CONFIRMED.
-- base_price = 92 x 1.45 = 133.40.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  '5s-dry-zone-cleaning-kit',
  '5S Dry Zone Cleaning Tool Kit',
  'A steel dust pan, standing dust pan, a pair of standard angle brooms, a contractor push broom, and a black counter brush — everything a facility crew needs for daily dry sweeping in one order, sized to hang on a 5S shadow board or stand on its own in a supply closet.',
  'Dry-cleaning tool kit: steel dust pan, standing dust pan, 2 angle brooms, contractor push broom, counter brush.',
  id, 133.40, 'KX-JC-001', 'H-8070', 15, 'active'
from categories where slug = 'janitorial-cleaning';

-- ── 5S Wet Zone Cleaning Tool Kit ────────────────────────────────────────
-- CONFIRMED: wet mop handle, wet mop head, 4" floor scraper, 6 spray
-- bottles, black scrub brush, bucket/wringer, dirty water bucket, wet
-- floor sign. $220 each (single price). weight_lbs 31 CONFIRMED.
-- base_price = 220 x 1.45 = 319.00.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  '5s-wet-zone-cleaning-kit',
  '5S Wet Zone Cleaning Tool Kit',
  'A full wet-mopping setup in one order: mop handle and head, bucket and wringer, a dirty-water bucket, a 4" floor scraper, six spray bottles, a scrub brush, and a wet floor sign. Built for recurring facility mopping without piecing the cart together item by item.',
  'Wet-cleaning tool kit: mop handle/head, bucket/wringer, scraper, 6 spray bottles, scrub brush, wet floor sign.',
  id, 319.00, 'KX-JC-002', 'H-9614', 31, 'active'
from categories where slug = 'janitorial-cleaning';

-- ── Corn Broom, 15" (Case of 2) ──────────────────────────────────────────
-- CONFIRMED: sold in case quantities, case size 2. Price per broom at
-- 2-3 / 6 / 12+ brooms ordered: $24 / $23 / $22 — modeled here as
-- "Case of 2" bundles, so those quantities map to 1 / 3 / 6 case-rows.
-- weight_lbs ESTIMATED (~2 lbs/broom).
-- base_price = (24 x 2) x 1.45 = 69.60.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'corn-broom-15in-case-2',
  'Corn Broom, 15", Case of 2',
  'A wide corn-fiber broom for garages, warehouses, and receiving docks where a push broom is overkill but a whisk broom is too small. Reaches into corners and along walls that flat-floor brooms miss.',
  '15" corn broom for rough surfaces and warehouse use, case of 2.',
  id, 69.60, 'KX-JC-003', 'H-11295', 4, 'active'
from categories where slug = 'janitorial-cleaning';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 66.70), (6, 63.80)) as t(min_quantity, unit_price)
where slug = 'corn-broom-15in-case-2';

-- ── Colored Push Broom, 24" ──────────────────────────────────────────────
-- CONFIRMED: angled polypropylene bristles, color-coded (reduces cross-
-- contamination risk), sold individually. Price at 1 / 3 / 6+: $51/$50/$49.
-- weight_lbs ESTIMATED (~3 lbs).
-- base_price = 51 x 1.45 = 73.95.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'colored-push-broom-24in',
  'Colored Push Broom, 24"',
  'Angled polypropylene bristles sweep dust and debris fast across open floor space. Available in distinct colors so a facility can color-code brooms by zone and cut the risk of cross-contamination between areas.',
  '24" push broom, color-coded, angled polypropylene bristles.',
  id, 73.95, 'KX-JC-004', 'H-3460', 3, 'active'
from categories where slug = 'janitorial-cleaning';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 72.50), (6, 71.05)) as t(min_quantity, unit_price)
where slug = 'colored-push-broom-24in';

-- ── Cotton Mop Head, 24 oz (Case of 6) ───────────────────────────────────
-- CONFIRMED: 4-ply looped cotton yarn, launderable/long-lasting, sold in
-- minimum quantities of 6. Price per head at 6/12/24+ heads: $13/$12/$11 —
-- modeled as "Case of 6" bundles (1/2/4 case-rows). weight_lbs ESTIMATED
-- (~1.5 lbs/head).
-- base_price = (13 x 6) x 1.45 = 113.10.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'cotton-mop-head-24oz-case-6',
  'Cotton Mop Head, 24 oz, Case of 6',
  '4-ply looped cotton yarn that won''t fray or tangle through repeated laundering — built to outlast the cheaper mop heads that shed strands after a few washes. Fits standard clamp-style mop handles.',
  '24 oz. launderable cotton mop head, case of 6.',
  id, 113.10, 'KX-JC-005', 'S-24701', 9, 'active'
from categories where slug = 'janitorial-cleaning';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (2, 104.40), (4, 95.70)) as t(min_quantity, unit_price)
where slug = 'cotton-mop-head-24oz-case-6';

-- ── Fiberglass Mop Handle, 60" (Gate Style) ──────────────────────────────
-- CONFIRMED: 60" fiberglass handle, gate (twist-and-release) clamp, sold
-- individually. Price at 1/3+: $19/$18. weight_lbs ESTIMATED (~2 lbs).
-- base_price = 19 x 1.45 = 27.55.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'fiberglass-mop-handle-60in',
  'Fiberglass Mop Handle, 60", Gate Style',
  'A lightweight, comfortable replacement handle with a twist-and-release gate clamp that fits standard cotton and microfiber mop heads. 60" length suits most commercial mopping without extra bending.',
  '60" fiberglass mop handle, gate clamp, fits standard mop heads.',
  id, 27.55, 'KX-JC-006', 'H-3741', 2, 'active'
from categories where slug = 'janitorial-cleaning';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (3, 26.10)) as t(min_quantity, unit_price)
where slug = 'fiberglass-mop-handle-60in';

-- ── Floor Science Cleaner, 1 Gal, Case of 4 ──────────────────────────────
-- CONFIRMED: 1 gal. bottles, 4/case. Price per bottle at 4/8+ bottles
-- ordered: $14/$13 — modeled as "Case of 4" bundles (1/2 case-rows).
-- weight_lbs ESTIMATED (~8.5 lbs/gal. liquid + jug, x4).
-- base_price = (14 x 4) x 1.45 = 81.20.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'floor-cleaner-1gal-case-4',
  'Floor Cleaner, 1 Gallon, Case of 4',
  'An all-purpose floor cleaner for daily maintenance on sealed hard floors — the everyday product in a floor-care program, ahead of an occasional strip-and-refinish. Concentrated 1-gallon bottles, sold by the case.',
  'All-purpose 1 gal. floor cleaner, case of 4.',
  id, 81.20, 'KX-JC-007', 'S-18933', 34, 'active'
from categories where slug = 'janitorial-cleaning';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (2, 75.40)) as t(min_quantity, unit_price)
where slug = 'floor-cleaner-1gal-case-4';

-- ── Floor Science Stripper, 1 Gal, Case of 4 ─────────────────────────────
-- CONFIRMED: 1 gal. bottles, 4/case. Price per bottle at 4/8+: $18/$17.
-- weight_lbs ESTIMATED (~8.5 lbs/gal. liquid + jug, x4).
-- base_price = (18 x 4) x 1.45 = 104.40.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'floor-stripper-1gal-case-4',
  'Floor Stripper, 1 Gallon, Case of 4',
  'A finish stripper for periodic floor-care resets — cuts through old wax and finish buildup ahead of a re-coat. Pairs with our Floor Cleaner and Spray Buff for a complete floor-care rotation. Concentrated 1-gallon bottles, sold by the case.',
  'Floor finish stripper, 1 gal., case of 4.',
  id, 104.40, 'KX-JC-008', 'S-18932', 34, 'active'
from categories where slug = 'janitorial-cleaning';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (2, 98.60)) as t(min_quantity, unit_price)
where slug = 'floor-stripper-1gal-case-4';

-- ── Floor Science Spray Buff, 1 Gal, Case of 4 ───────────────────────────
-- CONFIRMED: 1 gal. bottles, 4/case. Price per bottle at 4/8+: $23/$22.
-- weight_lbs ESTIMATED (~8.5 lbs/gal. liquid + jug, x4).
-- base_price = (23 x 4) x 1.45 = 133.40.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'floor-spray-buff-1gal-case-4',
  'Floor Spray Buff, 1 Gallon, Case of 4',
  'A spray buff restores shine between full strip-and-refinish cycles, so floors keep their finish looking fresh without a full recoat every time. Concentrated 1-gallon bottles, sold by the case.',
  'Floor spray buff finish restorer, 1 gal., case of 4.',
  id, 133.40, 'KX-JC-009', 'S-18934', 34, 'active'
from categories where slug = 'janitorial-cleaning';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (2, 127.60)) as t(min_quantity, unit_price)
where slug = 'floor-spray-buff-1gal-case-4';

-- ── Descriptive specs ────────────────────────────────────────────────────
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Includes', 'Steel dust pan, standing dust pan, 2 standard angle brooms, contractor push broom, black counter brush', 1), ('Weight', '15 lbs', 2)) as s(spec_name, spec_value, sort_order)
where slug = '5s-dry-zone-cleaning-kit';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Includes', 'Wet mop handle, wet mop head, bucket/wringer, dirty water bucket, 4" floor scraper, 6 spray bottles, black scrub brush, wet floor sign', 1), ('Weight', '31 lbs', 2)) as s(spec_name, spec_value, sort_order)
where slug = '5s-wet-zone-cleaning-kit';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Width', '15"', 1), ('Material', 'Corn fiber', 2), ('Bundle Quantity', '2 brooms', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'corn-broom-15in-case-2';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Width', '24"', 1), ('Bristle Material', 'Polypropylene, angled', 2), ('Color Coded', 'Yes — reduces cross-contamination risk between zones', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'colored-push-broom-24in';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Weight', '24 oz.', 1), ('Material', '4-ply looped cotton yarn', 2), ('Bundle Quantity', '6 mop heads', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'cotton-mop-head-24oz-case-6';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Length', '60"', 1), ('Material', 'Fiberglass', 2), ('Clamp Style', 'Gate (twist-and-release)', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'fiberglass-mop-handle-60in';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Size', '1 gallon', 1), ('Bundle Quantity', '4 bottles', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'floor-cleaner-1gal-case-4';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Size', '1 gallon', 1), ('Bundle Quantity', '4 bottles', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'floor-stripper-1gal-case-4';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Size', '1 gallon', 1), ('Bundle Quantity', '4 bottles', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'floor-spray-buff-1gal-case-4';

-- ── Federal Supply Class (PSC) ───────────────────────────────────────────
-- 7920 - Brooms, Brushes, Mops, and Sponges: kits, brooms, mop head/handle.
-- 7930 - Cleaning and Polishing Compounds and Preparations: Floor Science line.
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '7920 - Brooms, Brushes, Mops, and Sponges', 99
from products
where slug in (
  '5s-dry-zone-cleaning-kit',
  '5s-wet-zone-cleaning-kit',
  'corn-broom-15in-case-2',
  'colored-push-broom-24in',
  'cotton-mop-head-24oz-case-6',
  'fiberglass-mop-handle-60in'
);

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '7930 - Cleaning and Polishing Compounds and Preparations', 99
from products
where slug in (
  'floor-cleaner-1gal-case-4',
  'floor-stripper-1gal-case-4',
  'floor-spray-buff-1gal-case-4'
);
