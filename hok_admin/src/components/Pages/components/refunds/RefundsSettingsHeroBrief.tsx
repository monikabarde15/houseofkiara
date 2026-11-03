/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsSettingsHeroBrief (Spec §8.12)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';

interface RefundsSettingsHeroBriefProps {
  activeTab: 'hero' | 'brief';
}

export const RefundsSettingsHeroBrief: React.FC<RefundsSettingsHeroBriefProps> = ({
  activeTab
}) => {
  const [briefTab, setBriefTab] = useState<'rental' | 'preloved'>('rental');

  const [popularQuestions, setPopularQuestions] = useState([
    'What do I get back if I cancel more than 7 days before my rental starts?',
    'When do I get my deposit back?',
    'Can I cancel after it has been dispatched?',
    'How long does a refund take?'
  ]);

  const [rentalRows, setRentalRows] = useState([
    { id: '1', label: 'Cancel more than 7 days before your rental starts', tone: 'good', opens: 'What do I get back if I cancel more than 7 days before my rental starts?' },
    { id: '2', label: 'Cancel within 7 days, before dispatch', tone: 'mid', opens: 'What if I cancel within 7 days of my rental start date?' },
    { id: '3', label: 'Cancel once your piece is dispatched', tone: 'no', opens: 'Can I cancel after my rental has been dispatched?' }
  ]);

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= popularQuestions.length) return;
    const next = [...popularQuestions];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setPopularQuestions(next);
  };

  const handleRemoveQuestion = (index: number) => {
    setPopularQuestions(popularQuestions.filter((_, i) => i !== index));
  };

  if (activeTab === 'hero') {
    return (
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4">
        <div>
          <span className="text-[11px] font-mono text-[#8a7f73] uppercase tracking-wider block">Part 01</span>
          <h3 className="font-serif text-[16px] text-[#1a1612] font-normal">Line under the heading</h3>
          <p className="text-[12px] text-[#73675a] mt-1">
            Popular questions: up to four, shown under the search box.
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#f0ebe3]">
          {popularQuestions.map((q, idx) => (
            <div key={idx} className="p-2.5 rounded-[6px] border border-[#ebe5dc] bg-[#faf7f2] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono text-[11px] text-[#935b1e] font-semibold shrink-0">{idx + 1}</span>
                <span className="truncate text-[#1c1917] text-xs">{q}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveQuestion(idx, 'up')}
                  className="p-1 rounded text-[#73675a] hover:bg-white disabled:opacity-30 cursor-pointer"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === popularQuestions.length - 1}
                  onClick={() => handleMoveQuestion(idx, 'down')}
                  className="p-1 rounded text-[#73675a] hover:bg-white disabled:opacity-30 cursor-pointer"
                  title="Move down"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="p-1 rounded text-[#c62828] hover:bg-white cursor-pointer"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-2 border border-dashed border-[#d8c3a5] rounded-[6px] text-[#935b1e] font-medium text-xs hover:bg-[#fbf4ea] transition-colors"
        >
          + Add a question
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8a7f73] uppercase tracking-wider block">Part 04</span>
          <h3 className="font-serif text-[16px] text-[#1a1612] font-normal">The policy in brief</h3>
          <p className="text-[12px] text-[#73675a] mt-0.5">The summary rows, each opening its answer.</p>
        </div>
        <div className="inline-flex rounded-[4px] border border-[#ebe5dc] p-0.5 bg-[#fbf9f5]">
          <button
            type="button"
            onClick={() => setBriefTab('rental')}
            className={`px-2 py-0.5 text-[11px] rounded transition-colors ${briefTab === 'rental' ? 'bg-[#1a1612] text-white' : 'text-[#73675a]'}`}
          >
            Rental
          </button>
          <button
            type="button"
            onClick={() => setBriefTab('preloved')}
            className={`px-2 py-0.5 text-[11px] rounded transition-colors ${briefTab === 'preloved' ? 'bg-[#1a1612] text-white' : 'text-[#73675a]'}`}
          >
            Preloved
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-[#f0ebe3]">
        {rentalRows.map((r, idx) => (
          <div key={r.id} className="p-3 border border-[#ebe5dc] rounded-[6px] bg-[#faf7f2] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-[#1c1917]">{idx + 1}. {r.label}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#8a7f73] uppercase font-semibold">Tone</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = [...rentalRows];
                    next[idx].tone = 'good';
                    setRentalRows(next);
                  }}
                  className={`py-1 px-1.5 rounded text-[10.5px] font-medium transition-colors ${r.tone === 'good' ? 'bg-[#1a1612] text-white' : 'bg-white border border-[#ebe5dc] text-[#5c5248]'}`}
                >
                  Good news
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...rentalRows];
                    next[idx].tone = 'mid';
                    setRentalRows(next);
                  }}
                  className={`py-1 px-1.5 rounded text-[10.5px] font-medium transition-colors ${r.tone === 'mid' ? 'bg-[#1a1612] text-white' : 'bg-white border border-[#ebe5dc] text-[#5c5248]'}`}
                >
                  Worth knowing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...rentalRows];
                    next[idx].tone = 'no';
                    setRentalRows(next);
                  }}
                  className={`py-1 px-1.5 rounded text-[10.5px] font-medium transition-colors ${r.tone === 'no' ? 'bg-[#1a1612] text-white' : 'bg-white border border-[#ebe5dc] text-[#5c5248]'}`}
                >
                  Not possible
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-[#8a7f73] uppercase font-semibold">Opens</span>
              <input
                type="text"
                readOnly
                value={r.opens}
                className="w-full bg-white border border-[#ebe5dc] rounded px-2 py-1 text-[11px] text-[#5c5248]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundsSettingsHeroBrief;
