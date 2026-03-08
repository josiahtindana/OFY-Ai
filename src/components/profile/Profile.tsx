import React, { useState } from 'react';
import { User, Mail, Settings, Save, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

export function Profile() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    careerGoal: 'Public Health Professional',
    educationLevel: 'Master\'s Degree',
    targetCountries: 'Europe, North America',
  });

  const [preferences, setPreferences] = useState({
    tone: 'professional',
    feedbackStyle: 'detailed',
    focusAreas: 'impact, leadership',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Profile & Settings</h2>
          <p className="text-slate-500 mt-1">Manage your personal details and AI preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isSaved ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Primary Career Goal</label>
                <input
                  type="text"
                  value={profile.careerGoal}
                  onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="e.g., Data Scientist, Public Health Researcher"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Highest Education</label>
                  <select
                    value={profile.educationLevel}
                    onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  >
                    <option>High School</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>PhD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Regions</label>
                  <input
                    type="text"
                    value={profile.targetCountries}
                    onChange={(e) => setProfile({ ...profile, targetCountries: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="e.g., Europe, UK, USA"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-indigo-500" />
                AI Customization Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-slate-500 mb-4">
                Customize how the AI Assistant reviews your CVs and writes your essays.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preferred Writing Tone</label>
                  <select
                    value={preferences.tone}
                    onChange={(e) => setPreferences({ ...preferences, tone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="professional">Professional & Formal</option>
                    <option value="persuasive">Persuasive & Confident</option>
                    <option value="academic">Academic & Analytical</option>
                    <option value="storytelling">Storytelling & Empathetic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Feedback Style</label>
                  <select
                    value={preferences.feedbackStyle}
                    onChange={(e) => setPreferences({ ...preferences, feedbackStyle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="detailed">Detailed & Comprehensive</option>
                    <option value="concise">Concise & Actionable</option>
                    <option value="strict">Strict & Critical (High Standards)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Key Focus Areas (Comma separated)</label>
                  <input
                    type="text"
                    value={preferences.focusAreas}
                    onChange={(e) => setPreferences({ ...preferences, focusAreas: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="e.g., leadership, quantitative skills, social impact"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    The AI will prioritize highlighting these themes in your documents.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-0">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4 border-4 border-slate-800">
                {profile.fullName.charAt(0)}
              </div>
              <h3 className="text-xl font-bold">{profile.fullName}</h3>
              <p className="text-indigo-300 text-sm mb-6">{profile.careerGoal}</p>
              
              <div className="pt-6 border-t border-slate-800 space-y-3 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Plan</span>
                  <span className="font-medium text-emerald-400">Pro Tier</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tokens Used</span>
                  <span className="font-medium">12,450 / 50,000</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
