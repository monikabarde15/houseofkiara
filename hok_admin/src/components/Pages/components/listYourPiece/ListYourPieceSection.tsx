/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceSection (Spec §8.8, Pages 35-37)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData, FieldFocusInfo } from '../types';
import ListYourPieceHero from './ListYourPieceHero';
import ListYourPiecePromise from './ListYourPiecePromise';
import ListYourPieceThreePromises from './ListYourPieceThreePromises';
import ListYourPieceHowItWorks from './ListYourPieceHowItWorks';
import ListYourPieceEarningsPreview from './ListYourPieceEarningsPreview';
import ListYourPieceForm from './ListYourPieceForm';
import ListYourPieceForBoutiques from './ListYourPieceForBoutiques';
import ListYourPieceFAQ from './ListYourPieceFAQ';

interface ListYourPieceSectionProps {
  page: PageCardData;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
  onFocusField: (info: FieldFocusInfo | null) => void;
  highlightedFigureKey?: string | null;
  onSelectFigure?: (key: string) => void;
  onOpenAnswersView?: () => void;
  onOpenCheck?: (check: any) => void;
  hiddenParts?: Record<string, boolean>;
}

export const ListYourPieceSection: React.FC<ListYourPieceSectionProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  highlightedFigureKey,
  onSelectFigure,
  onOpenAnswersView,
  onOpenCheck,
  hiddenParts = {}
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-10 w-full max-w-[760px] mx-auto pb-16">
      {/* 01 Hero */}
      <ListYourPieceHero
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['hero']}
        onOpenCheck={onOpenCheck}
        onJumpToForm={() => scrollTo('the-form')}
        onJumpToHowItWorks={() => scrollTo('how-it-works')}
      />

      {/* 02 The Lister's Promise */}
      <ListYourPiecePromise
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['the-listers-promise']}
      />

      {/* 03 Three Promises */}
      <ListYourPieceThreePromises
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['three-promises']}
      />

      {/* 04 How It Works */}
      <ListYourPieceHowItWorks
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['how-it-works']}
      />

      {/* 05 Earnings preview */}
      <ListYourPieceEarningsPreview
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['earnings-preview']}
      />

      {/* 06 The Form */}
      <ListYourPieceForm
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['the-form']}
        onOpenCheck={onOpenCheck}
      />

      {/* 07 For Boutiques */}
      <ListYourPieceForBoutiques
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['for-boutiques']}
      />

      {/* 08 FAQ */}
      <ListYourPieceFAQ
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        highlightedFigureKey={highlightedFigureKey}
        onSelectFigure={onSelectFigure}
        hidden={hiddenParts['faq']}
        onOpenAnswersView={onOpenAnswersView}
      />
    </div>
  );
};

export default ListYourPieceSection;
