import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  FaTerminal, 
  FaMicrochip, 
  FaCheckCircle, 
  FaComments,
  FaBolt,
  FaShieldAlt,
  FaCode,
  FaFilePdf,
  FaRobot,
  FaArrowRight,
  FaLayerGroup
} from "react-icons/fa";

const Home = () => {
  const [typedCode, setTypedCode] = useState("");
  const fullCode = `export const solve = () => {\n  if (!data) return null;\n  return data?.map(item => item.id); \n}`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedCode(fullCode.slice(0, i));
      i++;
      if (i > fullCode.length) {
        setTimeout(() => { i = 0; }, 2000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

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
    <div className="bg-background overflow-hidden relative font-sans">
      <SEO 
        title="Develop. Fix. Ship." 
        description="The unified developer ecosystem for modern engineers. High-performance file utilities, community intelligence, and AI-powered coding assistants." 
      />
      {/* 1. HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/15 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[8px] sm:text-[10px] font-semibold text-slate-300 tracking-[2px] sm:tracking-[4px] uppercase whitespace-nowrap">
                Enterprise Developer Ecosystem
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-semibold text-white leading-[1.05]  tracking-tight">
              Code<span className="text-primary font-bold">fix</span>. <br />
              <span className="bg-gradient-to-r from-primary md:ml-6 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Develop. Fix. Ship.
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-secondary text-lg md:text-2xl leading-relaxed font-semibold opacity-80 px-4">
              The unified workspace that combines secure file utilities, 
              community intelligence, and AI-powered coding assistants.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link to="/login">
                <button className="group relative bg-primary hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-semibold shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-base overflow-hidden">
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </Link>
              <Link to="/about">
                <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-2xl font-semibold transition-all text-base backdrop-blur-md">
                  Explore Platform
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. LIVE PREVIEW SECTION */}
      <section className="relative pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            {...fadeIn}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-blue-500/40 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-[#0B0E14]/90 border border-white/10 backdrop-blur-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="grid md:grid-cols-5 min-h-[450px]">
                {/* Left: Interactive Menu */}
                <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-white/5 p-6 md:p-10 bg-white/[0.03]">
                  <h3 className="text-white font-semibold text-lg md:text-xl mb-6 md:mb-8 flex items-center gap-3">
                    <FaMicrochip className="text-primary text-xl md:text-2xl" /> Active Modules
                  </h3>
                  <div className="space-y-5">
                    <PreviewLink icon={<FaComments />} label="Community Hub" status="Online" active />
                    <PreviewLink icon={<FaFilePdf />} label="PDF Power Tools" status="Ready" />
                    <PreviewLink icon={<FaRobot />} label="AI Neural Core" status="Active" active />
                    <PreviewLink icon={<FaCode />} label="Dev Toolbox" status="Synced" />
                  </div>
                </div>

                {/* Right: Code Terminal */}
                <div className="md:col-span-3 p-6 md:p-10 bg-black/50 relative font-mono">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                     </div>
                     <div className="text-[10px] font-semibold text-white/30 uppercase tracking-[3px]">Codefix-Terminal-v1.2</div>
                  </div>
                  
                  <div className="text-sm md:text-base leading-relaxed">
                     <p className="text-primary/80 mb-3">$ codefix --analyze --fix</p>
                     <p className="text-emerald-400/90 mb-4 font-semibold">// Neural Agent identifying optimized path...</p>
                     <pre className="text-slate-100 whitespace-pre-wrap min-h-[120px]">
                       {typedCode}
                       <span className="w-2.5 h-6 bg-primary inline-block ml-1 animate-pulse align-middle"></span>
                     </pre>
                  </div>

                  <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <FaCheckCircle className="text-emerald-500 text-xl" />
                        </div>
                        <div>
                          <p className="text-xs text-white font-semibold">AI Auto-Fix</p>
                          <p className="text-[10px] text-secondary">Verified Suggestion</p>
                        </div>
                     </div>
                     <button className="w-full sm:w-auto bg-primary/10 text-primary px-6 py-3 rounded-xl border border-primary/20 text-[10px] font-semibold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                        Commit Optimization
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE ECOSYSTEM (FEATURES GRID) */}
      <section className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6 px-4">Unified Developer Ecosystem</h2>
            <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto font-semibold px-4">Stop switching tabs. Codefix brings your entire workflow into one synchronized environment.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaComments />} 
              title="Community Q&A" 
              desc="Real-time collaboration platform to solve bugs, share snippets, and gain verified insights from senior devs."
              delay={0.1}
            />
            <FeatureCard 
              icon={<FaLayerGroup />} 
              title="File Utilities" 
              desc="High-speed converters for PDF, Word, and Excel. 100% client-side, ensuring your data never leaves your browser."
              delay={0.2}
            />
            <FeatureCard 
              icon={<FaRobot />} 
              title="AI Neural Core" 
              desc="Context-aware AI agents that analyze your code structure, detect memory leaks, and refactor in milliseconds."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 4. PLATFORM METRICS */}
      <section className="py-24 border-y border-white/5 relative bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem value="10k+" label="Global Developers" delay={0.1} />
            <StatItem value="500+" label="Daily Solutions" delay={0.2} />
            <StatItem value="0.2s" label="Fix Latency" delay={0.3} />
            <StatItem value="100%" label="Client-Side Privacy" delay={0.4} />
          </div>
        </div>
      </section>

      {/* 5. AI & TOOLBOX SHOWCASE */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div {...fadeIn} className="flex-1 space-y-8 relative z-10">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <FaTerminal className="text-primary text-3xl" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight">Professional Developer <br /> Toolbox Included.</h2>
              <p className="text-secondary text-base md:text-lg leading-relaxed font-semibold">
                Beyond AI and Q&A, get access to a suite of essential mini-tools designed for maximum productivity.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <ToolBadge label="JSON Formatter" />
                <ToolBadge label="Regex Tester" />
                <ToolBadge label="Base64 Converter" />
                <ToolBadge label="API Request Tester" />
                <ToolBadge label="PDF Compressor" />
                <ToolBadge label="Word/PDF Converter" />
              </div>
              <div className="pt-6">
                <Link to="/tools" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                  View All 15+ Tools <FaArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1 w-full relative z-10"
            >
              <div className="bg-gradient-to-br from-surface to-background border border-white/10 p-1.5 rounded-[3rem] shadow-[0_0_80px_rgba(0,100,255,0.15)]">
                 <div className="bg-[#0f121a] p-8 md:p-10 rounded-[2.8rem] space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                       <div className="w-14 h-14 bg-gradient-to-tr from-primary to-blue-400 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary/30">CF</div>
                       <div>
                          <p className="text-white font-semibold text-lg">Codefix Agent</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                             <p className="text-emerald-500 text-[10px] font-semibold uppercase tracking-widest">Neural Sync Active</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-5 text-sm">
                       <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5 max-w-[85%] text-slate-300">
                          Identified a potential memory leak in your current hook. Applying memoization now...
                       </div>
                       <motion.div 
                         initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                         whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                         transition={{ delay: 0.5 }}
                         className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 flex justify-center items-center gap-3"
                       >
                          <FaCheckCircle className="text-emerald-500 text-xl" />
                          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-[2px]">Optimized in 0.2s</p>
                       </motion.div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & SECURITY */}
      <section className="py-32 bg-white/[0.01] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeIn} className="space-y-16">
            <div>
               <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">Built for Reliability</h2>
               <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto font-semibold px-4">Your workflow is mission-critical. Codefix is built to handle it.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <TrustItem delay={0.1} icon={<FaShieldAlt />} title="Client-Side Security" desc="All file processing and utility tools run locally. Your data never touches our servers." />
               <TrustItem delay={0.2} icon={<FaBolt />} title="Zero-Lag Performance" desc="Optimized React architecture ensuring instantaneous tool response and AI feedback." />
               <TrustItem delay={0.3} icon={<FaCheckCircle />} title="Verified Solutions" desc="All community-voted solutions and AI fixes follow industry standard best practices." />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. CTA FOOTER */}
      <section className="py-40 relative">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary to-blue-700 p-12 md:p-24 rounded-[4rem] shadow-2xl shadow-primary/30 relative overflow-hidden"
            >
               <div className="relative z-10 space-y-10">
                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-semibold text-white leading-[1.1] tracking-tight">Level up your <br /> dev workflow.</h2>
                  <p className="text-white/90 text-lg md:text-2xl font-semibold max-w-2xl mx-auto">Join thousands of developers using Codefix to solve, convert, and collaborate.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                    <Link to="/signup">
                      <button className="bg-white text-primary px-12 py-5 rounded-2xl font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all text-base uppercase tracking-widest">Join Now Free</button>
                    </Link>
                    <Link to="/questions">
                      <button className="bg-black/20 hover:bg-black/30 text-white border border-white/20 px-12 py-5 rounded-2xl font-semibold transition-all text-base backdrop-blur-md uppercase tracking-widest">Explore Q&A</button>
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

