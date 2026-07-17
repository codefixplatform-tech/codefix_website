import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaMicrochip, 
  FaUsers, 
  FaArrowRight, 
  FaShieldAlt, 
  FaBolt, 
  FaCode, 
  FaLayerGroup,
  FaGlobeAmericas,
  FaNetworkWired,
  FaCubes,
  FaDatabase,
  FaCloud,
  FaHdd,
  FaLock,
  FaBrain,
  FaFlag,
  FaEye,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";
import SEO from '../../components/SEO';
import { motion, useReducedMotion } from 'framer-motion';

const About = () => {
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
        title="Our Engineering Manifesto" 
        description="Discover the 10 pillars of Codefix: Precision architecture, decentralized intelligence, and the future of professional dev workflows." 
      />
      
      {/* 1. HERO SECTION: THE VISION */}
      <section className={`relative overflow-hidden ${isDashboard ? 'py-10' : 'pt-24 pb-16 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 text-center space-y-8 sm:space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-slate-900 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-white/10 shadow-2xl max-w-full">
              <FaRocket className="text-primary text-[10px] shrink-0" />
              <span className="text-[8px] sm:text-[10px] font-bold tracking-[2px] sm:tracking-[4px] uppercase truncate max-w-[180px] xs:max-w-none">The Story of Codefix</span>
           </motion.div>
           
           <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading text-slate-900 leading-[1.1] tracking-[-0.04em] mb-6 sm:mb-10"
            > Reimagining the <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dev Workflow.
              </span>
           </motion.h1>
           <motion.p {...fadeIn} className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
              We started with a simple question: Why do developers have to switch between a dozen tabs just to fix a bug, convert a file, or ask a question?
           </motion.p>
        </div>
      </section>

      {/* 2. THE ARCHITECTURE: CORE PILLARS */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-white border-y border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
               <motion.div {...fadeIn} className="space-y-8 sm:space-y-12">
                   <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 leading-tight tracking-tight">Precision Engineering. <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Infinite Velocity.</span></h2>
                   <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-xl">
                     We don't just build tools; we architect ecosystems. Codefix is centered around three non-negotiable pillars of modern engineering excellence.
                  </p>
                  
                  <div className="space-y-8 sm:space-y-10">
                     <StoryItem icon={<FaMicrochip />} title="Neural Intelligence" desc="Localized AI inference that understands project intent without leaking source code." />
                     <StoryItem icon={<FaLayerGroup />} title="WASM-Isolated Runtimes" desc="Enterprise-grade file processing powered by memory-safe WebAssembly sandboxes." />
                     <StoryItem icon={<FaNetworkWired />} title="Decentralized Wisdom" desc="A community-driven knowledge layer where solutions are verified by performance." />
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="relative group w-full"
               >
                  <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-slate-900 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] p-6 sm:p-12 md:p-16 shadow-3xl overflow-hidden border border-white/5 text-white">
                     <div className="absolute top-0 right-0 p-12 opacity-5"><FaCubes className="text-[200px]" /></div>
                     <div className="space-y-8 sm:space-y-10 relative z-10">
                        <div className="flex items-center gap-4 text-primary">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-[5px]">Platform Stats v2.4</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6 sm:gap-10">
                           <StatBlock value="P99" label="Latency Metric" />
                           <StatBlock value="42ms" label="Cold Start Avg" />
                           <StatBlock value="100%" label="Local Privacy" />
                           <StatBlock value="15.8k" label="Neural Nodes" />
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 3. THE TECHNOLOGY STACK: SYNCED NODES */}
      <section className="py-16 md:py-24 bg-slate-50/50">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="text-center mb-12 md:mb-16 space-y-6">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 leading-tight tracking-tight">The Full <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Stack Sync.</span></h2>
               <p className="text-slate-500 text-lg font-medium">Integrated technologies working in perfect harmony.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
               <TechBadge icon={<FaCode />} label="React 19" />
               <TechBadge icon={<FaDatabase />} label="PostgreSQL" />
               <TechBadge icon={<FaCloud />} label="Supabase" />
               <TechBadge icon={<FaBrain />} label="Gemini 2.0" />
               <TechBadge icon={<FaHdd />} label="WASM Native" />
               <TechBadge icon={<FaLock />} label="AES-256" />
            </div>
         </div>
      </section>

      {/* 4. PHILOSOPHY: OUR THREE CORE VALUES */}
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
               <ValueBox 
                  icon={<FaEye />} 
                  title="Radical Transparency" 
                  desc="We believe in open systems. Your data flow is always visible, local, and under your control." 
               />
               <ValueBox 
                  icon={<FaBolt />} 
                  title="High-Velocity CX" 
                  desc="Every interaction is optimized for the shortest path between a developer's thought and its execution." 
               />
               <ValueBox 
                  icon={<FaShieldAlt />} 
                  title="Zero-Trust Privacy" 
                  desc="Our architecture assumes the network is compromised. Encryption happens at the edge, in your browser." 
               />
            </div>
         </div>
      </section>

      {/* 5. GLOBAL MISSION: THE DISTRIBUTED NODE */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-grid opacity-5"></div>
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
            <div className="lg:w-1/2 space-y-8 sm:space-y-10">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white leading-tight tracking-tight">A Global <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Engineering Hub.</span></h2>
               <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-xl">
                  Codefix isn't just a website; it's a node in a global engineering network. We're connecting developers from every corner of the world through verified technical solutions.
               </p>
               <div className="flex items-center gap-10">
                  <div className="text-center">
                     <p className="text-4xl font-bold">120+</p>
                     <p className="text-[10px] text-primary font-black uppercase tracking-[3px]">Countries</p>
                  </div>
                  <div className="text-center">
                     <p className="text-4xl font-bold">50M+</p>
                     <p className="text-[10px] text-primary font-black uppercase tracking-[3px]">Syncs/Month</p>
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 relative flex justify-center w-full">
               <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/20 blur-[150px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
               <FaGlobeAmericas className="text-[150px] md:text-[400px] text-primary/40 animate-pulse relative z-10" />
            </div>
         </div>
      </section>

      {/* 6. SECURITY DEEP DIVE: ENCRYPTION PROTOCOLS */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 flex flex-col-reverse lg:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 space-y-8 sm:space-y-10 text-center lg:text-left">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 leading-tight tracking-tight">Military-Grade <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Data Isolation.</span></h2>
               <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-xl ml-auto lg:ml-0">
                  Every file conversion and code analysis happens in a transient WASM sandbox. We use AES-256 for local state encryption, ensuring zero data leakage.
               </p>
               <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <span className="bg-slate-50 border border-slate-200 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px]">E2E Encrypted</span>
                  <span className="bg-slate-50 border border-slate-200 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px]">SOC-2 Ready</span>
                  <span className="bg-slate-50 border border-slate-200 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px]">WASM Sandbox</span>
               </div>
            </div>
            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4 sm:gap-8">
               <SecurityPoint icon={<FaLock />} title="TLS 1.3" />
               <SecurityPoint icon={<FaShieldAlt />} title="Auth Sync" />
               <SecurityPoint icon={<FaBrain />} title="Neural Mask" />
               <SecurityPoint icon={<FaDatabase />} title="Local DB" />
            </div>
         </div>
      </section>

      {/* 7. COMMUNITY IMPACT: THE HUMAN LAYER */}
      <section className="py-16 md:py-24 bg-slate-50/30">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 sm:space-y-10">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 leading-tight tracking-tight">The Human <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Component.</span></h2>
               <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
                  Behind the neural cores and high-speed engines is a commitment to the developer experience. We build for humans, by humans.
               </p>
               <div className="space-y-4">
                  <BenefitRow text="Active Solution Contribution" />
                  <BenefitRow text="Reputation XP Economy" />
                  <BenefitRow text="Verified Senior Mentorship" />
               </div>
            </div>
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] border border-slate-200 shadow-2xl relative group w-full">
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center gap-6 mb-6 sm:mb-10">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl">CB</div>
                  <div>
                     <p className="text-xl font-bold text-slate-900">Platform Vision</p>
                     <p className="text-[10px] text-primary font-black uppercase tracking-[4px]">Codefix Protocol</p>
                  </div>
               </div>
               <p className="text-slate-500 text-base sm:text-lg leading-relaxed italic font-medium">"Our goal is to reduce the cognitive load of engineering. We want developers to focus on creation, while Codefix handles the utility."</p>
            </div>
         </div>
      </section>

      {/* 8. OUR COMMITMENT: THE FUTURE */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 space-y-8 sm:space-y-10">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 leading-tight tracking-tight">Shaping the <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Future Roadmap.</span></h2>
               <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-xl">
                  We are just getting started. From automated refactoring to collaborative neural workspaces, our roadmap is driven by your feedback.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
                  <FutureGoal icon={<FaLightbulb />} title="AI Refactor v3" />
                  <FutureGoal icon={<FaFlag />} title="Global Meetups" />
               </div>
            </div>
            <div className="lg:w-1/2 w-full">
               <div className="bg-slate-900 p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] md:rounded-[3.5rem] text-white shadow-3xl">
                  <h3 className="text-2xl font-bold mb-8">Quarterly Sync</h3>
                  <div className="space-y-6">
                     <SyncPhase label="PHASE 01: NEURAL CORE" active />
                     <SyncPhase label="PHASE 02: DISTRIBUTED STORAGE" />
                     <SyncPhase label="PHASE 03: AGENTIC WORKFLOWS" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 9. FINAL CTA: INITIALIZE JOURNEY */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-white">
         <div className="max-w-[1400px] mx-auto px-6 sm:px-16 lg:px-24">
            <motion.div 
               whileHover={{ scale: 1.005 }}
               className="bg-gradient-to-br from-slate-900 via-indigo-950 to-black p-8 sm:p-16 md:p-24 rounded-[2.5rem] md:rounded-[4rem] text-center text-white shadow-3xl border border-white/5 relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-grid opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"></div>
               {/* Ambient Glow */}
               <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-all duration-1000"></div>
               <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-900/30 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-900/40 transition-all duration-1000"></div>
               
               <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight tracking-tight text-white">
                     The Future <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-400">
                        is Neural.
                     </span>
                  </h2>
                  <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed tracking-tight">
                     Join the next generation of engineers building secure, high-velocity applications on Codefix.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4">
                     <Link to="/signup" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 sm:px-12 sm:py-5 rounded-[2rem] font-bold text-xs uppercase tracking-[3px] shadow-2xl hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-95">
                           Join Codefix Elite
                        </button>
                     </Link>
                     <Link to="/tools" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-white/5 text-white border border-white/10 backdrop-blur-xl px-8 py-4 sm:px-12 sm:py-5 rounded-[2rem] font-bold text-xs uppercase tracking-[3px] hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95">
                           Explore Architecture
                        </button>
                     </Link>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StoryItem = ({ icon, title, desc }) => (
  <div className="flex gap-6 group">
    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed tracking-tight">{desc}</p>
    </div>
  </div>
);

const StatBlock = ({ value, label }) => (
   <div className="space-y-2">
      <p className="text-3xl md:text-5xl font-bold tracking-tighter text-white">{value}</p>
      <p className="text-[9px] text-white/30 font-black uppercase tracking-[3px]">{label}</p>
   </div>
);

const TechBadge = ({ icon, label }) => (
   <div className="bg-white border border-slate-200 p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center gap-4 hover:shadow-xl transition-all group">
      <div className="text-3xl text-primary group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">{label}</p>
   </div>
);

const ValueBox = ({ icon, title, desc }) => (
   <div className="bg-slate-50 p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 text-center space-y-6 group hover:bg-white hover:shadow-2xl transition-all duration-700">
      <div className="text-primary text-4xl mx-auto flex justify-center">{icon}</div>
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
   </div>
);

const SecurityPoint = ({ icon, title }) => (
   <div className="bg-slate-50 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 flex flex-col items-center gap-4 hover:border-primary/40 transition-all group">
      <div className="text-2xl text-primary group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-[9px] font-black text-slate-800 uppercase tracking-[4px]">{title}</p>
   </div>
);

const BenefitRow = ({ text }) => (
   <div className="flex items-center gap-4">
      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] text-primary"><FaCheckCircle /></div>
      <span className="text-slate-600 font-bold tracking-tight text-sm md:text-base">{text}</span>
   </div>
);

const FutureGoal = ({ icon, title }) => (
   <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-primary/40 transition-all">
      <div className="text-xl text-primary">{icon}</div>
      <span className="font-bold text-slate-900 text-sm uppercase tracking-widest">{title}</span>
   </div>
);

const SyncPhase = ({ label, active }) => (
   <div className={`p-6 rounded-2xl border ${active ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/5'}`}>
      <div className="flex justify-between items-center">
         <span className={`text-[10px] font-black uppercase tracking-[4px] ${active ? 'text-white' : 'text-white/20'}`}>{label}</span>
         {active && <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
      </div>
   </div>
);

export default About;