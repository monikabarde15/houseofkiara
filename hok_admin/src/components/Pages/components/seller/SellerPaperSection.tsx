/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerPaperSection (Spec § 8.17, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useEffect } from 'react';
import SellerHero from './SellerHero';
import SellerProtectionSection from './SellerProtectionSection';
import SellerChaptersSection from './SellerChaptersSection';
import SellerClosingSection from './SellerClosingSection';
import { EditableFieldProps } from '../types';

interface SellerPaperSectionProps extends EditableFieldProps {
  page: any;
  activePartId?: string;
  onSelectPart?: (partId: string) => void;
  onOpenAnswersView?: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
}

export const SellerPaperSection: React.FC<SellerPaperSectionProps> = ({
  page,
  activePartId = 'hero',
  onSelectPart,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onOpenAnswersView,
  onSelectFigure,
  onNavigateToPage,
  hiddenParts = {}
}) => {
  useEffect(() => {
    if (!activePartId || activePartId === 'answers') return;
    const el = document.getElementById(activePartId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activePartId]);

  const getSectionClasses = (partId: string) => {
    const isSelected = activePartId === partId;
    return `transition-all rounded-[10px] cursor-pointer ${
      isSelected
        ? 'ring-2 ring-[#bda67b] ring-offset-4 ring-offset-[#fffefb]'
        : 'hover:ring-1 hover:ring-[#bda67b]/50'
    }`;
  };

  return (
    <div className="max-w-[780px] mx-auto w-full space-y-6 pt-2 pb-16">
      {/* 01: Hero */}
      {!hiddenParts['hero'] && (
        <section
          id="hero"
          onClick={() => onSelectPart?.('hero')}
          className={getSectionClasses('hero')}
        >
          <SellerHero
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenProtection={() => onSelectPart?.('your-piece-protected')}
          />
        </section>
      )}

      {/* 02: Your piece, protected */}
      {!hiddenParts['your-piece-protected'] && (
        <section
          id="your-piece-protected"
          onClick={() => onSelectPart?.('your-piece-protected')}
          className={getSectionClasses('your-piece-protected')}
        >
          <SellerProtectionSection
            onScrollToProtect={() => onSelectPart?.('chapters')}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 03: Chapters (Screen 58) */}
      {!hiddenParts['chapters'] && (
        <section
          id="chapters"
          onClick={() => onSelectPart?.('chapters')}
          className={getSectionClasses('chapters')}
        >
          <SellerChaptersSection
            onSelectFigure={onSelectFigure}
            onOpenAnswersView={onOpenAnswersView}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 04: Closing */}
      {!hiddenParts['closing'] && (
        <section
          id="closing"
          onClick={() => onSelectPart?.('closing')}
          className={getSectionClasses('closing')}
        >
          <SellerClosingSection
            onNavigateToPage={onNavigateToPage}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}
    </div>
  );
};

export default SellerPaperSection;
