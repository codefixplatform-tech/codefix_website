import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiSearch, HiX } from 'react-icons/hi';
import { 
  FaQuestionCircle, 
  FaCircleNotch, 
  FaChevronRight, 
  FaTools, 
  FaCode, 
  FaTerminal, 
  FaHashtag, 
  FaDatabase, 
  FaFilePdf, 
  FaFileWord, 
  FaRobot,
  FaHome,
  FaUser,
  FaInfoCircle,
  FaCog
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SITE_MAP = [
  // Dev Utilities
  { title: "JSON Formatter", path: "/dev-utilities/json-formatter", category: "Dev Tools", icon: <FaCode />, keywords: "pretty minify validate" },
  { title: "Base64 Converter", path: "/dev-utilities/base64-converter", category: "Dev Tools", icon: <FaDatabase />, keywords: "encode decode binary" },
  { title: "Regex Tester", path: "/dev-utilities/regex-tester", category: "Dev Tools", icon: <FaHashtag />, keywords: "pattern match regular expression" },
  { title: "API Tester", path: "/dev-utilities/api-tester", category: "Dev Tools", icon: <FaTerminal />, keywords: "http request post get rest" },
  
  // File Tools (Converters & Editors)
  { title: "PDF to Word", path: "/tools/pdf-to-word", category: "PDF Tools", icon: <FaFilePdf />, keywords: "convert docx office" },
  { title: "Word to PDF", path: "/tools/word-to-pdf", category: "PDF Tools", icon: <FaFileWord />, keywords: "convert docx office" },
  { title: "Excel to PDF", path: "/tools/excel-to-pdf", category: "PDF Tools", icon: <FaFilePdf />, keywords: "convert spreadsheet xlsx" },
  { title: "Merge PDF", path: "/tools/merge-pdf", category: "PDF Tools", icon: <FaTools />, keywords: "combine join sequence" },
  { title: "Split PDF", path: "/tools/split-pdf", category: "PDF Tools", icon: <FaTools />, keywords: "extract separate pages" },
  { title: "Compress PDF", path: "/tools/compress-pdf", category: "PDF Tools", icon: <FaFilePdf />, keywords: "size reduce light optimization" },
  { title: "Image to PDF", path: "/tools/image-to-pdf", category: "PDF Tools", icon: <FaFilePdf />, keywords: "jpg png convert scan" },
  { title: "PDF to PPTX", path: "/tools/pdf-to-pptx", category: "PDF Tools", icon: <FaFilePdf />, keywords: "convert slides powerpoint" },
  { title: "PPTX to PDF", path: "/tools/pptx-to-pdf", category: "PDF Tools", icon: <FaFilePdf />, keywords: "convert slides powerpoint" },
  { title: "PDF to Excel", path: "/tools/pdf-to-excel", category: "PDF Tools", icon: <FaFilePdf />, keywords: "convert spreadsheet table data" },
  
  // Pages & Navigation
  { title: "AI Assistant", path: "/ai-assistant", category: "Platform", icon: <FaRobot />, keywords: "chat help bot gpt neural" },
  { title: "Community Q&A", path: "/questions", category: "Community", icon: <FaQuestionCircle />, keywords: "help forum discussion solver" },
  { title: "Ask Question", path: "/questions/ask", category: "Community", icon: <FaQuestionCircle />, keywords: "post help discussion" },
  { title: "My Profile", path: "/dashboard/profile", category: "Dashboard", icon: <FaUser />, keywords: "settings identity avatar" },
  { title: "Account Preferences", path: "/dashboard/preferences", category: "Dashboard", icon: <FaCog />, keywords: "settings dark mode notifications privacy" },
  { title: "Home", path: "/", category: "Platform", icon: <FaHome />, keywords: "main landing homepage" },
  { title: "About Us", path: "/about", category: "Platform", icon: <FaInfoCircle />, keywords: "company team mission" }
];

const GlobalSearch = ({ variant = 'landing', placeholder = "Search tools, docs & pages..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Dynamic Supabase results
  const [localResults, setLocalResults] = useState([]); // Static SITE_MAP results
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        setLocalResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      // 1. Local Filter (Static Pages & Tools)
      const filteredLocal = SITE_MAP.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setLocalResults(filteredLocal);
      
      // 2. Supabase Filter (Dynamic Questions)
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('id, title, created_at')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .limit(4);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleNavigate = (path) => {
    // Smart pathing: if in dashboard, keep dashboard prefix if applicable
    let finalPath = path;
    if (isDashboard && !path.startsWith('/dashboard') && path !== '/') {
        // Check if a dashboard version exists or if it's meant to be global
        if (SITE_MAP.find(i => i.path === `/dashboard${path}`)) {
            finalPath = `/dashboard${path}`;
        }
    }
    
    navigate(finalPath);
    setIsOpen(false);
    setQuery('');
  };

  const handleFullSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const searchPath = isDashboard ? '/dashboard/questions' : '/questions';
      navigate(`${searchPath}?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative w-full max-w-sm lg:max-w-md group" ref={dropdownRef}>
      {/* Search Bar */}
      <form onSubmit={handleFullSearch} className="relative">
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'text-primary scale-110' : 'text-slate-500'}`}>
          {isLoading ? <FaCircleNotch className="animate-spin" size={16} /> : <HiSearch size={22} />}
        </span>
        
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full py-2.5 pl-12 pr-10 text-sm text-white focus:outline-none transition-all duration-500 border backdrop-blur-xl rounded-2xl ${
            variant === 'dashboard' 
              ? 'bg-white/5 border-white/5 focus:border-primary/50 focus:bg-white/10' 
              : 'bg-white/5 border-white/10 focus:border-primary/40 rounded-full'
          }`}
        />

        <AnimatePresence>
          {query && (
            <motion.button 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              type="button"
              onClick={() => { setQuery(''); setResults([]); setLocalResults([]); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <HiX size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute top-full mt-3 w-[120%] -left-[10%] lg:w-full lg:left-0 bg-[#0F172A]/98 border border-white/10 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl z-[9999] overflow-hidden"
          >
            <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              
              {/* Local Tools/Pages Results */}
              {localResults.length > 0 && (
                <div className="space-y-1">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[3px] text-primary/80">Tools & Navigation</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">{localResults.length} Found</span>
                  </div>
                  {localResults.map((item, idx) => (
                    <button 
                      key={`local-${idx}`}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left group/item border border-transparent hover:border-white/5"
                    >
                      <div className="bg-white/5 p-2.5 rounded-xl group-hover/item:text-primary transition-colors border border-white/5">
                        {React.cloneElement(item.icon, { size: 14 })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-black opacity-60">{item.category}</p>
                      </div>
                      <FaChevronRight className="text-slate-700 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" size={10} />
                    </button>
                  ))}
                </div>
              )}

              {/* knowledge base / Questions Results */}
              {results.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-white/5">
                  <div className="px-4 py-2">
                    <span className="text-[9px] font-black uppercase tracking-[3px] text-emerald-400/80">Community Knowledge</span>
                  </div>
                  {results.map((item) => (
                    <button 
                      key={`qa-${item.id}`}
                      onClick={() => handleNavigate(`/questions/${item.id}`)}
                      className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left group/item"
                    >
                      <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
                        <FaQuestionCircle size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Community Q&A Discussion</p>
                      </div>
                      <FaChevronRight className="text-slate-700 mt-2 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" size={10} />
                    </button>
                  ))}
                </div>
              )}

              {/* Empty & Loading States */}
              {localResults.length === 0 && results.length === 0 && (
                query.length >= 2 && !isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <HiSearch className="text-slate-600" size={24} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">No results found for "{query}"</p>
                    <p className="text-slate-600 text-xs mt-1">Try keywords like 'JSON', 'PDF', or 'AI'</p>
                  </motion.div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center space-y-4 opacity-40">
                    <FaCircleNotch className="animate-spin text-primary" size={28} />
                    <p className="text-[10px] font-black uppercase tracking-[4px]">Scanning Platform Index...</p>
                  </div>
                )
              )}

              {/* Footer Search Link */}
              {(localResults.length > 0 || results.length > 0) && (
                <div className="p-2 border-t border-white/5">
                  <button 
                    onClick={handleFullSearch}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-primary text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[3px] transition-all border border-white/5"
                  >
                    Deep search knowledge base
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
