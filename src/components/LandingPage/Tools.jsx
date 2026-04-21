import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaObjectGroup, 
  FaFileZipper, 
  FaFileImage,
  FaScissors,
  FaLayerGroup
} from "react-icons/fa6";

const Tools = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const toolList = [
    {
      id: "pdf-to-word",
      icon: <FaFilePdf className="w-6 h-6" />,
      title: "PDF → Word",
      description: "Convert your PDF documents into editable Word files with high accuracy.",
      tags: ["Fast", "Accurate"]
    },
    {
      id: "word-to-pdf",
      icon: <FaFileWord className="w-6 h-6" />,
      title: "Word → PDF",
      description: "Transform your DOCX files into professional PDF documents instantly.",
      tags: ["Secure", "High Quality"],
      highlight: true
    },
    {
      id: "excel-to-pdf",
      icon: <FaFileExcel className="w-6 h-6" />,
      title: "Excel → PDF",
      description: "Cleanly convert spreadsheets to PDF while maintaining layout integrity.",
      tags: ["Formatting", "Reports"]
    },
    {
      id: "merge-pdf",
      icon: <FaLayerGroup className="w-6 h-6" />,
      title: "Merge PDF",
      description: "Combine multiple PDF files into one single organized document seamlessly.",
      tags: ["Batch", "Combine"]
    },
    {
      id: "split-pdf",
      icon: <FaScissors className="w-6 h-6" />,
      title: "Split PDF",
      description: "Extract specific pages or separate every page into individual PDF files.",
      tags: ["Extract", "Pages"]
    },
    {
      id: "compress-pdf",
      icon: <FaFileZipper className="w-6 h-6" />,
      title: "Compress PDF",
      description: "Reduce file size significantly without losing the original visual quality.",
      tags: ["Storage", "Lightweight"]
    },
    {
      id: "image-to-pdf",
      icon: <FaFileImage className="w-6 h-6" />,
      title: "Image → PDF",
      description: "Turn your JPG, PNG or WebP images into a single professional PDF.",
      tags: ["Gallery", "HD"]
    }
  ];

  const isDashboard = location.pathname.startsWith('/dashboard');
  
  const handleCardClick = (id) => {
    const basePath = isDashboard ? '/dashboard/tools' : '/tools';
    navigate(`${basePath}/${id}`);
  };

  return (
    <section className={`relative overflow-hidden bg-background ${isDashboard ? 'pt-10 pb-10' : 'pt-32 pb-20 lg:pt-40'}`}>
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full opacity-40"></div>
        <div className="absolute bottom-[5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className={`text-center space-y-6 ${isDashboard ? 'mb-12' : 'mb-24'}`}>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
            <FaLayerGroup className="text-primary text-xs" />
            <span className="text-[10px] font-semibold font-black text-slate-300 tracking-[3px] uppercase">
              Toolkit v2.0
            </span>
          </div>

          <h1 className={`${isDashboard ? 'text-4xl md:text-5xl' : 'text-5xl md:text-7xl'} font-semibold font-black text-white leading-[1.1] tracking-tight`}>
            Advanced File <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Tools System
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-secondary text-lg leading-relaxed font-medium">
            Professional-grade tools for your daily document workflow. 
            No uploads required, everything happens locally for your privacy.
          </p>
        </div>

        {/* Tools Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolList.map((tool, index) => (
            <ToolCard 
              key={index}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              tags={tool.tags}
              highlight={tool.highlight}
              onClick={() => handleCardClick(tool.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ToolCard = ({ icon, title, description, tags, highlight, onClick }) => (
  <div 
    onClick={onClick}
    className={`group p-8 rounded-[2.5rem] bg-surface/30 border cursor-pointer ${highlight ? 'border-primary/40 bg-primary/5 shadow-2xl shadow-primary/5' : 'border-white/10'} backdrop-blur-xl hover:-translate-y-2 transition-all duration-500`}
  >
    {/* Icon Wrapper */}
    <div className={`mb-8 w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-500 ${highlight ? 'bg-primary text-white rotate-3 shadow-[0_0_25px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-primary group-hover:bg-primary/10 group-hover:rotate-6'} `}>
      {icon}
    </div>
    
    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors duration-300">
      {title}
    </h3>
    
    <p className="text-secondary text-sm leading-relaxed mb-8 font-medium opacity-80">
      {description}
    </p>

    {/* Dynamic Tags */}
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <div 
          key={idx} 
          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:border-primary/20 group-hover:text-slate-200 transition-all"
        >
          {tag}
        </div>
      ))}
    </div>
  </div>
);

export default Tools;