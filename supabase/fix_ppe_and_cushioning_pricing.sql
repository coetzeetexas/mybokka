-- Corrections found by cross-checking active products against Uline's
-- real Spring/Summer 2026 catalog (customer-supplied PDF, pages 701-892
-- covering PPE and cushioning materials).
--
-- 1) disposable-isolation-gowns-case-50 (S-24019): real price is
--    $57/box of 50 (qty 1), $53 at 5+. At the catalog's ~45% markup
--    convention that's $82.65, not the $136.99 it was estimated at —
--    nearly 2x too high, the same pattern as the pallet cover error.
-- 2) tyvek-coveralls-hood-case-25 (S-11495): real price is $230/box of
--    25 (qty 1), $220 at 3+. At the ~45% markup that's $333.50 — this
--    one was actually UNDERpriced at $274.99.
-- 3) bubble-wrap-roll-12x175 (S-1012): real price is $20/carton flat
--    (no volume break), 4 lbs/carton. Was $39.99 at 12 lbs — both wrong.
-- 4) foam-wrap-roll-12x250 (S-1852): NOT sold as a single roll — real
--    Uline unit is a bundle of 6 rolls, 40 lbs/bundle, $47/roll at 1
--    bundle, $45/roll at 2 bundles, $42/roll at 3+ bundles. Renamed and
--    restructured to match the real unit of sale, same as the pallet
--    cover fix.

-- ── Isolation gowns: price fix + real bulk tier ────────────────────────
update products
set base_price = 82.65
where slug = 'disposable-isolation-gowns-case-50';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, 5, 76.85 from products where slug = 'disposable-isolation-gowns-case-50'
on conflict (product_id, min_quantity) do update set unit_price = excluded.unit_price;

-- ── Tyvek coveralls: price fix + real bulk tier ────────────────────────
update products
set base_price = 333.50
where slug = 'tyvek-coveralls-hood-case-25';

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, 3, 319.00 from products where slug = 'tyvek-coveralls-hood-case-25'
on conflict (product_id, min_quantity) do update set unit_price = excluded.unit_price;

-- ── Bubble wrap: price + weight fix (flat price, no bulk tiers) ───────
update products
set base_price = 29.00, weight_lbs = 4
where slug = 'bubble-wrap-roll-12x175';

-- ── Foam wrap: restructure from "1 roll" to the real "bundle of 6" ────
update products
set
  slug = 'foam-wrap-roll-12x250-bundle-6',
  name = '12" x 250'' Foam Wrap Roll, Bundle of 6',
  brand_description = 'Non-abrasive polyethylene foam protects finished and delicate surfaces bubble wrap can mark — cabinetry, coated metal, glass. Rolls out flat with no static cling to fight. Sold in Uline''s standard bundle of 6 rolls, not individually.',
  short_description = '12" x 250'' polyethylene foam wrap, bundle of 6 rolls.',
  base_price = 408.90,
  weight_lbs = 40
where slug = 'foam-wrap-roll-12x250';

update product_specs
set spec_value = '6 rolls'
where spec_name = 'Bundle Quantity'
and product_id = (select id from products where slug = 'foam-wrap-roll-12x250-bundle-6');

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Bundle Quantity', '6 rolls', 3
from products p
where slug = 'foam-wrap-roll-12x250-bundle-6'
and not exists (
  select 1 from product_specs s
  where s.product_id = p.id and s.spec_name = 'Bundle Quantity'
);

insert into product_price_tiers (product_id, min_quantity, unit_price)
select id, t.min_quantity, t.unit_price from products,
  (values (2, 391.50), (3, 365.40)) as t(min_quantity, unit_price)
where slug = 'foam-wrap-roll-12x250-bundle-6'
on conflict (product_id, min_quantity) do update set unit_price = excluded.unit_price;
