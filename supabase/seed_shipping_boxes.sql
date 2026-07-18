-- "Best Seller" shipping boxes — the only section of the disputed
-- "top_100_catalog_v3.pdf" that survived cross-referencing against the real
-- Uline catalog text (supabase/../catalog_full.txt, extracted directly from
-- the user's own PDF). All 6 SKUs/dimensions/prices below were independently
-- verified against the real catalog; the fabricated "STRATEGIC CORE TYPE"
-- labels and sales copy from that disputed file were discarded entirely.
--
-- These sell in bundles of 25 (Uline's actual minimum bundle quantity) —
-- base_price is per bundle, not per box. Cost = per-box price x 25;
-- retail applies the same ~45% markup used in the other seed files.
-- Run after supabase/migrations/20260717000000_ecommerce_schema.sql.

insert into categories (slug, name, description, sort_order)
values ('shipping-packaging', 'Shipping & Packaging', 'Corrugated shipping boxes in the most commonly ordered sizes, sold by the bundle.', 3)
on conflict (slug) do nothing;

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'shipping-box-4x4x4-bundle-25',
  '4 x 4 x 4" Shipping Box, Bundle of 25',
  'A small cube box built for exactly the items that need one — jewelry, cosmetics, small electronics components. 200 lb. test corrugated construction holds up under normal parcel handling without adding bulk you don''t need.',
  '4x4x4" corrugated shipping box, 200 lb. test, bundle of 25.',
  id, 11.99, 'KX-BX-001', 'S-4040', 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'shipping-box-5x5x5-bundle-25',
  '5 x 5 x 5" Shipping Box, Bundle of 25',
  'A step up from our smallest cube — enough room for miniature parts, medical or lab instruments, and anything else that needs a little more padding room without moving into a full parcel box. 200 lb. test corrugated.',
  '5x5x5" corrugated shipping box, 200 lb. test, bundle of 25.',
  id, 14.99, 'KX-BX-002', 'S-4050', 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'shipping-box-10x10x10-bundle-25',
  '10 x 10 x 10" Shipping Box, Bundle of 25',
  'A balanced, square parcel size that fits a wide range of goods without wasting void space — one of the most commonly ordered box dimensions for a reason. 200 lb. test corrugated construction.',
  '10x10x10" corrugated shipping box, 200 lb. test, bundle of 25.',
  id, 30.99, 'KX-BX-003', 'S-4105', 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'shipping-box-12x12x12-bundle-25',
  '12 x 12 x 12" Shipping Box, Bundle of 25',
  'Our most popular shipping box size — a true cube that works for general retail goods, housewares, and mixed-item orders without needing custom dimensions. 200 lb. test corrugated construction.',
  '12x12x12" corrugated shipping box, 200 lb. test, bundle of 25. Our best seller.',
  id, 39.99, 'KX-BX-004', 'S-4125', 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'shipping-box-16x12x12-bundle-25',
  '16 x 12 x 12" Shipping Box, Bundle of 25',
  'Extra depth for books, candles, tools, and small equipment that needs more than a cube box can offer. 200 lb. test corrugated construction holds real weight without flexing.',
  '16x12x12" corrugated shipping box, 200 lb. test, bundle of 25.',
  id, 54.99, 'KX-BX-005', 'S-4163', 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'shipping-box-16x12x8-bundle-25',
  '16 x 12 x 8" Shipping Box, Bundle of 25',
  'A low-profile layout for flatter items — apparel, printed materials, panels — built to keep dimensional weight charges down without cramping what''s inside. 200 lb. test corrugated construction.',
  '16x12x8" corrugated shipping box, 200 lb. test, bundle of 25.',
  id, 46.99, 'KX-BX-006', 'S-4235', 'active'
from categories where slug = 'shipping-packaging';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Inside Dimensions', '4 x 4 x 4"', 1), ('Test Rating', '200 lb. bursting test', 2), ('Bundle Weight', '3 lbs.', 3), ('Bundle Quantity', '25 boxes', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'shipping-box-4x4x4-bundle-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Inside Dimensions', '5 x 5 x 5"', 1), ('Test Rating', '200 lb. bursting test', 2), ('Bundle Weight', '5 lbs.', 3), ('Bundle Quantity', '25 boxes', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'shipping-box-5x5x5-bundle-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Inside Dimensions', '10 x 10 x 10"', 1), ('Test Rating', '200 lb. bursting test', 2), ('Bundle Weight', '19 lbs.', 3), ('Bundle Quantity', '25 boxes', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'shipping-box-10x10x10-bundle-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Inside Dimensions', '12 x 12 x 12"', 1), ('Test Rating', '200 lb. bursting test', 2), ('Bundle Weight', '27 lbs.', 3), ('Bundle Quantity', '25 boxes', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'shipping-box-12x12x12-bundle-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Inside Dimensions', '16 x 12 x 12"', 1), ('Test Rating', '200 lb. bursting test', 2), ('Bundle Weight', '31 lbs.', 3), ('Bundle Quantity', '25 boxes', 4), ('Suggested Use', 'Books, candles, tools', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'shipping-box-16x12x12-bundle-25';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Inside Dimensions', '16 x 12 x 8"', 1), ('Test Rating', '200 lb. bursting test', 2), ('Bundle Weight', '25 lbs.', 3), ('Bundle Quantity', '25 boxes', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'shipping-box-16x12x8-bundle-25';
