"use client";

import React, { useState, useDeferredValue, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { formatCurrency, formatDate } from '@/utils/format';
import { Tag, Calendar, Users, Percent, DollarSign } from 'lucide-react';
import DiscountModal from '@/components/admin/DiscountModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminDiscountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  
  // Confirm Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { data: response, isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-discounts'],
    queryFn: () => apiService.getDiscounts(),
  });

  const discounts = Array.isArray(response) ? response : (response as any)?.data || [];

  const filteredDiscounts = useMemo(() => {
    if (!deferredSearchQuery) return discounts;
    const lowerSearch = deferredSearchQuery.toLowerCase();
    return discounts.filter((d: any) => 
      d.code.toLowerCase().includes(lowerSearch) ||
      (d.description || '').toLowerCase().includes(lowerSearch)
    );
  }, [discounts, deferredSearchQuery]);

  const handleAdd = () => {
    setSelectedDiscount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (discount: any) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  const confirmDelete = (discount: any) => {
    setDiscountToDelete(discount);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!discountToDelete) return;

    setIsDeleting(true);
    try {
      await apiService.deleteDiscount(discountToDelete.id);
      toast.success(`Deleted discount ${discountToDelete.code}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Delete discount failed');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDiscountToDelete(null);
    }
  };

  const columns = [
    {
      header: 'Code & Description',
      accessor: (d: any) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900">{d.code}</div>
            <div className="text-xs text-slate-500 max-w-[200px] truncate">{d.description || 'No description'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Type / Value',
      accessor: (d: any) => (
        <div className="flex flex-col">
          <div className="flex items-center text-sm font-black text-slate-900">
            {d.type === 'PERCENTAGE' ? (
              <><Percent className="mr-1 h-3 w-3 text-slate-400" />{d.value}%</>
            ) : (
              <><DollarSign className="mr-1 h-3 w-3 text-slate-400" />{formatCurrency(d.value)}</>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            Minimum order: {formatCurrency(d.minOrderAmount)}
          </span>
        </div>
      ),
    },
    {
      header: 'Duration',
      accessor: (d: any) => (
        <div className="flex flex-col text-xs font-medium text-slate-500">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(d.startDate)} - {formatDate(d.endDate)}
          </div>
        </div>
      ),
    },
    {
      header: 'Usage',
      accessor: (d: any) => (
        <div className="flex items-center space-x-2">
           <Users className="h-4 w-4 text-slate-300" />
           <span className="text-sm font-bold text-slate-700">
             {d.usedCount} / {d.usageLimit || '∞'}
           </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (d: any) => (
        <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
          d.isActive 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-rose-100 text-rose-700'
        }`}>
          {d.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Discounts"
        data={filteredDiscounts}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
        discount={selectedDiscount}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Discount"
        message={<span>Are you sure you want to delete discount <strong className="text-slate-900">{discountToDelete?.code}</strong>? This action cannot be undone.</span>}
        confirmText="Delete Discount"
        isLoading={isDeleting}
      />
    </>
  );
}
