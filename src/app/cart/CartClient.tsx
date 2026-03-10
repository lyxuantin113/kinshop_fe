"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Cart, CartItem } from '@/types/api';
import { apiService } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';

interface CartClientProps {
  initialCart: Cart | null;
}

const CartClient: React.FC<CartClientProps> = ({ initialCart }) => {
  const { cart: contextCart, refreshCart, loading: cartLoading } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cart = contextCart || initialCart;
  const [configs, setConfigs] = useState<{ fee: number; threshold: number }>({ fee: 50000, threshold: 1000000 });

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await apiService.getAllConfigs();
        // The interceptor already unwrapped { status, data }, so res is the array
        const configArray = Array.isArray(res) ? res : (res?.data || []);
        
        const baseFee = configArray.find((c: any) => c.key === 'SHIPPING_BASE_FEE')?.value;
        const freeThreshold = configArray.find((c: any) => c.key === 'SHIPPING_FREE_THRESHOLD')?.value;

        setConfigs({
          fee: baseFee ? Number(baseFee) : 50000,
          threshold: freeThreshold ? Number(freeThreshold) : 1000000
        });
      } catch (error) {
        console.error('Could not fetch shipping config, using defaults:', error);
      }
    };

    fetchConfigs();
  }, []);

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setLoading(true);
      await apiService.updateCartItem(productId, newQuantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setLoading(true);
      await apiService.removeFromCart(productId);
      await refreshCart();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cart?.items?.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0) || 0;
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-slate-500">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="btn-primary mt-8 px-8 py-3 h-auto text-white">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = subtotal >= configs.threshold ? 0 : configs.fee;
  const total = subtotal + shipping;

  return (
    <div className="grid gap-12 lg:grid-cols-3">
      {/* Items List */}
      <div className="lg:col-span-2 space-y-6">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg">
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
              <img
                src={item.product.images?.find(img => img.isPrimary)?.url || item.product.images?.[0]?.url || '/placeholder.png'}
                alt={item.product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-1 flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.product.name}</h3>
                  <p className="text-sm text-slate-500">ID: {item.productId.slice(0, 8).toUpperCase()}</p>
                </div>
                <p className="text-lg font-bold text-primary-600">{formatCurrency(Number(item.product.price) * item.quantity)}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center rounded-lg border border-slate-200 p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={loading || item.quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900">
                    {loading || cartLoading ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={loading}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  disabled={loading}
                  className="flex items-center space-x-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Shipping</span>
              <span className={`font-bold ${shipping === 0 ? 'text-emerald-500' : 'text-slate-900'}`}>
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-primary-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button 
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full h-14 text-base font-bold shadow-xl shadow-primary-500/30 group text-white"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Secure Encrypted Connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
