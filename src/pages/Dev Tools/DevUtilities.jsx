import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCode, 
  FaTerminal, 
  FaLink, 
  FaHashtag, 
  FaDatabase, 
  FaLock, 
  FaFileCode,
  FaArrowRight
} from "react-icons/fa6";

const DevUtilities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const utilityList = [
    {
      id: "json-formatter",
      icon: <FaCode className="w-6 h-6" />,
      title: "JSON Formatter",
      description: "Prettify, minify and validate your JSON data instantly with syntax highlighting.",
      tags: ["Data", "Format"]
    },
    {
      id: "base64-converter",
      icon: <FaDatabase className="w-6 h-6" />,
      title: "Base64 Encoder/Decoder",
      description: "Convert text or images to Base64 and vice versa with local processing.",
      tags: ["Encoding", "Security"],
      highlight: true
    },
    {
      id: "regex-tester",
      icon: <FaHashtag className="w-6 h-6" />,
      title: "Regex Tester",
      description: "Test your regular expressions in real-time with pattern highlighting and capture groups.",
      tags: ["Dev", "Text"]
    },
    {
      id: "api-tester",
      icon: <FaTerminal className="w-6 h-6" />,
      title: "API Tester",
      description: "Send HTTP requests (GET, POST, etc.) and inspect responses directly in your browser.",
      tags: ["Network", "API"]
    }
  ];

  return (
    <div className={`relative min-h-screen bg-background text-white overflow-hidden font-sans ${isDashboard ? 'pt-10 pb-20' : 'pt-39 pb-20'}`}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[130px] rounded-full"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero Section */}
        <div className="text-center mb-24 space-y-8">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700">
            <FaTerminal className="text-primary text-xs" />
            <span className="text-[10px] font-semibold font-black uppercase tracking-[4px] text-slate-300">
              Developer Toolbox v1.5
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-semibold font-black tracking-tight leading-[1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Developer <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-secondary text-lg md:text-xl font-medium leading-relaxed opacity-80">
            Essential mini-tools for developers. Fast, client-side only, 
            and designed for immediate productivity.
          </p>
        </div>

        {/* Utilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {utilityList.map((util, index) => (
            <UtilityCard 
              key={util.id}
              icon={util.icon}
              title={util.title}
              description={util.description}
              tags={util.tags}
              highlight={util.highlight}
              index={index}
              onClick={() => {
                const basePath = isDashboard ? '/dashboard/dev-utilities' : '/dev-utilities';
                navigate(`${basePath}/${util.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const UtilityCard = ({ icon, title, description, tags, highlight, index, onClick }) => (
  <div 
    onClick={onClick}
    style={{ animationDelay: `${index * 100}ms` }}
    className={`group relative p-1 leading-none rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both cursor-pointer
      ${highlight ? 'bg-gradient-to-br from-primary/50 to-blue-500/50 shadow-2xl shadow-primary/20' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
  >
    {/* Inner Card Wrapper */}
    <div className={`p-8 rounded-[30px] h-full ${highlight ? 'bg-[#0f172a]' : 'bg-surface/40 hover:bg-surface/20'} backdrop-blur-3xl flex flex-col`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 
        ${highlight ? 'bg-primary text-white shadow-xl shadow-primary/30 rotate-3' : 'bg-white/5 text-primary group-hover:bg-primary group-hover:text-white group-hover:rotate-6'}`}>
        {icon}
      </div>

      <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-all">
        {title}
      </h3>

      <p className="text-secondary text-sm leading-relaxed mb-10 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
        {description}
      </p>

      {/* Footer Area */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all group-hover:translate-x-2">
          <FaArrowRight size={14} />
        </div>
      </div>
    </div>
  </div>
);

export default DevUtilities;
