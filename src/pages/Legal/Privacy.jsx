import React from 'react';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserShield, FaDatabase, FaClock } from 'react-icons/fa';

const Privacy = () => {
  const sections = [
    { id: 'processing', title: 'Local Processing', icon: <FaLock />, content: 'Codefix is architected on a privacy-first foundation. Our document conversion engines and developer utilities execute entirely within your browser sandbox. Your source code and documents never leave your hardware.' },
    { id: 'collection', title: 'Data Collection', icon: <FaDatabase />, content: 'We only persist essential telemetry required for core platform functionality. This includes authentication metadata, profile configurations, and community contributions within the Q&A Hub.' },
    { id: 'security', title: 'Security Infrastructure', icon: <FaShieldAlt />, content: "We leverage enterprise-grade security layers provided by Supabase. Every database interaction is governed by strict Row-Level Security (RLS) policies and encrypted at rest." },
    { id: 'third-party', title: 'Third-Party Services', icon: <FaUserShield />, content: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Our infrastructure partners (Supabase, EmailJS) are strictly bound by service-specific privacy standards.' }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans overflow-x-hidden relative">
      <SEO title="Privacy Protocols" description="Official privacy policy and data protection standards for the Codefix platform." />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-16 lg:px-24 pt-32 pb-32 relative z-10">
        
        {/* --- HERO SECTION: CENTERED --- */}
        <div className="mb-24 sm:mb-32 flex flex-col items-center text-center space-y-10 sm:space-y-12">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2 rounded-full border border-white/10 shadow-2xl">
              <FaShieldAlt className="text-primary text-[10px]" />
              <span className="text-[10px] font-bold tracking-[4px] uppercase">Privacy Protocol</span>
           </motion.div>
           
           <h1 className="text-4xl sm:text-7xl md:text-[100px] font-semibold font-heading text-slate-900 leading-[0.95] tracking-tighter break-words px-4">
              Your Data. <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Your Control.
              </span>
           </h1>
           
           <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
              <div className="flex items-center gap-3 bg-slate-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border border-slate-200">
                 <FaClock className="text-slate-400 text-xs" />
                 <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest">May 2026</span>
              </div>
              <div className="flex items-center gap-3 bg-emerald-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border border-emerald-100">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Active Policy</span>
              </div>
           </div>

           <p className="max-w-3xl text-lg sm:text-xl font-medium text-slate-500 leading-relaxed italic border-y border-slate-100 py-8 sm:py-10 px-4">
              "At Codefix, we believe privacy isn't a feature; it's a fundamental architectural requirement. Our zero-server philosophy ensures your intellectual property stays yours."
           </p>
        </div>

        {/* --- CONTENT SECTION: CENTERED --- */}
        <div className="max-w-4xl mx-auto space-y-20">
           {sections.map((s, idx) => (
             <motion.section 
               key={s.id}
               {...fadeIn}
               transition={{ delay: idx * 0.1 }}
               className="flex flex-col items-center text-center space-y-8"
             >
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl text-primary shadow-inner">
                   {s.icon}
                </div>
                <div className="space-y-6">
                   <h2 className="text-3xl md:text-5xl font-semibold font-heading text-slate-900 tracking-tight">{s.title}</h2>
                   <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed opacity-80">
                      {s.content}
                   </p>
                </div>
                {idx !== sections.length - 1 && (
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent mt-12"></div>
                )}
             </motion.section>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
