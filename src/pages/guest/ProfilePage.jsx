import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userProfileApi } from '../../api/authApi';
import { adminApi } from '../../api/adminApi';
import { 
  User, Mail, Calendar, UserCircle2, 
  ShieldCheck, Loader2, CheckCircle, 
  AlertCircle, Camera, Pencil, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const inputClass = 'w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 transition-all placeholder:text-gray-300';
const labelClass = 'block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, role, resolveProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  
  // Helper to format date for input
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0]; // Handle ISO or YYYY-MM-DD
  };

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: user?.name || '',
      gender: user?.gender || 'MALE',
      dateOfBirth: formatDateForInput(user?.dateOfBirth),
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        gender: user.gender || 'MALE',
        dateOfBirth: formatDateForInput(user.dateOfBirth),
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setStatus(null);
    try {
      if (role === 'HOTEL_MANAGER') {
        await adminApi.updateProfile(data);
      } else {
        await userProfileApi.updateProfile(data);
      }
      
      // Refresh user context immediately
      await resolveProfile(role);
      
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Back Button and Label */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#0A2540] uppercase tracking-widest transition-all group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-gray-50 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Home
          </button>
          <span className="px-3 py-1 bg-[#635BFF]/10 rounded-full text-xs font-black tracking-widest text-[#635BFF] uppercase">
            My Profile
          </span>
          <div className="w-24" /> {/* Spacer to center the label roughly */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden"
        >
          {/* Header/Banner */}
          <div className="h-32 bg-gradient-to-r from-[#0A2540] to-[#635BFF] relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] bg-white p-1.5 shadow-xl">
                  <div className="w-full h-full rounded-[1.7rem] bg-gray-100 flex items-center justify-center text-4xl font-black text-[#635BFF]">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-400 hover:text-[#0A2540] hover:scale-110 transition-all">
                  <Camera size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 px-8">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-black text-[#0A2540] tracking-tighter capitalize">{user?.name}</h1>
              <p className="text-xs font-bold text-gray-400 mt-1 flex items-center justify-center gap-1.5">
                <Mail size={12} /> {user?.email}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                
                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      {...register('name', { required: 'Name is required' })}
                      className={`${inputClass} pl-12`} 
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-bold mt-2 ml-1">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                      <input 
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...register('dateOfBirth', {
                          validate: (value) => {
                            if (!value) return true;
                            const dob = new Date(value);
                            const today = new Date();
                            if (dob > today) return 'Date of birth cannot be in the future';
                            
                            let age = today.getFullYear() - dob.getFullYear();
                            const m = today.getMonth() - dob.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                                age--;
                            }
                            return age >= 16 || 'You must be at least 16 years old to use Nox';
                          }
                        })}
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                    {errors.dateOfBirth && <p className="text-xs text-red-500 font-bold mt-2 ml-1">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <div className="relative">
                      <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                      <select 
                        {...register('gender')}
                        className={`${inputClass} pl-12 appearance-none`}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center text-[#635BFF]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#0A2540] uppercase tracking-wider">Your Role</p>
                    <p className="text-sm font-bold text-gray-500 capitalize">{role?.toLowerCase()?.replace('_', ' ')}</p>
                  </div>
                </div>

              </div>

              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold border ${
                    status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{status.message}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || !isDirty}
                className="w-full flex items-center justify-center gap-2 bg-[#0A2540] hover:bg-[#635BFF] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#0A2540]/20 disabled:opacity-30 disabled:shadow-none active:scale-[0.98]"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={14} />}
                {loading ? 'Saving Changes...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </motion.div>

        <p className="text-center mt-12 text-xs font-black text-gray-300 uppercase tracking-[0.3em]">
          Your data is secure
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
