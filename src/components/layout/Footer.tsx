import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">KinShop</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The premier destination for premium tech and lifestyle products. We bring quality and sophistication to every piece.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-sm text-slate-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=new" className="text-sm text-slate-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=featured" className="text-sm text-slate-400 hover:text-white transition-colors">Featured Products</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/shipping" className="text-sm text-slate-400 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-sm text-slate-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                <span>Go Vap ward, Ho Chi Minh City, Vietnam</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500" />
                <span>+84 345 678 901</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500" />
                <span>support@kinshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} KinShop Commerce. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
