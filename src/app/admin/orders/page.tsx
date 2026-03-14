"use client";

import React, { useState, useEffect, useDeferredValue, useMemo } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Order, OrderStatus } from '@/types/api';
import { formatCurrency } from '@/utils/format';
import Link from 'next/link';
import { Eye, CheckCircle2, Truck, Package, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredOrders = useMemo(() => {
    if (!deferredSearchQuery) return orders;
    const lowerSearch = deferredSearchQuery.toLowerCase();
    return orders.filter(o => 
      o.id.toLowerCase().includes(lowerSearch) ||
      ((o as any).user?.fullName || '').toLowerCase().includes(lowerSearch) ||
      ((o as any).user?.email || '').toLowerCase().includes(lowerSearch) ||
      o.status.toLowerCase().includes(lowerSearch)
    );
  }, [orders, deferredSearchQuery]);

  const STATUS_SEQUENCE = [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllOrders(); 
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getNextStatus = (current: OrderStatus) => {
    const index = STATUS_SEQUENCE.indexOf(current);
    if (index !== -1 && index < STATUS_SEQUENCE.length - 1) {
      return STATUS_SEQUENCE[index + 1];
    }
    return null;
  };

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
      header: 'Mã đơn hàng',
      accessor: (o: Order) => (
        <div className="flex flex-col">
          <span className="font-black text-primary-600">#{o.id.slice(0, 8).toUpperCase()}</span>
          <span className="text-[10px] text-slate-400 font-bold">{o.id}</span>
        </div>
      ),
    },
    {
        header: 'Khách hàng',
        accessor: (o: Order) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{(o as any).user?.fullName || 'Guest'}</span>
            <span className="text-xs text-slate-500">{(o as any).user?.email || ''}</span>
          </div>
        ),
      },
    {
      header: 'Ngày đặt',
      accessor: (o: Order) => (
        <div className="text-slate-500 font-medium">
          {new Date(o.createdAt).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      ),
    },
    {
      header: 'Trạng thái',
      accessor: (o: Order) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${getStatusColor(o.status)}`}>
          {o.status}
        </span>
      ),
    },
    {
      header: 'Tổng tiền',
      accessor: (o: Order) => <div className="font-black text-slate-900">{formatCurrency(o.totalAmount)}</div>,
    },
    {
        header: 'Thao tác',
        className: 'text-right',
        accessor: (o: Order) => {
          const nextStatus = getNextStatus(o.status);
          const canCancel = o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED;

          return (
            <div className="flex items-center justify-end space-x-2">
              {nextStatus && (
                <button 
                  onClick={() => handleStatusUpdate(o.id, nextStatus)}
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                  title={`Xác nhận: ${nextStatus}`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
              {canCancel && (
                <button 
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                      handleStatusUpdate(o.id, OrderStatus.CANCELLED);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Hủy đơn hàng"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
              <Link 
                href={`/admin/orders/${o.id}`}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          );
        },
      },
  ];

  return (
    <DataTable
      title="Quản lý đơn hàng"
      data={filteredOrders}
      columns={columns}
      loading={loading}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}
