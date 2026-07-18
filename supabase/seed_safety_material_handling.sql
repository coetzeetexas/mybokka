-- Safety Products + Facilities & Material Handling starter catalog.
-- Sourced from the user's own Uline Spring/Summer 2026 print catalog: facts only
-- (SKU/dimensions/capacity/material), rewritten into original KORIX copy — no
-- Uline marketing text or photography reproduced. supplier_ref carries the
-- Uline model number internally (never exposed to the client, see
-- src/lib/products.ts) so re-orders can be traced back to source.
--
-- Pricing: base_price is a KORIX retail price with a ~45% markup over the
-- Uline unit cost noted in each comment — adjust to your actual margin target.
-- No product_images rows are included (no rights to Uline's photography);
-- the storefront already renders a graceful "No image" placeholder until you
-- add your own photos or licensed stock images.
--
-- Run after supabase/migrations/20260717000000_ecommerce_schema.sql.

insert into categories (slug, name, description, sort_order)
values ('material-handling', 'Facilities & Material Handling', 'Carts, trucks, and tilt trucks for moving materials safely around your facility.', 2)
on conflict (slug) do nothing;

-- ============================================================
-- SAFETY PRODUCTS  (category: safety-ppe, created by supabase/seed.sql)
-- ============================================================

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'cut-resistant-gloves-a4',
  'A4 Cut-Resistant Work Gloves',
  'An HPPE-liner glove with a polyurethane coating, built for jobs where a slip means a cut — sheet metal, glass handling, assembly work with sharp edges. ANSI cut level A4 protection without giving up the dexterity you need to actually do the work.',
  'ANSI A4 cut-resistant gloves, HPPE liner with polyurethane coating.',
  id, 19.99, 'KX-SP-001', 'S-22779', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'cut-resistant-gloves-a8',
  'A8 Heavy-Duty Cut-Resistant Gloves',
  'When A2 or A4 isn''t enough, this is the step up: ANSI cut level A8, the highest tier for jobs like construction and equipment manufacturing where blades, sharp metal, or heavy debris are a daily risk. Ultra-durable HPPE-blend liner with a nitrile coating for grip.',
  'ANSI A8 cut-resistant gloves for high-risk construction and fabrication work.',
  id, 26.99, 'KX-SP-002', 'S-24003', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'heavy-duty-gription-work-gloves',
  'Heavy-Duty Grip Work Gloves',
  'General-purpose work gloves built for lifting and hauling all day — padded wrist support, knuckle guards, and a wraparound cuff so debris and dust stay out. Breathable enough for outdoor work, tough enough for indoor warehouse shifts.',
  'Padded work gloves with knuckle guards for general lifting and material handling.',
  id, 38.99, 'KX-SP-003', 'S-15355', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'vortex-insulated-waterproof-gloves',
  'Vortex Insulated Waterproof Work Gloves',
  'Rated for the coldest jobs — a waterproof shell over a thermal liner keeps hands dry and warm down to 0°F. Built for outdoor facilities work in winter conditions where standard gloves just aren''t enough.',
  'Waterproof, insulated work gloves rated to 0°F.',
  id, 64.99, 'KX-SP-004', 'S-23998', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'powder-free-latex-exam-gloves-box-100',
  'Powder-Free Latex Gloves, Box of 100',
  'FDA-compliant disposable latex gloves for food service, light industrial, or general-purpose use where you need a fresh pair on hand, not a bulk warehouse case. Beaded cuff, comfortable fit, box of 100.',
  'FDA-compliant powder-free latex gloves, box of 100, sizes S–XL.',
  id, 34.99, 'KX-SP-005', 'S-18043', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'nitrile-industrial-gloves-box-100',
  'Nitrile Industrial Gloves, Box of 100',
  'Latex- and allergy-free nitrile gloves for anyone who reacts to latex or works around chemicals and abrasives. Puncture-resistant with an easy on/off fit for repeated use through a shift.',
  'Latex-free nitrile disposable gloves, box of 100, sizes S–XL.',
  id, 32.99, 'KX-SP-006', 'S-16768', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'kevlar-cut-resistant-sleeve',
  'Kevlar Cut-Resistant Arm Sleeve',
  'An 18-inch sleeve that extends cut protection from wrist to elbow — for anyone whose forearms are as exposed to sharp edges as their hands. Lightweight Kevlar knit, doesn''t restrict movement.',
  'Kevlar knit arm sleeve, 18" wrist-to-elbow cut protection.',
  id, 11.99, 'KX-SP-007', 'S-11432', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'portable-welding-screen-6x6',
  'Portable Welding Screen, 6'' x 6''',
  'A flame-retardant vinyl curtain on a freestanding frame that gives welders a safe work area and shields everyone else from arc flash and sparks. Tool-free assembly, grommets every 12" for a secure setup, and it folds down when the job''s done.',
  '6x6 ft. flame-retardant portable welding screen, tool-free assembly.',
  id, 219.99, 'KX-SP-008', 'H-4610', 'active'
from categories where slug = 'safety-ppe';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'welding-screen-replacement-curtain-6x6',
  'Replacement Welding Screen Curtain, 6'' x 6''',
  'A direct replacement curtain for a worn or damaged welding screen — same flame-retardant vinyl, same fit, so you''re not replacing the whole frame over one torn panel.',
  'Flame-retardant replacement curtain for 6x6 ft. welding screens.',
  id, 59.99, 'KX-SP-009', 'S-20233', 'active'
from categories where slug = 'safety-ppe';

-- ============================================================
-- FACILITIES & MATERIAL HANDLING  (category: material-handling)
-- ============================================================

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'heavy-duty-tilt-truck-1-cu-yd',
  'Heavy-Duty Poly Tilt Truck, 1 Cubic Yard',
  'Built for the loads that wreck lesser carts — concrete debris, scrap metal, heavy parts. A leakproof polyethylene body on a tubular steel frame handles up to 2,100 lbs., and one person can tilt and dump it without a struggle.',
  '1 cu. yd. heavy-duty tilt truck, 2,100 lb. capacity, steel-reinforced frame.',
  id, 1949.00, 'KX-MH-001', 'H-1380', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'standard-tilt-truck-1-cu-yd',
  'Standard Poly Tilt Truck, 1 Cubic Yard',
  'The everyday version of our tilt truck line — steel-framed for support, rated for 1,250 lbs. of wood, strapping, or heavy corrugated waste, and easy for one person to dump. A solid fit for warehouses and manufacturing floors moving a steady volume of material.',
  '1 cu. yd. tilt truck, 1,250 lb. capacity, steel-reinforced frame.',
  id, 1679.00, 'KX-MH-002', 'H-1378', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'platform-truck-24x48',
  'Platform Truck, 24 x 48"',
  'A no-frills platform truck for moving loads through factories, loading docks, and worksites — 2,000 lb. capacity, a structural foam deck that resists dents and corrosion, and a contoured handle that''s actually comfortable to push.',
  '24x48" platform truck, 2,000 lb. capacity, non-marking casters.',
  id, 985.00, 'KX-MH-003', 'H-5035', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'poly-box-truck-34x24x26',
  'Poly Box Truck, 34 x 24 x 26"',
  'A seamless polyethylene box truck for laundry, bulk materials, or trash that needs to move without leaking or corroding the cart. Swivel casters make it easy to steer loaded, and the compact frame fits where bigger trucks can''t.',
  '34x24x26" poly box truck, 800 lb. capacity, swivel casters.',
  id, 365.00, 'KX-MH-004', 'H-2106', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'utility-cart-pneumatic-wheels',
  'Utility Cart with Pneumatic Wheels, 45 x 25 x 37"',
  'Structural foam construction with pneumatic casters built to roll smoothly over rough or uneven floors — loading docks, gravel, cracked concrete. Two-shelf design holds 500 lbs. and assembles in minutes.',
  '2-shelf utility cart, 500 lb. capacity, pneumatic casters for rough surfaces.',
  id, 465.00, 'KX-MH-005', 'H-2505', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'steel-push-cart-34x16x32',
  'Steel Push Cart, 34 x 16 x 32"',
  'A straightforward steel cart for shops that just need something durable and easy to push — 800 lb. capacity across two enclosed shelves, polypropylene casters, and easy assembly out of the box.',
  '2-shelf steel push cart, 800 lb. capacity.',
  id, 219.00, 'KX-MH-006', 'H-591', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  '3-shelf-utility-cart-flat',
  '3-Shelf Utility Cart, Flat Top',
  'A lightweight cart for moving a lot of product without a lot of bulk — three shelves spaced 12" apart, maintenance-free structural foam construction, and locking casters so it stays put when you need it to.',
  '3-shelf lightweight utility cart, 300 lb. capacity, locking casters.',
  id, 195.00, 'KX-MH-007', 'H-5007', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'vinyl-basket-truck-30x20x27',
  'Vinyl Basket Truck, 30 x 20 x 27"',
  'A reinforced vinyl basket truck that resists tears, punctures, and abrasions while moving wet or dry bulk loads — laundry, textiles, packages. 6-bushel capacity on smooth-rolling swivel casters.',
  '6-bushel vinyl basket truck, tear- and puncture-resistant.',
  id, 289.00, 'KX-MH-008', 'H-1806', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'receiving-cart-with-cabinet',
  'Receiving Cart with Locking Cabinet',
  'Built for the receiving dock: a 27 x 27" work surface for labeling and checking in shipments, six shelves for staging, and a ventilated locking cabinet to keep tools and electronics secure between deliveries.',
  'Receiving/staging cart with locking cabinet, 500 lb. capacity, 6 shelves.',
  id, 675.00, 'KX-MH-009', 'H-9022', 'active'
from categories where slug = 'material-handling';

insert into products (slug, name, brand_description, short_description, category_id, base_price, sku, supplier_ref, status)
select
  'service-cart-locking-cabinet',
  'Service Cart with Locking Cabinet, 41 x 20 x 38"',
  'A mobile cart with an 11" locking cabinet for transporting and securing instruments or supplies between rooms — sliding tray, easy-to-clean shelves, and quiet casters that won''t announce you coming down the hall.',
  'Mobile service cart with locking cabinet, 300 lb. capacity.',
  id, 759.00, 'KX-MH-010', 'H-2060', 'active'
from categories where slug = 'material-handling';

-- ============================================================
-- SPECS
-- ============================================================

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('ANSI Cut Level', 'A4', 1), ('Material', 'HPPE liner, polyurethane coating', 2), ('Sold As', 'Pair', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'cut-resistant-gloves-a4';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('ANSI Cut Level', 'A8', 1), ('Material', 'HPPE blend liner, nitrile coating', 2), ('Sold As', 'Pair', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'cut-resistant-gloves-a8';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Sizes', 'S, M, L, XL, 2XL', 1), ('Features', 'Padded wrist, knuckle guards, wraparound cuff', 2), ('Sold As', 'Pair', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'heavy-duty-gription-work-gloves';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Temperature Rating', 'Down to 0°F', 1), ('Construction', 'Waterproof shell, thermal liner', 2), ('Sold As', 'Pair', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'vortex-insulated-waterproof-gloves';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Quantity', '100 gloves per box', 1), ('Sizes', 'S, M, L, XL', 2), ('Compliance', 'FDA compliant', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'powder-free-latex-exam-gloves-box-100';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Quantity', '100 gloves per box', 1), ('Sizes', 'S, M, L, XL', 2), ('Material', 'Latex-free nitrile', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'nitrile-industrial-gloves-box-100';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Length', '18" wrist to elbow', 1), ('Material', 'Kevlar knit', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'kevlar-cut-resistant-sleeve';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Screen Size', '6 x 6 ft.', 1), ('Material', 'Flame-retardant vinyl', 2), ('Assembly', 'Tool-free, reusable cable ties included', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'portable-welding-screen-6x6';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Fits Screen Size', '6 x 6 ft.', 1), ('Material', 'Flame-retardant vinyl', 2)) as s(spec_name, spec_value, sort_order)
where slug = 'welding-screen-replacement-curtain-6x6';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '73 x 34 x 44"', 1), ('Load Capacity', '2,100 lbs.', 2), ('Weight', '112 lbs.', 3), ('Shipping', 'Ships assembled via motor freight', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'heavy-duty-tilt-truck-1-cu-yd';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '73 x 34 x 44"', 1), ('Load Capacity', '1,250 lbs.', 2), ('Weight', '115 lbs.', 3), ('Shipping', 'Ships assembled via motor freight', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'standard-tilt-truck-1-cu-yd';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Deck Size', '24 x 48"', 1), ('Load Capacity', '2,000 lbs.', 2), ('Weight', '70 lbs.', 3), ('Wheels', '8" non-marking casters', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'platform-truck-24x48';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '34 x 24 x 26"', 1), ('Load Capacity', '800 lbs.', 2), ('Weight', '28 lbs.', 3), ('Shipping', 'Ships assembled via motor freight', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'poly-box-truck-34x24x26';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '45 x 25 x 37"', 1), ('Load Capacity', '500 lbs.', 2), ('Shelves', '2', 3), ('Weight', '67 lbs.', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'utility-cart-pneumatic-wheels';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '34 x 16 x 32"', 1), ('Load Capacity', '800 lbs.', 2), ('Shelves', '2', 3), ('Weight', '44 lbs.', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'steel-push-cart-34x16x32';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '27 x 18 x 34"', 1), ('Load Capacity', '300 lbs.', 2), ('Shelves', '3', 3), ('Weight', '22 lbs.', 4)) as s(spec_name, spec_value, sort_order)
where slug = '3-shelf-utility-cart-flat';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '30 x 20 x 27"', 1), ('Bushel Capacity', '6', 2), ('Weight', '25 lbs.', 3)) as s(spec_name, spec_value, sort_order)
where slug = 'vinyl-basket-truck-30x20x27';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Work Surface', '27 x 27" acrylic', 1), ('Load Capacity', '500 lbs.', 2), ('Shelves', '6 (3 exterior, 3 interior)', 3), ('Weight', '127 lbs.', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'receiving-cart-with-cabinet';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values ('Overall Dimensions', '41 x 20 x 38"', 1), ('Load Capacity', '300 lbs.', 2), ('Cabinet Height', '11", locking', 3), ('Weight', '52 lbs.', 4)) as s(spec_name, spec_value, sort_order)
where slug = 'service-cart-locking-cabinet';
