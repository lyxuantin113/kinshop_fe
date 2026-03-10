"use client";

import React, { useState, useMemo } from 'react';
import ProductSidebar from '@/components/products/ProductSidebar';
import SortDropdown, { SortOption } from '@/components/products/SortDropdown';
import ProductCard from '@/components/products/ProductCard';
import { Product, Category } from '@/types/api';
import _ from 'lodash';

interface ProductListingClientProps {
  initialProducts: Product[];
  categories: Category[];
}

const ProductListingClient: React.FC<ProductListingClientProps> = ({ initialProducts, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by search
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortOrder) {
      case 'price-asc':
        result = _.orderBy(result, ['price'], ['asc']);
        break;
      case 'price-desc':
        result = _.orderBy(result, ['price'], ['desc']);
        break;
      case 'newest':
      default:
        // Assume ID or some property for newest if date not present, or just leave as is if backend already sorts
        // For now, let's assume no explicit date in Swagger, so we just keep order or sort by ID desc
        result = _.orderBy(result, ['id'], ['desc']);
        break;
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategory, priceRange, sortOrder]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <ProductSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="text-slate-900">{filteredProducts.length}</span> products
          </p>
          <SortDropdown currentSort={sortOrder} onSortChange={setSortOrder} />
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="text-lg font-medium text-slate-600">No products match your filters.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setPriceRange([0, 10000]);
              }}
              className="mt-4 text-sm font-bold text-primary-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingClient;
