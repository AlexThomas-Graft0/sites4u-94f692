'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  PhoneCall, 
  ExternalLink, 
  ChevronRight, 
  Calendar, 
  Sparkles,
  Search,
  DollarSign
} from 'lucide-react';

interface CaseStudyItem {
  id: string;
  client_name: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  result_metric_highlight: string;
  before_label: string;
  after_label: string;
  client_quote: string;
  client_author: string;
  client_role: string;
  image_url: string;
  before_image_url: string;
}

const DEFAULT_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'uplands-cafe',
    client_name: 'The Uplands Cafe',
    industry: 'Food & Hospitality',
    location: 'Uplands, Swansea',
    challenge: 'The cafe relied entirely on foot traffic and Facebook updates. They had no central menu online, and staff spent up to two hours every Saturday morning answering phone calls to take table bookings, frequently interrupting busy kitchen service.',
    solution: 'We built a clean, appetizing mobile-first website featuring a prominent, easy-to-read menu and an automated reservation widget. We also claimed and optimized their Google Maps profile to capture tourists searching for breakfast options in Uplands.',
    result_metric_highlight: '★ +140% Table Bookings & Ranked #1 for \'Breakfast in Uplands\'',
    before_label: 'No website. Outdated, blurry Facebook photos.',
    after_label: 'Modern, fast-loading menu with instant booking system.',
    client_quote: 'We don\'t miss calls during the breakfast rush anymore because the website takes the bookings for us. Our weekend revenue is up by 30%!',
    client_author: 'Sarah Jenkins',
    client_role: 'Owner',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    before_image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'thomas-carpentry',
    client_name: 'Thomas & Sons Carpentry',
    industry: 'Building & Carpentry Trades',
    location: 'Neath, South Wales',
    challenge: 'A highly respected family business with zero online presence. Corporate building firms were winning local search traffic, leaving Thomas & Sons dependent on unpredictable word-of-mouth recommendations.',
    solution: 'We designed a straightforward, visual portfolio website highlighting their high-quality local craftsmanship. We integrated a frictionless \'Request a Free Quote\' form and set up a local SEO foundation targeting Neath, Port Talbot, and Swansea.',
    result_metric_highlight: '★ 35+ New Local Quote Enquiries Per Month',
    before_label: 'Completely invisible on Google search results.',
    after_label: 'Top-ranking local website featuring a high-resolution gallery of completed work.',
    client_quote: 'I was skeptical about needing a website, but sites4u made it so easy. Now, local people find us on Google, see our work, and request a quote in seconds. The investment paid for itself in the first month.',
    client_author: 'David Thomas',
    client_role: 'Founder',
    image_url: 'https://images.unsplash.com/photo-1581850518616-bcb8077fa213?auto=format&fit=crop&w=800&q=80',
    before_image_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gower-lets',
    client_name: 'Gower Coast Holiday Lets',
    industry: 'Tourism & Accommodation',
    location: 'Gower Peninsula, Swansea',
    challenge: 'The owner was paying high commission fees (up to 20%) to international booking platforms like Airbnb and Booking.com just to secure reservations. Managing calendars across multiple sites manually was causing frequent double-bookings.',
    solution: 'We designed a gorgeous, secure, direct-booking holiday rental website. We integrated a centralized booking calendar that synchronizes automatically with external platforms, eliminating double-bookings and allowing guests to pay directly with zero commission fees.',
    result_metric_highlight: '★ Saved £450+ per month in booking platform commissions',
    before_label: 'High booking fees and manual calendar updates.',
    after_label: 'Direct, commission-free booking website with automated calendar sync.',
    client_quote: 'Taking back control of our bookings has been incredible. Our guests love booking directly through our secure site, and we keep 100% of our rental income.',
    client_author: 'Helen Vaughan',
    client_role: 'Property Owner',
    image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    before_image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 }
  }
};

