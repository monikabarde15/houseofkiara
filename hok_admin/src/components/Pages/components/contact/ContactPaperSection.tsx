/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperSection (Spec §8.5, Screens 42 & 43)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';
import { ContactPaperHero } from './ContactPaperHero';
import { ContactPaperOpenClosed } from './ContactPaperOpenClosed';
import { ContactPaperReachCard } from './ContactPaperReachCard';
import { ContactPaperAnswersSection } from './ContactPaperAnswersSection';
import { ContactPaperWriteForm } from './ContactPaperWriteForm';
import { ContactPaperVisitCard } from './ContactPaperVisitCard';
import { ContactPaperArrivalNote } from './ContactPaperArrivalNote';
import { ContactPaperLegalDetails } from './ContactPaperLegalDetails';

interface ContactPaperSectionProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
  onOpenCheck?: () => void;
}

export const ContactPaperSection: React.FC<ContactPaperSectionProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure,
  onNavigateToPage,
  onOpenCheck
}) => {
  return (
    <>
      {/* 01 Hero */}
      <ContactPaperHero
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
      />

      {/* 02 Open or closed */}
      <ContactPaperOpenClosed
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onSelectFigure={onSelectFigure}
      />

      {/* 03 Ways to reach us */}
      <ContactPaperReachCard
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onSelectFigure={onSelectFigure}
        onOpenCheck={onOpenCheck}
      />

      {/* 04 Answers, any time */}
      <ContactPaperAnswersSection
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 05 Write us a note */}
      <ContactPaperWriteForm
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onSelectFigure={onSelectFigure}
      />

      {/* 06 Visit us in Indore */}
      <ContactPaperVisitCard
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onSelectFigure={onSelectFigure}
        onOpenCheck={onOpenCheck}
      />

      {/* 07 Just arrived */}
      <ContactPaperArrivalNote
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onSelectFigure={onSelectFigure}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 08 Raising a concern & 09 Our details */}
      <ContactPaperLegalDetails
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onSelectFigure={onSelectFigure}
        onNavigateToPage={onNavigateToPage}
      />
    </>
  );
};

export default ContactPaperSection;
