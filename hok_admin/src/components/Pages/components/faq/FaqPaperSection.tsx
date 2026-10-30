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
  onOpenAnswersView
}) => {
  return (
    <>
      <FaqPaperHero
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onSelectQuestionId={onOpenAnswersView}
      />
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
      <FaqPaperHygiene
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onOpenQuestionView={onOpenAnswersView}
      />
    </>
  );
};

export default FaqPaperSection;
