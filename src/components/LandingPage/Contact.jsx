import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaComments, 
  FaLocationDot, 
  FaPaperPlane 
} from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
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

  const subjects = [
    { id: 'General Inquiry', icon: <FaComments className="text-emerald-400" /> },
    { id: 'Technical Support', icon: <FaPaperPlane className="text-primary" /> },
    { id: 'Feature Request', icon: <FaEnvelope className="text-blue-400" /> },
    { id: 'Bug Report', icon: <FaLocationDot className="text-red-400" /> }
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields before sending.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Sending your message via EmailJS...");

    try {
      // Professional EmailJS Delivery
      // Jani, yahan aapko EmailJS se IDs dalni hongi taaki seedha Gmail par jaye
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'codefix.platform@gmail.com'
      };

      const response = await emailjs.send(
        'service_do2k134', // Service ID 
        'template_extlopr', // Template ID 
        templateParams,
        'tvQYYUeUJfXa0nZrg' // Public Key 
      );

      if (response.status === 200) {
        toast.success("Done! Message delivered to CodeFix Gmail.", { id: loadingToast });
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        throw new Error("Delivery failed");
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Error! Please configure your EmailJS IDs in Contact.jsx", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className={`relative overflow-hidden min-h-screen bg-background text-white ${isDashboard ? 'pt-10 pb-20' : 'pt-32 pb-20 lg:pt-40'}`}>
      {/* Notifications handled by root level Toaster */}
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className={`text-center space-y-6 ${isDashboard ? 'mb-12' : 'mb-20'}`}>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <FaPaperPlane className="text-primary text-xs" />
            </motion.div>
            <span className="text-[10px] font-semibold font-black text-slate-300 tracking-[3px] uppercase">
              Get In Touch
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold font-black text-white leading-[1.1] tracking-tight">
            Let's Start a <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Conversation
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-secondary text-lg leading-relaxed font-medium opacity-80 italic">
            Have a question, feedback, or a feature request? Our team is here to support your developer journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <ContactInfoCard 
              icon={<FaEnvelope className="w-5 h-5 text-primary" />}
              title="Email Us"
              value="codefix.platform@gmail.com"
              subtext="Direct Support 24/7"
            />
            <ContactInfoCard 
              icon={<FaComments className="w-5 h-5 text-emerald-400" />}
              title="Community"
              value="Public Forums"
              subtext="Get help from experts"
            />
            <ContactInfoCard 
              icon={<FaLocationDot className="w-5 h-5 text-blue-400" />}
              title="Global"
              value="Remote First"
              subtext="Supporting Devs Everywhere"
            />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-surface/30 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-2 italic">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm placeholder:text-slate-600 font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-2 italic">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm placeholder:text-slate-600 font-bold" 
                    />
                  </div>
                </div>

                {/* Professional Custom Dropdown */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-2 italic">Subject</label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white flex items-center justify-between cursor-pointer group focus-within:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {subjects.find(s => s.id === formData.subject)?.icon}
                        <span className="text-sm font-bold text-white">{formData.subject}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        className="text-slate-500 group-hover:text-primary transition-colors"
                      >
                        ▼
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 5, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute left-0 right-0 z-50 bg-[#0F172A] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl"
                        >
                          {subjects.map((sub) => (
                            <div
                              key={sub.id}
                              onClick={() => {
                                setFormData({ ...formData, subject: sub.id });
                                setIsDropdownOpen(false);
                              }}
                              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5 ${formData.subject === sub.id ? 'bg-primary/10 border border-primary/20' : ''}`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                {sub.icon}
                              </div>
                              <span className="text-sm font-bold text-white">{sub.id}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-2 italic">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you today?" 
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 px-6 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm placeholder:text-slate-600 font-bold resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-primary hover:bg-blue-600 font-bold text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm uppercase tracking-widest flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaPaperPlane className="text-xs" />
                        Send Message
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
  );
};

const ContactInfoCard = ({ icon, title, value, subtext }) => (
  <div className="p-8 rounded-[2rem] bg-surface/30 border border-white/10 backdrop-blur-md group hover:border-primary/40 transition-all">
    <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-block group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-slate-400 font-black text-[12px] uppercase tracking-widest mb-1 italic">{title}</h4>
    <p className="text-white font-black text-lg mb-1 leading-tight break-all">{value}</p>
    <p className="text-primary text-[11px] font-black uppercase tracking-wider">{subtext}</p>
  </div>
);

export default Contact;
