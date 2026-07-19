-- Quantity price breaks, e.g. "10+ units: $17.99 each". Empty until real
-- bulk-discount rates are entered per product via Supabase Studio — this
-- migration only adds the capability, it doesn't invent pricing.
create table product_price_tiers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  min_quantity integer not null check (min_quantity >= 1),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, min_quantity)
);

create index product_price_tiers_product_id_idx on product_price_tiers(product_id);

alter table product_price_tiers enable row level security;

create policy "Public can read price tiers of active products" on product_price_tiers
  for select using (
    exists (select 1 from products p where p.id = product_price_tiers.product_id and p.status = 'active')
  );
