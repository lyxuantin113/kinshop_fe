"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Loader2
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Order } from '@/types/api';
import { formatCurrency } from '@/utils/format';
import Link from 'next/link';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          apiService.getAdminStats(),
          apiService.getAllOrders()
        ]);
        
        setStats(statsData);
        // ordersData should have { orders: Order[], total: number } based on repository
      setRecentOrders(ordersData.orders.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

const statsConfigs = [
  { name: 'Tổng doanh thu', value: formatCurrency(stats?.revenue || 0), icon: DollarSign },
  { name: 'Người dùng', value: stats?.users || 0, icon: Users },
  { name: 'Tổng đơn hàng', value: stats?.orders || 0, icon: ShoppingCart },
  { name: 'Sản phẩm', value: stats?.products || 0, icon: Package },
];

if (loading) {
  return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
    </div>
  );
}

return (
  <div className="space-y-8 animate-in fade-in duration-500">
    {/* Header */}
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">System Overview</h1>
      <p className="text-slate-500 mt-1 font-medium italic">Welcome back! Here's what's happening today.</p>
    </div>

    {/* Stats Grid */}
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {statsConfigs.map((stat) => (
        <div key={stat.name} className="sm:text-center group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/10">
          <div className="flex items-center justify-between sm:justify-start">
            <div className="rounded-2xl bg-slate-50 p-3 group-hover:bg-primary-50 transition-colors">
              <stat.icon className="h-6 w-6 text-slate-600 group-hover:text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{stat.name}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mt-1 text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>

    {/* Main Grid */}
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Recent Orders */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Order ID</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-primary-600">
                      <Link href={`/orders/${order.id}`}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700">
                      {(order as any).user?.fullName || 'Guest'}
                    </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                          order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/20' :
                          order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 ring-amber-500/20' :
                          order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 ring-blue-500/20' :
                          'bg-slate-50 text-slate-600 ring-slate-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-black text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 px-2">System Activity</h2>
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/30 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Feature is developing</p>
                  <p className="text-xs text-slate-500">Activity history will be updated here soon.</p>
                  <p className="text-[10px] font-bold text-slate-400">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
