import { supabase } from './supabase';
import type { Category, Product } from '../types';

// Explicit column list (not `*`) so internal-only fields — supplier_ref,
// supplier_description_raw, supplier_updated_at — never reach the client,
// even though RLS already restricts which *rows* the anon key can see.
const PRODUCT_SELECT = `
  id, slug, name, brand_description, short_description, category_id,
  base_price, compare_at_price, sku, status, meta_title, meta_description,
  product_images(*), product_variants(*), product_specs(*), category:categories(*)
`;

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active');

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as Product[]) ?? [];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Product;
}
