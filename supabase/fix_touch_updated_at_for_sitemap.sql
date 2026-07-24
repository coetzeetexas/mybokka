-- One-time catch-up for the missing updated_at trigger
-- (20260728000000_products_updated_at_trigger.sql fixes this going
-- forward). Every product below had a real, customer-visible change this
-- session — price, weight, description, a new photo, or a new PSC spec —
-- but updated_at was never touched, so the sitemap's <lastmod> still
-- shows each row's original creation date. Run once, after the trigger
-- migration.
update products
set updated_at = now()
where slug in (
  -- Price/weight/description corrections
  'heavy-duty-pallet-cover-48x42-bundle-25',
  'heavy-duty-pallet-cover-51x49-bundle-25',
  '10x15-poly-auto-bags-case-1000',
  '12x18-poly-auto-bags-case-1000',
  'disposable-isolation-gowns-case-50',
  'tyvek-coveralls-hood-case-25',
  'bubble-wrap-roll-12x175',
  'foam-wrap-roll-12x250-bundle-6',
  -- New photos + new PSC spec (previously had neither)
  'shipping-box-4x4x4-bundle-25',
  'shipping-box-5x5x5-bundle-25',
  'shipping-box-10x10x10-bundle-25',
  'shipping-box-12x12x12-bundle-25',
  'shipping-box-16x12x12-bundle-25',
  'shipping-box-16x12x8-bundle-25'
);
