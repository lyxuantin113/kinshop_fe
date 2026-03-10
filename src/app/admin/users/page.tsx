"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { User } from '@/types/api';
import { formatDate } from '@/utils/format';
import { User as UserIcon, Shield, Mail } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      const res = await apiService.getAllUsers({ page: currentPage, limit: 20 });
      setUsers(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalItems(res.meta.totalItems);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDelete = async (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa người dùng ${user.fullName}?`)) {
      try {
        await apiService.deleteUser(user.id);
        fetchUsers(page);
      } catch (error) {
        alert('Xóa người dùng thất bại');
      }
    }
  };

  const columns = [
    {
      header: 'Người dùng',
      accessor: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
            <UserIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900">{user.fullName}</div>
            <div className="flex items-center text-xs text-slate-500">
               <Mail className="mr-1 h-3 w-3" />
               {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Vai trò',
      accessor: (user: User) => (
        <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
          user.role === 'ADMIN' 
          ? 'bg-amber-100 text-amber-700' 
          : 'bg-slate-100 text-slate-600'
        }`}>
          <Shield className="mr-1 h-3 w-3" />
          {user.role}
        </span>
      ),
    },
    {
      header: 'Ngày tham gia',
      accessor: (user: User) => (
        <span className="text-slate-500 font-medium">{formatDate(user.createdAt)}</span>
      ),
    },
  ];

  return (
    <DataTable
      title="Người dùng"
      data={users}
      columns={columns}
      loading={loading}
      onDelete={handleDelete}
      currentPage={page}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={(p) => setPage(p)}
    />
  );
}
