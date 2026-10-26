/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ParagraphPickerModal (Spec §7.8, Screen 38)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';

interface AvailableParagraph {
  id: string;
  pageName: string;
  questionTitle: string;
  text: string;
}

interface ParagraphPickerModalProps {
  currentAnswerId: string;
  onSelectParagraph: (pageName: string, questionTitle: string, text: string) => void;
  onClose: () => void;
}

const EXTERNAL_PARAGRAPHS: AvailableParagraph[] = [
  {
    id: 'ext_1',
    pageName: 'Deposit Policy',
    questionTitle: 'What counts as normal wear?',
    text: 'Minor hem dust from evening wear, faint makeup traces that vanish during standard dry cleaning, and slight zipper stiffness are completely normal and never charged to you.'
  },
  {
    id: 'ext_2',
    pageName: 'Deposit Policy',
    questionTitle: 'When is a deposit retained?',
    text: 'A security deposit is only retained in cases of non-return beyond 5 days, irreparable structural tear, or unremovable burns and chemical stains.'
  },
  {
    id: 'ext_3',
    pageName: 'Care, Cleaning & Damage Policy',
    questionTitle: 'How should I clean silk pieces?',
    text: 'Never attempt to wash, spot-treat or iron silk or embellished items at home. House of Kaira handles all care upon collection.'
  },
  {
    id: 'ext_4',
    pageName: 'Shipping & Delivery Policy',
    questionTitle: 'What time of day will my courier arrive?',
    text: 'All Mumbai deliveries occur between 10:00 and 19:00. You receive real time WhatsApp tracking and dispatch notices.'
  }
];

export const ParagraphPickerModal: React.FC<ParagraphPickerModalProps> = ({
  onSelectParagraph,
  onClose
}) => {
  const [searchWord, setSearchWord] = useState('');

  const filtered = useMemo(() => {
    if (!searchWord.trim()) return EXTERNAL_PARAGRAPHS;
    const q = searchWord.toLowerCase();
    return EXTERNAL_PARAGRAPHS.filter(
      p => p.text.toLowerCase().includes(q) || p.questionTitle.toLowerCase().includes(q) || p.pageName.toLowerCase().includes(q)
    );
  }, [searchWord]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-[580px] bg-white border border-[#ebe5dc] rounded-[10px] shadow-2xl overflow-hidden flex flex-col text-xs text-[#1a1612]">
        {/* Header */}
        <div className="p-4 border-b border-[#f0eae1] bg-[#faf7f2]/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">
              Use a paragraph from another page
            </h3>
            <p className="text-[11.5px] text-[#73675a] mt-0.5">
              It will read the same on both pages and follow updates made at the source.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a7f73] hover:text-[#1a1612] p-1.5 rounded"
          >
            ✕
          </button>
        </div>

        {/* Search Input (Spec §7.8: "Find it by any word: normal wear, deposit, refund") */}
        <div className="p-3 border-b border-[#f0eae1] bg-white">
          <input
            type="text"
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
            placeholder="Find it by any word: normal wear, deposit, refund"
            autoFocus
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[6px] text-xs text-[#1a1612] placeholder-[#8a7f73] focus:outline-none focus:border-[#bda67b]"
          />
        </div>

        {/* Paragraphs List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#f7f2ea] p-2 space-y-1">
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => {
                onSelectParagraph(p.pageName, p.questionTitle, p.text);
                onClose();
              }}
              className="p-3 rounded-[6px] hover:bg-[#faf7f2] cursor-pointer border border-transparent hover:border-[#ebe5dc] transition-all group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10.5px] font-semibold text-[#8a6a36] uppercase tracking-wider">
                  {p.pageName}
                </span>
                <span className="text-[11px] text-[#73675a] italic truncate max-w-[260px]">
                  {p.questionTitle}
                </span>
              </div>
              <p className="text-[12.5px] text-[#3d362e] line-clamp-2 leading-relaxed">
                {p.text}
              </p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-[#8a7f73]">
              No paragraph on any page has those words.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#f0eae1] bg-[#faf7f2]/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-[#e6dccb] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#73675a] hover:text-[#1a1612]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParagraphPickerModal;
