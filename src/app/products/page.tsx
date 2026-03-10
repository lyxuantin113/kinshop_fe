import React from 'react';
export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductListingClient from './ProductListingClient';
import { apiService } from '@/services/api';
import { Category, PaginatedResponse, Product } from '@/types/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Our Products | KinShop',
  description: 'Browse our full collection of premium products. Filter by category, price, and more to find exactly what you need.',
};

export default async function ProductsPage() {
  let productsResponse: PaginatedResponse<Product> = { 
    data: [], 
    meta: { totalItems: 0, itemCount: 0, itemsPerPage: 12, totalPages: 0, currentPage: 1 } 
  };
  let categories: Category[] = [];

  try {
    const [pRes, cRes] = await Promise.all([
      apiService.getProducts({ limit: 100 }),
      apiService.getCategories(),
    ]);
    productsResponse = pRes;
    // Categories API returns { data: Category[], meta: ... }
    categories = Array.isArray(cRes) ? cRes : (cRes?.data || []);
  } catch (error) {
    console.error('[ProductsPage] Failed to fetch data:', error);
    // Explicitly ensure categories is an array if fetch fails
    categories = [];
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Our Products</h1>
            <p className="max-w-2xl text-lg text-slate-500">
              Discover quality and innovation in every item. Premium products curated for your modern lifestyle.
            </p>
          </div>

          <ProductListingClient 
            initialData={productsResponse} 
            categories={categories} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
