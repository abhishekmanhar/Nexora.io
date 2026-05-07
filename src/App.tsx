import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { JobBoard } from './pages/JobBoard';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { AtsChecker } from './pages/AtsChecker';
import { LandingPage } from './pages/LandingPage';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuthStore, Role } from './store/useAuthStore';
import { UserCircle, LogOut } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Chatbot } from './components/Chatbot';

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="url(#paint0_linear)" />
      {/* Briefcase Handle */}
      <path d="M14 12V10C14 8.89543 14.8954 8 16 8H20C21.1046 8 22 8.89543 22 10V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Briefcase Body */}
      <rect x="8" y="12" width="20" height="15" rx="3" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Connection/Network dot to represent "Nexora" network */}
      <circle cx="18" cy="19.5" r="3" fill="white" />
      <path d="M8 17.5L15 19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 17.5L21 19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981"/>
          <stop offset="1" stopColor="#047857"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function Navigation() {
  const location = useLocation();
  const { user, role, setRole } = useAuthStore();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'candidate',
          createdAt: new Date().toISOString()
        });
        setRole('candidate');
      } else {
        setRole(userSnap.data().role as Role);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md print:hidden">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900">
            <Logo />
            Nexora.io
          </Link>
          
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-600">
            <Link 
              to="/jobs" 
              className={`hover:text-zinc-900 transition-colors ${location.pathname === '/jobs' ? 'text-zinc-900' : ''}`}
            >
              Find Jobs
            </Link>
            {(role === 'candidate' || role === 'guest') && (
              <>
                <Link 
                  to="/resume" 
                  className={`hover:text-zinc-900 transition-colors ${location.pathname === '/resume' ? 'text-zinc-900' : ''}`}
                >
                  Resume Builder
                </Link>
                <Link 
                  to="/ats-checker" 
                  className={`hover:text-zinc-900 transition-colors ${location.pathname === '/ats-checker' ? 'text-zinc-900' : ''}`}
                >
                  ATS Checker
                </Link>
              </>
            )}
            {role === 'recruiter' && (
              <Link 
                to="/recruiter" 
                className={`hover:text-zinc-900 transition-colors ${location.pathname === '/recruiter' ? 'text-zinc-900' : ''}`}
              >
                ATS Dashboard
              </Link>
            )}
            {role === 'admin' && (
              <Link 
                to="/admin" 
                className={`hover:text-zinc-900 transition-colors ${location.pathname === '/admin' ? 'text-zinc-900' : ''}`}
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserCircle size={32} className="text-zinc-400" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-900 leading-none">{user.displayName}</span>
                  <span className="text-xs text-zinc-500 capitalize">{role}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="h-9 px-4 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const { setUser, setRole, setAuthReady } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role as Role);
        }
      } else {
        setRole('guest');
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [setUser, setRole, setAuthReady]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-500/30">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/resume" element={<ResumeBuilder />} />
            <Route path="/ats-checker" element={<AtsChecker />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}
