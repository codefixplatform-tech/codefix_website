import React, { useState, useEffect, useCallback } from 'react';
import { FaCode, FaCopy, FaTriangleExclamation, FaEraser } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [jsonMode, setJsonMode] = useState('pretty');

  const formatJSON = useCallback((mode = jsonMode) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      const result = mode === 'pretty' 
        ? JSON.stringify(parsed, null, 2) 
        : JSON.stringify(parsed);
      setOutput(result);
      setError('');
    } catch (e) {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Input JSON</label>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Live Sync</span>
          </div>
          <button onClick={() => setInput('')} className="text-slate-500 hover:text-red-400 transition-colors text-xs flex items-center gap-2 font-bold uppercase tracking-tighter">
            <FaEraser /> Clear
          </button>
        </div>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here...'
          className="w-full h-[450px] bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none resize-none shadow-inner custom-scrollbar"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setJsonMode('pretty')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${jsonMode === 'pretty' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Pretty
              </button>
              <button 
                onClick={() => setJsonMode('mini')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${jsonMode === 'mini' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Minify
              </button>
           </div>
          <button onClick={() => handleCopy(output)} className="text-primary hover:text-blue-400 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <FaCopy /> Copy
          </button>
        </div>
        <div className="relative h-[450px] bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 p-6 overflow-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                    <FaTriangleExclamation className="text-red-500 text-2xl" />
                  </div>
                  <h3 className="text-red-400 font-black uppercase tracking-widest text-xs mb-2">Invalid JSON Structure</h3>
                  <p className="text-red-300/60 text-xs font-mono">{error}</p>
                </motion.div>
              ) : output ? (
                <motion.div 
                  key={jsonMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm text-blue-300 whitespace-pre"
                >
                  {output}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  className="h-full flex flex-col items-center justify-center text-slate-500 italic text-center p-10"
                >
                  <FaCode className="text-3xl mb-4 opacity-20" />
                  <p className="text-sm">Real-time output will appear here...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
