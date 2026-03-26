// src/pages/admin/Categories.jsx – Ekomart Taxonomy Manager
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Layers, X, Sprout, ShieldCheck, Leaf } from 'lucide-react';
import { categoryApi } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [catName, setCatName] = useState('');

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.list();
      if (res.success) setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCats(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editCat) await categoryApi.update(editCat.id, { name: catName });
      else await categoryApi.create({ name: catName });
      setShowModal(false);
      setCatName('');
      setEditCat(null);
      fetchCats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Purge this classification? All linked produce will lose their taxonomy tag.')) {
      try {
        await categoryApi.delete(id);
        fetchCats();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-6xl space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b-8 border-primary pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-1 h-px bg-accent rounded-full" />
             <span className="text-[10px] font-heading font-black text-accent uppercase tracking-[0.4em]">Taxonomy Node</span>
          </div>
          <h1 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Classification <span className="text-accent">Lab</span></h1>
          <p className="text-stone/30 font-heading font-black uppercase tracking-[0.3em] text-[10px] mt-4">Define and categorize organic produce collections</p>
        </div>
        <button 
          onClick={() => { setEditCat(null); setCatName(''); setShowModal(true); }}
          className="bg-accent text-white px-12 py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-primary transition-all flex items-center gap-4 group active:scale-95"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" /> New Taxonomy Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
             [1,2,3].map(i => <div key={i} className="h-56 bg-stone-50 rounded-[3rem] animate-pulse border-4 border-stone-100"></div>)
        ) : categories.length === 0 ? (
             <div className="col-span-full py-48 text-center bg-stone-50/50 rounded-[4rem] border-8 border-dashed border-stone-100">
                <Sprout size={80} strokeWidth={1} className="text-stone-100 mx-auto mb-10" />
                <p className="text-stone/20 font-heading font-black uppercase tracking-[0.5em] text-xs">Zero classifications detected in node</p>
             </div>
        ) : (
          categories.map((cat) => (
            <motion.div 
              key={cat.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-[3.5rem] border-4 border-stone-50 shadow-2xl flex flex-col justify-between group hover:border-accent/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-center gap-8 mb-10">
                <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-accent shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                  <Leaf size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-heading font-black uppercase tracking-tighter text-3xl text-primary group-hover:text-accent transition-colors duration-500">{cat.name}</h3>
                  <p className="text-[10px] text-stone/20 font-heading font-black uppercase tracking-widest mt-1">ID: {cat.id.slice(0,10)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-10 border-t-4 border-stone-50">
                <button 
                  onClick={() => { setEditCat(cat); setCatName(cat.name); setShowModal(true); }}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-stone-50 hover:bg-accent hover:text-white rounded-2xl transition-all text-stone-200 font-heading font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 duration-500 border-none cursor-pointer"
                >
                  <Edit2 size={16} /> Update Habitat
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-4 bg-stone-50 hover:bg-berry hover:text-white rounded-2xl transition-all text-stone-200 shadow-lg active:scale-95 duration-500 border-none cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-primary/80 backdrop-blur-xl" />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-lg bg-white rounded-[4rem] shadow-2xl overflow-hidden p-12 md:p-16 border-t-[12px] border-accent"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <Sprout size={40} className="text-accent" />
                  <h2 className="font-heading font-black text-4xl uppercase tracking-tighter m-0 text-primary">
                      {editCat ? 'Modify Class' : 'Register Class'}
                  </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-stone-50 rounded-full border-none cursor-pointer text-stone-200 shadow-sm">
                    <X size={24} strokeWidth={3} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/30 pl-2">Taxonomy Label</label>
                  <input type="text" required autoFocus placeholder="e.g. ORGANIC GREENS" value={catName} onChange={(e) => setCatName(e.target.value)}
                    className="w-full bg-stone-50 border-4 border-transparent focus:border-accent/30 outline-none px-8 py-6 rounded-[2rem] font-heading font-black uppercase tracking-tight text-2xl text-primary transition-all shadow-inner" />
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-primary text-white py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-accent transition-all border-none cursor-pointer group active:scale-95 flex items-center justify-center gap-4">
                    {editCat ? 'Confirm Mutation' : 'Initiate Habitat'} <ShieldCheck size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;

