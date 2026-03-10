"use client";

import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Printer, 
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onPrint?: (item: T) => void;
  onView?: (item: T) => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export default function DataTable<T extends { id: string | number }>({ 
  title, 
  data, 
  columns, 
  loading,
  onAdd,
  onEdit,
  onDelete,
  onPrint,
  onView,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange
}: DataTableProps<T>) {
  const itemsPerPage = 20; // Default or calculated
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;
        buttons.push(
            <button
                key={i}
                onClick={() => onPageChange?.(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                    isActive 
                    ? 'border-primary-500 bg-primary-500 text-white ring-4 ring-primary-500/20' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
            >
                {i}
            </button>
        );
    }
    return buttons;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Table Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">{title}</h1>
          <p className="text-sm font-medium text-slate-500">Manage your {title.toLowerCase()} and system data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary h-11 px-4 text-sm font-bold">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          {onAdd && (
            <button 
              onClick={onAdd}
              className="btn-primary h-11 px-4 text-sm font-bold shadow-lg shadow-primary-500/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid gap-4 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/30 sm:flex sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:bg-white transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 items-center justify-center rounded-xl border border-slate-100 bg-white px-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
                {(onAdd || onEdit || onDelete || onPrint || onView) && (
                  <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-widest text-slate-400">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, idx) => (
                      <td key={idx} className="px-6 py-4"><div className="h-4 w-full rounded bg-slate-100"></div></td>
                    ))}
                    {(onAdd || onEdit || onDelete || onPrint || onView) && (
                      <td className="px-6 py-4"><div className="ml-auto h-4 w-20 rounded bg-slate-100"></div></td>
                    )}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + ((onAdd || onEdit || onDelete || onPrint || onView) ? 1 : 0)} className="py-20 text-center font-display text-slate-400 italic">No records found.</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    {columns.map((col, idx) => (
                      <td key={idx} className={`px-6 py-5 text-sm ${col.className || ''}`}>
                        {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                    {(onAdd || onEdit || onDelete || onPrint || onView) && (
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onView && (
                          <button onClick={() => onView(item)} className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {onPrint && (
                          <button onClick={() => onPrint(item)} className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all">
                            <Printer className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-6 py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {totalItems > 0 ? startItem : 0} to {endItem} of {totalItems} results
          </p>
          <div className="flex items-center space-x-2">
            <button 
                disabled={currentPage <= 1}
                onClick={() => onPageChange?.(currentPage - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {renderPageButtons()}

            <button 
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
