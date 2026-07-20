-- Manual quote/PO-intake path for buyers who can't complete self-serve
-- Checkout — government/institutional purchasing that requires a formal
-- quote or PO number before payment, and disaster-response buyers who may
-- need delivery outside Texas (the self-serve store is Texas-only; this
-- manual, human-reviewed channel is where an exception could be made,
-- decided per request, not automated).
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  buyer_type text not null check (buyer_type in ('government', 'education', 'nonprofit_disaster_response', 'commercial', 'other')),
  po_number text,
  delivery_location text not null,
  items_description text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  created_at timestamptz not null default now()
);

-- No policies: with RLS enabled and zero policies, the anon key has no
-- access at all — only the service-role key (used inside the Edge
-- Function) can read or write, same pattern as orders/order_items.
alter table quote_requests enable row level security;
