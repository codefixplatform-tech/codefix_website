import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { FaPlus, FaRegTrashCan, FaRobot, FaCheck} from 'react-icons/fa6'; 
import { FaRegEdit, FaPen , FaSignOutAlt } from "react-icons/fa";

const AISidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onRenameChat, user }) => {
  const navigate = useNavigate();
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully!");
      navigate('/');
    }
  };
  return (
    <div className="w-72 bg-[#0f172a]/40 backdrop-blur-xl border-r border-white/5 flex flex-col h-full text-slate-200 font-sans">
      
      {/* Brand Header & New Chat */}
      <div className="p-3 pt-5 sticky top-0 z-10 bg-gradient-to-b from-[#020617] to-[#020617]/90 backdrop-blur-md border-b border-transparent">
        
        {/* CodeFix Branding */}
        <div className="flex flex-col mb-5 px-2">
          <img src="/logo.png" alt="Codefix" className="h-10 w-auto object-contain self-start opacity-90" />
          <span className="text-[13px] font-black uppercase tracking-[0.2em] text-primary/80 mt-1 ml-3.5">
            AI Assistant
          </span>
        </div>

        {/* Dashboard Navigation Link */}
        <div className="px-1 mb-4">
          <button 
            onClick={() => user ? navigate('/dashboard') : navigate('/login')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[13.5px] font-medium group"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
               <FaPlus size={10} className="rotate-45" /> 
            </div>
            <span>{user ? 'Back to Dashboard' : 'Login to Dashboard'}</span>
          </button>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-sm">
              <FaRobot size={15} />
            </div>
            <span className="text-[14.5px] font-semibold text-slate-100">New chat</span>
          </div>
          <FaRegEdit size={16} className="text-slate-500 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
        <div className="px-2 pb-2 pt-4">
          <span className="text-[13px] font-semibold text-[#878787]">Recent</span>
        </div>

        {!user ? (
          // Guest View
           <div className="px-2 py-4 mt-2">
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
               <span className="text-[14.5px] text-slate-100 font-medium block mb-2">Sync your history</span>
               <p className="text-[13px] text-slate-400 mb-4">Sign in to save and sync your conversations across devices.</p>
               <button onClick={() => navigate('/login')} className="w-full bg-white text-black py-2 rounded-lg text-[14.5px] font-medium hover:bg-gray-200 transition-colors cursor-pointer">Sign In</button>
             </div>
           </div>
        ) : chats.length === 0 ? (
          // No Chats yet
          <p className="text-center text-[13px] text-[#878787] font-medium mt-10">No recent chats</p>
        ) : (
          // Active Chats List
          <div className="space-y-[2px]">
            {chats.map((chat) => {
              const isActive = activeChatId === chat.id;
              return (
                <div 
                  key={chat.id}
                  className={`group relative flex items-center rounded-lg cursor-pointer ${
                    isActive ? 'bg-primary/20' : 'hover:bg-white/5'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex-1 flex items-center gap-3 p-[9px] pr-14 text-left overflow-hidden">
                    {editingChatId === chat.id ? (
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => {
                          if (editTitle.trim() && editTitle !== chat.title) onRenameChat(chat.id, editTitle);
                          setEditingChatId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (editTitle.trim() && editTitle !== chat.title) onRenameChat(chat.id, editTitle);
                            setEditingChatId(null);
                          } else if (e.key === 'Escape') {
                            setEditingChatId(null);
                          }
                        }}
                        autoFocus
                        className="text-[14.5px] w-full bg-slate-900 text-slate-100 px-2 py-0.5 rounded outline-none border border-primary/50"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className={`text-[14.5px] truncate w-full ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {chat.title}
                      </span>
                    )}
                  </div>

                  {/* Gradient Fade and Action Buttons */}
                  <div className={`absolute right-0 top-0 bottom-0 flex items-center justify-end rounded-r-lg w-16 
                    bg-gradient-to-l ${isActive ? 'from-[#0f172a] via-[#0f172a] to-transparent' : 'from-[#0f172a] via-[#0f172a] to-transparent opacity-0 group-hover:opacity-100'} transition-opacity
                  `}>
                    {editingChatId === chat.id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (editTitle.trim() && editTitle !== chat.title) onRenameChat(chat.id, editTitle);
                          setEditingChatId(null);
                        }}
                        className="p-1.5 mr-1 text-emerald-500 hover:text-emerald-400 transition-colors rounded-md hover:bg-[#303030]"
                        title="Save rename"
                      >
                        <FaCheck size={14} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingChatId(chat.id);
                            setEditTitle(chat.title);
                          }}
                          className="p-1.5 text-[#878787] hover:text-[#ececec] transition-colors rounded-md hover:bg-[#303030]"
                          title="Rename chat"
                        >
                          <FaPen size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="p-1.5 mx-1 text-[#878787] hover:text-red-400 transition-colors rounded-md hover:bg-[#303030]"
                          title="Delete chat"
                        >
                          <FaRegTrashCan size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Profile / Status Section at Bottom */}
      <div className="mt-auto p-2">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-8 h-8 rounded-full shadow-lg object-cover border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow-md border border-emerald-400/20">
                {user.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </div>
            )}
            
            <div className="flex flex-col flex-1 overflow-hidden">
               <span className="text-[14.5px] font-medium text-slate-100 truncate leading-tight">
                 {user.user_metadata?.full_name || user.email || 'My Account'}
               </span>
               <span className="text-[11px] text-slate-400 truncate">Sync enabled</span>
            </div>
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              title="Sign Out"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 px-3 py-3.5 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm shadow-sm"
          >
            Log in or sign up
          </button>
        )}
      </div>
    </div>
  );
};

export default AISidebar;