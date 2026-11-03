/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsPaperSection (Spec §8.9, Screen 49)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData, FieldFocusInfo } from '../types';
import TermsHero from './TermsHero';
import TermsWhereToStart from './TermsWhereToStart';
import TermsOpening from './TermsOpening';
import TermsTheEssentials from './TermsTheEssentials';
import TermsPoliciesLine from './TermsPoliciesLine';
import TermsQuestionsBand from './TermsQuestionsBand';

interface TermsPaperSectionProps {
  page: PageCardData;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
  onFocusField: (info: FieldFocusInfo | null) => void;
  highlightedFigureKey?: string | null;
  onSelectFigure?: (key: string) => void;
  onOpenClausesView?: (clauseNum?: number) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
}

export const TermsPaperSection: React.FC<TermsPaperSectionProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  highlightedFigureKey,
  onSelectFigure,
  onOpenClausesView,
  onNavigateToPage,
  hiddenParts = {}
}) => {
  return (
    <div className="space-y-10 w-full max-w-[760px] mx-auto pb-16">
      {/* 01 Hero */}
      <TermsHero
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['hero']}
        onSelectClauseByTitle={title => onOpenClausesView?.()}
      />

      {/* 02 Where to start */}
      <TermsWhereToStart
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['where-to-start']}
        onOpenClauseRange={(start, end) => onOpenClausesView?.(start)}
      />

      {/* 03 Opening */}
      <TermsOpening
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['opening']}
      />

      {/* 04 The Essentials */}
      <TermsTheEssentials
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['the-essentials']}
        onOpenClause={num => onOpenClausesView?.(num)}
      />

      {/* Clauses 59 Quick Door Card */}
      <div className="p-6 bg-[#faf7f2] border border-[#e6dccb] rounded-[8px] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#8a6a36] uppercase font-semibold">
            Part 05 · Complete Agreement
          </span>
          <h3 className="font-serif text-xl text-[#1a1612] mt-0.5">
            59 Numbered Clauses across 12 Parts
          </h3>
          <p className="text-xs text-[#5c5248] mt-1">
            Every clause, sub-clause, and definition is managed in the Clauses workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenClausesView?.()}
          className="px-5 py-2.5 bg-[#8a6a36] text-white text-xs font-medium rounded hover:bg-[#785b2e] cursor-pointer transition-colors shadow-2xs shrink-0"
        >
          Open Clauses (59) →
        </button>
      </div>

      {/* 06 Our Policies */}
      <TermsPoliciesLine
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['our-policies']}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 07 Questions */}
      <TermsQuestionsBand
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['questions']}
      />
    </div>
  );
};

export default TermsPaperSection;
