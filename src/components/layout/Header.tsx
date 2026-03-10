"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, LogOut, ShieldCheck, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const HeaderContent = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-primary-600">KinShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-primary-600">Products</Link>
            <Link href="/about" className="transition-colors hover:text-primary-600">About</Link>
            <Link href="/contact" className="transition-colors hover:text-primary-600">Contact</Link>
          </nav>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search 
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-primary-600" 
              onClick={() => handleSearch()}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 text-slate-600 hover:text-primary-600 lg:hidden" 
            aria-label="Search"
            onClick={() => handleSearch()}
          >
            <Search className="h-5 w-5" />
          </button>
          
          <Link href="/cart" className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in duration-300">
                {itemCount}
              </span>
            )}
          </Link>
          
          {mounted && user ? (
            <div className="flex items-center space-x-4">
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="hidden lg:flex items-center space-x-1 p-2 text-primary-600 hover:text-primary-700 transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-bold">Admin</span>
                </Link>
              )}
              <Link href="/orders" className="hidden sm:flex items-center space-x-1 p-2 text-slate-600 hover:text-primary-600 transition-colors">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium truncate max-w-[100px]">{user.fullName || 'Account'}</span>
              </Link>
              <button 
                onClick={logout}
                className="hidden sm:flex items-center space-x-1 p-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : mounted ? (
            <Link href="/login" className="hidden sm:flex items-center space-x-1 p-2 text-slate-600 hover:text-primary-600 transition-colors">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Login</span>
            </Link>
          ) : (
            <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-lg"></div>
          )}

          <button className="p-2 text-slate-600 hover:text-primary-600 md:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

const Header = () => {
  return (
    <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
