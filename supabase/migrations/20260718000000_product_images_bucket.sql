-- Public storage bucket for product photography.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read; writes are restricted to the service role (used only by
-- server-side scripts/Edge Functions, never the anon client).
create policy "Public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
