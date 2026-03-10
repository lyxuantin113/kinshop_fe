"use client";

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // Basic RBAC check
  if (!loading && (!user || user.role !== 'ADMIN')) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <AdminSidebar />
      
      <div className="flex flex-col transition-all duration-300 ease-in-out pl-[256px] min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8">
          <div className="flex h-full items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search everywhere..."
                className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
