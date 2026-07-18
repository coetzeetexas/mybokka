-- Product weight, used to compute weight-tiered shipping at checkout (see
-- supabase/functions/create-checkout-session). A first-class column rather
-- than parsing it back out of product_specs text on every request.
alter table products add column if not exists weight_lbs numeric(10,2);

-- Backfill from the real weight already recorded in product_specs for items
-- sourced from the actual Uline catalog.
update products p
set weight_lbs = (
  regexp_match(ps.spec_value, '([\d.]+)')
)[1]::numeric
from product_specs ps
where ps.product_id = p.id
  and ps.spec_name in ('Weight', 'Bundle Weight');

-- Estimated weights for items with no recorded spec — either small enough
-- that precision doesn't change the shipping tier (gloves, glasses, sleeves),
-- or (workbench, bolt kit) not sourced from a specific verified catalog entry
-- to begin with. Adjust freely once real figures are known.
update products set weight_lbs = 180 where slug = 'heavy-duty-steel-workbench' and weight_lbs is null;
update products set weight_lbs = 12 where slug = 'grade-8-bolt-assortment-kit' and weight_lbs is null;
update products set weight_lbs = 0.5 where slug = 'cut-resistant-gloves-a4' and weight_lbs is null;
update products set weight_lbs = 0.5 where slug = 'cut-resistant-gloves-a8' and weight_lbs is null;
update products set weight_lbs = 1 where slug = 'ansi-z87-safety-glasses-12pk' and weight_lbs is null;
update products set weight_lbs = 0.5 where slug = 'heavy-duty-gription-work-gloves' and weight_lbs is null;
update products set weight_lbs = 0.3 where slug = 'kevlar-cut-resistant-sleeve' and weight_lbs is null;
update products set weight_lbs = 2 where slug = 'nitrile-industrial-gloves-box-100' and weight_lbs is null;
update products set weight_lbs = 25 where slug = 'portable-welding-screen-6x6' and weight_lbs is null;
update products set weight_lbs = 2 where slug = 'powder-free-latex-exam-gloves-box-100' and weight_lbs is null;
update products set weight_lbs = 5 where slug = 'welding-screen-replacement-curtain-6x6' and weight_lbs is null;
update products set weight_lbs = 0.7 where slug = 'vortex-insulated-waterproof-gloves' and weight_lbs is null;

-- Safety net: any product still missing weight_lbs falls back to a
-- conservative default so shipping calculation never divides by/skips a null.
update products set weight_lbs = 5 where weight_lbs is null;

alter table products alter column weight_lbs set default 5;
alter table products alter column weight_lbs set not null;
