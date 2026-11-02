/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CareMomentsSection (Spec § 8.14 Part 04, Screen 52)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { MOMENT_TABS } from '../../data/careRegistry';

interface CareMomentsSectionProps {
  onSelectFigure?: (figureKey: string) => void;
  onOpenQuestion?: (questionId: string) => void;
}

export const CareMomentsSection: React.FC<CareMomentsSectionProps> = ({
  onSelectFigure,
  onOpenQuestion
}) => {
  const [activeMomentId, setActiveMomentId] = useState<string>('arrives');

  const currentTab = MOMENT_TABS.find((t) => t.id === activeMomentId) || MOMENT_TABS[0];

  const renderMomentHeading = (id: string) => {
    switch (id) {
      case 'arrives':
        return <span>When your piece <em className="italic text-[#935b1e]">arrives</em></span>;
      case 'ready':
        return <span>Getting <em className="italic text-[#935b1e]">ready</em></span>;
      case 'celebration':
        return <span>At the <em className="italic text-[#935b1e]">celebration</em></span>;
      case 'after':
        return <span>After the <em className="italic text-[#935b1e]">celebration</em></span>;
      case 'sending':
        return <span>Sending it <em className="italic text-[#935b1e]">back</em></span>;
      default:
        return <span>{currentTab.title}</span>;
    }
  };

  const getSubheadingWithChips = (subheading: string) => {
    if (subheading.includes('1 day')) {
      const parts = subheading.split('1 day');
      return (
        <span>
          {parts[0]}
          <button
            type="button"
            onClick={() => onSelectFigure?.('arrive_before')}
            className="bg-[#f3eee7] text-[#44403c] border border-[#ded8cf] px-1.5 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#eae3d8]"
          >
            1 day
          </button>
          {parts[1]}
        </span>
      );
    }
    return <span>{subheading}</span>;
  };

  const renderNoteBullet = (note: string, idx: number) => {
    if (note.includes('24 hours')) {
      const parts = note.split('24 hours');
      return (
        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#44403c] leading-relaxed">
          <span className="text-[#935b1e] shrink-0 mt-1">•</span>
          <span>
            {parts[0]}
            <button
              type="button"
              onClick={() => onSelectFigure?.('issue_window')}
              className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold cursor-pointer hover:bg-[#fef08a]"
            >
              24 hours
            </button>
            {parts.slice(1).join('24 hours')}
          </span>
        </li>
      );
    }
    return (
      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#44403c] leading-relaxed">
        <span className="text-[#935b1e] shrink-0 mt-1">•</span>
        <span>{note}</span>
      </li>
    );
  };

  const mockMomentQuestions: Record<string, Array<{ text: string; tag: string; tagType: 'amber' | 'emerald' | 'ochre' }>> = {
    arrives: [
      { text: 'What should I do when my piece arrives?', tag: 'WITHIN 24 HOURS', tagType: 'amber' },
      { text: 'There is a mark the listing already mentions', tag: 'NEVER COUNTED AGAINST YOU', tagType: 'emerald' },
      { text: 'It does not fit', tag: 'SWAP WITHIN 24 HOURS', tagType: 'amber' }
    ],
    ready: [
      { text: 'Can I steam or iron out a crease?', tag: 'HANG IN A WARM ROOM', tagType: 'amber' },
      { text: 'Can I use safety pins or fashion tape?', tag: 'ONLY THROUGH LININGS', tagType: 'amber' }
    ],
    celebration: [
      { text: 'I spilled something on it', tag: 'BLOT NEVER RUB', tagType: 'emerald' },
      { text: 'A hook button or a few sequins came loose', tag: 'NORMAL WEAR', tagType: 'emerald' },
      { text: 'Can I take off a heavy dupatta or layer?', tag: 'KEEP IT TOGETHER', tagType: 'ochre' }
    ],
    after: [
      { text: 'Do I need to clean it before sending it back?', tag: 'CLEANING IS ON US', tagType: 'emerald' },
      { text: 'A stain dried overnight', tag: 'TELL US BEFORE SENDING', tagType: 'amber' }
    ],
    sending: [
      { text: 'What needs to go back with the piece?', tag: 'EVERY LAYER & ACCESSORY', tagType: 'ochre' },
      { text: 'I lost the garment bag or tissue', tag: 'NOTIFY US', tagType: 'amber' }
    ]
  };

  const questionsList = mockMomentQuestions[activeMomentId] || mockMomentQuestions['arrives'];

  return (
    <div className="pt-2 pb-2">
      <div className="border-t border-dashed border-[#dcd7ce] pt-8 mb-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal">
          Your piece, <span className="italic text-[#935b1e]">moment by moment</span>
        </h2>
        <p className="text-sm sm:text-[15px] text-[#57534e] mt-2.5 leading-relaxed">
          From the day it arrives to the day it travels home, here is how to keep it at its most beautiful.
        </p>
      </div>

      {/* 5 Moment Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        {MOMENT_TABS.map((tab) => {
          const isActive = tab.id === activeMomentId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMomentId(tab.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'bg-white border border-[#ded8cf] text-[#44403c] hover:bg-[#faf8f5]'
              }`}
            >
              <span>{tab.num} {tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Moment Panel */}
      <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-7 shadow-xs space-y-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-normal mb-1.5">
            {renderMomentHeading(currentTab.id)}
          </h3>
          <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
            {getSubheadingWithChips(currentTab.subheading)}
          </p>
        </div>

        <ul className="space-y-3 pt-2">
          {currentTab.notes.map((note, idx) => renderNoteBullet(note, idx))}
        </ul>

        {/* Questions at this moment */}
        <div className="border-t border-[#f1eee8] pt-6 mt-6">
          <div className="font-serif italic text-sm text-[#57534e] mb-4">
            Questions at this moment
          </div>
          <div className="divide-y divide-[#f4f0eb]">
            {questionsList.map((q, qIdx) => (
              <div
                key={qIdx}
                onClick={() => onOpenQuestion?.(currentTab.id)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer hover:bg-[#fcfaf7] px-2 rounded-md transition-colors group"
              >
                <span className="font-serif text-sm sm:text-[15px] text-[#1c1917] group-hover:text-[#935b1e] transition-colors">
                  {q.text}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold shrink-0 uppercase tracking-wider ${
                    q.tagType === 'emerald'
                      ? 'bg-[#edf7ed] text-[#2e7d32] border border-[#c8e6c9]'
                      : 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                  }`}
                >
                  ● {q.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareMomentsSection;
