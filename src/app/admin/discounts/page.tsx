"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { formatCurrency, formatDate } from '@/utils/format';
import { Tag, Calendar, Users, Percent, DollarSign } from 'lucide-react';
import DiscountModal from '@/components/admin/DiscountModal';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await apiService.getDiscounts();
      // Adjust based on backend response shape
      setDiscounts(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleAdd = () => {
    setSelectedDiscount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (discount: any) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  const handleDelete = async (discount: any) => {
    if (confirm(`Bạn có chắc muốn xóa mã giảm giá ${discount.code}?`)) {
      try {
        await apiService.deleteDiscount(discount.id);
        fetchDiscounts();
      } catch (error) {
        alert('Xóa mã giảm giá thất bại');
      }
    }
  };

  const columns = [
    {
      header: 'Mã & Mô tả',
      accessor: (d: any) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900">{d.code}</div>
            <div className="text-xs text-slate-500 max-w-[200px] truncate">{d.description || 'Không có mô tả'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Loại / Giá trị',
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
            Đơn tối thiểu: {formatCurrency(d.minOrderAmount)}
          </span>
        </div>
      ),
    },
    {
      header: 'Thời hạn',
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
      header: 'Lượt dùng',
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
      header: 'Trạng thái',
      accessor: (d: any) => (
        <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
          d.isActive 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-rose-100 text-rose-700'
        }`}>
          {d.isActive ? 'Kích hoạt' : 'Vô hiệu'}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Mã giảm giá"
        data={discounts}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDiscounts}
        discount={selectedDiscount}
      />
    </>
  );
}
