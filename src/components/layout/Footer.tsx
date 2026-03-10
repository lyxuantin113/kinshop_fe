import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-white">KinShop</span>
            </Link>
            <p className="max-w-xs text-sm leading-6">
              Leading the way in premium eCommerce experiences. High quality, speed, and reliability in every delivery.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary-500 transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Shopping</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-primary-500 transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-primary-500 transition-colors">Categories</Link></li>
              <li><Link href="/featured" className="hover:text-primary-500 transition-colors">Featured</Link></li>
              <li><Link href="/discounts" className="hover:text-primary-500 transition-colors">Discount Codes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary-500 transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-primary-500 transition-colors">Shipping Information</Link></li>
              <li><Link href="/returns" className="hover:text-primary-500 transition-colors">Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                <span>123 eCommerce St, Digital City, DC 54321</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500" />
                <span>support@kinshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© 2026 KinShop Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
