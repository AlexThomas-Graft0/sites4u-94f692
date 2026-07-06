'use client';

import React, { useState, useEffect, useRef } from 'react';
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
}

export function TransformationComparison() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real case studies from Supabase to provide community proof context
  useEffect(() => {
    async function fetchCaseStudies() {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(3);

      if (!error && data) {
        setCaseStudies(data as CaseStudy[]);
      }
    }
    fetchCaseStudies();
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 15,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 12 },
    },
  };

  return (
    <section 
      id="transformation" 
      className="relative py-24 bg-[#FAF6F0] overflow-hidden border-b border-[#F3E9D8]"
    >
      {/* Decorative Warm Accent Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C56A3C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#C56A3C] bg-[#C56A3C]/10 mb-4">
            Independent Business Transformation
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1E293B] leading-tight tracking-tight">
            See the difference a professional website makes
          </h2>
          <p className="mt-4 text-lg text-slate-600 font-sans">
            We help South Wales independent shops, trades, and cafes step away from outdated, stressful routines and move into simple, automated local growth.
          </p>
        </div>

        {/* Visual Interactive Slider (Before / After Showcase) */}
        <div className="mb-20">
          <div className="text-center mb-6">
            <span className="text-sm font-semibold text-slate-500 block sm:hidden">
              Drag or tap the image to slide between Old & New
            </span>
            <span className="text-sm font-semibold text-slate-500 hidden sm:block">
              Drag the golden handle left and right to compare
            </span>
          </div>

          <div 
            ref={containerRef}
            className="relative h-[340px] sm:h-[480px] w-full rounded-2xl overflow-hidden shadow-xl border-4 border-[#F3E9D8] cursor-ew-resize select-none"
            onTouchMove={handleTouchMove}
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {/* Right Side: After (Vibrant active cafe in Swansea) */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80" 
                alt="Modern vibrant local business with sites4u"
                className="w-full h-full object-cover"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/70 via-transparent to-transparent pointer-events-none" />
              
              {/* After Floating UI Overlays */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[#F3E9D8] max-w-xs transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live & Active</span>
                </div>
                <p className="text-sm font-serif font-bold text-[#111827]">Fully Booked Today</p>
                <p className="text-xs text-slate-600 mt-1">Customers reserve tables & request plumbing quotes automatically while you focus on work.</p>
              </div>
            </div>

            {/* Left Side: Before (Grayscale, quiet offline street) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 w-[100vw] h-full" style={{ width: containerRef.current?.getBoundingClientRect().width }}>
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80" 
                  alt="Traditional quiet shopfront before web presence"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Before Floating UI Overlays */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-red-200 max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unverified Listing</span>
                  </div>
                  <p className="text-sm font-serif font-bold text-[#111827]">Closed / Missing on Maps</p>
                  <p className="text-xs text-slate-600 mt-1">Local customers search Google but can’t find your hours, address, or phone number.</p>
                </div>
              </div>
            </div>

            {/* Slide Control Divider Line */}
            <div 
              className="absolute inset-y-0 w-1 bg-gradient-to-b from-[#C56A3C] via-[#F3E9D8] to-[#C56A3C] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-[#C56A3C] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#FAF6F0] pointer-events-auto cursor-ew-resize">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" className="rotate-90 origin-center" />
                </svg>
              </div>
            </div>

            {/* Left/Right Text Indicators */}
            <div className="absolute top-4 left-4 bg-[#DC2626]/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase pointer-events-none">
              Before sites4u
            </div>
            <div className="absolute top-4 right-4 bg-[#16A34A]/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase pointer-events-none">
              After sites4u
            </div>
          </div>
        </div>

        {/* Side-by-Side Detailed Comparison Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Left Column: Without a Web Presence */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#DC2626]" />
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#DC2626] block mb-1">
                    The Old Way
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#111827]">
                    Without a Web Presence
                  </h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  Losing Business
                </span>
              </div>

              <p className="text-slate-600 mb-8 text-sm">
                Relying entirely on physical foot traffic and outdated listings makes it hard to stand out when customers look for your services online.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[#DC2626]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">Invisible to Google Searches</strong>
                    <p className="text-sm text-slate-600 mt-0.5">Local customers search for your services on Google but only find your corporate competitors.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[#DC2626]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">Interrupted Working Hours</strong>
                    <p className="text-sm text-slate-600 mt-0.5">Your phone rings constantly during busy hours just for basic questions like opening times and prices.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[#DC2626]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">Unpredictable Income Streams</strong>
                    <p className="text-sm text-slate-600 mt-0.5">You rely entirely on word-of-mouth, leaving your weekly income unpredictable.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>Potential local customers often assume you have closed down.</span>
            </div>
          </motion.div>

          {/* Right Column: With sites4u */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#16A34A]" />
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] block mb-1">
                    The sites4u Way
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#111827]">
                    With sites4u
                  </h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Growing & Secure
                </span>
              </div>

              <p className="text-slate-600 mb-8 text-sm">
                A clean, modern online hub built to gather local leads, answer support questions, and run bookings effortlessly.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[#16A34A]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">Top Local Google Rankings</strong>
                    <p className="text-sm text-slate-600 mt-0.5 font-sans">Your business sits proudly at the top of local Google Maps searches in Swansea, Neath, and Port Talbot.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[#16A34A]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">Automated Calendar Bookings</strong>
                    <p className="text-sm text-slate-600 mt-0.5 font-sans">An easy, automated booking form lets customers schedule work or reserve tables while you sleep.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[#16A34A]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">Frictionless Mobile Experience</strong>
                    <p className="text-sm text-slate-600 mt-0.5 font-sans">A clean, fast website that works perfectly on mobile phones, showing off your best work with pride.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-xs text-emerald-700 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              <span>Includes complete security, hosting, and local SEO updates.</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Trust Stats / Case Study Highlights */}
        {caseStudies.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#F3E9D8]">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#C56A3C] mb-8">
              Real Impact In Our Communities
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <div key={study.id} className="bg-white/80 p-5 rounded-xl border border-[#F3E9D8] hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{study.client_name}</span>
                  <p className="text-sm text-slate-600 italic mb-3">"{study.solution.slice(0, 80)}..."</p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-1 rounded">
                    {study.result_metric_highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 text-sm mb-4">
            Ready to swap unpredictable weeks for consistent local bookings?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="#bookings" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-[#C2410C] hover:bg-[#A8380A] active:bg-[#8F2E08] transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:ring-offset-2 min-h-[48px]"
            >
              Book a Free 15-Minute Chat
            </a>
            <a 
              href="#work" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-[#1E293B] border-2 border-[#1E293B] hover:bg-[#1E293B]/5 active:bg-[#1E293B]/10 transition-all min-h-[48px]"
            >
              See Our Local Work
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            ★ Rated 5/5 by local Swansea business owners
          </p>
        </div>

      </div>
    </section>
  );
}