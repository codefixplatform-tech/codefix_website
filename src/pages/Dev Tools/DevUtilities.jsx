import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCode, 
  FaTerminal, 
  FaHashtag, 
  FaDatabase, 
  FaArrowRight,
  FaSearch,
  FaShieldAlt,
  FaBolt,
  FaMicrochip,
  FaFileCsv,
  FaNetworkWired,
  FaLock,
  FaExchangeAlt,
  FaKey,
  FaFileCode
} from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const DevUtilities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [searchQuery, setSearchQuery] = useState("");

  const utilities = [
    {
      id: "json-formatter",
      icon: <FaCode />,
      title: "JSON Neural Core",
      category: "Data Engineering",
      description: "High-velocity prettification and validation for complex nested JSON payloads.",
      tags: ["V8-Engine", "Native"],
      preview: "{\n  \"neural_sync\": \"stable\"\n}"
    },
    {
      id: "base64-converter",
      icon: <FaDatabase />,
      title: "Base64 Pipeline",
      category: "Encoding Protocol",
      description: "Zero-latency binary-to-text conversion with AES-256 local isolation.",
      tags: ["Privacy", "E2EE"],
      preview: "SGVsbG8gV29ybGQ="
    },
    {
      id: "regex-tester",
      icon: <FaHashtag />,
      title: "Regex Lab",
      category: "Pattern Logic",
      description: "Real-time regular expression testing with visual group matching and V8 speed.",
      tags: ["Patterns", "Matching"],
      preview: "/^[a-z]+$/g"
    },
    {
      id: "api-tester",
      icon: <FaTerminal />,
      title: "API Terminal v2",
      category: "Network Infrastructure",
      description: "Integrated HTTP client for debugging endpoints with full header inspection.",
      tags: ["REST", "Async"],
      preview: "GET /api/v1/sync"
    },
    {
        id: "unit-converter",
        icon: <FaExchangeAlt />,
        title: "Unit Matrix",
        category: "Logic Conversion",
        description: "Professional transformations for PX to REM, HEX to RGB, and HSL manipulation.",
        tags: ["CSS", "Architect"],
        preview: "16px -> 1rem"
    },
    {
        id: "secure-gen",
        icon: <FaKey />,
        title: "Secret Generator",
        category: "Cryptographic",
        description: "Generate high-entropy keys, passwords, and secure UUIDs via local entropy.",
        tags: ["Secure", "Local"],
        preview: "xxxx-xxxx-xxxx"
    },
    {
        id: "json-to-csv",
        icon: <FaFileCsv />,
        title: "CSV Flux",
        category: "Data Export",
        description: "High-fidelity conversion from nested JSON structures to flat CSV spreadsheets.",
        tags: ["Export", "Flow"],
        preview: "id,status\n1,active"
    }
  ];

  const filteredUtils = utilities.filter(u => 
    u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className={`relative min-h-screen bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-10 pb-20' : ''}`}>
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
      </div>

      {/* HERO HEADER */}
      <section className={`relative ${isDashboard ? 'py-10' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 text-center space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-2 rounded-full border border-white/10 shadow-2xl mb-10">
              <FaMicrochip className="text-primary text-[10px]" />
              <span className="text-[10px] font-black tracking-[4px] uppercase">Neural Workspace v2.4</span>
           </motion.div>
           
           <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading text-slate-900 leading-[1.1] tracking-[-0.04em] mb-10"
            > Developer <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Power Station.
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
              A comprehensive suite of precision engineering tools. 100% browser-side. Zero data leakage. Pure productivity.
           </motion.p>
        </div>
      </section>

      {/* SEARCH INTERFACE */}
      <section className="pb-32 relative z-10">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            
            <div className="max-w-2xl mx-auto mb-20 relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-600/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
               <div className="relative flex items-center bg-white border border-slate-200 rounded-[2rem] px-10 py-6 focus-within:border-primary/50 transition-all shadow-2xl">
                  <FaSearch className="text-primary mr-6 text-xl opacity-40" />
                  <input 
                     type="text" 
                     placeholder="Search across 15+ specialized nodes..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-transparent outline-none text-slate-900 font-bold text-sm placeholder:text-slate-400"
                  />
               </div>
            </div>

            {/* UTILITIES GRID */}
            <div className="flex flex-wrap justify-center gap-8">
               <AnimatePresence mode="popLayout">
                {filteredUtils.length > 0 ? (
                  filteredUtils.map((util, index) => (
                    <motion.div 
                        key={util.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
                    >
                        <UtilityCard 
                            util={util} 
                            onClick={() => {
                                const basePath = isDashboard ? '/dashboard/dev-utilities' : '/dev-utilities';
                                navigate(`${basePath}/${util.id}`);
                            }} 
                        />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-32 text-center"
                  >
                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                      <FaTerminal className="text-primary text-3xl opacity-20" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">No Active Nodes Found</h3>
                    <p className="text-slate-500 text-lg mt-4 font-medium tracking-tight">Try adjusting your search protocol.</p>
                  </motion.div>
                )}
               </AnimatePresence>
            </div>
         </div>
      </section>
    </div>
  );
};

// --- ELITE COMPONENTS ---

const UtilityCard = ({ util, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full overflow-hidden flex flex-col"
  >
     {/* Ambient Glow */}
     <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700"></div>

     <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
           ${util.highlight ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-slate-50 text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white'}`}>
           {util.icon}
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group-hover:bg-primary/5 transition-colors">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{util.category}</span>
        </div>
     </div>

     <div className="space-y-6 relative z-10 flex-1">
        <h3 className="text-2xl font-semibold font-heading text-slate-900 tracking-tighter leading-tight group-hover:text-primary transition-colors">
           {util.title}
        </h3>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium group-hover:text-slate-600 transition-colors line-clamp-3">
           {util.description}
        </p>
     </div>

     {/* Indicator */}
     <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px]">Engine v2.0</span>
        </div>
        <div className="text-primary/30 group-hover:text-primary transition-all group-hover:scale-125">
           <FaBolt />
        </div>
     </div>

     <div className="mt-10 flex items-center justify-between relative z-10">
        <div className="flex flex-wrap gap-2 sm:gap-4">
           {util.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400 group-hover:text-slate-900 transition-colors">#{tag}</span>
           ))}
        </div>
        <div className="w-12 h-12 flex-shrink-0 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all group-hover:translate-x-2 shadow-sm">
           <FaArrowRight size={14} />
        </div>
     </div>
  </div>
);

export default DevUtilities;
