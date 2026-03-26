// src/pages/CartPage.jsx – Grocery Revamp
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const CartPage = () => {
  const { cartItems, setCartItems } = useCart();
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const updateQty = (id, size, delta) => {
    setCartItems(prev => prev.map(item => 
      (item.product_id === id && item.size === size) 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.product_id === id && item.size === size)));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  if (authLoading) return <div className="min-h-[70vh] flex items-center justify-center font-heading font-black uppercase tracking-widest text-accent/30 animate-pulse">Checking your basket...</div>;

  if (!token) {
    return (
      <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-28 h-28 bg-primary rounded-[40px] flex items-center justify-center mb-10 rotate-6 shadow-2xl">
          <ShoppingBasket size={48} className="text-accent" strokeWidth={2.5} />
        </div>
        <h1 className="font-heading font-black text-5xl tracking-tight uppercase mb-6 text-primary">Login <span className="text-accent">First</span></h1>
        <p className="text-stone mb-12 max-w-sm font-medium leading-relaxed">Please log in to your account to view your fresh items and complete your order.</p>
        <div className="flex flex-col sm:flex-row gap-5">
          <Link to="/login" className="bg-accent text-white px-14 py-5 rounded-full font-heading font-black uppercase tracking-widest text-sm shadow-xl hover:scale-110 active:scale-95 transition-all">Login Now</Link>
          <Link to="/signup" className="bg-white text-primary border-2 border-primary px-14 py-5 rounded-full font-heading font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all">Join Ekomart</Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-28 h-28 bg-white rounded-[40px] flex items-center justify-center mb-10 -rotate-6 border-4 border-dashed border-accent-light shadow-inner">
          <ShoppingBasket size={48} className="text-accent/30" strokeWidth={1.5} />
        </div>
        <h1 className="font-heading font-black text-5xl tracking-tight uppercase mb-6 text-primary">Empty <span className="text-accent/30">Basket</span></h1>
        <p className="text-stone mb-12 max-w-sm font-medium leading-relaxed">Your basket is waiting for some fresh harvest. Explore our organic categories now.</p>
        <Link 
          to="/products"
          className="bg-accent text-white px-14 py-6 rounded-full font-heading font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
        >
          Start Shopping <Leaf size={20} fill="currentColor" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-24">
      <div className="flex items-end gap-6 mb-16">
        <h1 className="font-heading font-black text-6xl tracking-tight uppercase leading-none text-primary">Your <span className="text-accent">Basket</span></h1>
        <span className="font-heading font-black text-2xl text-stone uppercase mb-2">[{cartItems.length} items]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16 items-start">
        {/* List */}
        <div className="space-y-8">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={`${item.product_id}-${item.size}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row gap-8 p-6 rounded-[40px] bg-white border-2 border-white hover:border-accent/20 transition-all group shadow-sm hover:shadow-xl"
              >
                <div className="w-full sm:w-40 aspect-square rounded-[32px] overflow-hidden bg-accent-light/10 shrink-0 shadow-inner">
                  <img 
                    src={item.product?.image || item.product?.image_url} 
                    alt={item.product?.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-heading font-black text-2xl uppercase leading-tight tracking-tight text-primary">{item.product?.name}</h3>
                      <p className="font-heading font-black text-2xl text-accent">{fmt((item.product?.price || 0) * item.quantity)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       <span className="text-[10px] font-heading font-black uppercase tracking-widest bg-accent-light/30 px-4 py-2 rounded-full text-accent shadow-sm">Weight: {item.size}</span>
                       <span className="text-[10px] font-heading font-black uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full text-primary shadow-sm">Organic: {item.product?.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-accent/5">
                    <div className="flex items-center bg-accent-light/10 rounded-full p-1 border border-white">
                      <button 
                        onClick={() => updateQty(item.product_id, item.size, -1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all text-primary hover:text-berry shadow-sm"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="px-6 font-heading font-black text-lg min-w-[50px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item.product_id, item.size, 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all text-primary hover:text-accent shadow-sm"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="flex items-center gap-3 font-heading font-black text-[11px] uppercase tracking-widest text-berry/30 hover:text-berry transition-all hover:scale-110"
                    >
                      <Trash2 size={15} strokeWidth={2.5} /> Remove Item
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="bg-primary rounded-[60px] p-10 pb-12 sticky top-32 shadow-[0_32px_80px_rgba(26,34,21,0.4)] overflow-hidden border-t-8 border-accent">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -mr-24 -mt-24 animate-pulse" />
          
          <h2 className="font-heading font-black text-3xl tracking-tight uppercase text-white mb-10 flex items-center gap-4">
            Basket Total <Sparkles size={24} className="text-accent" fill="currentColor" />
          </h2>
          
          <div className="space-y-6 mb-12">
            <div className="flex justify-between text-white/40">
              <span className="font-heading font-black text-xs uppercase tracking-widest">Harvest Value</span>
              <span className="font-heading font-black text-lg text-white">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/40">
              <span className="font-heading font-black text-xs uppercase tracking-widest">Processing (5%)</span>
              <span className="font-heading font-black text-lg text-white">{fmt(subtotal * 0.05)}</span>
            </div>
            <div className="flex justify-between items-center py-6 border-y border-white/10">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-accent flex items-center gap-2"><Leaf size={14} /> Eco Delivery</span>
              <span className="font-heading font-black text-[11px] text-accent bg-accent/10 px-4 py-1.5 rounded-full uppercase tracking-tighter border border-accent/20">Complimentary</span>
            </div>
            <div className="pt-6 flex justify-between items-end">
              <div>
                <span className="block font-heading font-black text-[11px] uppercase tracking-widest text-white/30 mb-2">Final Amount</span>
                <span className="font-heading font-black text-5xl text-white leading-none drop-shadow-lg">{fmt(subtotal * 1.05)}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-accent text-white py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-[13px] flex items-center justify-center gap-4 hover:bg-white hover:text-primary transition-all shadow-2xl active:scale-95 group"
          >
            Checkout Now <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center gap-3 mt-10 pt-6 border-t border-white/5">
            <ShieldCheck size={16} className="text-accent" />
            <p className="text-[10px] text-white/30 uppercase font-heading font-black tracking-widest">
              Secure Harvesting Protocol Enabled
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;

