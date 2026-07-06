'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  published_at: string | null;
}

interface StaticArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  contentNodes: React.ReactNode;
}

export function SmallBusinessHub() {
  const [dbPosts, setDbPosts] = useState<BlogPost[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<StaticArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Lead Form State (for SEO audit request)
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    current_website: '',
    message: 'I would like a free 15-minute Local SEO Audit for my business.'
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Load posts from Supabase if available
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (!error && data) {
          setDbPosts(data);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      }
    }
    fetchBlogPosts();
  }, []);

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: formData.name,
            business_name: formData.business_name,
            email: formData.email,
            phone: formData.phone,
            current_website: formData.current_website,
            message: formData.message,
            status: 'new'
          }
        ]);

      if (error) throw error;
      setFormStatus('success');
      setFormData({
        name: '',
        business_name: '',
        email: '',
        phone: '',
        current_website: '',
        message: 'I would like a free 15-minute Local SEO Audit for my business.'
      });
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setFormStatus('error');
    }
  };

  // Static rich articles based on the copy deck
  const staticArticles: StaticArticle[] = [
    {
      id: 'google-maps-guide',
      title: 'How to Get Your Swansea Business Listed on Google Maps (Step-by-Step)',
      category: 'Local SEO',
      readTime: '5 mins',
      date: 'Oct 12, 2024',
      excerpt: 'If you run a local business—whether you are an electrician in Morriston, a cafe owner in Mumbles, or a hairdresser in Swansea city center—there is one digital tool that is more important than any other: Google Maps.',
      imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
      contentNodes: (
        <div className="space-y-6 text-stone-800 leading-relaxed">
          <p className="text-lg text-stone-600 italic">
            When local people search for services near them, Google displays a map showing three local options. If your business isn't on that map, you are losing customers to competitors every single day.
          </p>
          <p>
            Here is our simple, step-by-step guide to claiming your free Google Maps listing and making sure local customers find you first.
          </p>

          <div className="border-l-4 border-[#C56A3C] pl-4 my-6 py-1 bg-stone-50">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Step 1: Claim Your Free Google Business Profile</h3>
            <p className="text-stone-700">
              First, visit <strong className="text-stone-900">google.com/business</strong> and sign in with your normal Google account. Search for your business name. If it doesn't appear, click "Add your business to Google."
            </p>
            <p className="text-sm text-stone-500 mt-1 italic">
              *Tip: Make sure you spell your business name exactly as it appears on your physical shopfront or van.*
            </p>
          </div>

          <div className="border-l-4 border-[#C56A3C] pl-4 my-6 py-1 bg-stone-50">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Step 2: Choose Your Business Category Carefully</h3>
            <p className="text-stone-700">
              Google will ask you to select a primary category. This is incredibly important because it tells the search engine exactly what you do.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-stone-600">
              <li>If you are a plumber who also does bathroom tiling, choose <strong>Plumber</strong> as your main category.</li>
              <li>Do not try to pack your business name with keywords (e.g., "Gareth's Plumbing - Best Cheap Plumber Swansea"). Google can penalize your listing for this. Keep your name clean and honest.</li>
            </ul>
          </div>

          <div className="border-l-4 border-[#C56A3C] pl-4 my-6 py-1 bg-stone-50">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Step 3: Enter Your Physical Address (Or Your Service Area)</h3>
            <p className="text-stone-700">
              <strong>If you have a physical shop or office:</strong> Enter your exact address. Google will send a postcard with a verification code to this address to prove you are located there.
            </p>
            <p className="text-stone-700 mt-2">
              <strong>If you are a mobile trade (like a plumber or electrician):</strong> You don't want your home address displayed publicly. Google allows you to hide your address and select a "Service Area" instead (for example: "Swansea, Neath, and Llanelli").
            </p>
          </div>

          <div className="border-l-4 border-[#C56A3C] pl-4 my-6 py-1 bg-stone-50">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Step 4: Add Your Opening Hours and Phone Number</h3>
            <p className="text-stone-700">
              Make sure your opening hours are 100% correct. There is nothing more frustrating for a customer than driving to a shop listed as "Open" on Google Maps, only to find the shutters down.
            </p>
          </div>

          <div className="border-l-4 border-[#C56A3C] pl-4 my-6 py-1 bg-stone-50">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Step 5: Upload High-Quality Photos</h3>
            <p className="text-stone-700">
              Businesses with photos on their Google Maps listing receive 42% more requests for driving directions than those without. You don't need a professional camera—simply use your smartphone to take:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-stone-600">
              <li>A clear photo of the front of your business (so customers can spot you).</li>
              <li>Three photos of your team at work or your products.</li>
              <li>A photo of your friendly team!</li>
            </ul>
          </div>

          <div className="mt-8 p-6 bg-stone-100 rounded-lg border border-stone-200">
            <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Need Help Setting This Up?</h4>
            <p className="text-stone-700 mb-4">
              If you don't have the time to set this up, or if you want to ensure your profile is fully optimized to rank ahead of your local competitors, we can handle it all for you.
            </p>
            <a href="#seo-audit" className="inline-block px-5 py-3 bg-[#C56A3C] text-white font-bold rounded-md hover:bg-orange-800 transition">
              Book a Free Chat with our Swansea Team
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'website-essentials',
      title: '3 Simple Things Your Website Needs to Turn Visitors into Paying Customers',
      category: 'Web Design Basics',
      readTime: '4 mins',
      date: 'Sept 28, 2024',
      excerpt: 'Many business owners believe that a website needs to be a complex, multi-page masterpiece to be successful. In reality, customers want three simple things when they visit a local business website.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      contentNodes: (
        <div className="space-y-6 text-stone-800 leading-relaxed">
          <p className="text-lg text-stone-600 italic">
            If your site doesn't have these three simple features, visitors will click away to your competitors in seconds.
          </p>

          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-stone-900">1. Your Phone Number & Location (Clear and at the Top)</h3>
            <p>
              When someone lands on your website, they are usually looking for a quick way to contact you or check where you are based. Do not make them search for this information.
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pl-4">
              <li><strong>The Solution:</strong> Place your phone number, email address, and physical location right at the very top of your homepage in large, easy-to-read text.</li>
              <li><strong>Mobile Tip:</strong> Make sure your phone number is "click-to-call" so mobile visitors can tap it and dial instantly.</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-2xl font-bold text-stone-900">2. A Clear Explanation of What You Do</h3>
            <p>
              Within three seconds of landing on your website, a visitor should know exactly what you sell or do, and who you do it for.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-1">Bad Example</span>
                <p className="text-sm text-red-900">"Providing synergistic engineering paradigms across the South Wales region." (No one knows what this means!)</p>
              </div>
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md">
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">Good Example</span>
                <p className="text-sm text-green-900">"Reliable, emergency domestic plumbing services in Swansea and Neath." (Clear, direct, and local.)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-2xl font-bold text-stone-900">3. A Single, Easy Next Step (Your "Call to Action")</h3>
            <p>
              What is the one thing you want a visitor to do before they leave your website? Do you want them to call you? Request a quote? Or book a table?
            </p>
            <p>
              <strong>The Solution:</strong> Make this step prominent. Use a bright, contrasting button (like terracotta red) that stands out clearly from the rest of the page. Use simple, low-pressure language like "Get a Free Quote" or "Book a Table."
            </p>
          </div>

          <div className="mt-8 p-6 bg-stone-100 rounded-lg border border-stone-200">
            <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Want a free review of your current website?</h4>
            <p className="text-stone-700 mb-4">
              We will look over your site and give you three practical tips to improve your conversions—completely free of charge.
            </p>
            <a href="#seo-audit" className="inline-block px-5 py-3 bg-[#C56A3C] text-white font-bold rounded-md hover:bg-orange-800 transition">
              Get in touch today
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'agency-trap',
      title: "Why Your Business Doesn't Need a £10,000 Agency Website to Compete",
      category: 'Business Growth',
      readTime: '4 mins',
      date: 'Sept 14, 2024',
      excerpt: 'We have spoken with dozens of Swansea business owners who felt intimidated by digital marketing. They had been quoted thousands of pounds by slick, high-end agencies for features they simply did not need.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      contentNodes: (
        <div className="space-y-6 text-stone-800 leading-relaxed">
          <p className="text-lg text-stone-600 italic">
            Here is the truth: you do not need a massive, custom-coded corporate website to compete with national chains. You just need a site that gets the fundamentals right.
          </p>

          <h3 className="font-serif text-2xl font-bold text-stone-900 mt-6">The "Big Agency" Trap</h3>
          <p>
            Elite design agencies love to sell complex features like custom animations, high-tech databases, and bespoke software integrations. While these tools have their place for multi-million pound corporations, they are often completely unnecessary for local tradespeople or high-street retail.
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-700 pl-4">
            <li>These complex features make your website slow to load on mobile phones.</li>
            <li>They are incredibly expensive to fix if they break.</li>
            <li>They make it almost impossible for you to update your own website content.</li>
          </ul>

          <h3 className="font-serif text-2xl font-bold text-stone-900 mt-6">What Actually Matters for Local Success</h3>
          <p>
            To rank well on Google and win local customers, your website needs to focus on three simple pillars:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-stone-700 pl-4 font-semibold">
            <li>
              <span className="font-normal text-stone-800"><strong>Speed:</strong> It must load in under two seconds.</span>
            </li>
            <li>
              <span className="font-normal text-stone-800"><strong>Clarity:</strong> It must clearly display your reviews, work quality, and contact details.</span>
            </li>
            <li>
              <span className="font-normal text-stone-800"><strong>Local Relevance:</strong> It must show Google that you are a genuine, trusted business operating in South Wales.</span>
            </li>
          </ol>

          <p className="mt-4">
            By focusing purely on these three pillars, you can build a highly successful online presence for a fraction of the cost of a corporate agency build.
          </p>

          <div className="mt-8 p-6 bg-stone-100 rounded-lg border border-stone-200">
            <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Straightforward Web Design</h4>
            <p className="text-stone-700 mb-4">
              At sites4u, we specialize in building fast, simple, and affordable websites that focus on real-world results.
            </p>
            <a href="#seo-audit" className="inline-block px-5 py-3 bg-[#C56A3C] text-white font-bold rounded-md hover:bg-orange-800 transition">
              See our straightforward pricing
            </a>
          </div>
        </div>
      )
    }
  ];

  // Merge static and DB articles safely
  const categories = ['All', 'Local SEO', 'Web Design Basics', 'Business Growth'];
  
  const filteredArticles = staticArticles.filter(
    (art) => selectedCategory === 'All' || art.category === selectedCategory
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <section id="small-business-hub" className="relative py-24 bg-[#FDFBF7] overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3E9D8] rounded-full filter blur-3xl opacity-40 -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FEF2F2] rounded-full filter blur-3xl opacity-60 -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#C56A3C] bg-[#FEF2F2] rounded-full mb-4">
            Swansea Small Business Hub
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight mb-4">
            Straightforward advice to grow your business online.
          </h2>
          <p className="text-lg md:text-xl text-stone-600 font-sans">
            No marketing fluff or complex theories. Just simple, practical guides written specifically for busy independent business owners in South Wales.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                selectedCategory === category
                  ? 'bg-[#C56A3C] text-white border-[#C56A3C] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-[#C56A3C] hover:text-[#C56A3C]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Article Grid & Lead Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Article Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filteredArticles.map((article) => (
              <motion.article
                key={article.id}
                variants={itemVariants}
                className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-[#C56A3C] uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-stone-500 mb-3 font-mono">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime} read</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-950 mb-3 group-hover:text-[#C56A3C] transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-3 mb-6 font-sans">
                      {article.excerpt}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full py-2.5 px-4 bg-stone-50 hover:bg-[#FEF2F2] border border-stone-200 hover:border-[#C56A3C] text-stone-800 hover:text-[#C56A3C] font-bold text-sm rounded-md transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Read Full Guide</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.article>
            ))}

            {/* Empty/Fallback State if DB/Filters yield nothing */}
            {filteredArticles.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-stone-300">
                <p className="text-stone-500 font-medium">No articles found in this category.</p>
                <button 
                  onClick={() => setSelectedCategory('All')} 
                  className="mt-4 text-[#C56A3C] font-bold underline"
                >
                  View all guides
                </button>
              </div>
            )}
          </motion.div>

          {/* Sticky Sidebar Form: Free SEO Audit */}
          <div id="seo-audit" className="lg:col-span-1 bg-white p-8 rounded-xl border-2 border-[#F3E9D8] shadow-sm sticky top-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="p-1.5 bg-[#FEF2F2] rounded-md text-[#C56A3C]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-950">Free Local SEO Audit</h3>
            </div>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              Wondering why competitors rank higher on Google Maps in Swansea? Let our local experts check your current listing and website. No charge, completely jargon-free.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="audit-name" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  id="audit-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gareth Bowen"
                  className="w-full px-3 py-2.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C56A3C] focus:border-[#C56A3C] text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="audit-business" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Business Name *
                </label>
                <input
                  id="audit-business"
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="e.g., Bowen & Sons Plumbing"
                  className="w-full px-3 py-2.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C56A3C] focus:border-[#C56A3C] text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="audit-email" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="audit-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., gareth@bowenplumbing.co.uk"
                  className="w-full px-3 py-2.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C56A3C] focus:border-[#C56A3C] text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="audit-phone" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="audit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 01792 000000"
                  className="w-full px-3 py-2.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C56A3C] focus:border-[#C56A3C] text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="audit-website" className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Current Website (If any)
                </label>
                <input
                  id="audit-website"
                  type="url"
                  value={formData.current_website}
                  onChange={(e) => setFormData({ ...formData, current_website: e.target.value })}
                  placeholder="e.g., www.myoldwebsite.co.uk"
                  className="w-full px-3 py-2.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C56A3C] focus:border-[#C56A3C] text-stone-900"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full py-3 bg-[#C56A3C] text-white font-bold rounded hover:bg-orange-800 transition duration-150 focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:opacity-50 text-sm mt-2"
              >
                {formStatus === 'submitting' ? 'Submitting...' : 'Request Free SEO Audit'}
              </button>

              {formStatus === 'success' && (
                <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200 mt-2">
                  ✓ Done! We will review your business presence and email your report within 1 working day.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="p-3 bg-red-50 text-red-800 text-xs rounded border border-red-200 mt-2">
                  ✗ Something went wrong. Please try again or email us directly.
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

      {/* Modal View for Article Reading */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
            >
              {/* Modal Image Header */}
              <div className="relative h-64 md:h-80 w-full bg-stone-100">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-white/95 hover:bg-white text-stone-900 p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                  aria-label="Close article"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Overlaid Title */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-2 py-0.5 bg-[#C56A3C] text-xs font-bold uppercase tracking-wider rounded mb-2">
                    {selectedArticle.category}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-10">
                <div className="flex items-center space-x-4 text-sm text-stone-500 mb-6 font-mono border-b border-stone-100 pb-4">
                  <span>Published: {selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime} read</span>
                </div>

                <div className="prose prose-stone max-w-none">
                  {selectedArticle.contentNodes}
                </div>

                {/* Footer in Modal */}
                <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-stone-600 text-sm text-center sm:text-left">
                    Want more tips? Join the South Wales business community.
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold rounded transition"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}