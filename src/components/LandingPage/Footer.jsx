import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaArrowRight,
  FaShieldAlt,
  FaGlobe,
  FaEnvelope
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-primary/5 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <img 
              src="/logo.png" 
              alt="Codefix Logo" 
              className="h-9 w-auto brightness-110" 
            />
            <p className="text-secondary text-sm leading-relaxed max-w-sm font-medium">
              The unified ecosystem for modern developers. Empowering creators with AI-driven insights, sub-second file processing, and community knowledge.
            </p>
            <div className="flex items-center gap-6 pt-2">
               <div className="flex flex-col">
                  <span className="text-white font-black text-lg">10k+</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Devs</span>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-white font-black text-lg">99.9%</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Uptime</span>
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
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
               <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaEnvelope className="text-primary" /> Stay Updated
               </h4>
               <p className="text-secondary text-xs leading-relaxed mb-6">
                  Get notified about new developer tools and platform updates.
               </p>
               <div className="relative">
                  <input 
                    type="email" 
                    placeholder="dev@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:border-primary/50 outline-none transition-all pr-12"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                    <FaArrowRight size={12} />
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-slate-500 text-[11px] font-medium">
              © {currentYear} Codefix Ecosystem. Built for the future of engineering.
            </p>
            <div className="flex items-center gap-4">
               <Link to="#" className="text-[10px] text-slate-600 hover:text-white transition-colors uppercase font-black tracking-widest">Privacy</Link>
               <Link to="#" className="text-[10px] text-slate-600 hover:text-white transition-colors uppercase font-black tracking-widest">Terms</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mr-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Systems Online</span>
             </div>
             <SocialLink icon={<FaTwitter />} link="#" />
             <SocialLink icon={<FaGithub />} link="#" />
             <SocialLink icon={<FaLinkedin />} link="#" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components ---
const FooterGroup = ({ title, children }) => (
  <div className="space-y-6">
    <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-50">{title}</h4>
    <ul className="space-y-4">
      {children}
    </ul>
  </div>
);

const FooterLink = ({ to, text }) => (
  <li>
    <Link to={to} className="group flex items-center gap-2 text-secondary hover:text-white text-sm transition-all duration-300 font-medium">
      <span className="w-1.5 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      {text}
    </Link>
  </li>
);

const SocialLink = ({ icon, link }) => (
  <a 
    href={link} 
    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;



