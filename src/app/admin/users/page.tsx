"use client";

import React, { useState, useDeferredValue } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import { apiService } from '@/services/api';
import { User } from '@/types/api';
import { formatDate } from '@/utils/format';
import { User as UserIcon, Shield, Mail } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
  // Confirm Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);

  const { data: response, isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-users', page, deferredSearchQuery],
    queryFn: () => apiService.getAllUsers({ page, limit: 20, search: deferredSearchQuery }),
  });

  const users = response?.data || [];
  const totalPages = response?.meta?.totalPages || 1;
  const total = response?.meta?.total || 0;

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiService.deleteUser(userToDelete.id);
      toast.success(`Deleted user ${userToDelete.fullName}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Delete user failed');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const columns = [
    {
      header: 'User',
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
      header: 'Role',
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
      header: 'Joined date',
      accessor: (user: User) => (
        <span className="text-slate-500 font-medium">{formatDate(user.createdAt)}</span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Users"
        data={users}
        columns={columns}
        loading={loading}
        onDelete={confirmDelete}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={(p) => setPage(p)}
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={<span>Are you sure you want to delete user <strong className="text-slate-900">{userToDelete?.fullName}</strong>? This action cannot be undone.</span>}
        confirmText="Delete User"
        isLoading={isDeleting}
      />
    </>
  );
}
