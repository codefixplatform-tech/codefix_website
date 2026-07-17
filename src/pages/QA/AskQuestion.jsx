import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "../../lib/supabase";
import toast from 'react-hot-toast';
import { 
  FaRegLightbulb, 
  FaCode, 
  FaTags, 
  FaHeading, 
  FaChevronLeft,
  FaPaperPlane,
  FaCircleNotch,
  FaAlignLeft,
  FaRobot
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AskQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    code: '',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desc.trim()) {
      toast.error("Please provide both a title and a description.");
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading("Publishing your request...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to post.");
        navigate('/login', { state: { from: window.location.pathname } });
        return;
      }

      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== "")
        : [];

      const { error } = await supabase
        .from('questions')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            content: formData.desc,
            code_snippet: formData.code,
            tags: tagsArray
          }
        ]);

      if (error) throw error;

      toast.success("Request published successfully! 🚀", { id: loadingToast });
      navigate(isDashboard ? '/dashboard/questions' : '/questions');

    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Deployment failed. Please check connection.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col items-center p-6 relative overflow-hidden font-sans selection:bg-primary/10 selection:text-primary ${isDashboard ? 'pt-8' : 'pt-24'}`}>
      
      {/* 🚀 Vibrant Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[1300px] relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <motion.button 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 mb-6 sm:mb-8 text-[9px] sm:text-[11px] font-black uppercase tracking-[2px] sm:tracking-[4px] text-slate-400 hover:text-primary transition-colors bg-slate-50 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-slate-100 max-w-full"
          >
            <FaChevronLeft size={10} className="shrink-0" />
            <span className="truncate max-w-[150px] xs:max-w-none">Return to Network</span>
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-slate-900 leading-tight"
          >
            Create a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-purple-600">
              Knowledge Request
            </span>
          </motion.h1>
          <p className="mt-4 sm:mt-6 text-slate-500 font-medium text-base sm:text-lg max-w-2xl leading-relaxed px-4">
            Explain your struggle in detail. Our community and AI fix-engines are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* 🧩 Left: Guidance Panel */}
          <div className="lg:col-span-4 space-y-6 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 sm:p-8 bg-slate-50 border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6 sm:mb-10">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shrink-0">
                    <FaRegLightbulb size={22}/>
                  </div>
                  <h4 className="text-slate-900 font-bold text-xl tracking-tight">Best Practices</h4>
                </div>

                <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
                  <TipItem icon={<FaHeading />} title="Precise Title" desc="Avoid vague help requests." />
                  <TipItem icon={<FaAlignLeft />} title="Technical Context" desc="What were you expecting?" />
                  <TipItem icon={<FaCode />} title="Source Snippets" desc="Only include relevant code." />
                </div>

                <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                  <FaRobot className="text-emerald-500 text-2xl shrink-0" />
                  <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider leading-relaxed">
                    AI-Powered analysis active. Instant suggestions incoming.
                  </p>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-[-20%] w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
            </motion.div>
          </div>

          {/* 📝 Right: The Editor Surface */}
          <div className="lg:col-span-8 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-100 p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]"
            >
              <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Headline</label>
                  <div className="relative group">
                    <input 
                      required
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. 'Uncaught TypeError' in React Effect Hook"
                      className="w-full h-14 sm:h-16 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 text-slate-900 text-base font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Context</label>
                  <textarea 
                    required
                    name="desc"
                    rows="6"
                    value={formData.desc}
                    onChange={handleChange}
                    placeholder="Describe the struggle..."
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] py-4 sm:py-6 px-4 sm:px-6 text-slate-900 text-base font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none placeholder:text-slate-300 resize-none leading-relaxed"
                  />
                </div>

                {/* Code Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FaCode /> The Source Lab
                  </label>
                  <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-slate-200 group focus-within:border-emerald-500/40 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                    <div className="bg-slate-900 absolute top-0 left-0 right-0 h-10 flex items-center px-4 sm:px-6 justify-between">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-sans">code-block.js</span>
                    </div>
                    <textarea 
                      name="code"
                      rows="8"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="// Paste code here..."
                      className="w-full bg-[#030303] pt-14 pb-6 px-4 sm:px-6 text-emerald-400 font-mono text-sm outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification Tags</label>
                  <div className="relative group">
                    <FaTags className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="javascript, react, api"
                      className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-2xl pl-12 sm:pl-14 pr-4 sm:pr-6 text-slate-900 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 sm:h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-[2px] sm:tracking-[3px] text-[10px] sm:text-[11px] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <FaCircleNotch className="animate-spin text-lg" />
                  ) : (
                    <>
                      <span>Establish Connection & Publish</span>
                      <FaPaperPlane size={10} className="mt-[1px] shrink-0" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>

      <div className="mt-16 text-[10px] sm:text-[11px] font-black uppercase tracking-[3px] sm:tracking-[5px] text-slate-200 pointer-events-none mb-10 text-center px-4">
        Codefix Professional Elite
      </div>
    </div>
  );
};

const TipItem = ({ icon, title, desc }) => (
  <div className="flex gap-5 group">
    <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-primary text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-[13px] font-black text-slate-900 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AskQuestion;