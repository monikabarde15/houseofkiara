/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksSection (Spec §8.7, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';
import { HowItWorksHero } from './HowItWorksHero';
import { HowItWorksWhatsOnPage } from './HowItWorksWhatsOnPage';
import { HowItWorksShoppingSteps } from './HowItWorksShoppingSteps';
import { HowItWorksTwoWaysToShop } from './HowItWorksTwoWaysToShop';
import { HowItWorksCraftDivider } from './HowItWorksCraftDivider';
import { HowItWorksListAndEarn } from './HowItWorksListAndEarn';
import { HowItWorksGoodToKnow } from './HowItWorksGoodToKnow';
import { HowItWorksFAQ } from './HowItWorksFAQ';
import { HowItWorksClosing } from './HowItWorksClosing';

interface HowItWorksSectionProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
  onSelectFigure?: (key: string) => void;
  onOpenAnswersView?: () => void;
  hiddenParts?: Record<string, boolean>;
  showLoopCard?: boolean;
  showInstagramLine?: boolean;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage,
  onSelectFigure,
  onOpenAnswersView,
  hiddenParts = {},
  showLoopCard = true,
  showInstagramLine = true
}) => {
  return (
    <>
      {/* 01 Hero */}
      <HowItWorksHero
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onJumpToPart={onSelectPart}
        isHidden={hiddenParts['hero']}
      />

      {/* 02 What's on this page */}
      <HowItWorksWhatsOnPage
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onJumpToPart={onSelectPart}
        isHidden={hiddenParts['whats-on-this-page']}
      />

      {/* 03 Shopping steps */}
      <HowItWorksShoppingSteps
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        showLoopCard={showLoopCard}
        isHidden={hiddenParts['shopping-steps']}
      />

      {/* 04 Two ways to shop */}
      <HowItWorksTwoWaysToShop
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onNavigateToPage={onNavigateToPage}
        isHidden={hiddenParts['two-ways-to-shop']}
      />

      {/* 05 The Craft divider */}
      <HowItWorksCraftDivider
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onSelectFigure={onSelectFigure}
        isHidden={hiddenParts['the-craft-divider']}
      />

      {/* 06 List & Earn */}
      <HowItWorksListAndEarn
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onNavigateToPage={onNavigateToPage}
        onSelectFigure={onSelectFigure}
        isHidden={hiddenParts['list-and-earn']}
      />

      {/* 07 Good to Know */}
      <HowItWorksGoodToKnow
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onNavigateToPage={onNavigateToPage}
        isHidden={hiddenParts['good-to-know']}
      />

      {/* 08 FAQ */}
      <HowItWorksFAQ
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onOpenAnswersView={onOpenAnswersView}
        isHidden={hiddenParts['faq']}
      />

      {/* 09 Closing */}
      <HowItWorksClosing
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onNavigateToPage={onNavigateToPage}
        showInstagramLine={showInstagramLine}
        isHidden={hiddenParts['closing']}
      />
    </>
  );
};

export default HowItWorksSection;
