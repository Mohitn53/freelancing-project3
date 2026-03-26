// src/pages/SignupPage.jsx – Ekomart Identity Registry
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Leaf, ShieldCheck, Sprout, Heart } from 'lucide-react';
import { authApi } from '../services/api';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.signup({ name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registry failed. Please verify input data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary font-heading">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1920&q=80" 
          alt="Lush green garden" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent" />
      </div>

      {/* ── Floating Organic Icons ── */}
      <motion.div 
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-24 text-accent/10 hidden lg:block"
      >
        <Heart size={140} strokeWidth={1} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-24 text-accent/10 hidden lg:block"
      >
        <Leaf size={160} strokeWidth={1} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg mx-5 my-20"
      >
        <div className="bg-white rounded-[60px] p-10 md:p-16 shadow-2xl border-t-8 border-accent relative overflow-hidden">
           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
           
          {/* Logo Badge */}
          <div className="flex justify-center mb-12">
            <div className="w-20 h-20 bg-accent rounded-[32px] -rotate-12 flex items-center justify-center shadow-2xl shadow-accent/30 group cursor-pointer hover:rotate-0 transition-transform duration-500">
              <Sprout className="text-white rotate-12 group-hover:rotate-0 transition-transform duration-500" size={40} strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-heading font-black text-5xl text-primary uppercase tracking-tighter mb-3">
              JOIN THE <span className="text-accent">COLLECTIVE</span>
            </h1>
            <p className="text-stone/40 text-[11px] font-heading font-black uppercase tracking-[0.3em]">Seed your organic future</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/40 pl-2">Harvest Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  required
                  type="text"
                  placeholder="FULL NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-accent/30 rounded-3xl py-5 pl-16 pr-6 text-primary font-heading font-black text-sm uppercase outline-none transition-all shadow-inner placeholder:text-stone/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/40 pl-2">Harvest ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  required
                  type="email"
                  placeholder="ID@HUB.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-accent/30 rounded-3xl py-5 pl-16 pr-6 text-primary font-heading font-black text-sm uppercase outline-none transition-all shadow-inner placeholder:text-stone/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/40 pl-2">Vault Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-accent/30 rounded-3xl py-5 pl-16 pr-16 text-primary font-heading font-black text-sm outline-none transition-all shadow-inner placeholder:text-stone/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-stone/20 hover:text-accent transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-berry text-xs font-heading font-black uppercase bg-berry/5 p-5 rounded-2xl border-2 border-berry/10 tracking-widest shadow-inner"
                >
                  <ShieldCheck size={20} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl hover:scale-105 active:scale-95 group"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Initialize Identity <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-14 text-center">
            <span className="text-stone/30 text-[11px] font-heading font-black uppercase tracking-widest">Part of the collective? </span>
            <Link to="/login" className="text-accent font-heading font-black uppercase tracking-[0.2em] text-[11px] hover:text-primary transition-colors border-b-2 border-accent/20 hover:border-primary">Rejoin Node</Link>
          </div>
        </div>
        
        {/* Footer trust badge */}
        <div className="mt-10 flex items-center justify-center gap-3 text-white/30 text-[10px] uppercase font-heading font-black tracking-[0.4em]">
          <ShieldCheck size={14} className="text-accent" /> SECURED NEURAL ENCRYPTION
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;

