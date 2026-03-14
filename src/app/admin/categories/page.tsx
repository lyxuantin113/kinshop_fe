"use client";

import React, { useState, useEffect, useDeferredValue } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Category } from '@/types/api';
import CategoryModal from '@/components/admin/CategoryModal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async (currentPage: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const response = await apiService.getCategories({ page: currentPage, limit: 20, search });
      // Correctly extract data from paginated response
      setCategories(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, deferredSearchQuery);
  }, [page, deferredSearchQuery]);

  const columns = [
    {
      header: 'Name',
      accessor: (c: Category) => <div className="font-bold text-slate-900">{c.name}</div>,
    },
    {
      header: 'Slug',
      accessor: (c: Category) => <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">/{c.slug}</code>,
    },
    {
      header: 'Description',
      accessor: (c: Category) => (
        <span className="text-slate-500 line-clamp-1 max-w-xs">{c.description || 'No description provided.'}</span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (c: Category) => {
    setSelectedCategory(c);
    setIsModalOpen(true);
  };

  const handleDelete = async (c: Category) => {
    if (confirm(`Bạn có chắc muốn xóa danh mục ${c.name}?`)) {
      try {
        await apiService.deleteCategory(c.id);
        fetchData(page, deferredSearchQuery);
      } catch (error) {
        alert('Xóa danh mục thất bại');
      }
    }
  };

  return (
    <>
      <DataTable
        title="Danh mục sản phẩm"
        data={categories}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(p) => setPage(p)}
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
      />
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchData(page, deferredSearchQuery)}
        category={selectedCategory}
      />
    </>
  );
}
