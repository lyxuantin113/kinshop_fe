"use client";

import React, { useState, useDeferredValue } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Category } from '@/types/api';
import CategoryModal from '@/components/admin/CategoryModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Confirm Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Pagination state
  const [page, setPage] = useState(1);

  const { data: response, isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-categories', page, deferredSearchQuery],
    queryFn: () => apiService.getCategories({ page, limit: 12, search: deferredSearchQuery }),
  });

  const categories = Array.isArray(response) ? response : (response as any)?.data || [];
  const totalPages = (response as any)?.meta?.totalPages || 1;
  const totalItems = (response as any)?.meta?.totalItems || 0;

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

  const confirmDelete = (c: Category) => {
    setCategoryToDelete(c);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiService.deleteCategory(categoryToDelete.id);
      toast.success(`Deleted category ${categoryToDelete.name}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Delete category failed');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <DataTable
        title="Categories"
        data={categories}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={confirmDelete}
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
        onSuccess={refetch}
        category={selectedCategory}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={<span>Are you sure you want to delete category <strong className="text-slate-900">{categoryToDelete?.name}</strong>? This action cannot be undone.</span>}
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </>
  );
}
