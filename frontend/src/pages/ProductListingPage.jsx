// ProductListingPage.jsx – Grocery Revamp
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Leaf, ShoppingBasket, Layers, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsApi, categoryApi } from '../services/api';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Every Basket']);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('Every Basket');
  const [sort, setSort] = useState('created_at');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.list();
        if (res.success && res.data) {
          setCategories(['Every Basket', ...res.data.map(c => c.name)]);
        }
      } catch {
        setCategories(['Every Basket', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Pantry']);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(page, category === 'Every Basket' ? '' : category, sort);
      if (res.data) {
        setProducts(res.data.map(p => ({ ...p, image: p.image_url })));
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || res.data.length);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch {
      setProducts([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, category, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-accent-light/10">

      {/* ── Fresh Harvest Header Banner ── */}
      <div className="relative w-full bg-primary overflow-hidden rounded-b-[60px] shadow-2xl">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-accent/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-accent/10 blur-[80px] rounded-full" />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
          alt="Fresh Groceries"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter sepia-[0.2] contrast-[1.1]"
        />
        
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-20 lg:py-32">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-1.5 bg-accent rounded-full" />
             <p className="font-heading font-extrabold text-accent uppercase tracking-[0.3em] text-[11px]">Organic Quality Hub</p>
          </div>
          <h1 className="font-heading font-black text-white uppercase leading-[0.9] m-0" style={{ fontSize: 'clamp(56px, 10vw, 130px)' }}>
            Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Harvest</span>
          </h1>
          <div className="mt-10 flex items-center gap-12">
              <div className="flex flex-col">
                  <span className="font-heading font-black text-white text-4xl leading-none">{total}</span>
                  <span className="font-heading font-black text-white/30 uppercase text-[10px] tracking-widest mt-1.5">Fresh Items</span>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="flex flex-col">
                  <span className="font-heading font-black text-accent text-4xl leading-none">{categories.length - 1}</span>
                  <span className="font-heading font-black text-white/30 uppercase text-[10px] tracking-widest mt-1.5">Market Aisles</span>
              </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Filter Navigation ── */}
      <div className="sticky top-[72px] z-50 bg-white/80 backdrop-blur-xl border-b border-accent/10 shadow-lg">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 text-primary shrink-0 mr-4 border-r border-accent/10 pr-8">
            <SlidersHorizontal size={20} className="text-accent" strokeWidth={3} />
            <span className="font-heading font-black text-[11px] uppercase tracking-[0.2em]">Our Aisles</span>
          </div>
          
          <div className="flex gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-8 py-3 text-[12px] font-heading font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap border-2 cursor-pointer
                  ${category === cat
                    ? 'bg-accent text-white border-accent shadow-xl scale-105'
                    : 'bg-white text-stone border-transparent hover:border-accent/30 hover:text-primary'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto shrink-0 relative flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2.5 text-stone font-bold">
                <Leaf size={16} className="text-accent" />
                <span className="text-[10px] uppercase tracking-widest">Sorting Order</span>
            </div>
            <div className="relative">
                <select
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1); }}
                className="bg-white border-2 border-accent/10 hover:border-accent text-primary rounded-2xl px-8 py-3 text-[11px] font-heading font-black uppercase tracking-widest outline-none cursor-pointer transition-all appearance-none pr-12 shadow-sm"
                >
                <option value="created_at">Newly Picked</option>
                <option value="price">Value (Low to High)</option>
                <option value="name">Alphabetical</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 py-20 lg:py-32">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-6">
                <div className="aspect-square bg-white rounded-[40px] shadow-sm border border-white" />
                <div className="space-y-4 px-4 text-center">
                    <div className="h-4 bg-white rounded-full w-3/4 mx-auto" />
                    <div className="h-6 bg-white rounded-full w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${page}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20"
            >
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  subtitle={p.subtitle || p.category}
                  price={p.price}
                  image={p.image_url || p.image}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="py-48 text-center bg-white/50 rounded-[60px] border-4 border-dashed border-white flex flex-col items-center shadow-inner">
            <ShoppingBasket size={80} strokeWidth={1} className="text-accent/20 mb-8" />
            <h3 className="font-heading font-black text-primary text-2xl uppercase tracking-widest mb-2">Aisle is Empty</h3>
            <p className="font-heading font-black text-stone text-[11px] uppercase tracking-[0.2em]">New harvest arrivals coming soon!</p>
            <button onClick={() => setCategory('Every Basket')} className="mt-10 bg-accent text-white px-10 py-4 rounded-full font-heading font-black uppercase text-[12px] tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-transform">Clear Filters</button>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-32">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-16 h-16 flex items-center justify-center rounded-3xl border-2 border-accent/10 bg-white text-primary disabled:opacity-20 hover:border-accent hover:text-accent transition-all cursor-pointer shadow-xl disabled:cursor-not-allowed group"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            </button>
            
            <div className="flex bg-white p-2 rounded-[2rem] border-2 border-accent/10 shadow-lg">
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, page - 2), Math.min(totalPages, page + 1)
                ).map(p => (
                <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl font-heading font-black text-[15px] transition-all border-none cursor-pointer
                    ${p === page
                        ? 'bg-accent text-white shadow-xl scale-110'
                        : 'text-stone hover:text-primary hover:bg-accent-light/30'
                    }`}
                >{p}</button>
                ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-16 h-16 flex items-center justify-center rounded-3xl border-2 border-accent/10 bg-white text-primary disabled:opacity-20 hover:border-accent hover:text-accent transition-all cursor-pointer shadow-xl disabled:cursor-not-allowed group"
            >
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {/* Freshness Promise Banner */}
      <div className="bg-primary pt-24 pb-32 px-6 rounded-t-[80px]">
         <div className="max-w-[800px] mx-auto text-center space-y-8">
            <Sparkles size={50} className="text-accent mx-auto animate-pulse" />
            <h2 className="font-heading font-black text-white text-4xl md:text-5xl uppercase tracking-tighter leading-tight">Harvested with Passion,<br />Delivered with Care.</h2>
            <p className="font-heading font-black text-stone text-[12px] uppercase tracking-[0.3em] leading-[2] opacity-60">
                From the fertile valleys to your dinner table, we ensure every item in your basket is of the highest organic quality. 
                Sourced sustainably, delivered responsibly. Experience the Ekomart freshness promise today.
            </p>
         </div>
      </div>
    </motion.div>
  );
};

export default ProductListingPage;

