-- KORIX LLC storefront schema: catalog, variants, specs, orders.
-- Run via `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  parent_id uuid references categories(id),
  sort_order int not null default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand_description text not null default '',
  short_description text,
  category_id uuid not null references categories(id),
  base_price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  sku text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  -- Internal-only fields: never selected by the public anon policy, never rendered client-side.
  supplier_ref text unique,
  supplier_description_raw text,
  supplier_updated_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_id_idx on products(category_id);
create index products_status_idx on products(status);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  sku text not null,
  price_override numeric(10,2),
  stock_quantity int not null default 0,
  attributes jsonb not null default '{}'::jsonb,
  image_url text
);
create index product_variants_product_id_idx on product_variants(product_id);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false
);
create index product_images_product_id_idx on product_images(product_id);

create table product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  spec_name text not null,
  spec_value text not null,
  sort_order int not null default 0
);
create index product_specs_product_id_idx on product_specs(product_id);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_email text not null,
  customer_name text,
  shipping_address jsonb,
  billing_address jsonb,
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  product_name_snapshot text not null,
  sku_snapshot text not null,
  unit_price numeric(10,2) not null,
  quantity int not null,
  line_total numeric(10,2) not null
);
create index order_items_order_id_idx on order_items(order_id);

-- Atomic stock decrement, called from the stripe-webhook Edge Function via
-- service role. A single UPDATE avoids the read-then-write race a client-side
-- decrement would have under concurrent checkouts.
create or replace function decrement_variant_stock(variant_id uuid, qty int)
returns void
language sql
security definer
set search_path = public
as $$
  update product_variants
  set stock_quantity = greatest(stock_quantity - qty, 0)
  where id = variant_id;
$$;

-- Only the service role (used by Edge Functions) may call this — never anon/authenticated.
revoke execute on function decrement_variant_stock(uuid, int) from public, anon, authenticated;
grant execute on function decrement_variant_stock(uuid, int) to service_role;

-- Row Level Security ---------------------------------------------------

alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table product_specs enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Catalog is public read-only. RLS restricts *rows* (status = 'active');
-- the app's Supabase queries additionally select an explicit column list
-- (see src/lib/products.ts) so supplier_ref / supplier_description_raw /
-- supplier_updated_at never reach the client even though RLS doesn't hide columns.

create policy "Public can read categories" on categories
  for select using (true);

create policy "Public can read active products" on products
  for select using (status = 'active');

create policy "Public can read variants of active products" on product_variants
  for select using (
    exists (select 1 from products p where p.id = product_variants.product_id and p.status = 'active')
  );

create policy "Public can read images of active products" on product_images
  for select using (
    exists (select 1 from products p where p.id = product_images.product_id and p.status = 'active')
  );

create policy "Public can read specs of active products" on product_specs
  for select using (
    exists (select 1 from products p where p.id = product_specs.product_id and p.status = 'active')
  );

-- No policies are created for orders / order_items: with RLS enabled and
-- zero policies, the anon key has no access at all. Only the service-role
-- key (used exclusively inside Edge Functions) can read or write them.
