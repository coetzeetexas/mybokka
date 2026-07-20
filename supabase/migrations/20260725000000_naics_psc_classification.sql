-- Product Service Codes (PSC / Federal Supply Class) for procurement-officer
-- credibility, requested to help the site read correctly to government and
-- institutional buyers researching KORIX before award. Unlike NAICS (a
-- business-level classification tied to SAM.gov registration — added
-- separately, in index.html and the About page, with careful non-
-- overclaiming wording since it's not confirmed against KORIX's actual
-- registration), PSC classifies the item itself and isn't something a
-- business registers — referencing it here is standard, objective product
-- classification info, not a compliance claim about the seller.
--
-- Each code below was verified against its Federal Supply Classification
-- definition (not guessed):
--   4240 - Safety and Rescue Equipment (Safety & PPE)
--   3920 - Materials Handling Equipment, Nonself-Propelled (Facilities & Material Handling)
--   5306 - Bolts (Fasteners & Hardware — only fits the current bolt-kit
--     product; if screw/nut/stud products are added later they belong
--     under sibling codes 5305/5310/5307, not this one)
--   8115 - Boxes, Cartons, and Crates (Shipping & Packaging — fits the
--     shipping boxes; the packing-list envelopes are a looser fit for
--     this code but share the category, so left as-is rather than split)
-- Shop Equipment (the steel workbench) has no PSC added — no FSC/PSC
-- code for workbenches could be confirmed, so it's left out rather than
-- guessed.
insert into product_specs (product_id, spec_name, spec_value, sort_order)
select p.id, 'Federal Supply Class (PSC)', v.psc, 99
from products p
join categories c on c.id = p.category_id
join (values
  ('safety-ppe', '4240 - Safety and Rescue Equipment'),
  ('material-handling', '3920 - Materials Handling Equipment, Nonself-Propelled'),
  ('fasteners-hardware', '5306 - Bolts'),
  ('shipping-packaging', '8115 - Boxes, Cartons, and Crates')
) as v(category_slug, psc) on v.category_slug = c.slug
where p.status = 'active';
