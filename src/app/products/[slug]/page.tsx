import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { apiService } from '@/services/api';
import { Star, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await apiService.getProductBySlug(slug);
    return {
      title: `${product.name} | KinShop`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Sản phẩm | KinShop',
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const product = await apiService.getProductBySlug(slug);

    if (!product) {
        return (
            <div className="flex min-h-screen flex-col bg-slate-50">
              <Header />
              <main className="flex flex-1 items-center justify-center py-20">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy sản phẩm</h1>
                  <Link href="/products" className="mt-4 inline-block text-primary-600 hover:underline"> Quay lại cửa hàng </Link>
                </div>
              </main>
              <Footer />
            </div>
          );
    }

    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        
        <main className="flex-1 container-custom py-12">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">Sản phẩm</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
          </nav>

          <ProductDetailClient product={product} />
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Lỗi khi tải trang sản phẩm:', error);
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Đã có lỗi xảy ra</h1>
            <p className="mt-2 text-slate-500">Chúng tôi không thể tải được thông tin sản phẩm vào lúc này.</p>
            <Link href="/products" className="mt-4 inline-block text-primary-600 hover:underline"> Quay lại cửa hàng </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
