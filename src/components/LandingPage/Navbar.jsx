import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX, HiSearch, HiArrowLeft } from "react-icons/hi"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import GlobalSearch from "../Search/GlobalSearch";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scrollbar jump fix
  useEffect(() => {
    document.documentElement.style.scrollbarGutter = "stable";
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Q&A", path: "/questions" },
    { name: "Tools", path: "/tools" },
    { name: "Dev Utilities", path: "/dev-utilities" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* MOBILE SEARCH OVERLAY */}
          {isSearchVisible && (
            <div className="absolute inset-0 bg-background z-50 flex items-center px-4 animate-in fade-in slide-in-from-right lg:hidden">
              <button onClick={() => setIsSearchVisible(false)} className="p-2 text-secondary hover:text-white mr-2">
                <HiArrowLeft size={20} />
              </button>
              <div className="flex-1">
                <GlobalSearch placeholder="Search platform..." />
              </div>
            </div>
          )}

          {/* Logo - Fixed Width to anchor the left side */}
          <div className={`flex-shrink-0 w-[140px] ${isSearchVisible ? 'hidden lg:block' : 'block'}`}>
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="h-8 md:h-9 w-auto" />
            </Link>
          </div>

          {/* Desktop Search - Center flexible space */}
          <div className="hidden lg:flex flex-1 justify-center px-4">
             <GlobalSearch placeholder="Search platform..." />
          </div>

          {/* Desktop Links & Auth Section */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="w-[85px] flex justify-center">
                  <Link
                    to={link.path}
                    className={`transition-colors font-medium text-sm whitespace-nowrap ${
                      location.pathname === link.path ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Fixed width container for Auth Section */}
            <div className="flex items-center justify-end w-[180px] border-l border-white/10 ml-4 pl-6">
              {!loading && (
                <div className="animate-in fade-in duration-300">
                  {user ? (
                    <Link to="/dashboard">
                      <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-primary/20 text-sm transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap">
                        Dashboard
                      </button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Link to="/login">
                        <button className="text-white hover:text-primary px-3 py-2 font-medium transition-all text-sm">Login</button>
                      </Link>
                      <Link to="/signup">
                        <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-primary/20 text-sm transition-all transform hover:scale-105">
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              {loading && <div className="w-24 h-9 bg-white/5 animate-pulse rounded-full" />}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className={`flex items-center md:hidden gap-1 ${isSearchVisible ? 'hidden' : 'flex'}`}>
            <button onClick={() => setIsSearchVisible(true)} className="p-2 text-secondary bg-white/5 rounded-lg">
              <HiSearch size={22} />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-secondary p-2 w-10 h-10 flex items-center justify-center relative overflow-hidden">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={isOpen ? 'close' : 'open'}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
                  </motion.div>
               </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-background border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  key={link.name}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-lg font-semibold  ${
                      location.pathname === link.path ? "text-primary" : "text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-3 pt-6 border-t border-white/5"
              >
                {!loading && (
                  user ? (
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Dashboard</button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <button className="w-full border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Login</button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>
                        <button className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Sign Up</button>
                      </Link>
                    </>
                  )
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
