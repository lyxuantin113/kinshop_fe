import React from 'react';
export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { apiService } from '@/services/api';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import { OrderStatus, Order } from '@/types/api';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';

export const metadata: Metadata = {
  title: 'Order History | KinShop',
  description: 'Track your premium orders and view your purchase history at KinShop.',
};

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

import OrderHistoryClient from './OrderHistoryClient';

export default async function OrderHistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Order History</h1>
            <p className="max-w-2xl text-lg text-slate-500">
              Track your current orders and review your premium shopping journals.
            </p>
          </div>

          <OrderHistoryClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
