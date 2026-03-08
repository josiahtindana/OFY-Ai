import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle, Loader2, ArrowRight, PenTool } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

interface EssayResult {
  overall_feedback: string;
  improved_draft: string;
  key_changes: string[];
}

export function EssayAssistant() {
  const [opportunityText, setOpportunityText] = useState('');
  const [draftText, setDraftText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [result, setResult] = useState<EssayResult | null>(null);
  const [error, setError] = useState('');

  const handleImprove = async () => {
    if (!opportunityText || !draftText) {
      setError('Please provide both the opportunity description and your draft.');
      return;
    }

    setIsImproving(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/ai/improve-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunity_text: opportunityText,
          draft_text: draftText,
          instructions: instructions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to improve essay');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while improving your essay. Please try again.');
      console.error(err);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Essay Assistant</h2>
          <p className="text-slate-500 mt-1">Refine your Statement of Purpose, Motivation Letter, or Scholarship Essay.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                1. Target Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                placeholder="Paste the scholarship or fellowship requirements here..."
                value={opportunityText}
                onChange={(e) => setOpportunityText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-indigo-500" />
                2. Your Draft
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                placeholder="Paste your current draft here..."
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
              />
              
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-slate-700">Specific Instructions (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="e.g., Make it more persuasive, focus on my leadership skills..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <div className="mt-6 flex items-center justify-end">
                <Button 
                  onClick={handleImprove} 
                  disabled={isImproving || !opportunityText || !draftText}
                  className="min-w-[160px] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-200"
                >
                  {isImproving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Improving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Improve Draft
                    </>
                  )}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </CardContent>
          </Card>
        </div>

        <div>
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <Card className="flex-1 flex flex-col border-indigo-100 shadow-md shadow-indigo-50">
                <CardHeader className="bg-indigo-50/50 border-b border-indigo-50 rounded-t-2xl">
                  <CardTitle className="text-indigo-900 flex items-center justify-between">
                    <span>Improved Draft</span>
                    <Button variant="outline" size="sm" className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      Copy Text
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 overflow-y-auto max-h-[500px]">
                  <div className="prose prose-sm prose-indigo max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {result.improved_draft}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 text-white border-0">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Overall Feedback
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{result.overall_feedback}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Key Changes Made
                    </h4>
                    <ul className="space-y-2">
                      {result.key_changes.map((change, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-300">
                          <ArrowRight className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                <Sparkles className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Polish Your Essay?</h3>
              <p className="text-slate-500 max-w-md leading-relaxed">
                Provide your draft and the opportunity description. Our AI will analyze your text, enhance the narrative flow, and ensure it perfectly aligns with the opportunity's goals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
