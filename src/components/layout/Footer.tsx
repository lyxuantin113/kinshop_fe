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
              Điểm đến hàng đầu cho các sản phẩm công nghệ và phong cách sống cao cấp. Chúng tôi mang đến chất lượng và sự tinh tế trong từng sản phẩm.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Cửa hàng</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-sm text-slate-400 hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?category=new" className="text-sm text-slate-400 hover:text-white transition-colors">Hàng mới về</Link></li>
              <li><Link href="/products?category=featured" className="text-sm text-slate-400 hover:text-white transition-colors">Sản phẩm nổi bật</Link></li>
              <li><Link href="/discounts" className="text-sm text-slate-400 hover:text-white transition-colors">Mã giảm giá</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hỗ trợ</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link href="/shipping" className="text-sm text-slate-400 hover:text-white transition-colors">Thông tin vận chuyển</Link></li>
              <li><Link href="/returns" className="text-sm text-slate-400 hover:text-white transition-colors">Đổi trả & Hoàn tiền</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
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

        <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} KinShop Commerce. Bảo lưu mọi quyền.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
