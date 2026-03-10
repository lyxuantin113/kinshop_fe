import React from 'react';
export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { apiService } from '@/services/api';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import { OrderStatus, Order } from '@/types/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order History | KinShop',
  description: 'Track your premium orders and view your purchase history with KinShop.',
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const configs = {
    [OrderStatus.PENDING]: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Processing' },
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

export default async function OrderHistoryPage() {
  let orders: Order[] = [];
  try {
    orders = await apiService.getMyOrders();
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Order History</h1>
            <p className="max-w-2xl text-lg text-slate-500">
              Track your current orders and review your past premium purchases.
            </p>
          </div>

          {orders.length > 0 ? (
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
                        <p className="text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</h4>
                        <p className="text-sm font-bold text-slate-900">${order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</h4>
                        <p className="text-sm font-bold text-slate-900">{order.items.length}</p>
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
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                  
                  {/* Order Preview Items */}
                  <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-6">
                     {order.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
                           <span className="text-xs font-bold text-slate-900">{item.productName}</span>
                           <span className="text-[10px] font-black text-slate-400">×{item.quantity}</span>
                        </div>
                     ))}
                     {order.items.length > 4 && (
                        <div className="flex items-center rounded-lg border border-slate-100 bg-slate-100 px-3 py-1.5">
                           <span className="text-[10px] font-bold text-slate-500">+{order.items.length - 4} more</span>
                        </div>
                     )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Package className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">No orders found</h2>
              <p className="mt-2 text-slate-500">You haven't placed any premium orders yet.</p>
              <Link href="/products" className="btn-primary mt-8 px-8 py-3 h-auto">
                Explore Products
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
