/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositSectionsList (Spec § 8.13 Part 06)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { DEPOSIT_SECTIONS } from '../../data/depositRegistry';

interface DepositSectionsListProps {
  onSelectSection?: (sectionId: string) => void;
}

export const DepositSectionsList: React.FC<DepositSectionsListProps> = ({
  onSelectSection
}) => {
  const renderTitle = (title: string, italicWord?: string) => {
    if (!italicWord || !title.includes(italicWord)) {
      return <span>{title}</span>;
    }
    const parts = title.split(italicWord);
    return (
      <>
        <span>{parts[0]}</span>
        <span className="italic text-[#935b1e]">{italicWord}</span>
        <span>{parts.slice(1).join(italicWord)}</span>
      </>
    );
  };

  return (
    <div className="space-y-4">
      {DEPOSIT_SECTIONS.map((sec) => (
        <div
          key={sec.id}
          onClick={() => onSelectSection?.(sec.id)}
          className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 sm:p-6 shadow-2xs hover:border-[#dbc8af] transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            <span className="font-mono text-sm text-[#935b1e] font-semibold shrink-0 pt-0.5">
              {sec.number}
            </span>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-normal group-hover:text-[#935b1e] transition-colors">
                  {renderTitle(sec.title, sec.italicWord)}
                </h3>
                <span className="text-[11px] text-[#8a7f73] underline hover:text-[#1c1917] font-medium shrink-0">
                  {sec.questions.length} questions
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#57534e] mt-1.5 leading-relaxed">
                {sec.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepositSectionsList;
