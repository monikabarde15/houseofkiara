/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagePaperCanvas (Spec §7.1, §7.3, §7.4, §7.5, §7.6, §7.11)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../types';
import { CheckItem } from '../types/checks.types';
import { FloatingWordBar } from './FloatingWordBar';
import { FigurePickerPopover } from './FigurePickerPopover';
import { LinkPickerPopover } from './LinkPickerPopover';
import { PagePaperHero } from './PagePaperHero';
import { PagePaperOpening } from './PagePaperOpening';
import { MarginCheckMark } from './MarginCheckMark';
import { getPageContent } from '../data/pageContentRegistry';

export interface EditableFieldInfo {
  partId: string;
  fieldId: string;
  fieldName: string;
  helpText?: string;
  isHeading?: boolean;
}

interface PagePaperCanvasProps {
  page: PageCardData;
  activePartId: string;
  onSelectPart: (partId: string) => void;
  onSelectFigure: (key: string) => void;
  onOpenAnswersView?: () => void;
  onOpenCheck?: (check: CheckItem) => void;
  focusedField: EditableFieldInfo | null;
  onFocusField: (info: EditableFieldInfo | null) => void;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
  highlightedFigureKey?: string | null;
}

export const PagePaperCanvas: React.FC<PagePaperCanvasProps> = ({
  page,
  activePartId,
  onSelectPart,
  onSelectFigure,
  onOpenAnswersView,
  onOpenCheck,
  focusedField,
  onFocusField,
  fieldValues,
  onFieldChange,
  highlightedFigureKey
}) => {
  const [activeSide, setActiveSide] = useState<'rental' | 'preloved'>('rental');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);

  const pageContent = getPageContent(page.slug);
  const getVal = (id: string, fallback: string) => (fieldValues[id] !== undefined ? fieldValues[id] : fallback);

  const handleFieldFocus = (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading = false) => {
    onSelectPart(partId);
    onFocusField({ partId, fieldId, fieldName, helpText, isHeading });
  };

  const handleInsertFigure = (fig: FigureItem) => {
    if (!focusedField) return;
    const current = getVal(focusedField.fieldId, '');
    onFieldChange(focusedField.fieldId, `${current} ${fig.displayValue}`.trim());
    setPickerOpen(false);
  };

  const handleSaveLink = (words: string) => {
    if (!focusedField) return;
    const current = getVal(focusedField.fieldId, '');
    onFieldChange(focusedField.fieldId, `${current} [${words}]`.trim());
    setLinkOpen(false);
  };

  const openingChecks: CheckItem[] = [
    {
      id: 'chk_opening_figure',
      pageSlug: page.slug,
      pageName: page.name,
      location: 'Opening statement',
      kind: 'typed-figure',
      importance: 'medium',
      title: 'A figure typed by hand: "24 hours"',
      detail: 'Typed words equal order_cancel_window today, so they will not move when the figure does.',
      surroundingWords: 'You may cancel any rental order up to 24 hours after placing it',
      suggestedFigureKey: 'order_cancel_window'
    }
  ];

  return (
    <div className="flex-1 min-w-0 flex flex-col items-center select-text">
      {/* Paper Sheet (max-w-[760px], Spec §7.3) */}
      <div className="w-full max-w-[760px] bg-white border border-[#ebe5dc] rounded-[8px] shadow-[0_4px_24px_rgba(26,22,18,0.06)] p-8 md:p-12 space-y-10 relative">

        {/* Floating Bar above active focused words (Spec §7.5) */}
        {focusedField && (
          <div className="sticky top-2 z-40 flex justify-center w-full pointer-events-none mb-2">
            <div className="pointer-events-auto">
              <FloatingWordBar
                isHeading={focusedField.isHeading}
                onBoldClick={() => {}}
                onLinkClick={() => setLinkOpen(true)}
                onAddFigureClick={() => setPickerOpen(true)}
                onGoldItalicClick={() => {}}
              />
              {pickerOpen && (
                <FigurePickerPopover
                  pageSlug={page.slug}
                  onSelectFigure={handleInsertFigure}
                  onClose={() => setPickerOpen(false)}
                  style={{ top: '38px', left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
              {linkOpen && (
                <LinkPickerPopover
                  initialWords={getVal(focusedField.fieldId, '').slice(0, 30)}
                  onSaveLink={handleSaveLink}
                  onClose={() => setLinkOpen(false)}
                  style={{ top: '38px', left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
            </div>
          </div>
        )}

        {/* Part 1: Hero */}
        <PagePaperHero
          activePartId={activePartId}
          heroContent={pageContent.hero}
          focusedField={focusedField}
          getVal={getVal}
          onSelectPart={onSelectPart}
          onFieldFocus={handleFieldFocus}
          onFieldChange={onFieldChange}
        />

        <div className="border-b border-dashed border-[#e6dccb]" />

        {/* Part 2: Two policies (Interactive sides toggle if supported) */}
        {pageContent.hasTwoSides && (
          <>
            <section
              id="two-policies"
              onClick={() => onSelectPart('two-policies')}
              className={`relative space-y-4 cursor-pointer p-4 -m-4 rounded transition-colors ${
                activePartId === 'two-policies' ? 'ring-1 ring-[#bda67b]/50 bg-[#fffdfa]' : 'hover:bg-[#fcfaf7]'
              }`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={e => {
                    e.stopPropagation();
                    setActiveSide('rental');
                    onSelectPart('two-policies');
                  }}
                  className={`p-4 rounded-[6px] border transition-all cursor-pointer ${
                    activeSide === 'rental'
                      ? 'bg-[#1a1612] text-white border-[#1a1612] shadow-sm'
                      : 'bg-white text-[#1a1612] border-[#ebe5dc] hover:border-[#bda67b]'
                  }`}
                >
                  <div className={`text-[10px] uppercase tracking-wider mb-1 ${activeSide === 'rental' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'}`}>
                    For every rental
                  </div>
                  <div className="font-serif text-[18px]">Rental policy</div>
                  <div className={`text-[11px] mt-0.5 ${activeSide === 'rental' ? 'text-white/70' : 'text-[#73675a]'}`}>
                    {pageContent.rentalAnswersCount || 68} answers
                  </div>
                </div>

                <div
                  onClick={e => {
                    e.stopPropagation();
                    setActiveSide('preloved');
                    onSelectPart('two-policies');
                  }}
                  className={`p-4 rounded-[6px] border transition-all cursor-pointer ${
                    activeSide === 'preloved'
                      ? 'bg-[#1a1612] text-white border-[#1a1612] shadow-sm'
                      : 'bg-white text-[#1a1612] border-[#ebe5dc] hover:border-[#bda67b]'
                  }`}
                >
                  <div className={`text-[10px] uppercase tracking-wider mb-1 ${activeSide === 'preloved' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'}`}>
                    For every preloved piece
                  </div>
                  <div className="font-serif text-[18px]">Preloved policy</div>
                  <div className={`text-[11px] mt-0.5 ${activeSide === 'preloved' ? 'text-white/70' : 'text-[#73675a]'}`}>
                    {pageContent.prelovedAnswersCount || 53} answers · Show this side
                  </div>
                </div>
              </div>
            </section>
            <div className="border-b border-dashed border-[#e6dccb]" />
          </>
        )}

        {/* Part 3: Opening Statement with live figure tokens & margin check mark */}
        <div className="relative">
          <PagePaperOpening
            activePartId={activePartId}
            activeSide={activeSide}
            openingContent={pageContent.opening}
            focusedField={focusedField}
            getVal={getVal}
            onSelectPart={onSelectPart}
            onFieldFocus={handleFieldFocus}
            onFieldChange={onFieldChange}
            onSelectFigure={onSelectFigure}
            highlightedFigureKey={highlightedFigureKey}
          />
          <MarginCheckMark
            checks={openingChecks}
            onClick={c => onOpenCheck && onOpenCheck(c)}
          />
        </div>

        <div className="border-b border-dashed border-[#e6dccb]" />

        {/* Part 4: Answers Card */}
        <section
          id="answers"
          onClick={() => onSelectPart('answers')}
          className={`relative p-5 rounded-[8px] border-2 border-dashed border-[#e6dccb] bg-[#faf7f2]/60 space-y-3 cursor-pointer transition-colors ${
            activePartId === 'answers' ? 'border-[#bda67b] bg-[#fffdfa]' : 'hover:bg-[#faf7f2]'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-medium text-[#1a1612]">
              {page.wordsCount || 103} answers, each a question the page opens as it is asked
            </h3>
            {onOpenAnswersView && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onOpenAnswersView();
                }}
                className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
              >
                Open the answers →
              </button>
            )}
          </div>
          <p className="text-[12px] text-[#73675a]">
            They are written in the Answers view, with a list to find one in.
          </p>
        </section>
      </div>

      {/* Footnote under paper (Spec §7.3) */}
      <div className="py-4 text-center text-xs text-[#73675a]">
        Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
      </div>
    </div>
  );
};

export default PagePaperCanvas;
