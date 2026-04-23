import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  FaEye, 
  FaEyeSlash, 
  FaCamera, 
  FaUser, 
  FaLock, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaCircleNotch,
  FaShieldAlt,
  FaCog
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    avatar_url: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setFormData({ 
        full_name: data?.full_name || '',
        email: user.email || '',
        phone: data?.phone || '',
        location: data?.location || '',
        avatar_url: data?.avatar_url || ''
      });
    }
    setLoading(false);
  };

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (event) => {
    try {
      setUpdating(true);
      const file = event.target.files[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Identity updated!");
    } catch (error) {
      toast.error("Upload failed! Check storage limits.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (formData.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: formData.email });
      if (emailError) toast.error(emailError.message);
      else toast.success("Verify new email!");
    }

    const { error } = await supabase.from('profiles').update({
      full_name: formData.full_name,
      phone: formData.phone,
      location: formData.location,
    }).eq('id', user.id);

    if (!error) {
      toast.success("Profile synchronized!");
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }
    setUpdating(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Keys do not match!");
    }

    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: passwordData.oldPassword,
    });

    if (signInError) {
      setUpdating(false);
      return toast.error("Current key invalid!");
    }

    const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
    if (!error) {
      toast.success("Access key updated!");
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }
    setUpdating(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <FaCircleNotch className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[4px]">Loading Profile Engine...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-10 max-w-5xl mx-auto">
      {/* --- HEADER SECTION --- */}
      <div className="space-y-3 px-4 md:px-0">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
         >
            <FaCog className="text-primary text-[10px]" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Account Hub</span>
         </motion.div>
         <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-none">
           User <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Settings</span>
         </h1>
         <p className="text-secondary text-base md:text-lg font-medium opacity-60 max-w-xl">
           Configure your digital identity, update contact parameters, and manage security protocols.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4 md:px-0">
        {/* --- LEFT: AVATAR CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4"
        >
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-1">
               <div className="w-20 h-20 -mr-10 -mt-10 bg-primary blur-3xl opacity-10 rounded-full"></div>
            </div>

            <div className="relative inline-block cursor-pointer group/avatar" onClick={handleAvatarClick}>
              <div className="w-32 md:w-40 h-32 md:h-40 rounded-full bg-white/5 border-4 border-white/5 overflow-hidden flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                ) : (
                  <FaUser className="text-white/10 w-16 h-16" />
                )}
              </div>
              <div className="absolute inset-0 bg-primary/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <FaCamera className="text-white text-2xl mb-2" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="mt-8 space-y-2">
              <h3 className={`text-xl md:text-2xl font-semibold tracking-tight ${formData.full_name ? 'text-white' : 'text-white/20 italic'}`}>
                {formData.full_name || "Nexus Developer"}
              </h3>
              <p className="text-secondary text-xs font-medium opacity-50 uppercase tracking-[2px]">{formData.email}</p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <span className="bg-primary/10 text-primary text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter border border-primary/20">
                 Elite Member
               </span>
               <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter border border-emerald-500/20">
                 Verified Fixer
               </span>
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT: FORM SECTIONS --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 space-y-6"
        >
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-start border-b border-white/5 gap-8 mb-10 overflow-x-auto no-scrollbar">
              {[
                { id: 'profile', label: 'Identity', icon: <FaUser size={12} /> },
                { id: 'security', label: 'Security', icon: <FaShieldAlt size={12} /> }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`pb-4 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative shrink-0 ${
                    activeTab === tab.id ? "text-primary" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="setting-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'profile' ? (
                <motion.form 
                  key="profile-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleUpdateProfile} 
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup 
                      label="Full Identity" 
                      icon={<FaUser />} 
                      value={formData.full_name} 
                      placeholder="e.g. Nexus Prime"
                      onChange={v => setFormData({...formData, full_name: v})} 
                    />
                    <InputGroup 
                      label="Operational Base" 
                      icon={<FaMapMarkerAlt />} 
                      value={formData.location} 
                      placeholder="City, Country"
                      onChange={v => setFormData({...formData, location: v})} 
                    />
                  </div>
                  <InputGroup 
                    label="Primary Communication" 
                    icon={<FaEnvelope />} 
                    value={formData.email} 
                    type="email"
                    placeholder="nexus@codefix.io"
                    onChange={v => setFormData({...formData, email: v})} 
                  />
                  <InputGroup 
                    label="Secure Line" 
                    icon={<FaPhone />} 
                    value={formData.phone} 
                    placeholder="+1 000 000 0000"
                    onChange={v => setFormData({...formData, phone: v})} 
                  />
                  
                  <button type="submit" disabled={updating} className="w-full bg-primary hover:bg-blue-600 py-5 rounded-[1.5rem] font-bold text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
                    {updating ? <FaCircleNotch className="animate-spin" /> : "Save Profile Details"}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="security-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleChangePassword} 
                  className="space-y-8"
                >
                  <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                     <FaShieldAlt className="text-red-500 mt-1 shrink-0" />
                     <p className="text-[11px] text-red-500/80 font-medium leading-relaxed">
                        Updating your security protocols will require a complete re-authentication. Ensure your new access key is stored securely.
                     </p>
                  </div>

                  <InputGroup 
                    label="Current Access Key" 
                    icon={<FaLock />} 
                    type={showPasswords ? "text" : "password"}
                    value={passwordData.oldPassword} 
                    placeholder="••••••••"
                    onChange={v => setPasswordData({...passwordData, oldPassword: v})} 
                    isPassword
                    showPasswords={showPasswords}
                    onToggle={() => setShowPasswords(!showPasswords)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup 
                      label="New Access Key" 
                      icon={<FaLock />} 
                      type={showPasswords ? "text" : "password"}
                      value={passwordData.newPassword} 
                      placeholder="Min. 8 chars"
                      onChange={v => setPasswordData({...passwordData, newPassword: v})} 
                    />
                    <InputGroup 
                      label="Confirm Key" 
                      icon={<FaLock />} 
                      type={showPasswords ? "text" : "password"}
                      value={passwordData.confirmPassword} 
                      placeholder="Repeat new key"
                      onChange={v => setPasswordData({...passwordData, confirmPassword: v})} 
                    />
                  </div>

                  <button type="submit" disabled={updating} className="w-full bg-emerald-500 hover:bg-emerald-600 py-5 rounded-[1.5rem] font-bold text-white shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
                    {updating ? <FaCircleNotch className="animate-spin" /> : "Update Security Protocols"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, value, placeholder, onChange, type = "text", isPassword, showPasswords, onToggle }) => (
  <div className="space-y-2.5">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group/input">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors">
        {icon}
      </div>
      <input 
        type={type} 
        value={value} 
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-12 py-4 text-white text-sm font-semibold placeholder:text-white/10 focus:border-primary/40 focus:bg-white/[0.05] outline-none transition-all" 
      />
      {isPassword && (
        <button 
          type="button" 
          onClick={onToggle} 
          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
        >
          {showPasswords ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
        </button>
      )}
    </div>
  </div>
);

export default ProfileSettings;