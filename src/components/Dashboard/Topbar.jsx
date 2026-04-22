import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import GlobalSearch from '../Search/GlobalSearch';

import { useState, useEffect, useRef } from 'react';
const Topbar = ({ onMenuClick, profile, loading }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const displayName = profile?.full_name || "Developer";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-[#0B0E14] z-50 flex items-center px-4 animate-in fade-in zoom-in-95 duration-200 lg:hidden">
          <div className="flex-1">
             <GlobalSearch variant="dashboard" placeholder="Search platform..." />
          </div>
          <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-secondary hover:text-white px-2"><CloseIcon /></button>
        </div>
      )}

      {/* Left: Hamburger & Desktop Search */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-secondary hover:text-white bg-white/5 rounded-xl"><MenuIcon /></button>
        <div className="hidden lg:block w-96">
           <GlobalSearch variant="dashboard" placeholder="Search across platform..." />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Back to Home Button */}
        <Link 
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest border border-white/5"
        >
          <HomeIcon /> <span className="hidden lg:inline">Home</span>
        </Link>

        <button onClick={() => setIsSearchOpen(true)} className="lg:hidden p-2 text-secondary hover:text-white bg-white/5 rounded-xl"><SearchIcon /></button>
        <button className="p-2 text-secondary hover:text-white bg-white/5 rounded-xl relative"><BellIcon /><span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#0B0E14]"></span></button>

        <div className="h-8 w-[1px] bg-white/10 mx-1 md:mx-2"></div>

        {/* --- High-end Profile Dropdown --- */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full border-2 border-white/5 bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-xs font-black text-white cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 overflow-hidden"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#0F1218] border border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-xs font-bold text-primary">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    initial
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{displayName}</p>
                  <p className="text-secondary text-[10px] truncate">{profile?.email}</p>
                </div>
              </div>

              {/* Menu Links */}
              <div className="p-1">
                <Link 
                  to="/dashboard/profile" 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <FaUser className="opacity-50 text-[14px]" /> Profile Settings
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <FaCog className="opacity-50 text-[14px]" /> Account Preferences
                </button>
                <div className="my-1 border-t border-white/5"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <FaSignOutAlt className="opacity-70 text-[14px]" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// SVG Icons (Kept same as original)
const HomeIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> );
const MenuIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg> );
const SearchIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> );
const BellIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> );
const CloseIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg> );

export default Topbar;