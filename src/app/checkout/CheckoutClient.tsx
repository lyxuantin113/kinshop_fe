"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CreditCard, Truck, ShieldCheck, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import { formatCurrency } from '@/utils/format';
import Link from 'next/link';

const CheckoutClient = () => {
  const { cart, refreshCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<{ fee: number; threshold: number }>({ fee: 50000, threshold: 1000000 });
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phoneNumber || '');
      setAddress(user.address || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await apiService.getAllConfigs();
        const configArray = Array.isArray(res) ? res : (res?.data || []);
        
        const baseFee = configArray.find((c: any) => c.key === 'SHIPPING_BASE_FEE')?.value;
        const freeThreshold = configArray.find((c: any) => c.key === 'SHIPPING_FREE_THRESHOLD')?.value;

        setConfigs({
          fee: baseFee ? Number(baseFee) : 50000,
          threshold: freeThreshold ? Number(freeThreshold) : 1000000
        });
      } catch (error) {
        console.error('Could not fetch shipping config:', error);
      }
    };

    fetchConfigs();
  }, []);

  const calculateSubtotal = () => {
    return cart?.items?.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0) || 0;
  };

  const handlePlaceOrder = async () => {
    if (!phoneNumber || !address) {
      setFormError('Vui lòng nhập đầy đủ Số điện thoại và Địa chỉ giao hàng.');
      return;
    }

    try {
      setFormError('');
      setLoading(true);
      const response = await apiService.checkout({
        phoneNumber,
        address
      });
      // Assuming response contains the created order
      await refreshCart(); // Clear cart after successful checkout
      router.push(`/orders/${response.id || ''}`);
    } catch (error: any) {
      console.error('Checkout failed:', error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-slate-500">You need to add items to your cart before checking out.</p>
        <Link href="/products" className="btn-primary mt-8 px-8 py-3 h-auto text-white font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = subtotal >= configs.threshold ? 0 : configs.fee;
  const total = subtotal + shipping;

  return (
    <div className="grid gap-12 lg:grid-cols-5">
      {/* Checkout Information */}
      <div className="lg:col-span-3 space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
            <h2 className="flex items-center text-lg font-bold text-slate-900">
              <Truck className="mr-3 h-5 w-5 text-primary-600" />
              Shipping Information
            </h2>
          </div>
          <div className="p-8 space-y-6">
             <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                   <label htmlFor="fullName" className="text-sm font-bold text-slate-700">Họ và tên</label>
                   <input 
                      id="fullName"
                      type="text" 
                      value={user?.fullName || ''}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                   />
                </div>
                <div className="space-y-2">
                   <label htmlFor="phoneNumber" className="text-sm font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                   <input 
                      id="phoneNumber"
                      type="tel" 
                      placeholder="Nhập số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-bold text-slate-700">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                <textarea 
                   id="address"
                   placeholder="Nhập địa chỉ nhận hàng chi tiết"
                   rows={3}
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none"
                />
             </div>
             
             {formError && (
                <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100">
                   {formError}
                </div>
             )}

             <p className="text-xs text-slate-400 font-medium italic">
                * Thông tin này sẽ được lưu cho lần mua hàng sau của bạn.
             </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
            <h2 className="flex items-center text-lg font-bold text-slate-900">
              <CreditCard className="mr-3 h-5 w-5 text-primary-600" />
              Payment Method
            </h2>
          </div>
          <div className="p-8">
             <div className="flex items-center space-x-4 rounded-2xl border-2 border-primary-500 bg-primary-50/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
                   <CreditCard className="h-5 w-5" />
                </div>
                <div>
                   <p className="font-bold text-slate-900">Cash on Delivery (COD)</p>
                   <p className="text-xs text-slate-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
             </div>
          </div>
        </section>

        <Link href="/cart" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Review Your Order</h2>
          
          <div className="mb-8 space-y-4 max-h-60 overflow-y-auto no-scrollbar">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center space-x-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-100">
                  <img
                    src={item.product.images?.find(img => img.isPrimary)?.url || item.product.images?.[0]?.url || '/placeholder.png'}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatCurrency(Number(item.product.price))}</p>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(Number(item.product.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-6">
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

          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn-primary mt-8 w-full h-14 text-base font-bold shadow-xl shadow-primary-500/30 group text-white"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                Confirm and Place Order
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure Transaction Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
