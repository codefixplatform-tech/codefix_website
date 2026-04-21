import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCommandLine, HiOutlineCpuChip, HiOutlineCheckBadge } from "react-icons/hi2";

const Home = () => {
  const [typedCode, setTypedCode] = useState("");
  const fullCode = `export const solve = () => {\n  if (!data) return null;\n  return data?.map(item => item.id); \n}`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedCode(fullCode.slice(0, i));
      i++;
      if (i > fullCode.length) {
        setTimeout(() => { i = 0; }, 2000); // 2 second pause before restart
      }
    }, 50); // Typing speed
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[130px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-semibold font-black text-slate-300 tracking-[3px] uppercase">
              Official Internship Project
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold font-black text-white leading-[1.1] tracking-tight">
            Code<span className="text-primary">fix</span> — One Platform <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              All Solutions
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-secondary text-lg leading-relaxed">
            The ultimate productivity hub. Solve programming bugs, convert complex files, 
            and leverage AI agents—all inside one powerful ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/login">
              <button className="bg-primary hover:bg-blue-600 font-semibold text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm">
                Get Started Free
              </button>
            </Link>
            <button className="bg-white/5 hover:bg-white/10 font-semibold text-white border border-white/10 px-10 py-4 rounded-2xl font-black transition-all text-sm">
              Watch Demo
            </button>
          </div>
        </div>

        {/* --- LIVE INTERACTIVE PREVIEW --- */}
        <div className="relative max-w-5xl mx-auto mt-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-[#0B0E14]/80 border border-white/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-5 min-h-[400px]">
              
              {/* Left: Sidebar */}
              <div className="md:col-span-2 border-r border-white/5 p-8 bg-white/[0.02]">
                <h3 className="text-white font-black text-lg font-bold mb-6 flex items-center gap-2">
                  <HiOutlineCpuChip className="text-primary" /> Active Modules
                </h3>
                <div className="space-y-4">
                  <PreviewLink icon="💬" label="Community Q&A" status="Live" active />
                  <PreviewLink icon="⚡" label="File Power Tools" status="Ready" />
                  <PreviewLink icon="🤖" label="AI Code Agent" status="Typing..." active />
                </div>
              </div>

              {/* Right: Typewriter Terminal */}
              <div className="md:col-span-3 p-8 bg-black/40 relative">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/40" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                      <div className="w-3 h-3 rounded-full bg-green-500/40" />
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Fixer Active</span>
                   </div>
                </div>
                
                <div className="font-mono text-sm min-h-[120px]">
                   <p className="text-emerald-400/80 mb-2">// Suggesting optimized fix...</p>
                   <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                     {typedCode}
                     <span className="w-2 h-5 bg-primary inline-block ml-1 animate-pulse align-middle"></span>
                   </pre>
                </div>

                <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <HiOutlineCheckBadge className="text-emerald-500" />
                      <span className="text-xs text-secondary font-bold">Auto-optimization active</span>
                   </div>
                   <button className="text-[10px] font-black uppercase tracking-tighter bg-primary/20 text-primary px-4 py-2 rounded-lg border border-primary/30 hover:bg-primary hover:text-white transition-all">
                      Apply Suggestion
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stats Badge */}
          <div className="absolute -bottom-6 -right-6 md:right-12 bg-gradient-to-br from-primary to-blue-600 p-6 rounded-3xl shadow-2xl shadow-primary/40 hidden md:block">
             <p className="text-white font-black text-2xl">0.4s</p>
             <p className="text-white/70 text-[8px] font-black uppercase tracking-[2px]">Latency Speed</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const PreviewLink = ({ icon, label, status, active }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
    <div className="flex items-center gap-3">
      <span className="text-base">{icon}</span>
      <span className={`text-xs font-bold ${active ? 'text-white' : 'text-secondary'}`}>{label}</span>
    </div>
    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${active ? 'bg-primary text-white animate-pulse' : 'bg-white/10 text-slate-400'}`}>
      {status}
    </span>
  </div>
);

export default Home;