import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  FaArrowUp,
  FaArrowDown,
  FaRegClock,
  FaUserCircle,
  FaChevronLeft,
  FaCircleNotch,
  FaRegCommentDots,
  FaLock,
  FaRobot,
  FaMagic,
} from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import AnswerEditor from "../../components/QA/AnswerEditor";

// --- Sub-Components ---

const CommentInput = ({ onPost, user, location }) => {
  const [val, setVal] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!val.trim()) return;
    onPost(val);
    setVal("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <input 
        type="text"
        placeholder={user ? "Add a reply..." : "Login to reply"}
        disabled={!user}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-secondary/30 focus:outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all"
      />
      {!user && (
        <Link 
          to="/login" 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
        >
          Login
        </Link>
      )}
      {isFocused && val.trim() && (
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-lg hover:bg-blue-600 transition-all animate-in fade-in zoom-in"
        >
          POST
        </button>
      )}
    </form>
  );
};

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userVote, setUserVote] = useState(0); 

  const handleAskAI = () => {
    const aiContext = `I have a question titled "${question.title}".\n\nContent:\n${question.content}\n\n${question.code_snippet ? `Code:\n${question.code_snippet}` : ""}\n\nPlease provide a detailed solution.`;
    navigate('/ai-assistant', { state: { initialPrompt: aiContext } });
  };
  useEffect(() => {
    // Initial user fetch
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchFullData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: qData, error: qError } = await supabase
        .from("questions")
        .select("*, profiles!questions_user_id_fkey(full_name, avatar_url)")
        .eq("id", id)
        .maybeSingle();

      if (qError) throw qError;

      if (qData) {
        setQuestion(qData);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: voteData } = await supabase
            .from("votes")
            .select("vote_type")
            .eq("question_id", id)
            .eq("user_id", user.id)
            .maybeSingle();
          if (voteData) setUserVote(voteData.vote_type);
        }

        const { data: aData, error: aError } = await supabase
          .from("answers")
          .select(`
            *, 
            profiles!answers_user_id_fkey(full_name, avatar_url),
            comments(*, profiles!comments_user_id_fkey(full_name, avatar_url))
          `)
          .eq("question_id", id)
          .order("created_at", { ascending: true });

        if (aError) throw aError;
        setAnswers(aData || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Data load nahi ho saka!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFullData();
  }, [id, user]); // user add kiya taake login/logout par data refresh ho

  const handlePostComment = async (answerId, content) => {
    if (!user) return navigate("/login");
    if (!content.trim()) return;

    try {
      const { error } = await supabase.from("comments").insert([
        {
          answer_id: answerId,
          user_id: user.id,
          content: content.trim(),
        },
      ]);
      if (error) throw error;
      toast.success("Reply added!");
      fetchFullData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVote = async (type) => {
    if (!user) {
      toast.error("Please login to vote!");
      return navigate("/login");
    }

    const isRemovingVote = userVote === type;
    const newVoteType = isRemovingVote ? 0 : type;
    
    let scoreDiff = 0;
    if (isRemovingVote) {
      scoreDiff = -type;
    } else if (userVote === 0) {
      scoreDiff = type;
    } else {
      scoreDiff = type * 2; 
    }

    // Optimistic Update
    const oldVote = userVote;
    const oldScore = question.votes_count || 0;
    
    setUserVote(newVoteType);
    setQuestion(prev => ({ ...prev, votes_count: (prev.votes_count || 0) + scoreDiff }));

    try {
      if (isRemovingVote) {
        const { error } = await supabase.from("votes").delete().eq("question_id", id).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("votes").upsert({
          question_id: id,
          user_id: user.id,
          vote_type: type
        }, { onConflict: 'question_id, user_id' });
        if (error) throw error;
      }

      // Sync total votes count in questions table
      const { error: rpcError } = await supabase.rpc('handle_vote_sync', { 
        q_id: id, 
        diff: scoreDiff 
      });
      
      if (rpcError) throw rpcError;
      
      toast.success(isRemovingVote ? "Vote removed" : "Vote recorded!");
    } catch (error) {
      console.error("Vote Sync Error:", error);
      setUserVote(oldVote);
      setQuestion(prev => ({ ...prev, votes_count: oldScore }));
      toast.error("Could not sync vote with database.");
    }
  };

  const handlePostAnswer = async (answerContent, codeSnippet) => {
    try {
      if (!user) return navigate("/login");
      const { error } = await supabase.from("answers").insert([
        {
          question_id: id,
          user_id: user.id,
          content: answerContent,
          code_snippet: codeSnippet,
        },
      ]);
      if (error) throw error;
      toast.success("Solution shared! 🚀");
      fetchFullData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className={`flex flex-col items-center justify-center ${isDashboard ? 'py-32' : 'py-60'}`}><FaCircleNotch className="text-primary animate-spin" size={40} /></div>;
  if (!question) return <div className={`text-center ${isDashboard ? 'py-20' : 'py-40'} text-white`}><h2 className="text-3xl font-black mb-4">Question Not Found</h2></div>;

  return (
    <section className={`relative min-h-screen pb-20 bg-background overflow-hidden ${isDashboard ? 'pt-6' : 'pt-28'}`}>
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
      <div className="max-w-5xl mx-auto px-4">
        <button onClick={() => navigate(isDashboard ? "/dashboard/questions" : "/questions")} className="flex items-center gap-2 text-secondary hover:text-white transition-all group mb-10">
          <FaChevronLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Explore All Questions</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-10">
          <div className="flex md:flex-col items-center gap-4 h-fit">
            <button onClick={() => handleVote(1)} className={`p-4 rounded-[1.5rem] transition-all border ${userVote === 1 ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-secondary hover:text-primary border-white/5'}`}>
              <FaArrowUp size={20} />
            </button>
            <span className="text-2xl font-black text-white">{question.votes_count || 0}</span>
            <button onClick={() => handleVote(-1)} className={`p-4 rounded-[1.5rem] transition-all border ${userVote === -1 ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-secondary hover:text-red-500 border-white/5'}`}>
              <FaArrowDown size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight flex-1">{question.title}</h1>
              <button 
                onClick={handleAskAI}
                className="shrink-0 flex items-center gap-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group mt-2"
              >
                <FaRobot className="group-hover:rotate-12 transition-transform text-lg" />
                Solve with AI
                <FaMagic className="text-yellow-400 animate-pulse text-[10px]" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/20">
                  {question.profiles?.avatar_url ? <img src={question.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-secondary w-full h-full" />}
                </div>
                <span className="text-sm text-white font-black uppercase tracking-wider">{question.profiles?.full_name || "Developer"}</span>
              </div>
              <span className="text-secondary/60 text-xs font-bold flex items-center gap-2">
                <FaRegClock size={12} className="text-primary" /> ASKED {formatDistanceToNow(new Date(question.created_at)).toUpperCase()} AGO
              </span>
            </div>
            <div className="prose prose-invert max-w-none"><p className="text-secondary/80 text-lg leading-relaxed whitespace-pre-wrap font-medium">{question.content}</p></div>
            {question.code_snippet && (
              <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <SyntaxHighlighter language="javascript" style={atomDark} customStyle={{ padding: "30px", fontSize: "14px", lineHeight: "1.6", margin: 0, background: "rgba(255,255,255,0.02)" }}>
                  {question.code_snippet}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>

        {/* Answers Header & List */}
        <div className="mt-20 mb-10"><h3 className="text-2xl font-black text-white flex items-center gap-4">{answers.length} Solutions <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div></h3></div>
        <div className="space-y-8">
          {answers.length > 0 ? answers.map((ans) => (
            <div key={ans.id} className="group bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-[3rem] hover:bg-white/[0.04] transition-all">
              <div className="grid grid-cols-1 md:grid-cols-[60px_1fr] gap-8">
                <div className="flex md:flex-col items-center gap-3 h-fit text-secondary/40 group-hover:text-secondary transition-colors">
                  <button className="hover:text-primary transition-colors"><FaArrowUp size={16} /></button>
                  <span className="font-black text-white text-lg">0</span>
                  <button className="hover:text-red-500 transition-colors"><FaArrowDown size={16} /></button>
                </div>
                <div className="space-y-6">
                  <p className="text-secondary/80 leading-relaxed text-lg font-medium whitespace-pre-wrap">{ans.content}</p>
                  {ans.code_snippet && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <SyntaxHighlighter language="javascript" style={atomDark} customStyle={{ padding: "20px", fontSize: "13px", margin: 0, background: "#0a0a0c" }}>{ans.code_snippet}</SyntaxHighlighter>
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/10">
                      {ans.profiles?.avatar_url ? <img src={ans.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-secondary/20 w-full h-full" />}
                    </div>
                    <div>
                      <p className="text-xs text-white font-black uppercase tracking-widest">{ans.profiles?.full_name || "Community Member"}</p>
                      <p className="text-[10px] text-secondary/50 font-bold">REPLIED {formatDistanceToNow(new Date(ans.created_at)).toUpperCase()} AGO</p>
                    </div>
                  </div>

                  {/* --- Comments/Replies Section --- */}
                  <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                    {ans.comments && ans.comments.map(comment => (
                      <div key={comment.id} className="flex gap-4 items-start pl-4 border-l-2 border-primary/20 py-1">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/5 shrink-0">
                          {comment.profiles?.avatar_url ? <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-secondary/20 w-full h-full" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-tighter mb-1">{comment.profiles?.full_name}</p>
                          <p className="text-xs text-secondary/70 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Inline Reply Input */}
                    <div className="pt-2">
                       <CommentInput onPost={(val) => handlePostComment(ans.id, val)} user={user} location={location} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]"><p className="text-secondary font-bold italic text-lg">Be the hero this developer needs. Share your fix!</p></div>}
        </div>

        {/* Your Answer Section */}
        <div className="mt-20">
          <div className="mb-8"><h3 className="text-2xl font-black text-white">Share Your Solution</h3></div>
          {user ? <AnswerEditor onPost={handlePostAnswer} /> : <div className="bg-primary/5 border border-primary/20 p-10 rounded-[3rem] text-center space-y-6 backdrop-blur-md"><h4 className="text-white font-black text-xl uppercase tracking-widest">Login Required</h4><Link to="/login" state={{ from: location.pathname }} className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em]">Sign In to Reply</Link></div>}
        </div>
      </div>
    </section>
  );
};


export default QuestionDetail;