import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaComments, 
  FaPaperPlane,
  FaRobot,
  FaDiscord,
  FaTwitter,
  FaArrowRight,
  FaShieldAlt,
  FaMicrochip,
  FaGlobeAmericas
} from "react-icons/fa";
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const subjects = [
    { id: 'General Inquiry', icon: <FaComments className="text-emerald-400" /> },
    { id: 'Technical Support', icon: <FaPaperPlane className="text-primary" /> },
    { id: 'Feature Request', icon: <FaEnvelope className="text-blue-400" /> },
    { id: 'Bug Report', icon: <FaShieldAlt className="text-red-400" /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Connecting to Neural Nodes...");

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'codefix.platform@gmail.com'
      };

      const response = await emailjs.send(
        'service_do2k134',
        'template_extlopr',
        templateParams,
        'tvQYYUeUJfXa0nZrg'
      );

      if (response.status === 200) {
        toast.success("Dispatch successful! We'll sync with you soon.", { id: loadingToast });
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        throw new Error("Dispatch failed");
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Network synchronization error. Please try again.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shouldReduceMotion = useReducedMotion();
  
  const fadeIn = shouldReduceMotion ? {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 }
  } : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  return (
    <div className={`bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      <SEO 
        title="Initialize Communication" 
        description="Sync with the Codefix engineering team. Technical support, bug reports, and architectural inquiries." 
      />
      
      {/* --- HERO HEADER: ARCHITECTURAL --- */}
      <section className={`relative overflow-hidden ${isDashboard ? 'py-10' : 'pt-32 pb-24 lg:pt-56 lg:pb-40'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 text-center space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-2 rounded-full border border-white/10 shadow-2xl">
              <FaPaperPlane className="text-primary text-[10px]" />
              <span className="text-[10px] font-black tracking-[4px] uppercase">Initialize Support Protocol</span>
           </motion.div>
           
           <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading text-slate-900 leading-[1.1] tracking-[-0.04em] mb-10"
            > Let's Scale Your <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ambition.
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
              "Every great feature starts with a simple conversation. Our engineering team is ready to sync with your requirements."
           </motion.p>
        </div>
      </section>

      {/* --- MAIN INTERFACE: FORM & CHANNELS --- */}
      <section className="pb-32 relative">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="grid lg:grid-cols-12 gap-20">
               
               {/* Left Side: Information & Channels */}
               <div className="lg:col-span-5 space-y-12">
                  <div className="space-y-10">
                     <div className="inline-flex items-center gap-4 text-primary">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[5px]">Status: Operational</span>
                     </div>
                     <h2 className="text-4xl sm:text-6xl font-bold font-heading text-slate-900 leading-[1] tracking-tighter">Support <br /><span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">Nodes.</span></h2>
                     <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-lg">Our engineering team monitors all channels with a 12-hour P99 response target.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     <SupportCard 
                        icon={<FaRobot />} 
                        title="AI Neural Support" 
                        desc="Ask our neural agent for instant documentation and troubleshooting."
                        color="primary"
                     />
                     <SupportCard 
                        icon={<FaDiscord />} 
                        title="Engineering Discord" 
                        desc="Join 5,000+ developers for real-time architectural discussions."
                        color="blue"
                     />
                     <SupportCard 
                        icon={<FaEnvelope />} 
                        title="Official Node" 
                        desc="Direct encrypted line to our core engineering team."
                        color="emerald"
                     />
                  </div>

                  <div className="pt-10 space-y-8">
                     <h3 className="text-xl font-bold tracking-tight uppercase text-slate-400 tracking-[4px] text-xs">Direct Bridges</h3>
                     <div className="flex flex-wrap gap-4">
                        <SocialBtn icon={<FaTwitter />} label="Twitter" />
                        <SocialBtn icon={<FaDiscord />} label="Discord" />
                        <SocialBtn icon={<FaEnvelope />} label="Email" />
                     </div>
                  </div>
               </div>

               {/* Right Side: The Contact Form */}
               <div className="lg:col-span-7 relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-600/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                   <div className="relative bg-white border border-slate-200 p-10 md:p-20 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden">
                      <div className="absolute top-0 right-0 p-12">
                         <div className="w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                         <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                               <label htmlFor="name" className="text-[10px] font-black text-primary uppercase tracking-[4px] ml-4">Your Identity</label>
                               <input 
                                  id="name"
                                  type="text" 
                                  name="name"
                                  required
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder="John Doe"
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 px-8 text-slate-900 focus:border-primary/50 focus:bg-white outline-none transition-all font-bold text-sm placeholder:text-slate-400 shadow-inner"
                               />
                            </div>
                            <div className="space-y-4">
                               <label htmlFor="email" className="text-[10px] font-black text-primary uppercase tracking-[4px] ml-4">Comm-Address</label>
                               <input 
                                  id="email"
                                  type="email" 
                                  name="email"
                                  required
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="john@example.com"
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 px-8 text-slate-900 focus:border-primary/50 focus:bg-white outline-none transition-all font-bold text-sm placeholder:text-slate-400 shadow-inner"
                               />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[4px] ml-4">Subject Protocol</label>
                            <div className="relative">
                               <div 
                                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 px-8 text-slate-900 flex items-center justify-between cursor-pointer hover:border-slate-200 transition-all shadow-inner"
                               >
                                 <div className="flex items-center gap-4">
                                    <div className="text-primary opacity-60 text-xl">
                                       {subjects.find(s => s.id === formData.subject)?.icon}
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">{formData.subject}</span>
                                 </div>
                                 <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }} className="text-slate-600">▼</motion.span>
                              </div>

                              <AnimatePresence>
                                  {isDropdownOpen && (
                                     <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 8 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-200 rounded-[2.5rem] p-4 shadow-3xl overflow-hidden"
                                     >
                                       {subjects.map(sub => (
                                           <button 
                                              key={sub.id}
                                              type="button"
                                              onClick={() => { setFormData({...formData, subject: sub.id}); setIsDropdownOpen(false); }}
                                              className="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-slate-50 transition-all text-left group/sub"
                                           >
                                              <span className="text-xl">{sub.icon}</span>
                                              <span className="text-sm font-bold group-hover/sub:text-primary transition-colors tracking-tight">{sub.id}</span>
                                           </button>
                                       ))}
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label htmlFor="message" className="text-[10px] font-black text-primary uppercase tracking-[4px] ml-4">Neural Dispatch</label>
                            <textarea 
                               id="message"
                               name="message"
                               required
                               rows="6"
                               value={formData.message}
                               onChange={handleChange}
                               placeholder="Describe your technical requirements or challenge..."
                               className="w-full bg-slate-50 border border-slate-100 rounded-[3rem] py-8 px-10 text-slate-900 focus:border-primary/50 focus:bg-white outline-none transition-all font-bold text-sm placeholder:text-slate-400 shadow-inner resize-none leading-relaxed"
                            />
                         </div>

                         <div className="pt-6">
                            <button 
                               type="submit"
                               disabled={isSubmitting}
                               className={`w-full bg-slate-900 hover:bg-primary text-white py-8 rounded-[2rem] font-black transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-5 uppercase tracking-[5px] text-xs shadow-2xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                               {isSubmitting ? (
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                               ) : (
                                  <>
                                     <FaPaperPlane className="text-sm" />
                                     Dispatch to Nodes
                                  </>
                               )}
                            </button>
                         </div>
                      </form>
                   </div>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const SupportCard = ({ icon, title, desc, color }) => {
  const colors = {
    primary: "text-primary bg-slate-50 border-slate-100 shadow-sm",
    blue: "text-blue-500 bg-slate-50 border-slate-100 shadow-sm",
    emerald: "text-emerald-500 bg-slate-50 border-slate-100 shadow-sm"
  };
  return (
    <div className="p-10 rounded-[3.5rem] bg-white border border-slate-200 hover:border-primary transition-all duration-700 group flex items-start gap-8 shadow-sm hover:shadow-2xl text-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6">
        <div className="w-20 h-20 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all"></div>
      </div>
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-700 border ${colors[color]}`}>
        {icon}
      </div>
      <div className="space-y-2 relative z-10">
         <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{title}</h3>
         <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity tracking-tight">{desc}</p>
      </div>
    </div>
  );
};

const SocialBtn = ({ icon, label }) => (
  <button 
    aria-label={`Contact us on ${label}`}
    className="flex items-center gap-4 px-8 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] hover:bg-slate-900 hover:text-white transition-all font-black text-[10px] text-slate-500 uppercase tracking-[4px] shadow-sm active:scale-95"
  >
     <span className="text-lg">{icon}</span> {label}
  </button>
);

export default Contact;
