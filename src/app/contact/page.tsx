import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | KinShop',
  description: 'Reach out to KinShop for collaborations, support, or any inquiries. We are here to help you.',
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        {/* Section 1: Intro / Collaboration Message */}
        <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
           <div className="container-custom text-center space-y-8 max-w-4xl mx-auto">
              <span className="text-primary-600 font-bold uppercase tracking-widest text-sm">Get in Touch</span>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                 Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Conversation</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-light">
                 Whether you're looking for support, interested in a partnership, or just want to say hello, we're all ears. Our dedicated team is ready to assist you with the premium care you deserve.
              </p>
              <div className="pt-4">
                 <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                    <MessageSquare className="h-4 w-4 text-primary-500" />
                    <span>Average response time: &lt; 2 hours</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Section 2: Map & Basic Info */}
        <section className="py-24">
           <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                 {/* Left: Map Placeholder */}
                 <div className="relative min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-200">
                    <div className="absolute inset-0 bg-slate-300 flex items-center justify-center italic text-slate-500 font-bold">
                       Interactive Map Visualization
                    </div>
                    {/* Floating Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50 space-y-2">
                       <h4 className="font-bold text-slate-900">KinShop Global HQ</h4>
                       <p className="text-sm text-slate-500 leading-tight">123 eCommerce St, Digital City, DC 54321, United States</p>
                    </div>
                 </div>

                 {/* Right: Basic Info */}
                 <div className="space-y-8 flex flex-col justify-center lg:pl-12">
                    <h3 className="text-3xl font-bold text-slate-900">Global Hubs</h3>
                    <div className="grid gap-8">
                       {[
                          { icon: MapPin, title: 'Visit Us', desc: 'Stop by our flagship showroom for a personal consultation.' },
                          { icon: Phone, title: 'Call Support', desc: 'Direct line to our premium support desk: +1 (234) 567-890' },
                          { icon: Mail, title: 'Email Us', desc: 'Send your inquiries to contact@kinshop.com' }
                       ].map((item, i) => (
                          <div key={i} className="flex gap-6 items-start group">
                             <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-110">
                                <item.icon className="h-5 w-5" />
                             </div>
                             <div className="space-y-1">
                                <h4 className="font-bold text-slate-900">{item.title}</h4>
                                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Section 3: Contact Form */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
           <div className="absolute top-0 right-0 h-full w-1/3 bg-primary-500/10 blur-[120px] rounded-full"></div>
           <div className="container-custom relative z-10">
              <div className="max-w-3xl mx-auto space-y-12">
                 <div className="text-center space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Send Us a Message</h2>
                    <p className="text-slate-400 italic">Have something specific in mind? Fill out the form below and we'll get back to you shortly.</p>
                 </div>
                 <form className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-2xl grid md:grid-cols-2 gap-8 ring-1 ring-white/10 border border-slate-100">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                       <input type="text" placeholder="John Doe" className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none focus:border-primary-500 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                       <input type="email" placeholder="john@example.com" className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none focus:border-primary-500 focus:bg-white transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Subject</label>
                       <select className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none focus:border-primary-500 focus:bg-white transition-all appearance-none">
                          <option>General Inquiry</option>
                          <option>Technical Support</option>
                          <option>Partnership Proposal</option>
                          <option>Press & Media</option>
                       </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Your Message</label>
                       <textarea rows={5} placeholder="Tell us how we can help..." className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-primary-500 focus:bg-white transition-all resize-none"></textarea>
                    </div>
                    <div className="md:col-span-2 pt-4">
                       <button type="button" className="btn-primary w-full h-14 text-base shadow-xl shadow-primary-500/20 group">
                          <span>Send Message</span>
                          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
