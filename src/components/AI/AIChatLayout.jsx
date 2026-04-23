import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// React Icons (Only Font Awesome)
import { FaArrowLeft, FaRobot, FaMagic, FaBars } from 'react-icons/fa';
import AISidebar from './AISidebar';
import AIChatWindow from './AIChatWindow';
import { chatService } from '../../utils/AI/chatService';
import toast from 'react-hot-toast';

const AIChatLayout = ({ user }) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [newChatTrigger, setNewChatTrigger] = useState(0);

  // 1. Fetch History logic (stable reference)
  const fetchHistory = React.useCallback(async () => {
    if (!user) return;
    try {
      const data = await chatService.getUserChats(user.id);
      setChats(data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // 2. Initial Load: Supabase se chats mangwana
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 2. Nayi Chat shuru karne ka logic
  const handleNewChat = () => {
    setActiveChatId(null);
    setNewChatTrigger(prev => prev + 1);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Mobile par sidebar hide kar do
  };

  // 3. Chat Delete karne ka logic
  const handleDeleteChat = async (id) => {
    try {
      await chatService.deleteChat(id);
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);
      toast.success("Chat deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // 4. Chat Rename karne ka logic
  const handleRenameChat = async (id, newTitle) => {
    if (!newTitle.trim()) return;
    try {
      await chatService.renameChat(id, newTitle);
      setChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
    } catch (err) {
      console.error(err);
      toast.error("Rename failed");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* 1. Left Sidebar Component */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }} // 288px corresponds to Tailwind w-72
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed md:relative left-0 top-0 h-full overflow-hidden z-40 shadow-2xl shadow-black/80"
          >
            <div className="w-72 h-full"> {/* Inner fixed width prevents content squishing during transition */}
              <AISidebar 
                user={user}
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={(id) => setActiveChatId(id)}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-gradient-to-b from-slate-900/50 to-[#020617]">
        
        {/* Top Navigation Bar */}
        <header className="h-16 flex-shrink-0 border-b border-white/5 bg-[#020617]/60 flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl z-20 relative top-0">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Navigation & Toggles */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Toggle Sidebar"
              >
                <FaBars size={18} />
              </button>
              
              <button 
                onClick={() => navigate('/')}
                className="hidden sm:flex p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-colors group cursor-pointer"
                title="Return to Dashboard"
              >
                <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>
            
            {/* Model Identity Box */}
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 flex items-center justify-center">
                <FaRobot className="text-primary text-sm shadow-xl" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-[15px] font-bold text-slate-100 leading-tight">DevIntel Core</h1>
                <span className="text-[11px] text-slate-400 font-medium">Gemini 2.0 Flash Model</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
             <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1e293b] border border-white/10 rounded-full shadow-lg">
                <FaMagic size={10} className="text-yellow-400 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden sm:block">Pro Version</span>
             </div>
          </div>
        </header>

        {/* 3. Chat Window Component */}
        <div className="flex-1 relative overflow-hidden">
          <AIChatWindow 
            key={activeChatId || newChatTrigger}
            user={user}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            onChatSaved={fetchHistory} 
          />
        </div>
      </main>
    </div>
  );
};

export default AIChatLayout;