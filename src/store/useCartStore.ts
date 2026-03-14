import { create } from 'zustand';
import { Cart } from '@/types/api';
import { apiService } from '@/services/api';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  totalAmount: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,
  itemCount: 0,
  totalAmount: 0,

  refreshCart: async () => {
    try {
      set({ loading: true });
      const cartData = await apiService.getCart();
      const itemCount = cartData?.summary?.totalItems || 0;
      const totalAmount = cartData?.summary?.totalPrice || 0;

      set({ cart: cartData, itemCount, totalAmount, loading: false });
    } catch (error) {
      console.error('[CartStore] Failed to refresh cart:', error);
      set({ loading: false });
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    try {
      set({ loading: true });
      const cartData = await apiService.addToCart(productId, quantity);
      const itemCount = cartData?.summary?.totalItems || 0;
      const totalAmount = cartData?.summary?.totalPrice || 0;
      set({ cart: cartData, itemCount, totalAmount, loading: false });
    } catch (error) {
      console.error('[CartStore] Add to cart failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      set({ loading: true });
      const cartData = await apiService.updateCartItem(productId, quantity);
      const itemCount = cartData?.summary?.totalItems || 0;
      const totalAmount = cartData?.summary?.totalPrice || 0;
      set({ cart: cartData, itemCount, totalAmount, loading: false });
    } catch (error) {
      console.error('[CartStore] Update quantity failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  removeItem: async (productId: string) => {
    try {
      set({ loading: true });
      const cartData = await apiService.removeFromCart(productId);
      const itemCount = cartData?.summary?.totalItems || 0;
      const totalAmount = cartData?.summary?.totalPrice || 0;
      set({ cart: cartData, itemCount, totalAmount, loading: false });
    } catch (error) {
      console.error('[CartStore] Remove item failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  clearCart: () => set({ cart: null, itemCount: 0, totalAmount: 0 }),
}));
