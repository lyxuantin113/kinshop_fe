import { create } from 'zustand';
import { Cart } from '@/types/api';
import { apiService } from '@/services/api';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  totalAmount: number;
  refreshCart: () => Promise<void>;
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
      const itemCount = cartData?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
      const totalAmount = cartData?.items?.reduce((acc: number, item: any) => acc + (Number(item.product.price) * item.quantity), 0) || 0;
      
      set({ cart: cartData, itemCount, totalAmount, loading: false });
    } catch (error) {
      console.error('[CartStore] Failed to refresh cart:', error);
      set({ loading: false });
    }
  },
  
  clearCart: () => set({ cart: null, itemCount: 0, totalAmount: 0 }),
}));
