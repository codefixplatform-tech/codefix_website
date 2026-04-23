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
  FaRobot,
  FaShieldAlt,
  FaMagic
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
      toast.error("Title and Description are required!");
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading("Syncing with Global Community...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to participate!");
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

      toast.success("Question Deployed Successfully! 🚀", { id: loadingToast });
      navigate(isDashboard ? '/dashboard/qa' : '/questions');

    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Network Error: Failed to deploy.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className={`relative min-h-screen bg-background text-white overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      
      {/* --- HERO HEADER (CENTERED) --- */}
      <section className={`relative ${isDashboard ? 'py-10' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-8">
           <motion.button 
              {...fadeIn}
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md hover:bg-primary/10 transition-all mx-auto"
           >
              <FaChevronLeft className="text-primary text-[10px]" />
              <span className="text-[10px] font-semibold text-slate-300 tracking-[4px] uppercase">Return to Feed</span>
           </motion.button>
           
           <motion.h1 {...fadeIn} className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              Create a <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Knowledge Request
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-2xl mx-auto text-secondary text-xl font-semibold opacity-80 leading-relaxed italic">
              "Your bug might be someone else's breakthrough. Post with clarity and let the community fix it together."
           </motion.p>
        </div>
      </section>

      {/* --- FORM INTERFACE --- */}
      <section className="pb-32">
         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-16">
               
               {/* Left: Guidance & AI Tips */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl space-y-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                           <FaRegLightbulb size={24}/>
                        </div>
                        <h4 className="text-white font-semibold text-xl tracking-tight">Writing Tips</h4>
                     </div>

                     <div className="space-y-8">
                        <TipItem 
                           icon={<FaHeading />} 
                           title="Clear Title" 
                           desc="Summarize the problem in one precise sentence. Avoid 'Help me please'." 
                        />
                        <TipItem 
                           icon={<FaAlignLeft />} 
                           title="Context" 
                           desc="Explain what you expected and what actually happened." 
                        />
                        <TipItem 
                           icon={<FaCode />} 
                           title="Minimal Code" 
                           desc="Only paste the relevant snippet. Remove API keys or private data." 
                        />
                     </div>

                     <div className="pt-6 border-t border-white/5">
                        <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
                           <FaRobot className="text-emerald-500 text-2xl" />
                           <p className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider leading-relaxed">
                              AI Fix-Engine will analyze your post instantly for immediate suggestions.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: The Editor */}
               <div className="lg:col-span-8 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[4rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                  
                  <div className="relative bg-surface/30 border border-white/10 p-10 md:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl">
                     <form onSubmit={handleSubmit} className="space-y-12">
                        
                        {/* Title Input */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-semibold text-primary uppercase tracking-[4px] ml-4">The Headline</label>
                           <div className="relative group">
                              <input 
                                 required
                                 name="title"
                                 value={formData.title}
                                 onChange={handleChange}
                                 placeholder="e.g. 'Uncaught TypeError: Cannot read property of undefined' in React"
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-white focus:border-primary/50 outline-none transition-all font-semibold text-lg placeholder:text-slate-700"
                              />
                           </div>
                        </div>

                        {/* Description Input */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-semibold text-primary uppercase tracking-[4px] ml-4">Detailed Context</label>
                           <textarea 
                              required
                              name="desc"
                              rows="8"
                              value={formData.desc}
                              onChange={handleChange}
                              placeholder="Describe your struggle in detail..."
                              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 px-8 text-white focus:border-primary/50 outline-none transition-all font-semibold text-base placeholder:text-slate-700 resize-none leading-relaxed"
                           />
                        </div>

                        {/* Code Input */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-semibold text-emerald-400 uppercase tracking-[4px] ml-4 flex items-center gap-2">
                              <FaCode /> The Source Lab
                           </label>
                           <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 group focus-within:border-emerald-500/40">
                              <div className="bg-[#0a0a0c]/80 absolute top-0 left-0 right-0 h-12 flex items-center px-6 justify-between border-b border-white/5">
                                 <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                 </div>
                                 <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">code-block.js</span>
                              </div>
                              <textarea 
                                 name="code"
                                 rows="10"
                                 value={formData.code}
                                 onChange={handleChange}
                                 placeholder="// Paste the problematic code snippet here..."
                                 className="w-full bg-[#030303] pt-16 pb-8 px-8 text-emerald-400 font-mono text-sm outline-none transition-all placeholder:text-emerald-900/50 resize-none leading-relaxed"
                              />
                           </div>
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-semibold text-primary uppercase tracking-[4px] ml-4">Classification Tags</label>
                           <div className="relative">
                              <FaTags className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" />
                              <input 
                                 name="tags"
                                 value={formData.tags}
                                 onChange={handleChange}
                                 placeholder="javascript, react, api"
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-white focus:border-primary/50 outline-none transition-all font-semibold text-sm placeholder:text-slate-700"
                              />
                           </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                           <button 
                              type="submit"
                              disabled={loading}
                              className={`w-full bg-primary hover:bg-blue-600 text-white py-6 rounded-2xl font-semibold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 uppercase tracking-[4px] text-xs ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                           >
                              {loading ? (
                                 <FaCircleNotch className="animate-spin text-lg" />
                              ) : (
                                 <>
                                    <FaPaperPlane className="text-sm" />
                                    Deploy Request
                                 </>
                              )}
                           </button>
                        </div>

                     </form>
                  </div>
               </div>

            </div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const TipItem = ({ icon, title, desc }) => (
  <div className="flex gap-5 group">
    <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-primary text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
      <p className="text-secondary text-[12px] font-semibold opacity-60 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AskQuestion;