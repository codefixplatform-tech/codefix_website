import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCode, 
  FaTerminal, 
  FaHashtag, 
  FaDatabase, 
  FaArrowLeft, 
} from "react-icons/fa6";
import { Toaster } from 'react-hot-toast';

// Modular Tool Components
import JsonFormatter from '../../components/Dev Tools/JsonFormatter';
import Base64Converter from '../../components/Dev Tools/Base64Converter';
import RegexTester from '../../components/Dev Tools/RegexTester';
import ApiTester from '../../components/Dev Tools/ApiTester';

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
      case 'json-formatter': return { title: "JSON Formatter", icon: <FaCode />, color: "text-blue-400", description: "Prettify, minify and validate your JSON data instantly." };
      case 'base64-converter': return { title: "Base64 Encoder/Decoder", icon: <FaDatabase />, color: "text-primary", description: "Convert text to Base64 and vice versa with local processing." };
      case 'regex-tester': return { title: "Regex Tester", icon: <FaHashtag />, color: "text-emerald-400", description: "Test your regular expressions in real-time with pattern highlighting." };
      case 'api-tester': return { title: "API Tester", icon: <FaTerminal />, color: "text-amber-400", description: "Send HTTP requests and inspect responses directly." };
      default: return { title: "Developer Tool", icon: <FaTerminal />, color: "text-primary", description: "Essential developer utility." };
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
      default: return (
        <div className="text-center py-20 opacity-50 italic">
          Select a valid tool to continue processing...
        </div>
      );
    }
  };

  return (
    <div className={`bg-background text-white relative overflow-hidden flex flex-col items-center font-sans ${isDashboard ? 'min-h-[85vh] py-6' : 'min-h-screen py-32 px-4'}`}>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' } }} />
      
      {!isDashboard && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[130px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full"></div>
        </div>
      )}

      <div className={`w-full ${isDashboard ? 'max-w-6xl' : 'max-w-5xl'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 px-4">
          <button onClick={handleBack} className="flex items-center gap-3 text-slate-400 hover:text-primary transition-all group">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="font-black uppercase tracking-[2px] text-[11px]">Back to Tools</span>
          </button>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 ${tool.color}`}>
               {React.cloneElement(tool.icon, { className: "w-4 h-4" })}
             </div>
             <div>
               <h1 className="text-xl font-black text-white leading-none">{tool.title}</h1>
               <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">System Utility</p>
             </div>
          </div>
        </div>

        <div className="bg-surface/30 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-700 animate-in zoom-in-95 duration-500">
          {renderTool()}
        </div>
      </div>
    </div>
  );
};

export default DevToolProcessor;
