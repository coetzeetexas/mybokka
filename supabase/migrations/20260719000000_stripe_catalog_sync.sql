-- Tracks the Stripe Product/Price mirrored for each catalog product, so the
-- Stripe Dashboard shows a real product catalog for reporting purposes.
-- Checkout itself still re-validates price from base_price/price_override at
-- session-creation time (see supabase/functions/create-checkout-session) —
-- these columns are for Stripe-side visibility only, not a source of truth.
alter table products add column if not exists stripe_product_id text;
alter table products add column if not exists stripe_price_id text;
