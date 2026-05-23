import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FaSearch, FaPlus, FaCircleNotch, FaUsers, FaArrowRight, FaHashtag, FaCheckCircle, FaRobot } from "react-icons/fa";
import QuestionCard from "../../components/QA/QuestionCard";
import QuestionSkeleton from "../../components/QA/QuestionSkeleton";
import SEO from "../../components/SEO";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const QAHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // Dashboard route ko check krne ke liye
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState("Newest");
  const [currentUser, setCurrentUser] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // User ki session check krte hain
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  // Search query ko URL se fetch krte hain
  // Deep Linking" aur "State Persistence" kehte hain isko
  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Supabase se data fetch krne ke liye function
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);

      // Supabase se questions fetch krne ke liye query
      let query = supabase.from("questions").select(`
          *,
          votes_count,
          profiles!questions_user_id_fkey (
            full_name, 
            avatar_url
          ),
          answers (count)
        `);

      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`,
        );
      }

      // Filter by active tab
      if (activeFilter === "Newest") {
        query = query.order("created_at", { ascending: false });
      } else if (activeFilter === "Top Voted") {
        query = query.order("votes_count", { ascending: false });
      } else if (activeFilter === "My Questions" && currentUser) {
        query = query
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });
      } else if (activeFilter === "My Questions" && !currentUser) {
        // Special case: don't fetch anything if not logged in for this filter
        setQuestions([]);
        setLoading(false);
        return;
      } else {
        query = query.order("created_at", { ascending: false });
      }

      // Supabase se data fetch krte hain
      const { data, error } = await query;
      if (error) throw error;

      // data ko format krte hain taake codeCard use kar sake
      let formattedData = data.map((q) => ({
        ...q,
        answer_count: q.answers?.[0]?.count || 0,
      }));

      if (activeFilter === "Unanswered") {
        formattedData = formattedData.filter((q) => q.answer_count === 0);
      }

      setQuestions(formattedData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeFilter, currentUser]);

  // 400ms delay debounce logic taake bar bar network request na ho
  // Iska maqsad ye hai ke jab user search bar mein typing kar raha ho, to har aik lafz 
  // likhne par database ko request na jaye. Jab user typing rok dega (400ms ke liye), 
  // sirf tabhi data fetch hoga. Isse website ki performance fast ho jati hai.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchQuestions]);

  // Ask question button click handler
  const handleAskQuestionClick = () => {
    if (!currentUser) {
      navigate("/login");
    } else {
      navigate(isDashboard ? "/dashboard/qa/ask" : "/questions/ask");
    }
  };


  const shouldReduceMotion = useReducedMotion();
  
  const fadeIn = shouldReduceMotion ? {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 }
  } : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className={`relative min-h-screen bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-10' : ''}`}>
      <SEO 
        title="Community Q&A" 
        description="Solve your development bugs with the help of our global community and AI-powered insights." 
      />
      
      {/* --- HERO HEADER (CENTERED) --- */}
      <section className={`relative ${isDashboard ? 'py-10' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div 
            className="absolute w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full transition-transform duration-700 ease-out pointer-events-none opacity-40"
            style={{ 
              transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
              left: 0,
              top: 0
            }}
          ></div>
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 text-center space-y-10">
           <motion.div {...fadeIn} className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-2 rounded-full border border-white/10 shadow-2xl mb-10">
              <FaUsers className="text-primary text-[10px]" />
              <span className="text-[10px] font-bold tracking-[4px] uppercase">Community Knowledge Base</span>
           </motion.div>
           
           <motion.h1 {...fadeIn} className="text-5xl sm:text-7xl md:text-[100px] font-semibold font-heading leading-[0.9] tracking-tighter text-slate-900">
              Solve. Fix. <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Succeed.
              </span>
           </motion.h1>

           <motion.p {...fadeIn} className="max-w-3xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed px-4">
              Access thousands of verified fixes and expert discussions. Integrated with AI to help you debug in real-time.
           </motion.p>

           <motion.div {...fadeIn} className="pt-6">
              <button
                 onClick={handleAskQuestionClick}
                 className="group flex items-center justify-center gap-4 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl font-semibold text-[10px] md:text-sm uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] border-0 cursor-pointer hover:scale-105 active:scale-95 mx-auto"
              >
                 <FaPlus className="group-hover:rotate-90 transition-transform" />
                 Ask Global Community
              </button>
           </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="pb-16">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-slate-200 p-8 md:p-10 rounded-[3rem] md:rounded-[4rem] text-slate-900 shadow-xl relative overflow-hidden">
               <div className="space-y-1 text-center md:border-r border-slate-100 py-4">
                  <p className="text-3xl md:text-5xl font-semibold font-heading">12k+</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[4px] font-bold">Questions</p>
               </div>
               <div className="space-y-1 text-center md:border-r border-slate-100 py-4">
                  <p className="text-3xl md:text-5xl font-semibold font-heading text-emerald-600">8k+</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[4px] font-bold">Verified</p>
               </div>
               <div className="space-y-1 text-center md:border-r border-slate-100 py-4">
                  <p className="text-3xl md:text-5xl font-semibold font-heading text-primary">500+</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[4px] font-bold">Experts</p>
               </div>
               <div className="space-y-1 text-center py-4">
                  <p className="text-3xl md:text-5xl font-semibold font-heading text-blue-500">2s</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[4px] font-bold">Response</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- FILTER & SEARCH --- */}
      <section className="pb-12">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
           <div className="flex flex-col xl:flex-row gap-8 items-center justify-between">
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar w-full xl:w-auto">
                {["Newest", "Top Voted", "Unanswered", "My Questions"].map(filter => (
                    <button
                        key={filter}
                        onClick={() => { setActiveFilter(filter); setVisibleCount(5); }}
                        className={`px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-xl text-[9px] sm:text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === filter ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        {filter}
                    </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full xl:w-[500px] group">
                <div className="absolute inset-0 bg-primary/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 focus-within:border-primary/50 transition-all shadow-xl">
                    <FaSearch className="text-slate-400 mr-4" />
                    <input 
                        type="text" 
                        placeholder="Search discussions, bugs, or solutions..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none text-slate-900 font-semibold text-xs placeholder:text-slate-400"
                    />
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- FEED SECTION --- */}
      <section className="pb-32">
         <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24">
            <div className="grid lg:grid-cols-12 gap-10">
               
               {/* Main Feed */}
               <div className="lg:col-span-8 space-y-6">
                  {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map(i => <QuestionSkeleton key={i} />)}
                    </div>
                  ) : questions.length > 0 ? (
                    <div className="space-y-6">
                        {questions.slice(0, visibleCount).map((q) => (
                            <QuestionCard key={q.id} question={q} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-40 bg-white/[0.01] rounded-[4rem] border border-dashed border-white/10">
                        {activeFilter === "My Questions" && !currentUser ? (
                           <div className="space-y-6">
                              <p className="text-secondary font-semibold text-lg opacity-70 px-6">Please login to view your questions you ask.</p>
                              <button onClick={() => navigate("/login")} className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-all mx-auto block">Sign In Now</button>
                           </div>
                        ) : activeFilter === "My Questions" && currentUser ? (
                           <div className="space-y-6">
                              <p className="text-secondary font-semibold text-lg opacity-70 px-6">You haven't asked any questions yet.</p>
                              <button onClick={handleAskQuestionClick} className="text-primary font-semibold hover:underline flex items-center gap-3 mx-auto uppercase tracking-widest text-[10px]">Ask Your First Question <FaArrowRight /></button>
                           </div>
                        ) : (
                           <>
                              <p className="text-secondary font-semibold text-lg opacity-70 mb-6">No discussions found matching your criteria.</p>
                              <button onClick={handleAskQuestionClick} className="text-primary font-semibold hover:underline flex items-center gap-3 mx-auto uppercase tracking-widest text-[10px]">Start a Discussion <FaArrowRight /></button>
                           </>
                        )}
                    </div>
                  )}

                  {!loading && (
                    <div className="flex justify-center pt-10 pb-10">
                      {questions.length > visibleCount ? (
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 5)}
                            className="px-12 py-5 rounded-2xl border border-white/10 text-[10px] font-semibold uppercase tracking-[3px] text-slate-500 hover:text-white hover:border-primary/50 transition-all bg-white/[0.02] flex items-center gap-3 group"
                        >
                            More Questions <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <div className="h-[1px] w-20 bg-white/20"></div>
                          <p className="text-[10px] font-semibold uppercase tracking-[5px]">No more questions</p>
                          <div className="h-[1px] w-20 bg-white/20"></div>
                        </div>
                      )}
                    </div>
                  )}
               </div>

               {/* Right Sidebar: Trends & AI */}
               <div className="lg:col-span-4 space-y-8">
                  <SidebarCard title="Trending Tags" icon={<FaHashtag />}>
                     <div className="flex flex-wrap gap-2">
                        {["React", "Supabase", "Node.js", "AI", "PDF", "Encoding", "Security", "REST API"].map(tag => (
                           <span key={tag} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">#{tag}</span>
                        ))}
                     </div>
                  </SidebarCard>

                  <SidebarCard title="AI Fix Assistant" icon={<FaRobot />}>
                     <p className="text-secondary text-sm font-semibold opacity-70 leading-relaxed mb-6">Can't find an answer? Let our Neural Engine analyze your bug and suggest a fix instantly.</p>
                     <button onClick={() => navigate('/ai-assistant')} className="w-full py-4 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Try AI Solver</button>
                  </SidebarCard>

                  <SidebarCard title="Top Solvers" icon={<FaCheckCircle />}>
                     <div className="space-y-4">
                        <SolverItem name="Alex Rivera" rep="12.5k" />
                        <SolverItem name="Sarah Chen" rep="9.2k" />
                        <SolverItem name="Michael Scott" rep="8.4k" />
                     </div>
                  </SidebarCard>
               </div>

            </div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const SidebarCard = ({ title, icon, children }) => (
  <div className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
     <h3 className="text-xl font-semibold font-heading mb-10 flex items-center gap-4 tracking-tight text-slate-900">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-primary text-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
           {icon}
        </div>
        {title}
     </h3>
     <div className="relative z-10">
        {children}
     </div>
  </div>
);

const SolverItem = ({ name, rep }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
     <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{name[0]}</div>
        <p className="text-xs font-semibold text-slate-700">{name}</p>
     </div>
     <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">{rep} REP</span>
  </div>
);

export default QAHome;