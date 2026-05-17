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
import SEO from '../../components/SEO';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const Tools = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

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
      id: "pptx-to-pdf",
      icon: <FaFilePowerpoint />,
      title: "PPTX to PDF",
      category: "Convert",
      description: "Transform your PowerPoint presentations into high-quality PDF documents for professional sharing.",
      tags: ["Secure", "Slides"],
      format: "PPTX"
    }
  ];



  const filteredTools = toolList.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDashboard = location.pathname.startsWith('/dashboard');

  const shouldReduceMotion = useReducedMotion();
  
  const fadeIn = shouldReduceMotion ? {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 }
  } : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className={`relative min-h-screen bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      <SEO 
        title="File Tools" 
        description="High-performance, client-side document converters and editors. 100% private and secure." 
      />
      
      {/* --- HERO HEADER: BOLD & ARCHITECTURAL --- */}
      <section className={`relative overflow-hidden ${isDashboard ? 'py-10' : 'pt-32 pb-24 lg:pt-56 lg:pb-40'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] bg-primary/5 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-blue-400/5 blur-[140px] rounded-full"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 text-center space-y-12">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-2 rounded-full border border-white/10 shadow-2xl">
              <FaLayerGroup className="text-primary text-[10px]" />
              <span className="text-[10px] font-bold tracking-[4px] uppercase">Neural Document Core v2.0</span>
           </motion.div>
           
           <motion.h1 {...fadeIn} className="text-5xl sm:text-7xl md:text-[100px] font-semibold font-heading text-slate-900 leading-[0.9] tracking-tighter mb-10">
              The Neural <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Powerhouse.
              </span>
           </motion.h1>

            <motion.p {...fadeIn} className="max-w-3xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed px-4">
               Professional-grade developer utilities and file converters. 100% Client-Side. 100% Private.
            </motion.p>
        </div>
      </section>

      {/* --- SEARCH BAR --- */}
      <section className="pb-16">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="max-w-2xl mx-auto relative group">
               <div className="absolute inset-0 bg-primary/20 blur-[60px] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-[2rem] px-8 py-5 backdrop-blur-2xl focus-within:border-primary/50 transition-all shadow-xl">
                   <FaSearch className="text-slate-400 mr-5" />
                   <input 
                      type="text" 
                      placeholder="Search format or tool (e.g. PDF, Word, Merge)..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-900 font-semibold text-sm placeholder:text-slate-400"
                   />
                </div>
            </div>
         </div>
      </section>

      {/* --- TOOLS GRID --- */}
      <section className="pb-32">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
           <div className="flex flex-wrap justify-center gap-8">
              <AnimatePresence mode="popLayout">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool, index) => (
                    <motion.div 
                        key={tool.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
                    >
                        <ToolPowerCard 
                            tool={tool} 
                            onClick={() => {
                                const basePath = isDashboard ? '/dashboard/tools' : '/tools';
                                navigate(`${basePath}/${tool.id}`);
                            }} 
                        />
                    </motion.div>
                  ))
                ) : (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full py-20 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaSearch className="text-slate-400 text-2xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900">No tools found</h3>
                    <p className="text-slate-600 text-sm max-w-xs mx-auto font-semibold">
                      We couldn't find any document tools matching your search. Try different keywords.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </section>

      {/* --- SECURITY BANNER --- */}
      <section className="pb-32">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="bg-white border border-slate-200 p-12 md:p-20 rounded-[3rem] md:rounded-[4rem] flex flex-col md:flex-row items-center gap-12 shadow-sm hover:shadow-xl transition-all text-slate-900 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8">
                  <div className="w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-all"></div>
               </div>
               <div className="w-24 h-24 bg-emerald-50/50 rounded-[2rem] flex items-center justify-center text-emerald-500 text-4xl shadow-sm border border-emerald-100 relative z-10">
                  <FaShieldAlt />
               </div>
               <div className="space-y-6 text-center md:text-left relative z-10 flex-1">
                  <h3 className="text-4xl md:text-5xl font-semibold font-heading tracking-tighter leading-[0.9]">Neural <br /><span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Privacy Protocol.</span></h3>
                  <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">Unlike other platforms, Codefix never uploads your files to a server. All conversions are performed using your browser's local processing engine, ensuring 100% data sovereignty.</p>
               </div>
               <div className="flex-shrink-0 relative z-10">
                  <div className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-[4px] text-[10px] shadow-2xl">Local Processing</div>
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
    className="group relative bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full overflow-hidden flex flex-col"
  >
     {/* Ambient Glow */}
     <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700"></div>

     <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
           ${tool.highlight ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-slate-50 text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white'}`}>
           {tool.icon}
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group-hover:bg-primary/5 transition-colors">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tool.category}</span>
        </div>
     </div>

     <div className="space-y-6 relative z-10 flex-1">
        <h3 className="text-2xl font-semibold font-heading text-slate-900 tracking-tighter leading-tight group-hover:text-primary transition-colors">
           {tool.title}
        </h3>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium group-hover:text-slate-600 transition-colors line-clamp-3">
           {tool.description}
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
           {tool.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400 group-hover:text-slate-900 transition-colors">#{tag}</span>
           ))}
        </div>
        <div className="w-12 h-12 flex-shrink-0 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all group-hover:translate-x-2 shadow-sm">
           <FaArrowRight size={14} />
        </div>
     </div>
  </div>
);

export default Tools;