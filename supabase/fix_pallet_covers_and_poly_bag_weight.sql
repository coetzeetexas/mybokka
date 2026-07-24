-- Corrections found by cross-checking active products against Uline's
-- real Spring/Summer 2026 catalog (PDF pages, not search snippets).
--
-- 1) heavy-duty-pallet-cover-40x48-bundle-25 (supplier_ref S-13553) was
--    wrong on two counts: the real S-13553 fits a 48 x 40 x 27" pallet
--    with a 48 x 42 x 48" cover — a short, squat cover, not a "40 x 48"
--    tall cover as named/described — and its real price is $90/bundle
--    (bundle of 25, 46 lbs), not the $178.99 (~2x the correct ~45%-
--    markup price of $130.50) it was estimated at. Renamed, redescribed,
--    and repriced to match reality; added the real 2/5+ bulk tiers too.
-- 2) heavy-duty-pallet-cover-51x49-bundle-25 (S-13557): price was
--    already correct ($153 confirmed), but weight was estimated at 35
--    lbs vs. the real 48 lbs/bundle — corrected, and added real bulk
--    tiers (2: $140, 5+: $128).
-- 3) 10x15-poly-auto-bags-case-1000 (S-6308): price was already
--    correct ($49 confirmed), but weight was estimated at 15 lbs vs.
--    the real 11 lbs/carton — corrected.

-- ── Pallet cover: rename + reprice to match the real S-13553 ──────────
update products
set
  slug = 'heavy-duty-pallet-cover-48x42-bundle-25',
  name = '48 x 42" Heavy-Duty Poly Pallet Cover, Bundle of 25',
  brand_description = '4 mil LLDPE construction sized for shorter, compact pallet loads — fits stacks up to 48 x 40 x 27" without the extra height of our taller 51 x 49" cover. Same perforated roll format tears off clean, one cover at a time — no scissors, no fumbling in a loading dock.',
  short_description = '48 x 42 x 48" heavy-duty pallet cover, 4 mil LLDPE, fits pallet loads up to 48 x 40 x 27", bundle of 25.',
  base_price = 130.50,
  weight_lbs = 46
where slug = 'heavy-duty-pallet-cover-40x48-bundle-25';

update product_specs
set spec_value = '48 x 42 x 48" (fits pallet loads up to 48 x 40 x 27")'
where spec_name = 'Dimensions'
and product_id = (select id from products where slug = 'heavy-duty-pallet-cover-48x42-bundle-25');

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (2, 120.35), (5, 108.75)) as t(min_quantity, unit_price)
where slug = 'heavy-duty-pallet-cover-48x42-bundle-25'
on conflict (product_id, min_quantity) do update set unit_price = excluded.unit_price;

-- ── Pallet cover: weight correction only (price was already right) ────
update products
set weight_lbs = 48
where slug = 'heavy-duty-pallet-cover-51x49-bundle-25';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (2, 140.00), (5, 128.00)) as t(min_quantity, unit_price)
where slug = 'heavy-duty-pallet-cover-51x49-bundle-25'
on conflict (product_id, min_quantity) do update set unit_price = excluded.unit_price;

-- ── Poly bag: weight correction only (price was already right) ────────
update products
set weight_lbs = 11
where slug = '10x15-poly-auto-bags-case-1000';
