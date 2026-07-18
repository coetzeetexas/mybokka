-- KORIX LLC currently only sells/ships to Texas addresses. Stripe Checkout
-- can only restrict shipping by country, not by state, so state enforcement
-- happens in the stripe-webhook function after payment: any order whose
-- shipping address isn't Texas is auto-refunded and cancelled. This column
-- records why, for auditing in Supabase Studio without cross-referencing Stripe.
alter table orders add column if not exists cancellation_reason text;
