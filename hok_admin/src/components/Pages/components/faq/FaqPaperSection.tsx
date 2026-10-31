/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaperSection (Spec §8.4, Screens 39, 40)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';
import { AnswerItem } from '../../types';
import { FaqPaperHero } from './FaqPaperHero';
import { FaqPaperMoments } from './FaqPaperMoments';
import { FaqPaperHygiene } from './FaqPaperHygiene';
import { FaqPaperMostAsked } from './FaqPaperMostAsked';
import { FaqPaperFullPolicies } from './FaqPaperFullPolicies';
import { FaqPaperStillWondering } from './FaqPaperStillWondering';

interface FaqPaperSectionProps {
  activePartId: string;
  activeSide: 'rental' | 'preloved';
  onSideChange: (side: 'rental' | 'preloved') => void;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  answers: AnswerItem[];
  onOpenAnswersView?: (questionId?: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const FaqPaperSection: React.FC<FaqPaperSectionProps> = ({
  activePartId,
  activeSide,
  onSideChange,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  answers,
  onOpenAnswersView,
  onNavigateToPage
}) => {
  return (
    <>
      {/* 01 Hero */}
      <FaqPaperHero
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onSelectQuestionId={onOpenAnswersView}
      />

      {/* 02 Moments */}
      <FaqPaperMoments
        activePartId={activePartId}
        selectedMomentId={activeSide === 'preloved' ? 'preloved' : 'before'}
        onSelectMomentId={id => onSideChange(id === 'preloved' ? 'preloved' : 'rental')}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        momentQuestions={answers}
        onOpenQuestionView={onOpenAnswersView}
      />

      {/* 03 Hygiene promise */}
      <FaqPaperHygiene
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onOpenQuestionView={onOpenAnswersView}
      />

      {/* 04 Answers Banner on the paper */}
      <div id="answers" className="mt-12 p-6 rounded-[8px] border border-[#e6dccb] bg-[#fbf9f5] flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-[#8a6a36] uppercase block mb-1">
            Part 04 · Canonical Knowledge Base
          </span>
          <h4 className="font-serif text-lg text-[#1a1612]">
            One hundred and twenty canonical answers
          </h4>
          <p className="text-xs text-[#73675a] mt-0.5">
            Every answer is edited in the dedicated Answers view alongside the question list, tokens, and verification status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAnswersView?.()}
          className="shrink-0 px-4 py-2 rounded-[6px] bg-[#1a1612] text-[#f7f2ea] text-xs font-medium hover:bg-[#8a6a36] transition cursor-pointer shadow-2xs"
        >
          Open Answers workspace ({answers.length || 120}) →
        </button>
      </div>

      {/* 05 Most asked */}
      <FaqPaperMostAsked
        onOpenQuestion={qText => {
          const match = answers.find(a => a.question.toLowerCase().includes(qText.toLowerCase().slice(0, 20)));
          onOpenAnswersView?.(match?.id);
        }}
      />

      {/* 07 Full policies */}
      <FaqPaperFullPolicies
        lastReviewed="17 September 2026"
        onNavigateToPage={onNavigateToPage}
      />

      {/* 08 Still wondering */}
      <FaqPaperStillWondering
        whatsappNumber="+91 93401 39300"
        supportEmail="concierge@houseofkaira.com"
      />
    </>
  );
};

export default FaqPaperSection;
