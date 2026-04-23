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
  FaShieldAlt
} from "react-icons/fa";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
    const loadingToast = toast.loading("Connecting to servers...");

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
        toast.success("Message delivered! We'll be in touch soon.", { id: loadingToast });
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        throw new Error("Delivery failed");
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className={`bg-background text-white overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      
      {/* --- HERO HEADER --- */}
      <section className={`relative ${isDashboard ? 'py-10' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
              <FaPaperPlane className="text-primary text-[10px]" />
              <span className="text-[10px] font-semibold text-slate-300 tracking-[4px] uppercase">Reach Out to Codefix</span>
           </motion.div>
           
           <motion.h1 {...fadeIn} className="text-4xl sm:text-6xl md:text-8xl font-semibold leading-[1.05] tracking-tight px-4">
              Let's Scale Your <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Ambition Together
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-3xl mx-auto text-secondary text-xl font-semibold opacity-80 leading-relaxed italic">
              "Every great feature starts with a simple conversation. We're here to listen, support, and build alongside you."
           </motion.p>
        </div>
      </section>

      {/* --- MAIN INTERFACE --- */}
      <section className="pb-32 relative">
         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-16">
               
               {/* Left Side: Information & FAQ */}
               <div className="lg:col-span-5 space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-4xl font-semibold tracking-tight">Support Channels</h2>
                     <p className="text-secondary text-lg font-semibold opacity-70 leading-relaxed">Choose the channel that fits your urgency. Our AI and Community are available 24/7, while our engineering team responds within 12 hours.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                     <SupportCard 
                        icon={<FaRobot />} 
                        title="Instant AI Support" 
                        desc="Ask our neural agent for quick troubleshooting and documentation help."
                        color="primary"
                     />
                     <SupportCard 
                        icon={<FaDiscord />} 
                        title="Community Discord" 
                        desc="Join 5,000+ developers for real-time discussions and rapid fixes."
                        color="blue"
                     />
                     <SupportCard 
                        icon={<FaEnvelope />} 
                        title="Official Support" 
                        desc="Direct line to our core engineers for critical bugs and enterprise needs."
                        color="emerald"
                     />
                  </div>

                  <div className="pt-10 space-y-8">
                     <h3 className="text-2xl font-semibold tracking-tight">Quick Connect</h3>
                     <div className="flex flex-wrap gap-4">
                        <SocialBtn icon={<FaTwitter />} label="Twitter" />
                        <SocialBtn icon={<FaDiscord />} label="Discord" />
                        <SocialBtn icon={<FaEnvelope />} label="Email" />
                     </div>
                  </div>
               </div>

               {/* Right Side: The Contact Form */}
               <div className="lg:col-span-7 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[4rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                  
                  <div className="relative bg-surface/30 border border-white/10 p-10 md:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl">
                     <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-semibold text-primary uppercase tracking-[3px] ml-4">Your Name</label>
                              <input 
                                 type="text" 
                                 name="name"
                                 required
                                 value={formData.name}
                                 onChange={handleChange}
                                 placeholder="John Doe"
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-primary/50 outline-none transition-all font-semibold text-sm placeholder:text-slate-700"
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-semibold text-primary uppercase tracking-[3px] ml-4">Email Address</label>
                              <input 
                                 type="email" 
                                 name="email"
                                 required
                                 value={formData.email}
                                 onChange={handleChange}
                                 placeholder="john@example.com"
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-primary/50 outline-none transition-all font-semibold text-sm placeholder:text-slate-700"
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-semibold text-primary uppercase tracking-[3px] ml-4">Subject of Interest</label>
                           <div className="relative">
                              <div 
                                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white flex items-center justify-between cursor-pointer hover:border-white/20 transition-all"
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="text-primary opacity-60">
                                       {subjects.find(s => s.id === formData.subject)?.icon}
                                    </div>
                                    <span className="text-sm font-semibold">{formData.subject}</span>
                                 </div>
                                 <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }} className="text-slate-600">▼</motion.span>
                              </div>

                              <AnimatePresence>
                                 {isDropdownOpen && (
                                    <motion.div 
                                       initial={{ opacity: 0, y: 10 }}
                                       animate={{ opacity: 1, y: 8 }}
                                       exit={{ opacity: 0, y: 10 }}
                                       className="absolute top-full left-0 right-0 z-50 bg-[#0F172A] border border-white/10 rounded-3xl p-3 shadow-2xl backdrop-blur-3xl overflow-hidden"
                                    >
                                       {subjects.map(sub => (
                                          <button 
                                             key={sub.id}
                                             type="button"
                                             onClick={() => { setFormData({...formData, subject: sub.id}); setIsDropdownOpen(false); }}
                                             className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all text-left"
                                          >
                                             {sub.icon}
                                             <span className="text-sm font-semibold">{sub.id}</span>
                                          </button>
                                       ))}
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-semibold text-primary uppercase tracking-[3px] ml-4">Your Message</label>
                           <textarea 
                              name="message"
                              required
                              rows="6"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Tell us about your project or problem..."
                              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-6 px-8 text-white focus:border-primary/50 outline-none transition-all font-semibold text-sm placeholder:text-slate-700 resize-none"
                           />
                        </div>

                        <div className="pt-6">
                           <button 
                              type="submit"
                              disabled={isSubmitting}
                              className={`w-full bg-primary hover:bg-blue-600 text-white py-6 rounded-2xl font-semibold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 uppercase tracking-[3px] text-xs ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                           >
                              {isSubmitting ? (
                                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                 <>
                                    <FaPaperPlane className="text-sm" />
                                    Dispatch Message
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
    primary: "text-primary bg-primary/10",
    blue: "text-blue-400 bg-blue-400/10",
    emerald: "text-emerald-400 bg-emerald-400/10"
  };
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group flex items-start gap-6 shadow-lg">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform ${colors[color]}`}>
        {icon}
      </div>
      <div className="space-y-2">
         <h4 className="text-lg font-semibold tracking-tight">{title}</h4>
         <p className="text-secondary text-sm font-semibold opacity-60 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const SocialBtn = ({ icon, label }) => (
  <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-semibold text-xs text-secondary hover:text-white uppercase tracking-widest">
     {icon} {label}
  </button>
);

export default Contact;
