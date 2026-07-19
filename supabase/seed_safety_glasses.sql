-- Two additional Safety Glasses styles — both real Uline products with
-- pricing confirmed directly from their own product pages (not search
-- snippets or third-party listings, unlike some earlier batches this
-- session where uline.com kept erroring on direct fetch):
--   Flash™ Safety Glasses - Clear Lens, S-17944C: $5.25/pair at the 12-unit
--     volume tier (their own stated pricing: $5.25-$5.75/pair, min 6).
--   Skyhawk™ Safety Glasses - Smoke Lens, S-12451SM: $5.25/pair at the
--     12-unit tier (explicitly stated: 6@$5.50, 12@$5.25, 24+@$5.00).
-- Both sold here as 12-packs, matching Uline's own volume-pricing break
-- and the existing "ANSI Z87.1 Safety Glasses (12-Pack)" product's format.
-- base_price = 12 x $5.25 x ~1.45 markup = $91.35, rounded to $91.99 for
-- both (identical wholesale cost, so identical retail price is correct,
-- not a copy-paste error).
--
-- NOTE: the existing ansi-z87-safety-glasses-12pk product ($42.00, no
-- supplier_ref — predates this session's practice of sourcing real Uline
-- data) is priced well below what real Uline glasses cost at this pack
-- size per the verified data above. Worth a pricing review; not changed
-- here since that's a different product, out of scope for this addition.
-- Run after supabase/migrations/20260717000000_ecommerce_schema.sql.

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'flash-safety-glasses-clear-12pk',
  'Flash™ Safety Glasses - Clear Lens, 12-Pack',
  'FogArmor anti-fog coating means these stay clear through a full shift of temperature swings and hard work — not just on the shelf. Wraparound polycarbonate lens meets ANSI Z87.1+ with 99.9% UV protection, and the soft gel nosepiece keeps them comfortable past hour four.',
  'Clear lens wraparound safety glasses, ANSI Z87.1+, anti-fog and anti-scratch coating, 12-pack.',
  id, 91.99, 'KX-SP-015', 'S-17944C', 1.5, 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, weight_lbs, status)
select
  'skyhawk-safety-glasses-smoke-12pk',
  'Skyhawk™ Safety Glasses - Smoke Lens, 12-Pack',
  'Smoke lens cuts glare for outdoor and high-light work without giving up ANSI Z87.1+ impact protection. Distortion-free polycarbonate lens with anti-fog and anti-scratch coating, soft PVC nosepiece for all-day wear.',
  'Smoke lens wraparound safety glasses, ANSI Z87.1+, anti-fog and anti-scratch coating, 12-pack.',
  id, 91.99, 'KX-SP-016', 'S-12451SM', 1.5, 'active'
from categories where slug = 'safety-ppe';

insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || slug || '.png',
  name, 1, true
from products where slug in ('flash-safety-glasses-clear-12pk', 'skyhawk-safety-glasses-smoke-12pk');

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Lens Material', 'Polycarbonate', 1), ('Lens Color', 'Clear', 2), ('Coating', 'FogArmor anti-fog, anti-scratch', 3), ('ANSI Rating', 'ANSI Z87.1+', 4), ('UV Protection', '99.9% UVA/UVB', 5), ('Bundle Quantity', '12 pairs', 6)) as s(spec_name, spec_value, sort_order)
where slug = 'flash-safety-glasses-clear-12pk';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Lens Material', 'Polycarbonate, distortion-free', 1), ('Lens Color', 'Smoke', 2), ('Coating', 'Anti-fog, anti-scratch', 3), ('ANSI Rating', 'ANSI Z87.1+', 4), ('UV Protection', '99.9% UVA/UVB', 5), ('Bundle Quantity', '12 pairs', 6)) as s(spec_name, spec_value, sort_order)
where slug = 'skyhawk-safety-glasses-smoke-12pk';
