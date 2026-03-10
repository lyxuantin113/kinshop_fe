"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart } from '@/types/api';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  totalAmount: number;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('[CartContext] Failed to refresh cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearCart = useCallback(() => {
    setCart(null);
  }, []);

  // Fetch cart on user change
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [user, refreshCart]);

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalAmount = cart?.items?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, totalAmount, refreshCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
