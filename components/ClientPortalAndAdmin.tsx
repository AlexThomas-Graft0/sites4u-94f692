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

export function ClientPortalAndAdmin() {
  const [activeTab, setActiveTab] = useState<'portal' | 'admin'>('portal');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      notes: 'Excellent growth this month!',
      created_at: '2024-10-24'
    }
  ]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 'blog-1',
      title: 'How to Get Your Swansea Business Listed on Google Maps',
      slug: 'how-to-get-listed-google-maps',
      content: 'Step-by-step guide...',
      excerpt: 'Learn how to claim your free Google Maps listing.',
      featured_image_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  const [ticketSubject, setTicketSubject] = useState('change_text');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  const [adminReportMonth, setAdminReportMonth] = useState('October 2024');
  const [adminReportVisits, setAdminReportVisits] = useState('1240');
  const [adminReportMaps, setAdminReportMaps] = useState('3850');
  const [adminReportClicks, setAdminReportClicks] = useState('84');
  const [adminReportSeo, setAdminReportSeo] = useState('98');
  const [adminReportNotes, setAdminReportNotes] = useState('');
  const [isPublishingReport, setIsPublishingReport] = useState(false);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isPublishingBlog, setIsPublishingBlog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: fetchedEnquiries } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (fetchedEnquiries) setEnquiries(fetchedEnquiries as Enquiry[]);

        const { data: fetchedReports } = await supabase.from('analytics_reports').select('*').order('created_at', { ascending: false });
        if (fetchedReports) setReports(fetchedReports as AnalyticsReport[]);
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

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSupport(true);
    triggerNotification('success', 'Demo Mode: Your update request has been logged.');
    setTicketMessage('');
    setIsSubmittingSupport(false);
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
      created_at: new Date().toISOString()
    };
    setReports([newReport, ...reports]);
    triggerNotification('success', `Analytics report generated for ${adminReportMonth}.`);
    setIsPublishingReport(false);
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
      published_at: new Date().toISOString()
    };
    setBlogPosts([newPost, ...blogPosts]);
    triggerNotification('success', 'Article published successfully.');
    setIsPublishingBlog(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: Enquiry['status']) => {
    setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
    triggerNotification('success', `Status updated to ${newStatus}`);
  };

  return (
    <section className="relative py-20 px-4 md:px-8 bg-[#FDFBF7] text-slate-900" id="portal">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button onClick={() => setActiveTab('portal')} className={`px-6 py-3 rounded-xl text-sm font-semibold ${activeTab === 'portal' ? 'bg-white shadow-md' : ''}`}>Client Portal</button>
            <button onClick={() => setActiveTab('admin')} className={`px-6 py-3 rounded-xl text-sm font-semibold ${activeTab === 'admin' ? 'bg-[#1E293B] text-white' : ''}`}>Admin Panel</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'portal' ? (
            <motion.div key="portal" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
               <h3 className="text-2xl font-bold font-serif mb-4">Welcome back, Gareth</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200">
                   <span className="text-sm text-slate-500">Total Visitors</span>
                   <p className="text-3xl font-bold font-mono">{reports[0]?.total_visits.toLocaleString()}</p>
                 </div>
               </div>
               <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <select value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} className="w-full p-3 border rounded-lg">
                    <option value="change_text">Update content</option>
                  </select>
                  <textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} className="w-full p-3 border rounded-lg" rows={4} placeholder="Describe changes..." />
                  <button type="submit" className="px-6 py-3 bg-[#1E293B] text-white rounded-lg">Submit Request</button>
               </form>
            </motion.div>
          ) : (
            <motion.div key="admin" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-[#1E293B] text-white rounded-3xl p-10">
              <h3 className="text-2xl font-bold font-serif mb-8">Admin Operations Panel</h3>
              <div className="overflow-x-auto border border-slate-700 rounded-xl bg-[#162032]">
                <table className="w-full text-left">
                  <thead className="bg-[#0F172A] uppercase text-xs font-mono text-slate-400">
                    <tr><th className="p-4">Contact</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="border-t border-slate-800">
                        <td className="p-4">{enq.name}</td>
                        <td className="p-4">{enq.status}</td>
                        <td className="p-4"><button onClick={() => handleUpdateStatus(enq.id, 'onboarded')} className="bg-[#C2410C] px-3 py-1 rounded">Onboard</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}