const PreviewLink = ({ icon, label, status, active }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${active ? 'bg-primary/15 border-primary/40' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
    <div className="flex items-center gap-4">
      <span className="text-xl text-primary">{icon}</span>
      <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-secondary'}`}>{label}</span>
    </div>
    <span className={`text-[9px] font-semibold uppercase px-3 py-1.5 rounded-lg ${active ? 'bg-primary text-white animate-pulse' : 'bg-white/10 text-slate-400'}`}>
      {status}
    </span>
  </div>
);

const FeatureCard = ({ icon, title, desc, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-surface/30 border border-white/5 p-10 rounded-[3rem] hover:border-primary/40 transition-all duration-500 group"
  >
    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl mb-8 group-hover:scale-110 transition-transform border border-primary/10">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-secondary text-base leading-relaxed font-semibold opacity-70">{desc}</p>
  </motion.div>
  );
};

const StatItem = ({ value, label, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
    <p className="text-4xl md:text-5xl font-semibold text-white mb-3 tracking-tight">{value}</p>
    <p className="text-secondary text-xs font-semibold uppercase tracking-[3px]">{label}</p>
  </motion.div>
  );
};

const ToolBadge = ({ label }) => (
  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
    {label}
  </div>
);

const TrustItem = ({ icon, title, desc, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
    className="space-y-6"
  >
    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] mx-auto flex items-center justify-center text-primary text-4xl shadow-xl">
      {icon}
    </div>
    <h4 className="text-2xl font-semibold text-white tracking-tight">{title}</h4>
    <p className="text-secondary text-base leading-relaxed font-semibold opacity-70 max-w-sm mx-auto">{desc}</p>
  </motion.div>
  );
};

export default Home;