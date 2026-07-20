-- New Shipping & Packaging supplies (pallet covers, cushioning, poly bags,
-- tape) and the new PPE Kits category. Sourced against Uline's *public*
-- retail site, not a B2B account — no B2B account access was available
-- (confirmed with the user before proceeding). Only 2 of 12 prices are
-- Uline-confirmed directly from their own product pages (marked below);
-- the rest are ESTIMATED — either scaled from a confirmed price by area/
-- proportion, or from general market knowledge of comparable industrial
-- packaging costs — flagged here rather than presented as verified,
-- same discipline as every other batch this session. Uline's site
-- intermittently errors on direct product-page fetches (same issue hit
-- repeatedly all session); most of these attempts hit that wall.
--
-- KX-SS-### = Shipping Supplies, KX-PK-### = PPE Kits.
-- All prices use the same ~45% markup convention as the rest of the
-- catalog (base_price = wholesale cost x ~1.45).

-- ── Cargo & Pallet Covers ───────────────────────────────────────────────
-- 51x49: CONFIRMED — S-13557, $153/roll of 25 (Uline's own product page).
-- 40x48: ESTIMATED by scaling the confirmed price by footprint area
--   (2016 sq in / 2499 sq in = 0.807x); closest real Uline SKU for spec
--   reference is S-13553 (48 x 42 x 48", not an exact 40x48 footprint —
--   Uline doesn't appear to stock that exact footprint at this mil
--   thickness; flagged rather than claiming an exact match).
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'heavy-duty-pallet-cover-51x49-bundle-25',
  '51 x 49" Heavy-Duty Poly Pallet Cover, Bundle of 25',
  '4 mil LLDPE construction stands up to a full pallet load in transit or storage, with enough clearance for a 48" tall stack. Perforated roll format tears off clean, one cover at a time — no scissors, no fumbling in a loading dock.',
  '51 x 49" x 73" heavy-duty pallet cover, 4 mil LLDPE, bundle of 25.',
  id, 221.99, 'KX-SS-001', 'S-13557', 35, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'heavy-duty-pallet-cover-40x48-bundle-25',
  '40 x 48" Heavy-Duty Poly Pallet Cover, Bundle of 25',
  'Sized for a standard 40 x 48" GMA pallet footprint without excess material to trim or tuck. Same 4 mil LLDPE and perforated roll format as our larger cover, just right-sized for a standard load.',
  '40 x 48" heavy-duty pallet cover, 4 mil LLDPE, bundle of 25.',
  id, 178.99, 'KX-SS-002', 'S-13553', 28, 'active'
from categories where slug = 'shipping-packaging';

-- ── Cushioning / Void-Fill ──────────────────────────────────────────────
-- All three: real Uline SKUs confirmed via search (S-1012, S-1852), but
-- pricing ESTIMATED — Uline's product pages errored on every fetch
-- attempt for these. The 24" bubble wrap's exact SKU for this specific
-- length/bubble-size combination wasn't confirmed; estimated as the
-- double-width sibling of S-1012.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'bubble-wrap-roll-12x175',
  '12" x 175'' Bubble Wrap Roll, 3/16" Small Bubble',
  'Small 3/16" bubbles cushion without adding bulk to a package — the right call for smaller, lighter items where a big-bubble roll just wastes box space. Perforated every 12" for clean tear-off.',
  '12" x 175'' bubble wrap roll, 3/16" small bubble, perforated.',
  id, 39.99, 'KX-SS-003', 'S-1012', 12, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'bubble-wrap-roll-24x175',
  '24" x 175'' Bubble Wrap Roll, 3/16" Small Bubble',
  'Same small 3/16" bubble as our 12" roll, doubled in width for wrapping wider or bulkier items without seaming two narrower rolls together.',
  '24" x 175'' bubble wrap roll, 3/16" small bubble.',
  id, 79.99, 'KX-SS-004', null, 24, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'foam-wrap-roll-12x250',
  '12" x 250'' Foam Wrap Roll',
  'Non-abrasive polyethylene foam protects finished and delicate surfaces bubble wrap can mark — cabinetry, coated metal, glass. Rolls out flat with no static cling to fight.',
  '12" x 250'' polyethylene foam wrap roll.',
  id, 49.99, 'KX-SS-005', 'S-1852', 18, 'active'
from categories where slug = 'shipping-packaging';

-- ── Poly Bags / Auto-Bags ───────────────────────────────────────────────
-- 10x15: CONFIRMED — S-6308, $49/case of 1000 (Uline's own product page,
--   entry-tier single-case price, not a volume discount).
-- 12x18: ESTIMATED by area scaling from the confirmed price (216 sq in /
--   150 sq in = 1.44x); exact SKU for this size not confirmed.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  '10x15-poly-auto-bags-case-1000',
  '10 x 15" Poly Auto Bags, Case of 1000',
  '1 mil virgin polyethylene film, FDA/USDA compliant, for small parts, retail packaging, or general bagging where clarity and a clean seal matter more than heavy-duty thickness.',
  '10 x 15" poly auto bags, 1 mil, case of 1000.',
  id, 69.99, 'KX-SS-006', 'S-6308', 15, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  '12x18-poly-auto-bags-case-1000',
  '12 x 18" Poly Auto Bags, Case of 1000',
  'Same 1 mil virgin polyethylene film as our 10 x 15" bag, sized up for bulkier parts or multi-item bagging without needing a bigger bag on hand for the occasional oversized item.',
  '12 x 18" poly auto bags, 1 mil, case of 1000.',
  id, 99.99, 'KX-SS-007', null, 22, 'active'
from categories where slug = 'shipping-packaging';

-- ── Packing Tape ─────────────────────────────────────────────────────────
-- 2": real SKU confirmed (S-423), but pricing ESTIMATED — the only price
--   data found was third-party reseller listings ($89.69-$124.98 for a
--   case of 36), which already include the reseller's own markup on top
--   of Uline's price, so using it directly as "cost" would double-count
--   margin. Estimated a more realistic direct wholesale case cost instead.
-- 3": ESTIMATED, exact SKU for this width/length/case-count combination
--   not confirmed.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  '2in-clear-packing-tape-case-36',
  '2" x 110yd Clear Packing Tape, Case of 36',
  '2 mil acrylic adhesive holds from 0°F to 140°F and grips virtually any carton surface without curling at the edges. The standard width for most shipping boxes — one case covers a lot of ground.',
  '2" x 110 yard clear packing tape, 2 mil, case of 36 rolls.',
  id, 99.99, 'KX-SS-008', 'S-423', 19, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  '3in-clear-packing-tape-case-24',
  '3" x 110yd Clear Packing Tape, Case of 24',
  'Wider format for heavier cartons or a single-pass seal on larger boxes where 2" tape means doubling up. Same acrylic adhesive formula as our 2" tape.',
  '3" x 110 yard clear packing tape, case of 24 rolls.',
  id, 107.99, 'KX-SS-009', null, 19, 'active'
from categories where slug = 'shipping-packaging';

-- ── PPE Kits (new category) ─────────────────────────────────────────────
-- Tyvek coveralls and isolation gowns: real Uline SKUs confirmed via
--   search (S-11495B-L, S-24019), pricing ESTIMATED from general bulk
--   protective-clothing market cost — Uline's pages errored on fetch.
-- General PPE Response Kit: NOT a single Uline SKU — Uline sells PPE
--   components separately, no pre-bundled kit product was found in their
--   catalog. This is a KORIX-assembled bundle (1 coverall + 1 pair
--   gloves + 1 mask + 1 pair goggles), priced from real/estimated
--   component costs already used elsewhere in this catalog's history
--   (nitrile gloves and N95 masks were previously catalog items with
--   confirmed-or-estimated per-unit costs) plus an estimate for goggles.
insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'tyvek-coveralls-hood-case-25',
  'Tyvek® Coveralls with Hood, Case of 25',
  'DuPont Tyvek fabric blocks fine particulates while staying breathable enough for a full shift — the standard choice for abatement, cleanup, and general contamination-control work. Attached hood and elastic wrists/ankles seal out dust without taping.',
  'DuPont Tyvek coveralls with attached hood, case of 25.',
  id, 274.99, 'KX-PK-001', 'S-11495B-L', 15, 'active'
from categories where slug = 'ppe-kits';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'disposable-isolation-gowns-case-50',
  'Disposable Isolation Gowns, Case of 50',
  'Lightweight polypropylene gowns with long sleeves and back ties — built for a quick change between tasks, not extended wear. Standard stock for clinics, labs, testing sites, and disaster-response staging areas.',
  'Disposable polypropylene isolation gowns, case of 50.',
  id, 136.99, 'KX-PK-002', 'S-24019', 12, 'active'
from categories where slug = 'ppe-kits';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'general-ppe-response-kit',
  'General PPE Response Kit',
  'One Tyvek coverall, one pair of nitrile gloves, one N95 respirator, and a pair of safety goggles — grab-and-go protection for a single responder without ordering four separate line items. Built by KORIX from individually-sourced components, not a single manufacturer SKU.',
  'PPE response kit: 1x Tyvek coverall, 1x nitrile gloves, 1x N95 respirator, 1x safety goggles.',
  id, 22.99, 'KX-PK-003', null, 2, 'active'
from categories where slug = 'ppe-kits';

-- ── Images ────────────────────────────────────────────────────────────
insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || v.image_file || '.png',
  name, 1, true
from products,
  (values
    ('heavy-duty-pallet-cover-51x49-bundle-25', 'heavy-duty-pallet-cover-51x49-bundle-25'),
    ('heavy-duty-pallet-cover-40x48-bundle-25', 'heavy-duty-pallet-cover-40x48-bundle-25'),
    ('bubble-wrap-roll-12x175', 'bubble-wrap-roll-12x175'),
    ('bubble-wrap-roll-24x175', 'bubble-wrap-roll-24x175'),
    ('foam-wrap-roll-12x250', 'foam-wrap-roll-12x250'),
    ('10x15-poly-auto-bags-case-1000', 'poly-auto-bags-10x15-case-1000'),
    ('12x18-poly-auto-bags-case-1000', 'poly-auto-bags-12x18-case-1000'),
    ('2in-clear-packing-tape-case-36', 'packing-tape-2in-case-36'),
    ('3in-clear-packing-tape-case-24', 'packing-tape-3in-case-24'),
    ('tyvek-coveralls-hood-case-25', 'tyvek-coveralls-hood-case-25'),
    ('disposable-isolation-gowns-case-50', 'disposable-isolation-gowns-case-50'),
    ('general-ppe-response-kit', 'general-ppe-response-kit')
  ) as v(slug, image_file)
where products.slug = v.slug;

-- ── Specs ─────────────────────────────────────────────────────────────
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '51 x 49 x 73"', 1), ('Material', '4 mil LLDPE', 2), ('Format', 'Perforated roll', 3), ('Bundle Quantity', '25 covers', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'heavy-duty-pallet-cover-51x49-bundle-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '40 x 48"', 1), ('Material', '4 mil LLDPE', 2), ('Format', 'Perforated roll', 3), ('Bundle Quantity', '25 covers', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'heavy-duty-pallet-cover-40x48-bundle-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '12" x 175''', 1), ('Bubble Size', '3/16" (small)', 2), ('Format', 'Perforated every 12"', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'bubble-wrap-roll-12x175';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '24" x 175''', 1), ('Bubble Size', '3/16" (small)', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'bubble-wrap-roll-24x175';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '12" x 250''', 1), ('Material', 'Polyethylene foam', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'foam-wrap-roll-12x250';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '10 x 15"', 1), ('Thickness', '1 mil', 2), ('Material', 'Virgin polyethylene', 3), ('Bundle Quantity', '1000 bags', 4)) as s(spec_name, spec_value, sort_order)
where slug = '10x15-poly-auto-bags-case-1000';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Dimensions', '12 x 18"', 1), ('Thickness', '1 mil', 2), ('Material', 'Virgin polyethylene', 3), ('Bundle Quantity', '1000 bags', 4)) as s(spec_name, spec_value, sort_order)
where slug = '12x18-poly-auto-bags-case-1000';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '2" x 110 yd', 1), ('Thickness', '2 mil', 2), ('Adhesive', 'Acrylic', 3), ('Bundle Quantity', '36 rolls', 4)) as s(spec_name, spec_value, sort_order)
where slug = '2in-clear-packing-tape-case-36';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Roll Size', '3" x 110 yd', 1), ('Adhesive', 'Acrylic', 2), ('Bundle Quantity', '24 rolls', 3)) as s(spec_name, spec_value, sort_order)
where slug = '3in-clear-packing-tape-case-24';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Material', 'DuPont Tyvek', 1), ('Style', 'Attached hood, elastic wrists/ankles', 2), ('Bundle Quantity', '25 coveralls', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'tyvek-coveralls-hood-case-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Material', 'Polypropylene', 1), ('Style', 'Long sleeve, back ties', 2), ('Bundle Quantity', '50 gowns', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'disposable-isolation-gowns-case-50';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Includes', 'Tyvek coverall, nitrile gloves, N95 respirator, safety goggles', 1), ('Kit Quantity', '1 responder', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'general-ppe-response-kit';
