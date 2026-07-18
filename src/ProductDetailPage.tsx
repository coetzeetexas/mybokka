import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, ChevronLeft } from 'lucide-react';
import { fetchProductBySlug } from './lib/products';
import { useCart } from './CartContext';
import type { Product, ProductVariant } from './types';

const currency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        setSelectedVariant(p?.product_variants?.[0] ?? null);
        setActiveImage(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-gray-500">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-600 mb-4">We couldn't find that product.</p>
        <Link to="/shop" className="text-accent-700 font-medium">Back to Shop</Link>
      </div>
    );
  }

  const images = product.product_images ?? [];
  const price = selectedVariant?.price_override ?? product.base_price;
  const inStock = !product.product_variants?.length || (selectedVariant?.stock_quantity ?? 0) > 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      variantName: selectedVariant?.name ?? null,
      price,
      quantity: 1,
      imageUrl: images[0]?.url ?? null,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-900 mb-8"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
            {images[activeImage] ? (
              <img
                src={images[activeImage].url}
                alt={images[activeImage].alt_text ?? product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-accent-600' : 'border-transparent'}`}
                >
                  <img src={img.url} alt={img.alt_text ?? ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-navy-900 mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-navy-900">{currency(price)}</span>
            {product.compare_at_price && product.compare_at_price > price && (
              <span className="text-lg text-gray-400 line-through">{currency(product.compare_at_price)}</span>
            )}
          </div>

          {product.product_variants && product.product_variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock_quantity <= 0}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant?.id === variant.id
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'border-gray-200 text-navy-700 hover:border-navy-300'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full sm:w-auto px-8 py-4 bg-accent-700 hover:bg-accent-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
          >
            {inStock ? (added ? 'Added to Cart ✓' : 'Add to Cart') : 'Out of Stock'}
          </button>

          {product.short_description && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.short_description}</p>
          )}

          {/* Trust badges */}
          <div className="grid sm:grid-cols-3 gap-4 py-6 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-navy-700 flex-shrink-0" /> Secure checkout via Stripe
            </div>
            <Link to="/shipping-returns" className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy-900">
              <Truck className="w-5 h-5 text-navy-700 flex-shrink-0" /> Shipping &amp; returns
            </Link>
            <Link to="/shipping-returns" className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy-900">
              <RotateCcw className="w-5 h-5 text-navy-700 flex-shrink-0" /> Easy returns
            </Link>
          </div>

          {product.brand_description && (
            <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">{product.brand_description}</div>
          )}

          {product.product_specs && product.product_specs.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-navy-900 mb-3">Specifications</h2>
              <table className="w-full text-sm">
                <tbody>
                  {product.product_specs
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((spec) => (
                      <tr key={spec.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-500 font-medium">{spec.spec_name}</td>
                        <td className="py-2 text-navy-900">{spec.spec_value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
