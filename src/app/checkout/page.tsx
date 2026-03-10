import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutClient from './CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | KinShop',
  description: 'Complete your premium purchase at KinShop.',
};

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Checkout</h1>
            <p className="max-w-2xl text-lg text-slate-500">
              Review your items and confirm your premium selection.
            </p>
          </div>

          <CheckoutClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
