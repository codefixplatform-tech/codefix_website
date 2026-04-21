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
  FaRobot
} from "react-icons/fa";

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
          // stats aur activity fetch karen (Profile layout se aa raha ha)
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
            {loading ? "Welcome Back..." : `Hello, ${displayName}!`}
          </h1>
          <p className="text-secondary mt-3 text-sm md:text-base font-medium opacity-80 italic">
            "The best way to predict the future is to create it."
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard/qa/ask')}
          className="group flex items-center gap-3 bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
        >
          <span className="text-lg">+</span>
          Ask Question
        </button>
      </div>

      {/* 2. Stats & Utilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Questions" value={stats.questions} icon={<FaHistory className="text-blue-400" />} color="blue" />
            <StatCard title="Verified Fixes" value={stats.answers} icon={<FaBolt className="text-emerald-400" />} color="emerald" />
            <StatCard title="Reputation" value={stats.reputation} icon={<FaLayerGroup className="text-primary" />} color="primary" />
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
                  Quick Launch Utilities
                </h2>
                <button onClick={() => navigate('/dashboard/dev-utilities')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <UtilityQuickLink icon={<FaCode />} title="JSON" path="json-formatter" color="blue" />
                <UtilityQuickLink icon={<FaDatabase />} title="Base64" path="base64-converter" color="primary" />
                <UtilityQuickLink icon={<FaHashtag />} title="Regex" path="regex-tester" color="emerald" />
                <UtilityQuickLink icon={<FaTerminal />} title="API" path="api-tester" color="amber" />
             </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="bg-surface/30 border border-white/5 rounded-[2.5rem] p-8 flex flex-col backdrop-blur-xl">
           <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
              <FaHistory className="text-secondary text-sm" />
              Recent Activity
           </h3>
           <div className="flex-1 space-y-6">
              {recentQuestions.length > 0 ? recentQuestions.map(q => (
                <div key={q.id} className="group cursor-pointer" onClick={() => navigate(`/dashboard/questions/${q.id}`)}>
                   <p className="text-slate-200 font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{q.title}</p>
                   <p className="text-[10px] text-secondary/60 mt-1 uppercase font-black tracking-widest tabular-nums">Posted Recently</p>
                   <div className="h-[1px] w-full bg-white/5 mt-4 group-last:hidden"></div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                   <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4">
                      <span className="text-xs">?</span>
                   </div>
                   <p className="text-xs font-bold uppercase tracking-widest">No Activity Yet</p>
                </div>
              )}
           </div>
           <button onClick={() => navigate('/dashboard/qa')} className="mt-8 flex items-center justify-center gap-2 text-white/50 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest group">
              Global Feed <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* 3. Core Integrated Modules */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          Integrated Modules
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard 
            title="File Power Tools" 
            desc="Batch convert PDFs, optimize images, and manage assets with military-grade speed."
            tags={['v2.0', 'Secure']}
            icon={<FaLayerGroup />}
            color="blue"
            onClick={() => navigate('/dashboard/tools')}
          />

          <ModuleCard 
            title="Dev Q&A Hub" 
            desc="Solve bugs together. Access verified solutions and earn reputation points."
            tags={['Community', 'Fixes']}
            icon={<FaHistory />}
            color="purple"
            onClick={() => navigate('/dashboard/questions')}
          />

          <ModuleCard 
            title="AI Code Assistant" 
            desc="Gemini powered models to help you refactor and document your codebase instantly."
            tags={['Pro', 'GPT']}
            icon={<FaRobot />}
            color="emerald"
            onClick={() => navigate('/ai-assistant')}
          />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "group-hover:border-blue-500/40",
    emerald: "group-hover:border-emerald-500/40",
    primary: "group-hover:border-primary/40"
  };
  return (
    <div className={`bg-surface/40 border border-white/5 p-6 rounded-[2rem] transition-all group ${colors[color]}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
        <p className="text-secondary text-[10px] font-black uppercase tracking-widest">{title}</p>
      </div>
      <h3 className="text-3xl font-black text-white tabular-nums">{value}</h3>
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
      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${colors[color]}`}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
    </button>
  );
};

const ModuleCard = ({ title, desc, tags, icon, color, onClick }) => {
  const colors = {
    blue: "hover:border-blue-500/30",
    purple: "hover:border-purple-500/30",
    emerald: "hover:border-emerald-500/30"
  };
  return (
    <div onClick={onClick} className={`bg-surface/30 border border-white/5 p-8 rounded-[2.5rem] ${colors[color]} transition-all cursor-pointer group relative overflow-hidden`}>
      <div className={`mb-6 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${color === 'blue' ? 'text-blue-400' : color === 'purple' ? 'text-purple-400' : 'text-emerald-400'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-secondary text-sm leading-relaxed mb-6 opacity-60 line-clamp-2">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-[9px] text-white/30 bg-white/5 px-3 py-1 rounded-full uppercase font-black tracking-widest">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;