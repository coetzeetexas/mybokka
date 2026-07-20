import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useCart } from './CartContext';
import { supabase } from './lib/supabase';

const BUYER_TYPES = [
  { value: 'government', label: 'Government / Municipal' },
  { value: 'education', label: 'Educational Institution' },
  { value: 'nonprofit_disaster_response', label: 'Non-Profit / Disaster Response' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

const cartAsText = (items: ReturnType<typeof useCart>['items']) =>
  items.map((i) => `- ${i.name}${i.variantName ? ` (${i.variantName})` : ''} x${i.quantity}`).join('\n');

export const RequestQuotePage = () => {
  const { items } = useCart();
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [buyerType, setBuyerType] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [itemsDescription, setItemsDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // CartContext hydrates from localStorage asynchronously, so `items` is
  // still [] on first render even with a saved cart — a plain useState
  // initializer would miss it. Prefill once items actually arrive, but
  // only once, so it doesn't clobber anything the buyer has since typed.
  useEffect(() => {
    if (!prefilled && items.length > 0) {
      setItemsDescription(cartAsText(items));
      setPrefilled(true);
    }
  }, [items, prefilled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('submit-quote-request', {
        body: {
          organizationName,
          contactName,
          email,
          phone,
          buyerType,
          poNumber,
          deliveryLocation,
          itemsDescription,
        },
      });
      if (fnError || data?.error) {
        throw new Error(data?.error ?? 'Could not submit request — please try again.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit request — please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <CheckCircle2 className="w-16 h-16 text-accent-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-navy-900 mb-4">Request Received</h1>
        <p className="text-gray-600 mb-8">
          Thank you — we've received your quote request and will follow up at the email or phone number you
          provided.
        </p>
        <Link to="/shop" className="text-accent-700 font-medium">Continue browsing the catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <FileText className="w-10 h-10 mx-auto text-accent-600 mb-4" />
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Request a Quote / PO</h1>
        <p className="text-gray-600">
          For government, institutional, and disaster-response buyers who need a formal quote, purchase order, or
          invoicing rather than our self-serve checkout.
        </p>
      </div>

      <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm mb-8">
        KORIX LLC ships anywhere in the United States. This form is reviewed individually by a
        person — use it when you need a formal quote, purchase order, or invoicing rather than
        paying by card through self-serve checkout.
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Agency Name *</label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Type *</label>
          <select
            value={buyerType}
            onChange={(e) => setBuyerType(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white"
          >
            <option value="" disabled>Select one</option>
            {BUYER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PO Number (if available)</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Location *</label>
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="City, State"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Items Needed *</label>
          <textarea
            value={itemsDescription}
            onChange={(e) => setItemsDescription(e.target.value)}
            required
            rows={6}
            placeholder="List items and quantities, or describe what you're looking for."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 bg-accent-700 hover:bg-accent-800 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};
