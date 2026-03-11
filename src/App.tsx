import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CVReview } from './components/ai/CVReview';
import { OpportunitySearch } from './components/opportunities/OpportunitySearch';
import { Dashboard } from './components/dashboard/Dashboard';
import { Profile } from './components/profile/Profile';
import { EssayAssistant } from './components/ai/EssayAssistant';
import { LandingPage } from './components/layout/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    if (showAuthPage) {
      return (
        <AuthPage 
          onSignIn={() => {
            setShowAuthPage(false);
          }} 
          onBack={() => setShowAuthPage(false)}
        />
      );
    }
    return <LandingPage onSignIn={() => setShowAuthPage(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSignOut={async () => {
          await supabase.auth.signOut();
          setShowAuthPage(false);
        }} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'search' && <OpportunitySearch />}
          {activeTab === 'cv-review' && <CVReview />}
          {activeTab === 'essay' && <EssayAssistant />}
          {activeTab === 'profile' && <Profile />}
          
          {activeTab !== 'dashboard' && activeTab !== 'search' && activeTab !== 'cv-review' && activeTab !== 'essay' && activeTab !== 'profile' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Coming Soon</h2>
              <p className="text-slate-500">The {activeTab} module is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
