import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FaSearch, FaPlus, FaCircleNotch ,  FaUsers } from "react-icons/fa";
import QuestionCard from "../../components/QA/QuestionCard";

const QAHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const isDashboard = location.pathname.startsWith('/dashboard');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState("Newest");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  // Sync search state with URL params (e.g. when searching from topbar while on this page)
  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);

      // Query optimized to fetch votes_count as a simple value
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

      // Filter Logic
      if (activeFilter === "Newest") {
        query = query.order("created_at", { ascending: false });
      } else if (activeFilter === "Top Voted") {
        // Sorting by the integer column votes_count
        query = query.order("votes_count", { ascending: false });
      } else if (activeFilter === "My Questions" && currentUser) {
        query = query
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchQuestions]);

  const handleAskQuestionClick = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: location.pathname + "/ask" } });
    } else {
      navigate(isDashboard ? "/dashboard/qa/ask" : "/questions/ask");
    }
  };

  return (
    <section className={`relative min-h-screen overflow-hidden bg-background ${isDashboard ? 'pt-6 pb-20' : 'pt-28 pb-20'}`}>
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
              <FaUsers className="text-primary text-xs" />
              <span className=" text-[10px] font-semibold font-black text-slate-300 tracking-[3px] uppercase">
                community hub
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold font-black text-white leading-[1.1] tracking-tight">
              Developer  <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Q&A
              </span>
             
            </h1>
          </div>

          <button
            onClick={handleAskQuestionClick}
            className="group flex items-center justify-center gap-3 font-semibold bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <FaPlus
              size={12}
              className="group-hover:rotate-90 transition-transform"
            />
            <span>Ask Question</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/[0.03] p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-xl mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar pb-2 lg:pb-0">
            {["Newest", "Top Voted", "Unanswered", "My Questions"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setVisibleCount(5);
                  }}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[15px] font-black transition-all border ${
                    activeFilter === filter
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                      : "text-secondary hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  {filter}
                </button>
              ),
            )}
          </div>

          <div className="relative w-full lg:w-96">
            <FaSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag or content..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-secondary/40"
            />
          </div>
        </div>

        {/* Questions Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <FaCircleNotch className="text-primary animate-spin" size={40} />
              <p className="text-secondary text-[14px] font-black">
                Loading Knowledge Base...
              </p>
            </div>
          ) : questions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {questions.slice(0, visibleCount).map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
              <p className="text-secondary font-medium text-lg">
                {searchQuery
                  ? `No matches found for "${searchQuery}"`
                  : "The feed is empty. Be the pioneer!"}
              </p>
              <button
                onClick={handleAskQuestionClick}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Start a discussion
              </button>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!loading && questions.length > visibleCount && (
          <div className="flex justify-center pt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="group flex items-center gap-3 text-secondary hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all py-5 px-12 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-primary/50"
            >
              Discover More Questions
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QAHome;