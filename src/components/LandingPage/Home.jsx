import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  FaLayerGroup,
  FaArrowUp,
  FaQuestionCircle,
  FaQuoteRight,
  FaExternalLinkAlt,
  FaChrome,
  FaDesktop,
  FaGlobeAmericas,
  FaPlus,
  FaGithub,
  FaNetworkWired,
  FaLock,
  FaHdd
} from "react-icons/fa";

const Home = () => {
  const [typedCode, setTypedCode] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const fullCode = `export const solve = () => {\n  if (!data) return null;\n  return data?.map(item => item.id); \n}`;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="bg-background overflow-hidden relative font-sans selection:bg-primary selection:text-white">
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-grid-small opacity-[0.05]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-primary/[0.03] to-transparent"></div>
      </div>

      <SEO 
        title="Develop. Fix. Ship." 
        description="The unified developer ecosystem for modern engineers. High-performance file utilities, community intelligence, and AI-powered coding assistants." 
      />

      {/* 1. HERO SECTION: ULTRA MODERN */}
      <section id="home" className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div 
            className="absolute w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full transition-transform duration-700 ease-out pointer-events-none opacity-40"
            style={{ 
              transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
              left: 0,
              top: 0
            }}
          ></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 relative">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-full mb-10 shadow-2xl border border-white/10"
            >
              <span className="bg-primary px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">Enterprise</span>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">v2.4 Neural Sync Platform</span>
              <FaArrowRight className="text-[10px] ml-1" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading text-slate-900 leading-[1.1] tracking-[-0.04em] mb-10"
            >
              The Neural <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-purple-600">
                Engine Core.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl text-slate-500 text-lg md:text-xl leading-relaxed font-medium mb-12 tracking-tight"
            >
              Architected for speed. Built for privacy. The unified ecosystem where decentralized intelligence meets high-velocity engineering.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/login">
                <button className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-bold shadow-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-[4px]">
                  Initialize Workspace
                </button>
              </Link>
              <Link to="/tools">
                <button className="bg-white text-slate-900 border border-slate-200 px-12 py-6 rounded-[2rem] font-bold transition-all hover:bg-slate-50 shadow-sm text-xs uppercase tracking-[4px]">
                  Explore Architecture
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TECHNICAL SPEC SHEET: ENGINEERING METRICS */}
      <section className="py-32 relative bg-white border-y border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <motion.div {...fadeIn} className="lg:w-1/2 space-y-10">
                  <div className="inline-block p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <FaMicrochip className="text-primary text-3xl" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 leading-[1] tracking-tighter">Architected for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-purple-600">Zero Latency.</span></h2>
                  <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-lg">Our engine is built on the pillars of distributed intelligence and edge-computing. We process where you code.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                     <SpecItem icon={<FaBolt />} title="P99 Cold Start" desc="WASM-optimized binaries load in <42ms on standard hardware." />
                     <SpecItem icon={<FaShieldAlt />} title="Sandbox-v3" desc="E2E isolated runtime environment with zero-knowledge hooks." />
                     <SpecItem icon={<FaRobot />} title="Vector Routing" desc="Smart inference across 15+ specialized LLM edge nodes." />
                     <SpecItem icon={<FaCode />} title="Git-Ops Native" desc="Automated branch synthesis and branch-level conflict resolution." />
                  </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className="lg:w-1/2 relative group"
               >
                  <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000"></div>
                  <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-white/5 shadow-2xl relative z-10 overflow-hidden">
                     <div className="flex items-center justify-between mb-12">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[6px]">Neural Trace v4.2</span>
                        <div className="flex gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-75" />
                           <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150" />
                        </div>
                     </div>
                     <div className="space-y-8 text-white">
                        <SpecBar label="AI Logic Consistency" percent="99.99%" />
                        <SpecBar label="P99 Neural Inference" percent="120ms" />
                        <SpecBar label="WASM Execution Speed" percent="Native" />
                        <SpecBar label="Security Compliance" percent="SOC-2 Ready" />
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 3. LIVE PREVIEW SECTION */}
      <section className="relative py-32 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeIn} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-blue-500/20 to-indigo-600/30 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0B0E14] border border-white/10 backdrop-blur-3xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              <div className="grid md:grid-cols-5 min-h-[550px]">
                <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-white/5 p-12 bg-white/[0.01]">
                  <h3 className="text-white font-bold text-xl mb-10 flex items-center gap-3 tracking-tight">
                    <FaMicrochip className="text-primary text-2xl" /> Neural Modules
                  </h3>
                  <div className="space-y-6">
                    <PreviewLink icon={<FaComments />} label="Community Hub" status="Syncing" active />
                    <PreviewLink icon={<FaFilePdf />} label="PDF Infrastructure" status="0.2s" />
                    <PreviewLink icon={<FaRobot />} label="AI Neural Core" status="Active" active />
                    <PreviewLink icon={<FaCode />} label="Logic Verifier" status="Ready" />
                  </div>
                </div>
                <div className="md:col-span-3 p-12 bg-black/50 relative font-mono text-white">
                  <div className="flex items-center justify-between mb-10">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/30" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                        <div className="w-3 h-3 rounded-full bg-green-500/30" />
                     </div>
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-[4px]">Core-Inference-Node-1</span>
                  </div>
                  <div className="text-sm md:text-base leading-relaxed">
                     <p className="text-primary/80 mb-3">$ codefix --optimize --deep</p>
                     <p className="text-emerald-400/90 mb-4 font-semibold tracking-tight">// Identifying performance bottlenecks...</p>
                     <pre className="text-slate-100 whitespace-pre-wrap min-h-[120px] text-xs md:text-sm leading-relaxed">{typedCode}<span className="w-2.5 h-5 bg-primary inline-block ml-1 animate-pulse align-middle"></span></pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. METRICS TICKER: INFINITE DATA */}
      <section className="py-12 border-y border-slate-200 bg-white relative overflow-hidden">
         <div className="flex whitespace-nowrap overflow-hidden group">
            <motion.div animate={{ x: "-50%" }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex items-center gap-32 pr-32">
               <TickerItem label="P99 LATENCY" value="42ms" />
               <TickerItem label="BUGS SOLVED" value="1.24M" />
               <TickerItem label="NODES ACTIVE" value="15.8k" />
               <TickerItem label="WASM LOADS" value="8.2M" />
               <TickerItem label="SECURITY SCORE" value="A+" />
               <TickerItem label="NEURAL SYNCS" value="50M+" />
               {/* Loop */}
               <TickerItem label="P99 LATENCY" value="42ms" />
               <TickerItem label="BUGS SOLVED" value="1.24M" />
               <TickerItem label="NODES ACTIVE" value="15.8k" />
               <TickerItem label="WASM LOADS" value="8.2M" />
            </motion.div>
         </div>
      </section>

      {/* 5. COMPARISON MATRIX: CODEFIX VS LEGACY */}
      <section className="py-32 relative overflow-hidden bg-slate-900 text-white">
         <div className="absolute inset-0 bg-grid opacity-5"></div>
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="text-center mb-24 space-y-4">
               <p className="text-primary font-bold uppercase tracking-[8px] text-[10px]">Comparative Logic</p>
               <h2 className="text-5xl md:text-8xl font-bold tracking-tighter">Elite vs <span className="text-white/20">Legacy.</span></h2>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                     <tr className="border-b border-white/10">
                        <th className="py-10 text-[11px] font-black uppercase tracking-[5px] text-white/40">Infrastructure</th>
                        <th className="py-10 text-[11px] font-black uppercase tracking-[5px] text-primary px-10 bg-primary/5 rounded-t-[2.5rem]">Codefix Elite</th>
                        <th className="py-10 text-[11px] font-black uppercase tracking-[5px] text-white/40 px-10">Standard SaaS</th>
                     </tr>
                  </thead>
                  <tbody>
                     <ComparisonRow label="Data Processing" elite="Local WASM Sandbox" legacy="Cloud Server Sync" />
                     <ComparisonRow label="Inference Engine" elite="Multi-Model Neural Core" legacy="Single API Wrapper" />
                     <ComparisonRow label="Privacy Model" elite="Zero-Knowledge E2E" legacy="Server-Side Logging" />
                     <ComparisonRow label="Cold Start Speed" elite="< 42ms (Edge)" legacy="2.5s - 12s (Cloud)" />
                     <ComparisonRow label="Workspace State" elite="Persistent Local Storage" legacy="Fragmented Session" />
                  </tbody>
               </table>
            </div>
         </div>
      </section>

      {/* 6. BENTO GRID: UNIFIED INTELLIGENCE */}
      <section className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
          <motion.div {...fadeIn} className="mb-24 text-center">
             <p className="text-primary font-bold uppercase tracking-[6px] text-[10px] mb-4">Core Architecture</p>
             <h2 className="text-4xl sm:text-6xl font-bold font-heading text-slate-900 leading-[1] tracking-tighter">Unified <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Ecosystem.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8 group relative bg-slate-900 rounded-[4rem] overflow-hidden p-14 md:p-20 text-white border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                   <FaNetworkWired className="text-[200px]" />
                </div>
                <div className="relative z-10 h-full flex flex-col">
                   <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-primary text-4xl mb-12"><FaComments /></div>
                   <h3 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tighter text-white leading-tight">Decentralized <br /> Intelligence v2.4</h3>
                   <p className="text-slate-400 text-xl max-w-lg font-medium leading-relaxed tracking-tight">Access global engineering expertise through our verified solution network. Peer-reviewed fixes with cryptographic proof of work.</p>
                </div>
             </div>
             <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-[3.5rem] p-12 flex flex-col group hover:border-primary/40 transition-all shadow-sm">
                <FaLayerGroup className="text-slate-900 text-4xl mb-10 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-bold font-heading text-slate-900 mb-6 tracking-tighter">Power <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Infrastructure</span></h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed tracking-tight">Military-grade AES-256 local encryption for high-density document processing and PDF logic.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 7. SECURITY DEEP DIVE: ARCHITECTURE */}
      <section className="py-32 bg-white border-y border-slate-100">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 relative">
               <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full"></div>
               <div className="grid grid-cols-2 gap-6 relative z-10">
                  <SecurityPoint icon={<FaLock />} title="TLS 1.3" desc="Encryption" />
                  <SecurityPoint icon={<FaHdd />} title="WASM" desc="Sandbox" />
                  <SecurityPoint icon={<FaShieldAlt />} title="SOC-2" desc="Compliant" />
                  <SecurityPoint icon={<FaCheckCircle />} title="E2EE" desc="Verified" />
               </div>
            </div>
            <div className="lg:w-1/2 space-y-10">
               <p className="text-primary font-bold uppercase tracking-[6px] text-[10px]">Security Framework</p>
               <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900">Ironclad <br /> Architecture.</h2>
               <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-lg tracking-tight">We've pioneered the "Zero-Knowledge" engineering model. Your source code, documents, and neural queries are never persisted on any central server.</p>
               <div className="pt-4 flex items-center gap-4 text-emerald-600 font-bold tracking-tighter text-sm uppercase">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Full Audit Pass: Q2 2026
               </div>
            </div>
         </div>
      </section>

      {/* 8. TOOLBOX SHOWCASE: PRECISION DATA */}
      <section className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-5xl sm:text-8xl font-bold font-heading text-slate-900 leading-[0.9] tracking-tighter">Precision <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Toolbox.</span></h2>
              <div className="grid grid-cols-2 gap-6">
                <ToolMiniBadge label="JSON ENGINE" metric="0.02ms" />
                <ToolMiniBadge label="PDF CORE" metric="HIGH-DPI" />
                <ToolMiniBadge label="BASE64 SYNC" metric="BUFFERED" />
                <ToolMiniBadge label="REGEX V8" metric="NATIVE" />
              </div>
            </div>
            <div className="bg-slate-900 p-14 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="flex items-center gap-5 mb-10 border-b border-white/5 pb-10">
                  <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center font-bold text-2xl">CF</div>
                  <div>
                     <p className="font-bold text-xl tracking-tight">Neural Sync Ready</p>
                     <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[4px]">Node: Local-01</p>
                  </div>
               </div>
               <p className="text-slate-400 text-lg leading-relaxed font-medium">Platform verified. Neural path identified for optimized document conversion. No data leakage detected. Ready for initialization.</p>
            </div>
        </div>
      </section>

      {/* 9. WALL OF FAME: ELITE TESTIMONIALS */}
      <section className="py-32 bg-slate-50 border-y border-slate-200">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="text-center mb-32 space-y-6">
               <p className="text-primary font-bold uppercase tracking-[8px] text-[10px]">The Hive Mind</p>
               <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[0.8]">Wall of <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Fame.</span></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
               <TestimonialCard quote="The cold-start speed is phenomenal. Codefix is architected for real engineering work." author="Sarah Chen" role="Principal @ Meta" img="https://i.pravatar.cc/150?img=32" />
               <TestimonialCard quote="Finally, a tool that respects zero-knowledge principles. A must-have for fintech." author="James Wilson" role="Staff Engineer @ Stripe" img="https://i.pravatar.cc/150?img=12" />
               <TestimonialCard quote="The local-first WASM engine handles heavy document logic without breaking a sweat." author="Aria Rodriguez" role="Platform Lead @ Vercel" img="https://i.pravatar.cc/150?img=44" />
            </div>
         </div>
      </section>

      {/* 10. ADVANCED FAQ */}
      <section className="py-40 bg-slate-900 text-white relative">
         <div className="max-w-4xl mx-auto px-8 relative z-10">
            <div className="text-center mb-24 space-y-6">
               <FaQuestionCircle className="text-primary text-6xl mx-auto" />
               <h2 className="text-5xl md:text-8xl font-bold tracking-tighter">Inquiries.</h2>
            </div>
            <div className="space-y-10">
               <FAQItem question="How is the Zero-Knowledge Sandbox implemented?" answer="We utilize a double-layer WASM isolation layer. All logic is executed within a memory-safe buffer that clears automatically upon session termination." />
               <FAQItem question="Can I integrate custom LLM inference nodes?" answer="Elite users can bridge their own API keys or local LLM instances directly into the Neural Core for custom logic verification." />
               <FAQItem question="What is the P99 latency for global sync?" answer="Our current global average is 42ms for cold starts and <120ms for full-scale neural inference queries." />
            </div>
         </div>
      </section>

      {/* 11. FINAL CTA: CONVERSION CORE */}
      <section className="py-48 relative overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <motion.div 
               whileHover={{ scale: 1.01 }}
               className="bg-gradient-to-br from-primary via-indigo-700 to-black p-16 md:p-32 rounded-[5rem] text-center text-white shadow-3xl relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-grid opacity-10 group-hover:opacity-20 transition-opacity"></div>
               <div className="relative z-10 space-y-12">
                  <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-[-0.06em] leading-none">Initialize <br /> Your Stack.</h2>
                  <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto tracking-tight">Join the next generation of engineers building secure, neural-native applications.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                     <Link to="/signup">
                        <button className="bg-white text-black px-16 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] shadow-2xl hover:scale-105 transition-all">Initialize Free</button>
                     </Link>
                     <Link to="/tools">
                        <button className="bg-black/20 text-white border border-white/20 backdrop-blur-xl px-16 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] hover:bg-white/10 transition-all">Doc/Architecture</button>
                     </Link>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>
    </div>
  );
};

