import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Mail } from 'lucide-react';
import { EMAIL } from './LegalPages';

// Public routing key for Web3Forms — not a secret. It only tells Web3Forms
// which inbox to deliver submissions to; it grants no account access.
const WEB3FORMS_ACCESS_KEY = 'a5568b50-7dba-4da8-b013-ebeee4be5e58';

const BUYER_TYPES = [
  { value: 'government', label: 'Government / Municipal' },
  { value: 'education', label: 'Educational Institution' },
  { value: 'nonprofit_disaster_response', label: 'Non-Profit / Disaster Response' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export const RequestQuotePage = () => {
  const [searchParams] = useSearchParams();
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [buyerType, setBuyerType] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [itemsDescription, setItemsDescription] = useState(searchParams.get('item') ?? '');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const buyerLabel = BUYER_TYPES.find((t) => t.value === buyerType)?.label ?? buyerType;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Quote Request — ${organizationName || 'New Inquiry'}`,
          from_name: organizationName || contactName || 'KORIX LLC Website',
          replyto: email,
          'Organization / Agency': organizationName,
          'Contact Name': contactName,
          Email: email,
          Phone: phone || '(not provided)',
          'Buyer Type': buyerLabel || '(not specified)',
          'PO Number': poNumber || '(not provided)',
          'Delivery Location': deliveryLocation,
          'Items / Services Needed': itemsDescription,
        }),
      });
      const result = await response.json();
      setStatus(result.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <FileText className="w-10 h-10 mx-auto text-accent-600 mb-4" />
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Request a Quote / PO</h1>
        <p className="text-gray-600">
          For government, institutional, and disaster-response buyers who need a formal quote,
          purchase order, or invoicing.
        </p>
      </div>

      <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm mb-8">
        KORIX LLC ships anywhere in the United States. Submitting this form sends your request
        directly to our team at {EMAIL} — a person reviews every submission and follows up
        directly.
      </div>

      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mb-6">
          Your request has been sent. We'll follow up at the email address you provided.
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-6">
          Something went wrong sending your request. Please try again, or use the "Email Us
          Directly" link below.
        </div>
      )}

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Items / Services Needed *</label>
          <textarea
            value={itemsDescription}
            onChange={(e) => setItemsDescription(e.target.value)}
            required
            rows={6}
            placeholder="List items and quantities, or describe what you're looking for."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-8 py-3 bg-accent-700 hover:bg-accent-800 disabled:bg-accent-700/60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {status === 'submitting' ? 'Sending…' : 'Send Request'}
        </button>

        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-navy-900"
        >
          <Mail className="w-4 h-4" /> Email Us Directly
        </a>
      </form>
    </div>
  );
};
