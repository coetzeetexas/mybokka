-- Run this ONCE, after seed_janitorial_cleaning.sql has already been
-- applied (products already exist) and the 9 photos below have been
-- downloaded and uploaded to the product-images Storage bucket with
-- filenames matching each product's slug. AI-generated product photography
-- (no rights issue — not reproductions of the supplier's own photos).
-- Guarded against duplicate rows if run more than once.
insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || v.image_file || '.png',
  name, 1, true
from products,
  (values
    ('5s-dry-zone-cleaning-kit', '5s-dry-zone-cleaning-kit'),
    ('5s-wet-zone-cleaning-kit', '5s-wet-zone-cleaning-kit'),
    ('corn-broom-15in-case-2', 'corn-broom-15in-case-2'),
    ('colored-push-broom-24in', 'colored-push-broom-24in'),
    ('cotton-mop-head-24oz-case-6', 'cotton-mop-head-24oz-case-6'),
    ('fiberglass-mop-handle-60in', 'fiberglass-mop-handle-60in'),
    ('floor-cleaner-1gal-case-4', 'floor-cleaner-1gal-case-4'),
    ('floor-stripper-1gal-case-4', 'floor-stripper-1gal-case-4'),
    ('floor-spray-buff-1gal-case-4', 'floor-spray-buff-1gal-case-4')
  ) as v(slug, image_file)
where products.slug = v.slug
and not exists (
  select 1 from product_images pi where pi.product_id = products.id
);
