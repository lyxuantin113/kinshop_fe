import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Target, Heart, Shield, Award, Users } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | KinShop',
  description: 'Learn more about KinShop, our mission, values, and the team behind the premium eCommerce experience.',
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        {/* Section 1: Hero Banner */}
        <section className="relative h-[60vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/90 z-10"></div>
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"></div>
             <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-600/20 rounded-full blur-[100px]"></div>
          </div>
          <div className="container-custom relative z-20 text-center space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-bold tracking-widest uppercase border border-primary-500/20">
              Our Journey
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
              About <span className="text-primary-500">KinShop</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-300 font-light italic">
              "Redefining the standard of premium online shopping through innovation and customer-centric design."
            </p>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="py-24 bg-white">
          <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Our Mission</h2>
              <p className="text-lg leading-relaxed text-slate-600">
                At KinShop, our mission is simple: to connect discerning customers with the world's most premium brands through a seamless, secure, and inspiring digital experience. We believe that shopping should be more than a transaction—it should be an exploration of quality and style.
              </p>
              <ul className="space-y-4">
                {['Curate high-quality sustainable products', 'Ensure lightning-fast global delivery', 'Provide unparalleled customer support'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-700 font-medium">
                    <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-video rounded-3xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent group-hover:scale-110 transition-transform duration-700"></div>
               <span className="text-slate-400 font-bold italic z-10">Mission Excellence Visual</span>
            </div>
          </div>
        </section>

        {/* Section 3: Our Values */}
        <section className="py-24 bg-slate-50">
          <div className="container-custom space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Values that Drive Us</h2>
              <p className="text-slate-500 italic">The core principles that guide every decision we make and every product we select.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: 'Customer Love', desc: 'Every feature we build is designed with the user\'s happiness at the center.' },
                { icon: Shield, title: 'Uncompromising Trust', desc: 'Security and transparency are the bedrocks of our eCommerce platform.' },
                { icon: Award, title: 'Quality Obsession', desc: 'We only partner with brands that meet our rigorous standards for excellence.' }
              ].map((value, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="h-14 w-14 mb-6 flex items-center justify-center rounded-2xl bg-slate-900 text-white group-hover:bg-primary-600 transition-colors">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Why Choose Us (Stats) */}
        <section className="py-24 bg-slate-900 text-white">
           <div className="container-custom text-center space-y-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold">KinShop by the Numbers</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
                 {[
                    { label: 'Happy Customers', value: '50K+' },
                    { label: 'Premium Brands', value: '450+' },
                    { label: 'Global Offices', value: '12' },
                    { label: '5-Star Reviews', value: '98%' }
                 ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                       <p className="text-5xl font-black text-primary-500">{stat.value}</p>
                       <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Section 5: History/Meet the Team */}
        <section className="py-24 bg-white overflow-hidden relative">
          <div className="container-custom">
             <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 relative">
                   <div className="absolute -z-10 -top-20 -left-20 h-64 w-64 bg-accent-100 rounded-full blur-[80px] opacity-60"></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center italic text-slate-400">Team Photo 1</div>
                      <div className="h-64 rounded-2xl bg-slate-800 border border-slate-700 mt-8 flex items-center justify-center italic text-slate-500">Office Life</div>
                   </div>
                </div>
                <div className="lg:w-1/2 space-y-8">
                   <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Our Story & Team</h2>
                   <p className="text-lg text-slate-600 leading-relaxed italic">
                      Founded in 2024, KinShop started with a small group of visionary developers and designers who were tired of generic shopping experiences. Today, we are a global team of over 50 professionals dedicated to changing how you shop online.
                   </p>
                   <div className="flex items-center space-x-6">
                      <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => (
                            <div key={i} className="h-12 w-12 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">T{i}</div>
                         ))}
                      </div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                         Join our growing family
                      </p>
                   </div>
                   <button className="btn-primary px-8">View Careers</button>
                </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
