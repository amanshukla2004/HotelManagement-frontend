import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Building2, User, Eye, EyeOff,
  ArrowRight, ShieldCheck, Mail, Lock,
  Sparkles, Globe, RefreshCw
} from 'lucide-react';

const images = [
  "/placesImages/Indian Monuments.jpg",
  "/placesImages/hava mahal.jpg",
  "/placesImages/Sydney Opera House Hong Kong.jpg"
];

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [roleMode, setRoleMode] = useState('GUEST'); // 'GUEST' | 'HOTEL_MANAGER'
  const [isRegistering, setIsRegistering] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(images[0]);

  const imgRef = useRef(null);
  const textRef = useRef(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  useEffect(() => {
    // GSAP Intro Animation
    const ctx = gsap.context(() => {
      gsap.from(imgRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: "power3.out"
      });
      gsap.from(textRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5
      });
    });
    return () => ctx.revert();
  }, []);

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

  const inputClass = "w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 transition-all placeholder:text-gray-400";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-1";

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4 relative overflow-hidden z-0">

      {/* ─── Background Elements ────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0284C7]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#F97316]/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        {/* Left Side: Image and Intro */}
        <div className="hidden md:flex md:w-1/2 relative bg-gray-100 overflow-hidden items-end justify-center p-8">
          <img
            ref={imgRef}
            src={currentImage}
            alt="Exploration"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0284C7]/30 to-transparent mix-blend-multiply" />

          <div ref={textRef} className="relative z-10 text-white w-full">
            <div className="mb-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/30">
              <Sparkles size={14} className="text-[#F97316]" /> Start Exploring
            </div>
            <h1 className="text-4xl font-black mb-2 leading-tight font-display">Discover the<br /><span className="text-[#F97316]">World's Best</span></h1>
            <p className="text-sm text-gray-200 font-medium max-w-sm">
              Join millions of travelers exploring luxury stays and premium resorts globally.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0284C7] flex items-center justify-center text-white shadow-lg shadow-[#0284C7]/30">
                <Globe size={20} />
              </div>
              <span className="text-xl font-black text-[#0F172A] tracking-tight uppercase font-display">Nox Manager</span>
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] uppercase font-display">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
          </div>

          {/* Role Toggle Switch */}
          <div className="flex p-1 bg-gray-100/80 rounded-2xl border border-gray-200 mb-6">
            <button
              onClick={() => toggleMode('GUEST')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${roleMode === 'GUEST' ? 'bg-white shadow-md text-[#F97316]' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <User size={14} /> <span>Traveler</span>
            </button>
            <button
              onClick={() => toggleMode('HOTEL_MANAGER')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${roleMode === 'HOTEL_MANAGER' ? 'bg-[#0284C7] shadow-md text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Building2 size={14} /> <span>Manager</span>
            </button>
          </div>

          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-[11px] font-bold uppercase tracking-wider mb-6 flex items-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>{apiError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      {...register('name', { required: "Name is required" })}
                      className={inputClass}
                      placeholder="Your Full Name"
                      autoComplete="name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className={labelClass}>Email </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...register('email', {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                  })}
                  className={inputClass}
                  placeholder="your@email.com"
                  autoComplete={isRegistering ? "email" : "username"}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters" }
                  })}
                  className={inputClass}
                  placeholder="•••••••••"
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0284C7] transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl text-white font-black text-[11px] uppercase tracking-widest transition-all mt-6 flex justify-center items-center gap-2 shadow-lg ${roleMode === 'HOTEL_MANAGER' ? 'bg-[#0284C7] hover:bg-[#0369A1] shadow-[#0284C7]/20' : 'bg-[#F97316] hover:bg-[#EA580C] shadow-[#F97316]/20'
                } ${isSubmitting ? 'opacity-70' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
            >
              {isSubmitting ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : <Sparkles size={16} />}
              <span>{isRegistering ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setApiError(null); reset(); }}
              className="text-[11px] font-bold text-gray-500 uppercase tracking-wider hover:text-[#0284C7] transition-all"
            >
              {isRegistering ? (
                <span className="flex items-center justify-center gap-1.5">Already have an account? <span className="text-[#0284C7]">Sign In</span> <ArrowRight size={14} /></span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">New here? <span className="text-[#0284C7]">Sign Up</span> <ArrowRight size={14} /></span>
              )}
            </button>
          </div>
        </div>

      </motion.div>

    </div>
  );
};

export default LoginPage;
