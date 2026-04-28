import React from 'react';
import SEO from '../../components/SEO';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <SEO title="Terms of Service" description="Terms of service for the Codefix platform." />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-secondary space-y-6">
          <p>Last Updated: April 27, 2026</p>
          <p>By using Codefix, you agree to these terms.</p>
          <h2 className="text-2xl font-semibold text-white mt-8">1. Acceptance of Terms</h2>
          <p>By accessing or using the Codefix platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          <h2 className="text-2xl font-semibold text-white mt-8">2. Use of Platform</h2>
          <p>Codefix provides tools for developers and productivity. You agree to use these tools responsibly and not for any illegal activities.</p>
          <h2 className="text-2xl font-semibold text-white mt-8">3. Limitation of Liability</h2>
          <p>The tools and services provided by Codefix are on an "as is" basis. We do not guarantee 100% accuracy in file conversions or AI responses.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
