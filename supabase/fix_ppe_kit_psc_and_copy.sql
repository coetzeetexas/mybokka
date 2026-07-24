-- Two fixes for the General PPE Response Kit, per user report:
--
-- 1) Its Federal Supply Class spec was missing on the live database even
--    though 20260727000000_psc_for_new_products.sql should have added it
--    (8415 - Clothing, Special Purpose) — same pattern as the shipping
--    boxes and other gaps found this session: a migration that didn't
--    fully apply live. Guarded insert, safe if it's actually already there.
-- 2) Its brand_description said "Built by KORIX from individually-sourced
--    components, not a single manufacturer SKU" — the only product in the
--    whole catalog that named the company that way. Reworded to say the
--    same thing (it's an assembled kit, not one manufacturer's SKU)
--    without the self-referential phrasing.

update products
set brand_description = 'One Tyvek coverall, one pair of nitrile gloves, one N95 respirator, and a pair of safety goggles — grab-and-go protection for a single responder without ordering four separate line items. Assembled from individually-sourced components, not a single manufacturer SKU.'
where slug = 'general-ppe-response-kit';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '8415 - Clothing, Special Purpose', 99
from products
where slug = 'general-ppe-response-kit'
and not exists (
  select 1 from product_specs s
  where s.product_id = products.id and s.spec_name = 'Federal Supply Class (PSC)'
);
