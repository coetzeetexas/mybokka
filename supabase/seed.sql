-- Sample catalog data so the storefront isn't empty before AllProducts.com
-- sync is live. Replace/expand via Supabase Studio's table editor — this is
-- a starting point, not a fixture to keep long-term. Run after the schema
-- migration: `supabase db execute --file supabase/seed.sql` (or paste into
-- the SQL editor).

insert into categories (slug, name, description, sort_order) values
  ('shop-equipment', 'Shop Equipment', 'Workbenches, tool storage, and shop furnishings built for daily use.', 1),
  ('fasteners-hardware', 'Fasteners & Hardware', 'Bulk and specialty fasteners, anchors, and mounting hardware.', 2),
  ('safety-ppe', 'Safety & PPE', 'Personal protective equipment for industrial and jobsite use.', 3);

insert into products (slug, name, brand_description, short_description, category_id, base_price, compare_at_price, sku, status)
select
  'heavy-duty-steel-workbench',
  'Heavy-Duty Steel Workbench',
  'Built for shops that don''t baby their equipment. A welded steel frame rated well beyond typical bench-top loads, with a work surface that shrugs off dropped tools and daily abuse.',
  '72" welded steel workbench with 2,000 lb. rated work surface.',
  id, 349.00, 399.00, 'KX-WB-72', 'active'
from categories where slug = 'shop-equipment';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, status)
select
  'grade-8-bolt-assortment-kit',
  'Grade 8 Bolt Assortment Kit',
  'A curated 500-piece assortment of Grade 8 bolts, nuts, and washers in the sizes shops actually run out of first — organized in a stackable steel case.',
  '500-piece Grade 8 hex bolt, nut, and washer assortment.',
  id, 89.00, 'KX-FH-500', 'active'
from categories where slug = 'fasteners-hardware';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, status)
select
  'ansi-z87-safety-glasses-12pk',
  'ANSI Z87.1 Safety Glasses (12-Pack)',
  'ANSI Z87.1-rated safety glasses sold by the dozen so a full crew is covered from one order, not five.',
  '12-pack of ANSI Z87.1-rated impact-resistant safety glasses.',
  id, 42.00, 'KX-PPE-12', 'active'
from categories where slug = 'safety-ppe';

-- Example specs for the workbench (repeat this pattern per product as you add real data).
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, spec_name, spec_value, sort_order
from products, (values
  ('Overall Dimensions', '72" W x 24" D x 34" H', 1),
  ('Load Rating', '2,000 lbs. evenly distributed', 2),
  ('Frame Material', '14-gauge welded steel', 3),
  ('Surface', '1" solid maple work top', 4)
) as specs(spec_name, spec_value, sort_order)
where products.slug = 'heavy-duty-steel-workbench';