export function PortfolioShowcase() {
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_CASE_STUDIES[0].id);
  const [toggleState, setToggleState] = useState<Record<string, 'before' | 'after'>>({
    'uplands-cafe': 'after',
    'thomas-carpentry': 'after',
    'gower-lets': 'after'
  });
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>(DEFAULT_CASE_STUDIES);

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted: CaseStudyItem[] = data.map((item: any, index: number) => {
            const fallback = DEFAULT_CASE_STUDIES[index] || DEFAULT_CASE_STUDIES[0];
            return {
              id: item.id,
              client_name: item.client_name || fallback.client_name,
              industry: item.industry || fallback.industry,
              location: item.location || 'South Wales',
              challenge: item.challenge || fallback.challenge,
              solution: item.solution || fallback.solution,
              result_metric_highlight: item.result_metric_highlight || fallback.result_metric_highlight,
              before_label: fallback.before_label,
              after_label: fallback.after_label,
              client_quote: fallback.client_quote,
              client_author: fallback.client_author,
              client_role: fallback.client_role,
              image_url: item.image_url || fallback.image_url,
              before_image_url: fallback.before_image_url
            };
          });
          setCaseStudies(formatted);
          setActiveTab(formatted[0].id);
        }
      } catch (err) {
        // Fallback silently to default statically-defined data
      }
    }
    fetchCaseStudies();
  }, []);

  const handleToggle = (id: string, state: 'before' | 'after') => {
    setToggleState(prev => ({ ...prev, [id]: state }));
  };

  const activeStudy = caseStudies.find(study => study.id === activeTab) || caseStudies[0];

  return (
    <section id="portfolio" className="relative py-20 bg-[#FDFBF7] overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F3E9D8] rounded-full filter blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FEF2F2] rounded-full filter blur-3xl opacity-60 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#C56A3C] tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Proven Local Success
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1E293B] tracking-tight leading-tight mb-6">
            Real transformations for South Wales high streets.
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-sans">
            We measure our success by the growth of our local community. Take a look at how we have helped independent businesses in Swansea step online with confidence.
          </p>
        </div>

        {/* Tab Selector for Mobile / Desktop Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-2xl mx-auto p-1.5 bg-[#F3E9D8]/50 rounded-xl border border-slate-200">
          {caseStudies.map((study) => (
            <button
              key={study.id}
              onClick={() => setActiveTab(study.id)}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C56A3C] ${
                activeTab === study.id
                  ? 'bg-white text-[#1E293B] shadow-sm'
                  : 'text-slate-600 hover:text-[#1E293B] hover:bg-white/40'
              }`}
            >
              {study.client_name}
            </button>
          ))}
        </div>

        {/* Selected Case Study Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {/* Left Column: Interactive Before/After Visual Mockup */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono tracking-wider uppercase text-slate-400">Interactive Website Preview</span>
                  
                  {/* Before / After Toggle Switch */}
                  <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
                    <button
                      onClick={() => handleToggle(activeStudy.id, 'before')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all focus:outline-none ${
                        toggleState[activeStudy.id] === 'before'
                          ? 'bg-rose-100 text-rose-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleToggle(activeStudy.id, 'after')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all focus:outline-none ${
                        toggleState[activeStudy.id] === 'after'
                          ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      After (sites4u)
                    </button>
                  </div>
                </div>

                {/* Simulated Device Screen */}
                <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-inner group">
                  <AnimatePresence mode="wait">
                    {toggleState[activeStudy.id] === 'before' ? (
                      <motion.div
                        key="before-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col"
                      >
                        {/* Outdated/Offline Visual */}
                        <div className="absolute inset-0 bg-slate-900/40 z-10 flex flex-col justify-end p-6 text-white backdrop-blur-[2px]">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-600 text-xs font-bold w-fit mb-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Losing Business
                          </span>
                          <p className="text-sm font-medium leading-relaxed max-w-sm drop-shadow-md">
                            {activeStudy.before_label}
                          </p>
                        </div>
                        <img 
                          src={activeStudy.before_image_url} 
                          alt="Old visual state" 
                          className="w-full h-full object-cover filter grayscale contrast-125"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="after-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col"
                      >
                        {/* Header of mock new site */}
                        <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                          </div>
                          <span className="bg-slate-50 px-3 py-0.5 rounded border border-slate-100 font-mono text-slate-500 max-w-[160px] truncate">
                            {activeStudy.client_name.toLowerCase().replace(/\s+/g, '')}.co.uk
                          </span>
                          <span className="w-4" />
                        </div>

                        {/* Delicious New Content */}
                        <div className="relative flex-1">
                          <img 
                            src={activeStudy.image_url} 
                            alt="Beautiful modern website showcase" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#16A34A] text-xs font-bold w-fit mb-2">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Growing & Secure
                            </span>
                            <p className="text-sm font-semibold leading-normal drop-shadow-md">
                              {activeStudy.after_label}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Toggle Warning Helper text */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  {toggleState[activeStudy.id] === 'before' ? 'The Pain Point' : 'The Growth Solution'}
                </span>
                <p className="text-sm text-slate-600 font-sans">
                  {toggleState[activeStudy.id] === 'before' 
                    ? activeStudy.challenge 
                    : activeStudy.solution
                  }
                </p>
              </div>
            </div>

            {/* Right Column: Narrative Case Study, Testimonial & ROI Metrics */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              {/* Header Details */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                    {activeStudy.industry} • {activeStudy.location}
                  </span>
                  
                  {/* Premium Metric Badge */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                    {activeStudy.result_metric_highlight}
                  </span>
                </div>

                <h3 className="text-3xl font-serif text-[#1E293B] mb-4">
                  {activeStudy.client_name}
                </h3>

                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">The Local Challenge:</h4>
                    <p>{activeStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">The sites4u Solution:</h4>
                    <p>{activeStudy.solution}</p>
                  </div>
                </div>
              </div>

              {/* Client Quote Box */}
              <div className="bg-[#F3E9D8]/40 p-6 sm:p-8 rounded-2xl border border-slate-200/60 relative">
                <span className="absolute top-4 right-6 text-6xl text-[#C56A3C]/10 font-serif pointer-events-none select-none">“</span>
                <p className="text-base sm:text-lg text-slate-700 italic font-sans mb-4 relative z-10 leading-relaxed">
                  &ldquo;{activeStudy.client_quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C56A3C]/20 flex items-center justify-center font-serif text-lg font-bold text-[#C56A3C]">
                    {activeStudy.client_author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">{activeStudy.client_author}</p>
                    <p className="text-xs text-slate-500">{activeStudy.client_role}, {activeStudy.client_name}</p>
                  </div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="pt-2">
                <a 
                  href="#contact" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C56A3C] hover:bg-[#b05c32] text-white font-bold rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#C56A3C] focus:ring-offset-2"
                >
                  Get a Similar Transformation For Your Business
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Trust Signpost */}
        <div className="mt-20 border-t border-slate-200 pt-10 text-center">
          <p className="text-sm text-slate-500 font-sans">
            Are you ready to stop losing business to corporate chains? Let us build a reliable, high-contrast website that works.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>No Hidden Platform Fees</span>
            <span>•</span>
            <span>UK-Based Fast Hosting</span>
            <span>•</span>
            <span>Optimized for Google Maps</span>
          </div>
        </div>

      </div>
    </section>
  );
}