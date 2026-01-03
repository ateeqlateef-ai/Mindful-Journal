import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types.ts';
import { supabase } from './services/supabase.ts';

// Pages
import { Landing } from './pages/Landing.tsx';
import { Login } from './pages/Login.tsx';
import { Signup } from './pages/Signup.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { EntryEditor } from './pages/EntryEditor.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || 'User'
            });
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 'User'
          });
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          <p className="text-slate-400 text-sm font-medium">Preparing your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" replace /> : <Signup />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/editor/:id" 
          element={user ? <EntryEditor user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;