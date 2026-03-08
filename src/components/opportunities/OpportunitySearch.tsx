import React, { useState } from 'react';
import { Search, ExternalLink, MapPin, Calendar, DollarSign, Tag, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';

interface Opportunity {
  title: string;
  url: string;
  category: string;
  country: string;
  funding_type: string;
  deadline: string;
  description: string;
}

export function OpportunitySearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Opportunity[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch('/api/opportunities/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Opportunity Search</h2>
        <p className="text-slate-500 mt-1">Find scholarships, fellowships, and jobs exclusively from opportunitiesforyouth.org</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="e.g., Fully funded masters scholarships in Europe for public health..."
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" disabled={isSearching || !query.trim()} className="min-w-[140px]">
          {isSearching ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Scouring opportunitiesforyouth.org for the best matches...</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
            <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No opportunities found</h3>
            <p>Try adjusting your search terms or making them more general.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((opp, i) => (
              <Card key={i} className="hover:border-indigo-200 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div>
                        <a href={opp.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                          {opp.title}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                        </a>
                        <p className="text-slate-600 mt-2 text-sm leading-relaxed">{opp.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 pt-2">
                        {opp.category && opp.category !== 'Not specified' && (
                          <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                            <Tag className="w-3.5 h-3.5 mr-1.5" />
                            {opp.category}
                          </span>
                        )}
                        {opp.country && opp.country !== 'Not specified' && (
                          <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                            {opp.country}
                          </span>
                        )}
                        {opp.funding_type && opp.funding_type !== 'Not specified' && (
                          <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                            <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                            {opp.funding_type}
                          </span>
                        )}
                        {opp.deadline && opp.deadline !== 'Not specified' && (
                          <span className="inline-flex items-center text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            Deadline: {opp.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
