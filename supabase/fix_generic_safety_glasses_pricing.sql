-- The original "ANSI Z87.1 Safety Glasses (12-Pack)" product ($42.00) had
-- no supplier_ref and no product_specs — it predates this session's
-- practice of sourcing every product from a real, verified Uline listing.
-- Investigated per user request after adding Flash/Skyhawk: real Uline
-- safety glasses (Flash S-17944C, Skyhawk S-12451SM, Rambler S-24606C) all
-- cluster around $5.25-5.75/pair at the 12-unit volume tier — none close
-- to the ~$3.50/pair ($42/12) this product implied. At the same ~45%
-- markup convention used catalog-wide, $42 implied a ~$29 wholesale cost
-- for 12 pairs, well below the real ~$63-69 range.
--
-- Fix: re-anchor this product to Rambler™ Safety Glasses - Clear
-- (S-24606C, confirmed directly from its own Uline product page: $5.75/
-- pair at the 12-unit tier, FogArmor anti-fog coating, nylon/TPR temple,
-- ANSI Z87.1+, 99.9% UV protection, 0.07 lbs/unit). New base_price =
-- 12 x $5.75 x 1.45 = $100.05, rounded to $99.99.
--
-- slug is intentionally left unchanged (ansi-z87-safety-glasses-12pk) to
-- preserve the existing indexed URL — only name/description/price/specs/
-- identity change, not the address search engines already know it by.
update products set
  name = 'Rambler™ Safety Glasses - Clear Lens, 12-Pack',
  brand_description = 'FogArmor anti-fog coating and a flexible nylon/TPR frame with an adjustable strap mean these hold up to a full shift, not just a warehouse shelf. ANSI Z87.1+ rated with 99.9% UV protection, sold by the dozen so a full crew is covered from one order.',
  short_description = 'Clear lens wraparound safety glasses, ANSI Z87.1+, FogArmor anti-fog coating, 12-pack.',
  base_price = 99.99,
  sku = 'KX-SP-017',
  supplier_ref = 'S-24606C',
  weight_lbs = 1
where slug = 'ansi-z87-safety-glasses-12pk';

-- Also clears the stale Stripe IDs from the old $42 price, so the next
-- sync-stripe-catalog run creates a fresh Stripe Price at the corrected
-- amount instead of silently keeping the old one (Stripe Prices are
-- immutable, and the sync function only creates a new one when it detects
-- a mismatch against the *current* stripe_price_id's amount — but since
-- this product's Stripe Product name is also changing, clearing both
-- forces a clean re-create rather than a same-ID rename).
update products set stripe_product_id = null, stripe_price_id = null
where slug = 'ansi-z87-safety-glasses-12pk';

insert into product_specs (product_id, spec_name, spec_value, sort_order)
select id, s.spec_name, s.spec_value, s.sort_order from products,
  (values
    ('Lens Material', 'Polycarbonate', 1),
    ('Lens Color', 'Clear', 2),
    ('Coating', 'FogArmor anti-fog, anti-scratch', 3),
    ('Frame', 'Nylon with TPR temple tips', 4),
    ('ANSI Rating', 'ANSI Z87.1+', 5),
    ('UV Protection', '99.9% UVA/UVB', 6),
    ('Bundle Quantity', '12 pairs', 7)
  ) as s(spec_name, spec_value, sort_order)
where slug = 'ansi-z87-safety-glasses-12pk';
