import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaArrowLeft } from "react-icons/fa"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import GlobalSearch from "../Search/GlobalSearch";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* 1. Logo */}
          <div className={`flex-shrink-0 ${isSearchVisible ? 'hidden lg:block' : 'block'}`}>
            <Link to="/">
              <img src="/logo.png" alt="Codefix" className="h-9 md:h-10 w-auto" />
            </Link>
          </div>

          {/* 2. PROMINENT SEARCH BAR (Bara Sa) */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
             <GlobalSearch placeholder="Search tools, snippets, questions..." />
          </div>

          {/* 3. Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
             {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl transition-all font-semibold text-[13px] whitespace-nowrap hover:bg-white/5 ${
                    location.pathname === link.path ? "text-primary bg-primary/5" : "text-secondary hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
             ))}
          </div>

          {/* 4. Auth Section */}
          <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-8">
            {!loading && (
              <div className="flex items-center gap-4">
                {user ? (
                  <Link to="/dashboard">
                    <button className="bg-primary hover:bg-blue-600 text-white px-7 py-3 rounded-2xl font-semibold shadow-xl shadow-primary/20 text-sm transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <button className="text-white hover:text-primary font-semibold transition-all text-sm px-2">Login</button>
                    </Link>
                    <Link to="/signup">
                      <button className="bg-primary hover:bg-blue-600 text-white px-7 py-3 rounded-2xl font-semibold shadow-xl shadow-primary/20 text-sm transition-all transform hover:scale-105">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            )}
            {loading && <div className="w-24 h-10 bg-white/5 animate-pulse rounded-2xl" />}
          </div>

          {/* Mobile Search Toggle */}
          <div className={`flex items-center md:hidden gap-3 ${isSearchVisible ? 'hidden' : 'flex'}`}>
            <button onClick={() => setIsSearchVisible(true)} className="p-3 text-secondary bg-white/5 rounded-xl border border-white/5">
              <FaSearch size={20} />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-secondary p-2 w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
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

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 bg-background z-[60] flex items-center px-4 lg:hidden"
          >
            <button onClick={() => setIsSearchVisible(false)} className="p-3 text-secondary hover:text-white mr-3 bg-white/5 rounded-xl">
              <FaArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <GlobalSearch placeholder="Search platform..." />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-white/10 overflow-hidden"
          >
            <div className="p-8 space-y-5">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.name}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-xl font-semibold  ${
                      location.pathname === link.path ? "text-primary" : "text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="grid grid-cols-1 gap-4 pt-8 border-t border-white/10">
                {!loading && (
                  user ? (
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-primary text-white py-5 rounded-2xl font-semibold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Dashboard</button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <button className="w-full border border-white/10 text-white py-5 rounded-2xl font-semibold uppercase tracking-widest text-xs">Login</button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>
                        <button className="w-full bg-primary text-white py-5 rounded-2xl font-semibold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Sign Up</button>
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
