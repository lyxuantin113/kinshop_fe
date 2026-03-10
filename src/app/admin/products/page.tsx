"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Product } from '@/types/api';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts({ limit: 100 });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
          {p.categoryId}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: (p: Product) => <span className="font-black text-slate-900">${p.price.toFixed(2)}</span>,
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

  const handleAdd = () => console.log('Add product');
  const handleEdit = (p: Product) => console.log('Edit product', p.id);
  const handleDelete = (p: Product) => console.log('Delete product', p.id);
  const handlePrint = (p: Product) => window.print();

  return (
    <DataTable
      title="Product Inventory"
      data={products}
      columns={columns}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onPrint={handlePrint}
    />
  );
}
