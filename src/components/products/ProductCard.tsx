"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Loader2, Check } from 'lucide-react';
import { Product } from '@/types/api';
import { formatCurrency } from '@/utils/format';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder.png';

  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-sm font-bold text-white backdrop-blur-[2px]">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category {product.categoryId.slice(0, 8)}</span>
          <div className="flex items-center text-accent-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="ml-1 text-[10px] font-bold">4.8</span>
          </div>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
          {product.description || 'Premium quality product from KinShop.'}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{formatCurrency(Number(product.price))}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding || added}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 disabled:pointer-events-none disabled:bg-slate-300 disabled:shadow-none ${
              added ? 'bg-emerald-500' : 'bg-primary-600 hover:scale-110 hover:bg-primary-700'
            }`}
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
