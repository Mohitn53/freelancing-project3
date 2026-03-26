// src/pages/LoginPage.jsx – Ekomart Premium Hub
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Leaf, ShieldCheck, Sprout, ShoppingBasket } from 'lucide-react';
import { authApi } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const json = await authApi.login({ email, password });
      handleLogin(json.data.accessToken, json.data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Validation failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary font-heading">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80" 
          alt="Fresh organic produce" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-transparent" />
      </div>

      {/* ── Floating Organic Icons ── */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-24 text-accent/10 hidden lg:block"
      >
        <Leaf size={160} strokeWidth={1} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 right-24 text-accent/10 hidden lg:block"
      >
        <Sprout size={180} strokeWidth={1} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative z-10 w-full max-w-lg mx-5"
      >
        <div className="bg-white rounded-[60px] p-10 md:p-16 shadow-2xl border-b-8 border-accent relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
           
          {/* Logo Badge */}
          <div className="flex justify-center mb-12">
            <div className="w-20 h-20 bg-accent rounded-[32px] flex items-center justify-center shadow-2xl shadow-accent/40 rotate-12 hover:rotate-0 transition-transform duration-500 group cursor-pointer">
              <ShoppingBasket className="text-white -rotate-12 group-hover:rotate-0 transition-transform duration-500" size={36} strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-heading font-black text-5xl text-primary uppercase tracking-tighter mb-3">
              REJOIN THE <span className="text-accent">HARVEST</span>
            </h1>
            <p className="text-stone/40 text-xs font-heading font-black uppercase tracking-[0.3em]">Secure Ekomart Authentication</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-heading font-black uppercase tracking-[0.2em] text-primary/40 pl-2">Harvest ID (Email)</label>
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
              <div className="flex items-center justify-between px-2">
                <label className="text-[11px] font-heading font-black uppercase tracking-[0.2em] text-primary/40">Vault Key</label>
                <a href="#" className="text-[10px] font-black text-stone/30 hover:text-berry uppercase tracking-[0.2em] transition-colors">Forgot Key?</a>
              </div>
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
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 text-berry text-xs font-heading font-black uppercase bg-berry/5 p-5 rounded-2xl border-2 border-berry/10 tracking-widest leading-relaxed shadow-inner"
                >
                  <ShieldCheck size={20} className="shrink-0" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 group"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Initialize Node <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-14 text-center">
            <span className="text-stone/30 text-[11px] font-heading font-black uppercase tracking-widest">New to the collective? </span>
            <Link to="/signup" className="text-accent font-heading font-black uppercase tracking-[0.2em] text-[11px] hover:text-primary transition-colors border-b-2 border-accent/20 hover:border-primary">Register Identity</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;


