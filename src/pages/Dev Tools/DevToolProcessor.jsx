import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCode, 
  FaTerminal, 
  FaHashtag, 
  FaDatabase, 
  FaArrowLeft, 
  FaBolt,
  FaMicrochip
} from "react-icons/fa6";
import { FaShieldAlt, FaFileCsv, FaKey, FaExchangeAlt } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';

// Modular Tool Components
import JsonFormatter from '../../components/Dev Tools/JsonFormatter';
import Base64Converter from '../../components/Dev Tools/Base64Converter';
import RegexTester from '../../components/Dev Tools/RegexTester';
import ApiTester from '../../components/Dev Tools/ApiTester';
import UnitConverter from '../../components/Dev Tools/UnitConverter';
import SecretGenerator from '../../components/Dev Tools/SecretGenerator';
import JsonToCsv from '../../components/Dev Tools/JsonToCsv';

const DevToolProcessor = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [toolId]);

  const getToolDetails = (id) => {
    switch(id) {
      case 'json-formatter': return { title: "JSON Neural Core", icon: <FaCode />, color: "text-blue-500", description: "Precision data structuring engine." };
      case 'base64-converter': return { title: "Base64 Pipeline", icon: <FaDatabase />, color: "text-primary", description: "Binary encoding protocol." };
      case 'regex-tester': return { title: "Regex Lab", icon: <FaHashtag />, color: "text-emerald-500", description: "Pattern matching intelligence." };
      case 'api-tester': return { title: "API Terminal v2", icon: <FaTerminal />, color: "text-amber-500", description: "Network infrastructure debugger." };
      case 'unit-converter': return { title: "Unit Matrix", icon: <FaExchangeAlt />, color: "text-indigo-500", description: "Logical unit transformations." };
      case 'secure-gen': return { title: "Secret Generator", icon: <FaKey />, color: "text-emerald-400", description: "Cryptographic entropy engine." };
      case 'json-to-csv': return { title: "CSV Flux", icon: <FaFileCsv />, color: "text-emerald-500", description: "Structured data export node." };
      default: return { title: "Neural Node", icon: <FaTerminal />, color: "text-primary", description: "Active developer utility." };
    }
  };

  const tool = getToolDetails(toolId);

  const handleBack = () => {
    if (isDashboard) navigate('/dashboard/dev-utilities');
    else navigate('/dev-utilities');
  };

  const renderTool = () => {
    switch(toolId) {
      case 'json-formatter': return <JsonFormatter />;
      case 'base64-converter': return <Base64Converter />;
      case 'regex-tester': return <RegexTester />;
      case 'api-tester': return <ApiTester />;
      case 'unit-converter': return <UnitConverter />;
      case 'secure-gen': return <SecretGenerator />;
      case 'json-to-csv': return <JsonToCsv />;
      default: return (
        <div className="text-center py-32 opacity-50 italic font-mono uppercase tracking-[5px] text-xs">
          Initialising Neural Link...
        </div>
      );
    }
  };

  return (
    <div className={`relative min-h-screen bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-6 pb-20' : 'py-16 md:py-24'}`}>
      <Toaster 
        position="top-center" 
        containerStyle={{ top: 110 }}
        toastOptions={{ style: { background: '#0F172A', color: '#fff', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '800', fontSize: '12px', letterSpacing: '1px' } }} 
      />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
        
        {/* TOP COMMAND BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 md:mb-16 gap-6 md:gap-10">
           <button onClick={handleBack} className="flex items-center gap-4 text-slate-400 hover:text-slate-900 transition-all group w-fit">
             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all bg-white shadow-sm shrink-0">
               <FaArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
             </div>
             <span className="font-black uppercase tracking-[5px] text-[10px]">Back to Station</span>
           </button>

           <div className="flex items-center gap-4 sm:gap-8 bg-white border border-slate-200 px-6 py-4 sm:px-10 sm:py-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 w-full lg:w-auto">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 ${tool.color} shadow-inner text-2xl sm:text-3xl shrink-0`}>
                {tool.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight leading-none truncate">{tool.title}</h1>
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[4px] sm:tracking-[5px] mt-1 sm:mt-2 truncate">Active Neural Node v2.4</p>
              </div>
           </div>
        </div>

        {/* WORKSPACE CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] p-6 sm:p-12 md:p-20 shadow-sm hover:shadow-3xl transition-all duration-1000 relative overflow-hidden group">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 p-12">
            <div className="w-80 h-80 bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-all duration-1000"></div>
          </div>
          
          <div className="relative z-10">
            {renderTool()}
          </div>

          {/* Footer Branding */}
          <div className="mt-10 sm:mt-16 pt-6 sm:pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-30 text-center sm:text-left">
             <div className="flex items-center gap-3">
                <FaMicrochip className="text-primary text-xs" />
                <span className="text-[9px] font-black uppercase tracking-[4px]">Neural Processing Active</span>
             </div>
             <span className="text-[9px] font-black uppercase tracking-[4px]">End-to-End Local Isolation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevToolProcessor;
