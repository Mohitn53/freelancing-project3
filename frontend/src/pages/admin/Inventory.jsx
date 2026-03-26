// src/pages/admin/Inventory.jsx – Ekomart Stock Vault
import React, { useState, useEffect } from 'react';
import { 
  Box, Search, AlertTriangle, ArrowUp, ArrowDown, History, RotateCcw, Package, 
  CheckCircle, AlertCircle, Leaf, ShieldCheck, Sprout, ShoppingBasket
} from 'lucide-react';
import { productsApi } from '../../services/api';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(1);
      if (res.success) setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const lowStock = items.filter(i => i.stock < 10 && i.stock > 0);
  const outOfStock = items.filter(i => i.stock === 0);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b-8 border-primary pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-1 h-px bg-accent rounded-full" />
             <span className="text-[10px] font-heading font-black text-accent uppercase tracking-[0.4em]">Stock Architecture</span>
          </div>
          <h1 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Stock <span className="text-accent underline decoration-accent-light/30">Vault</span></h1>
          <p className="text-stone/30 font-heading font-black uppercase tracking-[0.3em] text-[10px] mt-4">Advanced produce levels & movement management</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-4 px-12 py-6 bg-white border-4 border-stone-50 rounded-full font-heading font-black uppercase tracking-[0.3em] text-[10px] text-stone-200 hover:border-accent hover:text-accent transition-all cursor-pointer shadow-xl active:scale-95 duration-500">
                <History size={18} strokeWidth={3} /> Movement Log
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'Depleted Harvest', value: outOfStock.length, bg: 'bg-berry/5', text: 'text-berry', border: 'border-berry/10', icon: AlertCircle, sub: 'Immediate restocking required' },
            { label: 'Critical Supply', value: lowStock.length, bg: 'bg-amber-500/5', text: 'text-amber-600', border: 'border-amber-200/20', icon: AlertTriangle, sub: 'Critical units below threshold' },
            { label: 'Optimal Growth', value: items.length - lowStock.length - outOfStock.length, bg: 'bg-primary/5', text: 'text-accent', border: 'border-accent/10', icon: ShieldCheck, sub: 'Optimized logistics status' }
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-12 rounded-[4rem] border-4 ${s.border} relative overflow-hidden group shadow-2xl flex flex-col justify-between h-72 transition-all duration-700 hover:-translate-y-2`}>
                 <div className="absolute top-[-40px] right-[-40px] p-6 text-current opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000 scale-150 rotate-12"><s.icon size={180} strokeWidth={1} /></div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-heading font-black uppercase tracking-[0.4em] mb-4 opacity-50">{s.label}</p>
                    <h3 className={`text-7xl font-heading font-black tracking-tighter leading-none ${s.text}`}>{s.value}</h3>
                 </div>
                 <p className={`text-[11px] font-heading font-black mt-12 relative z-10 uppercase tracking-[0.3em] truncate ${s.text} opacity-30`}>{s.sub}</p>
            </div>
          ))}
      </div>

      <div className="bg-white rounded-[4rem] border-8 border-stone-50 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-10 border-b border-stone-50 flex flex-col md:flex-row gap-8 items-center bg-stone-50/20">
              <h3 className="font-heading font-black text-3xl tracking-tighter uppercase m-0 text-primary">Produce <span className="text-accent underline decoration-accent-light/30">Manifest</span></h3>
              <div className="flex bg-stone-50 p-2 rounded-[2rem] border-4 border-stone-100 ml-auto scale-95 md:scale-100">
                  <button className="px-10 py-4 bg-white text-primary rounded-[1.5rem] shadow-xl text-[10px] font-heading font-black uppercase border-none cursor-pointer active:scale-95 transition-all">Global Feed</button>
                  <button className="px-10 py-4 text-stone-200 hover:text-accent transition-all rounded-[1.5rem] font-heading font-black uppercase text-[10px] border-none bg-none cursor-pointer active:scale-95">Deficit Only</button>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-primary text-white">
                          <th className="px-12 py-8 text-[11px] font-heading font-black uppercase tracking-[0.3em]">Produce Batch</th>
                          <th className="px-12 py-8 text-[11px] font-heading font-black uppercase tracking-[0.3em]">DNA Tag</th>
                          <th className="px-12 py-8 text-[11px] font-heading font-black uppercase tracking-[0.3em]">Vault Status</th>
                          <th className="px-12 py-8 text-[11px] font-heading font-black uppercase tracking-[0.3em] text-center">Consumption</th>
                          <th className="px-12 py-8 text-[11px] font-heading font-black uppercase tracking-[0.3em]">Supply Band</th>
                          <th className="px-12 py-8 text-[11px] font-heading font-black uppercase tracking-[0.3em] text-right">Replenish Vault</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y-4 divide-stone-50">
                      {loading ? (
                         <tr><td colSpan="6" className="py-32 text-center text-stone-200 animate-pulse font-heading font-black uppercase tracking-[0.4em] text-lg">Scanning perimeter network...</td></tr>
                      ) : items.length === 0 ? (
                        <tr><td colSpan="6" className="py-32 text-center"><ShoppingBasket size={100} strokeWidth={1} className="text-stone-100 mx-auto" /></td></tr>
                      ) : (
                        items.map(item => (
                            <tr key={item.id} className="group hover:bg-stone-50/50 transition-all duration-500">
                                <td className="px-12 py-10">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 bg-stone-100 rounded-[2.5rem] overflow-hidden shrink-0 border-4 border-white group-hover:rotate-6 shadow-xl transition-all duration-700">
                                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-heading font-black text-base uppercase tracking-tight text-primary group-hover:text-accent transition-colors duration-500">{item.name}</p>
                                            <p className="text-[11px] text-stone/20 font-heading font-black uppercase tracking-widest mt-1">{item.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <span className="text-[11px] font-heading font-black uppercase text-stone/20 tracking-widest truncate max-w-[100px] block">#{item.id.slice(0,10)}</span>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="flex items-end gap-3">
                                        <span className={`text-4xl font-heading font-black leading-none ${item.stock < 10 ? 'text-berry' : 'text-primary'}`}>{item.stock}</span>
                                        <span className="text-[11px] font-heading font-black text-stone/20 uppercase tracking-widest pb-1">Units</span>
                                    </div>
                                </td>
                                <td className="px-12 py-10 text-center text-berry">
                                    <div className="inline-flex items-center gap-3 bg-berry/5 px-6 py-2 rounded-full border border-berry/10 shadow-inner">
                                        <ArrowDown size={16} strokeWidth={3} className="animate-bounce" />
                                        <span className="text-[10px] font-heading font-black uppercase tracking-widest">High Vol</span>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="w-48 bg-stone-50 h-3 rounded-full overflow-hidden shadow-inner border-2 border-white">
                                        <div className={`h-full transition-all duration-1000 ${item.stock < 10 ? 'bg-berry shadow-[0_0_12px_rgba(255,107,107,0.5)]' : 'bg-accent shadow-[0_0_12px_rgba(98,148,50,0.5)]'}`} style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-12 py-10 text-right">
                                    <button className="px-10 py-5 bg-white border-4 border-primary text-primary hover:bg-accent hover:border-accent hover:text-white rounded-full font-heading font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-2xl active:scale-95 cursor-pointer duration-500">
                                        RESTOCK VAULT
                                    </button>
                                </td>
                            </tr>
                        ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default AdminInventory;

