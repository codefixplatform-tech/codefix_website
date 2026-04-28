import React from 'react';
import SEO from '../../components/SEO';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <SEO title="Privacy Policy" description="Privacy policy for the Codefix platform." />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-secondary space-y-6">
          <p>Last Updated: April 27, 2026</p>
          <p>At Codefix, we take your privacy seriously. This policy explains how we handle your data.</p>
          <h2 className="text-2xl font-semibold text-white mt-8">1. Client-Side Processing</h2>
          <p>Codefix is designed with privacy as a core principle. Our document conversion and developer utilities run entirely on your local machine using your browser's processing power. Your files never touch our servers.</p>
          <h2 className="text-2xl font-semibold text-white mt-8">2. Data We Collect</h2>
          <p>We only collect essential data required for authentication and community features (Q&A Hub). This includes your name, email address, and profile information if you choose to create an account.</p>
          <h2 className="text-2xl font-semibold text-white mt-8">3. Security</h2>
          <p>We use industry-standard security measures, including Supabase's secure authentication and Row-Level Security (RLS) to protect your profile data.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
