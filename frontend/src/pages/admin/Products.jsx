// src/pages/admin/Products.jsx – Ekomart Harvest Manager
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, MoreHorizontal, Edit2, Trash2, ExternalLink, 
  ChevronLeft, ChevronRight, Package, AlertCircle, Leaf, ShieldCheck, Sprout, ShoppingBasket
} from 'lucide-react';
import { productsApi, categoryApi } from '../../services/api';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Vegetables', price: '', stock: '', image_url: '', description: ''
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryApi.list();
        if (res.success) setCategories(res.data);
      } catch (err) { console.error('Failed to fetch categories:', err); }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        category: editProduct.category || 'Vegetables',
        price: editProduct.price || '',
        stock: editProduct.stock || '',
        image_url: editProduct.image_url || '',
        description: editProduct.description || ''
      });
    } else {
      setFormData({ name: '', category: 'Vegetables', price: '', stock: '', image_url: '', description: '' });
    }
  }, [editProduct, showModal]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list(page, filterCategory, 'created_at', debouncedSearch);
      if (res.success) setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filterCategory, debouncedSearch]);

  const handleExport = async () => {
    try {
      const res = await productsApi.list(1, filterCategory, 'created_at', debouncedSearch, 1000);
      if (res.success) {
        const data = res.data;
        const csvContent = "data:text/csv;charset=utf-8," 
          + "ID,Name,Category,Price,Stock\n"
          + data.map(p => `${p.id},${p.name},${p.category},${p.price},${p.stock}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `harvest_catalog_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) { alert('Export failed: ' + err.message); }
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (window.confirm('Purge this harvest entry from the catalog?')) {
      try {
        await productsApi.delete(id);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) };
      let res = editProduct ? await productsApi.update(editProduct.id, payload) : await productsApi.create(payload);
      if (res.success) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-8 border-primary pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-1 h-px bg-accent rounded-full" />
             <span className="text-[10px] font-heading font-black text-accent uppercase tracking-[0.4em]">Inventory Node</span>
          </div>
          <h1 className="font-heading font-black text-6xl tracking-tighter uppercase leading-none text-primary">Harvest <span className="text-accent">Manager</span></h1>
          <p className="text-stone/30 font-heading font-black uppercase tracking-[0.3em] text-xs mt-4">Global Produce & Stock Authorization</p>
        </div>
        <button 
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="bg-accent text-white px-12 py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 group active:scale-95"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" /> New Harvest Entry
        </button>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="relative flex-1 group">
          <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search catalog by name, ID, or taxonomy..."
            className="w-full bg-white border-4 border-stone-50 rounded-[2rem] py-6 pl-16 pr-8 font-heading font-black uppercase text-xs tracking-widest outline-none focus:border-accent/30 transition-all shadow-xl shadow-stone-100/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            <select 
              value={filterCategory} 
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="appearance-none bg-primary text-white pl-14 pr-10 py-6 rounded-[1.5rem] font-heading font-black uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-xl active:scale-95 outline-none cursor-pointer border-none"
            >
              <option value="">All Taxonomy</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-4 px-10 bg-white border-4 border-stone-50 text-stone/30 rounded-[1.5rem] font-heading font-black uppercase tracking-widest text-xs hover:border-accent/30 hover:text-accent transition-all shadow-lg active:scale-95"
          >
            Export <Leaf size={18} className="text-accent" />
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="bg-white rounded-[4rem] border-8 border-stone-50 shadow-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-10 py-8 font-heading font-black uppercase tracking-[0.3em] text-[10px] text-left">Produce Entry</th>
                <th className="px-10 py-8 font-heading font-black uppercase tracking-[0.3em] text-[10px] text-left">Taxonomy</th>
                <th className="px-10 py-8 font-heading font-black uppercase tracking-[0.3em] text-[10px] text-left">Valuation</th>
                <th className="px-10 py-8 font-heading font-black uppercase tracking-[0.3em] text-[10px] text-left">Vault Stock</th>
                <th className="px-10 py-8 font-heading font-black uppercase tracking-[0.3em] text-[10px] text-left">Viability</th>
                <th className="px-10 py-8 font-heading font-black uppercase tracking-[0.3em] text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-stone-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-10 py-12 text-center text-stone-200 uppercase font-black text-[10px] tracking-widest">Scanning Network Layer...</td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-40 text-center">
                    <ShoppingBasket size={80} strokeWidth={1} className="mx-auto text-stone-100 mb-8" />
                    <p className="font-heading font-black uppercase tracking-[0.5em] text-xs text-stone/20">Zero harvest entries detected in local node</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-stone-100 overflow-hidden shrink-0 border-4 border-white group-hover:rotate-6 transition-transform duration-500 shadow-lg shadow-stone-200">
                          <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-heading font-black text-base uppercase tracking-tight text-primary group-hover:text-accent transition-colors mb-1">{p.name}</p>
                          <p className="text-[10px] text-stone/20 font-heading font-black uppercase tracking-widest">ID: {p.id.slice(0,10)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-5 py-2 bg-accent/10 rounded-full text-[10px] font-heading font-black uppercase tracking-widest text-accent border border-accent/20 shadow-inner">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-10 py-8 font-heading font-black text-base text-primary">
                      {fmt(p.price)}
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-3">
                        <span className={`text-[10px] font-heading font-black uppercase tracking-widest ${p.stock < 10 ? 'text-berry' : 'text-primary/40'}`}>
                          {p.stock} UNITS
                        </span>
                        <div className="w-32 h-2.5 bg-stone-100 rounded-full overflow-hidden border border-white">
                          <div className={`h-full transition-all duration-1000 ${p.stock < 10 ? 'bg-berry' : 'bg-accent shadow-[0_0_10px_rgba(98,148,50,0.5)]'}`} style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full border-2 ${p.stock > 0 ? 'bg-accent/5 border-accent/10 text-accent' : 'bg-berry/5 border-berry/10 text-berry'}`}>
                        <div className={`w-2 h-2 rounded-full ${p.stock > 0 ? 'bg-accent shadow-[0_0_8px_rgba(98,148,50,0.8)]' : 'bg-berry'} animate-pulse`}></div>
                        <span className="text-[10px] font-heading font-black uppercase tracking-widest">
                          {p.stock > 0 ? 'VIABLE' : 'DEPLETED'}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 translate-x-10 group-hover:translate-x-0 duration-500">
                        <button onClick={() => { setEditProduct(p); setShowModal(true); }} className="p-4 bg-white text-primary/20 hover:text-accent hover:shadow-2xl rounded-2xl transition-all border-4 border-stone-50 cursor-pointer shadow-lg active:scale-90">
                          <Edit2 size={18} strokeWidth={3} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-4 bg-white text-primary/20 hover:text-berry hover:shadow-2xl rounded-2xl transition-all border-4 border-stone-50 cursor-pointer shadow-lg active:scale-90">
                          <Trash2 size={18} strokeWidth={3} />
                        </button>
                      </div>
                      <MoreHorizontal size={24} className="text-stone-100 group-hover:hidden transition-opacity" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Bar Footer */}
        <div className="px-12 py-10 border-t-8 border-stone-100 flex items-center justify-between bg-stone-50/30">
          <p className="text-[11px] font-heading font-black text-primary/20 uppercase tracking-[0.4em]">
            Syncing <span className="text-primary">{products.length}</span> Active Harvests In Network
          </p>
          <div className="flex items-center gap-5">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-4 rounded-2xl border-4 border-stone-100 text-stone-200 hover:border-accent hover:text-accent transition-all disabled:opacity-20 bg-white shadow-lg active:scale-95">
              <ChevronLeft size={20} strokeWidth={4} />
            </button>
            <div className="min-w-[50px] h-12 flex items-center justify-center bg-primary text-white rounded-2xl text-sm font-heading font-black shadow-2xl rotate-3">
              {page}
            </div>
            <button disabled={products.length < 10} onClick={() => setPage(p => p + 1)} className="p-4 rounded-2xl border-4 border-stone-100 text-stone-200 hover:border-accent hover:text-accent transition-all disabled:opacity-20 bg-white shadow-lg active:scale-95">
              <ChevronRight size={20} strokeWidth={4} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-primary/80 backdrop-blur-xl" />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl overflow-hidden p-12 md:p-16 border-t-[12px] border-accent"
            >
              <div className="flex items-center gap-4 mb-10">
                 <Sprout size={40} className="text-accent" />
                 <h2 className="font-heading font-black text-5xl text-primary uppercase tracking-tighter">
                   {editProduct ? 'Modify Harvest' : 'New Harvest'}
                 </h2>
              </div>
              
              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/30 pl-2">Product Name</label>
                    <input type="text" required placeholder="ORANGE BLOOM" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-stone-50 border-4 border-transparent focus:border-accent/30 outline-none px-8 py-5 rounded-[2rem] font-heading font-black uppercase text-xs shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/30 pl-2">Classification</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-stone-50 border-4 border-transparent focus:border-accent/30 outline-none px-8 py-5 rounded-[2rem] font-heading font-black uppercase text-xs shadow-inner appearance-none cursor-pointer">
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      {categories.length === 0 && <option>Vegetables</option>}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/30 pl-2">Valuation (INR)</label>
                    <input type="number" required placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-stone-50 border-4 border-transparent focus:border-accent/30 outline-none px-8 py-5 rounded-[2rem] font-heading font-black text-sm text-primary shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/30 pl-2">Vault Quantity</label>
                    <input type="number" required placeholder="QTY" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-stone-50 border-4 border-transparent focus:border-accent/30 outline-none px-8 py-5 rounded-[2rem] font-heading font-black text-sm text-primary shadow-inner" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-heading font-black uppercase tracking-widest text-primary/30 pl-2">Visual DNA (Image URL)</label>
                  <input type="text" required placeholder="HTTP://IMAGE.CDN/..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full bg-stone-50 border-4 border-transparent focus:border-accent/30 outline-none px-8 py-5 rounded-[2rem] font-heading font-black text-xs text-primary shadow-inner" />
                </div>

                <div className="pt-10 flex gap-6">
                  <button type="submit" className="flex-1 bg-primary text-white py-6 rounded-full font-heading font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-accent transition-all active:scale-95 flex items-center justify-center gap-3">
                    <ShieldCheck size={20} /> {editProduct ? 'Commit Changes' : 'Execute Harvest'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-10 font-heading font-black text-[11px] uppercase tracking-[0.3em] text-stone-300 hover:text-berry transition-colors">Abort</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;

