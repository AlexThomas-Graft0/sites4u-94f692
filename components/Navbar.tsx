'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Our Services', href: '#services' },
  { label: 'Local Success', href: '#work' },
  { label: 'About Us', href: '#about' },
  { label: 'Business Hub', href: '#hub' },
  { label: 'Client Portal', href: '#portal' },
];

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: -10, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full select-none">
      {/* Top Local Trust Bar */}
      <div className="bg-[#1E293B] text-white text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-slate-800">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Proudly supporting Swansea &amp; South Wales independent businesses 🏴󠁧󠁢󠁷󠁬󠁳󠁿
        </span>
      </div>

      {/* Main Navigation Container */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#F8FAFC]/95 backdrop-blur-md shadow-md py-3 border-slate-200'
            : 'bg-[#F8FAFC] py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a
              href="#hero"
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 rounded-lg p-1"
              aria-label="sites4u Home"
            >
              <span className="text-2xl font-black tracking-tight text-[#1E293B] flex items-center gap-1">
                sites<span className="text-[#C2410C]">4</span>u
              </span>
              <div className="hidden sm:block border-l border-slate-300 pl-2.5 ml-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">Swansea</p>
                <p className="text-[9px] text-[#C2410C] font-semibold leading-none mt-0.5">Plain-English Web</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-semibold text-[#1E293B] hover:text-[#C2410C] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-600 rounded px-1 py-0.5"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#C2410C] text-white text-sm font-bold rounded-lg hover:bg-[#A33207] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 shadow-sm"
              >
                Book a Free Chat
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-[#1E293B] hover:bg-slate-100 hover:text-[#C2410C] focus:outline-none focus:ring-2 focus:ring-orange-600 min-w-[44px] min-h-[44px]"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden bg-[#F8FAFC] border-t border-slate-200"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {navItems.map((item) => (
                  <motion.div key={item.label} variants={itemVariants}>
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="block px-3 py-3 rounded-lg text-base font-semibold text-[#1E293B] hover:bg-slate-100 hover:text-[#C2410C] transition-all min-h-[44px] flex items-center"
                    >
                      {item.label}
                    </a>
                  </motion.div>
                ))}
                <motion.div variants={itemVariants} className="pt-4 border-t border-slate-200">
                  <a
                    href="#contact"
                    onClick={closeMenu}
                    className="block w-full text-center px-4 py-3 bg-[#C2410C] text-white font-bold rounded-lg hover:bg-[#A33207] active:scale-[0.98] transition-all shadow-md text-base min-h-[48px]"
                  >
                    Book a Free Chat
                  </a>
                </motion.div>
                <motion.div variants={itemVariants} className="text-center pt-3">
                  <span className="text-xs text-slate-500">
                    ★ Rated 5/5 by local Swansea business owners
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}