// --- ELITE SUBCOMPONENTS ---

const SpecItem = ({ icon, title, desc }) => (
   <div className="space-y-4 group">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500">{icon}</div>
      <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[3px]">{title}</h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed tracking-tight">{desc}</p>
   </div>
);

const SpecBar = ({ label, percent }) => (
   <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black opacity-40 uppercase tracking-[4px]"><span>{label}</span><span className="text-primary">{percent}</span></div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-primary"></motion.div></div>
   </div>
);

const PreviewLink = ({ icon, label, status, active }) => (
  <div className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all duration-500 ${active ? 'bg-primary/15 border-primary/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
    <div className="flex items-center gap-5"><span className="text-2xl text-primary">{icon}</span><span className={`text-[13px] font-bold tracking-tight ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span></div>
    <span className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl ${active ? 'bg-primary text-white animate-pulse' : 'bg-white/10 text-slate-500'}`}>{status}</span>
  </div>
);

const TickerItem = ({ label, value }) => (
   <div className="flex items-center gap-6">
      <span className="text-4xl font-bold text-slate-900 tracking-tighter">{value}</span>
      <span className="text-[10px] font-black text-primary uppercase tracking-[5px] border-l-2 border-primary/20 pl-6">{label}</span>
   </div>
);

const ToolMiniBadge = ({ label, metric }) => (
  <div className="flex items-center justify-between bg-white border border-slate-200 px-8 py-6 rounded-3xl shadow-sm hover:shadow-xl transition-all group cursor-pointer">
     <div className="flex items-center gap-4">
        <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
        <span className="text-[11px] font-black text-slate-800 uppercase tracking-[3px]">{label}</span>
     </div>
     <span className="text-[10px] font-bold text-primary/30 uppercase group-hover:text-primary transition-colors">{metric}</span>
  </div>
);

const SecurityPoint = ({ icon, title, desc }) => (
   <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-center space-y-3 group hover:border-primary/40 transition-all duration-500">
      <div className="text-primary text-3xl mx-auto flex justify-center">{icon}</div>
      <h4 className="text-white font-bold text-lg tracking-tight">{title}</h4>
      <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px]">{desc}</p>
   </div>
);

