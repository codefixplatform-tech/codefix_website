import { useEffect, useState } from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ProtectedRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const context = useOutletContext();

  useEffect(() => {
    // Current session check karein
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Agar session change ho (logout ho jaye) toh update karein
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  }

  // Agar user login nahi hai toh home page par bhej do
  return session ? <Outlet context={context} /> : <Navigate to="/" />;
};

export default ProtectedRoute;