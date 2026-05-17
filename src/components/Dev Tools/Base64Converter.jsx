import React, { useState, useEffect, useCallback } from 'react';
import { FaDatabase, FaCopy, FaTriangleExclamation, FaEraser } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Base64Converter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');


  const handleBase64 = useCallback((mode = base64Mode) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      if (mode === 'encode') {
        try {
          // Special characters (jaise emojis ya symbols) ko handle krne k liye
          // Binary to ASCII (btoa)
          const encoded = btoa(unescape(encodeURIComponent(input)));
          setOutput(encoded);
          setError('');
        } catch (e) {
          // Traditional encode
          setOutput(btoa(input));
          setError('');
        }
      } else {
        // Base64 string mein spaces ko remove krne k liye
        const sanitizedInput = input.replace(/\s/g, ''); 
        // Base64 string validation (check krta hai k characters sahi hain ya nhi)
        if (sanitizedInput && /[^A-Za-z0-9+/=]/.test(sanitizedInput)) {
          throw new Error("Invalid characters detected. Base64 only allows A-Z, a-z, 0-9, +, /, and =.");
        }

        try {
          // Special characters ko handle krne k liye
          // atob decode base64 string ko binary string mein convert krta hai
          const decoded = decodeURIComponent(escape(atob(sanitizedInput)));
          setOutput(decoded);
          setError('');
        } catch (e) {
          setOutput(atob(sanitizedInput));
          setError('');
        }
      }
    } catch (e) {
      setError("Invalid Base64 string. Please check the characters and format.");
      setOutput('');
    }
  }, [input, base64Mode]);

  useEffect(() => {
    // useEffect tab run hoga jab 'input' ya 'base64Mode' change hoga
    handleBase64();
  }, [handleBase64]);

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
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Source Data</label>
          </div>
          <button 
            onClick={() => setInput('')} 
            className="text-slate-400 hover:text-rose-500 transition-colors text-[10px] flex items-center gap-2 font-black uppercase tracking-[3px]"
          >
            <FaEraser /> Reset Pipeline
          </button>
        </div>
        <div className="relative group/input">
           <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-transparent blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
           <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={base64Mode === 'encode' ? 'Enter raw text to encode...' : 'Paste Base64 string to decode...'}
              className="relative w-full h-[450px] bg-slate-900 border border-slate-800 rounded-3xl p-8 font-mono text-sm text-slate-300 focus:border-emerald-500/50 focus:ring-0 transition-all outline-none resize-none shadow-2xl custom-scrollbar placeholder:text-slate-700"
           />
        </div>
      </div>

      {/* OUTPUT AREA */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button 
                onClick={() => setBase64Mode('encode')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[2px] transition-all ${base64Mode === 'encode' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Encode
              </button>
              <button 
                onClick={() => setBase64Mode('decode')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[2px] transition-all ${base64Mode === 'decode' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Decode
              </button>
           </div>
          <button 
            onClick={() => handleCopy(output)} 
            className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-6 py-2 rounded-xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px] border border-emerald-500/20"
          >
            <FaCopy /> Sync to Clip
          </button>
        </div>

        <div className="relative group/output h-[450px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
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
                  <h3 className="text-rose-500 font-black uppercase tracking-[4px] text-[10px] mb-4">Pipeline Fault: Invalid Encoding</h3>
                  <p className="text-rose-400/60 text-xs font-mono bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 max-w-sm">{error}</p>
                </motion.div>
              ) : output ? (
                <motion.div 
                  key={base64Mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm text-emerald-400 whitespace-pre-wrap break-all selection:bg-emerald-500/20"
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
                  <FaDatabase className="text-5xl mb-6 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-[4px] opacity-40">Awaiting Data Sync...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Base64Converter;
