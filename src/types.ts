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
  category?: Category;
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
}
