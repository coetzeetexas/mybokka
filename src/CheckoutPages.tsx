import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useCart } from './CartContext';

export const CheckoutSuccessPage = () => {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const sessionId = params.get('session_id');

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <CheckCircle2 className="w-16 h-16 text-accent-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-navy-900 mb-4">Thank you for your order!</h1>
      <p className="text-gray-600 mb-2">Your payment was successful and a confirmation email is on its way.</p>
      {sessionId && <p className="text-xs text-gray-400 mb-8">Reference: {sessionId}</p>}
      <Link to="/shop" className="text-accent-700 font-medium">Continue shopping</Link>
    </div>
  );
};

export const CheckoutCancelPage = () => (
  <div className="max-w-2xl mx-auto px-4 py-24 text-center">
    <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
    <h1 className="text-3xl font-bold text-navy-900 mb-4">Checkout cancelled</h1>
    <p className="text-gray-600 mb-8">Your cart is still saved — you can pick up right where you left off.</p>
    <Link to="/cart" className="text-accent-700 font-medium">Return to cart</Link>
  </div>
);
