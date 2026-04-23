import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaArrowRight, 
  FaEnvelope
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-white/5 pt-24 pb-12 overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-primary/5 blur-[100px] rounded-full -z-10"></div>

      {/* Container aligned with Navbar sides */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <img 
              src="/logo.png" 
              alt="Codefix Logo" 
              className="h-10 w-auto brightness-110" 
            />
            <p className="text-secondary text-base leading-relaxed max-w-sm font-semibold opacity-70 pl-1">
              The unified ecosystem for modern developers. Empowering creators with AI-driven insights, sub-second file processing, and community knowledge.
            </p>
            <div className="flex items-center gap-8 pt-2 pl-1">
               <div className="flex flex-col">
                  <span className="text-white font-semibold text-2xl tracking-tight">10k+</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Active Devs</span>
               </div>
               <div className="w-px h-10 bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-white font-semibold text-2xl tracking-tight">99.9%</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Uptime</span>
               </div>
            </div>
          </div>

          {/* Dynamic Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <FooterGroup title="Ecosystem">
              <FooterLink to="/dev-utilities" text="Dev Utilities" />
              <FooterLink to="/tools" text="File Tools" />
              <FooterLink to="/ai-assistant" text="AI Assistant" />
              <FooterLink to="/questions" text="Community Q&A" />
            </FooterGroup>

            <FooterGroup title="Company">
              <FooterLink to="/about" text="Our Mission" />
              <FooterLink to="/features" text="Features" />
              <FooterLink to="/contact" text="Get in Touch" />
              <FooterLink to="/signup" text="Join Platform" />
            </FooterGroup>
          </div>

          {/* Interactive Newsletter Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 md:p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl relative group shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem]"></div>
               <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-3">
                  <FaEnvelope className="text-primary" /> Stay Updated
               </h4>
               <p className="text-secondary text-xs leading-relaxed mb-6 font-semibold opacity-70">
                  Get notified about new developer tools and platform updates.
               </p>
               <div className="relative">
                  <input 
                    type="email" 
                    placeholder="dev@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white focus:border-primary/50 outline-none transition-all pr-14 font-semibold"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                    <FaArrowRight size={12} />
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-slate-500 text-[12px] font-semibold">
              © {currentYear} Codefix Ecosystem. Built for the future of engineering.
            </p>
            <div className="flex items-center gap-6">
               <Link to="#" className="text-[10px] text-slate-600 hover:text-white transition-colors uppercase font-semibold tracking-widest">Privacy</Link>
               <Link to="#" className="text-[10px] text-slate-600 hover:text-white transition-colors uppercase font-semibold tracking-widest">Terms</Link>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 w-full md:w-auto">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 md:mr-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest">Systems Online</span>
             </div>
             <div className="flex items-center gap-4">
                <SocialLink icon={<FaTwitter />} link="#" />
                <SocialLink icon={<FaGithub />} link="#" />
                <SocialLink icon={<FaLinkedin />} link="#" />
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components ---
const FooterGroup = ({ title, children }) => (
  <div className="space-y-8">
    <h4 className="text-white font-semibold text-[10px] uppercase tracking-[0.3em] opacity-40 pl-4">{title}</h4>
    <ul className="space-y-5">
      {children}
    </ul>
  </div>
);

const FooterLink = ({ to, text }) => (
  <li>
    <Link to={to} className="group flex items-center gap-2 text-secondary hover:text-white text-sm transition-all duration-300 font-semibold opacity-70 hover:opacity-100">
      <span className="w-2 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      {text}
    </Link>
  </li>
);

const SocialLink = ({ icon, link }) => (
  <a 
    href={link} 
    className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg"
  >
    {icon}
  </a>
);

export default Footer;
