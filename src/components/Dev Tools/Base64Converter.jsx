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
          const encoded = btoa(unescape(encodeURIComponent(input)));
          setOutput(encoded);
          setError('');
        } catch (e) {
          setOutput(btoa(input));
          setError('');
        }
      } else {
        const sanitizedInput = input.replace(/\s/g, ''); 
        if (sanitizedInput && /[^A-Za-z0-9+/=]/.test(sanitizedInput)) {
          throw new Error("Invalid characters detected. Base64 only allows A-Z, a-z, 0-9, +, /, and =.");
        }

        try {
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
    handleBase64();
  }, [handleBase64]);

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
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Input Data</label>
            <span className="text-[9px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Auto Processor</span>
          </div>
          <button onClick={() => setInput('')} className="text-slate-500 hover:text-red-400 transition-colors"><FaEraser /></button>
        </div>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={base64Mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
          className="w-full h-[350px] bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm focus:border-emerald-500/50 outline-none resize-none custom-scrollbar"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setBase64Mode('encode')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-semibold uppercase transition-all ${base64Mode === 'encode' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-500'}`}
              >
                Encode
              </button>
              <button 
                onClick={() => setBase64Mode('decode')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-semibold uppercase transition-all ${base64Mode === 'decode' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-500'}`}
              >
                Decode
              </button>
           </div>
          <button onClick={() => handleCopy(output)} className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
            <FaCopy /> Copy
          </button>
        </div>
        <div className="relative h-[350px] bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
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
                  <h3 className="text-red-400 font-semibold uppercase tracking-widest text-xs mb-2">Validation Failed</h3>
                  <p className="text-red-300/60 text-[10px] font-mono leading-relaxed">{error}</p>
                </motion.div>
              ) : output ? (
                <motion.div 
                  key={base64Mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm text-emerald-300 whitespace-pre-wrap break-all"
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
                  <FaDatabase className="text-3xl mb-4 opacity-20" />
                  <p className="text-sm">Processed output will appear here...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64Converter;
