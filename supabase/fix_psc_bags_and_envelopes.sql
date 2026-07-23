-- Corrects a PSC misclassification found by auditing every active
-- product's "Federal Supply Class (PSC)" spec against real FSC
-- definitions. 7 products were filed under 8135 (Packaging and Packing
-- Bulk Materials) but actually belong under 8105 (Bags and Sacks) —
-- confirmed via real government NSN precedent: FSC 8105 explicitly
-- covers "Shipping and Protective Envelopes" (a real NSN titled
-- "Packing List Envelope" is filed there) and "Bags and Sacks" (real
-- NSN examples for plastic/poly bags are filed there too, matching our
-- poly auto bags closely). 8135's own examples (wrapping paper, gummed
-- tape, cushioning inserts, corrugated paper, wire, staples) don't
-- include bags or envelopes — that class is for bulk wrap/cushioning
-- material, not the bag/envelope item itself.
--
-- Affected: the 2 poly auto bags added 2026-07-20 (already live with
-- the wrong code) and the 5 kraft mailers added this session (also
-- already live — this session's own seed file has already been
-- corrected at the source, but the rows it inserted still need fixing
-- since the file won't be re-run).
--
-- Run this once against the live database.
update product_specs
set spec_value = '8105 - Bags and Sacks'
where spec_name = 'Federal Supply Class (PSC)'
and product_id in (
  select id from products where slug in (
    '10x15-poly-auto-bags-case-1000',
    '12x18-poly-auto-bags-case-1000',
    'kraft-recyclable-paper-mailers-6-14x16-case-350',
    'kraft-recyclable-padded-mailers-0-7x9-case-300',
    'kraft-recyclable-padded-mailers-2-12x9-case-100',
    'kraft-recyclable-padded-mailers-5-12x15-case-100',
    'kraft-recyclable-padded-mailers-6-14x18-case-50'
  )
);
