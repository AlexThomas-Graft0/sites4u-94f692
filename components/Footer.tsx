'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface SimpleBlogPost {
  title: string;
  slug: string;
}

export function Footer() {
  const [recentPosts, setRecentPosts] = useState<SimpleBlogPost[]>([]);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('title, slug')
          .order('created_at', { ascending: false })
          .limit(2);
        
        if (!error && data) {
          setRecentPosts(data as SimpleBlogPost[]);
        }
      } catch (err) {
        // Fallback silently if table doesn't exist or is empty
      }
    }
    fetchRecentPosts();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 15,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "sites4u",
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    "priceRange": "££",
    "telephone": "+441792000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "High Street",
      "addressLocality": "Swansea",
      "addressRegion": "West Glamorgan",
      "postalCode": "SA1 1DP",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.6214,
      "longitude": -3.9436
    },
    "url": "https://www.sites4u.co.uk",
    "areaServed": ["Swansea", "Neath", "Port Talbot", "Llanelli", "Gower"]
  };

  return (
    <footer className="relative bg-[#1E293B] text-slate-100 overflow-hidden pt-16 pb-12 border-t border-slate-800">
      {/* Local SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Decorative Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C2410C_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The "No Jargon" Promise Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/80 border border-orange-600/30 rounded-2xl p-6 sm:p-8 mb-16 flex flex-col md:flex-row items-center gap-6 justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-700/10 text-[#C2410C] shrink-0 border border-orange-700/20">
              {/* Handshake Icon */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">Our Plain-English Promise</h4>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                If we ever use a tech buzzword without explaining it in simple terms, your first month of website maintenance is completely free. We speak business, not code.
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="w-full md:w-auto text-center px-6 py-3 bg-[#C2410C] hover:bg-orange-600 text-white font-bold rounded-lg transition duration-150 shadow-md shadow-orange-950/50 hover:shadow-orange-950/80 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm tracking-wide whitespace-nowrap"
          >
            Book a Free 15-Minute Chat
          </a>
        </motion.div>

        {/* Main Footer Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-800"
        >
          {/* Column 1: About & Location */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                sites<span className="text-[#C2410C]">4u</span>
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                Swansea, Wales
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Proudly supporting Swansea & South Wales independent businesses. We build simple, beautiful, hard-working websites for Swansea’s independent shops, family trades, and high street cafes.
            </p>
            <div className="space-y-3 pt-2 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="font-semibold text-white block">Our Swansea Office</span>
                  <span>High Street, Swansea, West Glamorgan, SA1 1DP</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#C2410C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+441792000000" className="hover:text-white transition duration-150">01792 000000</a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#C2410C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:hello@sites4u.co.uk" className="hover:text-white transition duration-150">hello@sites4u.co.uk</a>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <h5 className="text-white font-bold uppercase tracking-wider text-xs">Our Services</h5>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <a href="#services" className="hover:text-white hover:underline transition duration-150 block">Web Design</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline transition duration-150 block">Local SEO (Google Maps)</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline transition duration-150 block">Hosting & Maintenance</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline transition duration-150 block">Booking Automation</a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Navigation */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <h5 className="text-white font-bold uppercase tracking-wider text-xs">Explore</h5>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <a href="#about" className="hover:text-white hover:underline transition duration-150 block">Our Story & Values</a>
              </li>
              <li>
                <a href="#work" className="hover:text-white hover:underline transition duration-150 block">Our Local Work</a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white hover:underline transition duration-150 block">Small Business Hub</a>
              </li>
              <li>
                <a href="#portal" className="hover:text-white hover:underline transition duration-150 block">Secure Client Portal</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white hover:underline transition duration-150 block">Free Consultation</a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Local Insights / Dynamic Blog Links */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4">
            <h5 className="text-white font-bold uppercase tracking-wider text-xs">Free Business Advice</h5>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <a 
                    key={post.slug}
                    href={`#blog`}
                    className="block group p-3 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 transition duration-150"
                  >
                    <span className="text-xs text-[#C2410C] font-semibold tracking-wider block mb-1">PRACTICAL GUIDE</span>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2 transition duration-150">
                      {post.title}
                    </span>
                  </a>
                ))
              ) : (
                <>
                  <a 
                    href="#blog" 
                    className="block group p-3 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 transition duration-150"
                  >
                    <span className="text-xs text-[#C2410C] font-semibold tracking-wider block mb-1">LOCAL SEO</span>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition duration-150">
                      How to Get Your Swansea Business Listed on Google Maps
                    </span>
                  </a>
                  <a 
                    href="#blog" 
                    className="block group p-3 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 transition duration-150"
                  >
                    <span className="text-xs text-[#C2410C] font-semibold tracking-wider block mb-1">WEB CONVERSIONS</span>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition duration-150">
                      3 Simple Things Your Website Needs to Turn Visitors into Cash
                    </span>
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-center md:text-left">
            <span>&copy; 2024 sites4u. All rights reserved.</span>
            <span>Registered in West Glamorgan, Wales.</span>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Serving Swansea, Neath, Port Talbot, Llanelli & Gower</span>
          </div>
        </div>
      </div>
    </footer>
  );
}