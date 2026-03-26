// src/pages/WishlistPage.jsx – Ekomart Harvest Vault
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { wishlistApi } from '../services/api';
import { Heart, ShoppingBag, Leaf, ShoppingBasket, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await wishlistApi.get();
        if (res.success && res.data) {
          setItems(res.data.map(item => item.products).filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-heading font-black uppercase tracking-[0.4em] text-accent/30 animate-pulse">
        <Sprout size={64} className="mb-6 animate-bounce" />
        Syncing Harvest...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-primary rounded-[40px] flex items-center justify-center mb-10 rotate-6 shadow-2xl shadow-primary/20 relative">
          <Heart size={48} className="text-accent" fill="currentColor" strokeWidth={3} />
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full border-4 border-white flex items-center justify-center">
             <ShieldCheck size={24} className="text-white" />
          </div>
        </div>
        <h1 className="font-heading font-black text-6xl tracking-tighter uppercase mb-6 text-primary">HARVEST <span className="text-accent">VAULT</span></h1>
        <p className="text-stone/40 mb-12 max-w-md font-heading font-black uppercase text-xs tracking-widest leading-relaxed">Establish your Ekomart identity to preserve your favorite harvests across all nodes.</p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link to="/login" className="bg-primary text-white px-16 py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-accent transition-all active:scale-95">Verify Identity</Link>
          <Link to="/products" className="bg-white text-primary border-4 border-primary px-16 py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs hover:bg-primary hover:text-white transition-all active:scale-95">Browse Gallery</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-stone-50 rounded-[40px] flex items-center justify-center mb-10 rotate-3 border-4 border-dashed border-stone-200">
           <ShoppingBasket size={48} className="text-stone-200" strokeWidth={1.5} />
        </div>
        <h1 className="font-heading font-black text-6xl tracking-tighter uppercase mb-6 text-primary">VAULT IS <span className="text-stone-300">OPEN</span></h1>
        <p className="text-stone/40 mb-12 max-w-sm font-heading font-black uppercase text-xs tracking-widest leading-relaxed">Your personal curation is blank. Capture the freshest selections before the harvest ends.</p>
        <Link 
          to="/products"
          className="bg-primary text-white px-16 py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-accent transition-all flex items-center gap-4 active:scale-95 group"
        >
          Explore Fresh Arrivals <Leaf size={20} className="group-hover:rotate-45 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-24">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-10 mb-24 border-b-8 border-primary pb-16">
        <div className="text-center md:text-left">
          <span className="inline-block bg-accent px-6 py-2 rounded-full text-white text-[10px] font-heading font-black uppercase tracking-[0.3em] mb-6">Secured Gallery</span>
          <h1 className="font-heading font-black text-7xl md:text-8xl tracking-tighter uppercase leading-none text-primary">WISH <span className="text-accent underline decoration-accent-light/30">LIST</span></h1>
        </div>
        <div className="md:ml-auto flex items-center gap-6">
           <ShieldCheck size={80} strokeWidth={1} className="text-stone-100 hidden lg:block" />
           <div className="bg-primary text-white px-10 py-5 rounded-[32px] font-heading font-black text-4xl shadow-2xl rotate-3">
             {items.length}
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        <AnimatePresence>
          {items.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              subtitle={product.subtitle || product.category}
              price={product.price}
              image={product.image_url || product.image}
              isWished={true}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Support */}
      <div className="mt-40 py-20 border-t-8 border-stone-50 flex flex-col items-center justify-center text-center bg-stone-50/50 rounded-[100px]">
         <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8">
           <ShieldCheck size={36} className="text-accent" />
         </div>
         <p className="font-heading font-black text-[10px] uppercase tracking-[0.5em] text-stone/20">Certified Organic Data Protection Protocol</p>
      </div>
    </motion.div>
  );
};

export default WishlistPage;

