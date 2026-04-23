import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  FaCode, 
  FaDatabase, 
  FaHashtag, 
  FaTerminal, 
  FaArrowRight, 
  FaHistory, 
  FaLayerGroup,
  FaBolt,
  FaRobot,
  FaMagic,
  FaPlus,
  FaChartLine
} from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useOutletContext();
  
  // --- States ---
  const [stats, setStats] = useState({ questions: 0, answers: 0, reputation: 0 });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching Logic (Stats Only) ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const [questionsCount, answersCount, recentQs] = await Promise.all([
            supabase.from('questions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('answers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('questions').select('id, title, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3)
          ]);

          const calculatedRep = (questionsCount.count * 10) + (answersCount.count * 25);

          setStats({
            questions: questionsCount.count || 0,
            answers: answersCount.count || 0,
            reputation: calculatedRep || 10
          });
          setRecentQuestions(recentQs.data || []);
        }
      } catch (err) {
        console.error("Dashboard Stats Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Developer';

  return (
    <div className="space-y-10 pb-10">
      
      {/* --- 1. WELCOME HEADER --- */}
      <div className="relative group">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div className="space-y-4">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
             >
                <FaMagic className="text-primary text-[10px]" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest uppercase">Workspace Live</span>
             </motion.div>
             <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-none">
               {loading ? "Initializing..." : `Hello, ${displayName}!`}
             </h1>
             <p className="text-secondary text-base md:text-lg font-medium opacity-60 italic max-w-xl">
               "Your dashboard is synced with the latest community fixes and AI modules. Ready to build?"
             </p>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard/qa/ask')}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-4 bg-primary hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 group"
          >
            <FaPlus className="text-sm group-hover:rotate-90 transition-transform" />
            Launch Discussion
          </button>
        </div>
      </div>

      {/* --- 2. STATS & UTILITIES GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: STATS & TOOLS (8 Cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Total Questions" value={stats.questions} icon={<FaHistory className="text-blue-400" />} color="blue" />
            <StatCard title="Verified Fixes" value={stats.answers} icon={<FaBolt className="text-emerald-400" />} color="emerald" />
            <StatCard title="Reputation" value={stats.reputation} icon={<FaChartLine className="text-primary" />} color="primary" />
          </div>

          {/* QUICK LAUNCH */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3 tracking-tight">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
                  Neural Utilities
                </h2>
                <button onClick={() => navigate('/dashboard/dev-utilities')} className="text-[10px] font-bold text-primary uppercase tracking-[3px] hover:underline">Full Library</button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <UtilityQuickLink icon={<FaCode />} title="JSON" path="json-formatter" color="blue" />
                <UtilityQuickLink icon={<FaDatabase />} title="Base64" path="base64-converter" color="primary" />
                <UtilityQuickLink icon={<FaHashtag />} title="Regex" path="regex-tester" color="emerald" />
                <UtilityQuickLink icon={<FaTerminal />} title="API" path="api-tester" color="amber" />
             </div>
          </div>
        </div>

        {/* RIGHT: RECENT ACTIVITY (4 Cols) */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col backdrop-blur-xl shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-1">
              <div className="w-24 h-24 -mr-12 -mt-12 bg-primary blur-3xl opacity-10 rounded-full group-hover:opacity-20 transition-opacity"></div>
           </div>

           <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3 tracking-tight">
              <FaHistory className="text-primary text-sm" />
              Stream History
           </h3>

           <div className="flex-1 space-y-8 relative z-10">
              {recentQuestions.length > 0 ? recentQuestions.map(q => (
                <div key={q.id} className="group/item cursor-pointer" onClick={() => navigate(`/dashboard/questions/${q.id}`)}>
                   <p className="text-slate-200 font-semibold text-base leading-tight line-clamp-2 group-hover/item:text-primary transition-colors">{q.title}</p>
                   <p className="text-[10px] text-secondary/40 mt-2 uppercase font-bold tracking-[2px] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span> Posted Recently
                   </p>
                   <div className="h-[1px] w-full bg-white/5 mt-6 group-last:hidden"></div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                   <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-6">
                      <FaHistory className="text-lg" />
                   </div>
                   <p className="text-[10px] font-bold uppercase tracking-widest">No Recent Stream</p>
                </div>
              )}
           </div>

           <button onClick={() => navigate('/dashboard/questions')} className="mt-10 flex items-center justify-center gap-2 text-white/30 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest group/btn border border-white/5 py-4 rounded-2xl bg-white/5">
              Access Full Feed <FaArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* --- 3. MODULES SECTION --- */}
      <div className="space-y-8 pt-10">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-3 tracking-tight">
          <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"></span>
          Nexus Modules
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard 
            title="File Power Tools" 
            desc="Batch process documents and assets with local encryption and military-grade speed."
            tags={['v2.5', 'Secure']}
            icon={<FaLayerGroup />}
            color="blue"
            onClick={() => navigate('/dashboard/tools')}
          />

          <ModuleCard 
            title="Community Hub" 
            desc="Solve bugs together. Access verified solutions and earn global reputation points."
            tags={['Global', 'Live']}
            icon={<FaHistory />}
            color="purple"
            onClick={() => navigate('/dashboard/questions')}
          />

          <ModuleCard 
            title="AI Neural Core" 
            desc="Advanced LLM modules integrated to refactor, document, and fix your codebase."
            tags={['Pro', 'AI']}
            icon={<FaRobot />}
            color="emerald"
            onClick={() => navigate('/ai-assistant')}
          />
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "hover:border-blue-500/40 hover:bg-blue-500/[0.02]",
    emerald: "hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]",
    primary: "hover:border-primary/40 hover:bg-primary/[0.02]"
  };
  return (
    <div className={`bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] transition-all group ${colors[color]} shadow-xl backdrop-blur-sm`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all border border-white/5">{icon}</div>
        <p className="text-secondary/50 text-[10px] font-bold uppercase tracking-[2px]">{title}</p>
      </div>
      <h3 className="text-4xl font-semibold text-white tabular-nums tracking-tight">{value}</h3>
    </div>
  );
};

const UtilityQuickLink = ({ icon, title, path, color }) => {
  const navigate = useNavigate();
  const colors = {
    blue: "text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/10 hover:border-blue-500/30",
    primary: "text-primary bg-primary/5 hover:bg-primary/10 border-primary/10 hover:border-primary/30",
    emerald: "text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 hover:border-emerald-500/30",
    amber: "text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/10 hover:border-amber-500/30"
  };
  return (
    <button 
      onClick={() => navigate(`/dashboard/dev-utilities/${path}`)}
      className={`flex flex-col items-center gap-4 p-5 rounded-[2rem] border transition-all ${colors[color]} group`}
    >
      <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
    </button>
  );
};

const ModuleCard = ({ title, desc, tags, icon, color, onClick }) => {
  const colors = {
    blue: "hover:border-blue-500/30 group-hover:text-blue-400",
    purple: "hover:border-purple-500/30 group-hover:text-purple-400",
    emerald: "hover:border-emerald-500/30 group-hover:text-emerald-400"
  };
  return (
    <div onClick={onClick} className={`bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-[3rem] ${colors[color]} transition-all cursor-pointer group relative overflow-hidden shadow-2xl hover:bg-white/[0.04]`}>
      <div className="absolute top-0 right-0 p-1">
         <div className={`w-32 h-32 -mr-16 -mt-16 blur-[60px] opacity-10 rounded-full ${color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
      </div>

      <div className={`mb-8 w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform border border-white/5 ${color === 'blue' ? 'text-blue-400' : color === 'purple' ? 'text-purple-400' : 'text-emerald-400'}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-secondary text-sm leading-relaxed mb-10 font-medium opacity-50 line-clamp-2">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-[9px] text-white/40 bg-white/5 px-4 py-2 rounded-full uppercase font-bold tracking-widest border border-white/5">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;