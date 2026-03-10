"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Order, OrderStatus } from '@/types/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Assuming we have a getAllOrders endpoint, otherwise using getMyOrders for placeholder demo
        const response = await apiService.getMyOrders(); 
        setOrders(response);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'bg-emerald-50 text-emerald-600 ring-emerald-500/20';
      case OrderStatus.PAID: return 'bg-blue-50 text-blue-600 ring-blue-500/20';
      case OrderStatus.PENDING: return 'bg-amber-50 text-amber-600 ring-amber-500/20';
      case OrderStatus.SHIPPED: return 'bg-indigo-50 text-indigo-600 ring-indigo-500/20';
      case OrderStatus.CANCELLED: return 'bg-rose-50 text-rose-600 ring-rose-500/20';
      default: return 'bg-slate-50 text-slate-600 ring-slate-500/20';
    }
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: (o: Order) => <div className="font-black text-primary-600">{o.id}</div>,
    },
    {
      header: 'Date',
      accessor: (o: Order) => (
        <div className="text-slate-500 font-medium">
          {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (o: Order) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${getStatusColor(o.status)}`}>
          {o.status}
        </span>
      ),
    },
    {
      header: 'Total',
      accessor: (o: Order) => <div className="font-black text-slate-900">${o.totalAmount.toFixed(2)}</div>,
    },
  ];

  const handlePrint = (o: Order) => window.print();

  return (
    <DataTable
      title="Order Management"
      data={orders}
      columns={columns}
      loading={loading}
      onPrint={handlePrint}
    />
  );
}
