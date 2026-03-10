import React from 'react';
export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { apiService } from '@/services/api';
import { LayoutGrid, ShieldCheck, Truck, Zap } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Product } from '@/types/api';

export const metadata: Metadata = {
  title: 'KinShop | Trải nghiệm mua sắm cao cấp',
  description: 'Mua sắm các sản phẩm cao cấp mới nhất tại KinShop. Giao hàng nhanh, thanh toán bảo mật và sản phẩm chất lượng cho phong cách sống hiện đại.',
  openGraph: {
    title: 'KinShop | Trải nghiệm mua sắm cao cấp',
    description: 'Mua sắm các sản phẩm cao cấp mới nhất tại KinShop.',
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch initial data for SSR/ISR
  let products: Product[] = [];
  try {
    const response = await apiService.getProducts({ limit: 8 });
    products = response.data;
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 py-24 text-white lg:py-32">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary-600 blur-[120px]"></div>
            <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-accent-600 blur-[120px]"></div>
          </div>
          
          <div className="container-custom relative z-10 grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start space-y-8">
              <span className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-sm font-semibold text-primary-400 ring-1 ring-inset ring-primary-500/20">
                Bộ sưu tập mùa hè mới 2026
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl">
                Nâng tầm <span className="text-primary-500">Phong cách</span> cùng KinShop.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-300">
                Khám phá bộ sưu tập sản phẩm cao cấp được tuyển chọn kỹ lưỡng về chất lượng, sự thoải mái và phong cách. Trải nghiệm tương lai của mua sắm trực tuyến ngay hôm nay.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary flex items-center h-12 px-8 text-base shadow-xl shadow-primary-500/30 text-white">
                  Mua sắm ngay
                </Link>
                <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-transparent px-8 text-base font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-700">
                  Xem bộ sưu tập
                </Link>
              </div>
            </div>
            {/* Visual element placeholder */}
            <div className="hidden lg:block relative h-[500px] w-full rounded-2xl border border-slate-800 bg-slate-800/50 p-4 shadow-2xl backdrop-blur-sm">
               <div className="h-full w-full rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 opacity-50 flex items-center justify-center text-center p-8">
                  <span className="text-slate-500 font-bold text-2xl uppercase tracking-widest">Trưng bày sản phẩm cao cấp</span>
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="container-custom grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl transition-all hover:bg-slate-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-900 leading-none">Miễn phí vận chuyển</h3>
              <p className="text-sm text-slate-500">Áp dụng cho mọi đơn hàng trên 1.000.000đ.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl transition-all hover:bg-slate-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-900 leading-none">Thanh toán bảo mật</h3>
              <p className="text-sm text-slate-500">100% bảo mật với các phương thức thanh toán tiên tiến nhất.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl transition-all hover:bg-slate-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-900 leading-none">Giao hàng nhanh</h3>
              <p className="text-sm text-slate-500">Nhận hàng chỉ từ 2-3 ngày làm việc trên toàn quốc.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl transition-all hover:bg-slate-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <LayoutGrid className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-900 leading-none">Đa dạng sản phẩm</h3>
              <p className="text-sm text-slate-500">Lựa chọn từ hàng ngàn sản phẩm cao cấp chính hãng.</p>
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="py-24">
          <div className="container-custom">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Sản phẩm nổi bật</h2>
                <p className="text-slate-500">Những sản phẩm được tuyển chọn dựa trên chất lượng và thiết kế vượt trội.</p>
              </div>
              <Link href="/products" className="group flex items-center text-sm font-bold text-primary-600">
                Xem toàn bộ sản phẩm
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
                <p className="text-lg font-medium text-slate-600">Hiện tại chưa có sản phẩm nào.</p>
                <p className="mt-2 text-sm text-slate-400">Vui lòng quay lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter / CTA Section */}
        <section className="py-24 container-custom">
          <div className="relative overflow-hidden rounded-3xl bg-primary-600 px-8 py-16 text-center text-white lg:py-24 shadow-2xl shadow-primary-500/40">
            <div className="absolute inset-0 z-0 opacity-10">
               <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
               </svg>
            </div>
            <div className="relative z-10 mx-auto max-w-2xl space-y-8">
              <h2 className="text-4xl font-extrabold tracking-tight">Cập nhật tin tức mới nhất</h2>
              <p className="text-lg text-primary-100 italic">
                Đăng ký nhận tin để được giảm ngay 10% cho đơn hàng đầu tiên và cập nhật sớm nhất các bộ sưu tập mới.
              </p>
              <form className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full h-12 rounded-lg bg-white/10 border border-white/20 px-6 text-white placeholder:text-primary-200 outline-none focus:bg-white/20 transition-all font-medium"
                />
                <button type="button" className="w-full sm:w-auto h-12 rounded-lg bg-white px-8 text-primary-600 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                  Đăng ký ngay
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
