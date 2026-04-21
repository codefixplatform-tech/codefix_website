import React from "react";
import Navbar from "../components/LandingPage/Navbar";
import Footer from "../components/LandingPage/Footer";
import AIFloatingButton from "../components/AI/AIFloatingButton";
import { Outlet } from "react-router-dom"; // Outlet import karo

const LandingLayout = ({ user, loading }) => {
  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 selection:text-primary">
      <Navbar user={user} loading={loading} />

      <main className="relative z-10 pt-16"> {/* padding top taake navbar ke peeche na chhupay */}
        <Outlet /> {/* Yahan Hero, About, ya Contact render honge */}
      </main>

      <Footer />
      <AIFloatingButton />

      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>
    </div>
  );
};

export default LandingLayout;