// Navbar.jsx – Grocery E-commerce themed navigation
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Heart, User, X, LogOut, ChevronDown, Leaf, ShoppingBasket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MotionBtn = motion.button;
const MotionLink = motion.create(Link);

const NAV_LINKS = [
  { label: 'Shop', to: '/products' },
  { label: 'Fresh Arrivals', to: '/products?sort=created_at' },
  { label: 'Our Story', to: '/about-contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!value || value.length < 2) { setSearchResults([]); setSearchLoading(false); return; }
    searchTimerRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await productsApi.search(value);
        setSearchResults(res.data || []);
      } catch { setSearchResults([]); }
      setSearchLoading(false);
    }, 300);
  };

  const handleResultClick = (id) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/products/${id}`);
  };

  return (
    <>
      <nav
        className={`h-20 sticky top-0 z-[100] transition-all duration-300
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-accent-light'
            : 'bg-white border-b border-gray-100'
          }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-full flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-md transition-all group-hover:rotate-6">
              <Leaf size={22} color="#fff" fill="#fff" strokeWidth={2} />
            </div>
            <span
              className="font-heading font-extrabold text-2xl tracking-tight text-primary leading-none"
            >
              Eko<span className="text-accent">mart</span>
            </span>
          </Link>

          {/* ── Nav Links (Desktop) ── */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <MotionLink
                key={link.label}
                to={link.to}
                className="font-sans font-bold text-[16px] text-primary hover:text-accent transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2.5px] bg-accent rounded-full group-hover:w-full transition-all duration-300" />
              </MotionLink>
            ))}
            {user?.role === 'admin' && (
              <MotionLink
                to="/admin"
                className="font-heading font-bold text-[14px] bg-berry text-white px-5 py-1.5 rounded-full hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Admin
              </MotionLink>
            )}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <MotionBtn
              id="navbar-search-btn"
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-accent-light text-primary hover:text-accent transition-colors cursor-pointer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => { setSearchOpen(true); setTimeout(() => document.getElementById('search-input')?.focus(), 100); }}
            >
              <Search size={22} strokeWidth={2.5} />
            </MotionBtn>

            {/* Cart */}
            <MotionBtn
              id="navbar-cart-btn"
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-accent-light text-primary hover:text-accent transition-colors cursor-pointer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/cart')}
            >
              <ShoppingBasket size={22} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-white text-[11px] font-black rounded-full flex items-center justify-center leading-none border-2 border-white">
                  {cartCount}
                </span>
              )}
            </MotionBtn>

            {/* Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <MotionBtn
                  id="navbar-profile-btn"
                  className="relative flex items-center justify-center w-11 h-11 rounded-full bg-accent-light text-primary hover:text-accent transition-colors cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => navigate('/profile')}
                >
                  <User size={22} strokeWidth={2.5} />
                </MotionBtn>
                <MotionBtn
                  id="navbar-logout-btn"
                  className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => { handleLogout(); navigate('/'); }}
                >
                  <LogOut size={20} strokeWidth={2.5} />
                </MotionBtn>
              </div>
            ) : (
              <MotionBtn
                id="navbar-login-btn"
                className="hidden sm:flex items-center gap-2 bg-accent text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-full hover:bg-accent-dark transition-all shadow-md cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
              >
                Login
              </MotionBtn>
            )}
          </div>
        </div>
      </nav>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[200] flex items-start justify-center pt-24 px-4 overflow-y-auto"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 px-6 py-5 bg-accent-light">
                <Search size={22} className="text-accent shrink-0" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Fresh apples, organic milk, farm eggs..."
                  className="flex-1 text-lg outline-none font-sans bg-transparent placeholder:text-stone/50 text-primary"
                />
                <button onClick={() => setSearchOpen(false)} className="text-stone hover:text-berry transition-colors cursor-pointer p-1">
                  <X size={24} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchQuery.length >= 2 ? (
                  <>
                    {searchLoading ? (
                      <div className="p-10 text-center text-stone animate-pulse font-medium">Hunting for fresh produce…</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-10 text-center text-stone font-medium">We couldn't find "{searchQuery}" in our farm.</div>
                    ) : (
                      <div className="grid grid-cols-1 divide-y divide-gray-50">
                        {searchResults.map(r => (
                          <button key={r.id} onClick={() => handleResultClick(r.id)}
                            className="w-full flex items-center gap-5 px-6 py-4 hover:bg-accent-light transition-colors text-left group">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                              <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-heading font-bold text-lg text-primary">{r.name}</p>
                              <p className="text-sm text-stone flex items-center gap-1.5 capitalize">
                                <Leaf size={14} className="text-accent" /> Fresh & Organic
                              </p>
                            </div>
                            <p className="font-heading font-extrabold text-accent text-lg">₹{Number(r.price).toLocaleString('en-IN')}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8">
                    <p className="text-sm text-stone mb-4 font-bold uppercase tracking-widest px-1">Top Seasonal Picks</p>
                    <div className="flex flex-wrap gap-2.5">
                      {['Fresh Fruits', 'Green Veggies', 'Organic Milk', 'Farm Eggs', 'Honey', 'Whole Grains'].map((tag) => (
                        <button key={tag} onClick={() => handleSearchChange(tag)}
                          className="px-5 py-2 bg-accent-light border border-transparent rounded-full text-sm text-primary font-bold hover:bg-accent hover:text-white transition-all cursor-pointer">
                          {tag}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-accent rounded-3xl text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="font-heading font-black text-2xl">Super Sale!</p>
                        <p className="text-sm opacity-90 font-medium">Get 20% off on all organic products this weekend.</p>
                      </div>
                      <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

