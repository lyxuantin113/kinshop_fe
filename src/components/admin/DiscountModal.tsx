"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, Percent, DollarSign, Type } from 'lucide-react';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  discount?: any;
}

export default function DiscountModal({ isOpen, onClose, onSuccess, discount }: DiscountModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 0,
    minOrderAmount: 0,
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true,
    scope: 'GLOBAL'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (discount) {
      setFormData({
        ...discount,
        startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
        endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '',
        usageLimit: discount.usageLimit || ''
      });
    } else {
      setFormData({
        code: '',
        type: 'PERCENTAGE',
        value: 0,
        minOrderAmount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: '',
        isActive: true,
        scope: 'GLOBAL'
      });
    }
  }, [discount, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        value: Number(formData.value),
        minOrderAmount: Number(formData.minOrderAmount),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      // Remove description if it exists in formData to avoid Prisma error
      const { description, ...finalPayload } = payload as any;

      const { apiService } = await import('@/services/api');
      if (discount) {
        await apiService.updateDiscount(discount.id, finalPayload);
      } else {
        await apiService.createDiscount(finalPayload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save discount:', error);
      alert('Không thể lưu mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-8 py-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {discount ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
          </h2>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-slate-600 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mã giảm giá</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: KINSHOP20"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Loại giảm giá</label>
              <div className="flex gap-2">
                 <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'PERCENTAGE' })}
                    className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all ${
                        formData.type === 'PERCENTAGE' 
                        ? 'border-primary-500 bg-primary-50 text-primary-600' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white'
                    }`}
                 >
                    Phần trăm (%)
                 </button>
                 <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'FIXED_AMOUNT' })}
                    className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all ${
                        formData.type === 'FIXED_AMOUNT' 
                        ? 'border-primary-500 bg-primary-50 text-primary-600' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white'
                    }`}
                 >
                    Số tiền cố định
                 </button>
              </div>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Giá trị giảm</label>
              <div className="relative">
                {formData.type === 'PERCENTAGE' ? (
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                ) : (
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                )}
                <input
                  required
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Min Order */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Đơn tối thiểu</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ngày bắt đầu</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ngày kết thúc</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Lượt dùng tối đa</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="Bỏ trống nếu không giới hạn"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Status Toggle */}
             <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-5 w-5 rounded-lg text-primary-600 focus:ring-primary-500 border-slate-200"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Đang kích hoạt</label>
                </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-100 bg-white py-4 text-sm font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-primary-600 hover:shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu mã giảm giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
