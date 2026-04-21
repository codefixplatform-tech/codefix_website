import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const Sidebar = ({ closeMenu, profile, loading }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out!");
      navigate('/');
    }
  };

  const fullName = profile?.full_name || "Developer";
  const initial = fullName.charAt(0).toUpperCase();

  // Dynamic Credits Logic (Simple mock for now)
  const credits = profile ? 92 : 85;
  const totalCredits = 100;
  const creditPercent = (credits / totalCredits) * 100;

  // Navigation Structure
  const navigation = [
    {
      group: "Main Menu",
      links: [
        { name: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
        { name: "My Activity", path: "/dashboard/activity", icon: <HistoryIcon /> },
        { name: "AI Assistant", path: "/ai-assistant", icon: <AIIcon />, badge: "AI" },
      ],
    },
    {
      group: "Productivity",
      links: [
        { name: "File Tools", path: "/dashboard/tools", icon: <FilesIcon /> },
        { name: "Dev Utilities", path: "/dashboard/dev-utilities", icon: <UtilsIcon /> },
      ],
    },
    {
      group: "Community",
      links: [
        { name: "Feed", path: "/dashboard/questions", icon: <QAIcon /> },
        { name: "Ask Question", path: "/dashboard/qa/ask", icon: <PlusIcon /> }, // Direct Post Link
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B0E14] border-r border-white/5 flex flex-col z-50">
      <div className="p-8">
        <img src="/logo.png" alt="Codefix" className="h-9 w-auto brightness-125 cursor-pointer" onClick={() => navigate('/')} />
      </div>

      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar pb-4">
        {navigation.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[2px] text-white/30 mb-3">
              {section.group}
            </h3>
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                      isActive ? "bg-primary/10 text-primary border border-primary/10" : "text-secondary hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className={`${isActive ? "text-primary" : "text-secondary group-hover:text-white"} transition-colors`}>
                      {link.icon}
                    </span>
                    <span className="text-sm font-bold">{link.name}</span>
                    {link.badge && (
                      <span className="ml-auto text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-black">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-inner">
          <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-wider">
            <span className="text-secondary/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              AI Credits
            </span>
            <span className="text-primary">{credits}/{totalCredits}</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-1000 ease-out shadow-[0_0_12px_#3b82f6]" 
              style={{ width: `${creditPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 bg-white/[0.02] py-3 rounded-2xl border border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 border border-white/10 flex items-center justify-center font-bold text-white shrink-0 shadow-lg overflow-hidden">
            {loading ? (
               <span className="animate-pulse text-[10px]">...</span>
            ) : profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          
          <div className="overflow-hidden flex-1">
            <p className="text-white text-xs font-bold truncate">{loading ? "Loading..." : fullName}</p>
            <p className="text-[9px] text-primary font-black uppercase tracking-tighter">Pro Developer</p>
          </div>

          <button onClick={handleLogout} className="text-secondary hover:text-red-400 transition-colors p-1">
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
};

// Icons (Same + PlusIcon added)
const HomeIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> );
const HistoryIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg> );
const AIIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="M12 20v2" /><circle cx="12" cy="12" r="4" /></svg> );
const FilesIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg> );
const UtilsIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 11-8-8" /><path d="M21 3v8h-8" /></svg> );
const QAIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> );
const PlusIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> );
const LogoutIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg> );

export default Sidebar;