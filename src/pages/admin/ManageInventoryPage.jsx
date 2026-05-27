import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, RefreshCw, 
  Calendar, Save, Minus, Plus,
  ShieldCheck, Sparkles, Maximize2,
  TrendingUp, Activity, Layers,
  ShoppingBag, Clock, Users
} from 'lucide-react';
import { adminHotelApi } from '../../api/hotelApi';

const ManageInventoryPage = () => {
  const { hotelId, roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hotelName = location.state?.hotelName || 'Property';
  const roomType = location.state?.roomType || 'Suite';
  
  const today = () => new Date().toISOString().split('T')[0];
  const twoMonthsLater = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  };

  // State
  const [inventory, setInventory] = useState([]); // Array of { id, date, bookedCount, reservedCount, totalCount, price, surgeFactor, closed }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChanges, setPendingChanges] = useState({}); // { id: { ...fields } }
  const [isSaving, setIsSaving] = useState(false);

  // Stats
  const hasChanges = Object.keys(pendingChanges).length > 0;

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminHotelApi.getInventory(roomId);
      const data = res.data?.data ?? res.data;
      setInventory(Array.isArray(data) ? data : []);
      setPendingChanges({});
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load availability data.');
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const handleFieldChange = (item, field, value) => {
    const itemId = item.id;
    setPendingChanges(prev => {
      const current = prev[itemId] || { ...item };
      return {
        ...prev,
        [itemId]: { ...current, [field]: value }
      };
    });
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      const updates = Object.values(pendingChanges);
      await Promise.all(updates.map(u => 
        adminHotelApi.updateInventory(roomId, {
          startDate: u.date,
          endDate: u.date,
          price: u.price,
          closed: u.closed,
          surgeFactor: u.surgeFactor,
          totalCount: u.totalCount
        })
      ));
      await fetchInventory();
    } catch (err) {
      setError('Inventory update failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => setPendingChanges({});

  // ─── Bulk Strategy Form ──────────────────────────────────────────────────
  const [bulkStrategy, setBulkStrategy] = useState({
     startDate: today(),
     endDate: twoMonthsLater(),
     surgeFactor: 1.0,
     closed: false,
     price: ''
  });

  const applyBulkStrategy = async () => {
     setIsSaving(true);
     try {
        await adminHotelApi.updateInventory(roomId, {
           ...bulkStrategy,
           price: bulkStrategy.price ? parseFloat(bulkStrategy.price) : undefined,
           surgeFactor: parseFloat(bulkStrategy.surgeFactor)
        });
        await fetchInventory();
        setBulkStrategy({ startDate: today(), endDate: twoMonthsLater(), surgeFactor: 1.0, closed: false, price: '' });
     } catch (err) {
        setError('Bulk update failed. Check date ranges.');
     } finally {
        setIsSaving(false);
     }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">

        {/* ─── Header Section ─────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
           <div className="space-y-4">
              <button 
                onClick={() => navigate(`/admin/hotels/${hotelId}/rooms`)} 
                className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-[#0284C7] transition-all group"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Return to Rooms
              </button>
              <div className="space-y-1">
                 <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">{roomType}</h1>
                 <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{hotelName} • Inventory Control</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button
                onClick={fetchInventory}
                disabled={isLoading || isSaving}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0F172A] transition-all shadow-sm"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              </button>
              
              <AnimatePresence>
                {hasChanges && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3"
                  >
                    <button
                      onClick={discardChanges}
                      className="px-6 py-4 bg-gray-100 text-gray-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-3 bg-[#0F172A] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0F172A]/20 active:scale-95 disabled:opacity-40"
                    >
                      {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                      Save Updates
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* ─── Bulk Operations ────────────────────────────────────────────────── */}
        <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
              <div className="space-y-1 shrink-0">
                 <div className="flex items-center gap-2">
                    <Sparkles className="text-[#F97316]" size={20} />
                    <h3 className="text-xs font-black text-[#F97316] uppercase tracking-widest">Bulk Management</h3>
                 </div>
                 <p className="text-white/40 text-xs">Update pricing and status for a range of dates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6 w-full xl:w-auto items-end">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase">Date Range</label>
                    <div className="flex flex-col gap-1.5">
                       <input type="date" value={bulkStrategy.startDate} onChange={e => setBulkStrategy({...bulkStrategy, startDate: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-black outline-none focus:border-[#0284C7]" />
                       <input type="date" value={bulkStrategy.endDate} onChange={e => setBulkStrategy({...bulkStrategy, endDate: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-black outline-none focus:border-[#0284C7]" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase">Price (₹)</label>
                    <input type="number" value={bulkStrategy.price} onChange={e => setBulkStrategy({...bulkStrategy, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm font-black outline-none focus:border-[#0284C7]" placeholder="Set Price" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase">Surge Factor</label>
                    <input type="number" step="0.1" value={bulkStrategy.surgeFactor} onChange={e => setBulkStrategy({...bulkStrategy, surgeFactor: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm font-black outline-none focus:border-[#0284C7]" placeholder="1.0" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase">Status</label>
                    <button onClick={() => setBulkStrategy({...bulkStrategy, closed: !bulkStrategy.closed})} className={`w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${bulkStrategy.closed ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-green-500/20 border-green-500 text-green-500'}`}>
                       {bulkStrategy.closed ? 'Mark Closed' : 'Mark Open'}
                    </button>
                 </div>

                 <button onClick={applyBulkStrategy} disabled={isSaving} className="h-11 bg-[#0284C7] hover:bg-white hover:text-[#0F172A] text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Maximize2 size={14} />
                    Apply Bulk
                 </button>
              </div>
           </div>
        </div>

        {/* ─── Inventory List ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
           
           <div className="grid grid-cols-12 gap-8 px-10 py-6 bg-gray-50/50 border-b border-gray-100 text-center">
              <div className="col-span-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</div>
              <div className="col-span-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usage (Booked / Held / Total)</div>
              <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price & Surge</div>
              <div className="col-span-2 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</div>
           </div>

           <div className="divide-y divide-gray-50 max-h-[800px] overflow-y-auto">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 gap-8 px-10 py-8 items-center animate-pulse">
                     <div className="col-span-3 h-4 bg-gray-50 rounded w-1/2" />
                     <div className="col-span-4 h-8 bg-gray-50 rounded-xl w-full" />
                     <div className="col-span-3 h-8 bg-gray-50 rounded-xl w-1/2 mx-auto" />
                     <div className="col-span-2 h-6 bg-gray-50 rounded-full w-16 ml-auto" />
                  </div>
                ))
              ) : inventory.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                   <Calendar size={48} className="mb-4" />
                   <p className="text-sm font-black uppercase tracking-widest">No Data Found</p>
                </div>
              ) : (
                inventory.map(item => {
                  const current = pendingChanges[item.id] || item;
                  const isPending = !!pendingChanges[item.id];
                  
                  return (
                    <div key={item.id} className={`grid grid-cols-12 gap-8 px-10 py-8 items-center transition-all ${isPending ? 'bg-[#0284C7]/5' : 'hover:bg-gray-50/30'}`}>
                       
                       {/* Date */}
                       <div className="col-span-3">
                          <p className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                             {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em] mt-2">Inventory Ref: {item.id}</p>
                       </div>

                       {/* Inventory (Booked / Reserved / Total) - READ ONLY */}
                       <div className="col-span-4">
                          <div className="flex items-center justify-center gap-10">
                             <div className="flex flex-col items-center gap-2">
                                <span className="text-xl font-black text-[#0284C7]">{item.bookedCount}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Booked</span>
                             </div>

                             <div className="w-[1px] h-10 bg-gray-100" />

                             <div className="flex flex-col items-center gap-2">
                                <span className="text-xl font-black text-amber-500">{item.reservedCount}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Held</span>
                             </div>

                             <div className="w-[1px] h-10 bg-gray-100" />

                             <div className="flex flex-col items-center gap-2">
                                <span className="text-xl font-black text-gray-400">{item.totalCount}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total</span>
                             </div>
                          </div>
                       </div>

                       {/* Pricing & Surge - READ ONLY */}
                       <div className="col-span-3 flex flex-col items-center">
                          <div className="flex items-center gap-2">
                             <span className="text-gray-300 text-xl font-black">₹</span>
                             <span className="text-3xl font-black text-[#0F172A] tracking-tighter">
                                {current.price?.toLocaleString()}
                             </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                             <div className="px-2 py-0.5 bg-[#0284C7]/5 rounded border border-[#0284C7]/10">
                                <span className="text-[10px] font-black text-[#0284C7] uppercase tracking-widest">Surge: {current.surgeFactor}x</span>
                             </div>
                          </div>
                       </div>

                       {/* Status - READ ONLY DISPLAY */}
                       <div className="col-span-2 flex justify-end">
                          <div className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] border-2 ${
                               !current.closed 
                                 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                 : 'bg-rose-50 text-rose-600 border-rose-100'
                             }`}>
                             {!current.closed ? 'Online' : 'Closed'}
                          </div>
                       </div>

                    </div>
                  );
                })
              )}
           </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex items-center gap-6">
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[#0284C7]">
                   <ShieldCheck size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black uppercase tracking-tight">System Status: {isLoading ? 'Syncing...' : 'Connected'}</h4>
                  <p className="text-white/40 text-xs">All inventory changes are reflected in real-time results.</p>
               </div>
            </div>

            <div className="relative z-10">
               {hasChanges ? (
                 <button onClick={handleSave} disabled={isSaving} className="px-10 py-5 bg-white text-[#0F172A] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] hover:text-white transition-all shadow-xl active:scale-95">
                   Confirm Updates
                 </button>
               ) : (
                  <div className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-xl">
                     <Activity size={18} className="text-emerald-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Data is current</span>
                  </div>
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ManageInventoryPage;
