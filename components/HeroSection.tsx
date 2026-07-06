'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface CaseStudy {
  id: string;
  client_name: string;
  industry: string;
  challenge: string;
  solution: string;
  result_metric_highlight: string;
  image_url: string;
  display_order: number;
}

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('new');
  const [dbCaseStudies, setDbCaseStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data) {
          setDbCaseStudies(data as CaseStudy[]);
        }
      } catch (err) {
        // Fallback handled gracefully
      }
    }
    fetchCaseStudies();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 80, damping: 20 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#FFFDFB] to-[#FEF2F2] py-16 md:py-24 lg:py-32">
      {/* Decorative Background Accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#FEF2F2] opacity-70 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-[#F3E9D8] opacity-50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HERO HEADER BLOCK */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8"
        >
          {/* Left Column: Text & CTAs */}
          <div className="space-y-6 lg:col-span-7">
            {/* Trust Tag */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-[#FEF2F2] px-4 py-2 border border-[#FCA5A5] text-[#C2410C]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C2410C] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C2410C]"></span>
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase">
                Proudly supporting Swansea & South Wales independent businesses
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl md:text-6xl lg:leading-tight"
            >
              Bring your business online.{' '}
              <span className="text-[#C2410C] block sm:inline">
                No confusing tech-talk,
              </span>{' '}
              just more local customers.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-[#475569] sm:text-xl leading-relaxed max-w-2xl"
            >
              We build simple, beautiful, hard-working websites for Swansea’s independent shops, family trades, and high street cafes. Get found on Google and take bookings easily, without the giant agency price tag.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <a
                href="#contact"
                className="inline-flex justify-center items-center rounded-lg bg-[#C2410C] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#C2410C]/20 hover:bg-[#A1340A] focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:ring-offset-2 transition duration-150 min-h-[48px]"
              >
                Book a Free 15-Minute Chat
              </a>
              <a
                href="#work"
                className="inline-flex justify-center items-center rounded-lg border-2 border-[#1E293B] bg-transparent px-6 py-4 text-base font-bold text-[#1E293B] hover:bg-[#1E293B] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:ring-offset-2 transition duration-150 min-h-[48px]"
              >
                See Our Local Work
              </a>
            </motion.div>

            {/* Trust Signal Subtext */}
            <motion.p
              variants={itemVariants}
              className="flex items-center gap-1.5 text-sm font-medium text-[#475569]"
            >
              <span className="text-amber-500 text-lg">★★★★★</span>
              <span>Rated 5/5 by local Swansea business owners</span>
            </motion.p>
          </div>

          {/* Right Column: Hero Visual */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative lg:col-span-5"
          >
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl shadow-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1545642187-a3ec33bc5517?auto=format&fit=crop&w=800&q=80"
                  alt="Beautiful South Wales coastline near Swansea"
                  className="h-[350px] w-full object-cover sm:h-[450px]"
                />
              </div>

              {/* Floating Success Badge */}
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-4 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Local Visibility</p>
                  <p className="font-serif text-lg font-bold text-slate-900">Ranked #1 on Google</p>
                </div>
              </div>

              {/* Swansea Landmark Tag */}
              <div className="absolute top-4 right-4 rounded-full bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
                📍 Uplands, Swansea
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* NO JARGON PROMISE BANNER */}
        <div className="mt-20">
          <div className="rounded-2xl bg-[#1E293B] p-6 md:p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-600/20 text-[#C2410C]">
                  {/* Friendly Handshake SVG */}
                  <svg className="h-8 w-8 text-[#C56A3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Our Plain-English Promise</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    If we ever use a tech buzzword without explaining it in simple terms, your first month of website maintenance is completely free. We speak business, not code.
                  </p>
                </div>
              </div>
              <a 
                href="#promise" 
                className="whitespace-nowrap rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-3 border border-slate-700 transition"
              >
                Learn Our Values
              </a>
            </div>
          </div>
        </div>

        {/* BEFORE & AFTER TRANSFORMATION BLOCK */}
        <div className="mt-24 md:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-[#1E293B] sm:text-4xl">
              See the difference a professional website makes
            </h2>
            <p className="text-base text-slate-600 mt-3">
              How the sites4u approach transforms your business from being completely invisible online to a thriving local fixture.
            </p>

            {/* Mobile Tab Switcher */}
            <div className="mt-6 flex justify-center sm:hidden">
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setActiveTab('old')}
                  className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'old' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Without a Web Presence
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'new' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  With sites4u
                </button>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            
            {/* The Old Way (Invisible to Customers) */}
            <div className={`rounded-2xl border-2 border-rose-100 bg-rose-50/30 p-8 transition-opacity duration-300 ${
              activeTab === 'old' ? 'block' : 'hidden sm:block'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="font-serif text-xl font-bold text-[#1E293B]">Without a Web Presence</h3>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Losing Business
                </span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-sm">✕</span>
                  <p className="text-sm text-slate-700">
                    Local customers search for your services on Google but only find your corporate competitors.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-sm">✕</span>
                  <p className="text-sm text-slate-700">
                    Your phone rings constantly during busy hours just for basic questions like opening times and prices.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-sm">✕</span>
                  <p className="text-sm text-slate-700">
                    You rely entirely on word-of-mouth, leaving your weekly income unpredictable.
                  </p>
                </li>
              </ul>
            </div>

            {/* The sites4u Way (Built for Growth) */}
            <div className={`rounded-2xl border-2 border-emerald-100 bg-emerald-50/30 p-8 transition-opacity duration-300 ${
              activeTab === 'new' ? 'block' : 'hidden sm:block'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="font-serif text-xl font-bold text-[#1E293B]">With sites4u</h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Growing & Secure
                </span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">✓</span>
                  <p className="text-sm text-slate-700">
                    Your business sits proudly at the top of local Google Maps searches in Swansea, Neath, and Port Talbot.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">✓</span>
                  <p className="text-sm text-slate-700">
                    An easy, automated booking form lets customers schedule work or reserve tables while you sleep.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">✓</span>
                  <p className="text-sm text-slate-700">
                    A clean, fast website that works perfectly on mobile phones, showing off your best work with pride.
                  </p>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* CORE SERVICES PREVIEW GRID */}
        <div className="mt-28 md:mt-36">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-[#1E293B] sm:text-4xl">
              Everything you need to stand out, kept simple
            </h2>
            <p className="text-base text-slate-600 mt-3">
              We don't sell complicated software packages you don't need. We focus entirely on what brings cash through your door.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1: Web Design */}
            <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#C2410C] mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-3">Websites That Work on Phones</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                Over 70% of local customers search on their mobile phones. We build beautiful, fast-loading websites that look perfect on any screen size.
              </p>
            </div>

            {/* Card 2: Local SEO */}
            <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#C2410C] mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-3">Getting Found on Google</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                We register your business on Google Maps and optimize your details so local people find you first when they need a reliable service near them.
              </p>
            </div>

            {/* Card 3: Plain-English Technical Care */}
            <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#C2410C] mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-3">Hassle-Free Maintenance</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                We handle the security, hosting, and updates. You don't have to worry about domain names or technical issues—we keep the lights on for you.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="#services"
              className="inline-flex items-center gap-2 text-base font-bold text-[#C2410C] hover:text-[#A1340A] transition-colors underline"
            >
              View our detailed services & pricing
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* LOCAL HERO TESTIMONIAL BLOCK */}
        <div className="mt-28 md:mt-36 rounded-2xl bg-[#F1F5F9] overflow-hidden shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Image section */}
            <div className="relative h-72 lg:h-full lg:col-span-5 min-h-[320px]">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
                alt="Gareth Bowen of Bowen & Sons Plumbing"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute top-4 left-4">
                <span className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                  ★ +180% Increase in Local Phone Enquiries
                </span>
              </div>
            </div>

            {/* Quote section */}
            <div className="p-8 md:p-12 lg:col-span-7 flex flex-col justify-center">
              <span className="text-5xl font-serif text-[#C2410C] leading-none select-none">“</span>
              <blockquote className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed -mt-4">
                Before working with sites4u, we didn't even have a Google listing. I was worried a website would be too complicated to manage and too expensive to build. The team explained everything in plain English, set up our site, and now we get five to six new job enquiries every week directly through our online form. It’s completely changed how we run our family business.
              </blockquote>
              <div className="mt-6 pt-6 border-t border-slate-300">
                <p className="font-serif text-lg font-bold text-slate-950">Gareth Bowen</p>
                <p className="text-sm text-slate-600">Bowen & Sons Plumbing, Morriston, Swansea</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}