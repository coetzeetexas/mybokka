-- Additional Safety & PPE products — hard hat, hi-vis vest, hearing
-- protection, respiratory protection, and first aid, filling gaps in the
-- existing catalog (which only had gloves, glasses, and welding screens).
-- SKUs are real Uline products confirmed via uline.com/search: S-10512BLU
-- (hard hat), S-12517G-L (hi-vis vest), S-17903 (earplugs), S-9632-S1 (N95
-- respirator), H-6469 (first aid kit).
--
-- Only two prices are Uline-confirmed (via search-indexed page data, since
-- uline.com's product pages themselves returned errors on direct fetch,
-- same intermittent issue as the packing-list-envelope batch):
--   - Hard hat S-10512BLU: $33.22
--   - N95 respirator box S-9632-S1: $74.99 (source flagged this may be stale)
-- The other 3 (vest, earplugs, first aid kit) have real confirmed SKUs/specs
-- but no confirmed Uline price — base_price for those is an ESTIMATE from
-- typical commodity PPE pricing, not scraped or verified. All prices use
-- the same ~45% markup convention as the rest of the catalog. Flagged here,
-- not silently presented as verified — cross-check against Uline before
-- relying on these for margin decisions.
-- Run after supabase/migrations/20260717000000_ecommerce_schema.sql.

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'hard-hat-type-1-ansi-blue',
  'Type I Hard Hat, ANSI Z89.1, Blue',
  'A 4-point ratchet suspension means one hand and a few seconds gets you a dialed-in fit — no sizing pucks to lose. High-density polyethylene shell meets ANSI Z89.1 Type I impact protection for everyday jobsite and warehouse use.',
  'Type I hard hat, ANSI Z89.1, high-density polyethylene shell, 4-point ratchet suspension, blue.',
  id, 48.99, 'KX-SP-010', 'S-10512BLU', 1, 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'class-2-hi-vis-safety-vest-lime-lxl',
  'Class 2 Hi-Vis Safety Vest, Lime, L/XL',
  'Breathable polyester mesh keeps you cool without giving up ANSI/ISEA Class 2 visibility — reflective striping across the chest and shoulders holds up to repeat machine washing. Hook-and-loop front closure goes on fast over a jacket.',
  'Class 2 high-visibility safety vest, lime mesh, reflective striping, hook-and-loop closure, L/XL.',
  id, 11.99, 'KX-SP-011', 'S-12517G-L', 1, 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'foam-corded-earplugs-box-200',
  'Foam Corded Earplugs, Box of 200 Pairs',
  'NRR 32dB foam earplugs with a cord so they stay with you between uses instead of getting lost in a tool bag. Bullet shape seats comfortably for extended wear on a loud shop floor or job site.',
  'Foam corded earplugs, NRR 32dB, box of 200 pairs.',
  id, 19.99, 'KX-SP-012', 'S-17903', 2, 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'n95-industrial-respirator-box-20',
  'N95 Industrial Respirator, Box of 20',
  'NIOSH-approved N95 filtration for dust, grinding debris, and other non-oil particulates. Adjustable nose clip and dual elastic straps hold a seal through a full shift without pinching.',
  'N95 industrial respirator masks, NIOSH-approved, box of 20.',
  id, 108.99, 'KX-SP-013', 'S-9632-S1', 1, 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'ansi-class-a-first-aid-kit-25-person',
  'ANSI Class A First Aid Kit, 25-Person, Metal Case',
  'OSHA and ANSI Class A compliant contents in a wall-mountable metal case built to survive a shop or warehouse environment, not just a desk drawer. Everything a designated first-aid area needs, stocked and organized.',
  'ANSI/OSHA Class A first aid kit, 25-person, metal wall-mountable case.',
  id, 64.99, 'KX-SP-014', 'H-6469', 5, 'active'
from categories where slug = 'safety-ppe';

insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || slug || '.png',
  name, 1, true
from products where slug in (
  'hard-hat-type-1-ansi-blue',
  'class-2-hi-vis-safety-vest-lime-lxl',
  'foam-corded-earplugs-box-200',
  'n95-industrial-respirator-box-20',
  'ansi-class-a-first-aid-kit-25-person'
);

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Type', 'Type I, Class E/G', 1), ('Standard', 'ANSI Z89.1', 2), ('Suspension', '4-point ratchet', 3), ('Material', 'High-density polyethylene', 4), ('Color', 'Blue', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'hard-hat-type-1-ansi-blue';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Class', 'ANSI/ISEA Class 2', 1), ('Material', 'Breathable polyester mesh', 2), ('Closure', 'Hook-and-loop front', 3), ('Care', 'Machine washable', 4), ('Size', 'L/XL', 5), ('Color', 'Lime', 6)) as s(spec_name, spec_value, sort_order)
where slug = 'class-2-hi-vis-safety-vest-lime-lxl';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Noise Reduction Rating', '32 dB', 1), ('Style', 'Foam, corded', 2), ('Bundle Quantity', '200 pairs', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'foam-corded-earplugs-box-200';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Filtration Rating', 'N95 (NIOSH-approved)', 1), ('Style', 'Cup-style, dual strap', 2), ('Bundle Quantity', '20 masks', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'n95-industrial-respirator-box-20';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Compliance', 'ANSI Class A, OSHA', 1), ('Case', 'Metal, wall-mountable', 2), ('Coverage', '25 people', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'ansi-class-a-first-aid-kit-25-person';
