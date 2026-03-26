// ProductDetailsPage.jsx – Grocery Revamp
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBasket, Check, Sparkles, ShieldCheck, Leaf, ArrowLeft, Share2, Layers, ShoppingBag, Truck, BadgeCheck } from 'lucide-react';
import { productsApi, wishlistApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const WEIGHTS = ['250g', '500g', '1kg', '2kg', '5kg'];

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [qty, setQty] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  
  const { addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productsApi.get(id);
        setProduct(res.data);
      } catch {
        setProduct(null);
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWishlist = async () => {
    if (!token) { navigate('/login'); return; }
    setWishLoading(true);
    try {
      if (isWished) {
        await wishlistApi.remove(product.id);
        setIsWished(false);
      } else {
        await wishlistApi.add(product.id);
        setIsWished(true);
      }
    } catch {
      setIsWished(prev => !prev);
    }
    setWishLoading(false);
  };

  const handleAddToCart = () => {
    if (!token) { navigate('/login'); return; }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || product.image,
    }, selectedWeight, qty, true);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  if (loading) return (
    <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-48 flex flex-col items-center justify-center font-heading font-black uppercase tracking-widest text-accent/30 animate-pulse">
        Unboxing Freshness...
    </div>
  );

  if (!product) return (
    <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-48 text-center bg-accent-light/10 rounded-[60px]">
      <Leaf size={60} className="text-berry mx-auto mb-6" />
      <h1 className="font-heading font-black text-4xl uppercase text-berry">Item Not Found</h1>
      <Link to="/products" className="mt-10 inline-block font-heading font-black uppercase text-accent border-b-4 border-accent pb-2 hover:scale-110 transition-transform">Back to All Harvest</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full min-h-screen bg-accent-light/10">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-accent/5 blur-[120px] rounded-full -mr-[20vw] -mt-[10vh]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-berry/5 blur-[120px] rounded-full -ml-[10vw] -mb-[10vh]" />
      </div>

      <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-16 lg:py-24">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-5 mb-16">
            <button onClick={() => navigate(-1)} className="p-4 bg-white/80 backdrop-blur-md hover:bg-primary hover:text-white rounded-[20px] transition-all shadow-sm group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            </button>
            <div className="flex items-center gap-3 font-heading font-black text-[12px] uppercase tracking-widest text-stone">
                <Link to="/products" className="hover:text-accent transition-colors">Market</Link>
                <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                <span className="text-primary">{product?.category}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                <span className="text-accent">{product?.name}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-start">
          
          {/* ════════════════════════ GALLERY ════════════════════════ */}
          <div className="space-y-8 relative group">
            <motion.div 
              initial={{ x: -40, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-square bg-white rounded-[60px] overflow-hidden relative shadow-2xl border-4 border-white"
            >
              <img
                src={product?.image_url || product?.image}
                alt={product?.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              
              <div className="absolute top-10 left-10">
                <div className="bg-accent/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-heading font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center gap-2">
                    <Leaf size={14} fill="white" /> 100% Organic
                </div>
              </div>
            </motion.div>

            {/* Micro Gallery (Stylized) */}
            <div className="grid grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-white rounded-[24px] border-2 border-transparent transition-all cursor-pointer shadow-md hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden">
                        <img src={product?.image_url || product?.image} className="w-full h-full object-cover hover:rotate-6 transition-transform" alt="" />
                    </div>
                ))}
            </div>
          </div>

          {/* ════════════════════════ INFO PANEL ════════════════════════ */}
          <div className="space-y-16">
            
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <span className="bg-primary text-white px-5 py-2 rounded-xl font-heading font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <Sparkles size={12} fill="currentColor" className="text-accent" /> Fresh Guaranteed
                 </span>
                 <span className="text-[11px] font-heading font-black text-stone uppercase tracking-widest">
                    HARVEST ID: EK-{product?.id.slice(0,6).toUpperCase()}
                 </span>
              </div>
              
              <h1 className="font-heading font-black text-6xl md:text-7xl xl:text-8xl tracking-tighter uppercase leading-none text-primary">
                {product?.name.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 0 ? 'block' : 'block text-accent'}>{word} </span>
                ))}
              </h1>

              <div className="flex items-end gap-8 pt-4">
                 <p className="font-heading font-black text-6xl text-primary tracking-tighter leading-none">{fmt(product?.price || 0)}</p>
                 <div className="flex flex-col gap-2 pb-2">
                    <div className="flex items-center gap-2">
                        <BadgeCheck size={14} className="text-accent" />
                        <p className="text-[10px] font-heading font-black uppercase tracking-widest text-accent">Tax Included</p>
                    </div>
                    <div className="h-1 w-16 bg-accent rounded-full" />
                 </div>
              </div>
            </div>

            {/* Description Review */}
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[48px] border-2 border-white relative group overflow-hidden transition-all shadow-xl hover:bg-primary">
               <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:text-white transition-colors">
                  <ShoppingBag size={150} strokeWidth={1} />
               </div>
               <h3 className="font-heading font-black text-[11px] uppercase tracking-[0.3em] text-accent mb-6 group-hover:text-accent-light transition-colors">Freshness Review</h3>
               <p className="font-heading font-black text-base uppercase leading-loose text-stone group-hover:text-white/80 transition-colors relative z-10">
                 {product?.description || `Premium organic harvest sourced directly from local sustainable farms. Hand-picked for quality, peak ripeness, and maximum nutritional value. No artificial preservatives or chemical treatments used.`}
               </p>
            </div>

            {/* Selection Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone">Selection Pick</label>
                        <span className="text-[10px] font-bold text-accent">Fresh In Stock</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {WEIGHTS.map(weight => (
                            <button
                                key={weight}
                                onClick={() => setSelectedWeight(weight)}
                                className={`px-6 py-4 rounded-3xl font-heading font-black text-xs transition-all border-2 cursor-pointer
                                    ${selectedWeight === weight
                                    ? 'bg-accent text-white border-accent shadow-xl scale-105'
                                    : 'bg-white border-white text-stone hover:border-accent/30'
                                    }`}
                            >{weight}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-5">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone">Item Count</label>
                    <div className="flex items-center justify-between h-16 bg-white rounded-3xl px-8 border-2 border-white shadow-md">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-primary hover:text-berry transition-colors border-none bg-none cursor-pointer">
                            <Minus size={22} strokeWidth={3} />
                        </button>
                        <span className="font-heading font-black text-2xl">{qty}</span>
                        <button onClick={() => setQty(q => q + 1)} className="text-primary hover:text-accent transition-colors border-none bg-none cursor-pointer">
                            <Plus size={22} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-10">
                <button
                    onClick={handleAddToCart}
                    className={`flex-[2.5] h-20 rounded-full font-heading font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-5 shadow-2xl active:scale-95 group border-none cursor-pointer
                        ${cartAdded
                        ? 'bg-white text-accent ring-4 ring-accent'
                        : 'bg-accent text-white hover:bg-accent-dark'
                        }`}
                >
                    <div className={`p-3 rounded-2xl bg-white/20 group-hover:rotate-12 transition-transform ${cartAdded ? 'bg-accent text-white' : ''}`}>
                        {cartAdded ? <Check size={22} strokeWidth={4} /> : <ShoppingBasket size={22} strokeWidth={3} />}
                    </div>
                    {cartAdded ? 'Added to Basket' : 'Add to Basket'}
                </button>
                
                <button
                    onClick={handleWishlist}
                    className={`flex-1 h-20 rounded-full border-4 font-heading font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-4 active:scale-95 cursor-pointer shadow-xl
                        ${isWished
                        ? 'border-berry bg-berry text-white'
                        : 'border-white bg-white text-stone hover:text-berry'
                        }`}
                >
                    <Heart size={24} fill={isWished ? 'currentColor' : 'none'} strokeWidth={3} />
                    {isWished ? 'Saved' : 'Save'}
                </button>
                
                <button className="h-20 w-20 flex items-center justify-center bg-white rounded-full border-2 border-white shadow-xl text-stone hover:text-accent transition-all cursor-pointer">
                    <Share2 size={24} />
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-8 pt-16 border-t border-white">
                <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-accent shadow-md group-hover:bg-accent group-hover:text-white transition-all">
                        <Truck size={28} />
                    </div>
                    <span className="text-[11px] font-heading font-black uppercase tracking-widest text-primary mt-4">Fast Ship</span>
                    <p className="text-[9px] font-bold text-stone mt-2 uppercase">24h Delivery</p>
                </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-accent shadow-md group-hover:bg-accent group-hover:text-white transition-all">
                        <Leaf size={28} />
                    </div>
                    <span className="text-[11px] font-heading font-black uppercase tracking-widest text-primary mt-4">Purely Bio</span>
                    <p className="text-[9px] font-bold text-stone mt-2 uppercase">Certified Org.</p>
                </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-accent shadow-md group-hover:bg-accent group-hover:text-white transition-all">
                        <ShieldCheck size={28} />
                    </div>
                    <span className="text-[11px] font-heading font-black uppercase tracking-widest text-primary mt-4">Secure Pay</span>
                    <p className="text-[9px] font-bold text-stone mt-2 uppercase">100% Trusted</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;

