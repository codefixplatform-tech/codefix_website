import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint,
  FaFileZipper, 
  FaFileImage,
  FaScissors,
  FaLayerGroup,
  FaArrowRight,
  FaBolt
} from "react-icons/fa6";

import {FaShieldAlt,FaSearch} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Tools = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const toolList = [
    {
      id: "pdf-to-word",
      icon: <FaFilePdf />,
      title: "PDF to Word",
      category: "Convert",
      description: "Convert your PDF documents into editable Word files with high accuracy and layout retention.",
      tags: ["Fast", "Office"],
      format: "PDF"
    },
    {
      id: "word-to-pdf",
      icon: <FaFileWord />,
      title: "Word to PDF",
      category: "Convert",
      description: "Transform your DOCX files into professional PDF documents instantly with military-grade precision.",
      tags: ["Secure", "DOCX"],
      highlight: true,
      format: "Word"
    },
    {
      id: "excel-to-pdf",
      icon: <FaFileExcel />,
      title: "Excel to PDF",
      category: "Convert",
      description: "Cleanly convert spreadsheets to PDF while maintaining cell formatting and layout integrity.",
      tags: ["Reports", "Data"],
      format: "Excel"
    },
    {
      id: "merge-pdf",
      icon: <FaLayerGroup />,
      title: "Merge PDF",
      category: "Edit",
      description: "Combine multiple PDF files into one single organized document seamlessly with batch support.",
      tags: ["Combine", "Batch"],
      format: "PDF"
    },
    {
      id: "split-pdf",
      icon: <FaScissors />,
      title: "Split PDF",
      category: "Edit",
      description: "Extract specific pages or separate every page into individual PDF files with a single click.",
      tags: ["Extract", "Pages"],
      format: "PDF"
    },
    {
      id: "compress-pdf",
      icon: <FaFileZipper />,
      title: "Compress PDF",
      category: "Optimize",
      description: "Reduce file size significantly without losing the original visual quality for faster sharing.",
      tags: ["Storage", "Web"],
      format: "PDF"
    },
    {
      id: "image-to-pdf",
      icon: <FaFileImage />,
      title: "Image to PDF",
      category: "Convert",
      description: "Turn your JPG, PNG or WebP images into a single high-fidelity professional PDF document.",
      tags: ["Gallery", "HD"],
      format: "Image"
    },
    {
      id: "pdf-to-pptx",
      icon: <FaFilePowerpoint />,
      title: "PDF to PPTX",
      category: "Convert",
      description: "Convert your PDF presentations into editable PowerPoint slides while preserving visual elements and layouts.",
      tags: ["Slides", "Office"],
      format: "PDF"
    },
    {
      id: "pptx-to-pdf",
      icon: <FaFilePowerpoint />,
      title: "PPTX to PDF",
      category: "Convert",
      description: "Transform your PowerPoint presentations into high-quality PDF documents for professional sharing.",
      tags: ["Secure", "Slides"],
      format: "PPTX"
    },
    {
      id: "pdf-to-excel",
      icon: <FaFileExcel />,
      title: "PDF to Excel",
      category: "Convert",
      description: "Extract data tables from PDF documents and convert them into organized Excel spreadsheets instantly.",
      tags: ["Data", "Finance"],
      format: "PDF"
    }
  ];

  const categories = ["All", "PDF", "Word", "Excel", "PPTX", "Image"];

  const filteredTools = toolList.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || tool.format === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const isDashboard = location.pathname.startsWith('/dashboard');

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
              <FaLayerGroup className="text-primary text-[10px]" />
              <span className="text-[10px] font-semibold text-slate-300 tracking-[4px] uppercase">Neural Document Core v2.0</span>
           </motion.div>
           
           <motion.h1 {...fadeIn} className="text-4xl sm:text-6xl md:text-8xl font-semibold leading-[1.1] tracking-tight px-4">
              The Neural <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Powerhouse.
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-3xl mx-auto text-secondary text-base md:text-xl font-semibold opacity-80 leading-relaxed px-4">
              Professional-grade developer utilities and file converters. 100% Client-Side. 100% Private.
           </motion.p>
        </div>
      </section>

      {/* --- FILTER & SEARCH --- */}
      <section className="pb-16">
         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
               {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                  >
                     {cat}
                  </button>
               ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
               <div className="absolute inset-0 bg-primary/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
               <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus-within:border-primary/50 transition-all">
                  <FaSearch className="text-slate-600 mr-4" />
                  <input 
                     type="text" 
                     placeholder="Search format or tool..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-transparent outline-none text-white font-semibold text-xs placeholder:text-slate-600"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* --- TOOLS GRID --- */}
      <section className="pb-32">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredTools.map((tool, index) => (
                    <motion.div 
                        key={tool.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ToolPowerCard 
                            tool={tool} 
                            onClick={() => {
                                const basePath = isDashboard ? '/dashboard/tools' : '/tools';
                                navigate(`${basePath}/${tool.id}`);
                            }} 
                        />
                    </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </section>

      {/* --- SECURITY BANNER --- */}
      <section className="pb-32">
         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-white/5 p-10 md:p-16 rounded-[4rem] flex flex-col md:flex-row items-center gap-10">
               <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 text-4xl shadow-xl shadow-emerald-500/10">
                  <FaShieldAlt />
               </div>
               <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-semibold tracking-tight">Neural Privacy Protocol</h3>
                  <p className="text-secondary text-lg font-semibold opacity-70 leading-relaxed">Unlike other platforms, Codefix never uploads your files to a server. All conversions are performed using your browser's local processing engine, ensuring 100% data sovereignty.</p>
               </div>
               <div className="flex-shrink-0">
                  <div className="bg-emerald-500 text-black px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Client-Side Only</div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const ToolPowerCard = ({ tool, onClick }) => (
  <div 
    onClick={onClick}
    className={`group relative p-1 leading-none rounded-[3.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full
      ${tool.highlight ? 'bg-gradient-to-br from-primary/50 to-blue-500/50 shadow-2xl' : 'bg-white/5 border border-white/10 hover:border-white/20'}`}
  >
    <div className="p-10 rounded-[3.4rem] h-full bg-[#0B0E14]/90 backdrop-blur-3xl flex flex-col space-y-8">
       <div className="flex justify-between items-start">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 
             ${tool.highlight ? 'bg-primary text-white shadow-xl shadow-primary/30 rotate-3' : 'bg-white/5 text-primary group-hover:bg-primary group-hover:text-white'}`}>
             {tool.icon}
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
             <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{tool.category}</span>
          </div>
       </div>

       <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white tracking-tight group-hover:text-primary transition-colors">
             {tool.title}
          </h3>
          <p className="text-secondary text-sm leading-relaxed font-semibold opacity-70 group-hover:opacity-100 transition-opacity line-clamp-3">
             {tool.description}
          </p>
       </div>

       {/* Flow Indicator */}
       <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
             <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">v2.0 Core</span>
          </div>
          <div className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-all">
             <FaBolt />
          </div>
       </div>

       <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex gap-3">
             {tool.tags.slice(0, 2).map((tag, idx) => (
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

export default Tools;