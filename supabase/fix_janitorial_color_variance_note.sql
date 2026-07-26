-- The push broom, mop head, and mop handle photos (AI-generated, since no
-- rights to Uline's own photography) each show one arbitrary color, but
-- these 3 items ship in a customer's choice of color on the real Uline
-- product and this storefront has no color selector. Left as-is, that's a
-- real false-advertising risk: a customer could reasonably expect the
-- exact pictured color. Adds an explicit "color may vary" note to each
-- description and a Color spec row.
--
-- Run after seed_janitorial_cleaning.sql (already applied live, before
-- this note existed in that file's original wording).

update products set
  brand_description = 'Angled polypropylene bristles sweep dust and debris fast across open floor space. Available in distinct colors so a facility can color-code brooms by zone and cut the risk of cross-contamination between areas. Ships in one of six available colors (black, yellow, orange, red, blue, or green) based on current stock — the color you receive may differ from the photo shown.'
where slug = 'colored-push-broom-24in';

update products set
  brand_description = '4-ply looped cotton yarn that won''t fray or tangle through repeated laundering — built to outlast the cheaper mop heads that shed strands after a few washes. Fits standard clamp-style mop handles. Ships in white, blue, or green based on current stock — the color you receive may differ from the photo shown.'
where slug = 'cotton-mop-head-24oz-case-6';

update products set
  brand_description = 'A lightweight, comfortable replacement handle with a twist-and-release gate clamp that fits standard cotton and microfiber mop heads. 60" length suits most commercial mopping without extra bending. Ships in one of five available colors (yellow, blue, gray, red, or green) based on current stock — the color you receive may differ from the photo shown.'
where slug = 'fiberglass-mop-handle-60in';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Color', 'Assorted — ships in one of 6 available colors (black, yellow, orange, red, blue, green); may differ from photo', 4
from products
where slug = 'colored-push-broom-24in'
and not exists (
  select 1 from product_specs s where s.product_id = products.id and s.spec_name = 'Color'
);

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Color', 'Assorted — ships in white, blue, or green; may differ from photo', 4
from products
where slug = 'cotton-mop-head-24oz-case-6'
and not exists (
  select 1 from product_specs s where s.product_id = products.id and s.spec_name = 'Color'
);

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Color', 'Assorted — ships in one of 5 available colors (yellow, blue, gray, red, green); may differ from photo', 4
from products
where slug = 'fiberglass-mop-handle-60in'
and not exists (
  select 1 from product_specs s where s.product_id = products.id and s.spec_name = 'Color'
);
