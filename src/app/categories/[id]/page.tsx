import React from 'react';
export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import SortDropdown, { SortOption } from '@/components/products/SortDropdown';
import { apiService } from '@/services/api';
import { Metadata } from 'next';
import Link from 'next/link';

import { Category, PaginatedResponse, Product } from '@/types/api';

interface CategoryPageProps {
  params: { id: string };
  searchParams: { sort?: SortOption; page?: string };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const categories = await apiService.getCategories();
    const category = categories.find(c => c.id === params.id);
    return {
      title: `${category?.name || 'Category'} | KinShop`,
      description: category?.description || `Browse our collection of ${category?.name} products.`,
    };
  } catch {
    return { title: 'Category | KinShop' };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categoryId = params.id;
  const sort = searchParams.sort || 'newest';
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  let productsResponse: PaginatedResponse<Product> = { 
    data: [], 
    meta: { total: 0, page: 1, limit: 12, totalPages: 0 } 
  };
  let allCategories: Category[] = [];

  try {
    const [pRes, cRes] = await Promise.all([
      apiService.getProducts({ categoryId, page, limit }),
      apiService.getCategories(),
    ]);
    productsResponse = pRes;
    allCategories = cRes;
  } catch (error) {
    console.error('[CategoryPage] Failed to fetch data:', error);
  }

  const currentCategory = allCategories.find(c => c.id === categoryId);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">Products</Link>
            <span>/</span>
            <span className="text-slate-900">{currentCategory?.name || 'Category'}</span>
          </nav>

          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                {currentCategory?.name || 'Category'}
              </h1>
              <p className="max-w-xl text-lg text-slate-500">
                {currentCategory?.description || `Explore our high-quality ${currentCategory?.name} collection.`}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-500">
                {productsResponse.meta.total} products found
              </span>
              {/* Note: In a real app, SortDropdown would update URL params */}
              {/* For simplicity here, I'll just render it. Client-side sorting logic can be added if needed */}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsResponse.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {productsResponse.meta.totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center space-x-2">
              {Array.from({ length: productsResponse.meta.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/categories/${categoryId}?page=${p}&sort=${sort}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                    p === page 
                      ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary-500 hover:text-primary-600'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
