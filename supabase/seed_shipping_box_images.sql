-- The original 6 shipping boxes (seed_shipping_boxes.sql) never had photos —
-- caught while auditing why "not all products pull through" on the shop
-- page (ProductCard shows a graceful "No image" placeholder rather than
-- hiding the product, so this wasn't the actual cause of that report, but
-- it's a real gap worth closing). AI-generated product photography,
-- uploaded to the product-images bucket with filenames matching each
-- product's slug. Safe to run standalone; guarded against duplicate rows
-- if run more than once.
insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || v.image_file || '.png',
  name, 1, true
from products,
  (values
    ('shipping-box-4x4x4-bundle-25', 'shipping-box-4x4x4-bundle-25'),
    ('shipping-box-5x5x5-bundle-25', 'shipping-box-5x5x5-bundle-25'),
    ('shipping-box-10x10x10-bundle-25', 'shipping-box-10x10x10-bundle-25'),
    ('shipping-box-12x12x12-bundle-25', 'shipping-box-12x12x12-bundle-25'),
    ('shipping-box-16x12x12-bundle-25', 'shipping-box-16x12x12-bundle-25'),
    ('shipping-box-16x12x8-bundle-25', 'shipping-box-16x12x8-bundle-25')
  ) as v(slug, image_file)
where products.slug = v.slug
and not exists (
  select 1 from product_images pi where pi.product_id = products.id
);
