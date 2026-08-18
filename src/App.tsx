import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { TermsPage, PrivacyPage, CookiePage, EMAIL } from './LegalPages';
import { AboutPage, FaqPage } from './TrustPages';
import { RequestQuotePage } from './RequestQuotePage';
import { usePageMeta, useInView } from './hooks';
import {
  ChevronRight,
  Menu,
  X,
  Mail,
  MapPin,
  Truck,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Package,
  SearchX,
  FileText,
  ClipboardCheck,
  Landmark,
  Palette,
  Globe,
  BookOpen,
} from 'lucide-react';

const SUPPLY_CAPABILITIES = [
  { icon: Package, name: 'Sourcing & Procurement' },
  { icon: ClipboardCheck, name: 'PSC / NAICS Classification' },
  { icon: Truck, name: 'Nationwide Fulfillment' },
];

const DIGITAL_SERVICES = [
  { icon: FileText, name: 'PCB Design & Engineering' },
  { icon: Palette, name: 'Graphic Design' },
  { icon: Globe, name: 'Web Design' },
  { icon: BookOpen, name: 'Community Resource Directories' },
];

// Pentagon layout: one node per service, radiating from a central hub —
// the hero's visual literally is the "network" of what KORIX connects.
const NETWORK_NODES = [
  { icon: FileText, label: 'PCB Design & Engineering', top: 8, left: 50 },
  { icon: Palette, label: 'Graphic Design', top: 38, left: 88 },
  { icon: Globe, label: 'Web Design', top: 82, left: 74 },
  { icon: BookOpen, label: 'Community Directories', top: 82, left: 26 },
  { icon: Truck, label: 'Federal Supply', top: 38, left: 12 },
];

