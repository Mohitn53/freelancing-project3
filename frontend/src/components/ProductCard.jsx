// ProductCard.jsx – Grocery E-commerce themed
import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, Eye, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { wishlistApi } from '../services/api';

const ProductCard = ({ id, image, name, subtitle, price, isWished: initWished = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWished, setIsWished] = useState(initWished);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token } = useAuth();

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/products/${id}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    addToCart({ id, image, name, price }, 'M', 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    const nextState = !isWished;
    setIsWished(nextState);
    try {
      if (nextState) { await wishlistApi.add(id); }
      else { await wishlistApi.remove(id); }
    } catch {
      setIsWished(!nextState);
    }
  };

  return (
    <motion.div
      className="flex flex-col cursor-pointer group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleQuickView}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Image Container ── */}
      <div className="relative aspect-square overflow-hidden bg-accent-light/30">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* ── FRESH Badge ── */}
        <div className="absolute top-4 left-4 bg-accent text-white font-heading font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform -rotate-1">
          <Leaf size={10} fill="currentColor" />
          Fresh Harvest
        </div>

        {/* ── Wishlist Button ── */}
        <button
          id={`wishlist-${id}`}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all z-10 
            ${isWished ? 'bg-berry text-white' : 'bg-white/80 text-primary hover:bg-berry hover:text-white'}`}
          onClick={toggleWishlist}
        >
          <Heart
            size={18}
            fill={isWished ? 'currentColor' : 'none'}
            strokeWidth={2.5}
          />
        </button>

        {/* ── Actions Layer ── */}
        <div className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* ── Info Row ── */}
      <div className="flex flex-col p-5 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-accent font-bold uppercase tracking-widest">{subtitle || 'Organic & Farm Fresh'}</span>
          <h3 className="font-heading font-extrabold text-[18px] text-primary group-hover:text-accent transition-colors leading-tight truncate">
            {name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="font-heading font-black text-[20px] text-primary">{fmt(price)}</span>
            <span className="text-[12px] text-stone font-medium line-through opacity-50">₹{(price * 1.2).toFixed(0)}</span>
          </div>
          
          <button
            id={`addtocart-${id}`}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md group/btn
              ${added ? 'bg-success text-white scale-95' : 'bg-accent hover:bg-accent-dark text-white hover:-translate-y-1 active:translate-y-0'}`}
            onClick={handleAdd}
          >
            {added ? <Check size={20} strokeWidth={3} /> : <ShoppingBag size={20} strokeWidth={2.5} className="group-hover/btn:rotate-12 transition-transform" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;


