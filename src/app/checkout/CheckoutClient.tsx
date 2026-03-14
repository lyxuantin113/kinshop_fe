"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CreditCard, Truck, ShieldCheck, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import { formatCurrency } from '@/utils/format';
import Link from 'next/link';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { toast } from 'react-hot-toast';
import { PreviewCheckoutResponse } from '@/types/api';

const CheckoutClient = () => {
  const { cart, refreshCart, loading: cartLoading } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<{ fee: number; threshold: number }>({ fee: 50000, threshold: 1000000 });
  
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewCheckoutResponse | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
        const configArray = Array.isArray(res) ? res : [];
        
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

  const loadPreview = async (code?: string) => {
    try {
      if (code) setCheckingDiscount(true);
      const data = await apiService.previewCheckout(code);
      setPreviewData(data);
      if (code) {
        setAppliedCoupon(code);
        toast.success('Đã áp dụng mã giảm giá!');
      } else {
        setAppliedCoupon('');
      }
    } catch (error: any) {
      if (code) {
        toast.error(error.response?.data?.message || error.message || 'Mã giảm giá không hợp lệ.');
      }
      setAppliedCoupon('');
      setCouponCode('');
    } finally {
      if (code) setCheckingDiscount(false);
    }
  };

  useEffect(() => {
    if (cart && cart.items.length > 0) {
      loadPreview();
    }
  }, [cart]);

  const confirmPlaceOrder = () => {
    if (!phoneNumber || !address) {
      setFormError('Please enter your phone number and address.');
      return;
    }
    setFormError('');
    setIsConfirmOpen(true);
  };



  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const response = await apiService.checkout({
        phoneNumber,
        address,
        couponCode: appliedCoupon || undefined
      });
      await refreshCart(); // Clear cart after successful checkout
      toast.success('Order placed successfully!');
      setIsConfirmOpen(false);
      router.push(`/orders/${response.id || ''}`);
    } catch (error: any) {
      console.error('Checkout failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
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

  // Fallback to 0 if preview hasn't loaded yet
  const subtotal = previewData?.subtotal || 0;
  const shipping = previewData?.shippingFee || 0;
  const discountVal = previewData?.discountAmount || 0;
  const total = previewData?.totalAmount || 0;

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
                   <label htmlFor="fullName" className="text-sm font-bold text-slate-700">Name <span className="text-red-500">*</span></label>
                   <input 
                      id="fullName"
                      type="text" 
                      value={user?.fullName || fullName}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                      onChange={(e) => setFullName(e.target.value)}
                      required
                   />
                </div>
                <div className="space-y-2">
                   <label htmlFor="phoneNumber" className="text-sm font-bold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                   <input 
                      id="phoneNumber"
                      type="tel" 
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                      required
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-bold text-slate-700">Address <span className="text-red-500">*</span></label>
                <textarea 
                   id="address"
                   placeholder="Enter your address"
                   rows={3}
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none"
                   required
                />
             </div>
             
             {formError && (
                <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100">
                   {formError}
                </div>
             )}

             <p className="text-xs text-slate-400 font-medium italic">
                * This information will be saved for your next purchase.
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
                   <p className="text-xs text-slate-500">Pay with cash when you receive your order</p>
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
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá (nếu có)" 
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm uppercase transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none"
                    disabled={checkingDiscount || appliedCoupon !== ''}
                />
                {appliedCoupon ? (
                   <button 
                       onClick={() => { setAppliedCoupon(''); setCouponCode(''); loadPreview(); }}
                       className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                   >
                       Xóa mã
                   </button>
                ) : (
                   <button 
                       onClick={() => loadPreview(couponCode.trim())}
                       disabled={checkingDiscount || !couponCode.trim()}
                       className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:bg-slate-300 min-w-[80px]"
                   >
                       {checkingDiscount ? <Loader2 className="h-4 w-4 animate-spin mx-auto"/> : 'Áp dụng'}
                   </button>
                )}
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
              <span>Tạm tính</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Phí vận chuyển</span>
              <span className={`font-bold ${shipping === 0 ? 'text-emerald-500' : 'text-slate-900'}`}>
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            {discountVal > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Giảm giá ({appliedCoupon})</span>
                <span className="font-bold">-{formatCurrency(discountVal)}</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-4 flex justify-between">
              <span className="text-lg font-bold text-slate-900">Tổng thanh toán</span>
              <span className="text-2xl font-black text-primary-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button 
            onClick={confirmPlaceOrder}
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
      
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handlePlaceOrder}
        title="Xác nhận thanh toán"
        message={
          <div className="space-y-4">
            <p>Vui lòng kiểm tra lại thông tin giao hàng:</p>
            <div className="rounded-xl bg-slate-50 p-4 space-y-2 border border-slate-100">
              <p className="text-sm font-bold text-slate-900">{user?.fullName || fullName}</p>
              <p className="text-sm text-slate-600">SĐT: {phoneNumber}</p>
              <p className="text-sm text-slate-600">Địa chỉ: {address}</p>
            </div>
            {appliedCoupon && (
              <p className="text-sm text-emerald-600">Mã giảm giá đã áp dụng: <strong>{appliedCoupon.toUpperCase()}</strong> (-{formatCurrency(discountVal)})</p>
            )}
            <p>Tổng thanh toán: <strong className="text-primary-600 text-lg">{formatCurrency(total)}</strong></p>
          </div>
        }
        confirmText="Đặt hàng ngay"
        isLoading={loading}
        isDestructive={false}
      />
    </div>
  );
};

export default CheckoutClient;
