import React, { useState } from 'react';
import { 
  FaGlobe, 
  FaBell, 
  FaMoon, 
  FaEye, 
  FaUniversalAccess, 
  FaShieldAlt,
  FaCheckCircle,
  FaVolumeUp,
  FaAdjust
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AccountPreference = () => {
  const [prefs, setPrefs] = useState({
    language: 'English (US)',
    notifications: true,
    newsletter: false,
    darkMode: true,
    highContrast: false,
    profilePublic: true,
    emailAlerts: true,
    soundEffects: true
  });

  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preferences updated locally.");
  };

  return (
    <div className="space-y-10 pb-10 max-w-5xl mx-auto px-4">
      {/* --- HEADER SECTION --- */}
      <div className="space-y-3">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full"
         >
            <FaAdjust className="text-emerald-400 text-[10px]" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Environment</span>
         </motion.div>
         <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-none">
           Account <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Preferences</span>
         </h1>
         <p className="text-secondary text-base md:text-lg font-medium opacity-60 max-w-xl">
           Tailor your workspace experience, manage connectivity protocols, and adjust accessibility parameters.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- SYSTEM PREFERENCES --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[4px] ml-2">System Config</h2>
          
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-8 backdrop-blur-xl">
             <PreferenceToggle 
                icon={<FaGlobe className="text-blue-400" />} 
                title="System Language" 
                desc="Default interface language across the platform."
                value={prefs.language}
                isSelect
             />
             <PreferenceToggle 
                icon={<FaMoon className="text-purple-400" />} 
                title="Deep Dark Mode" 
                desc="Optimized for OLED and low-light engineering."
                value={prefs.darkMode}
                onToggle={() => togglePref('darkMode')}
             />
             <PreferenceToggle 
                icon={<FaUniversalAccess className="text-amber-400" />} 
                title="High Contrast" 
                desc="Enhanced visibility for accessibility needs."
                value={prefs.highContrast}
                onToggle={() => togglePref('highContrast')}
             />
             <PreferenceToggle 
                icon={<FaVolumeUp className="text-primary" />} 
                title="Audio Feedback" 
                desc="Enable subtle UI sound effects for interactions."
                value={prefs.soundEffects}
                onToggle={() => togglePref('soundEffects')}
             />
          </div>
        </motion.div>

        {/* --- COMMUNICATION & PRIVACY --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[4px] ml-2">Protocol Settings</h2>
          
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-8 backdrop-blur-xl">
             <PreferenceToggle 
                icon={<FaBell className="text-emerald-400" />} 
                title="Push Notifications" 
                desc="Instant alerts for replies and system updates."
                value={prefs.notifications}
                onToggle={() => togglePref('notifications')}
             />
             <PreferenceToggle 
                icon={<FaShieldAlt className="text-red-400" />} 
                title="Public Profile" 
                desc="Allow community to view your contributions."
                value={prefs.profilePublic}
                onToggle={() => togglePref('profilePublic')}
             />
             <PreferenceToggle 
                icon={<FaCheckCircle className="text-primary" />} 
                title="Email Briefings" 
                desc="Weekly summary of activity and highlights."
                value={prefs.emailAlerts}
                onToggle={() => togglePref('emailAlerts')}
             />
             <PreferenceToggle 
                icon={<FaGlobe className="text-slate-400" />} 
                title="Newsletter" 
                desc="Periodic updates on new platform features."
                value={prefs.newsletter}
                onToggle={() => togglePref('newsletter')}
             />
          </div>
        </motion.div>
      </div>

      <div className="pt-6 flex justify-end px-4 md:px-0">
         <button className="w-full md:w-auto px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 text-[11px] uppercase tracking-widest">
            Commit All Changes
         </button>
      </div>
    </div>
  );
};

const PreferenceToggle = ({ icon, title, desc, value, onToggle, isSelect }) => (
  <div className="flex items-center justify-between gap-6 group">
    <div className="flex items-start gap-4">
       <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-lg md:text-xl shrink-0 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="space-y-1">
          <h3 className="text-sm md:text-base font-semibold text-white tracking-tight">{title}</h3>
          <p className="text-[10px] md:text-xs text-secondary/40 font-medium leading-relaxed max-w-[200px] md:max-w-xs">{desc}</p>
       </div>
    </div>

    {isSelect ? (
      <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
         {value}
      </div>
    ) : (
      <button 
        onClick={onToggle}
        className={`w-12 md:w-14 h-6 md:h-7 rounded-full p-1 transition-all duration-500 relative ${value ? 'bg-emerald-500' : 'bg-white/10'}`}
      >
        <div className={`w-4 md:w-5 h-4 md:h-5 bg-white rounded-full shadow-lg transition-all duration-500 transform ${value ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'}`}></div>
      </button>
    )}
  </div>
);

export default AccountPreference;
