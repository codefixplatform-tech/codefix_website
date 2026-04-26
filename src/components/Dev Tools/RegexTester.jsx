import React, { useState, useEffect, useCallback } from 'react';
import { FaHashtag, FaTriangleExclamation, FaMagnifyingGlass } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';

const RegexTester = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [regex, setRegex] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');

  const testRegex = useCallback(() => {
    try {
      if (!regex || !input) {
        setOutput('');
        setError('');
        return;
      }
      const re = new RegExp(regex, regexFlags);
      const matches = [...input.matchAll(re)];
      
      if (matches.length === 0) {
        setOutput("No matches found.");
      } else {
        const result = matches.map((m, i) => `Match ${i + 1}: ${m[0]} (Index: ${m.index})`).join('\n');
        setOutput(result);
      }
      setError('');
    } catch (e) {
      setError("Regex Error: " + e.message);
      setOutput('');
    }
  }, [regex, regexFlags, input]);

  useEffect(() => {
    testRegex();
  }, [testRegex]);

  return (
    <div className="space-y-8">
      <div className="w-full">
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Regular Expression</label>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-500/50 transition-all">
            <span className="text-slate-500 mr-2">/</span>
            <input 
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder='([a-z0-9._-]+)@([a-z0-9.-]+)...'
              className="bg-transparent border-none outline-none flex-1 font-mono text-blue-400"
            />
            <span className="text-slate-500 ml-2">/</span>
            <input 
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              className="bg-transparent border-none outline-none w-12 ml-1 text-emerald-400 font-mono"
              placeholder='gim'
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Test String</label>
            <div className="flex gap-2">
               <span className="text-[9px] font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Live Input</span>
            </div>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter text to test against the regex...'
            className="w-full h-[300px] bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm outline-none focus:border-blue-500/30 transition-all resize-none shadow-inner"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Matches & Results</label>
            {output && !error && output !== "No matches found." && (
              <span className="text-[9px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                {output.split('\n').length} Matches Found
              </span>
            )}
          </div>
          <div className="w-full h-[300px] bg-black/20 border border-white/5 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 overflow-auto p-6 font-mono text-sm custom-scrollbar">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 flex items-start gap-3"
                  >
                    <FaTriangleExclamation className="text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-semibold text-xs uppercase tracking-wider mb-1">Regex Configuration Error</p>
                      <p className="text-red-300/80 text-xs leading-relaxed">{error}</p>
                    </div>
                  </motion.div>
                ) : output ? (
                  <motion.div 
                    key="results"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="space-y-2"
                  >
                    {output === "No matches found." ? (
                      <p className="text-slate-500 italic">No matches found.</p>
                    ) : (
                      output.split('\n').map((line, i) => (
                        <motion.div 
                          key={i}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                        >
                          <span className="w-5 h-5 flex items-center justify-center bg-blue-500/10 text-blue-400 text-[10px] rounded font-semibold">{i + 1}</span>
                          <span className="text-blue-100/90 group-hover:text-blue-200 transition-colors">{line.replace(`Match ${i + 1}: `, '')}</span>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="h-full flex flex-col items-center justify-center text-slate-500 italic text-center p-10"
                  >
                    <FaMagnifyingGlass className="text-3xl mb-4 opacity-20" />
                    <p>Waiting for regex and input...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