const ComparisonRow = ({ label, elite, legacy }) => (
   <tr className="border-b border-white/5 group">
      <td className="py-10 font-bold text-white/50 tracking-tight text-lg">{label}</td>
      <td className="py-10 px-10 bg-primary/[0.03] border-x border-white/5">
         <div className="flex items-center gap-4">
            <FaCheckCircle className="text-primary text-sm" />
            <span className="text-white font-bold text-lg tracking-tight">{elite}</span>
         </div>
      </td>
      <td className="py-10 px-10">
         <span className="text-white/20 font-medium text-lg tracking-tight">{legacy}</span>
      </td>
   </tr>
);

const TestimonialCard = ({ quote, author, role, img }) => (
   <div className="bg-white border border-slate-200 p-14 rounded-[4rem] shadow-sm relative group hover:shadow-2xl transition-all duration-700">
      <FaQuoteRight className="text-slate-100 text-7xl absolute top-10 right-10 group-hover:text-primary/5 transition-colors" />
      <p className="text-slate-600 text-xl font-medium mb-12 italic relative z-10 leading-relaxed tracking-tight">"{quote}"</p>
      <div className="flex items-center gap-5">
         <img src={img} className="w-14 h-14 rounded-full border-2 border-primary/20" alt={author} />
         <div><h4 className="font-bold text-slate-900 text-lg tracking-tight">{author}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">{role}</p></div>
      </div>
   </div>
);

const FAQItem = ({ question, answer }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="border-b border-white/10 pb-8">
         <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between py-6 text-left group">
            <h4 className="text-xl md:text-3xl font-bold tracking-tighter group-hover:text-primary transition-colors leading-tight pr-10">{question}</h4>
            <FaPlus className={`text-primary text-xl transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
         </button>
         <AnimatePresence>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="text-slate-400 text-lg md:text-2xl pb-6 pr-20 font-medium tracking-tight leading-relaxed">{answer}</p></motion.div>}</AnimatePresence>
      </div>
   );
};

export default Home;