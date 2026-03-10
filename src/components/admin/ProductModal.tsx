"use client";

import React, { useState, useEffect } from 'react';
import { X, Loader2, Upload, Plus } from 'lucide-react';
import { Product, Category } from '@/types/api';
import { apiService } from '@/services/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
  categories: Category[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSuccess, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: Number(product.price),
        stock: product.stock,
        categoryId: product.categoryId,
      });
      setImageUrls(product.images?.map(img => img.url) || []);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: categories[0]?.id || '',
      });
      setImageUrls([]);
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      // We need a specific endpoint for upload or handle it in create/update
      // Backend has router.post('/upload-images', upload.array('images', 5), productController.uploadImages);
      const data = await apiService.uploadProductImages(formData);
      setImageUrls(prev => [...prev, ...data]);
    } catch (err: any) {
      setError('Tải ảnh lên thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImageUrls(prev => prev.filter(u => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        ...formData,
        images: imageUrls.map(url => ({ url, isPrimary: url === imageUrls[0] }))
      };

      if (product) {
        await apiService.updateProduct(product.id, payload);
      } else {
        await apiService.createProduct(payload);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-[2.5rem] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <p className="text-slate-500 text-sm">Điền đầy đủ thông tin sản phẩm bên dưới.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Tên sản phẩm</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setFormData({ ...formData, name, slug });
                }}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold"
                placeholder="Ví dụ: iPhone 15 Pro Max"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Slug (URL)</label>
              <input
                required
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500 focus:bg-white transition-all font-medium text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Mô tả</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500 focus:bg-white transition-all"
              placeholder="Mô tả ngắn về sản phẩm..."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Giá bán ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Tồn kho</label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Danh mục</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Hình ảnh sản phẩm</label>
            <div className="grid grid-cols-4 gap-4">
               {imageUrls.map((url, idx) => (
                   <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                       <img src={url} alt="Product" className="w-full h-full object-cover" />
                       <button 
                         type="button" 
                         onClick={() => removeImage(url)}
                         className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                       >
                           <X className="h-3 w-3" />
                       </button>
                   </div>
               ))}
               {imageUrls.length < 5 && (
                   <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-500 transition-all">
                       {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
                       <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                   </label>
               )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary py-4 rounded-2xl font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-[2] btn-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary-500/30 flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
