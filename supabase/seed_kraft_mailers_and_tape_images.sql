-- Run this ONCE, after seed_kraft_mailers_and_tape.sql has already been
-- applied (products already exist) and the 8 photos have been uploaded
-- to the product-images Storage bucket with filenames matching each
-- product's slug. Do NOT re-run seed_kraft_mailers_and_tape.sql itself —
-- it would fail on duplicate product slugs since those rows already
-- exist.
insert into product_images (product_id, url, alt_text, sort_order, is_primary)
select id,
  'https://gkngsxutwsyqpcudwbof.supabase.co/storage/v1/object/public/product-images/' || v.image_file || '.png',
  name, 1, true
from products,
  (values
    ('kraft-recyclable-paper-mailers-6-14x16-case-350', 'kraft-recyclable-paper-mailers-6-14x16-case-350'),
    ('kraft-recyclable-padded-mailers-0-7x9-case-300', 'kraft-recyclable-padded-mailers-0-7x9-case-300'),
    ('kraft-recyclable-padded-mailers-2-12x9-case-100', 'kraft-recyclable-padded-mailers-2-12x9-case-100'),
    ('kraft-recyclable-padded-mailers-5-12x15-case-100', 'kraft-recyclable-padded-mailers-5-12x15-case-100'),
    ('kraft-recyclable-padded-mailers-6-14x18-case-50', 'kraft-recyclable-padded-mailers-6-14x18-case-50'),
    ('industrial-reinforced-kraft-tape-3x375-case-8', 'industrial-reinforced-kraft-tape-3x375-case-8'),
    ('industrial-reinforced-kraft-tape-3x450-black-case-10', 'industrial-reinforced-kraft-tape-3x450-black-case-10'),
    ('custom-printed-kraft-tape', 'custom-printed-kraft-tape')
  ) as v(slug, image_file)
where products.slug = v.slug
and not exists (
  select 1 from product_images pi where pi.product_id = products.id
);
