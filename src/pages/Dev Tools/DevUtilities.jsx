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
  FaMicrochip
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
      title: "JSON Formatter",
      category: "Data & Format",
      description: "Prettify, minify and validate your JSON data instantly with syntax highlighting.",
      tags: ["Syntax", "Structure"],
      preview: "{\n  \"status\": \"success\"\n}"
    },
    {
      id: "base64-converter",
      icon: <FaDatabase />,
      title: "Base64 Utility",
      category: "Security & Encoding",
      description: "Convert text or images to Base64 and vice-versa with military-grade local processing.",
      tags: ["Binary", "Local"],
      highlight: true,
      preview: "SGVsbG8gV29ybGQ="
    },
    {
      id: "regex-tester",
      icon: <FaHashtag />,
      title: "Regex Engine",
      category: "Text Processing",
      description: "Test your regular expressions in real-time with pattern highlighting and groups.",
      tags: ["Patterns", "Matching"],
      preview: "/^[a-z]+$/g"
    },
    {
      id: "api-tester",
      icon: <FaTerminal />,
      title: "API Terminal",
      category: "Network & API",
      description: "Send HTTP requests (GET, POST, etc.) and inspect responses directly in your browser.",
      tags: ["REST", "Testing"],
      preview: "GET /api/v1/user"
    },
    {
        id: "unit-converter",
        icon: <FaBolt />,
        title: "Unit Converter",
        category: "Math & Logic",
        description: "Pixel to REM, Hex to RGB, and other essential developer conversions.",
        tags: ["CSS", "Math"],
        preview: "16px -> 1rem"
    },
    {
        id: "secure-gen",
        icon: <FaShieldAlt />,
        title: "Secret Generator",
        category: "Security",
        description: "Generate high-entropy passwords, API keys, and secure UUIDs locally.",
        tags: ["UUID", "Security"],
        preview: "uuid-v4-xxxx-xxxx"
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
    <div className={`relative min-h-screen bg-background text-white overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      
      {/* --- HERO HEADER --- */}
      <section className={`relative ${isDashboard ? 'py-10' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
              <FaMicrochip className="text-primary text-[10px]" />
              <span className="text-[10px] font-semibold text-slate-300 tracking-[4px] uppercase">Engineered Tools v2.0</span>
           </motion.div>
           
           <motion.h1 {...fadeIn} className="text-6xl md:text-8xl font-semibold leading-[1.05] tracking-tight">
              Developer <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Power Station
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-3xl mx-auto text-secondary text-xl font-semibold opacity-80 leading-relaxed">
              Essential, high-speed utilities for your daily coding flow. 100% Client-side. No data tracking. Pure productivity.
           </motion.p>
        </div>
      </section>

      {/* --- UTILITIES GRID --- */}
      <section className="pb-32">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
           
           {/* Search Bar */}
           <div className="max-w-2xl mx-auto mb-20 relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 backdrop-blur-2xl focus-within:border-primary/50 transition-all shadow-2xl">
                 <FaSearch className="text-slate-500 mr-5" />
                 <input 
                    type="text" 
                    placeholder="Search utilities by name or category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-white font-semibold text-sm placeholder:text-slate-600"
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredUtils.map((util, index) => (
                    <motion.div 
                        key={util.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                        <UtilityPowerCard 
                            util={util} 
                            onClick={() => {
                                const basePath = isDashboard ? '/dashboard/dev-utilities' : '/dev-utilities';
                                navigate(`${basePath}/${util.id}`);
                            }} 
                        />
                    </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const UtilityPowerCard = ({ util, onClick }) => (
  <div 
    onClick={onClick}
    className={`group relative p-1 leading-none rounded-[3rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full
      ${util.highlight ? 'bg-gradient-to-br from-primary/40 to-blue-500/40 shadow-[0_20px_50px_rgba(59,130,246,0.15)]' : 'bg-white/5 border border-white/10 hover:border-white/20'}`}
  >
    <div className="p-10 rounded-[2.9rem] h-full bg-[#0B0E14]/90 backdrop-blur-3xl flex flex-col space-y-8">
       <div className="flex justify-between items-start">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 
             ${util.highlight ? 'bg-primary text-white shadow-xl shadow-primary/30 rotate-3' : 'bg-white/5 text-primary group-hover:bg-primary group-hover:text-white'}`}>
             {util.icon}
          </div>
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
             <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">{util.category}</span>
          </div>
       </div>

       <div>
          <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
             {util.title}
          </h3>
          <p className="text-secondary text-sm leading-relaxed font-semibold opacity-70 group-hover:opacity-90 transition-opacity line-clamp-2">
             {util.description}
          </p>
       </div>

       {/* Visual Code Preview */}
       <div className="bg-black/40 rounded-2xl p-6 border border-white/5 font-mono text-[11px] text-emerald-400/60 group-hover:text-emerald-400 transition-colors overflow-hidden h-24 flex items-center">
          <pre className="whitespace-pre-wrap">{util.preview}</pre>
       </div>

       <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex gap-3">
             {util.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">#{tag}</span>
             ))}
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all group-hover:translate-x-2">
             <FaArrowRight size={14} />
          </div>
       </div>
    </div>
  </div>
);

export default DevUtilities;
