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
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold shadow-sm"
      />
      {!user && (
        <Link 
          to="/login" 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
        >
          Login
        </Link>
      )}
      {isFocused && val.trim() && (
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[9px] font-bold px-5 py-2 rounded-lg hover:bg-primary transition-all shadow-lg shadow-black/20 uppercase tracking-widest"
        >
          Publish Reply
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

  // --- Fetching Logic (Sab se important hissa) ---
  const fetchFullData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 1. Question ka data fetch krte hain aur profiles table se user ka naam/avatar join krte hain
      const { data: qData, error: qError } = await supabase
        .from("questions")
        .select("*, profiles!questions_user_id_fkey(full_name, avatar_url)")
        .eq("id", id)
        .maybeSingle();

      if (qError) throw qError;

      if (qData) {
        setQuestion(qData);
        
        // 2. Check krte hain ke login user ne is sawal ko pehle se vote diya hua hai ya nahi
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

        // 3. Answers fetch krte hain aur sath hi un answers ke authors aur un ke comments bhi join krte hain
        // Isay "Nested Relational Query" kehte hain.
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
      toast.error("Failed to load question details.");
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
      toast.success("Reply added successfully.");
      fetchFullData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- Voting Logic (Logical Concept: Optimistic Update) ---
  const handleVote = async (type) => {
    if (!user) {
      toast.error("Please log in to vote.");
      return navigate("/login");
    }

    const isRemovingVote = userVote === type;
    const newVoteType = isRemovingVote ? 0 : type;
    
    // Logic: Calculate krte hain ke UI mein score kitna barhna ya kam hona chahiye
    let scoreDiff = 0;
    if (isRemovingVote) {
      scoreDiff = -type;
    } else if (userVote === 0) {
      scoreDiff = type;
    } else {
      scoreDiff = type * 2; // e.g. Upvote (+1) se Downvote (-1) pr jana = -2 ka difference
    }

    const oldVote = userVote;
    const oldScore = question.votes_count || 0;
    
    // OPTIMISTIC UPDATE: Database ka wait kiye baghair UI update kr dena
    setUserVote(newVoteType);
    setQuestion(prev => ({ ...prev, votes_count: (prev.votes_count || 0) + scoreDiff }));

    try {
      if (isRemovingVote) {
        // Vote delete krna
        const { error } = await supabase.from("votes").delete().eq("question_id", id).eq("user_id", user.id);
        if (error) throw error;
      } else {
        // Naya vote dalna ya purane ko update krna (Upsert)
        // Supabase Upsert Magic: Is line ka matlab hai "Agar vote pehle se hai to 
        // update kr do, nahi to naya insert kr lo"
        const { error } = await supabase.from("votes").upsert({
          question_id: id,
          user_id: user.id,
          vote_type: type
        }, { onConflict: 'question_id, user_id' });
        if (error) throw error;
      }

      // Sync total count in questions table using Database RPC (Function)
      // Remote Procedure Call.
      // RPC Ka Matlab: Sir, RPC aik database function hota hai jo database ke andar 
      // chalta hai. Humne `handle_vote_sync` naam ka RPC banaya hai jo ensure 
      // krta hai ke `votes` table aur `questions` table ka count hamesha barabar rahay.
      const { error: rpcError } = await supabase.rpc('handle_vote_sync', { 
        q_id: id, 
        diff: scoreDiff 
      });
      
      if (rpcError) throw rpcError;
      
      toast.success(isRemovingVote ? "Vote removed." : "Vote recorded.");
    } catch (error) {
      // ROLLBACK: Agar error ayay to UI ko wapas purani state pr le jana
      console.error("Vote Sync Error:", error);
      setUserVote(oldVote);
      setQuestion(prev => ({ ...prev, votes_count: oldScore }));
      toast.error("Database sync failed.");
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
      toast.success("Your solution has been shared with the community! 🚀");
      fetchFullData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className={`flex flex-col items-center justify-center ${isDashboard ? 'py-32' : 'py-60'}`}><FaCircleNotch className="text-primary animate-spin" size={40} /></div>;
  if (!question) return <div className={`text-center ${isDashboard ? 'py-20' : 'py-40'} text-white`}><h2 className="text-3xl font-semibold mb-4 tracking-tight">Question Not Found</h2></div>;

  return (
    <div className={`relative min-h-screen bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <section className={`relative pb-20 ${isDashboard ? 'pt-6' : 'pt-32 lg:pt-48'}`}>
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
        <button onClick={() => navigate(isDashboard ? "/dashboard/questions" : "/questions")} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all group mb-8 md:mb-10">
          <FaChevronLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em]">Explore All Questions</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 md:gap-16">
          <div className="flex md:flex-col items-center justify-start md:justify-center gap-6 h-fit bg-slate-50 border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
            <button onClick={() => handleVote(1)} className={`p-4 rounded-2xl transition-all border ${userVote === 1 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-400 hover:text-primary border-slate-200 shadow-sm'}`}>
              <FaArrowUp className="text-xl" />
            </button>
            <span className="text-2xl md:text-3xl font-semibold font-heading text-slate-900 tracking-tighter">{question.votes_count || 0}</span>
            <button onClick={() => handleVote(-1)} className={`p-4 rounded-2xl transition-all border ${userVote === -1 ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-white text-slate-400 hover:text-red-500 border-slate-200 shadow-sm'}`}>
              <FaArrowDown className="text-xl" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold font-heading text-slate-900 leading-[1.1] tracking-tighter flex-1">{question.title}</h1>
              <button 
                onClick={handleAskAI}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-4 bg-slate-900 text-white px-8 md:px-10 py-5 md:py-6 rounded-2xl font-bold text-xs uppercase tracking-[3px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <FaRobot className="group-hover:rotate-12 transition-transform text-lg" />
                Solve with AI
                <FaMagic className="text-primary animate-pulse text-xs" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-10 py-8 border-y border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/10">
                  {question.profiles?.avatar_url ? <img src={question.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-slate-300 w-full h-full" />}
                </div>
                <span className="text-[11px] text-slate-900 font-bold uppercase tracking-[2px]">{question.profiles?.full_name || "Developer"}</span>
              </div>
              <span className="text-slate-400 text-[10px] font-bold flex items-center gap-2 tracking-[3px] uppercase">
                <FaRegClock size={12} className="text-primary" /> ASKED {formatDistanceToNow(new Date(question.created_at)).toUpperCase()} AGO
              </span>
            </div>

            <div className="prose max-w-none py-10">
               <p className="text-slate-600 text-lg md:text-2xl leading-relaxed whitespace-pre-wrap font-medium">{question.content}</p>
            </div>

            {question.code_snippet && (
              <div className="w-full max-w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl mt-12 group/code">
                <div className="bg-[#0B0E14] border-b border-white/5 px-8 py-4 flex items-center justify-between">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover/code:bg-red-500/50 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover/code:bg-yellow-500/50 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover/code:bg-green-500/50 transition-colors" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px]">source_payload.js</span>
                </div>
                <SyntaxHighlighter 
                  language="javascript" 
                  style={atomDark} 
                  customStyle={{ 
                    padding: "30px", 
                    fontSize: "13px", 
                    lineHeight: "1.7", 
                    margin: 0, 
                    background: "#0B0E14" 
                  }}
                >
                  {question.code_snippet}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>

        {/* Answers Header & List */}
        <div className="mt-32 mb-16">
          <h3 className="text-3xl font-semibold font-heading text-slate-900 flex items-center gap-6 tracking-tighter">
            {answers.length} Community Solutions 
            <div className="h-[1px] flex-1 bg-slate-100"></div>
          </h3>
        </div>
        <div className="space-y-12">
          {answers.length > 0 ? answers.map((ans) => (
            <div key={ans.id} className="group relative bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500">
               <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="flex md:flex-col items-center justify-start md:justify-center gap-6 h-fit shrink-0 bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                  <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all border border-slate-200 shadow-sm"><FaArrowUp className="text-lg" /></button>
                  <span className="font-semibold font-heading text-slate-900 text-xl md:text-2xl tracking-tighter">0</span>
                  <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 transition-all border border-slate-200 shadow-sm"><FaArrowDown className="text-lg" /></button>
                </div>
                <div className="space-y-10 flex-1 min-w-0">
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium whitespace-pre-wrap">{ans.content}</p>
                  
                  {ans.code_snippet && (
                    <div className="w-full max-w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl group/anscode">
                      <div className="bg-[#0B0E14] border-b border-white/5 px-6 py-3 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 group-hover/anscode:bg-red-500/50 transition-colors" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 group-hover/anscode:bg-yellow-500/50 transition-colors" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover/anscode:bg-green-500/50 transition-colors" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[2px]">fix_applied.js</span>
                      </div>
                      <SyntaxHighlighter language="javascript" style={atomDark} customStyle={{ padding: "30px", fontSize: "13px", margin: 0, background: "#0B0E14" }}>{ans.code_snippet}</SyntaxHighlighter>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-10 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-primary/10">
                      {ans.profiles?.avatar_url ? <img src={ans.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-slate-300 w-full h-full" />}
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-900 font-bold uppercase tracking-[2px]">{ans.profiles?.full_name || "Community Member"}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px]">SOLVED {formatDistanceToNow(new Date(ans.created_at)).toUpperCase()} AGO</p>
                    </div>
                  </div>

                  {/* Replies Section */}
                  <div className="mt-12 pt-10 border-t border-slate-100 space-y-8">
                    {ans.comments && ans.comments.map(comment => (
                      <div key={comment.id} className="flex gap-5 items-start pl-8 border-l-2 border-slate-100 py-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-50 shrink-0">
                          {comment.profiles?.avatar_url ? <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <FaUserCircle className="text-slate-200 w-full h-full" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-[2px] mb-2">{comment.profiles?.full_name}</p>
                          <p className="text-base text-slate-500 leading-relaxed font-medium break-words">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4">
                       <CommentInput onPost={(val) => handlePostComment(ans.id, val)} user={user} location={location} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-32 bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
               <p className="text-slate-400 font-bold uppercase tracking-[4px] text-xs">Waiting for a hero...</p>
               <p className="text-slate-500 font-medium text-lg mt-2 px-6">Be the first to share a solution for this bug!</p>
            </div>
          )}
        </div>

        {/* Share Your Solution */}
        <div className="mt-32">
          <div className="mb-12">
             <h3 className="text-3xl font-semibold font-heading text-slate-900 tracking-tighter">Share Your Solution</h3>
          </div>
          {user ? (
            <AnswerEditor onPost={handlePostAnswer} />
          ) : (
            <div className="bg-slate-900 p-12 md:p-24 rounded-[3rem] md:rounded-[4rem] text-center space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <div className="w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
              </div>
              <h4 className="text-white font-semibold font-heading text-xl md:text-3xl tracking-tight relative z-10">Join the discussion.</h4>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto relative z-10">Sign in to share your expertise and help the community grow.</p>
              <Link to="/login" state={{ from: location.pathname }} className="relative z-10 inline-block bg-primary text-white px-12 py-5 rounded-2xl font-bold text-xs uppercase tracking-[4px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Sign In Now</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  </div>
  );
};

export default QuestionDetail;