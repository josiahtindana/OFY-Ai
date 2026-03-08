import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { FileText, Search, Sparkles, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '../common/Button';

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const stats = [
    { label: 'CVs Reviewed', value: '12', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Essays Improved', value: '8', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Opportunities Found', value: '45', icon: Search, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Avg. Match Score', value: '84%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const recentActivities = [
    { id: 1, type: 'cv', title: 'Global Health Fellowship CV', date: '2 hours ago', score: 92 },
    { id: 2, type: 'essay', title: 'Masters in Public Health SOP', date: '1 day ago', score: null },
    { id: 3, type: 'search', title: 'Searched: "Fully funded masters Europe"', date: '2 days ago', score: null },
    { id: 4, type: 'cv', title: 'UNICEF Internship Application', date: '3 days ago', score: 78 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-1">Overview of your application progress and AI usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'cv' ? 'bg-indigo-100 text-indigo-600' :
                        activity.type === 'essay' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {activity.type === 'cv' && <FileText className="w-5 h-5" />}
                        {activity.type === 'essay' && <Sparkles className="w-5 h-5" />}
                        {activity.type === 'search' && <Search className="w-5 h-5" />}
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-900">{activity.title}</h5>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    {activity.score && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-slate-500 uppercase">Score</span>
                        <span className={`font-bold ${activity.score >= 90 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                          {activity.score}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-0">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to improve your next application?</h3>
              <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
                Use our AI tools to tailor your CV or perfect your personal statement for your next big opportunity.
              </p>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-between bg-white text-indigo-900 hover:bg-indigo-50"
                  onClick={() => setActiveTab('cv-review')}
                >
                  Review a CV
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-white/30 text-white hover:bg-white/10"
                  onClick={() => setActiveTab('essay')}
                >
                  Draft an Essay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
