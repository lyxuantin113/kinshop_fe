"use client";

import React, { useState, useEffect, useDeferredValue, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductSidebar from '@/components/products/ProductSidebar';
import SortDropdown, { SortOption } from '@/components/products/SortDropdown';
import ProductCard from '@/components/products/ProductCard';
import { Product, Category, PaginatedResponse } from '@/types/api';
import { apiService } from '@/services/api';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import _ from 'lodash';

interface ProductListingClientProps {
  initialData: Product[] | PaginatedResponse<Product>;
  categories: Category[];
}

const ProductListingContent: React.FC<ProductListingClientProps> = ({ initialData, categories: initialCategories = [] }) => {
  // Ensure categories is always an array
  const categories = Array.isArray(initialCategories) 
    ? initialCategories 
    : ((initialCategories as any)?.data || []);

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  // Sync searchQuery with URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [deferredSearchQuery, selectedCategory]);

  const { data: response, isLoading: loading } = useQuery({
    queryKey: ['products', deferredSearchQuery, selectedCategory, page],
    queryFn: () => apiService.getProducts({
      search: deferredSearchQuery,
      categoryId: selectedCategory || undefined,
      page,
      limit: 12,
    }) as Promise<Product[] | PaginatedResponse<Product>>,
    initialData: (page === 1 && !deferredSearchQuery && !selectedCategory) ? initialData as any : undefined,
  });

  const products = useMemo(() => Array.isArray(response) ? response : (response?.data || []), [response]);
  
  const meta = useMemo(() => ({
    total: Array.isArray(response) ? response.length : (response?.meta?.totalItems || 0),
    totalPages: Array.isArray(response) ? 1 : (response?.meta?.totalPages || 1)
  }), [response]);

  const displayProducts = useMemo(() => {
    let result = [...products];

    // Client-side Price Filter (Only filter if it's been narrowed down from the default)
    if (priceRange[0] > 0 || priceRange[1] < 1000000) {
      result = result.filter(p => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]);
    }

    // Client-side Sorting (Backend usually doesn't sort by the same keys)
    switch (sortOrder) {
      case 'price-asc':
        return _.orderBy(result, [p => Number(p.price)], ['asc']);
      case 'price-desc':
        return _.orderBy(result, [p => Number(p.price)], ['desc']);
      case 'newest':
      default:
        // Attempt to sort by id or createdAt if available
        return _.orderBy(result, ['id'], ['desc']);
    }
  }, [products, priceRange, sortOrder]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Sticky on desktop */}
      <div className="flex-shrink-0 lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar pr-2">
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
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-900">{displayProducts.length}</span> of <span className="text-slate-900">{meta.total}</span> products
            </p>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-primary-500" />}
          </div>
          <SortDropdown currentSort={sortOrder} onSortChange={setSortOrder} />
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
            {loading ? (
              <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
            ) : (
              <>
                <p className="text-lg font-medium text-slate-600">No products found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setPriceRange([0, 1000000]);
                  }}
                  className="mt-4 text-sm font-bold text-primary-600 hover:underline"
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-primary-500 hover:text-primary-600 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-bold text-slate-900">
              Page {page} of {meta.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages || loading}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-primary-500 hover:text-primary-600 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductListingClient = (props: ProductListingClientProps) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
      </div>
    }>
      <ProductListingContent {...props} />
    </Suspense>
  );
};

export default ProductListingClient;
