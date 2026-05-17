import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaArrowRight, 
  FaEnvelope,
  FaBolt
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    toast.success("Welcome to the elite circle!");
    setEmail("");
  };

  return (
    <footer className="relative bg-[#020617] pt-32 pb-16 overflow-hidden font-sans border-t border-slate-900">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[40%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
        

        {/* --- 2. MAIN FOOTER CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-10">
            <Link to="/" className="inline-block group">
              <img 
                src="/logo.png" 
                alt="Codefix Logo" 
                className="h-10 w-auto brightness-125 group-hover:scale-105 transition-transform" 
              />
            </Link>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm font-medium">
              The unified architecture for modern engineering. We bridge the gap between AI intelligence, local processing, and collective wisdom.
            </p>
            <div className="flex items-center gap-10">
               <div className="space-y-2">
                  <p className="text-white text-3xl font-bold tracking-tighter">150k+</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-[4px] font-bold">Total Operations</p>
               </div>
               <div className="w-px h-12 bg-white/5"></div>
               <div className="space-y-2">
                  <p className="text-white text-3xl font-bold tracking-tighter">99%</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-[4px] font-bold">Trust Score</p>
               </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-12">
            <FooterGroup title="Platform">
              <FooterLink to="/features" text="Features" />
              <FooterLink to="/tools" text="Tool Suite" />
              <FooterLink to="/dev-utilities" text="Dev Station" />
              <FooterLink to="/questions" text="Community" />
            </FooterGroup>

            <FooterGroup title="Resources">
              <FooterLink to="/about" text="Our Story" />
              <FooterLink to="/contact" text="Engineering Support" />
              <FooterLink to="/privacy" text="Privacy Protocols" />
              <FooterLink to="/terms" text="Legal Terms" />
            </FooterGroup>
          </div>

          {/* Newsletter / Social */}
          <div className="lg:col-span-4 space-y-10">
             <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                   <div className="w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all"></div>
                </div>
                <h4 className="text-white font-bold text-[10px] uppercase tracking-[4px] mb-6 flex items-center gap-3 relative z-10">
                   <FaEnvelope className="text-primary" /> Neural Dispatch
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-8 font-medium relative z-10">
                   Get monthly insights on developer productivity and new platform tools.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="relative z-10">
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="your@email.com"
                     className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary/50 outline-none transition-all pr-16 font-medium"
                     required
                   />
                   <button 
                     type="submit"
                     className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all"
                   >
                     <FaArrowRight size={12} />
                   </button>
                </form>
             </div>
          </div>
        </div>

        {/* --- 3. BOTTOM BAR --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col xl:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[2px]">
              © {currentYear} Codefix. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 px-5 py-2 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[4px]">System Operational</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <SocialLink icon={<FaTwitter />} link="https://x.com/Codefix416850" />
             <SocialLink icon={<FaGithub />} link="https://github.com/codefixplatform-tech" />
             <SocialLink icon={<FaLinkedin />} link="https://linkedin.com/in/codefix-codefix-863a94406" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components ---
const FooterGroup = ({ title, children }) => (
  <div className="space-y-10">
    <h4 className="text-white font-bold text-[10px] uppercase tracking-[4px] opacity-40">{title}</h4>
    <ul className="space-y-6">
      {children}
    </ul>
  </div>
);

const FooterLink = ({ to, text }) => (
  <li>
    <Link to={to} className="text-slate-400 hover:text-white text-sm transition-all duration-300 font-medium hover:translate-x-1 inline-block">
      {text}
    </Link>
  </li>
);

const SocialLink = ({ icon, link }) => (
  <a 
    href={link} 
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary/20 hover:border-primary transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
