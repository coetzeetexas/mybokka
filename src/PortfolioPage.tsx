import {
  ArrowLeft, Layout, Sparkles, Globe, ShoppingCart, Code2, Cpu, CreditCard, BarChart3, ShieldCheck,
} from 'lucide-react';

const PLATFORMS = [
  { name: 'WordPress', icon: Globe },
  { name: 'Shopify', icon: ShoppingCart },
  { name: 'Webflow', icon: Code2 },
  { name: 'React', icon: Cpu },
  { name: 'Stripe', icon: CreditCard },
  { name: 'Google Analytics', icon: BarChart3 },
  { name: 'Cloudflare', icon: ShieldCheck },
];

export const PortfolioPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page header */}
      <div className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="text-accent-400 text-sm font-semibold uppercase tracking-widest">Our Work</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Website Design Portfolio
          </h1>
          <p className="text-white/60 max-w-xl text-lg">
            Concept builds showing the range of design styles and industries we work across —
            and every one of them is built to pair with AI-powered content and social media marketing
            so your new site doesn't just look great, it keeps growing.
          </p>
        </div>
      </div>

      {/* Agency Intro */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-accent-700 to-navy-900 bg-clip-text text-transparent">
            Website Design, Built Around Your Business
          </h2>
          <p className="text-xl font-semibold text-navy-900 mb-2">
            Designers and developers who focus on turning visitors into customers.
          </p>
          <div className="w-20 h-1 mx-auto my-6 rounded-full bg-gradient-to-r from-accent-600 to-navy-900" />
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Every project pairs thoughtful design with the platforms and tools that keep your
            business running day to day — from the CMS your team edits, to the payment processor
            that gets you paid, to the analytics that show what's working.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
            {PLATFORMS.map((platform) => (
              <div key={platform.name} className="flex flex-col items-center gap-2">
                <platform.icon className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-gray-700">{platform.name}</span>
              </div>
            ))}
          </div>

          <p className="text-xl font-bold text-navy-900 mt-14">
            Let's build something great together.
          </p>
        </div>
      </div>

      {/* Portfolio Images */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <img src="/portfolio-set-1.png" alt="Portfolio concepts: Aetheri, Streamline SaaS, Terra Journeys, Urban Bloom, Nexus Financial, The Daily Bake" className="w-full h-auto rounded-xl shadow-lg" />
        <img src="/portfolio-set-2.png" alt="Portfolio concepts: Aurora, Orbital, Virtus, Symmetry, Helios, Genesis" className="w-full h-auto rounded-xl shadow-lg" />

        {/* Upsell CTA */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-700 p-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 text-accent-400" />
            Beyond the Website
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            A great design is just the starting point
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            Every site we design can be paired with Claude AI training for your team and ongoing
            social media marketing — so the traffic keeps coming and your team knows what to do with it.
            Ask us about bundling all three.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-700 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
