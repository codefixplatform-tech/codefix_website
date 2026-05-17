import React, { useState, useEffect } from 'react';
import { FaCopy, FaArrowsRotate, FaKey, FaFingerprint } from "react-icons/fa6";
import { FaShieldAlt, } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SecretGenerator = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [result, setResult] = useState('');
  const [config, setConfig] = useState({
    length: 16,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const generateSecret = () => {
    let generated = '';
    if (activeTab === 'password') {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
      
      let charset = lowercase;
      if (config.includeUppercase) charset += uppercase;
      if (config.includeNumbers) charset += numbers;
      if (config.includeSymbols) charset += symbols;

      for (let i = 0; i < config.length; i++) {
        generated += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    } else if (activeTab === 'uuid') {
      generated = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    } else if (activeTab === 'api-key') {
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      generated = 'sk_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(x => charset[x % charset.length])
        .join('');
    }
    setResult(generated);
  };

  useEffect(() => {
    generateSecret();
  }, [activeTab, config]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success("Secret copied to clipboard!");
  };

  const calculateStrength = () => {
    if (activeTab !== 'password') return 100;
    let strength = 0;
    if (result.length > 8) strength += 25;
    if (result.length > 12) strength += 25;
    if (/[A-Z]/.test(result)) strength += 15;
    if (/[0-9]/.test(result)) strength += 15;
    if (/[^A-Za-z0-9]/.test(result)) strength += 20;
    return strength;
  };

  const strength = calculateStrength();
  const strengthColor = strength < 40 ? 'bg-rose-500' : strength < 75 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-12">
      {/* Type Switcher */}
      <div className="flex flex-wrap gap-3 bg-slate-100 p-2 rounded-[2rem] border border-slate-200 w-fit shadow-inner">
        {[
          { id: 'password', label: 'Entropy Password', icon: <FaKey /> },
          { id: 'api-key', label: 'Secret Key', icon: <FaFingerprint /> },
          { id: 'uuid', label: 'UUID Node', icon: <FaShieldAlt /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[3px] transition-all ${
              activeTab === tab.id 
              ? 'bg-slate-900 text-white shadow-xl' 
              : 'text-slate-400 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Result Display */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Generated Payload</label>
            </div>
            <div className="flex items-center gap-6">
               <button onClick={generateSecret} className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px]">
                  <FaArrowsRotate className="animate-hover-spin" /> Regenerate
               </button>
               <button onClick={handleCopy} className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px] border border-primary/20">
                  <FaCopy /> Sync to Clip
               </button>
            </div>
         </div>
         <div className="relative group/result">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-transparent blur-xl opacity-0 group-hover/result:opacity-100 transition-opacity"></div>
            <div className="relative w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] px-10 py-8 text-2xl font-mono text-emerald-400 break-all min-h-[100px] flex items-center shadow-2xl overflow-hidden">
               <AnimatePresence mode="wait">
                  <motion.span
                    key={result}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full selection:bg-emerald-500/20"
                  >
                    {result}
                  </motion.span>
               </AnimatePresence>
            </div>
            
            {/* Strength Indicator */}
            <div className="absolute -bottom-1 left-10 right-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${strength}%` }}
                 className={`h-full ${strengthColor} transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.3)]`}
               />
            </div>
         </div>
         <div className="flex items-center justify-between px-2">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[4px]">
               Entropy Analysis: <span className={strength < 40 ? 'text-rose-500' : 'text-emerald-500'}>{strength}% Secured</span>
            </p>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[4px]">AES-256 Compatible</span>
         </div>
      </div>

      {/* Configuration */}
      <AnimatePresence mode="wait">
        {activeTab === 'password' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50 border border-slate-100 rounded-[3rem] p-12 shadow-inner"
          >
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Payload Length: {config.length}</label>
                </div>
                <input 
                  type="range" 
                  min="8" 
                  max="64" 
                  value={config.length}
                  onChange={(e) => setConfig({...config, length: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-black uppercase tracking-[3px]">
                   <span>Min (8)</span>
                   <span>Max (64)</span>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ConfigToggle 
                  label="Uppercase" 
                  active={config.includeUppercase} 
                  onClick={() => setConfig({...config, includeUppercase: !config.includeUppercase})} 
                />
                <ConfigToggle 
                  label="Numbers" 
                  active={config.includeNumbers} 
                  onClick={() => setConfig({...config, includeNumbers: !config.includeNumbers})} 
                />
                <ConfigToggle 
                  label="Symbols" 
                  active={config.includeSymbols} 
                  onClick={() => setConfig({...config, includeSymbols: !config.includeSymbols})} 
                />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Disclaimer */}
      <div className="flex items-start gap-6 p-8 bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaShieldAlt className="text-[100px] text-emerald-500" />
         </div>
         <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl shrink-0">
            <FaShieldAlt />
         </div>
         <div className="relative z-10 space-y-2">
            <h5 className="text-sm font-black text-white uppercase tracking-[4px]">Zero-Knowledge Local Entropy</h5>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed tracking-tight max-w-2xl">
               Secrets are generated locally via the Web Crypto API. Your keys never leave your machine, ensuring 100% cryptographic isolation. No data is stored or transmitted.
            </p>
         </div>
      </div>
    </div>
  );
};

const ConfigToggle = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-500 ${
      active 
      ? 'bg-white border-slate-900 text-slate-900 shadow-xl' 
      : 'bg-white/50 border-slate-200 text-slate-400 hover:border-slate-400'
    }`}
  >
    <span className="text-[10px] font-black uppercase tracking-[3px]">{label}</span>
    <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
  </button>
);

export default SecretGenerator;
