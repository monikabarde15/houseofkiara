/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaperMostAsked (Spec §8.4 Part 05, Page 29)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';

interface MostAskedItem {
  id: string;
  question: string;
  answerSummary: string;
}

const MOST_ASKED_DATA: Record<string, MostAskedItem[]> = {
  everyone: [
    {
      id: 'q1',
      question: 'How do I know a piece will fit me?',
      answerSummary: 'Every piece includes precise measurements across bust, waist, hips, and length taken by our tailors. We also offer complimentary size consultation via WhatsApp.'
    },
    {
      id: 'q2',
      question: 'When will I get my deposit back?',
      answerSummary: 'We inspect every piece within 24 hours of receiving it. If all is well, your full deposit is refunded within 3 to 5 business days.'
    },
    {
      id: 'q3',
      question: 'How far in advance should I book?',
      answerSummary: 'You can reserve pieces up to 120 days in advance. For wedding and peak festive seasons, we recommend booking 3 to 4 weeks early.'
    },
    {
      id: 'q4',
      question: 'Can I cancel or change my booking dates?',
      answerSummary: 'Yes. Cancellations made more than 7 days prior to dispatch receive a full credit refund. Date modifications are complimentary subject to availability.'
    },
    {
      id: 'q5',
      question: 'How does House of Kaira verify authenticity?',
      answerSummary: 'Every piece undergoes a multi-point physical verification by luxury authenticators, checking fabric hallmarks, serial tags, and artisanal craftsmanship.'
    }
  ],
  renting: [
    {
      id: 'r1',
      question: 'How long can I keep a rental?',
      answerSummary: 'Standard rental periods are 3, 5, or 7 days. Your rental begins on the day the courier delivers and ends on the scheduled return pickup date.'
    },
    {
      id: 'r2',
      question: 'What should I do when my rental arrives?',
      answerSummary: 'Try it on immediately with clean skin and no jewellery or perfume that might snag the fabric. Report any transit issues within 24 hours.'
    },
    {
      id: 'r3',
      question: 'Do I need to dry clean the piece before returning it?',
      answerSummary: 'Never. Professional eco-friendly cleaning is complimentary with every rental. Simply place the garment into the return garment bag provided.'
    },
    {
      id: 'r4',
      question: 'What counts as normal wear and tear?',
      answerSummary: 'Minor hem dust from celebration floors, faint deodorant marks, or loose sequins are normal wear and covered by us with no fee.'
    },
    {
      id: 'r5',
      question: 'What if the courier is delayed?',
      answerSummary: 'If an unexpected courier delay affects your event wear, our emergency logistics team arranges a same-day alternative or provides a complete refund.'
    }
  ],
  preloved: [
    {
      id: 'p1',
      question: 'Can I return a preloved piece?',
      answerSummary: 'Preloved pieces can be returned within 48 hours of delivery in unaltered condition with security tags intact for site credit or card refund.'
    },
    {
      id: 'p2',
      question: 'What condition are preloved pieces in?',
      answerSummary: 'Every preloved piece is graded A+ Pristine, A Excellent, or B Very Good with high-resolution photography documenting any minute imperfections.'
    },
    {
      id: 'p3',
      question: 'How is the preloved price set?',
      answerSummary: 'Prices are appraised using original designer retail value, current market rarity, condition grade, and past collection desirability.'
    },
    {
      id: 'p4',
      question: 'Is certificate of authenticity included with preloved?',
      answerSummary: 'Yes. Every preloved purchase comes with an official House of Kaira Digital Passport and physical Certificate of Authenticity.'
    },
    {
      id: 'p5',
      question: 'How quickly is a preloved piece shipped?',
      answerSummary: 'Preloved pieces ship from our vault within 24 hours via premium insured courier and arrive nationwide in 2 to 4 business days.'
    }
  ]
};

interface FaqPaperMostAskedProps {
  onOpenQuestion?: (questionText: string) => void;
}

export const FaqPaperMostAsked: React.FC<FaqPaperMostAskedProps> = ({ onOpenQuestion }) => {
  const [activeTab, setActiveTab] = useState<'everyone' | 'renting' | 'preloved'>('everyone');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const questions = MOST_ASKED_DATA[activeTab];

  return (
    <div id="most-asked" className="mt-12 pt-10 border-t border-[#f0ebe3]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-[#8a6a36] uppercase">
            Part 05 · Curated Picks
          </span>
          <h3 className="font-serif text-[22px] text-[#1a1612] mt-0.5">
            Most asked questions
          </h3>
          <p className="text-xs text-[#73675a] mt-0.5">
            The five questions shown first for each kind of customer.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 p-1 bg-[#f4ede2] rounded-[6px] text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('everyone'); setExpandedId(null); }}
            className={`px-3 py-1 rounded-[4px] font-medium transition cursor-pointer ${
              activeTab === 'everyone'
                ? 'bg-white text-[#1a1612] shadow-2xs'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            For everyone
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('renting'); setExpandedId(null); }}
            className={`px-3 py-1 rounded-[4px] font-medium transition cursor-pointer ${
              activeTab === 'renting'
                ? 'bg-white text-[#1a1612] shadow-2xs'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            For someone renting
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('preloved'); setExpandedId(null); }}
            className={`px-3 py-1 rounded-[4px] font-medium transition cursor-pointer ${
              activeTab === 'preloved'
                ? 'bg-white text-[#1a1612] shadow-2xs'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            For someone buying preloved
          </button>
        </div>
      </div>

      {/* 5 Questions list */}
      <div className="divide-y divide-[#f0ebe3] border border-[#f0ebe3] rounded-[8px] bg-[#fbf9f5] overflow-hidden">
        {questions.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="transition-colors hover:bg-white">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-serif text-sm font-semibold text-[#8a6a36]">
                    0{idx + 1}
                  </span>
                  <span className="font-serif text-[15px] text-[#1a1612]">
                    {item.question}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#8a7f73]">
                  {onOpenQuestion && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuestion(item.question);
                      }}
                      className="text-[#8a6a36] hover:underline cursor-pointer"
                    >
                      Open in Answers →
                    </span>
                  )}
                  <span className="text-base font-light">{isExpanded ? '−' : '+'}</span>
                </div>
              </button>
              {isExpanded && (
                <div className="px-5 pb-4 pt-1 text-xs text-[#5c5248] leading-relaxed border-t border-[#f4ede2] bg-white">
                  {item.answerSummary}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqPaperMostAsked;
