import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import { supabase } from "../lib/supabase";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Centralized Profile Fetching ---
  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url') 
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            setProfile({ 
              full_name: data.full_name, 
              avatar_url: data.avatar_url, 
              email: user.email 
            });
          } else {
            setProfile({
              full_name: user.user_metadata?.full_name || "Developer",
              avatar_url: user.user_metadata?.avatar_url,
              email: user.email
            });
          }
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-[#0B0E14]
        lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Sidebar closeMenu={() => setSidebarOpen(false)} profile={profile} loading={loading} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Topbar onMenuClick={() => setSidebarOpen(true)} profile={profile} loading={loading} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet context={{ profile, loading }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
