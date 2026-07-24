import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { TermsPage, PrivacyPage, CookiePage } from './LegalPages';
import { AboutPage, ShippingReturnsPage, FaqPage } from './TrustPages';
import { ShopPage } from './ShopPage';
import { ProductDetailPage } from './ProductDetailPage';
import { CartPage } from './CartPage';
import { CheckoutSuccessPage, CheckoutCancelPage } from './CheckoutPages';
import { TrackOrderPage } from './TrackOrderPage';
import { RequestQuotePage } from './RequestQuotePage';
import { ProductCard } from './ProductCard';
import { useCart } from './CartContext';
import { usePageMeta, useInView } from './hooks';
import { fetchCategories, fetchProducts } from './lib/products';
import type { Category, Product } from './types';
import {
  ChevronRight,
  Menu,
  X,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Wrench,
  Cog,
  HardHat,
  Package,
  ShoppingCart,
  SearchX,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, typeof Package> = {
  'shop-equipment': Wrench,
  'fasteners-hardware': Cog,
  'material-handling': Truck,
  'safety-ppe': HardHat,
  'shipping-packaging': Package,
};

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/korixllc/', Icon: Linkedin },
  { label: 'Twitter / X', href: 'https://x.com/korixllc', Icon: Twitter },
  { label: 'Facebook', href: 'https://facebook.com/share/19FYsqNXJm/', Icon: Facebook },
  { label: 'YouTube', href: 'https://www.youtube.com/@korixllc', Icon: Youtube },
];

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/shipping-returns', label: 'Shipping & Returns' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center group">
            <div className="rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105">
              <img
                src="/WhatsApp_Image_2026-06-15_at_06.33.37.jpeg"
                alt="KORIX LLC"
                className="h-28 sm:h-36 lg:h-48 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-medium text-navy-700 hover:text-accent-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/cart" className="relative p-2 text-navy-700 hover:text-accent-700 transition-colors" aria-label="Cart">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-700 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/cart" className="relative p-2 text-navy-900" aria-label="Cart">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-700 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-navy-900" />
              ) : (
                <Menu className="w-6 h-6 text-navy-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-navy-900 font-medium py-2 hover:text-accent-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24 sm:py-28 lg:py-36">
    <div className="absolute inset-0 opacity-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-700/20 rounded-full blur-3xl animate-float" />
    <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    <div className="absolute top-0 right-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/90 text-sm font-medium mb-8 animate-fade-in-down">
            <MapPin className="w-4 h-4 text-accent-500" />
            <span>Shipping Nationwide, Based in Texas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] animate-fade-in-up">
            Industrial &amp; Specialty Equipment,
            <span className="block mt-2 pb-2 bg-gradient-to-r from-accent-400 via-white to-primary-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Curated and Delivered
            </span>
          </h1>
          <p className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-white/70 mb-10 leading-relaxed">
            KORIX LLC sources and stands behind quality-vetted industrial and specialty goods —
            clear specs, honest shipping timelines, real support. Shipping to addresses across
            the United States.
          </p>
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent-700 hover:bg-accent-600 text-white font-semibold rounded-xl shadow-lg shadow-accent-900/40 transition-all hover:scale-105"
            >
              Shop the Catalog
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all"
            >
              Browse Categories
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <ShieldCheck className="w-5 h-5 text-accent-400" /> Secure Stripe Checkout
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Truck className="w-5 h-5 text-accent-400" /> Nationwide US Shipping
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <RotateCcw className="w-5 h-5 text-accent-400" /> Easy Returns
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Package className="w-5 h-5 text-accent-400" /> Products Sourced from Top-Tier Industry Suppliers
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-sm" />
            <div className="relative h-full grid grid-cols-2 gap-4 p-8">
              {[Wrench, Cog, Truck, HardHat].map((Icon, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center animate-float"
                  style={{ animationDelay: `${i * 0.7}s` }}
                >
                  <Icon className="w-10 h-10 text-accent-400" />
                </div>
              ))}
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-full bg-accent-700/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent-700" />
              </div>
              <div>
                <p className="text-navy-900 font-bold text-sm leading-none">Secure Checkout</p>
                <p className="text-gray-500 text-xs mt-1">Powered by Stripe</p>
              </div>
            </div>
            <div
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3 animate-float"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="w-10 h-10 rounded-full bg-navy-900/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-navy-900" />
              </div>
              <div>
                <p className="text-navy-900 font-bold text-sm leading-none">Quality-Vetted</p>
                <p className="text-gray-500 text-xs mt-1">Every product, checked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Featured Categories Section
