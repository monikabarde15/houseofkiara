/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositAnswersLaunchCard (Spec § 8.13 Part 07)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { DEPOSIT_SECTIONS } from '../../data/depositRegistry';

interface DepositAnswersLaunchCardProps {
  onOpenAnswersView: () => void;
}

export const DepositAnswersLaunchCard: React.FC<DepositAnswersLaunchCardProps> = ({
  onOpenAnswersView
}) => {
  return (
    <div className="bg-[#fcfaf7] border border-[#ebe5dc] rounded-[10px] p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f1eee8]">
        <div>
          <span className="font-semibold text-sm text-[#1c1917]">
            61 answers
          </span>
          <span className="text-xs text-[#57534e] ml-1.5">
            each a question the page opens as it is asked. They are written in the Answers view, with a list to find each in.
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenAnswersView}
          className="bg-[#1c1917] text-white hover:bg-[#292524] text-xs font-medium px-4 py-2 rounded-md shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open the answers</span>
          <span>→</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-4">
        {DEPOSIT_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={onOpenAnswersView}
            className="text-[11px] px-2.5 py-1 rounded bg-white border border-[#e5dfd5] text-[#44403c] hover:border-[#935b1e] hover:text-[#935b1e] transition-colors cursor-pointer"
          >
            <span>{sec.title}</span>
            <span className="ml-1.5 font-mono text-[#8a7f73]">{sec.questions.length}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepositAnswersLaunchCard;
