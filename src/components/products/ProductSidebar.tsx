"use client";

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Category } from '@/types/api';

interface ProductSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceChange,
}) => {
  return (
    <aside className="w-full lg:w-64 flex flex-col space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Search</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Product name..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Categories</h4>
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === '' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {Array.isArray(categories) && categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === cat.id ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">From</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-primary-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">To</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
