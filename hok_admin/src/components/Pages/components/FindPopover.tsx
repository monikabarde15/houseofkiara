/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FindPopover (Spec §3.4 & Screen 03)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, FileText, Hash, HelpCircle, ArrowRight } from 'lucide-react';
import { SEED_PAGES, SEED_FIGURES } from '../data';

interface FindPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onSelectPage?: (slug: string) => void;
}

const POPULAR_SEARCHES = [
  'free delivery',
  'rental window',
  'security deposit',
  '48 hours',
  'Indore',
  'terms'
];

export const FindPopover: React.FC<FindPopoverProps> = ({
  isOpen,
  onClose,
  onSelectFigure,
  onSelectPage
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle Escape and outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  // Search results calculation (§3.4)
  const results = useMemo(() => {
    if (cleanQuery.length < 2) {
      return { pages: [], figures: [], questions: [], words: [] };
    }

    const matchedPages = SEED_PAGES.filter(
      p => p.title.toLowerCase().includes(cleanQuery) || p.slug.toLowerCase().includes(cleanQuery)
    ).slice(0, 8);

    const matchedFigures = SEED_FIGURES.filter(
      f =>
        f.label.toLowerCase().includes(cleanQuery) ||
        f.description.toLowerCase().includes(cleanQuery) ||
        f.key.toLowerCase().includes(cleanQuery) ||
        f.displayValue.toLowerCase().includes(cleanQuery)
    ).slice(0, 10);

    const matchedQuestions = cleanQuery.length >= 3
      ? [
          {
            pageName: 'Refund & Cancellation Policy',
            pageSlug: 'refunds',
            title: 'What if I cancel within 7 days of my rental start date?'
          },
          {
            pageName: 'Help & FAQs',
            pageSlug: 'faqs',
            title: 'How does the security deposit get refunded?'
          },
          {
            pageName: 'Care, Cleaning & Damage Policy',
            pageSlug: 'care-policy',
            title: 'What counts as normal wear and tear versus damage?'
          }
        ].filter(q => q.title.toLowerCase().includes(cleanQuery) || cleanQuery.includes('deposit') || cleanQuery.includes('cancel'))
      : [];

    const matchedWords = cleanQuery.length >= 3
      ? [
          {
            pageName: 'Shipping & Delivery Policy',
            pageSlug: 'shipping-policy',
            sentence: 'Standard delivery is free on orders of ₹5,000 or more across India.'
          }
        ].filter(w => w.sentence.toLowerCase().includes(cleanQuery) || cleanQuery.includes('delivery'))
      : [];

    return {
      pages: matchedPages,
      figures: matchedFigures,
      questions: matchedQuestions,
      words: matchedWords
    };
  }, [cleanQuery]);

  const totalResultsCount =
    results.pages.length + results.figures.length + results.questions.length + results.words.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        ref={containerRef}
        className="w-full max-w-2xl bg-[#fffefb] rounded-[8px] shadow-2xl border border-[#d9ccb6] overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#e6dccb] gap-3 bg-[#fffefb]">
          <Search className="w-5 h-5 text-[#8a6a36] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Find a page, an answer or a figure"
            className="flex-1 bg-transparent text-sm text-[#1a1612] placeholder-[#8a7f72] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#6e6358] hover:text-[#1a1612] p-1 rounded hover:bg-[#efe7db] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-[#f7f2ea] text-[#6e6358] px-1.5 py-0.5 rounded border border-[#d9ccb6]">
            ESC to close
          </kbd>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1">
          {/* STATE A: Empty Query -> Show Popular Searches */}
          {cleanQuery.length < 2 && (
            <div>
              <span className="block text-xs font-semibold text-[#8a7f72] uppercase tracking-wider mb-2.5">
                Popular searches
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map(item => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 rounded-[6px] text-xs bg-[#f7f2ea] hover:bg-[#efe7db] border border-[#d9ccb6] text-[#1a1612] transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STATE B: Typed Query -> Active Search Results (Immediately at the top) */}
          {cleanQuery.length >= 2 && totalResultsCount > 0 && (
            <div className="space-y-4">
              {/* 1. Pages Group */}
              {results.pages.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-[#8a6a36] uppercase tracking-wider mb-2">
                    Pages ({results.pages.length})
                  </span>
                  <div className="space-y-1">
                    {results.pages.map(page => (
                      <button
                        key={page.slug}
                        onClick={() => {
                          onSelectPage?.(page.slug);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[#f7f2ea] border border-transparent hover:border-[#e6dccb] transition-colors text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-[#8a6a36]" />
                          <div>
                            <span className="text-xs font-semibold text-[#1a1612] group-hover:text-[#8a6a36]">
                              {page.title}
                            </span>
                            <span className="block text-[11px] font-mono text-[#8a7f72]">
                              {page.address}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8a7f72] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Figures Group */}
              {results.figures.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-[#8a6a36] uppercase tracking-wider mb-2">
                    Figures ({results.figures.length})
                  </span>
                  <div className="space-y-1">
                    {results.figures.map(fig => (
                      <button
                        key={fig.key}
                        onClick={() => {
                          onSelectFigure?.(fig.key);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[#f7f2ea] border border-transparent hover:border-[#e6dccb] transition-colors text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Hash className="w-4 h-4 text-[#c9a96e]" />
                          <div>
                            <span className="text-xs font-semibold text-[#1a1612] group-hover:text-[#8a6a36]">
                              {fig.label}
                            </span>
                            <span className="block text-[11px] text-[#6e6358] truncate max-w-[420px]">
                              {fig.description}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-xs font-semibold text-[#1a1612]">
                            {fig.displayValue}
                          </span>
                          <span className="block text-[10px] text-[#8a7f72]">
                            {fig.reachCount} places
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Questions & Clauses */}
              {results.questions.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-[#8a6a36] uppercase tracking-wider mb-2">
                    Questions & clauses ({results.questions.length})
                  </span>
                  <div className="space-y-1">
                    {results.questions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelectPage?.(q.pageSlug);
                          onClose();
                        }}
                        className="w-full flex items-start gap-2.5 p-2.5 rounded-[6px] hover:bg-[#f7f2ea] border border-transparent hover:border-[#e6dccb] transition-colors text-left cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-[#8a7f72] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-[#1a1612] font-medium leading-snug">
                            {q.title}
                          </span>
                          <span className="block text-[11px] text-[#8a6a36] mt-0.5">
                            {q.pageName}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE C: Query with 0 matches */}
          {cleanQuery.length >= 2 && totalResultsCount === 0 && (
            <div className="py-8 text-center text-xs text-[#6e6358]">
              <p>Nothing on any page matches "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPopover;
