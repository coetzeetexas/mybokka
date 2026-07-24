-- products.updated_at had a default of now() at insert time but nothing
-- ever touched it again on UPDATE — every price/spec correction this
-- session (pallet covers, PPE pricing, bubble/foam wrap, etc.) left it
-- showing the row's original creation date. That's the exact field the
-- sitemap function uses for <lastmod>, so real content changes were never
-- signaling freshness to crawlers. categories has no updated_at column
-- (only products and orders do), and orders aren't public/indexed, so
-- this only needs to cover products.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();
