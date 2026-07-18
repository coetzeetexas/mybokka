import { Link } from 'react-router-dom';
import type { Product } from './types';

const currency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const ProductCard = ({ product }: { product: Product }) => {
  const primaryImage = product.product_images?.find((img) => img.is_primary) ?? product.product_images?.[0];

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-navy-200 hover:shadow-lg transition-all overflow-hidden"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text ?? product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
        )}
      </div>
      <div className="p-4">
        {product.category?.name && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.category.name}</p>
        )}
        <h3 className="font-semibold text-navy-900 mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-navy-900">{currency(product.base_price)}</span>
          {product.compare_at_price && product.compare_at_price > product.base_price && (
            <span className="text-sm text-gray-400 line-through">{currency(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};
