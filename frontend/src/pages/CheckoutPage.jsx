// src/pages/CheckoutPage.jsx – Grocery Revamp
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2, Leaf, ShoppingBasket, ShieldAlert, Sparkles, MapPin, Mail, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../services/api';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const CheckoutPage = () => {
  const { cartItems, setCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const processingFee = subtotal * 0.05;
  const total = subtotal + processingFee;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return;

    setPlacingOrder(true);
    setOrderError('');

    try {
      const items = cartItems
        .map((item) => ({
          product_id: item.product_id || item.product?.id,
          quantity: item.quantity,
          price: item.product?.price || item.price || 0,
          size: item.size || '1kg',
        }))
        .filter((item) => item.product_id);

      if (!items.length) {
        throw new Error('Your basket is empty. Please add items to proceed.');
      }

      await orderApi.create({
        items,
        total_amount: total,
        payment_method: paymentMethod,
      });

      setPlaced(true);
      setTimeout(() => {
        setCartItems([]);
        navigate('/profile');
      }, 3000);
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Please check your connection.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (placed) {
    return (
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center bg-primary overflow-hidden rounded-b-[80px]">
        {/* Success burst background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-accent/10 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-40 h-40 bg-accent rounded-[50px] flex items-center justify-center mb-12 text-white shadow-[0_40px_100px_rgba(98,148,50,0.5)]"
        >
          <ShoppingBasket size={80} strokeWidth={2.5} />
        </motion.div>
        
        <h1 className="relative z-10 font-heading font-black text-6xl md:text-7xl tracking-tighter uppercase mb-6 text-white">Harvest <span className="text-accent">Confirmed</span></h1>
        <p className="relative z-10 text-stone max-w-sm mb-16 font-heading font-black uppercase text-xs tracking-[0.3em] leading-loose opacity-60">Freshness is on the way. Your organic items are being packed with care for delivery.</p>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-6">
          <Link to="/profile" className="bg-accent text-white px-12 py-6 rounded-full font-heading font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-110 active:scale-95 transition-all">View My Harvests</Link>
          <Link to="/" className="bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-primary px-12 py-6 rounded-full font-heading font-black uppercase tracking-widest text-xs transition-all shadow-xl">Back to Market</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-24">
      <div className="mb-20 pb-10 border-b-8 border-primary rounded-b-xl">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-3 font-heading font-black uppercase text-[11px] tracking-[0.2em] text-stone hover:text-accent transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Basket
        </button>
        <h1 className="font-heading font-black text-6xl md:text-7xl tracking-tighter uppercase mt-4 text-primary">Secure <span className="text-accent">Checkout</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20">
        {/* Left: Info */}
        <div className="space-y-20">
          {/* Section 1: Shipping */}
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary rounded-[28px] flex items-center justify-center -rotate-6 shadow-xl border-4 border-white">
                <Truck size={28} className="text-accent" />
              </div>
              <h2 className="font-heading font-black text-3xl tracking-tight uppercase text-primary">Delivery Logistics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-10 rounded-[48px] shadow-xl border-2 border-white">
               <div className="flex flex-col gap-3">
                 <label className="flex items-center gap-2 text-[10px] font-heading font-black uppercase tracking-widest text-stone pl-2">
                    <User size={12} className="text-accent" /> Recipient Name
                 </label>
                 <input type="text" placeholder="Your full name" defaultValue={user?.name} className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-2xl px-6 py-5 font-sans text-sm font-bold outline-none transition-all shadow-inner" />
               </div>
               <div className="flex flex-col gap-3">
                 <label className="flex items-center gap-2 text-[10px] font-heading font-black uppercase tracking-widest text-stone pl-2">
                    <Mail size={12} className="text-accent" /> Email ID
                 </label>
                 <input type="email" placeholder="Email for updates" defaultValue={user?.email} className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-2xl px-6 py-5 font-sans text-sm font-bold outline-none transition-all shadow-inner" />
               </div>
               <div className="flex flex-col gap-3 md:col-span-2">
                 <label className="flex items-center gap-2 text-[10px] font-heading font-black uppercase tracking-widest text-stone pl-2">
                    <MapPin size={12} className="text-accent" /> Destination Address
                 </label>
                 <input type="text" placeholder="Full door/street address" className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-2xl px-6 py-5 font-sans text-sm font-bold outline-none transition-all shadow-inner" />
               </div>
               <div className="grid grid-cols-2 gap-6 md:col-span-2">
                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-heading font-black uppercase tracking-widest text-stone pl-2">Harvest Zone (City)</label>
                   <input type="text" placeholder="City" className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-2xl px-6 py-5 font-sans text-sm font-bold outline-none transition-all shadow-inner" />
                 </div>
                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-heading font-black uppercase tracking-widest text-stone pl-2">Postal Tag</label>
                   <input type="text" placeholder="Pincode" className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-2xl px-6 py-5 font-sans text-sm font-bold outline-none transition-all shadow-inner" />
                 </div>
               </div>
            </div>
          </section>

          {/* Section 2: Payment */}
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary rounded-[28px] flex items-center justify-center rotate-6 shadow-xl border-4 border-white">
                <CreditCard size={28} className="text-accent" />
              </div>
              <h2 className="font-heading font-black text-3xl tracking-tight uppercase text-primary">Payment Channel</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'card', label: 'Electronic Card', sub: 'VISA, MASTER, AMEX', icon: CreditCard },
                { id: 'wallet', label: 'E-Wallet / UPI', sub: 'GPAY, PAYTM, UPI', icon: Sparkles },
                { id: 'cod', label: 'COD Protocol', sub: 'Pay upon harvest', icon: Truck },
              ].map(opt => (
                <label 
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`flex flex-col p-8 border-4 rounded-[32px] cursor-pointer transition-all hover:shadow-xl relative overflow-hidden group
                    ${paymentMethod === opt.id ? 'border-accent bg-white shadow-2xl scale-105' : 'border-white bg-white/50 text-stone'} ${opt.id === 'cod' ? 'md:col-span-2' : ''}`}
                >
                  <div className="flex items-center justify-between mb-6">
                     <div className={`p-4 rounded-2xl transition-all ${paymentMethod === opt.id ? 'bg-accent text-white' : 'bg-accent-light/20 text-accent/40 group-hover:bg-accent group-hover:text-white'}`}>
                        <opt.icon size={24} strokeWidth={2.5} />
                     </div>
                     <input type="radio" checked={paymentMethod === opt.id} readOnly className="w-6 h-6 accent-accent" />
                  </div>
                  <p className="font-heading font-black text-lg uppercase tracking-tight text-primary">{opt.label}</p>
                  <p className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-accent mt-2 group-hover:opacity-100 opacity-60 transition-opacity">{opt.sub}</p>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Summary Dark Card */}
        <aside className="lg:pl-6">
          <div className="bg-primary rounded-[60px] p-10 pb-16 sticky top-32 shadow-[0_40px_100px_rgba(26,34,21,0.5)] overflow-hidden text-white border-t-8 border-accent">
            <h2 className="font-heading font-black text-3xl tracking-tight uppercase mb-10 text-white flex items-center gap-4">
                Your Harvest <Leaf size={24} className="text-accent" />
            </h2>
            
            <div className="max-h-[350px] overflow-y-auto pr-3 space-y-6 mb-12 no-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-5 p-4 bg-white/5 rounded-[24px] border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                    <img src={item.product?.image || item.product?.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="font-heading font-black text-[11px] uppercase truncate text-white/90">{item.product?.name}</p>
                    <p className="text-[10px] font-heading font-black text-accent uppercase tracking-widest mt-2 bg-accent/10 px-3 py-1 rounded-full inline-block">EK {item.size} • QTY {item.quantity}</p>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <p className="font-heading font-black text-xs text-white/20 line-through mb-1 opacity-20">{fmt((item.product?.price || 0) * 1.5 * item.quantity)}</p>
                    <p className="font-heading font-black text-sm text-white">{fmt((item.product?.price || 0) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-10 border-t border-white/10">
              <div className="flex justify-between text-white/40 font-heading font-black text-[11px] uppercase tracking-widest">
                <span>Basket Total</span>
                <span className="text-white">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/40 font-heading font-black text-[11px] uppercase tracking-widest">
                <span>Harvest Fee (5%)</span>
                <span className="text-white">{fmt(processingFee)}</span>
              </div>
              <div className="flex justify-between py-10 border-y border-white/5">
                <span className="font-heading font-black text-base uppercase tracking-tight text-white/60">PAYABLE TOTAL</span>
                <span className="font-heading font-black text-5xl text-accent leading-none drop-shadow-2xl">{fmt(total)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={placingOrder || cartItems.length === 0}
              className="w-full bg-accent text-white py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-[14px] mt-12 hover:bg-white hover:text-primary active:scale-95 transition-all shadow-[0_20px_50px_rgba(98,148,50,0.4)] disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-4 group"
            >
              {placingOrder ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShieldCheck size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
              )}
              {placingOrder ? 'TRANSMITTING...' : 'COMMIT ORDER'}
            </button>
            
            {orderError && (
              <div className="flex items-center gap-3 text-berry p-4 bg-berry/10 rounded-2xl border border-berry/20 mt-6 animate-shake">
                 <ShieldAlert size={16} />
                 <p className="text-[10px] font-heading font-black uppercase tracking-wider">{orderError}</p>
              </div>
            )}
            
            <p className="text-[9px] text-white/20 text-center mt-10 uppercase font-heading font-black tracking-[0.3em] leading-relaxed">
              Secured Freshness Protocol Activated<br />Ekomart Integrated Processing
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;

