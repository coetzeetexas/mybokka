-- Only one product's customer-facing copy ever named the supplier (Uline)
-- directly — every other mention of "Uline" in this repo lives in SQL
-- comments (internal sourcing notes, never sent to the client). Found
-- while auditing product descriptions per user request. Run this once
-- against the live database; the source file (fix_ppe_and_cushioning_pricing.sql)
-- is also corrected for the historical record, but that file has already
-- been run once and won't be run again.
update products
set brand_description = 'Non-abrasive polyethylene foam protects finished and delicate surfaces bubble wrap can mark — cabinetry, coated metal, glass. Rolls out flat with no static cling to fight. Sold in a bundle of 6 rolls, not individually.'
where slug = 'foam-wrap-roll-12x250-bundle-6';
