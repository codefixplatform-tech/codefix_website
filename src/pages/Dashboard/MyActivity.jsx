import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, useOutletContext } from "react-router-dom";
import { 
  FaQuestionCircle, 
  FaReply, 
  FaTrashAlt, 
  FaCalendarAlt, 
  FaArrowRight,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaRobot
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MyActivity = () => {
  const { profile } = useOutletContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("questions");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null });

  const openDeleteModal = (id, type) => {
    setDeleteModal({ isOpen: true, id, type });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, type: null });
  };

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [qData, aData] = await Promise.all([
        supabase.from("questions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("answers").select("*, questions(title)").eq("user_id", user.id).order("created_at", { ascending: false })
      ]);

      setQuestions(qData.data || []);
      setAnswers(aData.data || []);
    } catch (err) {
      console.error("Activity Fetch Error:", err);
      toast.error("Activity load nahi ho saki!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const handleDeleteQuestion = async (id) => {
    closeDeleteModal();
    
    try {
      setDeletingId(id);
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
      
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast.success("Question successfully delete ho gaya!");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Delete karne mein masla hua!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAnswer = async (id) => {
    closeDeleteModal();

    try {
      setDeletingId(id);
      const { error } = await supabase.from("answers").delete().eq("id", id);
      if (error) throw error;

      setAnswers(prev => prev.filter(a => a.id !== id));
      toast.success("Reply delete ho gaya!");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Reply delete karne mein masla hua!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-12 pb-16 text-slate-900">
      {/* --- HEADER SECTION --- */}
      <div className="relative pt-6">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2.5 bg-slate-100 border border-slate-200 px-5 py-2 rounded-full shadow-sm"
             >
                <FaClock className="text-primary text-[10px]" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[3px]">Timeline Analytics</span>
             </motion.div>
             
             <div className="space-y-2">
               <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-[1] font-syne">
                 My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-purple-600">Activity</span>
               </h1>
               <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                 Access your full platform history. Manage questions, track community fixes, and monitor your global reputation.
               </p>
             </div>
          </div>

          <div className="flex items-center gap-6 bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
             <div className="px-6 border-r border-slate-100">
                <p className="text-3xl font-bold text-slate-900 leading-none">{questions.length}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Questions</p>
             </div>
             <div className="px-6">
                <p className="text-3xl font-bold text-primary leading-none">{answers.length}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Solutions</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex items-center justify-start border-b border-slate-100 gap-12">
        <button 
          onClick={() => setActiveTab("questions")}
          className={`pb-5 text-[11px] font-black uppercase tracking-[3px] transition-all relative ${activeTab === 'questions' ? 'text-primary' : 'text-slate-400 hover:text-slate-900'}`}
        >
          My Questions
          {activeTab === 'questions' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("answers")}
          className={`pb-5 text-[11px] font-black uppercase tracking-[3px] transition-all relative ${activeTab === 'answers' ? 'text-primary' : 'text-slate-400 hover:text-slate-900'}`}
        >
          My Solutions
          {activeTab === 'answers' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
        </button>
      </div>

      {/* --- CONTENT LIST --- */}
      <div className="grid gap-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200"
            >
               <FaCircleNotch className="text-primary animate-spin text-4xl mb-6" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Accessing History Engine...</p>
            </motion.div>
          ) : (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {activeTab === "questions" ? (
                questions.length > 0 ? questions.map(q => (
                  <ActivityCard 
                    key={q.id}
                    title={q.title}
                    date={q.created_at}
                    id={q.id}
                    onDelete={() => openDeleteModal(q.id, 'question')}
                    onAIFix={() => navigate('/ai-assistant', { state: { initialPrompt: `I need help with this question: ${q.title}` } })}
                    isDeleting={deletingId === q.id}
                    onClick={() => navigate(`/dashboard/questions/${q.id}`)}
                    type="question"
                  />
                )) : <EmptyState type="questions" />
              ) : (
                answers.length > 0 ? answers.map(a => (
                  <ActivityCard 
                    key={a.id}
                    title={a.questions?.title || "Deleted Question"}
                    content={a.content}
                    date={a.created_at}
                    id={a.id}
                    onDelete={() => openDeleteModal(a.id, 'solution')}
                    isDeleting={deletingId === a.id}
                    onClick={() => navigate(`/dashboard/questions/${a.question_id}`)}
                    type="solution"
                  />
                )) : <EmptyState type="solutions" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-slate-200 rounded-[3.5rem] p-10 md:p-14 max-w-lg w-full relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] text-center"
            >
              <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mb-10 border border-red-100 mx-auto relative">
                 <div className="absolute inset-0 bg-red-200 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                 <FaTrashAlt className="text-red-500 text-3xl relative z-10" />
              </div>
              
              <h2 className="text-4xl font-bold text-slate-900 tracking-tighter font-syne mb-4">Confirm Deletion</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 max-w-sm mx-auto">
                {deleteModal.type === 'question' 
                  ? "Are you sure you want to delete this question? This action will permanently remove all associated replies and data."
                  : "Are you sure you want to delete this reply? This action is permanent and cannot be undone."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={closeDeleteModal}
                  className="flex-1 py-5 rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all text-[11px] font-black uppercase tracking-[3px] border border-slate-200"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => deleteModal.type === 'question' ? handleDeleteQuestion(deleteModal.id) : handleDeleteAnswer(deleteModal.id)}
                  className="flex-1 py-5 rounded-2xl bg-slate-900 text-white hover:bg-red-600 transition-all text-[11px] font-black uppercase tracking-[3px] shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActivityCard = ({ title, content, date, onDelete, onAIFix, isDeleting, onClick, type }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl"
  >
    <div className="absolute top-0 right-0 p-2">
       <div className={`w-32 h-32 -mr-16 -mt-16 blur-[80px] opacity-10 rounded-full ${type === 'question' ? 'bg-primary' : 'bg-emerald-500'}`}></div>
    </div>

    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
      <div className="flex-1 space-y-6 cursor-pointer w-full" onClick={onClick}>
        <div className="flex flex-wrap items-center gap-4">
           <span className={`text-[9px] font-black uppercase tracking-[3px] px-4 py-1.5 rounded-full border shadow-sm ${type === 'question' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20'}`}>
             {type}
           </span>
           <span className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2">
             <FaCalendarAlt size={10} className="text-primary/40" /> {formatDistanceToNow(new Date(date), { addSuffix: true })}
           </span>
           {type === 'solution' && (
             <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[2px]">
               <FaCheckCircle size={10} /> Verified Sync
             </span>
           )}
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight tracking-tight font-syne line-clamp-2">
          {title}
        </h3>
        {content && (
          <div className="relative pl-8 border-l-2 border-slate-100">
             <p className="text-slate-500 text-base md:text-lg font-medium italic line-clamp-2 leading-relaxed italic">
               "{content}"
             </p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-0 border-slate-100">
         {type === 'question' && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onAIFix();
             }}
             className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/20 group/ai"
           >
              <FaRobot size={14} className="group-hover/ai:scale-125 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[3px]">AI Fix</span>
           </button>
         )}
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onDelete();
           }}
           disabled={isDeleting}
           className="p-5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 border border-red-100 shadow-sm"
         >
           {isDeleting ? <FaCircleNotch className="animate-spin" /> : <FaTrashAlt />}
         </button>
         <button 
           onClick={onClick}
           className="flex-1 lg:flex-none flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all group/btn shadow-lg"
         >
            <span className="text-[11px] font-black uppercase tracking-[3px]">{type === 'question' ? 'View Details' : 'Inspect Fix'}</span>
            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ type }) => (
  <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[3rem] py-32 text-center flex flex-col items-center group">
    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-10 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
       <FaExclamationTriangle className="text-slate-300 text-4xl" />
    </div>
    <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-syne">HISTORY SILENT</h3>
    <p className="text-slate-500 text-lg mt-4 font-medium max-w-sm mx-auto">
      You haven't posted any {type} yet. Join the community to begin your contribution streak.
    </p>
    <button className="mt-10 px-12 py-5 bg-primary text-white hover:bg-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-[3px] transition-all shadow-xl shadow-primary/20">
       Launch Feed
    </button>
  </div>
);

const FaCircleNotch = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default MyActivity;
