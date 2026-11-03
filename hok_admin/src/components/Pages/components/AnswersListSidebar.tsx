/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AnswersListSidebar (Spec §7.8, Screens 26, 27)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { AnswerItem, AnswerSide } from '../types/answers.types';

interface AnswersListSidebarProps {
  answers: AnswerItem[];
  selectedAnswerId: string;
  onSelectAnswer: (id: string) => void;
  onAddQuestion: () => void;
}

export const AnswersListSidebar: React.FC<AnswersListSidebarProps> = ({
  answers,
  selectedAnswerId,
  onSelectAnswer,
  onAddQuestion
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sideFilter, setSideFilter] = useState<'all' | AnswerSide>('all');

  // Filter questions by search words and side
  const filteredAnswers = useMemo(() => {
    return answers.filter(a => {
      if (sideFilter !== 'all' && a.side !== sideFilter && a.side !== 'both') return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inQuestion = a.question.toLowerCase().includes(q);
      const inParagraphs = a.paragraphs.some(p => p.text.toLowerCase().includes(q));
      const inSearchWords = a.searchWords?.toLowerCase().includes(q);
      return inQuestion || inParagraphs || inSearchWords;
    });
  }, [answers, searchQuery, sideFilter]);

  // Group by section
  const groupedSections = useMemo(() => {
    const map = new Map<string, AnswerItem[]>();
    for (const a of filteredAnswers) {
      const section = a.section || 'Not in any section';
      const list = map.get(section) || [];
      list.push(a);
      map.set(section, list);
    }
    return Array.from(map.entries());
  }, [filteredAnswers]);

  return (
    <aside className="w-full lg:w-[300px] shrink-0 bg-white border border-[#ebe5dc] rounded-[8px] flex flex-col h-[calc(100vh-140px)] sticky top-36 overflow-hidden text-xs text-[#1a1612] shadow-2xs">
      {/* 1. Find a question input (Spec §7.8, Screen 27) */}
      <div className="p-3 border-b border-[#f0eae1] bg-[#faf7f2]/50 space-y-2.5">
        <div className="relative">
          <svg className="w-3.5 h-3.5 text-[#8a7f73] absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="A word in a question or an answer"
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] placeholder-[#8a7f73] focus:outline-none focus:border-[#bda67b]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-[#8a7f73] hover:text-[#1a1612]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Side filter pills: All 103, Rentals, Preloved, Both (Spec §7.8) */}
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: `All ${answers.length}` },
            { id: 'rentals', label: 'Rentals' },
            { id: 'preloved', label: 'Preloved' },
            { id: 'both', label: 'Both' }
          ].map(pill => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSideFilter(pill.id as any)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                sideFilter === pill.id
                  ? 'bg-[#1a1612] text-white shadow-2xs'
                  : 'text-[#73675a] hover:bg-[#f2ede4]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Questions Grouped Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f7f2ea]">
        {groupedSections.map(([sectionName, items]) => {
          const isUnassigned = sectionName === 'Not in any section';
          return (
            <div key={sectionName} className="py-2">
              <div className="px-3.5 py-1.5 flex items-center justify-between">
                <span className={`text-[10.5px] uppercase tracking-wider font-semibold ${
                  isUnassigned ? 'text-[#9e4733]' : 'text-[#8a7f73]'
                }`}>
                  {sectionName}
                </span>
                <span className="text-[10px] text-[#8a7f73]">
                  {items.length}
                </span>
              </div>

              <div className="space-y-0.5 px-1.5">
                {items.map(item => {
                  const isSelected = item.id === selectedAnswerId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectAnswer(item.id)}
                      className={`w-full text-left p-2 rounded-[5px] transition-all group flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#fcfaf7] border-l-2 border-[#bda67b] shadow-2xs'
                          : 'hover:bg-[#faf7f2]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className={`text-[12px] leading-snug line-clamp-2 ${
                          isSelected ? 'font-medium text-[#1a1612]' : 'text-[#3d362e] group-hover:text-[#1a1612]'
                        }`}>
                          {item.question}
                        </div>

                        {/* Badges: Rentals, Preloved, Shared */}
                        <div className="flex items-center gap-1.5 mt-1">
                          {item.side === 'rentals' && (
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#f5efe6] text-[#73675a]">
                              Rentals
                            </span>
                          )}
                          {item.side === 'preloved' && (
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#f5efe6] text-[#73675a]">
                              Preloved
                            </span>
                          )}
                          {item.isShared && (
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#eef4fa] text-[#2c5282] font-medium">
                              Shared
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Check indicator dot (red or amber) */}
                      {item.hasChecks && (
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                            item.checkTone === 'red' ? 'bg-[#993d3d]' : 'bg-[#c5ad7d]'
                          }`}
                          title="Has checks to review"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredAnswers.length === 0 && (
          <div className="p-6 text-center space-y-2">
            <div className="text-[#8a7f73]">No question matches.</div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSideFilter('all');
              }}
              className="text-[#8a6a36] hover:underline font-medium"
            >
              Show every question
            </button>
          </div>
        )}
      </div>

      {/* 3. Foot button: + Add a question (Spec §7.8) */}
      <div className="p-2.5 border-t border-[#f0eae1] bg-[#faf7f2]/50">
        <button
          type="button"
          onClick={onAddQuestion}
          className="w-full py-2 px-3 rounded-[6px] border border-[#e6dccb] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#1a1612] transition-colors flex items-center justify-center gap-1.5"
        >
          <span>+ Add a question</span>
        </button>
      </div>
    </aside>
  );
};

export default AnswersListSidebar;
