// HomePage.jsx – Grocery E-Commerce
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, RotateCcw, Headphones, ShieldCheck, ArrowRight, Flame, Leaf, ShoppingBasket, Gift, Clock } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import { productsApi, categoryApi } from '../services/api';

const FEATURES = [
  { icon: Truck, title: 'Express Delivery', sub: 'Fresh in 24 hours' },
  { icon: Clock, title: '24/7 Quality', sub: 'Freshness guaranteed' },
  { icon: ShoppingBasket, title: 'Farm to Fork', sub: '100% Organic sourcing' },
  { icon: Gift, title: 'Weekly Deals', sub: 'Save more every day' },
];

const GROCERY_CATEGORIES = [
  { label: 'Vegetables', emoji: '🥦', img: 'https://images.unsplash.com/photo-1566385101042-1a000c1267c4?q=80&w=400&auto=format&fit=crop' },
  { label: 'Fruits', emoji: '🍎', img: 'https://images.unsplash.com/photo-1619566639371-5909d59739a1?q=80&w=400&auto=format&fit=crop' },
  { label: 'Dairy', emoji: '🥛', img: 'https://images.unsplash.com/photo-1550583724-125581cc25fb?q=80&w=400&auto=format&fit=crop' },
  { label: 'Bakery', emoji: '🍞', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
  { label: 'Meat', emoji: '🥩', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=400&auto=format&fit=crop' },
  { label: 'Pantry', emoji: '🍯', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop' },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.list();
        if (res.success && res.data) {
          setCategories(['All', ...res.data.map(c => c.name)]);
        }
      } catch {
        setCategories(['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery']);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productsApi.list(1, activeTab === 'All' ? '' : activeTab);
        setProducts(res.data?.slice(0, 8) || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page bg-accent-light/20" exit={{ opacity: 0 }}>

      {/* ── 1. Hero ── */}
      <Hero />

      {/* ── 2. Feature Strip ── */}
      <div className="w-full bg-primary py-8 rounded-b-[40px] shadow-2xl relative z-10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 px-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Icon size={22} className="text-accent" />
                </div>
                <div>
                  <p className="font-heading font-black text-white text-[15px] uppercase tracking-wide leading-none">{title}</p>
                  <p className="text-stone text-[12px] mt-1.5 font-medium">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Promo Banners ── */}
      <div className="pt-24">
        <PromoBanner />
      </div>

      {/* ── 4. Grocery Categories ── */}
      <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 mb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block bg-accent/15 text-accent font-bold text-[12px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">Purely Organic</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase leading-none text-primary">
              Shop by <span className="text-accent">Freshness.</span>
            </h2>
          </div>
          <button
            id="home-view-all-categories-btn"
            onClick={() => navigate('/products')}
            className="hidden md:flex items-center gap-3 font-heading font-black text-[14px] uppercase tracking-widest text-primary hover:text-accent transition-all cursor-pointer group"
          >
            Explore All <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all"><ArrowRight size={16} /></div>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {GROCERY_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate('/products')}
              className="relative aspect-[4/5] overflow-hidden rounded-[32px] cursor-pointer group shadow-md"
            >
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-xl border border-white/20">
                  {cat.emoji}
                </div>
                <span className="font-heading font-black text-white text-[15px] uppercase tracking-widest mb-1">{cat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 5. Bestsellers Grid ── */}
      <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 pb-32">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-8">
          <div className="flex-1">
            <span className="inline-block bg-berry/15 text-berry font-bold text-[12px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">Direct from Farm</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase leading-none text-primary flex items-center gap-4">
              Best Sellers
              <Flame size={40} className="text-berry animate-bounce" />
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white overflow-x-auto max-w-full no-scrollbar shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 text-[13px] font-heading font-black uppercase tracking-widest transition-all outline-none border-none cursor-pointer rounded-xl whitespace-nowrap
                  ${activeTab === cat
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-transparent text-stone hover:text-primary hover:bg-white/50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            id="home-show-more-btn"
            onClick={() => navigate('/products')}
            className="hidden lg:flex items-center gap-3 font-heading font-black text-[14px] uppercase tracking-widest text-primary hover:text-accent transition-all cursor-pointer group"
          >
            Full Catalog <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all"><ArrowRight size={16} /></div>
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-square bg-white animate-pulse rounded-[40px] shadow-sm" />
                <div className="h-4 bg-white animate-pulse rounded-full w-3/4 mx-auto" />
                <div className="h-4 bg-white animate-pulse rounded-full w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white/50 rounded-[40px] border-4 border-dashed border-white">
            <Leaf size={48} className="text-accent/20 mx-auto mb-4" />
            <p className="font-heading font-black text-primary/40 uppercase tracking-widest text-lg">Harvesting these soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                subtitle={product.category}
                price={product.price}
                image={product.image_url}
              />
            ))}
          </div>
        )}

        {/* Mobile Show More */}
        <div className="flex justify-center mt-12 md:hidden">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 bg-accent text-white font-heading font-black text-[14px] uppercase tracking-widest px-10 py-4 rounded-full hover:bg-accent-dark transition-all cursor-pointer shadow-xl"
          >
            View All Harvest <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ── 6. Explore Featured / CTA Banner ── */}
      <div className="relative w-full overflow-hidden my-0 py-32 rounded-t-[60px]">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
          alt="Explore our farm collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-accent text-white font-black text-[12px] uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-6 shadow-xl">Hand-Picked for you</span>
            <h2 className="font-heading font-black text-white uppercase leading-none mb-10" style={{ fontSize: 'clamp(40px, 8vw, 100px)' }}>
              NATURE'S BEST<br /><span className="text-accent">IN EVERY BOX</span>
            </h2>
            <button
              id="home-explore-featured-btn"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-3 bg-white text-primary hover:bg-accent hover:text-white font-heading font-black text-[16px] uppercase tracking-widest px-12 py-5 rounded-full transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
            >
              Order Organic Now <ArrowRight size={22} strokeWidth={3} />
            </button>
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
};

export default HomePage;

