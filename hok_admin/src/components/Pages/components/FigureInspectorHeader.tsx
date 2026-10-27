/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureInspectorHeader (Spec §5.2, Screen 04)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem } from '../types';
import { FIGURE_SUBJECTS } from '../data';

interface FigureInspectorHeaderProps {
  figure: FigureItem;
}

export const FigureInspectorHeader: React.FC<FigureInspectorHeaderProps> = ({ figure }) => {
  const subjectMeta = FIGURE_SUBJECTS.find(s => s.id === figure.subject);
  const subjectLabel = subjectMeta ? subjectMeta.label : figure.subject;

  return (
    <div className="space-y-2">
      {/* Subject and Badges Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[12px] text-[#73675a] font-normal">
          {subjectLabel}
        </span>
        <div className="inline-flex items-center gap-1.5 flex-wrap">
          {figure.status === 'waiting' && (
            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#fdf4eb] text-[#a25828] text-[10.5px] font-medium">
              Waiting for a decision
            </span>
          )}
          {figure.status === 'retired' && (
            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#faeae6] text-[#b85c38] text-[10.5px] font-medium">
              Retired
            </span>
          )}
          {(figure.owner === 'Never printed' || figure.status === 'never-printed') && (
            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#f4f2ee] text-[#5c5248] text-[10.5px] font-medium">
              Never printed
            </span>
          )}
          {(figure.isLocked || figure.locked) && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-[#f4f2ee] text-[#5c5248] text-[10.5px]">
              <svg className="w-3 h-3 text-[#73675a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Locked
            </span>
          )}
          {figure.hasPendingChange && (
            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#fdf8e6] text-[#8a6a36] text-[10.5px] font-medium">
              Change waiting
            </span>
          )}
          {figure.hasScheduled && !figure.hasPendingChange && (
            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#eef4f8] text-[#2c5270] text-[10.5px] font-medium">
              Scheduled
            </span>
          )}
        </div>
      </div>

      {/* Figure Name in Serif Cormorant Garamond */}
      <h2 className="font-serif text-[24px] md:text-[26px] font-normal text-[#1a1612] leading-tight">
        {figure.label}
      </h2>

      {/* Description */}
      <p className="text-[13px] text-[#4a4238] leading-relaxed">
        {figure.notes || figure.description}
      </p>

      {/* Name in the page files line */}
      <div className="text-[11px] font-mono text-[#8a7f73] pt-1">
        Name in the page files: <span className="text-[#5c5248]">{figure.key}</span>
        {figure.legacyValues && figure.legacyValues.length > 0 && (
          <span> · also written as <span className="text-[#5c5248]">{figure.legacyValues[0].writtenAs}</span></span>
        )}
      </div>
    </div>
  );
};

export default FigureInspectorHeader;
