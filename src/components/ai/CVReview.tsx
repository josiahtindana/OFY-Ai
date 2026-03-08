import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

interface ReviewResult {
  match_score: number;
  skills_alignment: {
    matched_skills: string[];
    missing_skills: string[];
  };
  experience_alignment: {
    strengths: string;
    weaknesses: string;
  };
  ats_compatibility_score: number;
  section_suggestions: Array<{
    section: string;
    current_text: string;
    suggested_rewrite: string;
    reason: string;
  }>;
  ethical_guidance: string;
}

export function CVReview() {
  const [opportunityText, setOpportunityText] = useState('');
  const [cvText, setCvText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!opportunityText || !cvText) {
      setError('Please provide both the opportunity description and your CV text.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/ai/review-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunity_text: opportunityText,
          cv_text: cvText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze CV');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing your CV. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI CV Review</h2>
          <p className="text-slate-500 mt-1">Tailor your CV to a specific opportunity using AI analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Target Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                placeholder="Paste the job description, fellowship requirements, or scholarship details here..."
                value={opportunityText}
                onChange={(e) => setOpportunityText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Your CV</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                placeholder="Paste your CV text here (PDF/DOCX upload coming soon)..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
              
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-slate-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  AI does not guarantee selection.
                </p>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !opportunityText || !cvText}
                  className="min-w-[140px]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze CV'
                  )}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </CardContent>
          </Card>
        </div>

        <div>
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-indigo-50 border-indigo-100">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2">Match Score</span>
                    <div className="text-5xl font-bold text-indigo-900">{result.match_score}%</div>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">ATS Score</span>
                    <div className="text-5xl font-bold text-emerald-900">{result.ats_compatibility_score}%</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Alignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.skills_alignment.matched_skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.skills_alignment.missing_skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rewrite Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.section_suggestions.map((suggestion, i) => (
                    <div key={i} className="space-y-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{suggestion.section}</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <span className="text-xs text-slate-500 block mb-1">Current:</span>
                          <p className="text-sm text-slate-700 line-through opacity-70">{suggestion.current_text}</p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                          <span className="text-xs text-indigo-500 block mb-1">Suggested:</span>
                          <p className="text-sm text-indigo-900 font-medium">{suggestion.suggested_rewrite}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-2">Why: {suggestion.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="bg-slate-900 rounded-2xl p-6 text-white">
                <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Ethical Guidance</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{result.ethical_guidance}</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Awaiting Analysis</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Provide your target opportunity and CV text, then click analyze to get detailed, structured feedback.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
