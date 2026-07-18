// Supabase Edge Function (Deno). Deploy with: supabase functions deploy sync-products
// Intended to run on a schedule (pg_cron or an external cron hitting this URL).
//
// NOT WIRED UP YET: fetchSupplierCatalog() below is a placeholder. AllProducts.com's
// actual API/feed shape hasn't been documented, so this function isolates everything
// supplier-specific to that one function — once real API docs are in hand, only
// fetchSupplierCatalog() needs to change. Everything after it (the upsert logic)
// is written against the stable internal shape (SupplierProduct) and won't need
// to change when the adapter does.
//
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ALLPRODUCTS_API_KEY
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Stable internal shape the rest of this function works against, independent
// of whatever AllProducts.com's real API/feed returns.
interface SupplierProduct {
  supplierRef: string;
  name: string;
  descriptionRaw: string;
  categoryName: string;
  price: number;
  sku: string;
  images: string[];
  specs: Record<string, string>;
}

// TODO: replace with a real call to AllProducts.com once their API/feed
// documentation is available. Until then this returns an empty list, so a
// scheduled run is a safe no-op rather than a crash.
async function fetchSupplierCatalog(): Promise<SupplierProduct[]> {
  console.warn('fetchSupplierCatalog() is a placeholder — AllProducts.com integration not yet implemented.');
  return [];
}

async function upsertCategory(supabase: ReturnType<typeof createClient>, name: string): Promise<string> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { data: existing } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error } = await supabase
    .from('categories')
    .insert({ slug, name, sort_order: 0 })
    .select('id')
    .single();
  if (error || !created) throw new Error(`Failed to create category ${name}: ${error?.message}`);
  return created.id as string;
}

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const catalog = await fetchSupplierCatalog();

  let created = 0;
  let updated = 0;

  for (const item of catalog) {
    const categoryId = await upsertCategory(supabase, item.categoryName);
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('supplier_ref', item.supplierRef)
      .maybeSingle();

    // brand_description is intentionally left untouched on updates — it's
    // hand-rewritten or produced by an explicit rewrite pass, never overwritten
    // by raw supplier copy on a re-sync.
    const row = {
      slug,
      name: item.name,
      category_id: categoryId,
      base_price: item.price,
      sku: item.sku,
      supplier_ref: item.supplierRef,
      supplier_description_raw: item.descriptionRaw,
      supplier_updated_at: new Date().toISOString(),
    };

    let productId: string;
    if (existingProduct) {
      await supabase.from('products').update(row).eq('id', existingProduct.id);
      productId = existingProduct.id as string;
      updated++;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert({ ...row, brand_description: item.descriptionRaw, status: 'draft' })
        .select('id')
        .single();
      if (insertError || !inserted) continue;
      productId = inserted.id as string;
      created++;
    }

    // Images/specs are replaced wholesale on each sync — simplest correct
    // behavior since the supplier is the source of truth for these fields.
    await supabase.from('product_images').delete().eq('product_id', productId);
    if (item.images.length > 0) {
      await supabase.from('product_images').insert(
        item.images.map((url, i) => ({ product_id: productId, url, sort_order: i, is_primary: i === 0 }))
      );
    }

    await supabase.from('product_specs').delete().eq('product_id', productId);
    const specEntries = Object.entries(item.specs);
    if (specEntries.length > 0) {
      await supabase.from('product_specs').insert(
        specEntries.map(([spec_name, spec_value], i) => ({ product_id: productId, spec_name, spec_value, sort_order: i }))
      );
    }
  }

  return new Response(JSON.stringify({ created, updated, total: catalog.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
