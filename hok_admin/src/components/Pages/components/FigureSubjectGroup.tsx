/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureSubjectGroup (Spec §5.1, Screens 04 & 05)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem, FigureSubjectMeta } from '../types';
import { FigureRow } from './FigureRow';

interface FigureSubjectGroupProps {
  subject: FigureSubjectMeta;
  figures: FigureItem[];
  selectedKey: string;
  onSelectFigure: (key: string) => void;
}

export const FigureSubjectGroup: React.FC<FigureSubjectGroupProps> = ({
  subject,
  figures,
  selectedKey,
  onSelectFigure
}) => {
  if (figures.length === 0) return null;

  return (
    <section className="space-y-2 mb-6">
      {/* Group Title and Line (Spec §5.1) */}
      <div>
        <h2 className="font-serif text-[18px] md:text-[20px] font-normal text-[#1a1612]">
          {subject.label}
        </h2>
        <p className="text-[12px] text-[#73675a] mt-0.5">
          {subject.description}
        </p>
      </div>

      {/* Figures Table Card */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] overflow-hidden divide-y divide-[#f0ebe3] shadow-2xs">
        {figures.map(fig => (
          <FigureRow
            key={fig.key}
            figure={fig}
            isSelected={fig.key === selectedKey}
            onSelect={onSelectFigure}
          />
        ))}
      </div>
    </section>
  );
};

export default FigureSubjectGroup;
