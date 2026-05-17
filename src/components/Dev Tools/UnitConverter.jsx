import React, { useState, useEffect } from 'react';
import { FaBolt, FaCopy, FaEraser } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const UnitConverter = () => {
  const [activeTab, setActiveTab] = useState('px-rem');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [baseSize, setBaseSize] = useState(16);

  const convert = () => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      switch (activeTab) {
        case 'px-rem':
          setOutput((parseFloat(input) / baseSize).toFixed(3) + 'rem');
          break;
        case 'rem-px':
          setOutput((parseFloat(input) * baseSize).toFixed(0) + 'px');
          break;
        case 'hex-rgb':
          const hex = input.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error();
          setOutput(`rgb(${r}, ${g}, ${b})`);
          break;
        case 'rgb-hex':
          const rgb = input.match(/\d+/g);
          if (!rgb || rgb.length < 3) throw new Error();
          const toHex = (c) => {
            const h = parseInt(c).toString(16);
            return h.length === 1 ? "0" + h : h;
          };
          setOutput("#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]));
          break;
        default:
          setOutput('');
      }
    } catch (e) {
      setOutput('Invalid Input');
    }
  };

  useEffect(() => {
    convert();
  }, [input, activeTab, baseSize]);

  const handleCopy = (text) => {
    if (!text || text === 'Invalid Input') return;
    navigator.clipboard.writeText(text);
    toast.success("Value copied to clipboard!");
  };

  const tabs = [
    { id: 'px-rem', label: 'PX to REM' },
    { id: 'rem-px', label: 'REM to PX' },
    { id: 'hex-rgb', label: 'HEX to RGB' },
    { id: 'rgb-hex', label: 'RGB to HEX' },
  ];

  return (
    <div className="space-y-12">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-3 bg-slate-100 p-2 rounded-[2rem] border border-slate-200 w-fit shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setInput('');
              setOutput('');
            }}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[3px] transition-all ${
              activeTab === tab.id 
              ? 'bg-slate-900 text-white shadow-xl' 
              : 'text-slate-400 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-center">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Source Unit</label>
            </div>
            {(activeTab === 'px-rem' || activeTab === 'rem-px') && (
              <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-[2px]">Base:</span>
                <input 
                  type="number" 
                  value={baseSize} 
                  onChange={(e) => setBaseSize(e.target.value)}
                  className="w-10 bg-transparent text-[10px] font-black text-slate-900 text-center focus:outline-none"
                />
              </div>
            )}
          </div>
          <div className="relative group/input">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTab.startsWith('hex') ? '#ffffff' : activeTab.startsWith('rgb') ? 'rgb(255, 255, 255)' : 'Enter value...'}
              className="relative w-full bg-slate-900 border border-slate-800 rounded-3xl px-8 py-6 text-xl font-mono text-slate-300 focus:border-primary/50 transition-all outline-none shadow-2xl placeholder:text-slate-700"
            />
            <button 
              onClick={() => setInput('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-rose-500 transition-colors"
            >
              <FaEraser />
            </button>
          </div>
        </div>

        {/* Converter Arrow (Desktop) */}
        <div className="hidden lg:flex justify-center">
           <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-primary shadow-2xl animate-pulse">
              <FaExchangeAlt />
           </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Result Vector</label>
            <button 
              onClick={() => handleCopy(output)}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px] border border-primary/20"
            >
              <FaCopy /> Sync to Clip
            </button>
          </div>
          <div className="relative group/output">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-transparent blur-xl opacity-0 group-hover/output:opacity-100 transition-opacity"></div>
            <div className="relative w-full bg-slate-900 border border-slate-800 rounded-3xl px-8 py-6 text-xl font-mono text-emerald-400 min-h-[76px] flex items-center shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={output}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full selection:bg-emerald-500/20"
                >
                  {output || <span className="opacity-10 italic text-sm tracking-widest font-black uppercase">Awaiting Matrix...</span>}
                </motion.span>
              </AnimatePresence>
              {activeTab.includes('hex') || activeTab.includes('rgb') ? (
                <div 
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl border border-white/10 shadow-inner"
                  style={{ backgroundColor: output && output !== 'Invalid Input' ? output : 'transparent' }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 flex items-start gap-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaBolt className="text-[100px] text-primary" />
         </div>
         <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl shrink-0">
            <FaBolt />
         </div>
         <div className="relative z-10 space-y-2">
            <h4 className="text-sm font-black text-white uppercase tracking-[4px]">Architect Protocol</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed tracking-tight max-w-2xl">
              {activeTab === 'px-rem' ? "Most modern designs use 16px as the base font size for accessibility. You can adjust the base size above if your project uses a different standard." : 
               activeTab.includes('hex') ? "You don't need to type the '#' symbol, our engine handles it automatically." :
               "Type your values and see the conversion happen instantly via the local neural engine. No server latency."}
            </p>
         </div>
      </div>
    </div>
  );
};

export default UnitConverter;
