import { useLocation } from 'react-router-dom';
import { FaRocket, FaMicrochip, FaUsers, FaArrowRight } from "react-icons/fa6";

const About = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <section id="about" className={`relative overflow-hidden bg-background text-white ${isDashboard ? 'pt-10 pb-20' : 'pt-32 pb-20 lg:pt-40'}`}>
      {/* Background Glows - Syncing with Hero depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[130px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* 1. Header Section */}
        <div className={`text-center space-y-6 ${isDashboard ? 'mb-12' : 'mb-24'}`}>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
            <FaRocket className="text-primary text-xs" />
            <span className="text-[10px] font-semibold font-black text-slate-300 tracking-[3px] uppercase">
              Our Vision & Story
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold font-black text-white leading-[1.1] tracking-tight">
            Bridging the Gap Between <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Problems and Solutions
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-secondary text-lg leading-relaxed">
            Codefix was engineered to eliminate the friction in modern development. 
            We've unified Community Intelligence, AI-driven automation, and high-performance 
            file utilities into a single, cohesive ecosystem.
          </p>
        </div>

        {/* 2. Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <AboutCard 
            icon={<FaRocket className="w-6 h-6 text-primary" />}
            title="Our Mission"
            desc="To accelerate the global programming workflow by providing instant, verified solutions and high-speed developer tools."
          />
          <AboutCard 
            icon={<FaMicrochip className="w-6 h-6 text-emerald-400" />}
            title="Smart Tech"
            desc="Leveraging state-of-the-art AI models to analyze complex bugs and generate clean, production-ready code in milliseconds."
            highlight={true} 
          />
          <AboutCard 
            icon={<FaUsers className="w-6 h-6 text-blue-400" />}
            title="Community"
            desc="Fostering a collaborative space where knowledge is shared freely, empowering developers to grow together."
          />
        </div>

        {/* 3. Detailed Philosophy - Refined English */}
        <div className="mt-24 p-8 md:p-16 rounded-[3rem] bg-surface/30 border border-white/10 backdrop-blur-md relative overflow-hidden">
          {/* Subtle inner glow for the big card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-black text-white tracking-tight">Why Codefix?</h3>
              <div className="space-y-6 text-secondary text-lg leading-relaxed font-medium">
                <p>
                  Our vision is anchored in a single principle: <span className="text-white font-bold underline decoration-primary underline-offset-4">Maximum Efficiency</span>. 
                  We believe developers shouldn't have to navigate sketchy websites for file conversions or spend hours scouring 
                  outdated forums for a simple bug fix.
                </p>
                <p>
                  Codefix provides the architecture that keeps you in the flow. By integrating everything 
                  from AI debugging to secure document processing, we ensure your focus remains where it 
                  matters most—building great software.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-12 pt-6">
                <div className="space-y-1">
                  <h4 className="text-white font-black text-4xl">99.9%</h4>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[3px]">System Uptime</p>
                </div>
                <div className="border-l border-white/10 pl-12 space-y-1">
                  <h4 className="text-white font-black text-4xl">24/7</h4>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[3px]">AI Availability</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              {/* Animated Decorative Element */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative aspect-square md:aspect-video rounded-[2.5rem] bg-[#0B0E14] border border-white/10 overflow-hidden flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                    <FaMicrochip className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-white font-black text-2xl mb-2">The Ecosystem</h4>
                  <p className="text-secondary text-sm max-w-[250px]">Unified workspace for the modern developer.</p>
                  
                  {/* Floating UI Elements Simulation */}
                  <div className="absolute top-10 right-10 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xl text-[10px] font-bold text-emerald-400">
                    Fix Ready ⚡
                  </div>
                  <div className="absolute bottom-10 left-10 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xl text-[10px] font-bold text-primary">
                    AI Online 🤖
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutCard = ({ icon, title, desc, highlight }) => (
  <div className={`group relative bg-surface/30 border ${highlight ? 'border-primary/40 bg-primary/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-white/10'} p-10 rounded-[2.5rem] backdrop-blur-md hover:-translate-y-2 transition-all duration-500`}>
    <div className="mb-8">
      <div className={`mb-6 group-hover:scale-110 transition-transform duration-500 inline-flex items-center justify-center w-14 h-14 ${highlight ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-primary'} rounded-2xl`}>
        {icon}
      </div>
      <h3 className="text-white font-black text-2xl group-hover:text-primary transition-colors tracking-tight">{title}</h3>
      <p className="text-primary/70 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
        <span className="w-4 h-[1px] bg-primary/30"></span> 
        Core Pillar
      </p>
    </div>
    <p className="text-secondary text-sm leading-relaxed group-hover:text-slate-200 transition-colors font-medium">
      {desc}
    </p>
    
    <div className="mt-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
        <div className="h-[1px] w-12 bg-white/10" />
      </div>
      <FaArrowRight className="text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

export default About;