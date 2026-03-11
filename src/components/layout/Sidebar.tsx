import React from 'react';
import { Briefcase, FileText, Search, User, LogOut, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onSignOut }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'search', label: 'Opportunities', icon: Search },
    { id: 'cv-review', label: 'CV Review', icon: FileText },
    { id: 'essay', label: 'Essay Assistant', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">OFY AI</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium text-slate-400 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
