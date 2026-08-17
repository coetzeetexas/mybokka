import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, FileText } from 'lucide-react';
import { fetchProductBySlug, fetchProducts } from './lib/products';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductCard } from './ProductCard';
import { usePageMeta } from './hooks';
import { tieredUnitPrice, type Product, type ProductVariant } from './types';

const currency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const ProductReferencePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);

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
        setQuantity(1);
        setRelatedProducts([]);
        if (p?.category?.slug) {
          fetchProducts(p.category.slug)
            .then((prods) => {
              if (cancelled) return;
              setRelatedProducts(prods.filter((rp) => rp.id !== p.id).slice(0, 4));
            })
            .catch(() => {
              if (!cancelled) setRelatedProducts([]);
            });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Every product page previously shared the same generic "Product Details"
  // title/description — a duplicate-content signal across the whole
  // catalog. Set per-product meta here (rather than in the route wrapper)
  // since the product data is only available once this fetch resolves.
  usePageMeta(
    product ? `${product.meta_title || product.name} | KORIX LLC` : 'Product Details | KORIX LLC',
    (product
      ? product.meta_description || product.short_description || product.brand_description
      : 'Product specifications and Federal Supply Class (PSC) classification.'
    ) as string,
    {
      image: product?.product_images?.find((img) => img.is_primary)?.url ?? product?.product_images?.[0]?.url,
      noindex: !loading && !product,
    }
  );

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-gray-500">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-600 mb-4">We couldn't find that product.</p>
        <Link to="/capabilities" className="text-accent-700 font-medium">Back to Capabilities</Link>
      </div>
    );
  }

  const images = product.product_images ?? [];
  const basePrice = selectedVariant?.price_override ?? product.base_price;
  const tiers = product.product_price_tiers ?? [];
  const unitPrice = tieredUnitPrice(basePrice, tiers, quantity);
  const maxQty = selectedVariant ? selectedVariant.stock_quantity : Infinity;

  // Reference-only structured data — no Offer/checkout URL, since this page
  // isn't a purchasable listing. Just the product identity and specs.
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description ?? product.brand_description ?? product.name,
    sku: product.sku,
    image: images.map((img) => img.url),
    brand: { '@type': 'Brand', name: 'KORIX LLC' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Capabilities', to: '/capabilities' },
          ...(product.category ? [{ label: product.category.name, to: `/capabilities/${product.category.slug}` }] : []),
          { label: product.name },
        ]}
      />

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
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-navy-900">{currency(unitPrice)}</span>
            {product.compare_at_price && product.compare_at_price > unitPrice && (
              <span className="text-lg text-gray-400 line-through">{currency(product.compare_at_price)}</span>
            )}
            {tiers.length > 0 && <span className="text-sm text-gray-500">each</span>}
          </div>

          {tiers.length > 0 && (
            <div className="mb-6 border border-gray-100 rounded-lg overflow-hidden">
              <p className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quantity Pricing
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {[{ min_quantity: 1, unit_price: basePrice }, ...tiers]
                    .slice()
                    .sort((a, b) => a.min_quantity - b.min_quantity)
                    .map((tier, i, arr) => {
                      const nextMin = arr[i + 1]?.min_quantity;
                      const isActive = quantity >= tier.min_quantity && (!nextMin || quantity < nextMin);
                      return (
                        <tr key={tier.min_quantity} className={isActive ? 'bg-accent-50' : ''}>
                          <td className="py-1.5 px-3 text-gray-600">
                            {nextMin ? `${tier.min_quantity}–${nextMin - 1}` : `${tier.min_quantity}+`} units
                          </td>
                          <td className="py-1.5 px-3 text-right font-medium text-navy-900">
                            {currency(tier.unit_price)} each
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {product.product_variants && product.product_variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
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

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-navy-900"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-navy-900 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {quantity > 1 && (
              <span className="text-sm text-gray-500">Total: {currency(unitPrice * quantity)}</span>
            )}
          </div>

          <Link
            to={{ pathname: '/request-quote', search: `?item=${encodeURIComponent(`${product.name} x${quantity}`)}` }}
            className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 bg-accent-700 hover:bg-accent-800 text-white font-semibold rounded-lg transition-colors mb-8"
          >
            <FileText className="w-4 h-4" /> Request a Quote for This Item
          </Link>

          {product.short_description && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.short_description}</p>
          )}

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

      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Related Supply Capabilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
