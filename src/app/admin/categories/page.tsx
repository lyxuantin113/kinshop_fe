"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { Category } from '@/types/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  const handleAdd = () => console.log('Add category');
  const handleEdit = (c: Category) => console.log('Edit category', c.id);
  const handleDelete = (c: Category) => console.log('Delete category', c.id);

  return (
    <DataTable
      title="Category Taxonomy"
      data={categories}
      columns={columns}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
