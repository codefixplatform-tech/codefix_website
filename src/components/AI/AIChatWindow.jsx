import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
// React Icons (Font Awesome Only)
import { FaPaperPlane, FaRobot, FaUser, FaMagic, FaTerminal, FaShieldAlt, FaCode, FaBug, FaDatabase, FaLightbulb } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getAIResponse } from '../../utils/AI/geminiEngine';
import { chatService } from '../../utils/AI/chatService';
import toast from 'react-hot-toast';

const ResponseWrapper = ({ text, isNew }) => {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 10 } : {}}
      animate={isNew ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ReactMarkdown
        components={{
          code({inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-4 border border-white/10 bg-[#1e1e1e]">
                <div className="flex items-center justify-between px-4 py-2 bg-black/40 text-xs font-mono text-slate-400 border-b border-white/5">
                  <span>{match[1]}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                      toast.success('Code copied!');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                />
              </div>
            ) : (
              <code {...props} className={`${className} bg-black/30 px-1.5 py-0.5 rounded-md font-mono text-primary-foreground`}>
                {children}
              </code>
            )
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </motion.div>
  );
};

const AIChatWindow = ({ user, activeChatId, setActiveChatId, onChatSaved }) => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const loadChatDetails = React.useCallback(async () => {
    try {
      const data = await chatService.getChatById(activeChatId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversation");
    }
  }, [activeChatId]);

  const handleSendMessage = React.useCallback(async (e, customText = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user', text: textToSend };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Direct pass messages array because OpenRouter mapping is handled perfectly in geminiEngine
      const aiText = await getAIResponse(textToSend, messages);
      const finalMessages = [...newMessages, { role: 'model', text: aiText, isNew: true }];
      
      setMessages(finalMessages);

      // Agar user login hai toh Supabase mein save karein
      if (user) {
        // Strip the `isNew` flag before saving to db
        const dbMessages = finalMessages.map(m => ({ role: m.role, text: m.text }));
        const savedChat = await chatService.saveChat(user.id, activeChatId, dbMessages);
        if (!activeChatId) {
          setActiveChatId(savedChat.id); // Nayi chat ko ID assign karein
          onChatSaved(); // Sidebar refresh karein
        }
      }
    } catch (err) {
      toast.error(err.message || "Connection lost");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, user, activeChatId, setActiveChatId, onChatSaved]);

  // Handle initial prompt from navigation state (e.g. from Question Detail)
  useEffect(() => {
    if (location.state?.initialPrompt && !loading && messages.length === 0) {
      handleSendMessage(null, location.state.initialPrompt);
      // Optional: Clear state to prevent re-trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, messages.length, handleSendMessage, loading]);

  // Jab sidebar se koi purani chat select ho, toh messages load karein
  useEffect(() => {
    if (activeChatId && user) {
      loadChatDetails();
    } else {
      setMessages([]); // New chat ke liye khali kar dein
    }
  }, [activeChatId, user, loadChatDetails]);

  // Auto-scroll logic
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/30 rounded-full blur-[120px]"></div>
      </div>

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto pt-8 pb-4 px-4 sm:pt-10 sm:px-8 space-y-6 sm:space-y-8 custom-scrollbar relative z-10" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center pt-24 sm:pt-0 space-y-10 animate-in fade-in zoom-in duration-700 w-full max-w-3xl mx-auto px-4 pb-10">
            <div className="text-center">
              <div className="hidden sm:flex w-16 h-16 bg-primary/10 rounded-[2rem] items-center justify-center border border-primary/20 shadow-2xl shadow-primary/20 mx-auto mb-6">
                <FaRobot className="text-3xl text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-wide mb-2">How can I help you today?</h2>
              <p className="text-slate-400 text-sm">Hi, I'm DevIntel Core. I can help you write code, debug errors, and plan architecture.</p>
            </div>
            
            {/* Interactive Welcome Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
              {/* Suggestion 1 */}
              <button 
                onClick={() => handleSendMessage(null, "Explain how React hooks like useEffect work under the hood.")}
                className="flex flex-col text-left p-5 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform"><FaLightbulb size={18} /></div>
                  <h3 className="text-slate-200 font-bold text-[13px]">Explain Code</h3>
                </div>
                <p className="text-slate-500 text-[12px] leading-relaxed">Break down complex concepts or explain how a specific piece of code functions.</p>
              </button>
              
              {/* Suggestion 2 */}
              <button 
                 onClick={() => handleSendMessage(null, "Can you help me debug a TypeError: Cannot read properties of undefined in my JavaScript project?")}
                className="flex flex-col text-left p-5 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-white/5 hover:border-red-500/30 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:scale-110 transition-transform"><FaBug size={18} /></div>
                  <h3 className="text-slate-200 font-bold text-[13px]">Fix Errors</h3>
                </div>
                <p className="text-slate-500 text-[12px] leading-relaxed">Paste your error logs and code, and I will help you find and fix the bugs.</p>
              </button>
              
              {/* Suggestion 3 */}
              <button 
                 onClick={() => handleSendMessage(null, "Write a clean, reusable React component for a responsive navigation bar.")}
                className="flex flex-col text-left p-5 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform"><FaCode size={18} /></div>
                  <h3 className="text-slate-200 font-bold text-[13px]">Generate Code</h3>
                </div>
                <p className="text-slate-500 text-[12px] leading-relaxed">Describe what you need, and I will write optimized, modern code for it.</p>
              </button>
              
              {/* Suggestion 4 */}
              <button 
                 onClick={() => handleSendMessage(null, "Design a SQL schema for an e-commerce platform with users, orders, and products.")}
                className="flex flex-col text-left p-5 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-white/5 hover:border-purple-500/30 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform"><FaDatabase size={18} /></div>
                  <h3 className="text-slate-200 font-bold text-[13px]">SQL & Architecture</h3>
                </div>
                <p className="text-slate-500 text-[12px] leading-relaxed">Get suggestions on database schemas, API design, and cloud architecture.</p>
              </button>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 sm:gap-4 w-full sm:w-auto max-w-[100%] sm:max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border mt-1 sm:mt-0 ${
                m.role === 'user' ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-slate-800 border-white/10'
              }`}>
                {m.role === 'user' ? <FaUser className="text-white text-sm sm:text-lg" /> : <FaTerminal className="text-primary text-sm sm:text-lg" />}
              </div>
              <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] text-[15px] sm:text-[16px] leading-[1.75] shadow-xl overflow-x-auto ${
                m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-[#1e293b]/80 backdrop-blur-md text-slate-200 rounded-tl-none border border-white/5 w-full max-w-full sm:max-w-[85vw] md:max-w-[70vw]'
              }`}>
                <div className={`${m.role === 'user' ? 'whitespace-pre-wrap text-[16px] font-[Inter,sans-serif]' : 'prose prose-invert prose-p:leading-[1.85] prose-p:mb-6 prose-headings:mt-8 prose-headings:mb-5 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-headings:font-bold prose-ul:mb-6 prose-ol:mb-6 prose-li:my-2 prose-pre:p-0 prose-pre:my-6 prose-pre:bg-transparent max-w-none text-[16px] font-[Inter,sans-serif]'}`}>
                  {m.role === 'user' ? (
                    m.text
                  ) : (
                    <ResponseWrapper text={m.text} isNew={m.isNew} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tl-none flex gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-8 relative z-10 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent">
        <form onSubmit={handleSendMessage} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center bg-[#0f172a] border border-white/10 rounded-[1.8rem] overflow-hidden p-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? "Ask anything about development..." : "Sign in to save this session..."}
              className="flex-1 bg-transparent px-4 sm:px-6 py-2 sm:py-3 text-[13px] sm:text-sm text-white focus:outline-none placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-blue-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center"
            >
              <FaPaperPlane className="text-white text-lg" />
            </button>
          </div>
        </form>
        <div className="mt-3 flex justify-center gap-6">
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <FaShieldAlt size={12} /> Privacy Focused
           </div>
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <FaMagic size={12} /> Gemini 1.5 Powered
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatWindow;