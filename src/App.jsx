import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
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

// AI Components
import AIChatLayout from "./components/AI/AIChatLayout";

const AnimatedRoutes = ({ user, loading }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🔓 Public Website Routes (Wrapped with Landing Layout) */}
        <Route path="/" element={<LandingLayout user={user} loading={loading} />}>
          <Route
            index
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="features"
            element={
              <PageTransition>
                <Features />
              </PageTransition>
            }
          />
          <Route
            path="contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />
          <Route
            path="tools"
            element={
              <PageTransition>
                <Tools />
              </PageTransition>
            }
          />
          
          {/* 🛠️ Dynamic File Upload Route */}
          <Route
            path="tools/:toolId"
            element={
              <PageTransition>
                <FileUpload />
              </PageTransition>
            }
          />
          {/* 🛠️ Dev Utilities Route */}
          <Route
            path="dev-utilities"
            element={
              <PageTransition>
                <DevUtilities />
              </PageTransition>
            }
          />
          <Route
            path="dev-utilities/:toolId"
            element={
              <PageTransition>
                <DevToolProcessor />
              </PageTransition>
            }
          />
          <Route
            path="questions"
            element={
              <PageTransition>
                <QAHome />
              </PageTransition>
            }
          />
          <Route
            path="questions/:id"
            element={
              <PageTransition>
                <QuestionDetail />
              </PageTransition>
            }
          />
        </Route>

        {/* 🔐 Auth Routes */}
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Signup />
            </PageTransition>
          }
        />

        {/* 🌏 Dashboard Routes (Hybrid: Public/Private) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route
              index
              element={
                <PageTransition>
                  <DashboardHome />
                </PageTransition>
              }
            />
            <Route
              path="profile"
              element={
                <PageTransition>
                  <ProfileSettings />
                </PageTransition>
              }
            />
            <Route
              path="activity"
              element={
                <PageTransition>
                  <MyActivity />
                </PageTransition>
              }
            />
            
            <Route
              path="qa/ask"
              element={
                <PageTransition>
                  <AskQuestion />
                </PageTransition>
              }
            />
            
            {/* 🛠️ Dashboard Tools (Inside Sidebar, No Landing Navbar/Footer) */}
            <Route
              path="tools"
              element={
                <PageTransition>
                  <Tools />
                </PageTransition>
              }
            />
            <Route
              path="tools/:toolId"
              element={
                <PageTransition>
                  <FileUpload />
                </PageTransition>
              }
            />

            {/* 💬 Dashboard Community (Integrated Feed) */}
            <Route
              path="questions"
              element={
                <PageTransition>
                  <QAHome />
                </PageTransition>
              }
            />
            <Route
              path="questions/:id"
              element={
                <PageTransition>
                  <QuestionDetail />
                </PageTransition>
              }
            />

            {/* 🛠️ Dashboard Dev Tools */}
            <Route
              path="dev-utilities"
              element={
                <PageTransition>
                  <DevUtilities />
                </PageTransition>
              }
            />
            <Route
              path="dev-utilities/:toolId"
              element={
                <PageTransition>
                  <DevToolProcessor />
                </PageTransition>
              }
            />
          </Route>
        </Route>

        {/* 🤖 Professional AI Assistant Route */}
        <Route
          path="/ai-assistant"
          element={
            <PageTransition>
              <AIChatLayout user={user} />
            </PageTransition>
          }
        />

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

// 🏠 Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session check on mount
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (error.message.includes("refresh_token") || error.status === 400) {
             console.warn("Auth session recovery failed, signing out to reset state...");
             await supabase.auth.signOut();
             setUser(null);
          } else {
             console.error("Auth session error:", error);
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        // Clear any local state if needed
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="bg-background min-h-screen selection:bg-primary selection:text-white">
        {/* Notifications */}
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