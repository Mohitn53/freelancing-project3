// AdminSidebar.jsx – Ekomart "Harvest Command" Hub
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Box, 
  LogOut,
  ChevronRight,
  Leaf,
  Sprout,
  ShoppingBasket,
  Search,
  Settings,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: Package, label: 'Products', path: '/admin/products', sub: 'Catalog' },
  { icon: Layers, label: 'Categories', path: '/admin/categories', sub: 'Taxonomy' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', sub: 'Fulfilment' },
  { icon: Users, label: 'Customers', path: '/admin/customers', sub: 'Collective' },
  { icon: Box, label: 'Inventory', path: '/admin/inventory', sub: 'Freshness' },
];

const AdminSidebar = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="w-80 shrink-0 bg-primary text-white flex flex-col border-r-8 border-accent h-screen sticky top-0 z-[100] overflow-hidden shadow-2xl">
      
      {/* ── Brand / Logo ── */}
      <div className="p-12 pb-16">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center rotate-12 shadow-xl shadow-accent/20">
              <Leaf size={24} className="text-white" strokeWidth={3} />
            </div>
            <span className="text-[10px] font-heading font-black text-accent uppercase tracking-[0.4em]">Admin Node</span>
        </div>
        <h1 className="font-heading font-black text-4xl uppercase tracking-tighter leading-none m-0">
          Harvest <span className="text-accent underline decoration-accent-light/30">HQ</span>
        </h1>
        <p className="text-[9px] font-heading font-black text-white/30 uppercase tracking-widest mt-2 px-1 leading-relaxed">Global Inventory Control</p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-8 space-y-5">
        <p className="px-4 text-[9px] font-heading font-black text-white/20 uppercase tracking-[0.5em] mb-6">Core Protocols</p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group relative flex items-center justify-between px-6 py-5 rounded-[2.5rem] transition-all duration-500
              ${isActive 
                ? 'bg-accent text-white shadow-[0_15px_35px_rgba(98,148,50,0.3)] scale-[1.02]' 
                : 'text-white/40 hover:bg-white/5 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-6 relative z-10 font-heading">
                  <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-primary text-accent' : 'bg-white/5 text-accent group-hover:bg-accent group-hover:text-white'}`}>
                    <item.icon size={20} strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-opacity mt-1 ${isActive ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}`}>
                        {item.sub}
                    </span>
                  </div>
                </div>

                <div className={`transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                    <ChevronRight size={16} strokeWidth={4} />
                </div>

                {/* Background Glow on Active */}
                {isActive && (
                    <motion.div 
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-accent rounded-[2.5rem] -z-10"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Stock Vitality Summary (Visual) ── */}
      <div className="px-12 py-12 bg-white/5 border-t-8 border-accent/20 mt-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
              <ShoppingBasket size={100} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-heading font-black text-white/30 uppercase tracking-[0.4em] mb-6">Network Status</p>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(98,148,50,0.8)]" />
                <span className="text-[11px] font-heading font-black text-white uppercase tracking-widest">Active Node</span>
            </div>
            
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between px-8 py-5 bg-berry/10 hover:bg-berry text-berry hover:text-white rounded-3xl transition-all duration-500 font-heading font-black uppercase tracking-[0.3em] text-[10px] border-none cursor-pointer group/btn shadow-xl"
            >
                <div className="flex items-center gap-3">
                    <LogOut size={16} strokeWidth={3} />
                    <span>Halt Uplink</span>
                </div>
                <Sprout size={16} strokeWidth={3} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
      </div>

    </div>
  );
};

export default AdminSidebar;

