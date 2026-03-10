"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingCart, 
  Percent, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Discounts', href: '/admin/discounts', icon: Percent },
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <Link href="/" className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg bg-primary-600 text-white shadow-lg shadow-primary-500/30">
              <span className="font-black">K</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-tight text-slate-900 truncate">KinShop <span className="text-xs text-primary-500 font-black uppercase">Admin</span></span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'group-hover:text-primary-500'}`} />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-semibold tracking-wide">{item.name}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} rounded-2xl bg-slate-50 p-3`}>
            <div className="h-10 w-10 min-w-[40px] rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'Admin'}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Administrator</p>
              </div>
            )}
            {!isCollapsed && (
              <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-primary-600 focus:outline-none"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
