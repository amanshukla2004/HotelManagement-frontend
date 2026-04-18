import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, User, Eye, EyeOff,
  ArrowRight, ShieldCheck, Mail, Lock,
  Sparkles, Globe, RefreshCw
} from 'lucide-react';

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [roleMode, setRoleMode] = useState('GUEST'); // 'GUEST' | 'HOTEL_MANAGER'
  const [isRegistering, setIsRegistering] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const toggleMode = (role) => {
    setRoleMode(role);
    setApiError(null);
    reset();
  };

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      let response;
      if (isRegistering) {
        if (roleMode === 'GUEST') {
          await authApi.userRegister({ name: data.name, email: data.email, password: data.password });
          const loginRes = await authApi.userLogin({ email: data.email, password: data.password });
          loginUser(loginRes.data.accessToken || loginRes.data.data?.accessToken, 'GUEST');
        } else {
          await authApi.managerRegister({ name: data.name, email: data.email, password: data.password });
          const loginRes = await authApi.managerLogin({ email: data.email, password: data.password });
          loginUser(loginRes.data.accessToken || loginRes.data.data?.accessToken, 'HOTEL_MANAGER');
        }
      } else {
        if (roleMode === 'GUEST') {
          response = await authApi.userLogin({ email: data.email, password: data.password });
          loginUser(response.data.accessToken || response.data.data?.accessToken, 'GUEST');
        } else {
          response = await authApi.managerLogin({ email: data.email, password: data.password });
          loginUser(response.data.accessToken || response.data.data?.accessToken, 'HOTEL_MANAGER');
        }
      }
      navigate('/');
    } catch (err) {
      console.error("Auth Error", err);
      const errorMessage = err.response?.data?.error?.message || err.message || "Credential verification failed.";
      setApiError(errorMessage);
    }
  };

  const inputClass = "w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/5 transition-all placeholder:text-gray-300";
  const labelClass = "block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">

      {/* ─── Background Elements ────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#635BFF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#F6A100]/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden relative"
      >
        <div className="p-10 md:p-14">

          {/* Header / Logo Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0A2540] flex items-center justify-center text-white shadow-xl">
                <Globe size={20} />
              </div>
              <span className="text-2xl font-black text-[#0A2540] tracking-tighter uppercase">Nox Hotel Manager</span>
            </div>
            <h2 className="text-4xl font-black text-[#0A2540] tracking-tighter uppercase mb-3">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">
              {isRegistering ? 'Just a quick few things to get started' : 'Welcome Back'}
            </p>
          </div>

          {/* Role Toggle Swich */}
          <div className="flex p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100 mb-10">
            <button
              onClick={() => toggleMode('GUEST')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.7rem] text-xs font-black uppercase tracking-widest transition-all ${roleMode === 'GUEST' ? 'bg-white shadow-xl text-[#635BFF]' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <User size={16} /> <span>Traveler</span>
            </button>
            <button
              onClick={() => toggleMode('HOTEL_MANAGER')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.7rem] text-xs font-black uppercase tracking-widest transition-all ${roleMode === 'HOTEL_MANAGER' ? 'bg-[#0A2540] shadow-xl text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <Building2 size={16} /> <span>Manager</span>
            </button>
          </div>

          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3"
            >
              <ShieldCheck size={18} />
              <span>{apiError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode='wait'>
              {isRegistering && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className={labelClass}>Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                     <input
                       {...register('name', { required: "Name is required" })}
                       className={inputClass}
                       placeholder="Your Full Name"
                       autocomplete="name"
                     />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className={labelClass}>Email </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                 <input
                   {...register('email', {
                     required: "Email is required",
                     pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                   })}
                   className={inputClass}
                   placeholder="your@email.com"
                   autocomplete={isRegistering ? "email" : "username"}
                 />
              </div>
              {errors.email && <p className="text-xs font-black text-red-500 mt-2 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Enter Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                 <input
                   type={showPassword ? "text" : "password"}
                   {...register('password', {
                     required: "Password is required",
                     minLength: { value: 8, message: "At least 8 characters" }
                   })}
                   className={inputClass}
                   placeholder="•••••••••"
                   autocomplete={isRegistering ? "new-password" : "current-password"}
                 />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#0A2540] transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-black text-red-500 mt-2 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 rounded-[1.7rem] text-white font-black text-xs uppercase tracking-[0.3em] transition-all mt-4 flex justify-center items-center gap-3 relative shadow-2xl shadow-[#0A2540]/10 ${roleMode === 'HOTEL_MANAGER' ? 'bg-[#0A2540]' : 'bg-[#635BFF]'
                } ${isSubmitting ? 'opacity-70' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isSubmitting ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : <Sparkles size={18} />}
              <span>{isRegistering ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setApiError(null); reset(); }}
              className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#635BFF] transition-all"
            >
              {isRegistering ? (
                <span className="flex items-center gap-2">Already have an account? <span className="text-[#635BFF]">Sign In</span> <ArrowRight size={12} /></span>
              ) : (
                <span className="flex items-center gap-2">New here? <span className="text-[#635BFF]">Sign Up</span> <ArrowRight size={12} /></span>
              )}
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-30">
            <ShieldCheck size={14} className="text-[#0A2540]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#0A2540]">Secure Login</span>
          </div>
          <div className="text-xs font-black uppercase tracking-widest text-gray-300">
            Nox v2.4.0
          </div>
        </div>

      </motion.div>

    </div>
  );
};

export default LoginPage;