// Tileable PCB-trace pattern (right-angle traces + via dots) used behind the
// hero instead of a generic dot grid — reinforces the PCB/engineering line
// of business rather than reading as a stock SaaS background.
const CIRCUIT_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
    <g fill='none' stroke='#ffffff' stroke-width='1'>
      <path d='M12 12 H70 V70 H128'/>
      <path d='M12 128 V82 H58'/>
      <path d='M128 12 V58 H100 V128'/>
      <path d='M70 12 V40'/>
      <path d='M12 70 H40'/>
    </g>
    <g fill='#ffffff'>
      <circle cx='12' cy='12' r='2.5'/>
      <circle cx='70' cy='70' r='2.5'/>
      <circle cx='128' cy='12' r='2.5'/>
      <circle cx='12' cy='128' r='2.5'/>
      <circle cx='100' cy='128' r='2.5'/>
    </g>
  </svg>`
)}")`;

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
    { to: '/request-quote', label: 'Request a Quote' },
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
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
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
    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: CIRCUIT_PATTERN, backgroundSize: '140px 140px' }} />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-700/20 rounded-full blur-3xl animate-float" />
    <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    <div className="absolute top-0 right-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/90 text-sm font-medium mb-8 animate-fade-in-down">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
            </span>
            <MapPin className="w-4 h-4 text-accent-500" />
            <span>Dallas, Texas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] animate-fade-in-up">
            Engineered Supply.
            <span className="block mt-2 pb-2 bg-gradient-to-r from-accent-400 via-white to-primary-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Engineered Design.
            </span>
          </h1>
          <p className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-white/70 mb-10 leading-relaxed">
            KORIX LLC is a Texas-registered small business supplying consumable supplies to
            federal agencies, and building digital services including community resource
            directories. SAM.gov registration submitted &middot; UEI FERJZSV2LC45.
          </p>
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12">
            <Link
              to="/request-quote"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent-700 hover:bg-accent-600 text-white font-semibold rounded-xl shadow-lg shadow-accent-900/40 transition-all hover:scale-105"
            >
              Request a Quote / PO
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all"
            >
              See What We Do
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center lg:justify-start divide-x divide-white/10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            {[
              { icon: ClipboardCheck, label: 'NAICS 423840' },
              { icon: FileText, label: 'PSC-Classified' },
              { icon: Truck, label: 'Nationwide Shipping' },
              { icon: Landmark, label: 'SAM.gov Submitted' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 sm:px-5 py-3 text-white/80 text-xs sm:text-sm font-mono">
                <Icon className="w-4 h-4 text-accent-400 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Visual: a service "network" radiating from a central hub — the
            graphic doubles as a map of what KORIX actually connects. */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-square max-w-md mx-auto">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
              {NETWORK_NODES.map((node, i) => {
                const d = `M50 50 L${node.left} ${node.top}`;
                return (
                  <g key={node.label}>
                    <path d={d} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
                    <circle r="1.1" fill="#FF5C5C">
                      <animateMotion dur="3.5s" repeatCount="indefinite" begin={`${i * 0.6}s`} path={d} />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* Central hub */}
            <div
              className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 shadow-2xl shadow-accent-900/50 flex items-center justify-center animate-pulse-slow"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <Landmark className="w-7 h-7 text-white" />
            </div>

            {/* Service nodes */}
            {NETWORK_NODES.map((node, i) => (
              <div
                key={node.label}
                className="absolute flex flex-col items-center gap-1.5 animate-float"
                style={{
                  top: `${node.top}%`,
                  left: `${node.left}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center">
                  <node.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-medium text-white/60 text-center w-24 leading-tight">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// What We Do Section — static, no live product catalog
const WhatWeDoSection = () => {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="services" className="py-20 bg-white scroll-mt-24">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full text-navy-700 text-sm font-medium mb-4">
            <Package className="w-4 h-4" />
            What We Do
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Federal Supply &amp; Digital Services</h2>
          <p className="text-gray-600">Two lines of work, one accountable Texas-registered business.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-navy-900 mb-6">Federal Supply</h3>
            <p className="text-gray-700 mb-6">
              Consumable supply sourcing and fulfillment for federal, institutional, and
              commercial buyers — sourced to your specification and ready for RFQ.
            </p>
            <ul className="space-y-4">
              {SUPPLY_CAPABILITIES.map((cap) => (
                <li key={cap.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-navy-900">{cap.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy-900 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Digital Services</h3>
            <ul className="space-y-4">
              {DIGITAL_SERVICES.map((svc) => (
                <li key={svc.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svc.icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <span className="font-medium text-white">{svc.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-white/50 mt-6">
              See our About page for full descriptions of each service.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/about"
            className="text-accent-700 font-medium inline-flex items-center gap-1 hover:text-accent-600"
          >
            Learn more about us <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Trust Badges Section
const TrustBadgesSection = () => {
  const badges = [
    { icon: FileText, title: 'PSC-Classified Products', desc: 'Individual products are classified by Federal Supply Class (PSC) for procurement reference.' },
    { icon: ClipboardCheck, title: 'NAICS 423840', desc: 'Industrial Supplies Merchant Wholesalers — our applicable NAICS classification.' },
    { icon: Landmark, title: 'Formal RFQ / PO Process', desc: 'Request a Quote / PO for formal quotes, purchase orders, or invoicing.' },
    { icon: Truck, title: 'Nationwide US Shipping', desc: 'We ship to addresses across the United States.' },
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
      <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Questions About a Solicitation or Quote?</h2>
      <p className="text-lg text-gray-600 mb-8">
        Browse our FAQ or email us directly — we respond to every message.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/faq"
          className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-lg transition-colors"
        >
          Read FAQ
        </Link>
        <a
          href={`mailto:${EMAIL}`}
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
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
            KORIX LLC is a Texas-registered federal contracting supplier (SAM.gov registration
            submitted, UEI FERJZSV2LC45) and digital services provider based in Dallas, Texas.
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

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/about" className="text-white/60 hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-white/60 hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/request-quote" className="text-white/60 hover:text-white transition-colors">
                Request a Quote / PO
              </Link>
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
          SAM.gov Registration Submitted &ndash; Active Status Pending
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
    'KORIX LLC | Federal Contracting & Digital Services | Dallas, Texas',
    'Korix LLC is a Texas-registered small business providing consumable supply solutions to federal government agencies, and digital services including community resource directories. SAM.gov registration submitted. UEI FERJZSV2LC45.'
  );

  return (
    <PageShell>
      <HeroSection />
      <WhatWeDoSection />
      <TrustBadgesSection />
      <SupportSection />
    </PageShell>
  );
};

// Route wrappers — each owns its own title/meta.
const RequestQuoteRoute = () => {
  usePageMeta(
    'Request a Quote / PO | KORIX LLC',
    'Government, institutional, and disaster-response buyers can request a formal quote, purchase order, or invoicing from KORIX LLC.'
  );
  return (
    <PageShell>
      <RequestQuotePage />
    </PageShell>
  );
};

const AboutRoute = () => {
  const navigate = useNavigate();
  usePageMeta('About Us | KORIX LLC', 'KORIX LLC is a Texas-registered small business supplying federal government agencies and building digital services.');
  return <AboutPage onBack={() => navigate('/')} />;
};

const FaqRoute = () => {
  const navigate = useNavigate();
  usePageMeta('FAQ | KORIX LLC', 'Frequently asked questions about federal contracting, RFQs, and supply capabilities.');
  return <FaqPage onBack={() => navigate('/')} />;
};

const TermsRoute = () => {
  const navigate = useNavigate();
  usePageMeta('Terms & Conditions | KORIX LLC', 'Terms and conditions for using the KORIX LLC website and submitting quote requests or purchase orders.');
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
          The page you're looking for doesn't exist or may have moved. Check the URL, or head
          back home.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/about"
            className="px-8 py-3 bg-accent-700 hover:bg-accent-800 text-white font-semibold rounded-lg transition-colors"
          >
            Learn About KORIX LLC
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
        <Route path="/request-quote" element={<RequestQuoteRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/faq" element={<FaqRoute />} />
        <Route path="/terms" element={<TermsRoute />} />
        <Route path="/privacy" element={<PrivacyRoute />} />
        <Route path="/cookies" element={<CookiesRoute />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
