import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrderDetailClient from './OrderDetailClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Details | KinShop',
  description: 'View your premium order history and delivery details.',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Chi tiết đơn hàng</h1>
            <p className="max-w-2xl text-lg text-slate-500">
              #{(id || '').toUpperCase()} — Xem lại hành trình của sự sang trọng.
            </p>
          </div>

          <OrderDetailClient orderId={id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
