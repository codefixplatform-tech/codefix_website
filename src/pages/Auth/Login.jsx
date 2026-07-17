import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { supabase } from "../../lib/supabase"; 
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        toast.success("Welcome back! ✨");
        navigate("/dashboard", { replace: true }); 
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
          queryParams: { access_type: 'offline', prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-primary/20">
      
      {/* 🌌 Dynamic Mesh Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/10 via-indigo-500/5 to-transparent blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white overflow-hidden relative z-10">
        
        {/* 🎨 Left Side: Vibrant Interactive Pane */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 right-0 w-64 h-64 bg-cyan-400/20 blur-[80px] rounded-full"
          ></motion.div>

          <div className="relative z-10">
            <Link to="/">
              <img src="/logo.png" alt="Codefix" className="h-10 w-auto mb-20 brightness-200" />
            </Link>
            <h2 className="text-5xl font-bold text-white leading-[1.1] font-syne tracking-tighter">
              Fix Code <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Faster</span> <br />
              Than Ever.
            </h2>
            <p className="mt-8 text-blue-100/70 text-lg font-medium max-w-xs leading-relaxed">
              Join thousands of developers using AI to ship bug-free software in record time.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                  +2k
                </div>
             </div>
             <p className="text-sm text-blue-100/50 font-bold tracking-widest uppercase">Trusted by innovators</p>
          </div>
        </div>

        {/* 📝 Right Side: Clean Form with Color Accents */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 lg:hidden text-center">
            <Link to="/">
              <img src="/black.png" alt="Codefix" className="h-8 w-auto mx-auto mb-6" />
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <span className="text-slate-900">Welcome</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-purple-600">Back</span>
            </h1>
            <p className="text-slate-500 font-medium">Log in to your professional workspace.</p>
          </div>

          <div className="space-y-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 flex items-center justify-center gap-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-[background-color,border-color,box-shadow] duration-200 group overflow-hidden relative"
            >
              <div className="w-6 h-6 flex items-center justify-center relative z-10">
                 <GoogleIcon />
              </div>
              <span className="text-sm font-black uppercase tracking-wider relative z-10">Sync via Google</span>
            </motion.button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[4px] font-black"><span className="bg-white px-4 text-slate-300">Or use Credentials</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                  <FaEnvelope size={14} />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dev@codefix.io"
                  className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-6 text-slate-900 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                <button type="button" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                  <FaLock size={14} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-14 text-slate-900 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-[3px] text-[11px] transition-[background-color,box-shadow] duration-200 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              <span>{loading ? "Verifying..." : "Establish Connection"}</span>
              <FaArrowRight size={10} />
            </motion.button>
          </form>

          <p className="mt-10 text-center text-slate-400 text-sm font-medium">
            New here? <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Join the Ecosystem</Link>
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 text-[11px] font-black uppercase tracking-[5px] text-slate-300 pointer-events-none opacity-50">
        Codefix Professional Elite
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.396,35.509,44,30.518,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const EyeIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> );
const EyeOffIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> );

export default Login;
