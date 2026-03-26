// AdminLayout.jsx – Ekomart Admin Foundation
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout } from 'lucide-react';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return (
      <div className="h-screen w-screen bg-primary flex flex-col items-center justify-center font-heading font-black text-accent uppercase tracking-[0.5em] animate-pulse">
        <Sprout size={64} className="mb-8 animate-bounce" />
        Establishing Neural Link...
      </div>
  );

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="flex bg-[#F8F9F7] min-h-screen font-sans selection:bg-accent/30">
      
      {/* ── Fixed Sidebar ── */}
      <AdminSidebar />
      
      {/* ── Content Node ── */}
      <div className="flex-1 min-w-0 flex flex-col relative overflow-y-auto h-screen">
        
        {/* Organic Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
            style={{ backgroundImage: 'radial-gradient(#629432 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />

        <main className="p-12 md:p-16 lg:p-20 flex-1 relative z-10 w-full max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
             <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
             >
                <Outlet />
             </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-20 py-10 border-t-8 border-accent/5 flex justify-between items-center text-[10px] font-heading font-black uppercase tracking-[0.4em] text-stone/20">
            <span className="flex items-center gap-3"><Sprout size={14} className="text-accent" /> Ekomart Harvest Command v3.1 — Tactical Operations</span>
            <span>Uplink Secure: {new Date().toLocaleTimeString()} (NODE-01)</span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;

