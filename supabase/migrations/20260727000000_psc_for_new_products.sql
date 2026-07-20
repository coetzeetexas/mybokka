-- Fixes a gap left by the 2026-07-19 catalog restructuring: the 12
-- products added after the original NAICS/PSC migration (20260725) never
-- got a PSC classification, since that migration only covered categories
-- that existed at the time. Backfills it now, with newly-verified codes
-- (not reused from the old migration's set, since none of those fit):
--   8135 - Packaging and Packing Bulk Materials (pallet covers, bubble
--     wrap, foam wrap, poly bags, packing tape — confirmed via FSC
--     definition: explicitly includes "Gummed Paper Tape" and "Preformed
--     Cushioning Inserts" as examples)
--   8415 - Clothing, Special Purpose (Tyvek coveralls, isolation gowns,
--     and the PPE response kit, classified by its base garment — directly
--     confirmed: a real NSN for Tyvek coveralls specifically is listed
--     under FSC 8415)
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '8135 - Packaging and Packing Bulk Materials', 99
from products
where slug in (
  'heavy-duty-pallet-cover-51x49-bundle-25',
  'heavy-duty-pallet-cover-40x48-bundle-25',
  'bubble-wrap-roll-12x175',
  'bubble-wrap-roll-24x175',
  'foam-wrap-roll-12x250',
  '10x15-poly-auto-bags-case-1000',
  '12x18-poly-auto-bags-case-1000',
  '2in-clear-packing-tape-case-36',
  '3in-clear-packing-tape-case-24'
)
and status = 'active';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, 'Federal Supply Class (PSC)', '8415 - Clothing, Special Purpose', 99
from products
where slug in ('tyvek-coveralls-hood-case-25', 'disposable-isolation-gowns-case-50', 'general-ppe-response-kit')
and status = 'active';
