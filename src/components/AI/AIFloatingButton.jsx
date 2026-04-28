import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRobot, FaPlus } from 'react-icons/fa'; 
import { FaHandSparkles, FaSpinner } from 'react-icons/fa6'; // Modern variations

const AIFloatingButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  // Agar user pehle se AI Assistant page par hai, toh button hide kar do
  if (location.pathname === '/ai-assistant') return null;

  const handleNavigation = () => {
    setIsNavigating(true);
    // Choti si delay taake transition smooth lage
    setTimeout(() => {
      navigate('/ai-assistant');
      setIsNavigating(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <button 
        onClick={handleNavigation}
        disabled={isNavigating}
        className="group relative flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-110 active:scale-95 transition-all duration-500 border border-white/10 overflow-hidden"
      >
        {/* Animated Background Glow */}
        <div className={`absolute inset-0 bg-primary opacity-20 ${isNavigating ? 'animate-pulse' : 'group-hover:opacity-40'}`}></div>
        
        {/* Main Content: Logic to switch between Bot and Loader */}
        <div className="relative z-10 transition-all duration-300">
          {isNavigating ? (
            <FaSpinner className="text-white w-8 h-8 animate-spin" />
          ) : (
            <div className="relative">
               <FaRobot className="text-white w-8 h-8 group-hover:rotate-[360deg] transition-transform duration-700" />
               <div className="absolute -top-1 -right-1 bg-white text-primary rounded-full p-0.5 text-[8px] border border-primary">
                  <FaPlus className="rotate-45" />
               </div>
            </div>
          )}
        </div>

        {/* Professional Tooltip Label */}
        {!isNavigating && (
          <div className="absolute right-20 bg-[#0f172a]/90 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[2px] px-4 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl translate-x-4 group-hover:translate-x-0 flex items-center gap-2">
            <FaHandSparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
            Open Full Assistant
          </div>
        )}

        {/* Loading Progress Bar (Bottom Slim) */}
        {isNavigating && (
          <div className="absolute bottom-0 left-0 h-1 bg-white animate-progress-loading w-full"></div>
        )}
      </button>

      {/* CSS for Progress Bar (Standard Style) */}
      <style>{`
        @keyframes progress-loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-loading {
          animation: progress-loading 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AIFloatingButton;