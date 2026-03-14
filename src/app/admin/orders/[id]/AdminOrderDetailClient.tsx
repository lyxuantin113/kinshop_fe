"use client";

import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronLeft, MapPin, Phone, Calendar, CreditCard, Loader2, ShieldCheck, User } from 'lucide-react';
import { OrderStatus, Order } from '@/types/api';
import { apiService } from '@/services/api';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const configs = {
    [OrderStatus.PENDING]: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Pending' },
    [OrderStatus.PAID]: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Paid' },
    [OrderStatus.SHIPPED]: { icon: Truck, color: 'text-primary-600 bg-primary-50 border-primary-100', label: 'Shipped' },
    [OrderStatus.DELIVERED]: { icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-100 border-emerald-200', label: 'Delivered' },
    [OrderStatus.CANCELLED]: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100', label: 'Cancelled' },
  };

  const config = configs[status] || configs[OrderStatus.PENDING];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1 text-sm font-bold leading-none ${config.color}`}>
      <Icon className="h-4 w-4" />
      <span>{config.label}</span>
    </span>
  );
};

interface AdminOrderDetailClientProps {
  orderId: string;
}

const AdminOrderDetailClient: React.FC<AdminOrderDetailClientProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const STATUS_SEQUENCE = [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

  const getNextStatus = (current: OrderStatus) => {
    const index = STATUS_SEQUENCE.indexOf(current);
    if (index !== -1 && index < STATUS_SEQUENCE.length - 1) {
      return STATUS_SEQUENCE[index + 1];
    }
    return null;
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order) return;
    try {
      if (newStatus === OrderStatus.CANCELLED) setIsCancelling(true);
      await apiService.updateOrderStatus(order.id, newStatus);
      toast.success(`Updated order #${orderId.slice(0,8)} to ${newStatus}`);
      setOrder({ ...order, status: newStatus });
    } catch (err: any) {
      toast.error(err.message || 'Update order status failed');
    } finally {
      if (newStatus === OrderStatus.CANCELLED) {
        setIsCancelling(false);
        setIsConfirmOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAdminOrder(orderId);
        setOrder(response);
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError('Failed to fetch order details for Admin. Please check your access permissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500">
          <XCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">{error || 'Order not found'}</h2>
        <Link href="/admin/orders" className="btn-primary mt-8 px-8 py-3 h-auto text-white font-bold">
          Back to order list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/admin/orders" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to order list
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400">Status:</span>
              <StatusBadge status={order.status} />
          </div>
          
          <div className="flex items-center gap-2 sm:pl-4 sm:border-l border-slate-200">
              {order && getNextStatus(order.status) && (
                <button 
                  onClick={() => handleStatusUpdate(getNextStatus(order.status)!)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm: {getNextStatus(order.status)}
                </button>
              )}
              {order && order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
                <button 
                  onClick={() => setIsConfirmOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel order
                </button>
              )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content: Items & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer & Delivery Card */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
              <h2 className="flex items-center text-lg font-bold text-slate-900">
                <User className="mr-3 h-5 w-5 text-primary-600" />
                Customer information & Delivery
              </h2>
            </div>
            <div className="p-8 grid gap-8 sm:grid-cols-2">
              <div className="space-y-6">
                 <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer name</p>
                      <p className="font-bold text-slate-900">{(order as any).user?.fullName || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{(order as any).user?.email || ''}</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone number</p>
                      <p className="font-bold text-slate-900">{order.phoneNumber || 'N/A'}</p>
                    </div>
                 </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping address</p>
                  <p className="font-bold text-slate-900 leading-relaxed">{order.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Items Card */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
              <h2 className="flex items-center text-lg font-bold text-slate-900">
                <Package className="mr-3 h-5 w-5 text-primary-600" />
                List of products
              </h2>
            </div>
            <div className="divide-y divide-slate-100 px-8">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center py-6 gap-6">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-300">
                     <Package className="h-8 w-8" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-bold text-slate-900">{item.productName}</h3>
                    <p className="text-sm text-slate-500">
                       {item.quantity} × {formatCurrency(Number(item.price))}
                    </p>
                  </div>
                  <p className="font-bold text-slate-900">
                    {formatCurrency(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Summary & Info */}
        <div className="space-y-8">
           {/* Order Info Card */}
           <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order details</h2>
              <div className="space-y-6">
                 <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order date</p>
                       <p className="text-sm font-bold text-slate-900">{formatDate(order.createdAt)}</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-4">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment method</p>
                       <p className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-4">
                    <Package className="h-5 w-5 text-slate-400" />
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                       <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">#{orderId.toUpperCase()}</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Summary Card */}
           <section className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/20">
              <h2 className="text-xl font-bold mb-6 text-primary-400">Financial summary</h2>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">{formatCurrency(order.subtotal)}</span>
                 </div>
                 <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping fee</span>
                    <span className="font-bold text-white">
                       {order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
                    </span>
                 </div>
                 {Number(order.discountAmount) > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                       <span>Discount</span>
                       <span className="font-bold">-{formatCurrency(order.discountAmount)}</span>
                    </div>
                 )}
                 <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total amount</span>
                    <span className="text-2xl font-black text-primary-400">{formatCurrency(order.totalAmount)}</span>
                 </div>
              </div>
           </section>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => handleStatusUpdate(OrderStatus.CANCELLED)}
        title="Cancel order"
        message={<span>Are you sure you want to cancel this order <strong className="text-slate-900">#{orderId.toUpperCase()}</strong>? This action cannot be undone.</span>}
        confirmText="Cancel order"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default AdminOrderDetailClient;
