-- The 6 original shipping boxes (seed_shipping_boxes.sql) never got a PSC
-- spec at all — caught per user report that PSC "is not showing on all
-- products." Root cause matches the missing-images gap found earlier:
-- 20260725000000_naics_psc_classification.sql only assigns 8115 to
-- products that were already 'active' at the moment it ran, and these 6
-- boxes fell on the wrong side of that timing (unlike the batches added
-- after it, which got an explicit backfill migration — see
-- 20260727000000_psc_for_new_products.sql). FSC 8115 (Boxes, Cartons, and
-- Crates) is the same, correct code already used for this exact product
-- type elsewhere — confirmed via FSC definition, not guessed.
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '8115 - Boxes, Cartons, and Crates', 99
from products
where sku in ('KX-BX-001', 'KX-BX-002', 'KX-BX-003', 'KX-BX-004', 'KX-BX-005', 'KX-BX-006')
and status = 'active'
and not exists (
  select 1 from product_specs s
  where s.product_id = products.id and s.spec_name = 'Federal Supply Class (PSC)'
);
