import React from 'react';
export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartClient from './CartClient';
import { apiService } from '@/services/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Shopping Cart | KinShop',
  description: 'Manage your premium items and proceed to checkout for a secure shopping experience.',
};

export default async function CartPage() {
  let initialCart = null;
  try {
    initialCart = await apiService.getCart();
  } catch (error) {
    console.error('Failed to fetch initial cart:', error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Shopping Cart</h1>
            <p className="max-w-2xl text-lg text-slate-500">
              Review your selection and prepare for a premium delivery experience.
            </p>
          </div>

          <CartClient initialCart={initialCart} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
