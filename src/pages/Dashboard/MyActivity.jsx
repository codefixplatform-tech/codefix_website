import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, useOutletContext } from "react-router-dom";
import { 
  FaQuestionCircle, 
  FaReply, 
  FaTrashAlt, 
  FaCalendarAlt, 
  FaArrowRight,
  FaExclamationTriangle
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            My <span className="text-primary">Activity</span>
          </h1>
          <p className="text-secondary mt-2 font-medium opacity-80">
            Manage your questions and replies in one place.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5 backdrop-blur-xl">
        <button 
          onClick={() => setActiveTab("questions")}
          className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'questions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-secondary hover:text-white hover:bg-white/5'}`}
        >
          <FaQuestionCircle /> My Questions ({questions.length})
        </button>
        <button 
          onClick={() => setActiveTab("answers")}
          className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'answers' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-secondary hover:text-white hover:bg-white/5'}`}
        >
          <FaReply /> My Replies ({answers.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 text-xs font-black uppercase tracking-widest">Fetching Data...</p>
          </div>
        ) : (
          activeTab === "questions" ? (
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
                type="answer"
              />
            )) : <EmptyState type="replies" />
          )
        )}
      </div>
    </div>
  );
};

const ActivityCard = ({ title, content, date, onDelete, isDeleting, onClick, type }) => (
  <div className="bg-surface/30 border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all group backdrop-blur-xl">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-3 mb-2">
           <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${type === 'question' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
             {type}
           </span>
           <span className="text-secondary/40 text-[10px] flex items-center gap-1">
             <FaCalendarAlt size={10} /> {formatDistanceToNow(new Date(date), { addSuffix: true })}
           </span>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">
          {title}
        </h3>
        {content && <p className="text-secondary text-sm line-clamp-2 mt-2 opacity-70 italic">"{content.substring(0, 100)}..."</p>}
      </div>
      
      <div className="flex items-center gap-2">
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onDelete();
           }}
           disabled={isDeleting}
           className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
           title="Delete"
         >
           {isDeleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FaTrashAlt />}
         </button>
         <button onClick={onClick} className="p-3 rounded-xl bg-white/5 text-secondary hover:text-white transition-all">
            <FaArrowRight />
         </button>
      </div>
    </div>
  </div>
);

const EmptyState = ({ type }) => (
  <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] py-20 text-center flex flex-col items-center">
    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
       <FaExclamationTriangle className="text-secondary/40 text-2xl" />
    </div>
    <h3 className="text-xl font-black text-white uppercase tracking-wider">No {type} found</h3>
    <p className="text-secondary text-sm mt-2 font-medium opacity-60">You haven't posted any {type} yet.</p>
  </div>
);

export default MyActivity;
