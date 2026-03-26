// PromoBanner.jsx – Grocery 3-column promo banners
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const promos = [
  {
    id: 'promo-veggies',
    label: '🌳 Farm Fresh',
    title: 'Organic\nVegetables',
    offer: 'GET 30% OFF',
    sub: 'Direct from Soil',
    bg: 'bg-accent',
    img: 'https://images.unsplash.com/photo-1540333673334-936b23b860ad?q=80&w=800&auto=format&fit=crop',
    textColor: 'text-white',
    accentColor: '#629432',
    darkOverlay: true,
  },
  {
    id: 'promo-dairy',
    label: '🥛 Milky Way',
    title: 'Pure Dairy\n& Eggs',
    offer: 'FRESH DAILY',
    sub: 'Morning Harvest',
    bg: 'bg-primary',
    img: 'https://images.unsplash.com/photo-1528498033053-35608b21ca07?q=80&w=800&auto=format&fit=crop',
    textColor: 'text-white',
    accentColor: '#1A2215',
    darkOverlay: true,
  },
  {
    id: 'promo-fruits',
    label: '🍎 Sweet Bite',
    title: 'Seasonal\nFruits',
    offer: 'UP TO 20% OFF',
    sub: 'Naturally Sweet',
    bg: 'bg-ripe',
    img: 'https://images.unsplash.com/photo-1610832958506-aa5633840691?q=80&w=800&auto=format&fit=crop',
    textColor: 'text-white',
    accentColor: '#FF6F61',
    darkOverlay: true,
  },
];

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[1320px] mx-auto px-6 md:px-10 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map((p, i) => (
          <motion.div
            key={p.id}
            id={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[40px] cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500"
            style={{ minHeight: 340 }}
            onClick={() => navigate('/products')}
          >
            {/* BG Image */}
            <img
              src={p.img}
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div>
                <span
                  className="inline-flex items-center gap-2 text-[11px] font-heading font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full backdrop-blur-md bg-white/20 text-white shadow-xl"
                >
                  <Sparkles size={12} fill="currentColor" />
                  {p.label}
                </span>
              </div>

              <div>
                <p className="text-white/80 text-[12px] font-bold uppercase tracking-[0.2em] mb-2">{p.sub}</p>
                <h3
                  className="font-heading font-black text-white uppercase leading-none mb-4 whitespace-pre-line"
                  style={{ fontSize: 'clamp(32px, 3.5vw, 48px)' }}
                >
                  {p.title}
                </h3>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <span
                    className="font-heading font-black text-[14px] uppercase tracking-wider text-accent drop-shadow-md"
                  >
                    {p.offer}
                  </span>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-primary group-hover:bg-accent group-hover:text-white group-hover:scale-110 transition-all shadow-xl group-hover:rotate-12">
                    <ArrowRight size={20} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;

