import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { supabase } from './lib/supabase';

const currency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const CartPage = () => {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        },
      });
      if (error || !data?.url) {
        throw new Error('Checkout is not available right now.');
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError('We could not start checkout — please try again in a moment.');
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Your cart is empty</h1>
        <Link to="/shop" className="text-accent-700 font-medium">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Your Cart</h1>

      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId ?? 'base'}`}
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.slug}`} className="font-semibold text-navy-900 hover:text-accent-700">
                {item.name}
              </Link>
              {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
              <p className="font-medium text-navy-900 mt-1">{currency(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId, item.variantId)}
              className="text-gray-400 hover:text-red-600"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-8">
        <span className="text-lg font-semibold text-navy-900">Subtotal</span>
        <span className="text-2xl font-bold text-navy-900">{currency(subtotal)}</span>
      </div>

      {checkoutError && <p className="text-red-600 text-sm mb-4">{checkoutError}</p>}

      <button
        onClick={handleCheckout}
        disabled={checkingOut}
        className="w-full px-8 py-4 bg-accent-700 hover:bg-accent-800 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
      >
        {checkingOut ? 'Redirecting to checkout…' : 'Checkout'}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">
        Shipping and tax calculated at checkout. Secure payment via Stripe.
      </p>
    </div>
  );
};
