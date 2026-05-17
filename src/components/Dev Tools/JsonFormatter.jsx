import React, { useState, useEffect, useCallback } from 'react';
import { FaCode, FaCopy, FaTriangleExclamation, FaEraser } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [jsonMode, setJsonMode] = useState('pretty');

  // JSON Formatting Logic (The Core)
  const formatJSON = useCallback((mode = jsonMode) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      // Step 1: String ko JavaScript Object mein badlo
      const parsed = JSON.parse(input);
      
      // Step 2: Object ko wapis string mein badlo (Indentation ke sath)
      // null, 2 ka matlab hai: No replacer, and 2-space indentation
      const result = mode === 'pretty' 
        ? JSON.stringify(parsed, null, 2) 
        : JSON.stringify(parsed); // Minify logic (No spaces)
      
      setOutput(result);
      setError('');
    } catch (e) {
      // Agar JSON ghalat ho, to error pakro (Try-Catch)
      setError("Invalid JSON: " + e.message);
      setOutput('');
    }
  }, [input, jsonMode]);

  useEffect(() => {
    formatJSON();
  }, [formatJSON]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* INPUT AREA */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Source Payload</label>
          </div>
          <button 
            onClick={() => setInput('')} 
            className="text-slate-400 hover:text-rose-500 transition-colors text-[10px] flex items-center gap-2 font-black uppercase tracking-[3px]"
          >
            <FaEraser /> Reset Node
          </button>
        </div>
        <div className="relative group/input">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
           <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your raw JSON here...'
              className="relative w-full h-[500px] bg-slate-900 border border-slate-800 rounded-3xl p-8 font-mono text-sm text-slate-300 focus:border-primary/50 focus:ring-0 transition-all outline-none resize-none shadow-2xl custom-scrollbar placeholder:text-slate-700"
           />
        </div>
      </div>

      {/* OUTPUT AREA */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button 
                onClick={() => setJsonMode('pretty')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[2px] transition-all ${jsonMode === 'pretty' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Pretty
              </button>
              <button 
                onClick={() => setJsonMode('mini')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[2px] transition-all ${jsonMode === 'mini' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Minify
              </button>
           </div>
          <button 
            onClick={() => handleCopy(output)} 
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px] border border-primary/20"
          >
            <FaCopy /> Sync to Clip
          </button>
        </div>

        <div className="relative group/output h-[500px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
           <div className="absolute inset-0 p-8 overflow-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full flex flex-col items-center justify-center text-center p-10"
                >
                  <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 shadow-lg">
                    <FaTriangleExclamation className="text-rose-500 text-3xl" />
                  </div>
                  <h3 className="text-rose-500 font-black uppercase tracking-[4px] text-[10px] mb-4">Protocol Violation: Invalid Structure</h3>
                  <p className="text-rose-400/60 text-xs font-mono bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 max-w-sm">{error}</p>
                </motion.div>
              ) : output ? (
                <motion.div 
                  key={jsonMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm text-emerald-400 whitespace-pre selection:bg-emerald-500/20"
                >
                  {output}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-slate-700 italic text-center p-12"
                >
                  <FaCode className="text-5xl mb-6 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-[4px] opacity-40">Awaiting Neural Payload...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
