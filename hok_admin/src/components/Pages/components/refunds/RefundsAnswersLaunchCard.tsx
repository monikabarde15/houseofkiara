/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsAnswersLaunchCard (Spec §8.12 Part 06)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface RefundsAnswersLaunchCardProps {
  onOpenAnswersView: () => void;
}

export const RefundsAnswersLaunchCard: React.FC<RefundsAnswersLaunchCardProps> = ({
  onOpenAnswersView
}) => {
  const sectionPills = [
    { label: 'Cancelling a booking', count: 17 },
    { label: 'Changing your booking', count: 6 },
    { label: 'Delivery & arrival', count: 19 },
    { label: 'During & after your event', count: 8 },
    { label: 'Your security deposit', count: 12 },
    { label: 'Refunds & payments', count: 11 },
    { label: 'When it is on us', count: 6 },
    { label: 'Concerns & your rights', count: 9 }
  ];

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#f0ebe3]">
        <div className="text-xs text-[#57534e] max-w-lg leading-relaxed">
          <strong className="text-[#1c1917] font-semibold">103 answers</strong>, each a question the page opens as it is asked. They are written in the Answers view, with a list to find each in.
        </div>
        <button
          type="button"
          onClick={onOpenAnswersView}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#1a1612] text-white text-xs font-medium hover:bg-[#2c2620] cursor-pointer transition-colors shrink-0 shadow-xs"
        >
          <span>Open the answers</span>
          <span>→</span>
        </button>
      </div>

      {/* Section pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {sectionPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={onOpenAnswersView}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[#e6dccb] bg-[#fbf9f5] text-[11px] text-[#5c5248] hover:text-[#1a1612] hover:bg-[#f5ede2] transition-colors cursor-pointer"
          >
            <span>{pill.label}</span>
            <span className="font-mono text-[#935b1e] font-semibold">{pill.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RefundsAnswersLaunchCard;
