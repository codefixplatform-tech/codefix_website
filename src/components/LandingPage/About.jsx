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
  FaLayerGroup 
} from "react-icons/fa";
import { motion } from 'framer-motion';

const About = () => {
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
      
      {/* --- 1. MISSION HEADER --- */}
      <section className={`relative ${isDashboard ? 'py-10' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
              <FaRocket className="text-primary text-[10px]" />
              <span className="text-[10px] font-semibold text-slate-300 tracking-[4px] uppercase">The Story of Codefix</span>
           </motion.div>
           
           <motion.h1 {...fadeIn} className="text-4xl sm:text-6xl md:text-8xl font-semibold leading-[1.05] tracking-tight px-4">
              Reimagining the <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Developer Workflow
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-4xl mx-auto text-secondary text-base md:text-xl font-semibold opacity-80 leading-relaxed px-4">
              We started with a simple question: Why do developers have to switch between a dozen tabs just to fix a bug, convert a file, or ask a question?
           </motion.p>
        </div>
      </section>

      {/* --- 2. THE TRIFECTA (THE CORE STORY) --- */}
      <section className="py-24 relative overflow-hidden">
         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <motion.div {...fadeIn} className="space-y-10">
                   <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">One Ecosystem. <br />Infinite Possibilities.</h2>
                   <p className="text-secondary text-base md:text-lg font-semibold opacity-70 leading-relaxed">
                     Codefix isn't just another utility site. It's a precision-engineered architecture that brings together the three pillars of modern engineering:
                  </p>
                  
                  <div className="space-y-8">
                     <StoryPoint 
                        icon={<FaMicrochip />} 
                        title="Neural Intelligence" 
                        desc="Advanced AI that doesn't just guess, but understands your codebase to provide verified refactors." 
                     />
                     <StoryPoint 
                        icon={<FaLayerGroup />} 
                        title="Local-First Processing" 
                        desc="Privacy-centric file tools that process gigabytes of data directly in your browser, keeping your secrets safe." 
                     />
                     <StoryPoint 
                        icon={<FaUsers />} 
                        title="Collective Wisdom" 
                        desc="A high-velocity Q&A community where senior developers and AI agents collaborate to solve the unsolvable." 
                     />
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="relative"
               >
                  <div className="absolute -inset-4 bg-primary/10 blur-[100px] rounded-full"></div>
                  <div className="relative bg-surface/30 border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8">
                        <FaCode className="text-primary/20 text-8xl rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                     </div>
                     <div className="space-y-8 relative z-10">
                        <h4 className="text-2xl font-semibold">The Architecture</h4>
                        <div className="space-y-4">
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} whileInView={{ width: "90%" }} transition={{ duration: 1.5 }} className="h-full bg-primary" />
                           </div>
                           <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">AI Accuracy: 90%+</p>
                        </div>
                        <div className="space-y-4">
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-emerald-500" />
                           </div>
                           <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Privacy Guarantee: 100%</p>
                        </div>
                        <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                           <div>
                              <p className="text-3xl font-semibold">0.2s</p>
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Avg. Tool Latency</p>
                           </div>
                           <div>
                              <p className="text-3xl font-semibold">15+</p>
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Integrated Tools</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* --- 3. PHILOSOPHY & VALUES --- */}
      <section className="py-24 bg-white/[0.02]">
         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div {...fadeIn} className="text-center mb-24 space-y-6">
               <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Our Core Principles</h2>
               <p className="text-secondary text-lg font-semibold opacity-70 max-w-2xl mx-auto">We build for developers who value their time, privacy, and precision.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
               <ValueCard 
                  icon={<FaShieldAlt />} 
                  title="Zero-Server Privacy" 
                  desc="We believe your data is your property. That's why our file converters and dev utilities run entirely on your hardware." 
               />
               <ValueCard 
                  icon={<FaBolt />} 
                  title="Sub-Second Speed" 
                  desc="Performance isn't a feature; it's a requirement. Every module is optimized for instantaneous response and feedback." 
               />
               <ValueCard 
                  icon={<FaUsers />} 
                  title="Community First" 
                  desc="Codefix is powered by people. Our reputation system rewards those who help others grow and solve complex challenges." 
               />
            </div>
         </div>
      </section>

      {/* --- 4. FUTURE VISION --- */}
      <section className="py-40 relative">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="space-y-12"
            >
               <h2 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight">Shaping the Future <br /> of Engineering.</h2>
               <p className="text-secondary text-xl font-semibold opacity-80 max-w-3xl mx-auto leading-relaxed">
                  We are just getting started. From automated refactoring to collaborative cloud workspaces, Codefix is evolving every day to meet the demands of the modern engineer.
               </p>
                <div className="pt-10">
                   <Link to="/signup" className="w-fit bg-primary hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-105 group flex items-center gap-4 mx-auto uppercase tracking-widest text-sm">
                      Join the Journey <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                   </Link>
                </div>
            </motion.div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StoryPoint = ({ icon, title, desc }) => (
  <div className="flex gap-6 group">
    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="space-y-2">
      <h4 className="text-xl font-semibold tracking-tight">{title}</h4>
      <p className="text-secondary text-base font-semibold opacity-70 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div className="p-12 rounded-[3.5rem] bg-surface/30 border border-white/5 hover:border-primary/40 transition-all group">
     <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl mb-10 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <h4 className="text-2xl font-semibold text-white mb-4 tracking-tight">{title}</h4>
     <p className="text-secondary text-base font-semibold opacity-70 leading-relaxed">{desc}</p>
  </div>
);

export default About;