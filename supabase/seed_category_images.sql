-- Category banner images — reuse an existing representative product photo per
-- category rather than generating separate category art. Run after
-- supabase/seed_safety_material_handling.sql and seed_shipping_boxes.sql
-- (the referenced product images must already exist).

update categories set image_url = 'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/heavy-duty-steel-workbench.png' where slug = 'shop-equipment';
update categories set image_url = 'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/grade-8-bolt-assortment-kit.png' where slug = 'fasteners-hardware';
update categories set image_url = 'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/heavy-duty-tilt-truck-1-cu-yd.png' where slug = 'material-handling';
update categories set image_url = 'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/portable-welding-screen-6x6.png' where slug = 'safety-ppe';
update categories set image_url = 'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/shipping-box-12x12x12-bundle-25.png' where slug = 'shipping-packaging';
