// AboutContactPage.jsx – Ekomart Grocery Remastered
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, MapPin, Phone, Instagram, Youtube, Twitter,
  Send, Check, Leaf, Truck, ShieldCheck, Star, ArrowRight,
  Sprout, Apple, Heart, Search, ShoppingBasket
} from 'lucide-react';

const VALUES = [
  {
    icon: Leaf,
    num: '01',
    title: 'Farm to Fork',
    desc: 'We eliminate middlemen. Every harvest reaches your kitchen within 24 hours of being picked, ensuring maximum nutrient density.',
  },
  {
    icon: ShieldCheck,
    num: '02',
    title: 'Certified Organic',
    desc: 'No synthetic pesticides, no GMOs. We strictly partner with farms following regenerative agricultural practices.',
  },
  {
    icon: Truck,
    num: '03',
    title: 'Climate Positive',
    desc: 'Our delivery fleet is 100% electric, and our packaging is fully compostable. Sustainable shopping, delivered.',
  },
];

const STATS = [
  { value: '120+', label: 'Local Farms' },
  { value: '5000+', label: 'Organic SKUs' },
  { value: '4.9★', label: 'Freshness Rating' },
  { value: '2 Hours', label: 'Express Option' },
];

const TEAM = [
  { name: 'Arjun Sharma', role: 'Head of Sourcing', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Priya Nair', role: 'Sustainability Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
  { name: 'Rahul Mehta', role: 'Chief Curator', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
];

const AboutContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#FCFDFB]">

      {/* ── Hero Banner ── */}
      <div className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-primary">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80"
          alt="Ekomart Fresh Market"
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 hover:scale-100 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 py-32 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-block bg-accent px-6 py-2 rounded-full text-white text-[10px] font-heading font-black uppercase tracking-[0.3em] mb-8 shadow-xl">Our Narrative</span>
            <h1
              className="font-heading font-black text-white uppercase leading-[0.9] mb-8 tracking-tighter"
              style={{ fontSize: 'clamp(56px, 10vw, 130px)' }}
            >
              NURTURING<br />
              <span className="text-accent underline decoration-accent-light/30">NATURE.</span>
            </h1>
            <p className="text-white/70 text-xl max-w-2xl leading-relaxed font-bold">
              Ekomart isn't just a store; it's a movement towards pure, conscious consumption. We connect local ethical farmers directly to your sophisticated palate.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="relative z-20 -mt-16 max-w-[1200px] mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 border-b-8 border-accent">
          {STATS.map(({ value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i*0.1 }} className="flex flex-col items-center justify-center text-center">
              <p className="font-heading font-black text-primary text-[32px] md:text-[42px] leading-none mb-2">{value}</p>
              <p className="text-stone/40 text-[10px] font-heading font-black uppercase tracking-widest">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Story Section ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading font-black text-primary uppercase leading-none mb-8 tracking-tighter" style={{ fontSize: 'clamp(42px, 6vw, 78px)' }}>
              ROOTED IN<br /><span className="text-accent">INTEGRITY</span><br />SINCE DAY ONE.
            </h2>
            <div className="flex flex-col gap-6 text-stone/70 text-[17px] leading-relaxed font-bold">
              <p>
                Founded in the heart of lush farmlands, Ekomart began as a small collective of five organic farmers who wanted to challenge the industrial food complex. We believed that grocery shopping shouldn't involve decoding chemical labels.
              </p>
              <p>
                Today, our network has expanded to 120+ certified organic farms. We use state-of-the-art logistics to ensure that the moisture and nutrients of the soil are preserved until the moment you take your first bite.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/products'}
              className="mt-12 inline-flex items-center gap-4 bg-primary text-white font-heading font-black text-[12px] uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-accent transition-all shadow-2xl hover:scale-105"
            >
              Explore Fresh Harvest <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="absolute inset-0 bg-accent translate-x-6 translate-y-6 rounded-[80px] -z-10 opacity-10" />
            <img
              src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1000&q=80"
              alt="Organic Harvest"
              className="w-full rounded-[80px] object-cover aspect-[4/5] shadow-2xl"
            />
            
            <div className="absolute -bottom-10 -left-10 bg-white rounded-[40px] p-8 shadow-2xl flex items-center gap-5 border-t-8 border-accent">
              <div className="w-16 h-16 bg-accent-light/10 rounded-2xl flex items-center justify-center shrink-0">
                <Sprout size={32} className="text-accent" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-heading font-black text-primary text-[18px] uppercase leading-none">Purity First</p>
                <p className="text-stone/40 text-[11px] font-heading font-black uppercase tracking-widest mt-1">Zero Pesticide Policy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="bg-stone-50 py-32 rounded-[100px] mx-6">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="text-center mb-20">
            <h2 className="font-heading font-black text-primary uppercase leading-none tracking-tighter" style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}>
              CORE <span className="text-accent">ESSENCE.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-[60px] p-12 shadow-xl hover:-translate-y-4 transition-all duration-500 border-2 border-transparent hover:border-accent/10"
              >
                <div className="w-20 h-20 rounded-[28px] bg-accent-light/5 flex items-center justify-center mb-8 border border-accent/10 group-hover:bg-accent transition-colors">
                  <v.icon size={36} className="text-accent group-hover:text-white" strokeWidth={2.5} />
                </div>
                <div className="font-heading font-black text-accent text-[12px] uppercase tracking-[0.3em] mb-4">{v.num} — PROTOCOL</div>
                <h3 className="font-heading font-black text-primary text-[24px] uppercase leading-tight mb-5">{v.title}</h3>
                <p className="text-stone/60 text-[15px] leading-relaxed font-bold">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact Section ── */}
      <div className="bg-primary py-32 mt-32 rounded-t-[100px]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

            {/* Left: Info */}
            <div className="sticky top-10">
              <h2
                className="font-heading font-black text-white uppercase leading-none mb-8 tracking-tighter"
                style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
              >
                GROW <span className="text-accent">WITH US.</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed font-bold mb-16 max-w-md">
                Whether you're a conscious customer, a local farmer, or a potential retail partner — our harvest specialists are ready to greet you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  { icon: Phone, label: 'Concierge', value: '+91 800 123 4567', href: 'tel:+918001234567' },
                  { icon: Mail, label: 'Inquiries', value: 'hello@ekomart.in', href: 'mailto:hello@ekomart.in' },
                  { icon: MapPin, label: 'Flagship Hub', value: 'Mumbai, MH', href: null },
                  { icon: Instagram, label: 'Connect', value: '@ekomart.fresh', href: 'https://instagram.com' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mb-4 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                      <Icon size={24} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-white/20 text-[10px] font-heading font-black uppercase tracking-widest mb-1">{label}</p>
                      {href ? (
                        <a href={href} target="_blank" rel="noreferrer" className="text-white font-heading font-black text-[16px] uppercase hover:text-accent transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-white font-heading font-black text-[16px] uppercase">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-[60px] p-12 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 gap-6 text-center"
                >
                  <div className="w-24 h-24 rounded-[32px] bg-accent flex items-center justify-center shadow-2xl">
                    <Check size={40} color="#fff" strokeWidth={4} />
                  </div>
                  <h3 className="font-heading font-black text-primary text-[32px] uppercase">Message Rooted</h3>
                  <p className="text-stone/40 text-[14px] font-heading font-black uppercase tracking-widest max-w-[250px]">Our farm advocates will reach out via neural link soon.</p>
                  <button
                    id="send-another-btn"
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-6 text-xs text-accent font-heading font-black uppercase tracking-[0.3em] hover:text-primary transition-all cursor-pointer underline underline-offset-8"
                  >
                    Resubmit Thread
                  </button>
                </motion.div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
                  <div className="mb-4">
                    <h3 className="font-heading font-black text-primary text-[32px] uppercase leading-tight tracking-tighter">ESTABLISH<br />COMMUNICATION.</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone/40 pl-2">Full Name</label>
                      <input
                        id="contact-name"
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="NAME HERE"
                        className="bg-stone-50 border-2 border-transparent focus:border-accent/20 rounded-2xl px-8 py-5 text-[14px] font-heading font-black uppercase outline-none transition-all shadow-inner placeholder:text-stone/20"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone/40 pl-2">Email Node</label>
                      <input
                        id="contact-email"
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="ADR@SERVER.COM"
                        className="bg-stone-50 border-2 border-transparent focus:border-accent/20 rounded-2xl px-8 py-5 text-[14px] font-heading font-black uppercase outline-none transition-all shadow-inner placeholder:text-stone/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone/40 pl-2">Service Route</label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="bg-stone-50 border-2 border-transparent focus:border-accent/20 rounded-2xl px-8 py-5 text-[14px] font-heading font-black uppercase outline-none transition-all shadow-inner cursor-pointer appearance-none"
                    >
                      <option value="">SELECT ROUTE...</option>
                      <option value="order">FRESHNESS QUERY</option>
                      <option value="return">HARVEST LOGISTICS</option>
                      <option value="gear">DIETARY GUIDANCE</option>
                      <option value="partner">FARM PARTNERSHIP</option>
                      <option value="other">GENERAL INQUIRY</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone/40 pl-2">Message Kernel</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="YOUR QUERY HERE..."
                      className="bg-stone-50 border-2 border-transparent focus:border-accent/20 rounded-[32px] px-8 py-6 text-[14px] font-heading font-black uppercase outline-none transition-all shadow-inner resize-none placeholder:text-stone/20"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-4 bg-primary text-white font-heading font-black text-[14px] uppercase tracking-[0.3em] py-6 rounded-full transition-all hover:bg-accent hover:shadow-2xl shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-60"
                  >
                    {loading ? 'TRANSMITTING...' : <><Send size={20} strokeWidth={3} /> BROADCAST MESSAGE</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default AboutContactPage;

