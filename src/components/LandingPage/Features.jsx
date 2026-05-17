import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FaComments, 
  FaFilePdf, 
  FaTerminal,
  FaBolt,
  FaShieldAlt,
  FaRobot,
  FaCheckCircle,
  FaMagic,
  FaArrowRight,
  FaCode,
  FaDatabase,
  FaMicrochip,
  FaLock,
  FaGlobeAmericas,
  FaFileWord,
  FaFileExcel,
  FaSearch,
  FaUserShield,
  FaChartLine,
  FaSync,
  FaCloudDownloadAlt,
  FaHdd,
  FaKey,
  FaExchangeAlt
} from "react-icons/fa";
import SEO from '../../components/SEO';
import { motion, useReducedMotion } from 'framer-motion';

const Features = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const shouldReduceMotion = useReducedMotion();
  
  const fadeIn = shouldReduceMotion ? {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 }
  } : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  return (
    <div className={`bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      <SEO 
        title="Platform Capabilities" 
        description="Explore Codefix's comprehensive suite of AI engines, hybrid conversion tools, and developer utilities." 
      />
      
      {/* --- HERO HEADER --- */}
      <section className={`relative overflow-hidden ${isDashboard ? 'py-10' : 'pt-32 pb-24 lg:pt-56 lg:pb-40'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 text-center space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-2 rounded-full border border-white/10 shadow-2xl">
              <FaMagic className="text-primary text-[10px]" />
              <span className="text-[10px] font-black tracking-[4px] uppercase">Feature Deep Dive</span>
           </motion.div>
           
           <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading text-slate-900 leading-[1.1] tracking-[-0.04em] mb-10"
            > Built for the <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Elite Developer.
              </span>
           </motion.h1>
           <motion.p {...fadeIn} className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
              Codefix is more than just a tool—it's a synchronized ecosystem designed to handle every stage of your development workflow.
           </motion.p>
        </div>
      </section>

      {/* --- 1. 🤖 DEVINTEL AI ENGINE --- */}
      <section className="py-32 relative bg-white border-y border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <motion.div {...fadeIn} className="lg:w-1/2 space-y-10">
                  <div className="inline-block p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <FaRobot className="text-primary text-3xl" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 tracking-tighter leading-[1.1]">DevIntel AI <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Neural Core.</span></h2>
                  <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-xl">
                     Your personal technical architect, powered by Gemini 2.0. Context-aware assistance for debugging, refactoring, and documentation.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                     <StatusCheck text="Context-Aware Debugging" />
                     <StatusCheck text="Persistent Chat History" />
                     <StatusCheck text="Code Highlighting Engine" />
                     <StatusCheck text="Multi-Language Support" />
                  </div>
               </motion.div>
               <div className="lg:w-1/2 bg-slate-900 rounded-[3rem] p-10 border border-white/10 shadow-3xl">
                  <div className="font-mono text-xs md:text-sm space-y-6">
                     <div className="flex items-center gap-2 text-white/20 uppercase tracking-[3px] text-[10px] mb-8">AI-Terminal-v2.0</div>
                     <p className="text-primary/60">$ codefix --analyze snippets/</p>
                     <p className="text-emerald-400">// Scanning auth_flow.js...</p>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                        <p className="text-white/40 text-[10px] font-black tracking-widest">AI ARCHITECT:</p>
                        <p className="text-white text-sm font-medium">Memory leak detected in your current hook. Porting to useMemo for stability...</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- 2. 📄 HYBRID FILE CONVERSION ENGINE --- */}
      <section className="py-32 bg-slate-50/50 relative">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 tracking-tighter leading-[1.1]">Hybrid Conversion <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Architecture.</span></h2>
               <p className="text-slate-500 text-lg font-medium tracking-tight">Enterprise-grade cloud power mixed with 100% private local processing.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-10">
               {/* Cloud Engine */}
               <div className="bg-white border border-slate-200 p-12 rounded-[3.5rem] shadow-sm group hover:border-primary/40 transition-all duration-500">
                  <FaCloudDownloadAlt className="text-4xl text-primary mb-8" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Cloud Engine (Google v4)</h3>
                  <p className="text-slate-500 mb-8 font-medium">High-fidelity conversion for complex office formats with zero layout shift.</p>
                  <div className="grid grid-cols-1 gap-4">
                     <FeatureItem title="Word ↔ PDF" desc="Perfect layout preservation." />
                     <FeatureItem title="Excel → PDF" desc="Data-rich secure exports." />
                     <FeatureItem title="CORS-Safe" desc="Bypasses preflight limitations." />
                  </div>
               </div>
               
               {/* Local Engine */}
               <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5"><FaHdd className="text-9xl" /></div>
                  <FaShieldAlt className="text-4xl text-primary mb-8 relative z-10" />
                  <h3 className="text-2xl font-bold mb-6 relative z-10">Local Processor (Zero-Server)</h3>
                  <p className="text-white/50 mb-8 font-medium relative z-10">Processes files entirely in your browser memory for absolute privacy.</p>
                  <div className="grid grid-cols-1 gap-4 relative z-10">
                     <FeatureItem title="Merge & Split PDF" desc="Drag-and-drop reordering." white />
                     <FeatureItem title="Intelligent Compression" desc="Lossless size reduction." white />
                     <FeatureItem title="Image to PDF" desc="Instant batch conversion." white />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- 3. 💻 DEVELOPER NEURAL SUITE --- */}
      <section className="py-32 bg-white relative border-y border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
               <div className="max-w-xl">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 tracking-tighter leading-[1.1]">Developer Neural <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Utility Suite.</span></h2>
                  <p className="text-slate-500 text-lg font-medium mt-6">A state-of-the-art toolkit designed to streamline your daily engineering tasks.</p>
               </div>
               <div className="bg-slate-50 px-8 py-4 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-[4px]">15+ Professional Tools</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               <ToolCard icon={<FaTerminal />} title="JSON Formatter" desc="Prettify and validate nested payloads." />
               <ToolCard icon={<FaDatabase />} title="Base64 Engine" desc="Secure browser-side data encoding." />
               <ToolCard icon={<FaCode />} title="Regex Lab" desc="Live testing for pattern matching." />
               <ToolCard icon={<FaExchangeAlt />} title="Unit Converter" desc="PX to REM, HEX to RGB, and more." />
               <ToolCard icon={<FaBolt />} title="API Terminal" desc="Integrated HTTP client for endpoints." />
               <ToolCard icon={<FaKey />} title="Key Generator" desc="Cryptographically secure local secrets." />
            </div>
         </div>
      </section>

      {/* --- 4. 🤝 COMMUNITY QA HUB (THE MISSING PIECE) --- */}
      <section id="community" className="py-32 bg-slate-900 text-white relative overflow-hidden border-b border-white/5">
         <div className="absolute inset-0 bg-grid opacity-5"></div>
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 grid lg:grid-cols-12 gap-20 items-center relative z-10">
            <div className="lg:col-span-6 space-y-12">
               <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary text-3xl border border-primary/20">
                  <FaComments />
               </div>
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white tracking-tighter leading-[1.1]">Community QA <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Collaborative Hub.</span></h2>
               <p className="text-white/50 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-xl">
                  A dedicated ecosystem for developers to solve complex challenges. Engage in deeply threaded discussions with real-time solutions.
               </p>
               <div className="space-y-6">
                  <StatusCheck text="Interactive Technical Forum" white />
                  <StatusCheck text="Verified Senior Solutions" white />
                  <StatusCheck text="Real-time Knowledge Sharing" white />
                  <StatusCheck text="Community Knowledge Voting" white />
               </div>
            </div>
            
            <div className="lg:col-span-6">
               <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><FaComments className="text-[150px]" /></div>
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-xl">JD</div>
                     <div>
                        <p className="text-white font-bold text-lg">Senior Developer</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[3px]">Solution Contributor</p>
                     </div>
                  </div>
                  <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 text-lg text-slate-300 font-medium italic tracking-tight leading-relaxed">
                     "The threading issue was solved by implementing a custom mutex lock in the worker thread. View verified fix below."
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                     <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[3px]"><FaCheckCircle /> Solution Verified</div>
                     <div className="text-white/30 text-[10px] font-black uppercase tracking-[3px]">Active Thread #42</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- 5. 📊 DASHBOARD & AUTH --- */}
      <section className="py-32 bg-white relative">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2">
               <div className="grid grid-cols-2 gap-8">
                  <AuthBox icon={<FaUserShield />} title="Supabase Auth" desc="Enterprise Security" />
                  <AuthBox icon={<FaChartLine />} title="Activity Tracking" desc="Unified Monitoring" />
                  <AuthBox icon={<FaMagic />} title="Theme Engine" desc="Custom Workspace" />
                  <AuthBox icon={<FaLock />} title="Privacy First" desc="Zero-Knowledge" />
               </div>
            </div>
            <div className="lg:w-1/2 space-y-10">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 tracking-tighter leading-[1.1]">Elite Command <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard.</span></h2>
               <p className="text-slate-500 text-lg md:text-xl font-medium tracking-tight leading-relaxed">Your personal hub for authenticated operations. Monitor contributions, conversion history, and platform reputation.</p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-[2px]"><FaCheckCircle className="text-primary" /> Profile & Avatar Sync</li>
                  <li className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-[2px]"><FaCheckCircle className="text-primary" /> Contribution Tracking</li>
                  <li className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-[2px]"><FaCheckCircle className="text-primary" /> Multi-Session Management</li>
               </ul>
            </div>
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-48 relative">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
             <div className="bg-gradient-to-br from-primary via-indigo-700 to-black p-16 md:p-32 rounded-[5rem] text-center text-white shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10 space-y-12">
                   <h2 className="text-5xl md:text-8xl font-bold mb-10 tracking-tight leading-none">Initialize <br /> Your Stack.</h2>
                   <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                     <Link to="/signup">
                        <button className="bg-white text-black px-16 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] shadow-2xl hover:scale-105 transition-all">Join Codefix Elite</button>
                     </Link>
                     <Link to="/questions">
                        <button className="bg-black/20 text-white border border-white/20 backdrop-blur-xl px-16 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] hover:bg-white/10 transition-all">Explore Q&A</button>
                     </Link>
                   </div>
                </div>
             </div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StatusCheck = ({ text, white }) => (
  <div className="flex items-center gap-4">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] border shrink-0 ${white ? 'bg-white/10 border-white/20 text-white' : 'bg-primary/10 border-primary/20 text-primary'}`}>
      <FaCheckCircle />
    </div>
    <span className={`text-sm md:text-base font-bold tracking-tight ${white ? 'text-slate-400' : 'text-slate-600'}`}>{text}</span>
  </div>
);

const FeatureItem = ({ title, desc, white }) => (
   <div className="space-y-1 group">
      <h4 className={`font-bold text-lg tracking-tight ${white ? 'text-white' : 'text-slate-900'} group-hover:text-primary transition-colors`}>{title}</h4>
      <p className={`text-sm font-medium ${white ? 'text-white/40' : 'text-slate-500'}`}>{desc}</p>
   </div>
);

const ToolCard = ({ icon, title, desc }) => (
   <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-2xl transition-all duration-500 group flex flex-col h-full cursor-pointer">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary text-2xl mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">{icon}</div>
      <h4 className="font-bold text-slate-900 text-xl mb-3 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">{desc}</p>
   </div>
);

const AuthBox = ({ icon, title, desc }) => (
   <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 text-center space-y-3 group hover:bg-slate-900 transition-all duration-500">
      <div className="text-primary text-3xl mx-auto flex justify-center">{icon}</div>
      <h4 className="text-slate-900 font-bold text-lg group-hover:text-white transition-colors">{title}</h4>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px]">{desc}</p>
   </div>
);

export default Features;