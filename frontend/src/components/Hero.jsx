// Hero.jsx – Grocery E-Commerce Hero
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, ChevronRight, Apple, Heart, CheckCircle } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Apple, label: '10K+', sub: 'Daily Freshness' },
    { icon: CheckCircle, label: '100%', sub: 'Pure & Organic' },
    { icon: Heart, label: '4.9★', sub: 'Trust & Quality' },
  ];

  return (
    <section className="w-full min-h-[90vh] relative flex items-center overflow-hidden bg-accent-light">
      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          src="/assets/hero_banner.png"
          alt="Fresh organic groceries"
          className="w-full h-full object-cover object-center"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
      </div>

      {/* ── Floating Leaves Animation ── */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-32 h-32 text-accent/10 pointer-events-none"
      >
        <Leaf size={120} fill="currentColor" />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-12 py-20">
        <div className="max-w-[750px]">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="flex items-center gap-2 bg-accent text-white font-heading font-extrabold text-[12px] uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
              <Leaf size={14} className="fill-white" />
              100% Organic Farms
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black text-primary leading-[0.95] tracking-tight mb-6"
            style={{ fontSize: 'clamp(56px, 9vw, 110px)' }}
          >
            FRESH.<br />
            <span className="text-accent underline decoration-accent-light underline-offset-8">ORGANIC.</span><br />
            DELIVERED.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="text-primary/70 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-[550px]"
          >
            Experience the taste of heaven with our hand-picked, organic groceries sourced directly from local farms. Farm to your fork in just 24 hours.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-wrap gap-5 mb-16"
          >
            <button
              id="hero-shop-btn"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-heading font-extrabold text-[16px] px-10 py-4 rounded-full transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Order Fresh Today
              <ChevronRight size={20} strokeWidth={3} />
            </button>
            <button
              id="hero-deals-btn"
              onClick={() => navigate('/products?sort=created_at')}
              className="inline-flex items-center gap-2 bg-accent-light border-2 border-accent text-accent font-heading font-extrabold text-[16px] px-10 py-4 rounded-full transition-all hover:bg-accent hover:text-white"
            >
              Weekly Harvest
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex items-center gap-10 flex-wrap"
          >
            {stats.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-md border border-accent-light group hover:rotate-6 transition-transform">
                  <Icon size={20} className="text-accent" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-heading font-black text-primary text-[20px] leading-none">{label}</p>
                  <p className="text-stone text-[12px] font-bold mt-1 uppercase tracking-wider">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Spinning Circular Badge ── */}
      <motion.div
        className="absolute bottom-16 right-16 z-20 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="w-[160px] h-[160px] rounded-full flex items-center justify-center relative bg-accent shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 group-hover:scale-150 transition-transform duration-700" />
          <div className="z-10 text-center">
            <span className="font-heading font-black text-white text-[15px] uppercase tracking-widest leading-none">EKO<br /><span className="text-[12px] opacity-80 font-bold">MART</span></span>
          </div>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]">
            <defs>
              <path id="badgePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text fontSize="6" fontWeight="900" letterSpacing="4.5px" fill="#fff" opacity="0.9">
              <textPath href="#badgePath">EKOMART • FRESH & ORGANIC • 100% FARM • </textPath>
            </text>
          </svg>
        </div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-12 z-20 hidden md:flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-accent/30 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-lg shadow-accent/50" />
        </motion.div>
        <span className="text-accent/60 text-[11px] font-heading font-black uppercase tracking-[0.3em] vertical-text">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;

