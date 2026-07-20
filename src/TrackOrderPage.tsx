import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, ExternalLink } from 'lucide-react';
import { supabase } from './lib/supabase';

const currency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending Payment',
  paid: 'Paid — Processing',
  fulfilled: 'Shipped',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

interface OrderItem {
  product_name_snapshot: string;
  quantity: number;
  line_total: number;
}

interface TrackedOrder {
  orderNumber: string;
  status: string;
  cancellationReason: string | null;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  createdAt: string;
  items: OrderItem[];
}

export const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('track-order', {
        body: { orderNumber, email },
      });
      if (fnError || data?.error) {
        throw new Error(data?.error ?? 'No order found with that order number and email.');
      }
      setOrder(data as TrackedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No order found with that order number and email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <PackageSearch className="w-10 h-10 mx-auto text-accent-600 mb-4" />
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Track Your Order</h1>
        <p className="text-gray-600">Enter your order number and the email you used at checkout.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="KX-XXXXXXXX"
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 bg-accent-700 hover:bg-accent-800 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Looking up order…' : 'Track Order'}
        </button>
      </form>

      {order && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Order</p>
              <p className="font-bold text-navy-900">{order.orderNumber}</p>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-navy-50 text-navy-800">
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>

          {order.status === 'cancelled' && order.cancellationReason === 'shipping_outside_us' && (
            <div className="p-3 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm mb-6">
              This order was cancelled and fully refunded because the shipping address wasn't
              within the United States — see our Shipping &amp; Returns page for details.
            </div>
          )}

          <div className="space-y-2 mb-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.product_name_snapshot} × {item.quantity}
                </span>
                <span className="text-navy-900 font-medium">{currency(item.line_total)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm border-t border-gray-100 pt-4 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{currency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{currency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{currency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-navy-900 font-bold pt-1">
              <span>Total</span>
              <span>{currency(order.total)}</span>
            </div>
          </div>

          {order.trackingNumber ? (
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p className="text-gray-500 mb-1">Tracking Number</p>
              {order.trackingUrl ? (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent-700 font-medium hover:underline"
                >
                  {order.trackingNumber} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <p className="font-medium text-navy-900">{order.trackingNumber}</p>
              )}
            </div>
          ) : (
            order.status === 'paid' && (
              <p className="text-sm text-gray-500">
                Tracking information hasn't been added yet — you'll also get it by email as soon as
                your order ships.
              </p>
            )
          )}
        </div>
      )}

      <p className="text-center text-sm text-gray-400 mt-8">
        Can't find your order? <Link to="/faq" className="text-accent-700 hover:underline">Check our FAQ</Link> or
        contact support.
      </p>
    </div>
  );
};
