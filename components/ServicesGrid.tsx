'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';

interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  benefit: string;
  priceInfo: string;
  icon: React.ReactNode;
  bullets: string[];
  ctaText: string;
  estimatedCost: number;
  isMonthly: boolean;
}

export function ServicesGrid() {
  const services: ServiceItem[] = [
    {
      id: 'web-design',
      badge: 'The "Works on Phones" Website Design',
      title: 'A professional website designed specifically for your business',
      benefit: 'Your website is your digital shopfront. We make sure it looks inviting, loads instantly, and makes it incredibly easy for customers to contact you.',
      priceInfo: 'From £499 one-off cost or simple monthly payments.',
      estimatedCost: 499,
      isMonthly: false,
      icon: (
        <svg className="w-6 h-6 text-[#C2410C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      bullets: [
        'Fully Mobile-Friendly: Looks beautiful and works flawlessly on iPhones, Androids, tablets, and computers.',
        'Simple Contact & Enquiry Forms: Let customers request a quote, book a table, or ask a question directly from their phone.',
        'Secure & Fast: Built with modern standards so it loads instantly even on weak 4G signals down the Gower.',
        'Easy Content Editing: We set up a simple system so you can change your opening hours, upload new photos, or update prices in three clicks.'
      ],
      ctaText: "Let's talk about your new website"
    },
    {
      id: 'local-seo',
      badge: 'Local SEO (Getting Found on Google Maps)',
      title: 'Be the first business customers see when searching locally',
      benefit: "When someone in Swansea searches for 'best cafe near me' or 'emergency plumber Neath', we make sure your business is at the top of their search results.",
      priceInfo: 'Included with all website builds or available as a standalone boost.',
      estimatedCost: 150,
      isMonthly: false,
      icon: (
        <svg className="w-6 h-6 text-[#C2410C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bullets: [
        'Google Business Profile Setup: We build and optimize your official Google Maps listing so your address, phone number, and hours are always correct.',
        'Local Keyword Target: We structure your website text so search engines know exactly which neighborhoods you serve.',
        'Review Booster Guide: We show you a simple, non-intrusive way to gather positive 5-star Google reviews from your happy customers.'
      ],
      ctaText: 'Get found on Google'
    },
    {
      id: 'tech-care',
      badge: 'Plain-English Technical Care (Hosting & Maintenance)',
      title: 'We manage the technology while you run your business',
      benefit: "You don't need to spend your weekends worrying about website updates, security certificates, or server crashes. We handle it all quietly in the background.",
      priceInfo: 'Simple, rolling monthly care plans starting at £29/month. Cancel anytime.',
      estimatedCost: 29,
      isMonthly: true,
      icon: (
        <svg className="w-6 h-6 text-[#C2410C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bullets: [
        'Secure Website Hosting: We store your website on fast, secure UK-based servers so it is always online and ready.',
        'Domain Name Registration: We purchase and manage your web address (e.g., www.yourbusiness.co.uk) so you never lose ownership.',
        'Weekly Security Backups: We save secure copies of your website every week. If anything ever goes wrong, we restore it instantly for free.',
        'Friendly Local Support: Have a question or need a quick change? Call or email us directly. No automated support tickets—just real people in Swansea.'
      ],
      ctaText: 'Secure your peace of mind'
    },
    {
      id: 'marketing-automation',
      badge: 'Simple Marketing & Booking Automation',
      title: 'Cut down your admin work and automate your bookings',
      benefit: 'Stop spending hours answering basic phone calls during busy service times. Let your website handle bookings, reservations, and enquiries automatically.',
      priceInfo: 'Tailored to your specific daily operations.',
      estimatedCost: 95,
      isMonthly: true,
      icon: (
        <svg className="w-6 h-6 text-[#C2410C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bullets: [
        'Online Calendar Booking: Perfect for hair salons, therapists, or tradespeople. Let clients see your availability and book a slot directly.',
        'Table Reservation Systems: Simple, lightweight reservation forms for cafes and restaurants that notify you instantly via email.',
        'Automatic Email Confirmations: Sends a friendly, customized email confirmation to your customer the second they book, saving you manual follow-up time.'
      ],
      ctaText: 'Simplify your business admin'
    }
  ];

  // State for pricing estimator
  const [selectedEstimates, setSelectedEstimates] = useState<string[]>(['web-design', 'tech-care']);

  const toggleServiceEstimate = (id: string) => {
    if (selectedEstimates.includes(id)) {
      setSelectedEstimates(selectedEstimates.filter((item) => item !== id));
    } else {
      setSelectedEstimates([...selectedEstimates, id]);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  // Calculate totals
  const totalOneOff = services
    .filter((s) => selectedEstimates.includes(s.id) && !s.isMonthly)
    .reduce((sum, s) => sum + s.estimatedCost, 0);

  const totalMonthly = services
    .filter((s) => selectedEstimates.includes(s.id) && s.isMonthly)
    .reduce((sum, s) => sum + s.estimatedCost, 0);

  return (
    <section id="services" className="relative bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Soft warm background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FEF2F2] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#F3E9D8] rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#C2410C] bg-[#FEF2F2] rounded-full mb-3">
            What We Do For You
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1E293B] leading-tight tracking-tight">
            Simple, powerful digital services built for local success.
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            No hidden fees. No complicated jargon. Just the essential tools your South Wales business needs to find more customers and save valuable administrative time.
          </p>
        </div>

        {/* Detailed Service Breakdown Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Highlight bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C2410C] to-[#C56A3C] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Row */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-[#FEF2F2] rounded-xl flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                      {service.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#1E293B] mt-1">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Benefit Statement */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 italic border-l-2 border-[#C2410C]/40 pl-4 bg-slate-50 py-2 pr-2 rounded-r-md">
                  &ldquo;{service.benefit}&rdquo;
                </p>

                {/* What's Included Bullets */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    What&apos;s Included (In Plain English):
                  </h4>
                  <ul className="space-y-3">
                    {service.bullets.map((bullet, idx) => {
                      const [title, desc] = bullet.split(':');
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-sm text-slate-700 leading-relaxed">
                            <strong className="text-[#1E293B]">{title}:</strong>
                            {desc}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions & Pricing */}
              <div className="pt-6 border-t border-slate-100 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Pricing Structure</span>
                    <p className="text-base font-bold text-[#1E293B] mt-0.5">
                      {service.priceInfo}
                    </p>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-5 py-3 bg-[#1E293B] text-white hover:bg-[#C2410C] transition-colors rounded-lg text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] min-h-[48px] text-center"
                  >
                    {service.ctaText}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Plain-English Plan Builder */}
        <div className="bg-white rounded-2xl border-2 border-[#F3E9D8] p-6 sm:p-10 shadow-lg mb-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#C2410C] bg-[#FEF2F2] rounded-full mb-3 inline-block">
                Interactive Plan Builder
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#1E293B]">
                Estimate your custom South Wales business plan
              </h3>
              <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
                Choose the services you need. We keep everything completely transparent. No long-term lock-ins, and absolutely no surprise bills.
              </p>

              {/* Service Selection Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {services.map((service) => {
                  const isSelected = selectedEstimates.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleServiceEstimate(service.id)}
                      className={`flex items-start text-left p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-[#C2410C] bg-[#FEF2F2]/50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      style={{ minHeight: '48px' }}
                    >
                      <div className="flex items-center h-5 mr-3">
                        <input
                          id={`calc-check-${service.id}`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by button click
                          className="h-4.5 w-4.5 rounded border-slate-300 text-[#C2410C] focus:ring-[#C2410C]"
                        />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#1E293B]">
                          {service.id === 'web-design' ? 'Website Design' : service.id === 'local-seo' ? 'Local SEO Setup' : service.id === 'tech-care' ? 'Technical Care' : 'Booking Automation'}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {service.id === 'web-design' ? 'From £499' : service.id === 'local-seo' ? '£150 or Free with Build' : service.id === 'tech-care' ? '£29/mo' : '£95/mo'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Interactive Display */}
            <div className="lg:col-span-5 bg-[#F8FAFC] rounded-xl p-6 border border-slate-200/80 text-center lg:text-left">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Your Estimated Investment
              </span>
              
              <div className="space-y-4 my-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-600">One-off setup cost:</span>
                  <span className="text-xl font-bold text-[#1E293B]">
                    {totalOneOff > 0 ? `£${totalOneOff}` : '£0'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-600">Rolling monthly support:</span>
                  <span className="text-xl font-bold text-[#1E293B]">
                    {totalMonthly > 0 ? `£${totalMonthly}/mo` : '£0/mo'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic mb-6 leading-relaxed">
                * Note: Local SEO is completely included for free with our website builds. Setup costs can also be split into friendly interest-free monthly terms.
              </p>

              <a
                href="#contact"
                className="block w-full py-3.5 px-4 bg-[#C2410C] hover:bg-[#a8360a] text-white text-center rounded-lg font-bold transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C]"
              >
                Discuss This Custom Estimate
              </a>
            </div>

          </div>
        </div>

        {/* The "No Jargon" Promise Banner */}
        <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Decorative graphic element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full translate-x-20 -translate-y-20 opacity-30 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
            <div className="p-4 bg-slate-800 rounded-full flex-shrink-0 border border-slate-700">
              {/* Friendly handshake SVG */}
              <svg className="w-10 h-10 text-[#C56A3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.757c1.27 0 2.422-.512 3.243-1.343l-3.243 1.343zm0 0l-3.243-1.343M14 10c0 1.105-.895 2-2 2s-2-.895-2-2m4 0V8a2 2 0 10-4 0v2m0 0H5.243c-1.27 0-2.422-.512-3.243-1.343l3.243 1.343zm0 0l3.243-1.343M3 13.5h18M5 17h14a2 2 0 002-2v-1.5H3V15a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-lg font-bold uppercase tracking-wider text-[#C56A3C] mb-1">
                Our Plain-English Promise
              </h4>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                If we ever use a tech buzzword without explaining it in simple terms, your first month of website maintenance is completely free. We speak business, not code.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}