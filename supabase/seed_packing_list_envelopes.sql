-- Clear Packing List Envelopes — sizes and SKUs (S-2593, S-6222, S-750,
-- S-2980, S-5941, S-2982) are real Uline "Top Loading Packing List
-- Envelopes - Clear" products, confirmed via uline.com search/product
-- pages. Uline's real per-unit spec (tamperproof 2 mil poly, clear face /
-- white backing, water-based acrylic pressure-sensitive adhesive) and real
-- bundle size (1000/carton) came from the one product page that loaded
-- (S-750, 7 1/2 x 5 1/2") — Uline's site returned errors for the other
-- individual product pages when fetched, so only S-750's price ($57/1000)
-- is Uline-confirmed. The other 5 prices are ESTIMATED by scaling that one
-- confirmed cost by envelope area (with a floor so tiny sizes don't scale
-- to an unrealistically low price, since converting/backing-paper cost
-- doesn't shrink linearly with area) — not fabricated round numbers, but
-- not verified either. Same ~45% retail markup as the shipping-box seed.
-- Cross-check against Uline's real per-size pricing before relying on
-- these for margin decisions, and adjust base_price once confirmed.
-- Run after supabase/migrations/20260717000000_ecommerce_schema.sql.

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'clear-packing-list-envelope-4x3-bundle-1000',
  '4 x 3" Clear Packing List Envelopes, Bundle of 1000',
  'A compact envelope sized for a business card, small parts slip, or return label — self-adhesive backing goes straight onto a box or poly bag without extra tape. Clear face keeps the enclosed slip visible and legible without opening the pouch.',
  '4 x 3" clear top-loading packing list envelope, self-adhesive, bundle of 1000.',
  id, 45.99, 'KX-PLE-001', 'S-2593', 4, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'clear-packing-list-envelope-5-1-2x4-1-2-bundle-1000',
  '5 1/2 x 4 1/2" Clear Packing List Envelopes, Bundle of 1000',
  'A step up in size for a full packing slip or short invoice without folding it down further than necessary. Same tamperproof 2 mil poly and pressure-sensitive backing as our other sizes — attaches to paper, wood, plastic, or metal.',
  '5 1/2 x 4 1/2" clear top-loading packing list envelope, self-adhesive, bundle of 1000.',
  id, 49.99, 'KX-PLE-002', 'S-6222', 6, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'clear-packing-list-envelope-7-1-2x5-1-2-bundle-1000',
  '7 1/2 x 5 1/2" Clear Packing List Envelopes, Bundle of 1000',
  'Our most commonly ordered packing list envelope size — fits a standard half-page packing slip flat, no folding required. Tamperproof 2 mil poly with a clear face and white backing keeps the enclosed document readable and protected in transit.',
  '7 1/2 x 5 1/2" clear top-loading packing list envelope, self-adhesive, bundle of 1000. Our best seller.',
  id, 82.99, 'KX-PLE-003', 'S-750', 9, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'clear-packing-list-envelope-7x6-bundle-1000',
  '7 x 6" Clear Packing List Envelopes, Bundle of 1000',
  'A slightly wider format for packing slips with extra line items or a folded invoice. Same tamperproof 2 mil poly construction and pressure-sensitive backing you can count on across every size we carry.',
  '7 x 6" clear top-loading packing list envelope, self-adhesive, bundle of 1000.',
  id, 84.99, 'KX-PLE-004', 'S-2980', 9, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'clear-packing-list-envelope-9-1-2x6-bundle-1000',
  '9 1/2 x 6" Clear Packing List Envelopes, Bundle of 1000',
  'Room for a full-page packing slip plus a return label or promotional insert without doubling up envelopes. Clear face, white backing, tamperproof 2 mil poly.',
  '9 1/2 x 6" clear top-loading packing list envelope, self-adhesive, bundle of 1000.',
  id, 114.99, 'KX-PLE-005', 'S-5941', 12, 'active'
from categories where slug = 'shipping-packaging';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'clear-packing-list-envelope-12x15-bundle-1000',
  '12 x 15" Clear Packing List Envelopes, Bundle of 1000',
  'Our largest packing list envelope — built for oversized shipments, pallet documentation, or multi-page paperwork that a standard-size envelope can''t hold flat. Same tamperproof 2 mil poly and pressure-sensitive backing, sized up.',
  '12 x 15" clear top-loading packing list envelope, self-adhesive, bundle of 1000.',
  id, 359.99, 'KX-PLE-006', 'S-2982', 28, 'active'
from categories where slug = 'shipping-packaging';

insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || slug || '.png',
  name, 1, true
from products where slug in (
  'clear-packing-list-envelope-4x3-bundle-1000',
  'clear-packing-list-envelope-5-1-2x4-1-2-bundle-1000',
  'clear-packing-list-envelope-7-1-2x5-1-2-bundle-1000',
  'clear-packing-list-envelope-7x6-bundle-1000',
  'clear-packing-list-envelope-9-1-2x6-bundle-1000',
  'clear-packing-list-envelope-12x15-bundle-1000'
);

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Envelope Size', '4 x 3"', 1), ('Style', 'Top-Loading', 2), ('Material', 'Tamperproof 2 mil poly, clear face / white backing', 3), ('Adhesive', 'Water-based acrylic, pressure-sensitive', 4), ('Bundle Quantity', '1000 envelopes', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'clear-packing-list-envelope-4x3-bundle-1000';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Envelope Size', '5 1/2 x 4 1/2"', 1), ('Style', 'Top-Loading', 2), ('Material', 'Tamperproof 2 mil poly, clear face / white backing', 3), ('Adhesive', 'Water-based acrylic, pressure-sensitive', 4), ('Bundle Quantity', '1000 envelopes', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'clear-packing-list-envelope-5-1-2x4-1-2-bundle-1000';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Envelope Size', '7 1/2 x 5 1/2"', 1), ('Style', 'Top-Loading', 2), ('Material', 'Tamperproof 2 mil poly, clear face / white backing', 3), ('Adhesive', 'Water-based acrylic, pressure-sensitive', 4), ('Bundle Quantity', '1000 envelopes', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'clear-packing-list-envelope-7-1-2x5-1-2-bundle-1000';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Envelope Size', '7 x 6"', 1), ('Style', 'Top-Loading', 2), ('Material', 'Tamperproof 2 mil poly, clear face / white backing', 3), ('Adhesive', 'Water-based acrylic, pressure-sensitive', 4), ('Bundle Quantity', '1000 envelopes', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'clear-packing-list-envelope-7x6-bundle-1000';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Envelope Size', '9 1/2 x 6"', 1), ('Style', 'Top-Loading', 2), ('Material', 'Tamperproof 2 mil poly, clear face / white backing', 3), ('Adhesive', 'Water-based acrylic, pressure-sensitive', 4), ('Bundle Quantity', '1000 envelopes', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'clear-packing-list-envelope-9-1-2x6-bundle-1000';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Envelope Size', '12 x 15"', 1), ('Style', 'Top-Loading', 2), ('Material', 'Tamperproof 2 mil poly, clear face / white backing', 3), ('Adhesive', 'Water-based acrylic, pressure-sensitive', 4), ('Bundle Quantity', '1000 envelopes', 5)) as s(spec_name, spec_value, sort_order)
where slug = 'clear-packing-list-envelope-12x15-bundle-1000';
