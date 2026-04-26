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
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setInput('');
              setOutput('');
            }}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Input Value</label>
            {(activeTab === 'px-rem' || activeTab === 'rem-px') && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Base:</span>
                <input 
                  type="number" 
                  value={baseSize} 
                  onChange={(e) => setBaseSize(e.target.value)}
                  className="w-12 bg-white/5 border border-white/10 rounded-md text-[10px] font-semibold text-center py-0.5 focus:border-primary outline-none"
                />
              </div>
            )}
          </div>
          <div className="relative group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTab.startsWith('hex') ? '#ffffff' : activeTab.startsWith('rgb') ? 'rgb(255, 255, 255)' : 'Enter value...'}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-xl font-mono text-white focus:border-primary/50 transition-all outline-none"
            />
            <button 
              onClick={() => setInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-400 transition-colors"
            >
              <FaEraser />
            </button>
          </div>
        </div>

        {/* Converter Arrow (Desktop) */}
        <div className="hidden lg:flex justify-center">
           <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse">
              <FaExchangeAlt />
           </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Result</label>
            <button 
              onClick={() => handleCopy(output)}
              className="text-primary hover:text-blue-400 transition-colors flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest"
            >
              <FaCopy /> Copy
            </button>
          </div>
          <div className="relative group">
            <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl px-6 py-5 text-xl font-mono text-primary min-h-[68px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={output}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  {output || <span className="opacity-20 italic text-sm">Waiting for input...</span>}
                </motion.span>
              </AnimatePresence>
            </div>
            {activeTab.includes('hex') || activeTab.includes('rgb') ? (
              <div 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border border-white/20 shadow-inner"
                style={{ backgroundColor: output && output !== 'Invalid Input' ? output : 'transparent' }}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <FaBolt />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1">Pro Tip</h4>
          <p className="text-xs text-secondary opacity-60 leading-relaxed">
            {activeTab === 'px-rem' ? "Most modern designs use 16px as the base font size for accessibility. You can adjust the base size above if your project uses a different standard." : 
             activeTab.includes('hex') ? "You don't need to type the '#' symbol, our engine handles it automatically." :
             "Type your values and see the conversion happen instantly. No buttons required."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
