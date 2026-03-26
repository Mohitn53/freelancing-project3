// Footer.jsx – Grocery E-Commerce themed
import React from 'react';
import { ArrowRight, Leaf, MapPin, Phone, Mail, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-32 rounded-t-[60px] relative overflow-hidden">
      {/* Decorative Leaf Overlay */}
      <Leaf className="absolute -top-10 -right-10 w-64 h-64 text-accent/5 -rotate-12 pointer-events-none" />
      <Leaf className="absolute -bottom-10 -left-10 w-48 h-48 text-accent/5 rotate-45 pointer-events-none" />

      {/* ── Newsletter Strip ── */}
      <div className="border-b border-white/5 relative z-10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-md text-center lg:text-left">
            <span className="inline-block bg-accent/20 text-accent font-heading font-black text-[12px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Join our Green Community</span>
            <h3 className="font-heading font-black text-3xl md:text-4xl uppercase leading-tight">
              Get Fresh <span className="text-accent">Updates</span> & Offers
            </h3>
          </div>
          <div className="flex w-full md:w-auto max-w-xl bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
            <input
              type="email"
              id="footer-email"
              placeholder="Your email for fresh deals..."
              className="flex-1 bg-transparent text-white placeholder:text-white/30 px-6 py-3 outline-none text-[15px] font-sans"
            />
            <button
              id="footer-subscribe-btn"
              className="bg-accent hover:bg-accent-dark px-8 py-3 rounded-full font-heading font-black text-[14px] uppercase tracking-wide text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-accent/20"
            >
              Subscribe
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">

        {/* Brand */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-11 h-11 bg-accent rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-6">
              <Leaf size={22} fill="white" color="white" strokeWidth={2} />
            </div>
            <span className="font-heading font-black text-2xl tracking-tight leading-none group-hover:text-accent transition-colors">
              Eko<span className="text-accent">mart</span>
            </span>
          </Link>
          <p className="text-stone text-[15px] leading-relaxed font-medium opacity-80">
            Hand-picked freshness, delivered with care. Sourcing the finest organic groceries from local farms to your doorstep.
          </p>
          <div className="flex flex-col gap-4 text-[14px] text-stone font-medium">
            <a href="tel:+918001234567" className="flex items-center gap-3 hover:text-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Phone size={14} className="text-accent" /></div>
              +91 800 123 4567
            </a>
            <a href="mailto:fresh@ekomart.in" className="flex items-center gap-3 hover:text-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Mail size={14} className="text-accent" /></div>
              fresh@ekomart.in
            </a>
            <span className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><MapPin size={14} className="text-accent" /></div>
              Green Valley Hub, Mumbai
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="lg:pl-8">
          <h4 className="font-heading font-black text-[16px] uppercase tracking-widest text-white mb-8 border-b border-accent/30 pb-2 w-fit">Farm Fresh</h4>
          <ul className="flex flex-col gap-4">
            {['Organic Vegetables', 'Seasonal Fruits', 'Dairy & Eggs', 'Artisanal Bakery', 'Fresh Meat', 'Whole Grains'].map(item => (
              <li key={item}>
                <Link
                  to="/products"
                  className="text-stone font-medium text-[15px] hover:text-accent transition-colors flex items-center gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="lg:pl-8">
          <h4 className="font-heading font-black text-[16px] uppercase tracking-widest text-white mb-8 border-b border-accent/30 pb-2 w-fit">The Market</h4>
          <ul className="flex flex-col gap-4">
            {[
              { label: 'Shop All', to: '/products' },
              { label: 'Our Story', to: '/about-contact' },
              { label: 'Farm Locations', to: '/about-contact' },
              { label: 'Freshness Guarantee', to: '/about-contact' },
              { label: 'My Basket', to: '/cart' },
              { label: 'Shipping Info', to: '/about-contact' },
            ].map(link => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-stone font-medium text-[15px] hover:text-accent transition-colors flex items-center gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Badge */}
        <div>
          <h4 className="font-heading font-black text-[16px] uppercase tracking-widest text-white mb-8 border-b border-accent/30 pb-2 w-fit">Join Us</h4>
          <p className="text-stone text-[14px] leading-relaxed mb-6 font-medium">
            Follow our journey from seeds to harvest. Get daily farm updates!
          </p>
          <div className="flex gap-4 mb-8">
            {[
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Youtube, label: 'YouTube' },
              { Icon: Twitter, label: 'Twitter/X' },
              { Icon: Facebook, label: 'Facebook' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all group scale-100 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              >
                <Icon size={19} strokeWidth={2} />
              </a>
            ))}
          </div>

          {/* Promo Tag */}
          <div className="p-6 rounded-3xl border border-accent/20 bg-accent/5 overflow-hidden relative group">
            <div className="relative z-10">
              <p className="font-heading font-black text-accent text-[13px] uppercase tracking-wider mb-1">Weekly Harvest</p>
              <p className="text-white text-[15px] font-bold">Get 20% off with <span className="text-ripe">FRESH20</span></p>
            </div>
            <Leaf className="absolute -bottom-6 -right-6 w-20 h-20 text-accent/10 rotate-12 group-hover:scale-125 transition-transform duration-700" />
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/5 py-8 relative z-10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-stone text-[13px] font-bold opacity-60">
            © 2026 Ekomart Grocery. From Nature with Love. Crafted by Antigravity AI.
          </p>
          <div className="flex items-center gap-8 text-[13px] text-stone font-bold opacity-60">
            <Link to="/about-contact" className="hover:text-accent transition-colors">Privacy Privacy</Link>
            <Link to="/about-contact" className="hover:text-accent transition-colors">Terms of Freshness</Link>
            <Link to="/about-contact" className="hover:text-accent transition-colors">Cookie Seeds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

