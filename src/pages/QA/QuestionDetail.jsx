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
  FaRobot,
  FaMagic,
} from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import AnswerEditor from "../../components/QA/AnswerEditor";

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
        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-secondary/30 focus:outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all font-semibold"
      />
      {!user && (
        <Link 
          to="/login" 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-primary hover:underline uppercase tracking-widest"
        >
          Login
        </Link>
      )}
      {isFocused && val.trim() && (
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-semibold px-3 py-1 rounded-lg hover:bg-blue-600 transition-all animate-in fade-in zoom-in"
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
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

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
  }, [id, user]);

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
  if (!question) return <div className={`text-center ${isDashboard ? 'py-20' : 'py-40'} text-white`}><h2 className="text-3xl font-semibold mb-4 tracking-tight">Question Not Found</h2></div>;

  return (
    <div className={`relative min-h-screen bg-background text-white overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <section className={`relative pb-20 ${isDashboard ? 'pt-6' : 'pt-32 lg:pt-48'}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <button onClick={() => navigate(isDashboard ? "/dashboard/questions" : "/questions")} className="flex items-center gap-2 text-secondary hover:text-white transition-all group mb-8 md:mb-10">
          <FaChevronLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em]">Explore All Questions</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-10">
          <div className="flex md:flex-col items-center justify-start md:justify-center gap-4 h-fit">
            <button onClick={() => handleVote(1)} className={`p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] transition-all border ${userVote === 1 ? 'bg-primary/20 text-primary border-primary/50 shadow-lg shadow-primary/10' : 'bg-white/5 text-secondary hover:text-primary border-white/5'}`}>
              <FaArrowUp className="text-sm md:text-xl" />
            </button>
            <span className="text-xl md:text-2xl font-semibold text-white tracking-tight">{question.votes_count || 0}</span>
            <button onClick={() => handleVote(-1)} className={`p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] transition-all border ${userVote === -1 ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-lg shadow-red-500/10' : 'bg-white/5 text-secondary hover:text-red-500 border-white/5'}`}>
              <FaArrowDown className="text-sm md:text-xl" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-semibold text-white leading-[1.2] md:leading-[1.1] tracking-tight flex-1">{question.title}</h1>
              <button 
                onClick={handleAskAI}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-6 md:px-8 py-3.5 md:py-4.5 rounded-xl md:rounded-2xl font-semibold text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <FaRobot className="group-hover:rotate-12 transition-transform text-base md:text-lg" />
                Solve with AI
                <FaMagic className="text-yellow-400 animate-pulse text-[10px]" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/20">
                  {question.profiles?.avatar_url ? <img src={question.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-secondary w-full h-full" />}
                </div>
                <span className="text-sm text-white font-semibold uppercase tracking-wider">{question.profiles?.full_name || "Developer"}</span>
              </div>
              <span className="text-secondary/60 text-[10px] font-semibold flex items-center gap-2 tracking-widest">
                <FaRegClock size={12} className="text-primary" /> ASKED {formatDistanceToNow(new Date(question.created_at)).toUpperCase()} AGO
              </span>
            </div>

            <div className="prose prose-invert max-w-none">
               <p className="text-secondary text-base md:text-xl leading-relaxed whitespace-pre-wrap font-semibold opacity-80">{question.content}</p>
            </div>

            {question.code_snippet && (
              <div className="rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mt-8">
                <SyntaxHighlighter language="javascript" style={atomDark} customStyle={{ padding: "15px", fontSize: "12px", lineHeight: "1.6", margin: 0, background: "rgba(255,255,255,0.02)" }}>
                  {question.code_snippet}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>

        {/* Answers Header & List */}
        <div className="mt-24 mb-12">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-4 tracking-tight">
            {answers.length} Solutions 
            <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
          </h3>
        </div>

        <div className="space-y-10">
          {answers.length > 0 ? answers.map((ans) => (
            <div key={ans.id} className="group relative p-0.5 leading-none rounded-3xl md:rounded-[3.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2">
               <div className="p-6 md:p-10 rounded-[1.7rem] md:rounded-[3.4rem] h-full bg-[#0B0E14]/90 backdrop-blur-3xl border border-white/5 group-hover:border-white/10 transition-all flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex md:flex-col items-center justify-start md:justify-center gap-4 md:gap-6 h-fit shrink-0">
                  <button className="w-10 md:w-14 h-10 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-secondary hover:text-primary hover:bg-primary/10 transition-all border border-white/5"><FaArrowUp className="text-xs md:text-lg" /></button>
                  <span className="font-semibold text-white text-lg md:text-2xl tracking-tight">0</span>
                  <button className="w-10 md:w-14 h-10 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"><FaArrowDown className="text-xs md:text-lg" /></button>
                </div>
                <div className="space-y-6 md:space-y-8 flex-1">
                  <p className="text-secondary text-base md:text-xl leading-relaxed font-semibold opacity-80 whitespace-pre-wrap">{ans.content}</p>
                  
                  {ans.code_snippet && (
                    <div className="rounded-xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                      <SyntaxHighlighter language="javascript" style={atomDark} customStyle={{ padding: "15px", fontSize: "12px", margin: 0, background: "#0a0a0c" }}>{ans.code_snippet}</SyntaxHighlighter>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/10">
                      {ans.profiles?.avatar_url ? <img src={ans.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-secondary/20 w-full h-full" />}
                    </div>
                    <div>
                      <p className="text-xs text-white font-semibold uppercase tracking-widest">{ans.profiles?.full_name || "Community Member"}</p>
                      <p className="text-[10px] text-secondary/40 font-semibold uppercase tracking-wider">REPLIED {formatDistanceToNow(new Date(ans.created_at)).toUpperCase()} AGO</p>
                    </div>
                  </div>

                  {/* Replies Section */}
                  <div className="mt-10 pt-8 border-t border-white/5 space-y-6">
                    {ans.comments && ans.comments.map(comment => (
                      <div key={comment.id} className="flex gap-4 items-start pl-6 border-l-2 border-primary/20 py-1 group/comment">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-white/5 shrink-0">
                          {comment.profiles?.avatar_url ? <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-secondary/20 w-full h-full" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold text-primary uppercase tracking-[1px] mb-1">{comment.profiles?.full_name}</p>
                          <p className="text-sm text-secondary/80 leading-relaxed font-semibold opacity-80">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                       <CommentInput onPost={(val) => handlePostComment(ans.id, val)} user={user} location={location} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
               <p className="text-secondary font-semibold italic text-lg opacity-50">Be the hero this developer needs. Share your fix!</p>
            </div>
          )}
        </div>

        {/* Share Your Solution */}
        <div className="mt-24">
          <div className="mb-10">
             <h3 className="text-2xl font-semibold text-white tracking-tight">Share Your Solution</h3>
          </div>
          {user ? (
            <AnswerEditor onPost={handlePostAnswer} />
          ) : (
            <div className="bg-primary/5 border border-primary/20 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] text-center space-y-8 backdrop-blur-md">
              <h4 className="text-white font-semibold text-base md:text-xl uppercase tracking-[4px]">Login Required</h4>
              <Link to="/login" state={{ from: location.pathname }} className="inline-block bg-primary text-white px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Sign In to Reply</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  </div>
  );
};

export default QuestionDetail;