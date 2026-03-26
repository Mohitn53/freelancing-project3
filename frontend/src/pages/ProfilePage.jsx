// src/pages/ProfilePage.jsx – Grocery Revamp
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight, Plus, Check, Edit2, Trash2, ShoppingBasket, ShieldCheck, Leaf, ShoppingBag, ShieldAlert, History, Sparkles } from 'lucide-react';
import { profileApi, orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const TABS = [
  { id: 'profile', label: 'Identity', icon: User },
  { id: 'orders', label: 'History', icon: History },
  { id: 'addresses', label: 'Logistics', icon: MapPin },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const StatusBadge = ({ status }) => {
  const configs = { 
    Delivered: { bg: 'bg-accent/10', text: 'text-accent', icon: Check }, 
    'In Transit': { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Package }, 
    Pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: Sparkles }, 
    Cancelled: { bg: 'bg-berry/10', text: 'text-berry', icon: ShieldAlert } 
  };
  const config = configs[status] || { bg: 'bg-stone/10', text: 'text-stone', icon: ShieldCheck };
  const Icon = config.icon;
  return (
    <span className={`text-[9px] font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border border-current/20 ${config.bg} ${config.text}`}>
       <Icon size={10} strokeWidth={4} /> {status}
    </span>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ full_name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', is_default: false });
  const [newPayment, setNewPayment] = useState({ brand: 'Visa', last4: '', exp_month: '', exp_year: '', is_default: false });
  const [loading, setLoading] = useState(true);

  const { token, handleLogout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, ordRes, addrRes, payRes] = await Promise.all([
          profileApi.get(),
          profileApi.orders(),
          profileApi.addresses(),
          profileApi.paymentMethods()
        ]);

        if (profRes.success) setProfile(profRes.data);
        if (ordRes.success) setOrders(ordRes.data || []);
        if (addrRes.success) setAddresses(addrRes.data || []);
        if (payRes.success) setPayments(payRes.data || []);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, authLoading, navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await profileApi.update({ name: profile.name, phone: profile.phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Confirm order cancellation?')) return;
    try {
      const res = await orderApi.cancel(orderId);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    } catch (err) {
      console.error('Cancel order failed:', err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Erase this logistics point?')) return;
    try {
      await profileApi.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) { console.error('Delete failed:', err); }
  };

  const handleAddPayment = async () => {
    if (!newPayment.last4 || !newPayment.exp_month || !newPayment.exp_year) {
        alert('All gear fields required for initialization');
        return;
    }
    try {
      const res = await profileApi.addPaymentMethod(newPayment);
      if (res.success) {
        setPayments(prev => [...prev.filter(p => !newPayment.is_default || !p.is_default), res.data]);
        setShowPaymentForm(false);
        setNewPayment({ brand: 'Visa', last4: '', exp_month: '', exp_year: '', is_default: false });
      }
    } catch (err) { console.error('Add payment failed:', err); }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm('Deactivate this financial chip?')) return;
    try {
      await profileApi.deletePaymentMethod(id);
      setPayments(prev => prev.filter(p => p.id !== id));
    } catch (err) { console.error('Delete failed:', err); }
  };

  const handleAddAddress = async () => {
    try {
      const res = await profileApi.addAddress(newAddress);
      if (res.success) {
        setAddresses(prev => [...prev, res.data]);
        setShowAddressForm(false);
        setNewAddress({ full_name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', is_default: false });
      }
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  if (loading || authLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center font-heading font-black uppercase tracking-widest text-[#00C896]/30 animate-pulse">Syncing Dashboard...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">
      
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar Nav Dashboard */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-32">
          <div className="bg-primary rounded-[50px] p-10 overflow-hidden relative group border-b-8 border-accent shadow-2xl">
             <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-accent/30 transition-all duration-1000" />
             
             <div className="flex flex-col items-center pb-10 border-b border-white/10 mb-10 relative z-10">
                <div className="w-28 h-28 bg-accent text-white rounded-[40px] rotate-12 flex items-center justify-center text-4xl font-heading font-black mb-8 shadow-2xl transition-transform group-hover:rotate-0">
                  {initials}
                </div>
                <h3 className="font-heading font-black text-2xl tracking-tighter uppercase text-white mb-3 text-center">{profile?.name || 'Customer'}</h3>
                <p className="font-heading font-black text-[11px] text-accent uppercase tracking-[0.3em]">Tier: Green Member</p>
             </div>

             <nav className="flex flex-col gap-4 relative z-10">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-5 px-8 py-5 rounded-2xl text-[11px] font-heading font-black uppercase tracking-widest transition-all text-left border-2
                        ${isActive
                          ? 'bg-white text-primary border-white shadow-2xl translate-x-2'
                          : 'text-white/40 border-white/5 hover:border-white/20 hover:text-white hover:translate-x-2'
                        }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-accent' : ''} />
                      {tab.label}
                      {isActive && <Sparkles size={16} fill="currentColor" className="ml-auto text-accent" />}
                    </button>
                  );
                })}
                <button 
                  onClick={() => { handleLogout(); navigate('/'); }}
                  className="flex items-center gap-5 px-8 py-5 rounded-2xl text-[11px] font-heading font-black uppercase tracking-widest text-berry/60 border-2 border-transparent hover:bg-berry/10 hover:text-berry transition-all text-left mt-10 active:scale-95"
                >
                  <LogOut size={20} /> Terminate Session
                </button>
             </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* ─── Profile Details ─── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end gap-5 mb-16">
                   <h2 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Customer <span className="text-accent">Profile</span></h2>
                   <div className="h-2 flex-1 bg-accent-light/20 mb-3 rounded-full hidden md:block" />
                </div>

                <div className="bg-white border-2 border-white rounded-[60px] p-10 md:p-16 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 relative z-10">
                    <div className="flex flex-col gap-4">
                      <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone pl-2">Full Name</label>
                      <input type="text" value={profile?.name || ''}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-3xl px-8 py-5 font-heading font-black uppercase text-sm outline-none transition-all shadow-inner text-primary" />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone pl-2">Mobile Number</label>
                      <input type="tel" value={profile?.phone || ''}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 MOBILE"
                        className="bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-3xl px-8 py-5 font-heading font-black uppercase text-sm outline-none transition-all shadow-inner placeholder:text-stone/30 text-primary" />
                    </div>
                    <div className="flex flex-col gap-4 md:col-span-2">
                       <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone pl-2">Email Address</label>
                       <input type="email" value={profile?.email || ''} disabled
                        className="bg-stone/5 border-2 border-transparent rounded-3xl px-8 py-5 font-heading font-black uppercase text-sm text-stone/40 cursor-not-allowed" />
                       <div className="flex items-center gap-3 mt-1 px-2">
                          <ShieldCheck size={14} className="text-accent" />
                          <p className="text-[10px] text-stone font-heading font-black uppercase tracking-widest">Ekomart Verified Security Protocol Active</p>
                       </div>
                    </div>
                  </div>
                  
                  <button onClick={handleSaveProfile} disabled={saving}
                    className={`flex items-center gap-4 px-14 py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl active:scale-95 group
                      ${saved ? 'bg-accent text-white' : 'bg-primary text-white hover:bg-accent'}`}>
                    {saved ? <><Check size={20} className="group-hover:rotate-12 transition-transform" strokeWidth={4} /> Profile Saved</> : saving ? 'Transmitting...' : 'Commit Changes'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── Orders History ─── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end gap-5 mb-16">
                   <h2 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Harvest <span className="text-accent">Log</span></h2>
                   <div className="h-2 flex-1 bg-accent-light/20 mb-3 rounded-full hidden md:block" />
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-40 bg-white rounded-[60px] border-4 border-dashed border-accent-light/30 flex flex-col items-center shadow-inner">
                    <ShoppingBasket size={80} strokeWidth={1.5} className="mb-8 text-accent/20" />
                    <p className="font-heading font-black uppercase tracking-[0.3em] text-sm text-stone/40">Your harvest history is currently empty</p>
                    <Link to="/products" className="mt-12 bg-accent text-white px-10 py-5 rounded-full font-heading font-black text-xs uppercase shadow-xl hover:scale-110 transition-all">Start Harvesting</Link>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white border-4 border-white rounded-[48px] p-10 hover:border-accent/10 transition-all shadow-xl group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-10 pb-10 border-b border-accent/5">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-accent-light/10 rounded-2xl flex items-center justify-center text-accent shadow-inner">
                                 <Package size={28} />
                              </div>
                              <div>
                                 <p className="font-heading font-black text-lg uppercase tracking-tight text-primary">Order #{order.id.slice(-8).toUpperCase()}</p>
                                 <p className="text-[11px] text-stone font-heading font-black uppercase tracking-widest mt-1">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-10">
                              <div className="text-right">
                                 <p className="text-[10px] text-stone font-heading font-black uppercase tracking-widest mb-1 opacity-50">Grand Total</p>
                                 <p className="font-heading font-black text-3xl text-primary">{fmt(order.total_amount || 0)}</p>
                              </div>
                              <StatusBadge status={order.status} />
                           </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-6 mb-4">
                           {order.order_items?.map((it, i) => (
                             <div key={i} className="flex items-center gap-5 bg-accent-light/5 border-2 border-transparent p-4 rounded-3xl group-hover:border-accent/10 transition-all shadow-sm">
                                <img src={it.products?.image_url} className="w-16 h-16 object-cover rounded-2xl shadow-md" alt="" />
                                <div className="pr-6">
                                   <p className="font-heading font-black text-[11px] uppercase truncate max-w-[150px] text-primary">{it.products?.name}</p>
                                   <p className="text-[10px] font-heading font-black text-accent uppercase tracking-widest mt-1.5 bg-accent/10 px-3 py-1 rounded-full display-block">EK {it.size || '?'} • QTY {it.quantity}</p>
                                </div>
                             </div>
                           ))}
                        </div>

                        {['pending', 'processing'].includes(order.status?.toLowerCase()) && (
                          <div className="flex justify-end pt-8">
                             <button onClick={() => handleCancelOrder(order.id)} className="text-[11px] font-heading font-black uppercase tracking-widest text-berry/40 hover:text-berry hover:scale-110 transition-all border-b-2 border-transparent hover:border-berry">Abort Harvest</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Logistics (Addresses) ─── */}
            {activeTab === 'addresses' && (
              <motion.div key="addresses" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end justify-between mb-16 gap-5">
                   <h2 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Delivery <span className="text-accent">Hub</span></h2>
                   <button onClick={() => setShowAddressForm(true)} className="w-16 h-16 bg-accent text-white flex items-center justify-center rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all">
                      <Plus size={28} strokeWidth={3} />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {addresses.map(addr => (
                     <div key={addr.id} className={`bg-white border-4 rounded-[48px] p-10 relative shadow-xl transition-all group ${addr.is_default ? 'border-accent shadow-accent/10' : 'border-white hover:border-accent/10'}`}>
                        <div className="flex items-start justify-between mb-8">
                           <div className="w-14 h-14 bg-accent-light/10 group-hover:bg-accent rounded-2xl flex items-center justify-center text-accent group-hover:text-white transition-all shadow-inner">
                              <MapPin size={24} />
                           </div>
                           {addr.is_default && <span className="text-[10px] font-heading font-black bg-accent text-white px-4 py-1.5 rounded-full uppercase shadow-lg tracking-widest">Primary</span>}
                        </div>
                        <h4 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4 text-primary">{addr.full_name}</h4>
                        <p className="text-sm font-bold text-stone/60 leading-relaxed mb-12">{addr.line1}, {addr.line2 && addr.line2 + ','} {addr.city}, {addr.state} [{addr.pincode}]</p>
                        <div className="flex items-center justify-between pt-8 border-t border-accent/5">
                           <div className="text-[11px] font-heading font-black uppercase text-stone/30 tracking-widest">{addr.phone}</div>
                           <div className="flex gap-6">
                              <button className="text-[11px] font-heading font-black text-accent uppercase hover:scale-110 transition-transform">Edit</button>
                              <button onClick={() => handleDeleteAddress(addr.id)} className="text-[11px] font-heading font-black text-berry/40 uppercase hover:text-berry hover:scale-110 transition-all">Purge</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                {showAddressForm && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-16 bg-white p-12 rounded-[60px] border-4 border-dashed border-accent-light/30 shadow-2xl">
                     <h3 className="font-heading font-black text-3xl uppercase mb-12 text-primary">Register Logistics Point</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {['full_name', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'].map(f => (
                           <div key={f} className={`flex flex-col gap-3 ${f === 'line1' || f === 'line2' ? 'md:col-span-2' : ''}`}>
                             <label className="text-[11px] font-heading font-black uppercase tracking-widest text-stone/50 pl-2">{f.replace('_', ' ')}</label>
                             <input type="text" value={newAddress[f]} onChange={e => setNewAddress(p => ({ ...p, [f]: e.target.value }))} className="bg-accent-light/10 border-2 border-transparent focus:border-accent/30 rounded-3xl px-8 py-5 font-heading font-black text-sm uppercase outline-none transition-all shadow-inner text-primary" />
                           </div>
                        ))}
                     </div>
                     <div className="flex gap-8 mt-16 relative z-10">
                        <button onClick={handleAddAddress} className="bg-primary text-white px-12 py-6 rounded-full font-heading font-black uppercase text-xs tracking-[0.2em] hover:bg-accent transition-all shadow-2xl hover:scale-105 active:scale-95">Commit Address</button>
                        <button onClick={() => setShowAddressForm(false)} className="text-stone/40 font-heading font-black text-xs uppercase tracking-widest hover:text-berry transition-colors">Discard Entry</button>
                     </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ─── Vault (Payments) ─── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-end gap-5 mb-16">
                   <h2 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Safe <span className="text-accent">Vault</span></h2>
                   <div className="h-2 flex-1 bg-accent-light/20 mb-3 rounded-full hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {payments.map(pm => (
                      <div key={pm.id} className={`bg-primary rounded-[40px] p-10 relative overflow-hidden group border-b-8 shadow-2xl ${pm.is_default ? 'border-accent' : 'border-white/5'}`}>
                         <div className="absolute top-0 right-0 p-6 text-accent/10 group-hover:text-accent/30 transition-colors flex gap-4">
                            <button onClick={() => handleDeletePayment(pm.id)} className="bg-berry/20 p-3 rounded-2xl hover:bg-berry hover:text-white transition-all border-none cursor-pointer text-berry">
                                <Trash2 size={20} />
                            </button>
                            <CreditCard size={64} strokeWidth={1} />
                         </div>
                         <div className="relative z-10">
                            <p className="text-white/30 font-heading font-black text-[12px] uppercase tracking-[0.3em] mb-10">{pm.brand} CHIP TOKEN</p>
                            <p className="text-white font-heading font-black text-2xl tracking-[0.4em] mb-12 drop-shadow-lg">•••• •••• •••• {pm.last4}</p>
                            <div className="flex justify-between items-end">
                               <div>
                                  <p className="text-white/20 text-[9px] uppercase font-heading font-black tracking-widest mb-2">Exp. Harvest</p>
                                  <p className="text-white font-heading font-black text-sm tracking-[0.2em]">{pm.exp_month}/{pm.exp_year}</p>
                               </div>
                               {pm.is_default && <span className="text-[10px] font-heading font-black bg-accent text-white px-5 py-2 rounded-full uppercase shadow-lg border border-accent/20">Active Node</span>}
                            </div>
                         </div>
                      </div>
                    ))}
                    
                    {!showPaymentForm && (
                        <button onClick={() => setShowPaymentForm(true)} className="border-4 border-dashed border-accent-light/30 rounded-[40px] p-10 flex flex-col items-center justify-center gap-6 text-stone/20 hover:border-accent hover:text-accent transition-all group cursor-pointer bg-white shadow-sm hover:shadow-xl">
                            <div className="w-20 h-20 bg-accent-light/5 rounded-[32px] flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                                <Plus size={40} />
                            </div>
                            <span className="font-heading font-black text-sm uppercase tracking-[0.2em]">Add Payment Token</span>
                        </button>
                    )}

                    {showPaymentForm && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 md:col-span-2 bg-white p-12 rounded-[60px] border-4 border-accent shadow-2xl relative overflow-hidden">
                             <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
                             <h3 className="font-heading font-black text-xs uppercase tracking-[0.3em] text-accent mb-10 relative z-10">Initialize Secure Harvest Token</h3>
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-heading font-black uppercase text-stone/50 pl-2">Issuer</label>
                                    <select value={newPayment.brand} onChange={e => setNewPayment({...newPayment, brand: e.target.value})} className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 outline-none px-6 py-5 rounded-2xl font-heading font-black uppercase text-sm text-primary shadow-inner">
                                        <option>Visa</option><option>Mastercard</option><option>Amex</option><option>Rupay</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-heading font-black uppercase text-stone/50 pl-2">Last 4</label>
                                    <input type="text" maxLength="4" placeholder="0000" value={newPayment.last4} onChange={e => setNewPayment({...newPayment, last4: e.target.value.replace(/\D/g,'')})} className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 outline-none px-6 py-5 rounded-2xl font-heading font-black uppercase text-sm text-primary shadow-inner" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-heading font-black uppercase text-stone/50 pl-2">Month</label>
                                    <input type="text" maxLength="2" placeholder="MM" value={newPayment.exp_month} onChange={e => setNewPayment({...newPayment, exp_month: e.target.value.replace(/\D/g,'')})} className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 outline-none px-6 py-5 rounded-2xl font-heading font-black uppercase text-sm text-primary shadow-inner" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-heading font-black uppercase text-stone/50 pl-2">Year</label>
                                    <input type="text" maxLength="4" placeholder="YYYY" value={newPayment.exp_year} onChange={e => setNewPayment({...newPayment, exp_year: e.target.value.replace(/\D/g,'')})} className="w-full bg-accent-light/10 border-2 border-transparent focus:border-accent/30 outline-none px-6 py-5 rounded-2xl font-heading font-black uppercase text-sm text-primary shadow-inner" />
                                </div>
                             </div>
                             <div className="flex gap-8 mt-16 relative z-10">
                                <button onClick={handleAddPayment} className="bg-accent text-white px-12 py-6 rounded-full font-heading font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl">Authorize Vault</button>
                                <button onClick={() => setShowPaymentForm(false)} className="text-stone/30 font-heading font-black text-xs uppercase tracking-widest hover:text-berry">Cancel</button>
                             </div>
                        </motion.div>
                    )}
                </div>
                
                <div className="mt-20 bg-berry/5 border-2 border-berry/10 p-10 rounded-[40px] flex gap-6 items-start shadow-inner">
                   <ShieldAlert size={28} className="text-berry shrink-0" />
                   <div>
                      <h5 className="font-heading font-black text-sm uppercase text-berry mb-2 tracking-widest">Security Notice</h5>
                      <p className="text-[12px] text-berry/60 font-bold leading-relaxed">Financial data is never stored on Ekomart local nodes. All payment tokens are processed via encrypted PCI-DSS compliant harvest pipelines.</p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default ProfilePage;

