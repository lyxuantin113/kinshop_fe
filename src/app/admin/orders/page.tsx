"use client";

import React, { useState, useDeferredValue, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Order, OrderStatus } from '@/types/api';
import { formatCurrency } from '@/utils/format';
import Link from 'next/link';
import { Eye, CheckCircle2, Truck, Package, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Confirm Modal state for cancellation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: response, isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-orders', page, deferredSearchQuery],
    queryFn: () => apiService.getAllOrders({ page, limit, status: deferredSearchQuery || undefined }),
  });

  const orders = response?.orders || [];
  const total = response?.total || 0;
  const totalPages = response?.totalPages || 1;

  const filteredOrders = orders; // Now filtered on BE if search is implemented, otherwise client-side filtering below is redundant but harmless if orders is already small

  const STATUS_SEQUENCE = [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      if (newStatus === OrderStatus.CANCELLED) {
        setIsCancelling(true);
      }
      await apiService.updateOrderStatus(orderId, newStatus);
      toast.success(`Updated order #${orderId.slice(0,8)} to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Update order status failed');
    } finally {
      if (newStatus === OrderStatus.CANCELLED) {
        setIsCancelling(false);
        setIsConfirmOpen(false);
        setOrderToCancel(null);
      }
    }
  };

  const confirmCancel = (orderId: string) => {
    setOrderToCancel(orderId);
    setIsConfirmOpen(true);
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
      header: 'Order ID',
      accessor: (o: Order) => (
        <div className="flex flex-col">
          <span className="font-black text-primary-600">#{o.id.slice(0, 8).toUpperCase()}</span>
          <span className="text-[10px] text-slate-400 font-bold">{o.id}</span>
        </div>
      ),
    },
    {
        header: 'Customer',
        accessor: (o: Order) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{(o as any).user?.fullName || 'Guest'}</span>
            <span className="text-xs text-slate-500">{(o as any).user?.email || ''}</span>
          </div>
        ),
      },
    {
      header: 'Order date',
      accessor: (o: Order) => (
        <div className="text-slate-500 font-medium">
          {new Date(o.createdAt).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })}
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
      header: 'Total amount',
      accessor: (o: Order) => <div className="font-black text-slate-900">{formatCurrency(o.totalAmount)}</div>,
    },
    {
        header: 'Actions',
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
                  title={`Confirm: ${nextStatus}`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
              {canCancel && (
                <button 
                  onClick={() => confirmCancel(o.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Cancel order"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
              <Link 
                href={`/admin/orders/${o.id}`}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                title="View details"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          );
        },
      },
  ];

  return (
    <>
      <DataTable
        title="Orders Management"
        data={filteredOrders}
        columns={columns}
        loading={loading}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => orderToCancel && handleStatusUpdate(orderToCancel, OrderStatus.CANCELLED)}
        title="Cancel Order"
        message={<span>Are you sure you want to cancel order <strong className="text-slate-900">#{orderToCancel?.slice(0,8).toUpperCase()}</strong>? This action cannot be undone.</span>}
        confirmText="Cancel Order"
        isLoading={isCancelling}
      />
    </>
  );
}
