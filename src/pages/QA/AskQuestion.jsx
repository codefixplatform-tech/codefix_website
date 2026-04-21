import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaAlignLeft
} from 'react-icons/fa';

const AskQuestion = () => {
  const navigate = useNavigate();
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
      toast.error("Title and Description are required, jani!");
      return;
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login first!");
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

      toast.success("Question posted successfully! 🚀");
      navigate('/dashboard/qa');

    } catch (error) {
      console.error("Error posting question:", error);
      toast.error(error.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-6 mt-10">
      
      {/* 1. Header Section */}
      <div className="space-y-4">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-secondary/40 hover:text-primary transition-all w-fit"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
            <FaChevronLeft size={10} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Go Back</span>
        </button>
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
            SOLVE A <span className="text-primary not-italic">MYSTERY.</span>
          </h1>
          <p className="text-secondary/60 text-sm font-medium ml-1">Share your challenge with the global developer community.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* 2. Main Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8 bg-surface/20 backdrop-blur-xl border border-white/5 p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 rounded-full"></div>
          
          {/* Title Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-primary flex items-center gap-2 ml-1">
              <FaHeading size={10}/> The Headline
            </label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 'Maximum call stack size exceeded' in React Effect"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 font-bold tracking-tight shadow-inner"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-primary flex items-center gap-2 ml-1">
              <FaAlignLeft size={10}/> Detailed Context
            </label>
            <textarea 
              required
              name="desc"
              rows="8"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Describe what you were trying to do and what went wrong..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-5 px-6 text-white/90 text-[15px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10 resize-none leading-relaxed"
            />
          </div>

          {/* Code Snippet Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500 flex items-center gap-2 ml-1">
              <FaCode size={12}/> Code Lab (Optional)
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-emerald-500/10 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <textarea 
                name="code"
                rows="10"
                value={formData.code}
                onChange={handleChange}
                placeholder="// Paste the problematic code snippet here..."
                className="relative w-full bg-[#0a0a0c] border border-white/10 rounded-[1.5rem] py-6 px-8 text-emerald-400/90 font-mono text-[13px] focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-emerald-500/10 resize-none leading-loose shadow-2xl"
              />
            </div>
          </div>

          {/* Tags Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-primary flex items-center gap-2 ml-1">
              <FaTags size={12}/> Classify with Tags
            </label>
            <input 
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. javascript, react, debugging"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
            />
            <p className="text-[9px] text-secondary/40 font-medium px-2 uppercase tracking-widest">
              Separate tags with commas to help experts find you.
            </p>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full bg-primary hover:bg-blue-600 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-95 uppercase tracking-[0.2em] text-[11px] overflow-hidden"
            >
              {loading ? (
                <FaCircleNotch className="animate-spin" size={18} />
              ) : (
                <>
                  <FaPaperPlane size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Deploy Question</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 3. Sidebar Guidance */}
        <div className="lg:col-span-1">
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-8 sticky top-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                <FaRegLightbulb size={24}/>
              </div>
              <h4 className="text-white font-black text-xl italic">TIPS</h4>
            </div>

            <div className="space-y-8">
              {[
                { title: "The Summary", desc: "Keep the title clear. Think of it as a search query." },
                { title: "The Context", desc: "Explain what you've already tried. It saves time!" },
                { title: "The Clean Up", desc: "Remove API keys or sensitive data before posting." }
              ].map((tip, index) => (
                <div key={index} className="space-y-2 group">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary/30 group-hover:bg-primary transition-all rounded-full"></div>
                    <p className="text-white text-[11px] font-black uppercase tracking-widest">{tip.title}</p>
                  </div>
                  <p className="text-secondary/60 text-xs leading-relaxed font-medium pl-3">{tip.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] text-primary font-bold leading-relaxed italic uppercase tracking-tighter">
                "A well-asked question is half the answer."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;