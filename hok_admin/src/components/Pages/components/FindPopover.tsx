/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FindPopover (Spec §3.4 Instant Multi-Group Search)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Hash, HelpCircle, FileText, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { SEED_FIGURES, SEED_PAGES } from '../data';

interface SearchResultItem {
  id: string;
  type: 'page' | 'figure' | 'clause' | 'word';
  title: string;
  subtitle: string;
  badge?: string;
  targetSlug?: string;
  figureKey?: string;
  surroundingWords?: string;
}

interface FindPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onSelectPage?: (slug: string) => void;
}

// Popular search queries per Spec §3.4 & §8
const POPULAR_SEARCH_CHIPS = [
  'Free delivery from',
  'Refunds reach the customer',
  'Deposit due',
  'Terms & Conditions',
  'Help & FAQs',
  'WhatsApp number',
  'Grievance Officer',
  'Standard rental window'
];

export const FindPopover: React.FC<FindPopoverProps> = ({
  isOpen,
  onClose,
  onSelectFigure,
  onSelectPage
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard events (Esc to close, ArrowDown/Up to navigate, Enter to choose)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
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

  // Spec §3.4 Search Engine:
  // Starts after 2 characters; words on pages searched from 3 characters.
  // Result groups ordered strictly according to Table in §3.4:
  // 1. Pages (names & addresses)
  // 2. Figures (names, descriptions, page file names, values, reach count)
  // 3. Questions & clauses (questions on every page, Terms clauses, up to 12)
  // 4. Words on pages (any sentence, up to 10)
  const { results, flatList, totalCount } = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      return {
        results: { pages: [], figures: [], clauses: [], words: [] },
        flatList: [],
        totalCount: 0
      };
    }

    // 1. Pages matching
    const matchingPages: SearchResultItem[] = SEED_PAGES.filter(
      p =>
        p.title.toLowerCase().includes(trimmed) ||
        p.slug.toLowerCase().includes(trimmed) ||
        (p.builtFrom && p.builtFrom.toLowerCase().includes(trimmed))
    ).slice(0, 8).map(p => ({
      id: `page_${p.slug}`,
      type: 'page',
      title: p.title,
      subtitle: `${p.slug} · ${p.version}`,
      badge: p.group === 'policies' ? 'Policy' : p.group === 'content-help' ? 'Content' : p.group === 'system' ? 'System' : 'Not built',
      targetSlug: p.slug
    }));

    // 2. Figures matching (names, descriptions, values, keys, reach count)
    const matchingFigures: SearchResultItem[] = SEED_FIGURES.filter(
      f =>
        f.label.toLowerCase().includes(trimmed) ||
        f.key.toLowerCase().includes(trimmed) ||
        String(f.value).toLowerCase().includes(trimmed) ||
        f.displayValue.toLowerCase().includes(trimmed) ||
        (f.notes && f.notes.toLowerCase().includes(trimmed)) ||
        f.subject.toLowerCase().includes(trimmed)
    ).slice(0, 10).map(f => ({
      id: `fig_${f.key}`,
      type: 'figure',
      title: f.label,
      subtitle: `${f.displayValue} · Key: ${f.key} · Reach: ${f.reachCount} places`,
      badge: f.status,
      figureKey: f.key
    }));

    // 3. Questions & clauses matching (up to 12)
    const CLAUSE_CANDIDATES = [
      { id: 'q_rental_window', title: 'How long can I keep a rental piece?', subtitle: '/faqs · Question 1 · Standard 3 days window', slug: '/faqs' },
      { id: 'q_security_deposit', title: 'When is the security deposit returned?', subtitle: '/deposit-policy · Question 4 · 3 to 5 business days after inspection', slug: '/deposit-policy' },
      { id: 'q_cancel_booking', title: 'What if I cancel within 7 days of rental start?', subtitle: '/refunds · Question 4 · 70% refund before dispatch', slug: '/refunds' },
      { id: 'q_damage_accidents', title: 'What counts as normal wear versus damage?', subtitle: '/care-policy · Question 2 · Spills and restoration process', slug: '/care-policy' },
      { id: 'c_terms_definitions', title: 'Clause 1: Definitions and Interpretation', subtitle: '/terms · Clause 1 · Core service terminology', slug: '/terms' },
      { id: 'c_terms_deposit', title: 'Clause 6: Security Deposit and Inspection Protocol', subtitle: '/terms · Clause 6 · Pre-authorisation and release timeline', slug: '/terms' },
      { id: 'c_terms_grievance', title: 'Clause 18: Grievance Redressal and Compliance', subtitle: '/terms · Clause 18 · Statutory nodal officer details', slug: '/terms' },
      { id: 'q_payout_cycle', title: 'When do listers receive their rental payouts?', subtitle: '/seller-guidelines · Question 3 · 3 working days from inspection', slug: '/seller-guidelines' }
    ];

    const matchingClauses: SearchResultItem[] = CLAUSE_CANDIDATES.filter(
      c => c.title.toLowerCase().includes(trimmed) || c.subtitle.toLowerCase().includes(trimmed)
    ).slice(0, 12).map(c => ({
      id: c.id,
      type: 'clause',
      title: c.title,
      subtitle: c.subtitle,
      targetSlug: c.slug
    }));

    // 4. Words on pages (searched from 3 characters, up to 10)
    let matchingWords: SearchResultItem[] = [];
    if (trimmed.length >= 3) {
      const WORD_SNIPPETS = [
        { id: 'w_delivery_free', title: 'Orders of ₹5,000 or more ship free of delivery charges.', subtitle: '/shipping-policy · Opening paragraph', slug: '/shipping-policy' },
        { id: 'w_care_zardozi', title: 'Zardozi and delicate embroidery require specialist dry cleaning.', subtitle: '/care-policy · Section 2', slug: '/care-policy' },
        { id: 'w_authenticity', title: 'Authenticity guarantee backed by multi-point studio inspection.', subtitle: '/terms · Clause 9', slug: '/terms' },
        { id: 'w_hours_note', title: 'Customer support operates seven days a week, 10 AM to 8 PM IST.', subtitle: '/contact · Hero card', slug: '/contact' }
      ];

      matchingWords = WORD_SNIPPETS.filter(
        w => w.title.toLowerCase().includes(trimmed) || w.subtitle.toLowerCase().includes(trimmed)
      ).slice(0, 10).map(w => ({
        id: w.id,
        type: 'word',
        title: w.title,
        subtitle: w.subtitle,
        targetSlug: w.slug
      }));
    }

    const flat: SearchResultItem[] = [
      ...matchingPages,
      ...matchingFigures,
      ...matchingClauses,
      ...matchingWords
    ];

    return {
      results: {
        pages: matchingPages,
        figures: matchingFigures,
        clauses: matchingClauses,
        words: matchingWords
      },
      flatList: flat,
      totalCount: flat.length
    };
  }, [query]);

  // Adjust selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle arrow keys and enter
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatList.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flatList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatList.length) % flatList.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = flatList[selectedIndex] || flatList[0];
      if (chosen) {
        handleItemClick(chosen);
      }
    }
  };

  const handleItemClick = (item: SearchResultItem) => {
    if (item.type === 'figure' && item.figureKey) {
      onSelectFigure?.(item.figureKey);
      onClose();
    } else if (item.targetSlug) {
      onSelectPage?.(item.targetSlug);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isQueryTooShort = query.trim().length < 2;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-[#1a1612]/35 backdrop-blur-[2px]">
      <div
        ref={containerRef}
        className="w-full max-w-[680px] bg-[#fffefb] rounded-[8px] border border-[#e6dccb] shadow-[0_16px_50px_rgba(26,22,18,0.18)] overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar (Sticky at top of modal) */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e6dccb] bg-[#fffefb] shrink-0">
          <Search className="w-4 h-4 text-[#8a6a36] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Find a page, an answer or a figure..."
            className="w-full bg-transparent text-sm text-[#1a1612] placeholder-[#6e6358] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] transition-colors mr-2 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono uppercase bg-[#efe7db] text-[#6e6358] px-2 py-0.5 rounded-[4px] border border-[#d9ccb6]">
            Esc
          </span>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto p-3 text-xs divide-y divide-[#efe7da]/70">
          {/* ZERO QUERY STATE: POPULAR ON PAGES (Never shown below matching query results) */}
          {isQueryTooShort && (
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8a6a36] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span>Popular on Pages</span>
              </div>
              <p className="text-[12px] text-[#6e6358] leading-relaxed">
                Type at least two characters to search across pages, figures, questions and words. Or jump to popular items:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {POPULAR_SEARCH_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => {
                      setQuery(chip);
                      inputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 rounded-[6px] bg-[#f7f2ea] hover:bg-[#f5edd8] border border-[#d9ccb6] hover:border-[#c9a96e] text-[11px] text-[#1a1612] transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE QUERY RESULTS: STRICT SPEC §3.4 GROUP ORDER */}
          {!isQueryTooShort && totalCount > 0 && (
            <div className="space-y-4">
              {/* GROUP 1: PAGES */}
              {results.pages.length > 0 && (
                <div>
                  <div className="px-2 py-1 flex items-center justify-between text-[11px] font-medium text-[#1a1612] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#1a1612]" />
                      Pages ({results.pages.length})
                    </span>
                    <span className="text-[10px] text-[#6e6358] lowercase font-mono">spec §3.4 group 1</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {results.pages.map(item => {
                      const itemGlobalIndex = flatList.findIndex(f => f.id === item.id);
                      const isSelected = itemGlobalIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full px-3 py-2 text-left rounded-[6px] transition-colors flex items-center justify-between group cursor-pointer ${
                            isSelected ? 'bg-[#f5edd8] border border-[#c9a96e]/60' : 'hover:bg-[#f7f2ea] border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-[#1a1612] flex items-center gap-2">
                              <span>{item.title}</span>
                              <code className="text-[11px] font-mono text-[#6e6358]">{item.subtitle.split(' · ')[0]}</code>
                            </div>
                            <div className="text-[11px] text-[#6e6358] mt-0.5">{item.subtitle}</div>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 text-[#8a6a36] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GROUP 2: FIGURES */}
              {results.figures.length > 0 && (
                <div>
                  <div className="px-2 py-1 flex items-center justify-between text-[11px] font-medium text-[#8a6a36] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-[#c9a96e]" />
                      Figures ({results.figures.length})
                    </span>
                    <span className="text-[10px] text-[#6e6358] lowercase font-mono">spec §3.4 group 2</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {results.figures.map(item => {
                      const itemGlobalIndex = flatList.findIndex(f => f.id === item.id);
                      const isSelected = itemGlobalIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full px-3 py-2 text-left rounded-[6px] transition-colors flex items-center justify-between group cursor-pointer ${
                            isSelected ? 'bg-[#f5edd8] border border-[#c9a96e]/60' : 'hover:bg-[#f7f2ea] border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-[#1a1612] flex items-center gap-2">
                              <span className="bg-[#f5edd8] text-[#8a6a36] px-1.5 py-0.5 rounded-[4px] font-mono text-[11px] border border-[#c9a96e]/40">
                                {item.subtitle.split(' · ')[0]}
                              </span>
                              <span>{item.title}</span>
                            </div>
                            <div className="text-[11px] text-[#6e6358] mt-0.5">{item.subtitle}</div>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 text-[#8a6a36] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GROUP 3: QUESTIONS & CLAUSES */}
              {results.clauses.length > 0 && (
                <div>
                  <div className="px-2 py-1 flex items-center justify-between text-[11px] font-medium text-[#6e6358] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#8a6a36]" />
                      Questions & Clauses ({results.clauses.length})
                    </span>
                    <span className="text-[10px] text-[#6e6358] lowercase font-mono">spec §3.4 group 3</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {results.clauses.map(item => {
                      const itemGlobalIndex = flatList.findIndex(f => f.id === item.id);
                      const isSelected = itemGlobalIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full px-3 py-2 text-left rounded-[6px] transition-colors flex items-center justify-between group cursor-pointer ${
                            isSelected ? 'bg-[#f5edd8] border border-[#c9a96e]/60' : 'hover:bg-[#f7f2ea] border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-[#1a1612]">{item.title}</div>
                            <div className="text-[11px] text-[#5c5248] mt-0.5">{item.subtitle}</div>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 text-[#8a6a36] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GROUP 4: WORDS ON PAGES */}
              {results.words.length > 0 && (
                <div>
                  <div className="px-2 py-1 flex items-center justify-between text-[11px] font-medium text-[#6e6358] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#6e6358]" />
                      Words on pages ({results.words.length})
                    </span>
                    <span className="text-[10px] text-[#6e6358] lowercase font-mono">spec §3.4 group 4</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {results.words.map(item => {
                      const itemGlobalIndex = flatList.findIndex(f => f.id === item.id);
                      const isSelected = itemGlobalIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full px-3 py-2 text-left rounded-[6px] transition-colors flex items-center justify-between group cursor-pointer ${
                            isSelected ? 'bg-[#f5edd8] border border-[#c9a96e]/60' : 'hover:bg-[#f7f2ea] border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-[#1a1612]">{item.title}</div>
                            <div className="text-[11px] text-[#5c5248] mt-0.5">{item.subtitle}</div>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 text-[#8a6a36] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NO RESULTS STATE: EXACT SPEC §3.4 PHRASING */}
          {!isQueryTooShort && totalCount === 0 && (
            <div className="text-center py-10 px-4 text-[#6e6358] space-y-1.5">
              <p className="font-serif text-base text-[#1a1612]">
                Nothing on any page matches &ldquo;{query}&rdquo;
              </p>
              <p className="text-[11px] text-[#5c5248]">
                Check for typing errors, or search by a figure amount, question topic, or page name.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-4 py-2.5 border-t border-[#e6dccb] bg-[#f7f2ea] flex items-center justify-between text-[11px] text-[#6e6358] shrink-0">
          <span>{totalCount > 0 ? `${totalCount} results found (up to 40)` : 'Instant multi-group search'}</span>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1">
              <kbd className="bg-[#fffefb] border border-[#d9ccb6] px-1 py-0.5 rounded-[3px]">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-[#fffefb] border border-[#d9ccb6] px-1.5 py-0.5 rounded-[3px] flex items-center gap-0.5">
                <CornerDownLeft className="w-2.5 h-2.5" /> Enter
              </kbd> open
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindPopover;
