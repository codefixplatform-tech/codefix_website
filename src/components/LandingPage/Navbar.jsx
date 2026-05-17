import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaArrowLeft, FaChevronDown } from "react-icons/fa"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import GlobalSearch from "../Search/GlobalSearch";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.scrollbarGutter = "stable";
    
    const handleResize = () => {
      if (window.innerWidth >= 1280) { 
        setIsOpen(false);
        setIsSearchVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <div className="fixed top-6 left-0 right-0 w-full z-50 px-4 sm:px-8">
      <nav className="max-w-[1300px] mx-auto bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-sans relative overflow-visible">
        <div className="px-8 sm:px-10 py-1.5">
          <div className="flex items-center justify-between h-14 gap-4 sm:gap-8">
            
            {/* 1. Logo */}
            <div className={`flex-shrink-0 ${isSearchVisible ? 'hidden lg:block' : 'block'}`}>
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Codefix" className="h-10 md:h-12 w-auto" />
              </Link>
            </div>

            {/* 2. Navigation Links / Desktop Search Bar */}
            <div className="hidden xl:flex items-center justify-center flex-1 gap-1 relative overflow-visible">
               <AnimatePresence mode="wait">
                 {!isDesktopSearchOpen ? (
                    <motion.div 
                      key="links"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-1"
                    >
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          className={`px-4 py-2 rounded-full transition-all font-bold text-[15px] whitespace-nowrap tracking-tight ${
                            location.pathname === link.path ? "text-primary" : "text-white/70 hover:text-white"
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                      {/* Desktop Search Toggle Button */}
                      <button 
                        onClick={() => setIsDesktopSearchOpen(true)}
                        className="ml-2 p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all"
                        aria-label="Open search"
                      >
                        <FaSearch size={16} />
                      </button>
                    </motion.div>
                 ) : (
                    <motion.div 
                      key="search"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="w-full max-w-2xl flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 overflow-visible"
                    >
                      <FaSearch className="text-white/40" size={14} />
                      <div className="flex-1">
                        <GlobalSearch 
                          variant="ghost" 
                          placeholder="Search platform features, tools, or questions..." 
                          onClose={() => setIsDesktopSearchOpen(false)}
                        />
                      </div>
                      <button 
                        onClick={() => setIsDesktopSearchOpen(false)}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                      >
                        <FaTimes size={14} />
                      </button>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* 3. Auth Buttons */}
            <div className="flex items-center gap-3 sm:gap-5">
              
              {!loading && (
                <div className="hidden lg:flex items-center gap-4">
                  {user ? (
                    <Link to="/dashboard">
                      <button className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all">
                        Dashboard
                      </button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="text-white/70 hover:text-white font-bold text-[14px] tracking-tight px-2">
                        Login
                      </Link>
                      <Link to="/signup">
                        <button className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all">
                          Get Started
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* Search Toggle (Mobile/Tablet) */}
              <button 
                onClick={() => setIsSearchVisible(true)} 
                className="lg:hidden p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <FaSearch size={20} />
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="xl:hidden text-white p-2.5 w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-full transition-all"
              >
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={isOpen ? 'close' : 'open'}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                    >
                      {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="xl:hidden absolute top-[calc(100%+12px)] left-0 right-0 bg-slate-950/98 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-[-1]"
            >
              <div className="p-8 space-y-1.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={link.name}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-3 px-6 rounded-2xl transition-all text-base font-bold tracking-tight ${
                        location.pathname === link.path ? "text-primary bg-white/5" : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-6 mt-2 border-t border-white/5 flex flex-col gap-3">
                   {!loading && !user && (
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                        <button className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] hover:bg-white/10 transition-all">
                          Login
                        </button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full">
                        <button className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] shadow-lg shadow-primary/20">
                          Join Us
                        </button>
                      </Link>
                    </div>
                  )}
                  {user && (
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full">
                      <button className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                        Open Dashboard
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="xl:hidden absolute inset-x-4 sm:inset-x-8 top-0 bg-slate-900 z-[60] flex items-center p-3 rounded-full border border-white/10 shadow-2xl overflow-visible"
          >
            <button onClick={() => setIsSearchVisible(false)} className="p-3 text-slate-400 hover:text-white mr-2 bg-white/5 rounded-full transition-colors">
              <FaArrowLeft size={16} />
            </button>
            <div className="flex-1">
              <GlobalSearch 
                 placeholder="Search platform..." 
                 variant="ghost" 
                 onClose={() => setIsSearchVisible(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
