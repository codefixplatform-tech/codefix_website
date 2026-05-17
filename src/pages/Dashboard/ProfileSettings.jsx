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
    <div className="space-y-12 pb-16 max-w-6xl mx-auto text-slate-900">
      
      {/* --- HEADER SECTION --- */}
      <div className="relative pt-6">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-40"></div>
        <div className="relative space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2.5 bg-slate-100 border border-slate-200 px-5 py-2 rounded-full shadow-sm"
           >
              <FaCog className="text-primary text-[10px]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[3px]">Identity Hub</span>
           </motion.div>
           
           <div className="space-y-2">
             <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-[1] font-syne">
               Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-purple-600">Settings</span>
             </h1>
             <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
               Manage your global developer identity, secure access keys, and platform preferences.
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: AVATAR CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4"
        >
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 p-2">
               <div className="w-40 h-40 -mr-20 -mt-20 bg-primary blur-[100px] opacity-5 rounded-full"></div>
            </div>

            <div className="relative inline-block cursor-pointer group/avatar" onClick={handleAvatarClick}>
              <div className="w-32 md:w-44 h-32 md:h-44 rounded-full bg-slate-50 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-primary/20">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                ) : (
                  <FaUser className="text-slate-200 w-20 h-20" />
                )}
              </div>
              <div className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <FaCamera className="text-white text-2xl mb-2" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Update Photo</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="mt-10 space-y-2">
              <h3 className={`text-2xl md:text-3xl font-bold tracking-tight font-syne ${formData.full_name ? 'text-slate-900' : 'text-slate-300 italic'}`}>
                {formData.full_name || "Nexus Developer"}
              </h3>
              <p className="text-primary text-[10px] font-black uppercase tracking-[3px]">{formData.email}</p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
               <span className="bg-slate-50 text-slate-500 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-slate-100 shadow-sm">
                 Elite Member
               </span>
               <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm">
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
          className="lg:col-span-8"
        >
          <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-start border-b border-slate-100 gap-10 mb-12 overflow-x-auto no-scrollbar">
              {[
                { id: 'profile', label: 'Identity', icon: <FaUser size={12} /> },
                { id: 'security', label: 'Security', icon: <FaShieldAlt size={12} /> }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`pb-5 text-[11px] font-black uppercase tracking-[3px] flex items-center gap-3 transition-all relative shrink-0 ${
                    activeTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-900"
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
                  className="space-y-10"
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
                  
                  <button type="submit" disabled={updating} className="w-full bg-slate-900 hover:bg-black py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-[11px] uppercase tracking-[3px]">
                    {updating ? <FaCircleNotch className="animate-spin" /> : "Synchronize Profile"}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="security-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleChangePassword} 
                  className="space-y-10"
                >
                  <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-start gap-5">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-50 shrink-0">
                        <FaShieldAlt size={20} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Security Protocol Alert</p>
                        <p className="text-sm text-amber-600/80 font-medium leading-relaxed">
                           Updating your security protocols will require a complete re-authentication. Ensure your new access key is stored securely.
                        </p>
                     </div>
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

                  <button type="submit" disabled={updating} className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-[11px] uppercase tracking-[3px] shadow-emerald-500/20">
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
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">{label}</label>
    <div className="relative group/input">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary transition-colors">
        {icon}
      </div>
      <input 
        type={type} 
        value={value} 
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-12 py-5 text-slate-900 text-sm font-bold placeholder:text-slate-300 focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner" 
      />
      {isPassword && (
        <button 
          type="button" 
          onClick={onToggle} 
          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
        >
          {showPasswords ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      )}
    </div>
  </div>
);

export default ProfileSettings;