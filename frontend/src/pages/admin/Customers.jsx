// src/pages/admin/Customers.jsx – Ekomart Collective Roster
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Mail, Calendar, ChevronRight, Leaf, ShieldCheck, Sprout, Target 
} from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listUsers();
      if (res.success) setCustomers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b-8 border-primary pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-1 h-px bg-accent rounded-full" />
             <span className="text-[10px] font-heading font-black text-accent uppercase tracking-[0.4em]">Collective Directory</span>
          </div>
          <h1 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Collective <span className="text-accent">Roster</span></h1>
          <p className="text-stone/30 font-heading font-black uppercase tracking-[0.3em] text-[10px] mt-4">Community membership & profile architecture</p>
        </div>
        <div className="flex bg-primary text-white px-12 py-6 rounded-full border-4 border-accent/20 shadow-2xl items-center gap-8 relative overflow-hidden group">
           <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Leaf size={80} /></div>
           <div className="flex flex-col relative z-10">
              <p className="text-[10px] font-heading font-black uppercase tracking-[0.3em] leading-none m-0 text-accent">Active Garden</p>
              <p className="text-4xl font-heading font-black m-0 mt-3 leading-none flex items-center gap-4">{customers.length} <Users size={24} className="text-accent" /></p>
           </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border-8 border-stone-50 shadow-2xl overflow-hidden">
        <div className="relative group mb-16">
            <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" />
            <input type="text" placeholder="Scan roster by identity, email, or member ID..." 
                className="w-full bg-stone-50 border-4 border-transparent focus:border-accent/30 focus:bg-white outline-none rounded-[2rem] py-8 pl-20 pr-10 font-heading font-black uppercase text-xs tracking-widest transition-all shadow-inner"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
             [1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-stone-50 rounded-[3rem] animate-pulse"></div>)
          ) : filteredCustomers.length === 0 ? (
             <div className="col-span-full py-48 text-center bg-stone-50 rounded-[4rem] border-8 border-dashed border-stone-100">
                <Users size={80} strokeWidth={1} className="text-stone-100 mx-auto mb-10" />
                <p className="text-stone/20 font-heading font-black uppercase tracking-[0.5em] text-xs">No matching members in the collective node</p>
             </div>
          ) : (
            filteredCustomers.map((user) => (
              <div key={user.id} className="bg-white border-4 border-stone-50 rounded-[3.5rem] p-10 hover:border-accent/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-500">
                    <div className="w-12 h-12 bg-primary text-accent rounded-full flex items-center justify-center shadow-xl"><ShieldCheck size={24} /></div>
                </div>

                <div>
                  <div className="flex items-center gap-8 mb-10">
                    <div className="w-20 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center font-heading font-black text-3xl group-hover:bg-accent group-hover:text-white transition-colors duration-500 shadow-2xl group-hover:rotate-12">
                      {(user.name || user.email || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="font-heading font-black uppercase tracking-tighter text-2xl truncate m-0 text-primary group-hover:text-accent transition-colors duration-500">{user.name || 'Anonymous Member'}</h3>
                      <div className="flex items-center gap-3 mt-2">
                          <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-accent shadow-[0_0_10px_rgba(98,148,50,0.8)] animate-pulse' : 'bg-stone-200'}`}></span>
                          <p className="text-[10px] text-stone/20 font-heading font-black uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 mb-12">
                    <div className="flex items-center gap-4 text-stone/20 group-hover:text-primary transition-colors duration-500">
                      <Mail size={16} className="text-accent" />
                      <span className="text-[11px] font-heading font-black uppercase truncate tracking-tight">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone/20">
                      <Calendar size={16} className="text-accent" />
                      <span className="text-[11px] font-heading font-black uppercase tracking-tight">Rooted {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t-4 border-stone-50 flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-heading font-black uppercase tracking-widest text-stone/20 mb-2">Member Tier</span>
                      <span className="text-3xl font-heading font-black tracking-tighter text-primary">BASIC</span>
                   </div>
                   <button className="h-16 w-16 bg-stone-50 hover:bg-primary hover:text-accent rounded-2xl flex items-center justify-center transition-all border-none cursor-pointer shadow-xl active:scale-95 duration-500">
                      <ChevronRight size={24} strokeWidth={3} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;

