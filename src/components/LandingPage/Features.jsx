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
  FaDatabase
} from "react-icons/fa";
import { motion } from 'framer-motion';

const Features = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className={`bg-background text-white overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      
      {/* --- HERO HEADER --- */}
      <section className={`relative ${isDashboard ? 'py-10' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
              <FaMagic className="text-primary text-[10px]" />
              <span className="text-[10px] font-semibold text-slate-300 tracking-[3px] uppercase">Feature Deep Dive</span>
           </motion.div>
           
           <motion.h1 {...fadeIn} className="text-4xl sm:text-6xl md:text-8xl font-semibold leading-[1.1] tracking-tight px-4">
              Built for the <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Elite Developer
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-3xl mx-auto text-secondary text-base md:text-xl font-semibold opacity-80 leading-relaxed px-4">
              Codefix is more than just a tool—it's a synchronized ecosystem designed to handle every stage of your development workflow.
           </motion.p>
        </div>
      </section>

      {/* --- 1. AI NEURAL ENGINE --- */}
      <section className="py-24 relative">
         <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <motion.div {...fadeIn} className="space-y-8">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl border border-primary/20 shadow-xl shadow-primary/10">
                  <FaRobot />
               </div>
               <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">AI Neural Engine</h2>
               <p className="text-secondary text-base md:text-lg font-semibold opacity-70 leading-relaxed">
                  Powered by advanced LLMs, our AI core understands your project structure. It doesn't just suggest code; it analyzes memory leaks, refactors complex logic, and generates documentation.
               </p>
               <ul className="space-y-4">
                  <FeaturePoint text="Context-Aware Code Fixing" />
                  <FeaturePoint text="Sub-second Refactoring Suggestions" />
                  <FeaturePoint text="Automated Documentation Generation" />
                  <FeaturePoint text="Multi-language Support (React, Python, Go, etc.)" />
               </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-surface/30 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl relative group shadow-2xl"
            >
               <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[3rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
               <div className="relative space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                     <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-auto">Neural Terminal</span>
                  </div>
                  <pre className="text-[10px] md:text-sm font-mono text-emerald-400 whitespace-pre-wrap break-words">
                     {`// AI identifies inefficiency\n- array.forEach(x => ...)\n+ array.map(x => ...)\n\n// Optimization: Memory footprint reduced by 14%`}
                  </pre>
                  <div className="pt-4 flex items-center gap-3 text-primary font-semibold text-sm">
                     <FaCheckCircle /> Verified Optimization Applied
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* --- 2. FILE POWER TOOLS --- */}
      <section className="py-12 md:py-24 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
               <ToolCardTiny icon={<FaFilePdf />} label="PDF to Word" />
               <ToolCardTiny icon={<FaCode />} label="Excel to PDF" />
               <ToolCardTiny icon={<FaDatabase />} label="JSON to CSV" />
               <ToolCardTiny icon={<FaBolt />} label="PDF Compress" />
            </motion.div>

            <motion.div {...fadeIn} className="space-y-8">
               <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 text-3xl border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                  <FaFilePdf />
               </div>
               <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">File Power Tools</h2>
               <p className="text-secondary text-base md:text-lg font-semibold opacity-70 leading-relaxed">
                  Say goodbye to sketchy online converters. Codefix handles all document processing 100% locally in your browser. Your data never touches a server.
               </p>
               <ul className="space-y-4">
                  <FeaturePoint text="Military-Grade PDF Encryption" />
                  <FeaturePoint text="Lossless Image Compression" />
                  <FeaturePoint text="High-Fidelity Office Conversions" />
                  <FeaturePoint text="Batch File Processing" />
               </ul>
            </motion.div>
         </div>
      </section>

      {/* --- 3. COMMUNITY HUB --- */}
      <section className="py-24 relative">
         <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <motion.div {...fadeIn} className="space-y-8">
               <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 text-3xl border border-blue-500/20 shadow-xl shadow-blue-500/10">
                  <FaComments />
               </div>
               <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Community Intelligence</h2>
               <p className="text-secondary text-base md:text-lg font-semibold opacity-70 leading-relaxed">
                  Tap into a global network of senior developers. Codefix's Q&A platform is integrated directly with our AI, providing verified solutions and a robust reputation system.
               </p>
               <ul className="space-y-4">
                  <FeaturePoint text="Real-time Collaborative Fixes" />
                  <FeaturePoint text="Senior-Verified Badges" />
                  <FeaturePoint text="Reputation & Reward System" />
                  <FeaturePoint text="Semantic Question Search" />
               </ul>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="p-8 md:p-10 bg-gradient-to-br from-surface to-background border border-white/10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl relative"
            >
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-white shadow-lg">JD</div>
                     <div>
                        <p className="text-white font-semibold">Senior Architect</p>
                        <p className="text-[10px] text-primary font-semibold uppercase tracking-widest">Verified Contributor</p>
                     </div>
                  </div>
                  <div className="bg-white/5 p-4 md:p-6 rounded-3xl rounded-tl-none border border-white/5 text-xs md:text-sm text-slate-300 font-semibold opacity-90 leading-relaxed">
                     "The memory leak was caused by an unclosed WebSocket connection in your useEffect hook. Use this cleanup function..."
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
                     <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[10px] sm:text-xs uppercase tracking-widest"><FaCheckCircle /> Solution Verified</div>
                     <div className="flex items-center gap-2 text-slate-500 font-semibold text-[10px] sm:text-xs uppercase tracking-widest">+50 Reputation</div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* --- 4. DEV TOOLBOX GRID --- */}
      <section className="py-16 md:py-24 bg-white/[0.02] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4 text-center mb-20 space-y-6">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight px-4">Essential Developer Toolbox</h2>
            <p className="text-secondary text-base md:text-lg font-semibold opacity-70 px-4">The small tools that make a big difference in your daily flow.</p>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 pb-32">
            <MiniToolCard icon={<FaTerminal />} title="JSON Formatter" desc="Prettify and validate complex JSON structures instantly." />
            <MiniToolCard icon={<FaDatabase />} title="Base64 Utility" desc="Securely encode and decode binary data in your browser." />
            <MiniToolCard icon={<FaCode />} title="Regex Builder" desc="Live testing and building for complex regular expressions." />
            <MiniToolCard icon={<FaBolt />} title="API Request Tester" desc="Lightweight Postman alternative for quick endpoint testing." />
            <MiniToolCard icon={<FaShieldAlt />} title="Secret Manager" desc="Locally encrypt and store your environment variables." />
            <MiniToolCard icon={<FaMagic />} title="Theme Generator" desc="Create custom CSS variables for your next project." />
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-40 relative">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="bg-primary/5 border border-primary/20 p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] backdrop-blur-xl relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="relative z-10 space-y-10">
                  <h2 className="text-3xl md:text-6xl font-semibold text-white tracking-tight">Ready to optimize?</h2>
                  <p className="text-white/80 text-lg md:text-xl font-semibold">Join the next generation of developer workflows today.</p>
                  <Link to="/signup" className="w-fit bg-primary hover:bg-blue-600 text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-105 uppercase tracking-widest text-xs md:text-sm">Create Account Free</Link>
               </div>
            </motion.div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const FeaturePoint = ({ text }) => (
  <li className="flex items-start gap-4 text-secondary font-semibold opacity-90 group">
    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] sm:text-[10px] text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all shrink-0 mt-1">
      <FaArrowRight />
    </div>
    <span className="text-sm md:text-base">{text}</span>
  </li>
);

const ToolCardTiny = ({ icon, label }) => (
  <div className="bg-surface/30 border border-white/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-primary/40 transition-all group">
    <div className="text-xl md:text-3xl text-primary group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-[8px] md:text-[10px] font-semibold text-slate-300 uppercase tracking-widest text-center">{label}</p>
  </div>
);

const MiniToolCard = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group">
     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl mb-6 group-hover:rotate-12 transition-all">
        {icon}
     </div>
     <h4 className="text-xl font-semibold text-white mb-3 tracking-tight">{title}</h4>
     <p className="text-secondary text-sm font-semibold opacity-70 leading-relaxed">{desc}</p>
  </div>
);

export default Features;