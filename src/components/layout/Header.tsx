import React from 'react';
import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back, Alex</h1>
        <p className="text-sm text-slate-500">Here's what's happening with your applications today.</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold border border-indigo-200">
          A
        </div>
      </div>
    </header>
  );
}
