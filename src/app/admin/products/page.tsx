"use client";

import React, { useState, useEffect, useDeferredValue } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Product, Category } from '@/types/api';
import Image from 'next/image';
import { formatCurrency } from '@/utils/format';
import ProductModal from '@/components/admin/ProductModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async (currentPage: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiService.getProducts({ page: currentPage, limit: 20, search }),
        apiService.getCategories()
      ]);
      
      // Correctly extract data from paginated response
      // categoriesRes.data as per CategoryService.getAllCategories return
      setProducts(productsRes.data);
      setTotalPages(productsRes.meta.totalPages);
      setTotalItems(productsRes.meta.totalItems);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, deferredSearchQuery);
  }, [page, deferredSearchQuery]);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Unknown';
  };

  const columns = [
    {
      header: 'Product',
      accessor: (p: Product) => (
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
            {p.images?.[0]?.url ? (
               <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
            ) : (
               <div className="flex h-full w-full items-center justify-center text-slate-300">N/A</div>
            )}
          </div>
          <div className="font-bold text-slate-900">{p.name}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (p: Product) => (
        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600">
          {getCategoryName(p.categoryId)}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: (p: Product) => <span className="font-black text-slate-900">{formatCurrency(p.price)}</span>,
    },
    {
      header: 'Stock',
      accessor: (p: Product) => (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-12 overflow-hidden rounded-full bg-slate-100">
            <div 
              className={`h-full rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
              style={{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-500">{p.stock}</span>
        </div>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (p: Product) => {
    setSelectedProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (p: Product) => {
    if (confirm(`Bạn có chắc muốn xóa ${p.name}?`)) {
        try {
            await apiService.deleteProduct(p.id);
            fetchData();
        } catch (error) {
            alert('Xóa sản phẩm thất bại');
        }
    }
  };

  const handlePrint = (p: Product) => window.print();

  return (
    <>
      <DataTable
        title="Kho sản phẩm"
        data={products}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPrint={handlePrint}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(p) => setPage(p)}
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
      />
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        product={selectedProduct}
        categories={categories}
      />
    </>
  );
}
