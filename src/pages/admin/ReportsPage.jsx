import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, DollarSign, BookOpen, TrendingUp,
  AlertCircle, Search, Calendar, Building2, ChevronDown,
  Filter, CheckCircle2, XCircle, Clock, RefreshCw, ArrowRight
} from 'lucide-react';
import { adminHotelApi } from '../../api/hotelApi';

// ── Helpers ───────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];
const twoMonthsLater = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d.toISOString().split('T')[0];
};

const STATUS_CONFIG = {
  CONFIRMED: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: <CheckCircle2 size={12} /> },
  CANCELLED: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: <XCircle size={12} /> },
  PAYMENTS_PENDING: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <Clock size={12} /> },
  RESERVED: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Clock size={12} /> },
};

const resolveAmount = (b) => b?.amount ?? b?.totalPrice ?? b?.totalCost ?? 0;

// ── KPI Card ──────────────────────────────────────────────────────────
const KpiCard = ({ icon, label, value, sub, color, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col gap-6 group hover:shadow-2xl transition-all duration-500"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center self-start shadow-sm transition-transform group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    {loading ? (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-50 rounded w-24" />
        <div className="h-10 bg-gray-50 rounded w-40" />
        <div className="h-3 bg-gray-50 rounded w-32" />
      </div>
    ) : (
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-4xl font-black text-[#0A2540] tracking-tighter mb-1">{value}</p>
        <p className="text-xs font-bold text-gray-400 tracking-tight">{sub}</p>
      </div>
    )}
  </motion.div>
);

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedHotelId = searchParams.get('hotelId');

  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  
  // New: Analytics Filter State
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      hotelId: preselectedHotelId || '',
      startDate: today(),
      endDate: twoMonthsLater(),
    },
  });

  const selectedHotelId = watch('hotelId');

  useEffect(() => {
    const loadHotels = async () => {
      setHotelsLoading(true);
      try {
        const res = await adminHotelApi.getMyHotels();
        const list = res.data?.data ?? res.data;
        setHotels(Array.isArray(list) ? list : []);
        if (preselectedHotelId) setValue('hotelId', preselectedHotelId);
      } catch (err) { console.error('Failed to load hotels', err); }
      finally { setHotelsLoading(false); }
    };
    loadHotels();
  }, [preselectedHotelId, setValue]);

  const fetchData = useCallback(async (hId, sDate, eDate) => {
    if (!hId) return;
    setReportLoading(true);
    setBookingsLoading(true);
    setReportError(null);
    try {
      const [repRes, bookRes] = await Promise.all([
        adminHotelApi.getReports(hId, { startDate: sDate, endDate: eDate }),
        adminHotelApi.getHotelBookings(hId)
      ]);
      setReportData(repRes.data?.data ?? repRes.data);
      const bData = bookRes.data?.data ?? bookRes.data;
      setBookings(Array.isArray(bData) ? bData : []);
    } catch (err) {
      setReportError(err.response?.data?.error?.message || 'Failed to load report data.');
    } finally {
      setReportLoading(false);
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedHotelId) fetchData(selectedHotelId, today(), twoMonthsLater());
  }, [selectedHotelId, fetchData]);

  const onSubmit = (data) => fetchData(data.hotelId, data.startDate, data.endDate);

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'ALL') return bookings;
    return bookings.filter(b => b.bookingStatus === statusFilter);
  }, [bookings, statusFilter]);

  const selectedHotel = hotels.find((h) => String(h.id) === String(selectedHotelId));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        
        {/* ─── Header ────────────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-[#635BFF]/10 text-[#635BFF] text-xs font-black uppercase tracking-widest rounded-md">Reports</span>
                 <div className="h-1 w-1 bg-gray-200 rounded-full" />
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Summary</span>
              </div>
              <h1 className="text-4xl font-black text-[#0A2540] tracking-tighter uppercase mb-2">Hotel Reports</h1>
              <p className="text-sm font-medium text-gray-400 max-w-lg leading-relaxed">Performance summary for your hotel properties, revenue, and booking history.</p>
           </div>
           
           <div className="flex gap-4">
              <button onClick={() => fetchData(selectedHotelId, today(), twoMonthsLater())} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0A2540] transition-all shadow-sm">
                 <RefreshCw size={18} className={reportLoading ? 'animate-spin' : ''} />
              </button>
           </div>
        </div>

        {/* ─── Filter Command Bar ────────────────────────────────────────────── */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_32px_80px_rgba(0,0,0,0.03)] p-6 md:p-8">
           <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Selected Property</label>
                 <div className="relative">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <select {...register('hotelId')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-black text-[#0A2540] uppercase tracking-tighter outline-none focus:ring-4 focus:ring-[#635BFF]/5 focus:border-[#635BFF] appearance-none transition-all">
                       <option value="">Select Property</option>
                       {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Start Date</label>
                 <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="date" {...register('startDate')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-black text-[#0A2540] uppercase tracking-tighter outline-none focus:ring-4 focus:ring-[#635BFF]/5 focus:border-[#635BFF] transition-all" />
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">End Date</label>
                 <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="date" {...register('endDate')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-black text-[#0A2540] uppercase tracking-tighter outline-none focus:ring-4 focus:ring-[#635BFF]/5 focus:border-[#635BFF] transition-all" />
                 </div>
              </div>
              <button type="submit" className="w-full bg-[#0A2540] hover:bg-[#635BFF] text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#0A2540]/10 flex items-center justify-center gap-2 active:scale-95">
                 <Search size={16} /> <span>Apply Filters</span>
              </button>
           </form>
        </div>

        {reportError && (
          <div className="flex items-center gap-4 bg-red-50 border border-red-100 text-red-700 p-6 rounded-[2rem] text-xs font-black uppercase tracking-wider">
             <AlertCircle size={20} /> <span>{reportError}</span>
          </div>
        )}

        {/* ─── KPI Metrics Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <KpiCard
             loading={reportLoading}
             icon={<BookOpen size={24} className="text-[#635BFF]" />}
             label="Total Bookings"
             value={reportData?.bookingCount ?? '—'}
             sub="Completed bookings in this period"
             color="bg-[#635BFF]/10 text-[#635BFF]"
           />
           <KpiCard
             loading={reportLoading}
             icon={<DollarSign size={24} className="text-green-600" />}
             label="Total Revenue"
             value={reportData?.totalRevenue != null ? `₹${Number(reportData.totalRevenue).toLocaleString()}` : '—'}
             sub="Earnings before taxes and fees"
             color="bg-green-50 text-green-600"
           />
           <KpiCard
             loading={reportLoading}
             icon={<TrendingUp size={24} className="text-[#F6A100]" />}
             label="Avg. Per Booking"
             value={reportData?.avgRevenue != null ? `₹${Number(reportData.avgRevenue).toFixed(0).toLocaleString()}` : '—'}
             sub="Average revenue generated per stay"
             color="bg-[#F6A100]/10 text-[#F6A100]"
           />
        </div>

        {/* ─── Detailed Ledger (Table) ───────────────────────────────────────── */}
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] shadow-[0_0_12px_#635BFF]" />
                 <h2 className="text-2xl font-black text-[#0A2540] uppercase tracking-tighter">Booking Details</h2>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
                 {['ALL', 'CONFIRMED', 'CANCELLED', 'PAYMENTS_PENDING'].map(s => (
                   <button
                     key={s}
                     onClick={() => setStatusFilter(s)}
                     className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                       statusFilter === s ? 'bg-[#0A2540] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                     }`}
                   >
                     {s.replace('_', ' ')}
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_32px_80px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Booking ID</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Stay Dates</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Rooms</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Total Price</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {bookingsLoading ? (
                         Array(5).fill(0).map((_, i) => (
                           <tr key={i} className="animate-pulse">
                              <td colSpan={5} className="px-8 py-6"><div className="h-4 bg-gray-50 rounded w-full" /></td>
                           </tr>
                         ))
                       ) : filteredBookings.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="px-8 py-24 text-center">
                               <div className="flex flex-col items-center gap-4 opacity-30">
                                  <Filter size={40} strokeWidth={1} />
                                  <p className="text-xs font-black uppercase tracking-widest">No bookings found matching filters</p>
                               </div>
                            </td>
                         </tr>
                       ) : (
                         filteredBookings.map((b, idx) => (
                           <motion.tr 
                             key={b.id} 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: idx * 0.02 }}
                             className="hover:bg-[#F8FAFC]/70 transition-all group"
                           >
                              <td className="px-8 py-6">
                                 <span className="text-xs font-black text-gray-300 uppercase tracking-widest group-hover:text-[#635BFF] transition-colors">#{b.id}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-[#0A2540]">{b.checkInDate}</span>
                                    <ArrowRight size={10} className="text-gray-300" />
                                    <span className="text-xs font-black text-[#0A2540]">{b.checkOutDate}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-center">
                                 <span className="text-xs font-bold text-gray-500">{b.roomsCount || 1} Room(s)</span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-xs font-black text-[#0A2540]">₹{resolveAmount(b).toLocaleString()}</span>
                              </td>
                              <td className="px-8 py-6 flex justify-end">
                                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${
                                   STATUS_CONFIG[b.bookingStatus]?.bg || 'bg-gray-50'
                                 } ${STATUS_CONFIG[b.bookingStatus]?.color || 'text-gray-400'} ${STATUS_CONFIG[b.bookingStatus]?.border || 'border-gray-100'}`}>
                                    {STATUS_CONFIG[b.bookingStatus]?.icon || <RefreshCw size={12} />}
                                    {b.bookingStatus?.replace('_', ' ')}
                                 </div>
                              </td>
                           </motion.tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
              
              {!bookingsLoading && filteredBookings.length > 0 && (
                <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Showing {filteredBookings.length} of {bookings.length} bookings
                   </p>
                   <p className="text-xs font-black text-[#635BFF] uppercase tracking-widest">
                      Real-time Data
                   </p>
                </div>
              )}
           </div>
        </div>

        {/* Global Action Footer */}
        <div className="bg-[#0A2540] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="absolute top-0 right-0 w-80 h-80 bg-[#635BFF]/10 blur-[120px] -mr-40 -mt-40" />
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/40">
                 <BarChart2 size={32} />
              </div>
              <div>
                 <p className="text-xs font-black text-[#635BFF] uppercase tracking-[0.3em] mb-1">Data Summary</p>
                 <p className="text-xl font-bold tracking-tight">Reports are based on your confirmed hotel bookings.</p>
              </div>
           </div>
           <button onClick={() => window.print()} className="px-10 py-5 bg-white text-[#0A2540] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#635BFF] hover:text-white transition-all shadow-xl shadow-white/5 flex items-center gap-3 active:scale-95">
              Print Report <ArrowRight size={16} />
           </button>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;
