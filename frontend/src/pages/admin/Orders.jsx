// src/pages/admin/Orders.jsx – Ekomart Harvest Fulfillment
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronRight, ChevronLeft, ShoppingBag, ExternalLink, 
  CheckCircle2, Clock, Truck, XCircle, Package, Eye, MoreVertical, Leaf, ShieldCheck, Sprout, ShoppingBasket
} from 'lucide-react';
import { orderApi } from '../../services/api';

const statusConfigs = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-200' },
  processing: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20' },
  shipped: { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-200' },
  delivered: { bg: 'bg-primary/5', text: 'text-primary', border: 'border-primary/20' },
  cancelled: { bg: 'bg-berry/5', text: 'text-berry', border: 'border-berry/10' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.listAdmin();
      if (res.success) setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await orderApi.updateStatus(id, status);
      if (res.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) setSelectedOrder({...selectedOrder, status});
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-8 border-primary pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-1 h-px bg-accent rounded-full" />
             <span className="text-[10px] font-heading font-black text-accent uppercase tracking-[0.4em]">Fulfillment Protocol</span>
          </div>
          <h1 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Harvest <span className="text-accent underline decoration-accent-light/30">Fulfillment</span></h1>
          <p className="text-stone/30 font-heading font-black uppercase tracking-[0.3em] text-[10px] mt-4">Mission control for produce distribution</p>
        </div>
        <div className="flex gap-4">
            <button onClick={fetchOrders} className="px-12 py-6 bg-white border-4 border-stone-50 rounded-full font-heading font-black uppercase tracking-[0.3em] text-[10px] text-stone-200 hover:border-accent hover:text-accent transition-all cursor-pointer shadow-xl active:scale-95">
                Refresh Protocol
            </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Total Harvests', value: orders.length, color: 'text-primary', icon: Package },
            { label: 'Pending Queue', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-600', icon: Clock },
            { label: 'Active Transit', value: orders.filter(o => o.status === 'shipped' || o.status === 'processing').length, color: 'text-sky-600', icon: Truck },
            { label: 'Deliveries', value: orders.filter(o => o.status === 'delivered').length, color: 'text-accent', icon: ShoppingBasket },
          ].map((s, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border-4 border-stone-50 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 text-accent/5 group-hover:text-accent/20 transition-all scale-150 duration-700"><s.icon size={64} strokeWidth={1} /></div>
                 <p className="text-[10px] font-heading font-black uppercase tracking-[0.4em] text-stone/20 mb-4 relative z-10">{s.label}</p>
                 <h3 className={`text-6xl font-heading font-black tracking-tighter relative z-10 ${s.color}`}>{s.value}</h3>
            </div>
          ))}
      </div>

      {/* Main Logistics Grid */}
      <div className="bg-white rounded-[4rem] border-8 border-stone-50 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-10 border-b border-stone-50 flex flex-col md:flex-row gap-8 items-center bg-stone-50/20">
            <div className="relative flex-1 group w-full">
                <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" />
                <input type="text" placeholder="Scan orders by ID, Collective Identity, or Status Code..." 
                    className="w-full bg-white border-4 border-stone-50 focus:border-accent/30 outline-none rounded-[2rem] py-6 pl-20 pr-8 font-heading font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-stone-100/30"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-[2rem] font-heading font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent transition-all border-none cursor-pointer shadow-2xl active:scale-95">
                <Filter size={18} /> Filter Hub
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-primary text-white">
                        <th className="px-12 py-8 text-[10px] font-heading font-black uppercase tracking-[0.3em]">Harvest ID</th>
                        <th className="px-12 py-8 text-[10px] font-heading font-black uppercase tracking-[0.3em]">Identity Profile</th>
                        <th className="px-12 py-8 text-[10px] font-heading font-black uppercase tracking-[0.3em]">Harvest Date</th>
                        <th className="px-12 py-8 text-[10px] font-heading font-black uppercase tracking-[0.3em]">Valuation</th>
                        <th className="px-12 py-8 text-[10px] font-heading font-black uppercase tracking-[0.3em]">Fulfillment Protocol</th>
                        <th className="px-12 py-8 text-[10px] font-heading font-black uppercase tracking-[0.3em] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y-4 divide-stone-50">
                    {loading ? (
                         [1,2,3,4,5].map(i => <tr key={i} className="animate-pulse"><td colSpan="6" className="py-16 px-12 text-center text-stone-200 uppercase font-black text-[10px] tracking-widest">Scanning Network Layer...</td></tr>)
                    ) : orders.map(order => (
                        <tr key={order.id} className="group hover:bg-stone-50/50 transition-all duration-500">
                            <td className="px-12 py-10">
                                <span className="font-heading font-black text-sm uppercase tracking-tight text-primary group-hover:text-accent transition-colors">EKM-{order.id.slice(0,10).toUpperCase()}</span>
                            </td>
                            <td className="px-12 py-10">
                                <div className="flex flex-col max-w-[200px]">
                                    <span className="font-heading font-black text-base uppercase truncate text-primary">{order.profiles?.name || 'GUEST IDENTITY'}</span>
                                    <span className="text-[10px] text-stone/20 font-heading font-black uppercase tracking-widest mt-1 truncate">{order.profiles?.email}</span>
                                </div>
                            </td>
                            <td className="px-12 py-10">
                                <span className="text-[11px] font-heading font-black uppercase tracking-widest text-stone/30">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </span>
                            </td>
                            <td className="px-12 py-10 font-heading font-black text-base text-primary">
                                ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="px-12 py-10">
                                <select 
                                    className={`px-6 py-3 rounded-full border-4 text-[10px] font-heading font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${statusConfigs[order.status]?.bg} ${statusConfigs[order.status]?.text} ${statusConfigs[order.status]?.border}`}
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                >
                                    <option value="pending">PENDING</option>
                                    <option value="processing">PRODUCE PACKED</option>
                                    <option value="shipped">IN TRANSIT</option>
                                    <option value="delivered">DELIVERED</option>
                                    <option value="cancelled">CANCELLED</option>
                                </select>
                            </td>
                            <td className="px-12 py-10 text-right">
                                <button className="w-16 h-16 flex items-center justify-center bg-stone-50 hover:bg-accent hover:text-white rounded-[2rem] transition-all border-none cursor-pointer text-stone-200 shadow-xl active:scale-90 duration-500"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <Eye size={22} strokeWidth={3} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Details Slide-Over */}
      <AnimatePresence>
        {selectedOrder && (
            <div className="fixed inset-0 z-[200] flex items-center justify-end p-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-primary/60 backdrop-blur-xl" onClick={() => setSelectedOrder(null)} />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                    className="relative w-full max-w-4xl h-screen bg-white shadow-2xl overflow-y-auto border-l-[12px] border-accent"
                >
                    <div className="p-16 md:p-24">
                    <div className="flex justify-between items-start mb-20">
                        <div>
                            <span className="text-[10px] font-heading font-black uppercase tracking-[0.4em] text-accent mb-4 block">Harvest Analysis</span>
                            <h2 className="text-7xl font-heading font-black tracking-tighter uppercase m-0 leading-none text-primary">#{selectedOrder.id.slice(0,10).toUpperCase()}</h2>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="w-20 h-20 bg-stone-50 hover:bg-berry/10 hover:text-berry rounded-full flex items-center justify-center transition-all border-none cursor-pointer shadow-xl active:scale-90">
                            <XCircle size={40} strokeWidth={1} />
                        </button>
                    </div>

                    <div className="space-y-20">
                        <section className="bg-stone-50/50 p-12 rounded-[4rem] border-8 border-stone-50 flex items-center gap-12 relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                               <ShieldCheck size={200} />
                            </div>
                            <div className="w-24 h-24 bg-accent rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-700">
                                <span className="text-5xl font-heading font-black uppercase">{(selectedOrder.profiles?.name || 'G')[0]}</span>
                            </div>
                            <div className="relative z-10">
                                <p className="font-heading font-black uppercase text-4xl tracking-tighter text-primary">{selectedOrder.profiles?.name || 'GUEST IDENTITY'}</p>
                                <p className="text-[11px] font-heading font-black uppercase tracking-[0.3em] text-accent mt-2">{selectedOrder.profiles?.email}</p>
                            </div>
                        </section>

                        <div className="grid grid-cols-2 gap-16">
                            <section>
                                <h4 className="text-[11px] font-heading font-black uppercase tracking-[0.4em] text-stone/20 mb-8 pb-4 border-b-4 border-stone-50">Logistics Protocol</h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-[10px] uppercase font-heading font-black">
                                        <span className="text-stone/20">Method</span>
                                        <span className="text-primary flex items-center gap-3 px-5 py-2 bg-stone-50 rounded-xl"><Truck size={16} className="text-accent" /> Fresh Priority</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] uppercase font-heading font-black">
                                        <span className="text-stone/20">Quality Check</span>
                                        <span className="text-accent flex items-center gap-3 bg-accent/5 px-5 py-2 rounded-xl border border-accent/10"><ShieldCheck size={16} strokeWidth={3}/> Certified</span>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h4 className="text-[11px] font-heading font-black uppercase tracking-[0.4em] text-stone/20 mb-8 pb-4 border-b-4 border-stone-50">Transaction Node</h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-[10px] uppercase font-heading font-black">
                                         <span className="text-stone/20">Gateway</span>
                                         <span className="text-primary px-5 py-2 bg-stone-50 rounded-xl">{selectedOrder.payment_method?.toUpperCase() || 'CRYPTO/WASH'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] uppercase font-heading font-black">
                                         <span className="text-stone/20">Pay Status</span>
                                         <span className="text-accent bg-accent/5 px-5 py-2 rounded-xl border border-accent/10">Settled</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section>
                            <h4 className="text-[11px] font-heading font-black uppercase tracking-[0.4em] text-stone/20 mb-10 pb-4 border-b-4 border-stone-50">Produce Manifest</h4>
                            <div className="bg-stone-50/30 rounded-[3rem] p-6 text-center border-4 border-dashed border-stone-100">
                                <div className="py-20 flex flex-col items-center">
                                    <ShoppingBasket size={64} strokeWidth={1} className="text-stone-100 mb-6 animate-bounce" />
                                    <p className="text-[11px] font-heading font-black text-stone/20 uppercase tracking-[0.4em]">Expanding DNA manifest for batch details</p>
                                </div>
                            </div>
                        </section>

                        <section className="pt-16 border-t-[8px] border-primary flex flex-col md:flex-row justify-between items-center gap-12">
                             <div className="flex gap-6 w-full md:w-auto">
                                 <button onClick={() => window.print()} className="flex-1 md:flex-none px-12 py-6 bg-primary text-white rounded-full font-heading font-black uppercase tracking-[0.3em] text-[11px] hover:bg-accent transition-all shadow-2xl active:scale-95">Secure Invoice</button>
                                 <button className="flex-1 md:flex-none px-12 py-6 border-4 border-berry/10 text-berry rounded-full font-heading font-black uppercase tracking-[0.3em] text-[11px] hover:bg-berry hover:text-white hover:border-berry transition-all shadow-xl active:scale-95">Halt Harvest</button>
                             </div>
                             <div className="text-right w-full md:w-auto">
                                <p className="text-[11px] font-heading font-black uppercase text-stone/20 mb-2 tracking-widest">Final Valuation</p>
                                <h2 className="text-7xl font-heading font-black text-primary leading-none">₹{selectedOrder.total_amount.toLocaleString('en-IN')}</h2>
                             </div>
                        </section>
                    </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

