"use client";

import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Revenue', value: '$45,231.89', change: '+20.1%', status: 'up', icon: DollarSign },
    { name: 'Active Users', value: '2,350', change: '+15.2%', status: 'up', icon: Users },
    { name: 'Total Orders', value: '12,234', change: '+12.5%', status: 'up', icon: ShoppingCart },
    { name: 'Products in Stock', value: '432', change: '-2.4%', status: 'down', icon: Package },
  ];

  const recentOrders = [
    { id: '#ORD-7234', customer: 'John Doe', status: 'Delivered', amount: '$125.00', date: '2 minutes ago' },
    { id: '#ORD-7233', customer: 'Sarah Smith', status: 'Processing', amount: '$240.50', date: '15 minutes ago' },
    { id: '#ORD-7232', customer: 'Mike Johnson', status: 'Shipped', amount: '$59.00', date: '1 hour ago' },
    { id: '#ORD-7231', customer: 'Emma Wilson', status: 'Pending', amount: '$432.00', date: '3 hours ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/10">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-slate-50 p-3 group-hover:bg-primary-50 transition-colors">
                <stat.icon className="h-6 w-6 text-slate-600 group-hover:text-primary-600" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-bold ${stat.status === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                <span>{stat.change}</span>
                {stat.status === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{stat.name}</p>
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
            <button className="text-sm font-bold text-primary-600 hover:text-primary-700">View All</button>
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-primary-600">{order.id}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700">{order.customer}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/20' :
                          order.status === 'Processing' ? 'bg-amber-50 text-amber-600 ring-amber-500/20' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 ring-blue-500/20' :
                          'bg-slate-50 text-slate-600 ring-slate-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-black text-slate-900">{order.amount}</td>
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-900">New product listed</p>
                  <p className="text-xs text-slate-500">Admin added 'Premium Wireless Headphones' to the catalog.</p>
                  <p className="text-[10px] font-bold text-slate-400">14:24 PM</p>
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
