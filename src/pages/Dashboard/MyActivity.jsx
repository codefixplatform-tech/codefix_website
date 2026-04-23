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
  FaCheckCircle
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
    if (!window.confirm("Are you sure? Is question ke sath saare replies bhi delete ho jayenge.")) return;
    
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
    if (!window.confirm("Kyan aap waqai ye reply delete karna chahte hain?")) return;

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
    <div className="space-y-10 pb-10">
      {/* --- HEADER SECTION --- */}
      <div className="relative group">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
             >
                <FaClock className="text-primary text-[10px]" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">User Timeline</span>
             </motion.div>
             <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-none">
               My <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Activity</span>
             </h1>
             <p className="text-secondary text-base md:text-lg font-medium opacity-60 max-w-xl">
               Monitor your contributions, manage your questions, and track community interactions in one dashboard.
             </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
             <div className="px-6 border-r border-white/5">
                <p className="text-2xl font-semibold text-white leading-none">{questions.length}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Questions</p>
             </div>
             <div className="px-6">
                <p className="text-2xl font-semibold text-primary leading-none">{answers.length}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Solutions</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex items-center justify-start border-b border-white/5 gap-8">
        <button 
          onClick={() => setActiveTab("questions")}
          className={`pb-4 text-xs md:text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'questions' ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
        >
          My Questions
          {activeTab === 'questions' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("answers")}
          className={`pb-4 text-xs md:text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'answers' ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
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
              className="flex flex-col items-center justify-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5"
            >
               <FaCircleNotch className="text-primary animate-spin text-4xl mb-6" />
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[4px]">Accessing History Engine...</p>
            </motion.div>
          ) : (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {activeTab === "questions" ? (
                questions.length > 0 ? questions.map(q => (
                  <ActivityCard 
                    key={q.id}
                    title={q.title}
                    date={q.created_at}
                    id={q.id}
                    onDelete={() => handleDeleteQuestion(q.id)}
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
                    onDelete={() => handleDeleteAnswer(a.id)}
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
    </div>
  );
};

const ActivityCard = ({ title, content, date, onDelete, isDeleting, onClick, type }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 hover:bg-white/[0.04] hover:border-primary/20 transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-1">
       <div className={`w-20 h-20 -mr-10 -mt-10 blur-3xl opacity-20 rounded-full ${type === 'question' ? 'bg-primary' : 'bg-emerald-500'}`}></div>
    </div>

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex-1 space-y-4 cursor-pointer w-full" onClick={onClick}>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
           <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${type === 'question' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
             {type}
           </span>
           <span className="text-secondary/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
             <FaCalendarAlt size={10} className="text-primary/50" /> {formatDistanceToNow(new Date(date), { addSuffix: true })}
           </span>
           {type === 'solution' && (
             <span className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
               <FaCheckCircle size={10} /> Sync Complete
             </span>
           )}
        </div>

        <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-primary transition-colors leading-tight tracking-tight line-clamp-2">
          {title}
        </h3>
        {content && (
          <div className="relative pl-6 border-l-2 border-white/5">
             <p className="text-secondary text-sm md:text-base font-medium opacity-60 italic line-clamp-2 leading-relaxed">
               "{content}"
             </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-white/5">
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onDelete();
           }}
           disabled={isDeleting}
           className="flex-1 md:flex-none flex items-center justify-center p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 border border-red-500/10"
         >
           {isDeleting ? <FaCircleNotch className="animate-spin" /> : <FaTrashAlt />}
         </button>
         <button 
           onClick={onClick}
           className="flex-[2] md:flex-none flex items-center justify-center gap-3 px-8 md:px-10 py-4 rounded-2xl bg-white/5 text-secondary hover:text-white hover:bg-primary transition-all group/btn border border-white/5"
         >
            <span className="text-[10px] font-bold uppercase tracking-widest md:hidden lg:block">View Details</span>
            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ type }) => (
  <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] py-24 text-center flex flex-col items-center group">
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
       <FaExclamationTriangle className="text-slate-700 text-3xl" />
    </div>
    <h3 className="text-2xl font-bold text-white tracking-tight">NO CONTRIBUTIONS YET</h3>
    <p className="text-secondary text-base mt-3 font-medium opacity-60 max-w-sm mx-auto">
      You haven't posted any {type} in the Codefix community. Start by exploring open discussions.
    </p>
    <button className="mt-8 px-10 py-4 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
       Explore Discussions
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

