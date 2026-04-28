import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-white mb-8">Oops! Page not found.</h2>
      <p className="text-secondary mb-12 max-w-md">
        The link you followed may be broken, or the page may have been removed. 
        Let's get you back to the home page.
      </p>
      <Link to="/">
        <button className="bg-primary hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-semibold transition-all shadow-xl shadow-primary/20">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
