export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_override: number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
  image_url: string | null;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  sort_order: number;
}

export interface ProductPriceTier {
  id: string;
  product_id: string;
  min_quantity: number;
  unit_price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand_description: string;
  short_description: string | null;
  category_id: string;
  base_price: number;
  compare_at_price: number | null;
  sku: string;
  status: 'draft' | 'active' | 'archived';
  meta_title: string | null;
  meta_description: string | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
  product_specs?: ProductSpec[];
  product_price_tiers?: ProductPriceTier[];
  category?: Category;
}

// Given a base unit price and quantity price breaks, returns the price that
// applies at the given quantity — the highest tier whose min_quantity the
// quantity meets, falling back to the base price when no tier qualifies.
export function tieredUnitPrice(basePrice: number, tiers: ProductPriceTier[] | undefined, quantity: number): number {
  if (!tiers || tiers.length === 0) return basePrice;
  const applicable = tiers
    .filter((t) => quantity >= t.min_quantity)
    .sort((a, b) => b.min_quantity - a.min_quantity)[0];
  return applicable ? applicable.unit_price : basePrice;
}

export interface CartItem {
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  slug: string;
  // Present only for variant-less products with quantity price breaks, so
  // the cart can re-derive `price` locally as quantity changes. Display
  // only — checkout always re-validates the real price server-side.
  basePrice?: number;
  priceTiers?: ProductPriceTier[];
}
