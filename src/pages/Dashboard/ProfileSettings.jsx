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
  FaCircleNotch 
} from 'react-icons/fa';

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
      // Logic: Agar DB mein koi field null ho toh usay empty string '' kar do
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
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error("Upload failed! Check bucket settings.");
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
      else toast.success("Confirmation email sent!");
    }

    const { error } = await supabase.from('profiles').update({
      full_name: formData.full_name,
      phone: formData.phone,
      location: formData.location,
    }).eq('id', user.id);

    if (!error) {
      toast.success("Profile updated!");
      setTimeout(() => navigate('/dashboard'), 1500);
    }
    setUpdating(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords don't match!");
    }

    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: passwordData.oldPassword,
    });

    if (signInError) {
      setUpdating(false);
      return toast.error("Old password incorrect!");
    }

    const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
    if (!error) {
      toast.success("Password changed!");
      setTimeout(() => navigate('/dashboard'), 1500);
    }
    setUpdating(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FaCircleNotch className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Account Settings</h1>
        <p className="text-secondary text-sm mt-1">Update your info and keep your account secure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 text-center group">
            <div className="relative inline-block cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-blue-600 border-4 border-white/5 overflow-hidden flex items-center justify-center text-4xl font-black text-white shadow-2xl transition-transform group-hover:scale-105">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <FaUser size={40} className="opacity-20" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-white w-6 h-6" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            <h3 className={`font-bold mt-4 tracking-tight ${formData.full_name ? 'text-white' : 'text-white/30 italic'}`}>
              {formData.full_name || "Enter your name"}
            </h3>
            <span className="inline-block bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mt-2 border border-primary/20">
              Verified User
            </span>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2">
          <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8">
            <div className="flex gap-8 border-b border-white/5 mb-8">
              {[
                { id: 'profile', label: 'Profile', icon: <FaUser size={12} /> },
                { id: 'security', label: 'Security', icon: <FaLock size={12} /> }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`pb-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                    activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-white"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'profile' ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-3.5 h-3.5" />
                      <input 
                        type="text" 
                        value={formData.full_name} 
                        placeholder="e.g. Ali Khan" 
                        onChange={e => setFormData({...formData, full_name: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:border-primary/50 outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-3.5 h-3.5" />
                      <input 
                        type="text" 
                        value={formData.location} 
                        placeholder="City, Country" 
                        onChange={e => setFormData({...formData, location: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:border-primary/50 outline-none transition-colors" 
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-3.5 h-3.5" />
                    <input 
                      type="email" 
                      value={formData.email} 
                      placeholder="hello@example.com" 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:border-primary/50 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Phone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      value={formData.phone} 
                      placeholder="+92 300 0000000" 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:border-primary/50 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <button type="submit" disabled={updating} className="w-full bg-primary py-4 rounded-2xl font-black text-white hover:bg-blue-600 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                  {updating ? <FaCircleNotch className="animate-spin mx-auto w-5 h-5" /> : "Save Profile Details"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6">
                {[
                  { label: "Current Password", key: "oldPassword", ph: "••••••••" },
                  { label: "New Password", key: "newPassword", ph: "Min. 8 characters" },
                  { label: "Confirm Password", key: "confirmPassword", ph: "Repeat new password" }
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">{field.label}</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-3.5 h-3.5" />
                      <input 
                        type={showPasswords ? "text" : "password"} 
                        required 
                        value={passwordData[field.key]} 
                        placeholder={field.ph}
                        onChange={e => setPasswordData({...passwordData, [field.key]: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-white/10 focus:border-primary/50 outline-none transition-colors" 
                      />
                      <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors">
                        {showPasswords ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={updating} className="w-full bg-emerald-500 py-4 rounded-2xl font-black text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]">
                  {updating ? <FaCircleNotch className="animate-spin mx-auto w-5 h-5" /> : "Update Access Keys"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;