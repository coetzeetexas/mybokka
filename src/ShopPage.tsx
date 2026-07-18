import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PackageSearch, Search, X } from 'lucide-react';
import { fetchCategories, fetchProducts } from './lib/products';
import { ProductCard } from './ProductCard';
import type { Category, Product } from './types';

export const ShopPage = () => {
  const { category: categorySlug } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([fetchCategories(), fetchProducts(categorySlug)])
      .then(([cats, prods]) => {
        if (cancelled) return;
        setCategories(cats);
        setProducts(prods);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load products.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(term) || (p.short_description ?? '').toLowerCase().includes(term)
    );
  }, [products, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
          {activeCategory ? activeCategory.name : 'Shop All Products'}
        </h1>
        <p className="text-gray-600 max-w-2xl">
          {activeCategory?.description ?? 'Browse our full catalog of quality-vetted industrial and specialty goods.'}
        </p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            to="/shop"
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !categorySlug ? 'bg-navy-900 text-white border-navy-900' : 'border-gray-200 text-navy-700 hover:border-navy-300'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                categorySlug === cat.slug ? 'bg-navy-900 text-white border-navy-900' : 'border-gray-200 text-navy-700 hover:border-navy-300'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {loading && <p className="text-gray-500">Loading products…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <PackageSearch className="w-10 h-10 mx-auto mb-4 text-gray-300" />
          <p>No products here yet — check back soon.</p>
        </div>
      )}
      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <PackageSearch className="w-10 h-10 mx-auto mb-4 text-gray-300" />
          <p>No products match "{search}".</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
