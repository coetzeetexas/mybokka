import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartItem } from './types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; productId: string; variantId: string | null }
  | { type: 'UPDATE_QTY'; productId: string; variantId: string | null; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] };

const STORAGE_KEY = 'korix_cart_v1';

function sameLine(item: CartItem, productId: string, variantId: string | null) {
  return item.productId === productId && item.variantId === variantId;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.items };
    case 'ADD': {
      const existing = state.items.find((i) => sameLine(i, action.item.productId, action.item.variantId));
      if (existing) {
        return {
          items: state.items.map((i) =>
            sameLine(i, action.item.productId, action.item.variantId)
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => !sameLine(i, action.productId, action.variantId)) };
    case 'UPDATE_QTY':
      return {
        items: state.items
          .map((i) =>
            sameLine(i, action.productId, action.variantId) ? { ...i, quantity: action.quantity } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR':
      return state.items.length === 0 ? state : { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQty: (productId: string, variantId: string | null, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) });
    } catch {
      // ignore corrupt/unavailable cart storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback(
    (productId: string, variantId: string | null) => dispatch({ type: 'REMOVE', productId, variantId }),
    []
  );
  const updateQty = useCallback(
    (productId: string, variantId: string | null, quantity: number) =>
      dispatch({ type: 'UPDATE_QTY', productId, variantId, quantity }),
    []
  );
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const value = useMemo<CartContextValue>(
    () => ({ items: state.items, addItem, removeItem, updateQty, clear, subtotal, itemCount }),
    [state.items, addItem, removeItem, updateQty, clear, subtotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
