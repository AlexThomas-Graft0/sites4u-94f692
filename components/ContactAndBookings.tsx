'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Coffee, 
  Phone, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Send,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.12,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const days = [
  { name: 'Monday', short: 'Mon' },
  { name: 'Tuesday', short: 'Tue' },
  { name: 'Wednesday', short: 'Wed' },
  { name: 'Thursday', short: 'Thu' },
  { name: 'Friday', short: 'Fri' }
];

const morningSlots = ['09:00 AM', '10:30 AM', '11:15 AM'];
const afternoonSlots = ['02:00 PM', '03:30 PM', '04:15 PM'];

export function ContactAndBookings() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    current_website: '',
    message: ''
  });

  // Booking / Calendar State
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Auto-scroll or direct focus to the message area to confirm
    const messageElement = document.getElementById('message');
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // If they picked a calendar slot, we append that cleanly to the database message field
    let finalMessage = formData.message;
    if (selectedTime) {
      finalMessage = `[PREFERRED CONSULTATION SLOT: ${selectedDay} at ${selectedTime}]\n\n${formData.message}`;
    }

    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: formData.name,
            business_name: formData.business_name,
            email: formData.email,
            phone: formData.phone,
            current_website: formData.current_website || null,
            message: finalMessage,
            status: 'new'
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        business_name: '',
        email: '',
        phone: '',
        current_website: '',
        message: ''
      });
      setSelectedTime('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="relative bg-gradient-to-br from-[#FAF8F5] via-[#FDFBF7] to-[#F5EFE6] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-[#1E293B]"
    >
      {/* Decorative localized subtle elements */}
      <div className="absolute top-12 left-12 w-64 h-64 bg-[#C2410C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-[#F3E9D8]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <div className="inline-flex items-center gap-2 bg-[#F3E9D8] border border-[#C56A3C]/20 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#C2410C]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C2410C]">
              Get Started with sites4u
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1E293B] tracking-tight mb-6">
            Let's build something great for your business.
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed">
            No pressure, no confusing sales pitches. Just a friendly, plain-English chat over a cup of tea (or a quick phone call) to see how we can help your business grow.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Frictionless Enquiry Form */}
          <motion.div 
            className="lg:col-span-7 bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h3 className="text-2xl font-serif font-bold text-[#1E293B] flex items-center gap-2">
                <Coffee className="w-6 h-6 text-[#C2410C]" />
                Send an Enquiry
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Fill out the quick form below, and we will get back to you within one working day. All fields marked with an asterisk (*) are required.
              </p>
            </div>

            {submitSuccess ? (
              <motion.div 
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h4 className="text-2xl font-bold text-emerald-900 font-serif mb-2">Thank you, Gareth!</h4>
                <p className="text-emerald-700 max-w-md mx-auto mb-6">
                  We've received your inquiry. One of our friendly team members in Swansea will review your details and get back to you within one working day.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 bg-slate-800 text-white rounded-md font-semibold text-sm hover:bg-slate-900 transition"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Visual indicator of booked time slot within form */}
                {selectedTime && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FEF2F2] border border-[#C2410C]/20 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#C2410C]/10 rounded-md">
                        <Calendar className="w-5 h-5 text-[#C2410C]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Selected Consultation Time</p>
                        <p className="text-sm font-bold text-[#C2410C]">
                          {selectedDay} at {selectedTime} (UK Time)
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSelectedTime('')}
                      className="text-xs text-slate-500 hover:text-[#C2410C] underline font-medium"
                    >
                      Change slot
                    </button>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
                      Your Full Name *
                    </label>
                    <p className="text-xs text-slate-500 mb-1.5">So we know who we are speaking with.</p>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Gareth Bowen" 
                      className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-[#C2410C] transition duration-150 text-base"
                    />
                  </div>

                  {/* Business Name Input */}
                  <div>
                    <label htmlFor="business_name" className="block text-sm font-semibold text-slate-800">
                      Business Name *
                    </label>
                    <p className="text-xs text-slate-500 mb-1.5">The name of your shop, trade, or company.</p>
                    <input 
                      type="text" 
                      id="business_name" 
                      name="business_name" 
                      required 
                      value={formData.business_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Bowen & Sons Plumbing" 
                      className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-[#C2410C] transition duration-150 text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                      Email Address *
                    </label>
                    <p className="text-xs text-slate-500 mb-1.5">Where we should send your website review details.</p>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., gareth@bowenplumbing.co.uk" 
                      className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-[#C2410C] transition duration-150 text-base"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-800">
                      Phone Number *
                    </label>
                    <p className="text-xs text-slate-500 mb-1.5">To give you a quick, friendly ring.</p>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., 01792 000000" 
                      className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-[#C2410C] transition duration-150 text-base"
                    />
                  </div>
                </div>

                {/* Current Website Input */}
                <div>
                  <label htmlFor="current_website" className="block text-sm font-semibold text-slate-800">
                    Current Website (Optional)
                  </label>
                  <p className="text-xs text-slate-500 mb-1.5">If you already have one, enter the address here so we can review it.</p>
                  <input 
                    type="url" 
                    id="current_website" 
                    name="current_website" 
                    value={formData.current_website}
                    onChange={handleInputChange}
                    placeholder="e.g., www.myoldwebsite.co.uk" 
                    className="w-full h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-[#C2410C] transition duration-150 text-base"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
                    How can we help your business? *
                  </label>
                  <p className="text-xs text-slate-500 mb-1.5">
                    Tell us briefly what you want to achieve (e.g., "I want to get found on Google Maps" or "I need a mobile menu for my cafe").
                  </p>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us a little bit about your goals..." 
                    className="w-full p-4 rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-[#C2410C] transition duration-150 text-base min-h-[120px]"
                  />
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-700 text-sm p-4 rounded-md border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#C2410C] text-white font-bold rounded-md hover:bg-[#A13407] transition duration-150 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:ring-offset-2 flex items-center justify-center gap-2 text-lg shadow-lg shadow-[#C2410C]/20 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Your Details...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Enquiry & Book My Chat
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  By clicking above, you agree to our Swansea team contacting you within 24 hours. We will never sell or spam your data.
                </p>
              </form>
            )}
          </motion.div>

          {/* Column 2: Direct Consultation Calendar Booking */}
          <motion.div 
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider block mb-1">
                  Instant Scheduling
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1E293B]">
                  Prefer to book a call immediately?
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Skip the form and pick a time that works best around your operating hours. We will call you directly at your selected time for a friendly, 15-minute chat.
                </p>
              </div>

              {/* Day Selector Tabs */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select a Day (Mon - Fri)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {days.map((day) => {
                    const isSelected = selectedDay === day.name;
                    return (
                      <button
                        key={day.name}
                        type="button"
                        onClick={() => setSelectedDay(day.name)}
                        className={`py-3 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center border ${
                          isSelected 
                            ? 'bg-[#C2410C] text-white border-[#C2410C]' 
                            : 'bg-[#FAF8F5] text-slate-700 border-slate-200 hover:border-[#C2410C]/40 hover:bg-[#F3E9D8]/30'
                        }`}
                      >
                        <span className="opacity-70 font-normal">{day.short}</span>
                        <span className="text-sm mt-0.5">●</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Slots */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
                    2. Choose a Time Slot
                  </label>
                  
                  {/* Morning Section */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-slate-400 block mb-1.5">Morning Options</span>
                    <div className="grid grid-cols-3 gap-2">
                      {morningSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleTimeSelect(slot)}
                            className={`py-2.5 rounded-md text-xs font-semibold transition border ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-[#FAF8F5] hover:border-slate-400'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Afternoon Section */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1.5">Afternoon Options</span>
                    <div className="grid grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleTimeSelect(slot)}
                            className={`py-2.5 rounded-md text-xs font-semibold transition border ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-[#FAF8F5] hover:border-slate-400'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timezone & Trust Note */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
                  All times are in UK Local Time (GMT/BST).
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-full font-semibold text-[#1E293B]">
                  No credit card required
                </span>
              </div>
            </div>

            {/* Trust and Local Hero Callout Card */}
            <div className="bg-[#1E293B] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C2410C]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C2410C]/20 rounded-xl border border-[#C2410C]/30 text-[#C2410C]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-white mb-1">
                    Our 100% Free Guarantee
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    This is a 100% free, no-obligation consultation. We will take a look at your current online presence (if you have one) and share 3 actionable tips to improve your rankings and get more local customers.
                  </p>
                </div>
              </div>

              {/* Swansea Trust Footnote */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80" 
                  alt="Swansea Cafe Meeting" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C2410C]"
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">Gareth Bowen</p>
                  <p className="text-slate-400">Bowen & Sons Plumbing, Morriston</p>
                  <p className="text-[#C2410C] font-semibold mt-0.5">"+180% Increase in Local Enquiries"</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Bottom Trust Quote / Quick Info Banner */}
        <motion.div 
          className="mt-16 bg-[#F3E9D8]/50 border border-[#C56A3C]/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C2410C]/10 rounded-full flex items-center justify-center text-[#C2410C] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">Want to speak with a human right away?</h4>
              <p className="text-sm text-slate-600">Give our friendly Swansea office a call directly. No automated queues.</p>
            </div>
          </div>
          <a 
            href="tel:+441792000000" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition text-sm whitespace-nowrap focus:ring-2 focus:ring-[#C2410C] focus:ring-offset-2"
          >
            Call 01792 000000
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}