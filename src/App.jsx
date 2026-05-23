import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";

// Pages & Components imports
import LandingLayout from "./layouts/LandingLayout";
import About from "./components/LandingPage/About";
import Features from "./components/LandingPage/Features";
import Home from "./components/LandingPage/Home";
import Contact from "./components/LandingPage/Contact";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import QAHome from "./pages/QA/QAHome";
import QuestionDetail from "./pages/QA/QuestionDetail";
import AskQuestion from "./pages/QA/AskQuestion";
import ProfileSettings from "./pages/Dashboard/ProfileSettings";
import ScrollToTop from "./components/ScrollToTop";
import Tools from "./components/LandingPage/Tools";
import DevUtilities from "./pages/Dev Tools/DevUtilities";
import FileUpload from "./pages/Coonverter tools/FileUpload";
import DevToolProcessor from "./pages/Dev Tools/DevToolProcessor";
import MyActivity from "./pages/Dashboard/MyActivity";
import AccountPreference from "./pages/Dashboard/AccountPreference";
import Privacy from "./pages/Legal/Privacy";
import Terms from "./pages/Legal/Terms";
import NotFound from "./pages/NotFound";

// AI Components
import AIChatLayout from "./components/AI/AIChatLayout";

const AnimatedRoutes = ({ user, loading }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
           {/* Logo Area */}
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-10"
           >
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl border border-slate-800">
                <span className="font-bold text-2xl font-syne">C</span>
              </div>
              <span className="text-4xl font-bold font-syne tracking-tighter text-slate-900">Codefix</span>
           </motion.div>

           {/* Loading Bar */}
           <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
              <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "200%" }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
           </div>
           
           <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-[10px] font-black uppercase tracking-[4px] text-slate-400"
           >
              Initializing Platform...
           </motion.p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        {/* 🔓 Public Website Routes (Wrapped with Landing Layout) */}
        <Route path="/" element={<LandingLayout user={user} loading={loading} />}>
          <Route
            index
            element={
              <PageTransition key={location.pathname}>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="about"
            element={
              <PageTransition key={location.pathname}>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="features"
            element={
              <PageTransition key={location.pathname}>
                <Features />
              </PageTransition>
            }
          />
          <Route
            path="contact"
            element={
              <PageTransition key={location.pathname}>
                <Contact />
              </PageTransition>
            }
          />
          <Route
            path="tools"
            element={
              <PageTransition key={location.pathname}>
                <Tools />
              </PageTransition>
            }
          />
          <Route
            path="tools/:toolId"
            element={
              <PageTransition key={location.pathname}>
                <FileUpload />
              </PageTransition>
            }
          />
          <Route
            path="dev-utilities"
            element={
              <PageTransition key={location.pathname}>
                <DevUtilities />
              </PageTransition>
            }
          />
          <Route
            path="dev-utilities/:toolId"
            element={
              <PageTransition key={location.pathname}>
                <DevToolProcessor />
              </PageTransition>
            }
          />
          <Route
            path="questions"
            element={
              <PageTransition key={location.pathname}>
                <QAHome />
              </PageTransition>
            }
          />
          <Route
            path="questions/:id"
            element={
              <PageTransition key={location.pathname}>
                <QuestionDetail />
              </PageTransition>
            }
          />
          <Route
            path="questions/ask"
            element={
              <PageTransition key={location.pathname}>
                <AskQuestion />
              </PageTransition>
            }
          />
          <Route
            path="privacy"
            element={
              <PageTransition key={location.pathname}>
                <Privacy />
              </PageTransition>
            }
          />
          <Route
            path="terms"
            element={
              <PageTransition key={location.pathname}>
                <Terms />
              </PageTransition>
            }
          />
        </Route>

        {/* 🔐 Auth Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PageTransition key={location.pathname}>
                <Login />
              </PageTransition>
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PageTransition key={location.pathname}>
                <Signup />
              </PageTransition>
            )
          }
        />

        {/* 🌏 Dashboard Routes (Hybrid: Public/Private) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route
              index
              element={
                <PageTransition key={location.pathname}>
                  <DashboardHome />
                </PageTransition>
              }
            />
            <Route
              path="profile"
              element={
                <PageTransition key={location.pathname}>
                  <ProfileSettings />
                </PageTransition>
              }
            />
            <Route
              path="activity"
              element={
                <PageTransition key={location.pathname}>
                  <MyActivity />
                </PageTransition>
              }
            />
            <Route
              path="preferences"
              element={
                <PageTransition key={location.pathname}>
                  <AccountPreference />
                </PageTransition>
              }
            />
            <Route
              path="qa/ask"
              element={
                <PageTransition key={location.pathname}>
                  <AskQuestion />
                </PageTransition>
              }
            />
            <Route
              path="tools"
              element={
                <PageTransition key={location.pathname}>
                  <Tools />
                </PageTransition>
              }
            />
            <Route
              path="tools/:toolId"
              element={
                <PageTransition key={location.pathname}>
                  <FileUpload />
                </PageTransition>
              }
            />
            <Route
              path="questions"
              element={
                <PageTransition key={location.pathname}>
                  <QAHome />
                </PageTransition>
              }
            />
            <Route
              path="questions/:id"
              element={
                <PageTransition key={location.pathname}>
                  <QuestionDetail />
                </PageTransition>
              }
            />
            <Route
              path="dev-utilities"
              element={
                <PageTransition key={location.pathname}>
                  <DevUtilities />
                </PageTransition>
              }
            />
            <Route
              path="dev-utilities/:toolId"
              element={
                <PageTransition key={location.pathname}>
                  <DevToolProcessor />
                </PageTransition>
              }
            />
          </Route>
        </Route>

        <Route
          path="/ai-assistant"
          element={
            <PageTransition key={location.pathname} noSlide={true}>
              <AIChatLayout user={user} />
            </PageTransition>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// 🏠 Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (error.message.includes("refresh_token") || error.status === 400) {
             await supabase.auth.signOut();
             setUser(null);
          }
        } else {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error("Unexpected auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="bg-background min-h-screen selection:bg-primary selection:text-white">
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#121214",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "14px",
              fontWeight: "600",
            },
          }}
        />

        <ScrollToTop />
        <AnimatedRoutes user={user} loading={loading} />
      </div>
    </Router>
  );
}

export default App;