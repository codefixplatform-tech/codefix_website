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
  FaBolt,
  FaRobot,
  FaPlus,
  FaChevronRight,
  FaStar,
  FaBrain,
  FaClock,
  FaRocket,
  FaShieldAlt,
  FaFire,
  FaGlobe,
  FaGithub,
  FaCheckCircle,
  FaLock,
  FaUsers,
  FaFilePdf,
  FaExchangeAlt,
  FaCompressAlt
} from "react-icons/fa";
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useOutletContext();
  
  const [stats, setStats] = useState({ questions: 0, answers: 0, reputation: 0 });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [trendingInquiries, setTrendingInquiries] = useState([
    { id: 1, title: "Optimizing WebAssembly for PDF compression", views: "1.2k" },
    { id: 2, title: "Securing Supabase Edge Functions with OAuth", views: "850" },
    { id: 3, title: "Framer Motion vs React Spring in 2026", views: "2.4k" }
  ]);
  const [loading, setLoading] = useState(true);

  const checklistItems = [
    { id: 1, text: "Establish Profile Identity", done: !!profile?.full_name },
    { id: 2, text: "Launch First Neural Inquiry", done: stats.questions > 0 },
    { id: 3, text: "Verify 1 Community Solution", done: stats.answers > 0 },
    { id: 4, text: "Reach Reputation Level 5", done: stats.reputation >= 1000 }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const [questionsCount, answersCount, recentQs] = await Promise.all([
            supabase.from('questions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('answers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('questions').select('id, title, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(4)
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Developer';

  return (
    <div className="min-h-screen space-y-12 pb-20 selection:bg-primary/10">
      
      {/* 🚀 1. SYSTEM MONITOR BAR */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[3px]">Systems Operational</span>
          </div>
          <div className="hidden sm:flex items-center gap-2.5 text-slate-400">
             <FaGlobe size={10} />
             <span className="text-[9px] font-black uppercase tracking-[2px]">Node: ASIA-SOUTH-01</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <FaShieldAlt className="text-emerald-500 text-[10px]" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[4px]">E2E Encryption: Active</span>
           </div>
           <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></motion.div>
           </div>
        </div>
      </div>

      {/* 👑 2. SIGNATURE HERO & WELCOME */}
      <section className="relative">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div className="space-y-6">
            <h2 className="text-[11px] font-black text-primary uppercase tracking-[8px] ml-1">{getGreeting()}</h2>
            <h1 className="text-6xl sm:text-7xl md:text-[95px] font-bold text-slate-900 tracking-tighter leading-[0.85] font-syne">
              Welcome Back,  <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-purple-600">
                {displayName}.
              </span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Experience the powerhouse of AI, Q&A, and **Local-First PDF utilities** all in one synchronized workspace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <motion.button 
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/qa/ask')}
              className="h-16 px-10 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[4px] shadow-2xl hover:bg-black transition-colors duration-200 flex items-center justify-center gap-4 group"
            >
              <FaPlus size={12} className="group-hover:rotate-90 transition-transform" />
              <span>Broadcast Inquiry</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* 📊 3. ANALYTICS & ONBOARDING STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Reputation" value={stats.reputation} icon={<FaStar />} subValue="Rank: Elite" color="primary" delay={0.1} sparkData={[20, 30, 25, 40, 35, 50, 45]} />
          <MetricCard label="Verified Fixes" value={stats.answers} icon={<FaBolt />} subValue="Top 2% Globally" color="emerald" delay={0.2} sparkData={[10, 15, 12, 18, 20, 25, 22]} />
          <MetricCard label="Active Requests" value={stats.questions} icon={<FaHistory />} subValue="Live Tracking" color="indigo" delay={0.3} sparkData={[5, 8, 7, 10, 9, 12, 11]} />
        </div>

        <div className="lg:col-span-4 bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <FaRocket size={80} className="group-hover:translate-x-4 transition-transform duration-1000" />
           </div>
           <h3 className="text-xl font-bold font-syne mb-6 relative z-10">Workspace Onboarding</h3>
           <div className="space-y-4 relative z-10">
              {checklistItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 bg-white/5'}`}>
                      {item.done ? <FaCheckCircle size={12} /> : <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>}
                   </div>
                   <span className={`text-[11px] font-bold uppercase tracking-widest ${item.done ? 'text-white/40 line-through' : 'text-white/80'}`}>{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 🧩 4. PDF POWER MODULE (NEW: Highlighting PDF Tools) */}
      <section className="space-y-8">
         <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">PDF Infrastructure</h3>
            <div className="flex-1 h-[1px] bg-slate-100"></div>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
               whileHover={{ translateY: -5 }}
               onClick={() => navigate('/dashboard/tools')}
               className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm group cursor-pointer relative overflow-hidden"
            >
               <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform">
                  <FaCompressAlt size={120} />
               </div>
               <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm">
                  <FaCompressAlt size={24} />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-3 font-syne tracking-tight">PDF Compressor</h4>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">Extreme local compression without loss of clarity. 100% browser-side processing.</p>
            </motion.div>

            <motion.div 
               whileHover={{ translateY: -5 }}
               onClick={() => navigate('/dashboard/tools')}
               className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm group cursor-pointer relative overflow-hidden"
            >
               <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform">
                  <FaExchangeAlt size={120} />
               </div>
               <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                  <FaExchangeAlt size={24} />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-3 font-syne tracking-tight">Word to PDF</h4>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">High-fidelity conversion from Word documents to PDF with zero formatting loss.</p>
            </motion.div>

            <motion.div 
               whileHover={{ translateY: -5 }}
               onClick={() => navigate('/dashboard/tools')}
               className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl group cursor-pointer relative overflow-hidden border border-white/5"
            >
               <div className="absolute -right-5 -bottom-5 opacity-10 group-hover:scale-110 transition-transform">
                  <FaFilePdf size={120} />
               </div>
               <h4 className="text-xl font-bold text-white mb-3 font-syne tracking-tight">Security-First Protocol</h4>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">Your documents never reach our servers. We use WebAssembly to process files locally.</p>
               <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs">
                  <span>Explore PDF Stack</span>
                  <FaArrowRight size={10} />
               </div>
            </motion.div>
         </div>
      </section>

      {/* 🧭 5. THE ECOSYSTEM OVERVIEW */}
      <section className="space-y-10">
         <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">Ecosystem Pillars</h3>
            <div className="flex-1 h-[1px] bg-slate-100"></div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TourCard icon={<FaBrain className="text-primary" />} title="AI Assistant" desc="Refactor code and find bugs with Neural Intelligence." link="/ai-assistant" />
            <TourCard icon={<FaUsers className="text-indigo-500" />} title="Community Hub" desc="Broadcast struggles to senior engineers globally." link="/dashboard/questions" />
            <TourCard icon={<FaLock className="text-emerald-500" />} title="Local-First" desc="Process data securely without touching the cloud." link="/dashboard/tools" />
            <TourCard icon={<FaStar className="text-amber-500" />} title="XP System" desc="Earn reputation by fixing community issues." link="/dashboard/activity" />
         </div>
      </section>

      {/* 🛠️ 6. INFRASTRUCTURE & TOOLS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <motion.div whileHover={{ translateY: -5 }} onClick={() => navigate('/ai-assistant')} className="relative bg-slate-900 rounded-[3.5rem] p-10 md:p-14 overflow-hidden group cursor-pointer shadow-2xl border border-white/5">
             <div className="absolute top-0 right-0 p-8 opacity-20">
                <FaRobot size={150} className="text-white group-hover:scale-110 transition-transform duration-1000" />
             </div>
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
             <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-[4px]">Neural Cluster: Online</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter font-syne leading-tight">Sync With <br /> Neural Intelligence.</h2>
                <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed">Collaborative refactoring at the speed of thought.</p>
             </div>
          </motion.div>

          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">Power Toolbox</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[4px]">Atomic Processing Core</p>
              </div>
              <button onClick={() => navigate('/dashboard/tools')} className="text-[10px] font-black text-primary uppercase tracking-[3px] hover:underline">Full Catalog</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <QuickTool icon={<FaCode />} label="JSON Lab" path="json-formatter" desc="Code Styling" />
              <QuickTool icon={<FaDatabase />} label="Base64" path="base64-converter" desc="Data Streams" />
              <QuickTool icon={<FaHashtag />} label="Regex" path="regex-tester" desc="Pattern Engine" />
              <QuickTool icon={<FaTerminal />} label="Probes" path="api-tester" desc="Network Lab" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-syne">Trending</h3>
                 <FaFire className="text-orange-500 animate-pulse" />
              </div>
              <div className="space-y-8">
                 {trendingInquiries.map(item => (
                   <div key={item.id} className="group cursor-pointer">
                      <p className="text-slate-800 font-bold text-sm leading-snug group-hover:text-primary transition-colors">{item.title}</p>
                      <div className="flex items-center gap-3 mt-3">
                         <span className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">{item.views} fixes synced</span>
                         <div className="flex-1 h-[0.5px] bg-slate-100"></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 space-y-10">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-syne">Intelligence Stack</h3>
                 <FaGithub size={20} className="text-slate-300" />
              </div>
              <div className="space-y-6">
                 <LanguageProgress label="React / TS" percent="85%" color="bg-primary" />
                 <LanguageProgress label="Node / SQL" percent="42%" color="bg-indigo-500" />
                 <LanguageProgress label="Python" percent="15%" color="bg-emerald-500" />
              </div>
           </div>
        </div>
      </section>

      <div className="text-center pt-20 text-[10px] font-black uppercase tracking-[15px] text-slate-400 pointer-events-none mb-10">
        Codefix Professional Elite
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, subValue, color, delay, sparkData }) => {
  const colors = {
    primary: "text-primary bg-primary/5 border-primary/10 shadow-primary/5",
    emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10 shadow-emerald-500/5",
    indigo: "text-indigo-500 bg-indigo-500/5 border-indigo-500/10 shadow-indigo-500/5",
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay,
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-shadow duration-300 group"
    >
      <div className="flex justify-between items-start mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${colors[color]}`}>
          {icon}
        </div>
        <div className="text-right">
           <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest block">{subValue}</span>
           <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest mt-1 block">Live Feed</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h3 className="text-5xl font-bold text-slate-900 tabular-nums tracking-tighter">{value}</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[4px]">{label}</p>
        </div>
        <div className="flex items-end gap-1 h-12 mb-2">
           {sparkData.map((h, i) => (
             <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: delay + (i * 0.05) }} className={`w-1 rounded-full ${color === 'primary' ? 'bg-primary/20' : color === 'emerald' ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}></motion.div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

const TourCard = ({ icon, title, desc, link }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(link)} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all cursor-pointer group">
       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
       <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-tight mb-3">{title}</h4>
       <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
};

const QuickTool = ({ icon, label, path, desc }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(`/dashboard/dev-utilities/${path}`)}
      className="flex flex-col items-center justify-center gap-5 p-8 bg-slate-50 border border-slate-50 rounded-[2.5rem] hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all group"
    >
      <div className="text-3xl text-slate-200 group-hover:text-primary transition-colors">{icon}</div>
      <div className="text-center">
        <span className="block text-[11px] font-black text-slate-900 uppercase tracking-[2px]">{label}</span>
        <span className="block text-[8px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">{desc}</span>
      </div>
    </button>
  );
};

const LanguageProgress = ({ label, percent, color }) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-900">{label}</span>
        <span className="text-slate-400">{percent}</span>
     </div>
     <div className="w-full h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden shadow-inner">
        <motion.div initial={{ width: 0 }} animate={{ width: percent }} transition={{ duration: 1.5 }} className={`h-full ${color}`}></motion.div>
     </div>
  </div>
);

export default DashboardHome;