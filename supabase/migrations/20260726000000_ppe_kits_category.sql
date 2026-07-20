-- New category for Tyvek/general PPE kit products (individual glasses,
-- gloves, and masks stay out of this category — those were part of the
-- Safety & PPE catalog that was archived; this is a fresh, narrower
-- category for bulk protective-clothing kits and cases).
insert into categories (slug, name, description, sort_order)
values ('ppe-kits', 'PPE Kits', 'Bulk protective clothing and response kits — Tyvek coveralls, isolation gowns, and assembled PPE bundles.', 4)
on conflict (slug) do nothing;
