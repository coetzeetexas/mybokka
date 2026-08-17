import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Mail } from 'lucide-react';
import { EMAIL } from './LegalPages';

const BUYER_TYPES = [
  { value: 'government', label: 'Government / Municipal' },
  { value: 'education', label: 'Educational Institution' },
  { value: 'nonprofit_disaster_response', label: 'Non-Profit / Disaster Response' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

function buildMailto(fields: {
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  buyerType: string;
  poNumber: string;
  deliveryLocation: string;
  itemsDescription: string;
}): string {
  const buyerLabel = BUYER_TYPES.find((t) => t.value === fields.buyerType)?.label ?? fields.buyerType;
  const subject = `Quote Request — ${fields.organizationName || 'New Inquiry'}`;
  const body = [
    `Organization / Agency: ${fields.organizationName}`,
    `Contact Name: ${fields.contactName}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone || '(not provided)'}`,
    `Buyer Type: ${buyerLabel || '(not specified)'}`,
    `PO Number: ${fields.poNumber || '(not provided)'}`,
    `Delivery Location: ${fields.deliveryLocation}`,
    '',
    'Items Needed:',
    fields.itemsDescription,
  ].join('\n');
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

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
  const [opened, setOpened] = useState(false);

  const mailtoHref = buildMailto({
    organizationName,
    contactName,
    email,
    phone,
    buyerType,
    poNumber,
    deliveryLocation,
    itemsDescription,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = mailtoHref;
    setOpened(true);
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
        KORIX LLC ships anywhere in the United States. Filling out this form opens a pre-filled
        email in your own email client, addressed to {EMAIL} — nothing is sent until you review
        it and hit send.
      </div>

      {opened && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mb-6">
          Your email client should have opened with a pre-filled message. Review it and hit send
          to submit your request. If it didn't open, use the "Email Us Directly" link below.
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
          className="w-full px-8 py-3 bg-accent-700 hover:bg-accent-800 text-white font-semibold rounded-lg transition-colors"
        >
          Open Pre-Filled Email
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
