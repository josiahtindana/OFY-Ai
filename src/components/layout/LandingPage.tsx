import React from 'react';
import { Sparkles, ArrowRight, Briefcase, FileText, Search } from 'lucide-react';
import { Button } from '../common/Button';

interface LandingPageProps {
  onSignIn: () => void;
}

export function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">OFY AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onSignIn}>Log in</Button>
          <Button onClick={onSignIn}>Get Started</Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100">
            <Sparkles className="w-4 h-4" />
            <span>Your Personal AI Career Assistant</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            Land your dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">opportunity</span> faster.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover exclusive youth opportunities, tailor your CV with AI, and craft winning essays that stand out to recruiters and selection committees.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={onSignIn} className="w-full sm:w-auto text-lg px-8 h-14 bg-indigo-600 hover:bg-indigo-700">
              Start for free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={onSignIn} className="w-full sm:w-auto text-lg px-8 h-14">
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 text-left">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Search</h3>
            <p className="text-slate-600 leading-relaxed">Find the perfect scholarships, fellowships, and jobs tailored to your profile from opportunitiesforyouth.org.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI CV Review</h3>
            <p className="text-slate-600 leading-relaxed">Get instant, actionable feedback on your CV. Match your skills perfectly to the opportunity requirements.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Essay Assistant</h3>
            <p className="text-slate-600 leading-relaxed">Transform your rough drafts into compelling personal statements with our AI-powered essay improver.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
