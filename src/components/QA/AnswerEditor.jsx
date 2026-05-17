import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";
import { 
  FaPaperPlane, 
  FaUserCircle, 
  FaCircleNotch, 
  FaCode, 
  FaTimes, 
  FaLightbulb,
  FaCheckCircle,
  FaMagic
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AnswerEditor = ({ onPost }) => {
  const [answer, setAnswer] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    };
    getUser();
  }, []);

  const handlePost = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    await onPost(answer, codeSnippet); 
    setAnswer('');
    setCodeSnippet('');
    setShowCodeInput(false);
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 space-y-8"
    >
      <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.05)] relative overflow-hidden group">
        
        {/* Top Header: Identity & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shadow-xl ring-4 ring-white">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <FaUserCircle size={32} />
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-[3px]">Publishing Identity</span>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight font-syne">
                {userProfile?.full_name || 'Codefix Developer'}
              </h4>
            </div>
          </div>
          
          <button 
            onClick={() => setShowCodeInput(!showCodeInput)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all duration-300 border ${
              showCodeInput 
              ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100' 
              : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {showCodeInput ? <><FaTimes size={12}/> Close Code Lab</> : <><FaCode size={12}/> Attach Code Snippet</>}
          </button>
        </div>

        {/* Content Input Area */}
        <div className="space-y-6 relative z-10">
          <div className="relative">
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Describe your solution with precision. Senior developers prefer clear, architectural explanations..."
              rows="6"
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-8 px-8 text-slate-900 text-lg md:text-xl font-medium focus:outline-none focus:border-primary/20 focus:bg-white transition-all placeholder:text-slate-300 resize-none leading-relaxed shadow-inner"
            />
            {answer.length > 0 && (
              <div className="absolute top-4 right-8 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{answer.length} Characters</span>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showCodeInput && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.98, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[3px]">Source Code Processor</span>
                </div>
                <div className="bg-[#0d0e12] rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-50">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <textarea 
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Paste your logical fix or code snippet here..."
                    rows="8"
                    className="w-full bg-transparent text-white font-mono text-[14px] focus:outline-none transition-all resize-none leading-relaxed custom-scrollbar"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer & Submit */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-10 pt-10 border-t border-slate-50 relative z-10">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
              <FaLightbulb size={16} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">Pro Tip</p>
              <p className="text-[12px] font-medium leading-tight">High-quality code snippets earn <br className="hidden md:block" /> 2x more Reputation XP.</p>
            </div>
          </div>
          
          <button 
            onClick={handlePost}
            disabled={loading || !answer.trim()}
            className="group relative w-full md:w-auto h-16 px-12 rounded-2xl overflow-hidden shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {/* Multi-Color Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10 flex items-center justify-center gap-4 text-white">
              {loading ? (
                <FaCircleNotch className="animate-spin" size={16} />
              ) : (
                <FaPaperPlane size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
              <span className="text-[11px] font-black uppercase tracking-[4px]">
                {loading ? "Syncing..." : "Share Solution"}
              </span>
            </div>
          </button>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000"></div>
      </div>
    </motion.div>
  );
};

export default AnswerEditor;