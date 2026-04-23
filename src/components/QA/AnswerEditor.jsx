import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";
import { FaPaperPlane, FaUserCircle, FaCircleNotch, FaCode, FaTimes, FaLightbulb } from 'react-icons/fa';

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
    <div className="mt-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group">
        {/* Decorative Background Blur */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-[2.2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative bg-surface/30 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 md:p-8 shadow-2xl overflow-hidden">
          
          {/* Top Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 ml-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <FaUserCircle className="text-primary" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-secondary font-black uppercase tracking-tighter opacity-60">Writing Answer as</span>
                <span className="text-sm text-white font-bold tracking-tight">
                  {userProfile?.full_name || 'Codefix Developer'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`group/btn flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                showCodeInput 
                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'
              }`}
            >
              {showCodeInput ? <><FaTimes /> Close Code</> : <><FaCode /> Attach Code</>}
            </button>
          </div>

          {/* Main Answer Area */}
          <div className="relative mb-6">
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Describe your solution step-by-step..."
              rows="6"
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-white text-[15px] focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all placeholder:text-white/10 resize-none leading-relaxed"
            />
            {answer.length > 0 && (
               <div className="absolute bottom-4 right-6 text-[10px] text-white/20 font-mono">
                 {answer.length} chars
               </div>
            )}
          </div>

          {/* Dynamic Code Snippet Area */}
          {showCodeInput && (
            <div className="space-y-3 mb-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 text-primary/60 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Syntax Highlighter</span>
              </div>
              <div className="relative group/code">
                <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl blur opacity-0 group-focus-within/code:opacity-100 transition duration-500"></div>
                <textarea 
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Paste your code or logic here..."
                  rows="8"
                  className="relative w-full bg-[#0d0e12] border border-white/10 rounded-2xl py-5 px-4 md:px-6 text-white font-mono text-[13px] focus:outline-none focus:border-primary/50 transition-all resize-none shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Footer Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-6">
            <div className="flex items-center gap-3 text-secondary/50">
              <FaLightbulb className="text-yellow-500/50" size={14} />
              <p className="text-[11px] italic leading-tight">
                Be clear and concise. Community votes help <br className="hidden md:block" /> your profile grow!
              </p>
            </div>
            
            <button 
              onClick={handlePost}
              disabled={loading || !answer.trim()}
              className="group/submit relative w-full md:w-auto overflow-hidden bg-primary hover:bg-blue-600 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-white font-black px-12 py-4 rounded-2xl transition-all active:scale-95"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]">
                {loading ? <FaCircleNotch className="animate-spin" size={14} /> : <FaPaperPlane size={12}/>}
                <span>{loading ? "Publishing..." : "Post Solution"}</span>
              </div>
              
              {/* Button Shine Effect */}
              {!loading && (
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover/submit:animate-shine"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerEditor;