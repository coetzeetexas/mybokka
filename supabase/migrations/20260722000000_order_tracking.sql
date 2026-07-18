-- Manually-entered carrier tracking info, populated via Supabase Studio once
-- Uline hands off a shipment and its tracking number becomes known. There's
-- no live carrier API integration, so these stay null until someone enters
-- them — the track-order Edge Function only shows a tracking number when
-- one actually exists, never a placeholder.
alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists tracking_url text;
