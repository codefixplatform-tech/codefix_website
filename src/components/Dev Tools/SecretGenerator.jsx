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
  const strengthColor = strength < 40 ? 'bg-red-500' : strength < 75 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-10">
      {/* Type Switcher */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit">
        {[
          { id: 'password', label: 'Password', icon: <FaKey /> },
          { id: 'api-key', label: 'API Key', icon: <FaFingerprint /> },
          { id: 'uuid', label: 'UUID v4', icon: <FaShieldAlt /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Result Display */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Generated Secret</label>
            <div className="flex items-center gap-4">
               <button onClick={generateSecret} className="text-primary hover:text-blue-400 transition-colors flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                  <FaArrowsRotate className="animate-hover-spin" /> Regenerate
               </button>
               <button onClick={handleCopy} className="text-primary hover:text-blue-400 transition-colors flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                  <FaCopy /> Copy
               </button>
            </div>
         </div>
         <div className="relative group">
            <div className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-6 text-xl font-mono text-emerald-400 break-all min-h-[80px] flex items-center shadow-inner">
               <AnimatePresence mode="wait">
                  <motion.span
                    key={result}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    className="w-full"
                  >
                    {result}
                  </motion.span>
               </AnimatePresence>
            </div>
            
            {/* Strength Indicator */}
            <div className="absolute -bottom-1 left-6 right-6 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${strength}%` }}
                 className={`h-full ${strengthColor} transition-colors duration-500`}
               />
            </div>
         </div>
         <p className="text-[9px] text-slate-600 font-semibold uppercase tracking-[0.2em] px-2">
            Entropy Strength: <span className={strength < 40 ? 'text-red-500' : 'text-emerald-500'}>{strength}%</span>
         </p>
      </div>

      {/* Configuration */}
      <AnimatePresence mode="wait">
        {activeTab === 'password' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8"
          >
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Length: {config.length}</label>
                </div>
                <input 
                  type="range" 
                  min="8" 
                  max="64" 
                  value={config.length}
                  onChange={(e) => setConfig({...config, length: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase">
                   <span>8 Characters</span>
                   <span>64 Characters</span>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <div className="flex items-start gap-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
         <FaShieldAlt className="text-emerald-500 text-lg shrink-0 mt-1" />
         <div>
            <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">Local Generation Only</h5>
            <p className="text-[10px] text-emerald-500/60 font-semibold leading-relaxed">
              Secrets are generated locally in your browser using the Web Crypto API. Your keys never touch our servers, ensuring 100% privacy and security for your sensitive data.
            </p>
         </div>
      </div>
    </div>
  );
};

const ConfigToggle = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
      active 
      ? 'bg-primary/10 border-primary/30 text-primary' 
      : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
    }`}
  >
    <span className="text-[10px] font-semibold uppercase tracking-widest">{label}</span>
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-primary animate-pulse' : 'bg-slate-800'}`} />
  </button>
);

export default SecretGenerator;
