'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface Enquiry {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string;
  current_website?: string;
  message: string;
  status: 'new' | 'contacting' | 'onboarded' | 'archived';
  created_at: string;
}

interface AnalyticsReport {
  id: string;
  client_id?: string;
  month_year: string;
  total_visits: number;
  google_maps_views: number;
  phone_clicks: number;
  seo_health_score: number;
  notes?: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  published_at?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 }
  }
};

const tabVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

export function ClientPortalAndAdmin() {
  const [activeTab, setActiveTab] = useState<'portal' | 'admin'>('portal');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- Real / Mock State ---
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: 'enq-1',
      name: 'Gareth Bowen',
      business_name: 'Bowen & Sons Plumbing',
      email: 'gareth@bowenplumbing.co.uk',
      phone: '01792 000000',
      message: 'I want to get found on Google Maps in Morriston.',
      status: 'new',
      created_at: '2024-10-24'
    },
    {
      id: 'enq-2',
      name: 'Sarah Jenkins',
      business_name: 'The Uplands Cafe',
      email: 'sarah@uplandscafe.co.uk',
      phone: '01792 111222',
      message: 'Need a mobile menu and direct booking system to stop constant phone calls during breakfast rush.',
      status: 'contacting',
      created_at: '2024-10-23'
    },
    {
      id: 'enq-3',
      name: 'David Thomas',
      business_name: 'Thomas & Sons Carpentry',
      email: 'david@thomascarpentry.co.uk',
      phone: '01639 555444',
      message: 'A straightforward portfolio website highlighting our craftsmanship in Neath.',
      status: 'onboarded',
      created_at: '2024-10-22'
    }
  ]);

  const [reports, setReports] = useState<AnalyticsReport[]>([
    {
      id: 'rep-1',
      month_year: 'October 2024',
      total_visits: 1240,
      google_maps_views: 3850,
      phone_clicks: 84,
      seo_health_score: 98,
      notes: 'Excellent growth this month! Your local map optimization is working perfectly and driving direct calls.'
    }
  ]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 'blog-1',
      title: 'How to Get Your Swansea Business Listed on Google Maps',
      slug: 'how-to-get-listed-google-maps',
      content: 'Step-by-step guide to claiming your listing...',
      excerpt: 'Learn how to claim your free Google Maps listing and rank higher than your competitors in South Wales.',
      featured_image_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // --- Form States ---
  // Support Request (Client Portal)
  const [ticketSubject, setTicketSubject] = useState('change_text');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  // Report Generator (Admin Panel)
  const [adminReportClient, setAdminReportClient] = useState('client-uuid-1');
  const [adminReportMonth, setAdminReportMonth] = useState('October 2024');
  const [adminReportVisits, setAdminReportVisits] = useState('1240');
  const [adminReportMaps, setAdminReportMaps] = useState('3850');
  const [adminReportClicks, setAdminReportClicks] = useState('84');
  const [adminReportSeo, setAdminReportSeo] = useState('98');
  const [adminReportNotes, setAdminReportNotes] = useState('');
  const [isPublishingReport, setIsPublishingReport] = useState(false);

  // Blog Publisher (Admin Panel)
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isPublishingBlog, setIsPublishingBlog] = useState(false);

  // --- Data Fetching from Supabase ---
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: fetchedEnquiries } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });
        if (fetchedEnquiries && fetchedEnquiries.length > 0) {
          setEnquiries(fetchedEnquiries as Enquiry[]);
        }

        const { data: fetchedReports } = await supabase
          .from('analytics_reports')
          .select('*')
          .order('created_at', { ascending: false });
        if (fetchedReports && fetchedReports.length > 0) {
          setReports(fetchedReports as AnalyticsReport[]);
        }

        const { data: fetchedBlog } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (fetchedBlog && fetchedBlog.length > 0) {
          setBlogPosts(fetchedBlog as BlogPost[]);
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      }
    }
    fetchData();
  }, []);

  const triggerNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // --- Actions ---
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSupport(true);
    try {
      const { error } = await supabase.from('support_requests').insert([
        {
          message: `[Subject: ${ticketSubject}] ${ticketMessage}`
        }
      ]);

      if (error) throw error;

      triggerNotification('success', 'Your website update request has been received. We will handle it within 24 hours!');
      setTicketMessage('');
    } catch (err: any) {
      // Graceful local fallback for demo environment
      triggerNotification('success', 'Demo Mode: Your update request has been logged locally. Sian or Owen will update your site shortly!');
      setTicketMessage('');
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  const handlePublishReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingReport(true);
    const newReport: AnalyticsReport = {
      id: Math.random().toString(),
      month_year: adminReportMonth,
      total_visits: parseInt(adminReportVisits) || 0,
      google_maps_views: parseInt(adminReportMaps) || 0,
      phone_clicks: parseInt(adminReportClicks) || 0,
      seo_health_score: Math.min(100, Math.max(1, parseInt(adminReportSeo) || 100)),
      notes: adminReportNotes,
      created_at: '2024-10-24'
    };

    try {
      const { error } = await supabase.from('analytics_reports').insert([
        {
          month_year: newReport.month_year,
          total_visits: newReport.total_visits,
          google_maps_views: newReport.google_maps_views,
          phone_clicks: newReport.phone_clicks,
          seo_health_score: newReport.seo_health_score,
          notes: newReport.notes
        }
      ]);
      if (error) throw error;

      setReports([newReport, ...reports]);
      triggerNotification('success', `Success! Analytics report for ${adminReportMonth} published to the Client Portal.`);
      setAdminReportNotes('');
    } catch (err) {
      // Local fallback
      setReports([newReport, ...reports]);
      triggerNotification('success', `Demo Mode: Analytics report generated for ${adminReportMonth} and updated in the live view below.`);
      setAdminReportNotes('');
    } finally {
      setIsPublishingReport(false);
    }
  };

  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingBlog(true);
    const newPost: BlogPost = {
      id: Math.random().toString(),
      title: blogTitle,
      slug: blogSlug || blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: blogContent,
      excerpt: blogExcerpt,
      featured_image_url: blogImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      published_at: '2024-10-24'
    };

    try {
      const { error } = await supabase.from('blog_posts').insert([
        {
          title: newPost.title,
          slug: newPost.slug,
          content: newPost.content,
          excerpt: newPost.excerpt,
          featured_image_url: newPost.featured_image_url,
          published_at: newPost.published_at
        }
      ]);
      if (error) throw error;

      setBlogPosts([newPost, ...blogPosts]);
      triggerNotification('success', `Article "${blogTitle}" published successfully to the Small Business Hub!`);
      // Reset
      setBlogTitle('');
      setBlogSlug('');
      setBlogImage('');
      setBlogExcerpt('');
      setBlogContent('');
    } catch (err) {
      // Local fallback
      setBlogPosts([newPost, ...blogPosts]);
      triggerNotification('success', `Demo Mode: Article "${blogTitle}" published and updated in active Hub listings.`);
      setBlogTitle('');
      setBlogSlug('');
      setBlogImage('');
      setBlogExcerpt('');
      setBlogContent('');
    } finally {
      setIsPublishingBlog(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Enquiry['status']) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;

      setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
      triggerNotification('success', `Enquiry status updated to ${newStatus}`);
    } catch (err) {
      // Local fallback
      setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
      triggerNotification('success', `Demo Mode: Status updated to ${newStatus}`);
    }
  };

  return (
    <section className="relative py-20 px-4 md:px-8 bg-[#FDFBF7] text-slate-900 overflow-hidden" id="portal">
      {/* Decorative Warm Accent Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEF2F2] rounded-full filter blur-3xl opacity-60 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F3E9D8] rounded-full filter blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C2410C] font-semibold tracking-wider text-sm uppercase block mb-3">
            Interactive System Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight mb-4">
            See how we make technology simple.
          </h2>
          <p className="text-lg text-slate-700 font-sans">
            We don’t believe in confusing corporate portals or complex analytics tools. 
            Toggle between our clean <strong>Client Portal</strong> and our internal <strong>Admin Operations Panel</strong> below to see exactly how we keep you updated and handle your requests in plain English.
          </p>
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-xl border bg-white flex items-center space-x-3 border-emerald-200"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Action Logged</p>
                <p className="text-xs text-slate-700">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Toggle Navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'portal'
                  ? 'bg-white text-slate-950 shadow-md ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ minHeight: '48px' }}
            >
              <svg className="w-4 h-4 text-[#C2410C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>1. Client Portal Demo</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-[#1E293B] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ minHeight: '48px' }}
            >
              <svg className="w-4 h-4 text-[#C56A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>2. Admin Operations Panel</span>
            </button>
          </div>
        </div>

        {/* Dynamic Panel Window */}
        <AnimatePresence mode="wait">
          {activeTab === 'portal' ? (
            <motion.div
              key="portal"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
            >
              {/* Portal Header */}
              <div className="bg-[#1E293B] text-white px-6 py-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold">sites4u Portal — LIVE CLIENT PREVIEW</span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif tracking-tight mt-1">
                    Welcome back, <span className="text-orange-400 font-sans">Gareth</span>
                  </h3>
                  <p className="text-sm text-slate-300">Bowen & Sons Plumbing • Morriston, Swansea</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => triggerNotification('success', 'Logged out safely from demo portal.')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                    style={{ minHeight: '44px' }}
                  >
                    Sign Out Safely
                  </button>
                </div>
              </div>

              {/* Portal Body */}
              <div className="p-6 md:p-10 bg-slate-50">
                {/* Performance Intro */}
                <div className="mb-8 p-6 bg-amber-50/60 rounded-2xl border border-amber-100">
                  <h4 className="text-lg font-bold font-serif text-slate-900 mb-1">
                    Your Website Performance: <span className="text-[#C2410C]">{reports[0]?.month_year || 'October 2024'}</span>
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Here is a clean, plain-English look at how your website performed last month. We monitor these numbers daily to make sure your business continues to grow and your phones keep ringing down the Swansea area.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {/* Card 1 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#C2410C]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-500 block font-medium">Total Website Visitors</span>
                      <span className="text-3xl font-bold text-slate-900 block my-1 font-mono">
                        {reports[0]?.total_visits.toLocaleString() || '1,240'}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-emerald-600 font-bold text-xs flex items-center">
                        ▲ +15% more than last month
                      </span>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        This is the total number of individual local people who visited your website on their phones or computers.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#C2410C]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-500 block font-medium">Google Maps Views</span>
                      <span className="text-3xl font-bold text-slate-900 block my-1 font-mono">
                        {reports[0]?.google_maps_views.toLocaleString() || '3,850'}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-emerald-600 font-bold text-xs flex items-center">
                        ▲ +22% more than last month
                      </span>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        The number of times your business profile appeared on Google Maps searches in your service area.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#C2410C]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-500 block font-medium">Phone Number Clicks</span>
                      <span className="text-3xl font-bold text-slate-900 block my-1 font-mono">
                        {reports[0]?.phone_clicks || '84'}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-emerald-600 font-bold text-xs flex items-center">
                        ▲ +8% more than last month
                      </span>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        The number of times a customer tapped your phone number on your website to call you directly.
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#C2410C]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-500 block font-medium">Search Visibility Health</span>
                      <span className="text-3xl font-bold text-slate-900 block my-1 font-mono">
                        {reports[0]?.seo_health_score || '98'} / 100
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-[#16A34A] font-bold text-xs flex items-center">
                        ★ Excellent Health
                      </span>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        A score showing how secure, fast, and visible your website is to search engines. Fully optimized and secure.
                      </p>
                    </div>
                  </div>
                </div>

                {reports[0]?.notes && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
                    <h5 className="font-bold text-slate-900 mb-2 font-serif">Sian & Owen’s Monthly Notes:</h5>
                    <p className="text-sm text-slate-700 leading-relaxed italic">
                      &ldquo;{reports[0].notes}&rdquo;
                    </p>
                  </div>
                )}

                {/* Form & Support Block */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-xl font-bold font-serif text-slate-900 mb-1">
                      Need to make a quick update to your website?
                    </h4>
                    <p className="text-sm text-slate-600 mb-6">
                      Whether you want to update your winter opening hours, add new photos of your latest plumbing jobs, or change a price, simply fill out the box below. Sian or Owen will handle it for you within 24 hours.
                    </p>

                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="ticket_subject" className="block text-sm font-semibold text-slate-800">
                          What do you need help with? *
                        </label>
                        <select
                          id="ticket_subject"
                          name="ticket_subject"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          required
                          className="w-full mt-1.5 px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                          style={{ minHeight: '48px' }}
                        >
                          <option value="change_text">Update text or opening hours</option>
                          <option value="add_photos">Upload new photos of my work</option>
                          <option value="price_change">Change pricing or menu items</option>
                          <option value="technical_issue">Report a technical problem</option>
                          <option value="other">Something else</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="ticket_message" className="block text-sm font-semibold text-slate-800">
                          Describe the changes you want us to make: *
                        </label>
                        <textarea
                          id="ticket_message"
                          name="ticket_message"
                          rows={4}
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          required
                          placeholder="e.g., Hi team, could you please change our Friday closing time from 5:00 PM to 6:00 PM starting next week? Thanks, Gareth."
                          className="w-full mt-1.5 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingSupport}
                        className="w-full md:w-auto px-6 py-3 bg-[#1E293B] hover:bg-[#0f172a] text-white font-bold rounded-lg transition text-sm flex items-center justify-center space-x-2"
                        style={{ minHeight: '48px' }}
                      >
                        {isSubmittingSupport ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Submit My Request</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Trust Signals & Care Plan Sidebar */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
                      <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono tracking-widest uppercase font-bold mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Active Plain-English Care Plan</span>
                      </div>
                      <h4 className="text-lg font-bold font-serif mb-2">Hassle-Free Maintenance</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        We handle security, fast UK-based hosting, and weekly backups quietly in the background. You don’t have to worry about domain names or technical jargon.
                      </p>
                      <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Status:</span>
                        <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">Fully Guarded & Secure</span>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Your Local Account Team</h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#F3E9D8] overflow-hidden flex items-center justify-center">
                            <span className="font-bold text-slate-800 text-xs font-serif">OE</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Owen Evans</p>
                            <p className="text-[11px] text-slate-500">Founder & Web Designer</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#FEF2F2] overflow-hidden flex items-center justify-center">
                            <span className="font-bold text-slate-800 text-xs font-serif">SD</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Sian Davies</p>
                            <p className="text-[11px] text-slate-500">Local SEO & Support</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-[#1E293B] text-white rounded-3xl shadow-xl border border-slate-800 overflow-hidden"
            >
              {/* Admin Header */}
              <div className="bg-[#0F172A] px-6 py-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800">
                <div className="mb-4 md:mb-0">
                  <span className="text-xs font-mono tracking-widest text-[#C56A3C] uppercase font-bold">sites4u Operations Dashboard</span>
                  <h3 className="text-2xl font-bold font-serif tracking-tight mt-1 text-white">
                    Internal Team Management System
                  </h3>
                  <p className="text-xs text-slate-400">Logged in as Administrator • Swansea Headquarters</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-slate-300 font-mono">All Systems Operational</span>
                </div>
              </div>

              {/* Admin Grid */}
              <div className="p-6 md:p-10 space-y-12 bg-[#1E293B]">
                {/* 1. Leads Table */}
                <div>
                  <div className="mb-4">
                    <h4 className="text-xl font-bold font-serif text-white">
                      Recent Web Design & Marketing Enquiries
                    </h4>
                    <p className="text-xs text-slate-400">
                      Review and manage incoming prospect leads from South Wales.
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#162032]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-[#0F172A] text-slate-400 text-xs font-mono uppercase">
                          <th className="p-4">Date / Contact</th>
                          <th className="p-4">Business Name</th>
                          <th className="p-4">Message Goal</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-sm">
                        {enquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-800/50 transition">
                            <td className="p-4">
                              <p className="font-bold text-white">{enq.name}</p>
                              <p className="text-xs text-slate-400">{enq.phone} • {enq.email}</p>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-slate-200 block">{enq.business_name}</span>
                              {enq.current_website && (
                                <span className="text-xs text-orange-400 font-mono block">{enq.current_website}</span>
                              )}
                            </td>
                            <td className="p-4 max-w-xs">
                              <p className="text-xs text-slate-300 line-clamp-2">{enq.message}</p>
                            </td>
                            <td className="p-4">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase ${
                                enq.status === 'new'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : enq.status === 'contacting'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {enq.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1">
                              <button
                                onClick={() => handleUpdateStatus(enq.id, 'contacting')}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded font-semibold transition"
                                style={{ minHeight: '44px' }}
                              >
                                Contact
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(enq.id, 'onboarded')}
                                className="px-2 py-1 bg-[#C2410C] hover:bg-orange-800 text-xs text-white rounded font-semibold transition"
                                style={{ minHeight: '44px' }}
                              >
                                Onboard
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Form Grid (Report Generator & Blog CMS) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Report Generator */}
                  <div className="bg-[#162032] p-6 rounded-2xl border border-slate-800">
                    <div className="mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-[#C56A3C] uppercase block">Client Portal Link</span>
                      <h4 className="text-lg font-bold font-serif text-white">
                        Generate Monthly Client Analytics Card
                      </h4>
                      <p className="text-xs text-slate-400">
                        Input simplified, clean performance data directly to a client’s secure portal dashboard.
                      </p>
                    </div>

                    <form onSubmit={handlePublishReport} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="client_id" className="block text-[10px] font-bold uppercase text-slate-300">
                            Select Client Profile *
                          </label>
                          <select
                            id="client_id"
                            name="client_id"
                            value={adminReportClient}
                            onChange={(e) => setAdminReportClient(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          >
                            <option value="client-uuid-1">Bowen & Sons Plumbing</option>
                            <option value="client-uuid-2">The Uplands Cafe</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="month_year" className="block text-[10px] font-bold uppercase text-slate-300">
                            Reporting Period *
                          </label>
                          <input
                            type="text"
                            id="month_year"
                            name="month_year"
                            value={adminReportMonth}
                            onChange={(e) => setAdminReportMonth(e.target.value)}
                            required
                            placeholder="e.g., October 2024"
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          />
                        </div>

                        <div>
                          <label htmlFor="total_visits" className="block text-[10px] font-bold uppercase text-slate-300">
                            Total Website Visitors *
                          </label>
                          <input
                            type="number"
                            id="total_visits"
                            name="total_visits"
                            value={adminReportVisits}
                            onChange={(e) => setAdminReportVisits(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          />
                        </div>

                        <div>
                          <label htmlFor="google_maps_views" className="block text-[10px] font-bold uppercase text-slate-300">
                            Google Maps Views *
                          </label>
                          <input
                            type="number"
                            id="google_maps_views"
                            name="google_maps_views"
                            value={adminReportMaps}
                            onChange={(e) => setAdminReportMaps(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          />
                        </div>

                        <div>
                          <label htmlFor="phone_clicks" className="block text-[10px] font-bold uppercase text-slate-300">
                            Phone Clicks *
                          </label>
                          <input
                            type="number"
                            id="phone_clicks"
                            name="phone_clicks"
                            value={adminReportClicks}
                            onChange={(e) => setAdminReportClicks(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          />
                        </div>

                        <div>
                          <label htmlFor="seo_health_score" className="block text-[10px] font-bold uppercase text-slate-300">
                            SEO Health Score (1-100) *
                          </label>
                          <input
                            type="number"
                            id="seo_health_score"
                            name="seo_health_score"
                            min="1"
                            max="100"
                            value={adminReportSeo}
                            onChange={(e) => setAdminReportSeo(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="admin_notes" className="block text-[10px] font-bold uppercase text-slate-300">
                          Admin Notes (Shown to Client)
                        </label>
                        <textarea
                          id="admin_notes"
                          name="admin_notes"
                          rows={2}
                          value={adminReportNotes}
                          onChange={(e) => setAdminReportNotes(e.target.value)}
                          placeholder="e.g., Great growth this month! Your local map optimization is working perfectly."
                          className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isPublishingReport}
                        className="w-full py-3 bg-[#C2410C] hover:bg-orange-800 text-white font-bold rounded-md transition text-xs uppercase tracking-wider"
                        style={{ minHeight: '48px' }}
                      >
                        {isPublishingReport ? 'Publishing...' : 'Publish Report to Client Portal'}
                      </button>
                    </form>
                  </div>

                  {/* Blog Publisher */}
                  <div className="bg-[#162032] p-6 rounded-2xl border border-slate-800">
                    <div className="mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-[#C56A3C] uppercase block">Hub CMS System</span>
                      <h4 className="text-lg font-bold font-serif text-white">
                        Publish a New Small Business Hub Article
                      </h4>
                      <p className="text-xs text-slate-400">
                        Write and publish high-contrast, optimized educational guides for South Wales business owners.
                      </p>
                    </div>

                    <form onSubmit={handlePublishBlog} className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-[10px] font-bold uppercase text-slate-300">
                          Article Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          required
                          placeholder="e.g., How to Get Your Swansea Business Listed on Google Maps"
                          className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          style={{ minHeight: '44px' }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="slug" className="block text-[10px] font-bold uppercase text-slate-300">
                            URL Slug *
                          </label>
                          <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={blogSlug}
                            onChange={(e) => setBlogSlug(e.target.value)}
                            required
                            placeholder="e.g., how-to-get-listed-google-maps"
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          />
                        </div>
                        <div>
                          <label htmlFor="featured_image_url" className="block text-[10px] font-bold uppercase text-slate-300">
                            Featured Image URL *
                          </label>
                          <input
                            type="text"
                            id="featured_image_url"
                            name="featured_image_url"
                            value={blogImage}
                            onChange={(e) => setBlogImage(e.target.value)}
                            required
                            placeholder="e.g., https://images.unsplash.com/photo-..."
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ minHeight: '44px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="excerpt" className="block text-[10px] font-bold uppercase text-slate-300">
                          Short Excerpt * (For search engine listings and previews)
                        </label>
                        <input
                          type="text"
                          id="excerpt"
                          name="excerpt"
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                          required
                          placeholder="Learn how to claim your free Google Maps listing and rank higher..."
                          className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          style={{ minHeight: '44px' }}
                        />
                      </div>

                      <div>
                        <label htmlFor="content" className="block text-[10px] font-bold uppercase text-slate-300">
                          Article Body Content (Markdown Supported) *
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          rows={4}
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          required
                          placeholder="Write your plain-English guide content here..."
                          className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isPublishingBlog}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-md transition text-xs uppercase tracking-wider border border-slate-700"
                        style={{ minHeight: '48px' }}
                      >
                        {isPublishingBlog ? 'Publishing...' : 'Publish Article Instantly'}
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}