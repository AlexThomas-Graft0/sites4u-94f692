'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Handshake, Heart, ShieldCheck, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 14 }
  }
};

export function AboutUsAndPromise() {
  return (
    <section id="about" className="relative bg-[#FDFBF7] text-[#1E293B] overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Decorative Warm Backdrops */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#FEF2F2] to-transparent opacity-60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gradient-to-t from-[#F3E9D8] to-transparent opacity-40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.span 
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#C2410C] bg-[#FEF2F2] border border-[#FCA5A5]/30 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Swansea Roots & Clear Values
          </motion.span>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1E293B] tracking-tight leading-[1.1] mb-6"
          >
            We believe Swansea&apos;s independent businesses deserve a world-class online presence.
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-[#475569] font-medium leading-relaxed"
          >
            We are not a massive, faceless agency. We are your local digital partners, based right here in Swansea, dedicated to keeping our high streets vibrant, competitive, and successful.
          </motion.p>
        </motion.div>

        {/* Editorial Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 sm:mb-32">
          {/* Left: Interactive Editorial Copy */}
          <motion.div 
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#C2410C]">Our Story</span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1E293B] leading-tight">
              Bridging the Digital Divide in South Wales
            </h3>
            
            <div className="space-y-5 text-base sm:text-lg text-[#475569] leading-relaxed font-light">
              <p>
                We started <strong className="font-semibold text-[#1E293B]">sites4u</strong> because we noticed a frustrating trend in South Wales. While massive corporate chains had teams of developers and huge marketing budgets, our favorite local tradespeople, high-street shops, and family-run cafes were being left behind.
              </p>
              <p>
                The options available to local business owners were disappointing. They could either pay thousands of pounds to elite, jargon-heavy design agencies, or spend their rare free weekends struggling with confusing &apos;do-it-yourself&apos; website builders that never quite worked properly on mobile phones.
              </p>
              <p className="border-l-4 border-[#C2410C] pl-4 italic text-[#1E293B] font-medium bg-[#FEF2F2]/50 py-2 rounded-r-lg">
                We knew there had to be a better, more practical way.
              </p>
              <p>
                We founded sites4u in Swansea to provide a straightforward, affordable, and completely jargon-free alternative. We handle the complex technical details so you don&apos;t have to. We don&apos;t talk about &apos;responsive frameworks&apos; or &apos;conversion paradigms&apos;—we focus on building simple, reliable websites that make your phone ring and bring customers through your doors.
              </p>
            </div>

            <div className="pt-4">
              <a 
                href="#consultation" 
                className="inline-flex items-center gap-2 text-[#C2410C] font-bold hover:text-[#9A3412] transition-colors group text-lg"
              >
                Let&apos;s talk about your business growth
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Right: Layered Image Display */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-amber-50">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80" 
                alt="A cozy, bustling high street cafe in South Wales" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-bold tracking-widest text-[#FCA5A5] block mb-1">Local Swansea Pride</span>
                <p className="font-serif text-lg leading-snug">Keeping independent shops & cafes competitive in the modern digital world.</p>
              </div>
            </div>

            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#C2410C] text-white p-5 rounded-xl shadow-lg max-w-xs border-2 border-[#FDBA74]/20 hidden sm:block">
              <p className="text-2xl font-bold font-serif mb-1">100% Local</p>
              <p className="text-xs text-orange-100 leading-normal">
                No outsourcing. No offshore call centers. Just honest Swansea-based support.
              </p>
            </div>
          </motion.div>
        </div>

        {/* The "No Jargon" Promise Banner */}
        <motion.div 
          className="bg-[#1E293B] text-white rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-700 mb-24 sm:mb-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative geometric details */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2410C]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-slate-800 rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-start gap-4 sm:gap-6 max-w-3xl">
              <div className="p-4 bg-[#C2410C] rounded-xl text-white shrink-0 shadow-lg shadow-orange-950/40">
                <Handshake className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FDBA74] block mb-2">Our Absolute Guarantee</span>
                <h4 className="text-2xl sm:text-3xl font-serif mb-3 text-white">
                  The Plain-English Promise
                </h4>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  If we ever use a tech buzzword without explaining it in simple terms, your first month of website maintenance is completely free. We speak business, not code.
                </p>
              </div>
            </div>
            
            <div className="shrink-0 w-full md:w-auto text-left md:text-right">
              <span className="inline-block bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 font-mono">
                No jargon guarantee verified ✓
              </span>
            </div>
          </div>
        </motion.div>

        {/* Our Core Values Section */}
        <div className="mb-24 sm:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C2410C]">How We Work</span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1E293B] mt-2 mb-4">
              Our Core Values
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              We guide every decision with three simple principles designed to protect your interests and build trust.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Value 1 */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] text-[#C2410C] flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif text-[#1E293B] mb-3">Community First</h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  &ldquo;We live and work in Swansea. Your success is our success. When local independent businesses thrive, our communities remain strong, colorful, and unique. We champion the underdog, always.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400 font-medium uppercase tracking-wider">
                Swansea, Neath, Llanelli & Gower
              </div>
            </motion.div>

            {/* Value 2 */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] text-[#C2410C] flex items-center justify-center mb-6">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif text-[#1E293B] mb-3">Plain-English Transparency</h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  &ldquo;We believe in absolute honesty. No hidden fees, no complex rolling contracts, and absolutely no confusing tech jargon. If we can’t explain a feature to you in simple business terms, we won&apos;t build it.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400 font-medium uppercase tracking-wider">
                Honest, upfront pricing
              </div>
            </motion.div>

            {/* Value 3 */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] text-[#C2410C] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif text-[#1E293B] mb-3">High-Quality Accessibility</h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  &ldquo;A professional, high-performing website shouldn’t be a luxury reserved only for major corporations. We keep our overheads low so we can provide enterprise-grade web design at prices that make sense for family-run businesses.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400 font-medium uppercase tracking-wider">
                Fair rates for independent trade
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Meet Your Local Partners */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C2410C]">Face to Face Support</span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#1E293B] mt-2 mb-4">
              Meet Your Local Partners
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              We&apos;re always at the other end of the phone, or ready to meet for a friendly chat and a warm cup of tea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* Profile 1 */}
            <motion.div 
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="sm:w-2/5 relative h-64 sm:h-auto min-h-[220px]">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80" 
                  alt="Owen Evans - Founder & Web Designer at sites4u" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-serif text-[#1E293B] mb-1">Owen Evans</h4>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C] block mb-3">Founder & Web Designer</span>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Owen grew up in West Glamorgan and has spent over a decade building clean, fast websites. Tired of seeing local businesses get overcharged for simple web services, he launched sites4u to offer a friendly, down-to-earth alternative. When he isn&apos;t coding, you&apos;ll find him walking his dog on the Gower.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <span>Based in Swansea</span>
                  <span>owen@sites4u.co.uk</span>
                </div>
              </div>
            </motion.div>

            {/* Profile 2 */}
            <motion.div 
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="sm:w-2/5 relative h-64 sm:h-auto min-h-[220px]">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80" 
                  alt="Sian Davies - Local SEO & Customer Support at sites4u" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-serif text-[#1E293B] mb-1">Sian Davies</h4>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C] block mb-3">Local SEO & Customer Support</span>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Sian manages our local search strategies and client onboarding. She ensures your Google Maps profile is perfectly optimized and is always at the end of the phone to help our clients update their sites. She&apos;s passionate about supporting independent high-street retail.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <span>Based in Swansea</span>
                  <span>sian@sites4u.co.uk</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}