/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsSectionsList (Spec §8.12 Part 05)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface SectionData {
  numeral: string;
  lead: string;
  accent: string;
  description: string;
  count: number;
}

interface RefundsSectionsListProps {
  activeTab: 'rental' | 'preloved';
  onSelectSection?: (sectionNumeral: string) => void;
}

export const RefundsSectionsList: React.FC<RefundsSectionsListProps> = ({
  activeTab,
  onSelectSection
}) => {
  const rentalSections: SectionData[] = [
    { numeral: '01', lead: 'Cancelling a ', accent: 'booking', description: 'What you receive depends on how close your rental start date is.', count: 17 },
    { numeral: '02', lead: 'Changing your ', accent: 'booking', description: 'Moving dates, swapping a piece, or keeping it a little longer.', count: 6 },
    { numeral: '03', lead: 'Delivery & ', accent: 'arrival', description: 'If anything is not right when your piece reaches you.', count: 19 },
    { numeral: '04', lead: 'During & after your ', accent: 'event', description: 'Returning it, and anything that happens in between.', count: 8 },
    { numeral: '05', lead: 'Your security ', accent: 'deposit', description: 'Fully refundable, and never a surprise.', count: 12 },
    { numeral: '06', lead: 'Refunds & ', accent: 'payments', description: 'Where your money goes, and how long it takes.', count: 11 },
    { numeral: '07', lead: 'When it is ', accent: 'on us', description: 'If we or our courier let you down, you never pay for it.', count: 6 },
    { numeral: '08', lead: 'Concerns & your ', accent: 'rights', description: 'If you disagree with a decision, or want to take something further.', count: 9 }
  ];

  const prelovedSections: SectionData[] = [
    { numeral: '01', lead: 'Cancelling a ', accent: 'purchase', description: 'Before dispatch and after.', count: 10 },
    { numeral: '02', lead: 'Authenticity & ', accent: 'condition', description: 'Our guarantee, and what to do if a piece is not as described.', count: 9 },
    { numeral: '03', lead: 'Delivery & ', accent: 'transit', description: 'When your piece arrives, and what happens if it is delayed.', count: 8 },
    { numeral: '04', lead: 'Returns & ', accent: 'inspections', description: 'When a return is accepted, and how it is handled.', count: 9 },
    { numeral: '05', lead: 'Refunds & ', accent: 'payouts', description: 'How quickly money returns to you.', count: 7 },
    { numeral: '06', lead: 'Relisting a ', accent: 'piece', description: 'If you decide to re-sell with House of Kaira.', count: 5 },
    { numeral: '07', lead: 'Disputes & consumer ', accent: 'rights', description: 'If you disagree with an assessment.', count: 5 }
  ];

  const sections = activeTab === 'rental' ? rentalSections : prelovedSections;

  return (
    <div className="space-y-4">
      {sections.map((sec) => (
        <div
          key={sec.numeral}
          onClick={() => onSelectSection?.(sec.numeral)}
          className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 sm:p-6 shadow-2xs hover:border-[#dbc8af] transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            <span className="font-mono text-sm text-[#935b1e] font-semibold shrink-0 pt-0.5">
              {sec.numeral}
            </span>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-normal group-hover:text-[#935b1e] transition-colors">
                  <span>{sec.lead}</span>
                  <span className="italic text-[#935b1e]">{sec.accent}</span>
                </h3>
                <span className="text-[11px] text-[#8a7f73] underline hover:text-[#1c1917] font-medium shrink-0">
                  {sec.count} questions
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

export default RefundsSectionsList;
