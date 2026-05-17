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
    <div className="space-y-10">
      <div className="w-full">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Regular Expression Protocol</label>
          </div>
          <div className="relative group/regex">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-indigo-600/10 blur-xl opacity-0 group-focus-within/regex:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 focus-within:border-primary/50 transition-all shadow-2xl">
              <span className="text-slate-600 font-mono text-xl mr-4">/</span>
              <input 
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder='([a-z0-9._-]+)@([a-z0-9.-]+)...'
                className="bg-transparent border-none outline-none flex-1 font-mono text-blue-400 text-sm placeholder:text-slate-700"
              />
              <span className="text-slate-600 font-mono text-xl ml-4">/</span>
              <input 
                value={regexFlags}
                onChange={(e) => setRegexFlags(e.target.value)}
                className="bg-transparent border-none outline-none w-16 ml-3 text-emerald-400 font-mono text-sm font-bold"
                placeholder='gim'
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* INPUT AREA */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Test Node Payload</label>
            </div>
          </div>
          <div className="relative group/input">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-transparent blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter text to test against the regex...'
              className="relative w-full h-[350px] bg-slate-900 border border-slate-800 rounded-3xl p-8 font-mono text-sm text-slate-300 focus:border-emerald-500/50 focus:ring-0 transition-all outline-none resize-none shadow-2xl custom-scrollbar placeholder:text-slate-700"
            />
          </div>
        </div>

        {/* OUTPUT AREA */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Analysis Results</label>
            {output && !error && output !== "No matches found." && (
              <span className="text-[9px] font-black px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 uppercase tracking-[2px]">
                {output.split('\n').length} Matches Captured
              </span>
            )}
          </div>
          <div className="relative group/output h-[350px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 overflow-auto p-8 font-mono text-sm custom-scrollbar">
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
                    <h3 className="text-rose-500 font-black uppercase tracking-[4px] text-[10px] mb-4">Protocol Fault: Regex Error</h3>
                    <p className="text-rose-400/60 text-xs font-mono bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 max-w-sm">{error}</p>
                  </motion.div>
                ) : output ? (
                  <motion.div 
                    key="results"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="space-y-3"
                  >
                    {output === "No matches found." ? (
                      <div className="h-full flex flex-col items-center justify-center py-20 text-slate-700 font-black uppercase tracking-[3px] text-[10px] opacity-40">Zero Matches Detected</div>
                    ) : (
                      output.split('\n').map((line, i) => (
                        <motion.div 
                          key={i}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          className="group flex items-center gap-4 py-3 px-5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all"
                        >
                          <span className="w-6 h-6 flex items-center justify-center bg-emerald-500/10 text-emerald-500 text-[9px] rounded-lg font-black">{i + 1}</span>
                          <span className="text-emerald-400/90 group-hover:text-emerald-400 transition-colors tracking-tight font-bold">{line.replace(`Match ${i + 1}: `, '')}</span>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-slate-700 italic text-center p-12"
                  >
                    <FaMagnifyingGlass className="text-5xl mb-6 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[4px] opacity-40">Awaiting Search Protocol...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
