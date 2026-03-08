import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CVReview } from './components/ai/CVReview';
import { OpportunitySearch } from './components/opportunities/OpportunitySearch';
import { Dashboard } from './components/dashboard/Dashboard';
import { Profile } from './components/profile/Profile';
import { EssayAssistant } from './components/ai/EssayAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
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
