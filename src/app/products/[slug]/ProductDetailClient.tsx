"use client";

import React, { useState } from 'react';
import { Product } from '@/types/api';
import { formatCurrency } from '@/utils/format';
import { apiService } from '@/services/api';
import { Star, Truck, ShieldCheck, ShoppingCart, Loader2, Check, Minus, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder.png'
  );

  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      toast.error('Failed to add product to cart, please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-inner">
          <img
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-all duration-500"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images?.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img.url)}
              className={`aspect-square overflow-hidden rounded-xl border-2 bg-slate-50 transition-all ${
                activeImage === img.url ? 'border-primary-600 ring-2 ring-primary-500/20' : 'border-slate-100'
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-600 uppercase tracking-wider">
              Authentic
            </span>
            {product.stock > 0 ? (
               <span className="text-xs font-medium text-emerald-600">● In Stock</span>
            ) : (
                <span className="text-xs font-medium text-red-500">● Out of Stock</span>
            )}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-accent-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'text-slate-300'}`} />
              ))}
              <span className="ml-2 text-sm font-bold text-slate-900">4.8 / 5.0</span>
            </div>
            <span className="text-sm font-medium text-slate-400">|</span>
            <span className="text-sm font-medium text-slate-500">128 reviews</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-4xl font-extrabold text-primary-600">{formatCurrency(Number(product.price))}</p>
          <p className="text-sm text-slate-500 italic">* Includes taxes and basic shipping fees.</p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center text-lg font-bold text-slate-900">{quantity}</span>
                  <button 
                     onClick={() => setQuantity(q => q + 1)}
                     className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-sm font-medium text-slate-500 italic">{product.stock} in stock</span>
              </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding || added}
            className={`flex w-full h-14 items-center justify-center rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-[0.98] disabled:pointer-events-none disabled:bg-slate-300 ${
              added ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-primary-600 text-white shadow-primary-500/40 hover:bg-primary-700'
            }`}
          >
            {adding ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : added ? (
              <>
                <Check className="mr-2 h-6 w-6" />
                Added to cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-6 w-6" />
                Add to Cart
              </>
            )}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-3 rounded-xl border border-slate-100 p-4">
                <Truck className="h-6 w-6 text-primary-600" />
                <div>
                    <p className="text-xs font-black uppercase text-slate-400">Fast Delivery</p>
                    <p className="text-sm font-bold text-slate-900">2 - 3 business days</p>
                </div>
            </div>
            <div className="flex items-center space-x-3 rounded-xl border border-slate-100 p-4">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                <div>
                    <p className="text-xs font-black uppercase text-slate-400">Warranty</p>
                    <p className="text-sm font-bold text-slate-900">12 months warranty</p>
                </div>
            </div>
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="text-lg font-bold text-slate-900">Product Description</h4>
          <p className="text-slate-600 leading-relaxed">
            {product.description || 'Premium quality product distributed by KinShop. We guarantee the best quality and service for our customers.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
