/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperSection (Spec §8.6, Screens 44, 45, 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';
import { AboutPaperHero } from './AboutPaperHero';
import { AboutPaperTheName } from './AboutPaperTheName';
import { AboutPaperManifesto } from './AboutPaperManifesto';
import { AboutPaperWhatWeBelieve } from './AboutPaperWhatWeBelieve';
import { AboutPaperTwoSides } from './AboutPaperTwoSides';
import { AboutPaperFromFounder } from './AboutPaperFromFounder';
import { AboutPaperWhyWeBuiltIt } from './AboutPaperWhyWeBuiltIt';
import { AboutPaperThreeWays } from './AboutPaperThreeWays';
import { AboutPaperClosing } from './AboutPaperClosing';

interface AboutPaperSectionProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
  showCircularMark?: boolean;
  showFourthWayLine?: boolean;
  showInstagramLine?: boolean;
}

export const AboutPaperSection: React.FC<AboutPaperSectionProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage,
  hiddenParts = {},
  showCircularMark = true,
  showFourthWayLine = true,
  showInstagramLine = true
}) => {
  return (
    <>
      {/* 01 Hero */}
      <AboutPaperHero
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        isHidden={hiddenParts['hero']}
      />

      {/* 02 The Name */}
      <AboutPaperTheName
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        isHidden={hiddenParts['the-name']}
      />

      {/* 03 Manifesto */}
      <AboutPaperManifesto
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        isHidden={hiddenParts['manifesto']}
      />

      {/* 04 What We Believe */}
      <AboutPaperWhatWeBelieve
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        isHidden={hiddenParts['what-we-believe']}
      />

      {/* 05 Two Sides */}
      <AboutPaperTwoSides
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        isHidden={hiddenParts['two-sides']}
      />

      {/* 06 From The Founder */}
      <AboutPaperFromFounder
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        isHidden={hiddenParts['from-the-founder']}
      />

      {/* 07 Why We Built It */}
      <AboutPaperWhyWeBuiltIt
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        isHidden={hiddenParts['why-we-built-it']}
        showMark={showCircularMark}
      />

      {/* 08 Three Ways */}
      <AboutPaperThreeWays
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onNavigateToPage={onNavigateToPage}
        isHidden={hiddenParts['three-ways']}
        showFourthWayLine={showFourthWayLine}
      />

      {/* 09 Closing */}
      <AboutPaperClosing
        activePartId={activePartId}
        focusedField={focusedField}
        getVal={getVal}
        onSelectPart={onSelectPart}
        onFieldFocus={onFieldFocus}
        onFieldChange={onFieldChange}
        onNavigateToPage={onNavigateToPage}
        isHidden={hiddenParts['closing']}
        showInstagramLine={showInstagramLine}
      />
    </>
  );
};

export default AboutPaperSection;
