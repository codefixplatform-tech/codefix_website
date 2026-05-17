import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaBars, FaSearch, FaBell } from 'react-icons/fa';
import GlobalSearch from '../Search/GlobalSearch';
import toast from 'react-hot-toast';

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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("User logged out successfully");
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const displayName = profile?.full_name || "Developer";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between text-slate-900 bg-transparent">
      
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white z-50 flex items-center px-4 animate-in fade-in zoom-in-95 duration-200 lg:hidden">
          <div className="flex-1">
             <GlobalSearch 
               variant="dashboard-light" 
               placeholder="Search platform..." 
               onClose={() => setIsSearchOpen(false)}
             />
          </div>
          <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-slate-400 hover:text-slate-900 px-2"><CloseIcon /></button>
        </div>
      )}

      {/* Left: Hamburger & Desktop Search */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-xl transition-colors"><FaBars size={18} /></button>
        <div className="hidden lg:block w-96">
           <GlobalSearch variant="dashboard-light" placeholder="Search across platform..." />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Back to Home Button */}
        <Link 
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all text-[11px] font-black uppercase tracking-widest border border-slate-200 shadow-sm"
        >
          <HomeIcon /> <span className="hidden lg:inline">Home</span>
        </Link>

        <button onClick={() => setIsSearchOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-xl"><FaSearch size={16} /></button>
        <button className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-xl relative transition-colors">
          <FaBell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-100 mx-1 md:mx-2"></div>

        {/* --- High-end Profile Dropdown --- */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full border border-slate-200 bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-xs font-black text-white cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md overflow-hidden"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    initial
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-bold truncate">{displayName}</p>
                  <p className="text-slate-500 text-[10px] truncate">{profile?.email}</p>
                </div>
              </div>

              {/* Menu Links */}
              <div className="p-1">
                <Link 
                  to="/dashboard/profile" 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-medium"
                >
                  <FaUser className="opacity-50 text-[14px]" /> Profile Settings
                </Link>
                <Link 
                  to="/dashboard/preferences"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-medium"
                >
                  <FaCog className="opacity-50 text-[14px]" /> Account Preferences
                </Link>
                <div className="my-1 border-t border-slate-100"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold"
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

// SVG Icons
const HomeIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> );
const CloseIcon = () => ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg> );

export default Topbar;