"use client";

import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { OrderStatus, Order } from '@/types/api';
import { apiService } from '@/services/api';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const configs = {
    [OrderStatus.PENDING]: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Pending' },
    [OrderStatus.PAID]: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Paid' },
    [OrderStatus.SHIPPED]: { icon: Truck, color: 'text-primary-600 bg-primary-50 border-primary-100', label: 'Shipped' },
    [OrderStatus.DELIVERED]: { icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-100 border-emerald-200', label: 'Delivered' },
    [OrderStatus.CANCELLED]: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100', label: 'Cancelled' },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border px-2.5 py-1 text-xs font-bold leading-none ${config.color}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

const OrderHistoryClient = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getMyOrders();
        setOrders(response || []);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Package className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">No orders yet</h2>
        <p className="mt-2 text-slate-500">You haven't made any transactions with KinShop yet.</p>
        <Link href="/products" className="btn-primary mt-8 px-8 py-3 h-auto text-white">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-500/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Order ID</h3>
                <p className="font-bold text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</h4>
                <p className="text-sm font-bold text-slate-900">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</h4>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div className="hidden sm:block">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</h4>
                <p className="text-[10px] font-medium text-slate-500 truncate max-w-[120px]" title={order.address}>
                   {order.address}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</h4>
                <StatusBadge status={order.status} />
              </div>
            </div>

            <Link 
              href={`/orders/${order.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:border-primary-600 hover:text-primary-600 group-hover:bg-slate-50"
            >
              Details
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-6">
             {order.items.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
                   <span className="text-xs font-bold text-slate-900">{item.productName}</span>
                   <span className="text-[10px] font-black text-slate-400">×{item.quantity}</span>
                </div>
             ))}
              {order.items?.length > 4 && (
                <div className="flex items-center rounded-lg border border-slate-100 bg-slate-100 px-3 py-1.5">
                   <span className="text-[10px] font-bold text-slate-500">+{order.items.length - 4} more</span>
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistoryClient;