const FeaturedCategoriesSection = () => {
  const { ref, isInView } = useInView(0.1);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section id="categories" className="py-20 bg-white scroll-mt-24">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full text-navy-700 text-sm font-medium mb-4">
            <Package className="w-4 h-4" />
            Browse the Catalog
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600">Quality-vetted industrial and specialty goods, organized the way you actually shop.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.slice(0, 10).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? Package;
            return (
              <Link
                key={cat.id}
                to={`/shop/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-navy-900 aspect-[3/4] flex flex-col justify-end shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                {cat.image_url && (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                <div className="relative p-5">
                  <div className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-base leading-tight block">{cat.name}</span>
                  <span className="inline-flex items-center gap-1 text-white/60 text-xs mt-2 group-hover:text-white group-hover:gap-2 transition-all">
                    Shop now <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Featured Products Section
const FeaturedProductsSection = () => {
  const { ref, isInView } = useInView(0.1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((p) => setProducts(p.slice(0, 8)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">Featured Products</h2>
          <Link to="/shop" className="text-accent-700 font-medium inline-flex items-center gap-1 hover:text-accent-600">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading && <p className="text-gray-500">Loading…</p>}
        {!loading && products.length === 0 && (
          <p className="text-gray-500">New products are on the way — check back soon.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Trust Badges Section
const TrustBadgesSection = () => {
  const badges = [
    { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Payments processed securely by Stripe — we never see your card number.' },
    { icon: Truck, title: 'Nationwide US Shipping', desc: 'We ship to addresses across the United States. Processing and shipping time shown before you pay.' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day returns on eligible items — see our policy for details.' },
    { icon: MessageCircle, title: 'Real Support', desc: 'Live chat and email support from a real, Texas-registered business.' },
  ];

  return (
    <section className="py-20 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <badge.icon className="w-7 h-7 text-accent-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{badge.title}</h3>
              <p className="text-white/60 text-sm">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Support Section (replaces the old agency lead-gen contact form)
const SupportSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Questions Before You Order?</h2>
      <p className="text-lg text-gray-600 mb-8">
        Use the live chat in the corner of your screen, browse our FAQ, or email us directly —
        we respond to every message.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/faq"
          className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-lg transition-colors"
        >
          Read FAQ
        </Link>
        <a
          href="mailto:korixllc@outlook.com"
          className="px-6 py-3 border border-navy-200 text-navy-900 hover:bg-navy-50 font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Mail className="w-4 h-4" /> Email Us
        </a>
      </div>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="bg-navy-950 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="inline-block bg-white rounded-lg overflow-hidden">
              <img
                src="/WhatsApp_Image_2026-06-15_at_06.33.37.jpeg"
                alt="KORIX LLC"
                className="h-28 w-auto object-contain px-3 py-2"
              />
            </div>
          </div>
          <p className="text-white/60 max-w-md mb-6">
            KORIX LLC sources and stands behind quality-vetted industrial and specialty goods,
            shipped from Texas, USA.
          </p>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent-600 flex items-center justify-center transition-colors"
              >
                <Icon className="w-5 h-5 text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-semibold mb-4">Shop</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/shop" className="text-white/60 hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-white/60 hover:text-white transition-colors">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="font-semibold mb-4">Customer Care</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/about" className="text-white/60 hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/shipping-returns" className="text-white/60 hover:text-white transition-colors">
                Shipping &amp; Returns
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-white/60 hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="text-white/60 hover:text-white transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <Link to="/request-quote" className="text-white/60 hover:text-white transition-colors">
                Request a Quote / PO
              </Link>
            </li>
            <li>
              <a
                href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-catalog`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                Download Catalog (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/10 space-y-4">
        <p className="text-white/30 text-xs text-center tracking-wide">
          KORIX LLC &ndash; Texas Limited Liability Company &nbsp;&bull;&nbsp; EIN: 42-2983677 &nbsp;&bull;&nbsp; UEI: FERJZSV2LC45 &nbsp;&bull;&nbsp; Registered in the State of Texas
        </p>
        <p className="text-white/30 text-xs text-center tracking-wide">
          Registered with SAM.gov &ndash; Eligible to Bid on Federal Contracts
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            Copyright &copy; {new Date().getFullYear()} KORIX LLC. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-white/60 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// Shared page shell for non-legal routes (Nav + spacer + content + Footer)
const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-white font-sans antialiased">
    <Navigation />
    <div className="h-44 sm:h-52 lg:h-64" aria-hidden="true" />
    <main>{children}</main>
    <Footer />
  </div>
);

// Home Page
const HomePage = () => {
  usePageMeta(
    'KORIX LLC | Industrial & Specialty Goods | Texas, USA',
    'KORIX LLC is a Texas-registered distributor of quality-vetted industrial and specialty goods. Secure Stripe checkout, clear shipping times, easy returns.'
  );

  return (
    <PageShell>
      <HeroSection />
      <FeaturedCategoriesSection />
      <FeaturedProductsSection />
      <TrustBadgesSection />
      <SupportSection />
    </PageShell>
  );
};

// Route wrappers — each owns its own title/meta. Shop and Product set their
// own per-category / per-product meta internally (see ShopPage.tsx /
// ProductDetailPage.tsx) since only they have the data to differentiate it —
// a wrapper-level generic title here would give every category and product
// page the same duplicate title/description.
const ShopRoute = () => (
  <PageShell>
    <ShopPage />
  </PageShell>
);

const ProductRoute = () => (
  <PageShell>
    <ProductDetailPage />
  </PageShell>
);

const CartRoute = () => {
  usePageMeta('Your Cart | KORIX LLC', 'Review your cart and check out securely.', { noindex: true });
  return (
    <PageShell>
      <CartPage />
    </PageShell>
  );
};

const CheckoutSuccessRoute = () => {
  usePageMeta('Order Confirmed | KORIX LLC', 'Your order was placed successfully.', { noindex: true });
  return (
    <PageShell>
      <CheckoutSuccessPage />
    </PageShell>
  );
};

const CheckoutCancelRoute = () => {
  usePageMeta('Checkout Cancelled | KORIX LLC', 'Your checkout was cancelled — your cart is still saved.', {
    noindex: true,
  });
  return (
    <PageShell>
      <CheckoutCancelPage />
    </PageShell>
  );
};

const TrackOrderRoute = () => {
  usePageMeta('Track Your Order | KORIX LLC', 'Look up your order status and tracking information.', {
    noindex: true,
  });
  return (
    <PageShell>
      <TrackOrderPage />
    </PageShell>
  );
};

const RequestQuoteRoute = () => {
  usePageMeta(
    'Request a Quote / PO | KORIX LLC',
    'Government, institutional, and disaster-response buyers can request a formal quote or purchase order instead of self-serve checkout.'
  );
  return (
    <PageShell>
      <RequestQuotePage />
    </PageShell>
  );
};

const AboutRoute = () => {
  const navigate = useNavigate();
  usePageMeta('About Us | KORIX LLC', 'KORIX LLC is a Texas-registered distributor of quality-vetted industrial and specialty goods.');
  return <AboutPage onBack={() => navigate('/')} />;
};

const ShippingReturnsRoute = () => {
  const navigate = useNavigate();
  usePageMeta('Shipping & Returns | KORIX LLC', 'Processing time, shipping time, and how returns work at KORIX LLC.');
  return <ShippingReturnsPage onBack={() => navigate('/')} />;
};

const FaqRoute = () => {
  const navigate = useNavigate();
  usePageMeta('FAQ | KORIX LLC', 'Frequently asked questions about ordering, shipping, and returns.');
  return <FaqPage onBack={() => navigate('/')} />;
};

const TermsRoute = () => {
  const navigate = useNavigate();
  usePageMeta('Terms & Conditions | KORIX LLC', 'Terms and conditions for using the KORIX LLC website and purchasing products.');
  return <TermsPage onBack={() => navigate('/')} />;
};

const PrivacyRoute = () => {
  const navigate = useNavigate();
  usePageMeta('Privacy Policy | KORIX LLC', 'How KORIX LLC collects, uses, and protects your information.');
  return <PrivacyPage onBack={() => navigate('/')} />;
};

const CookiesRoute = () => {
  const navigate = useNavigate();
  usePageMeta('Cookie Policy | KORIX LLC', 'How KORIX LLC uses cookies on this website.');
  return <CookiePage onBack={() => navigate('/')} />;
};

const NotFoundRoute = () => {
  usePageMeta('Page Not Found | KORIX LLC', "The page you're looking for doesn't exist or may have moved.", {
    noindex: true,
  });
  return (
    <PageShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <SearchX className="w-12 h-12 mx-auto text-gray-300 mb-6" />
        <p className="text-accent-700 font-bold text-sm tracking-wide mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have moved. Check the URL, or head back
          to the catalog.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="px-8 py-3 bg-accent-700 hover:bg-accent-800 text-white font-semibold rounded-lg transition-colors"
          >
            Browse the Catalog
          </Link>
          <Link
            to="/"
            className="px-8 py-3 border border-gray-200 text-navy-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopRoute />} />
        <Route path="/shop/:category" element={<ShopRoute />} />
        <Route path="/product/:slug" element={<ProductRoute />} />
        <Route path="/cart" element={<CartRoute />} />
        <Route path="/checkout/success" element={<CheckoutSuccessRoute />} />
        <Route path="/checkout/cancel" element={<CheckoutCancelRoute />} />
        <Route path="/track-order" element={<TrackOrderRoute />} />
        <Route path="/request-quote" element={<RequestQuoteRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/shipping-returns" element={<ShippingReturnsRoute />} />
        <Route path="/faq" element={<FaqRoute />} />
        <Route path="/terms" element={<TermsRoute />} />
        <Route path="/privacy" element={<PrivacyRoute />} />
        <Route path="/cookies" element={<CookiesRoute />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
