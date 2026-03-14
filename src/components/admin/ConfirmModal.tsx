"use client";

import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  isDestructive = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden relative">
        {/* Header Ribbon */}
        <div className={`h-2 w-full ${isDestructive ? 'bg-rose-500' : 'bg-primary-500'}`} />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-primary-100 text-primary-600'}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-2 mb-8 text-slate-600 leading-relaxed pl-14">
            {message}
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-50
                ${isDestructive 
                  ? 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-rose-600/20' 
                  : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-600/20'
                }`}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
