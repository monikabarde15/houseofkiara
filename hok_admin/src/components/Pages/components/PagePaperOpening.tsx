/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagePaperOpening (Spec §7.1, §7.6, Screen 20)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from './PagePaperCanvas';
import { PageOpeningContent } from '../data/pageContentRegistry';

interface PagePaperOpeningProps {
  activePartId: string;
  activeSide: 'rental' | 'preloved';
  openingContent: PageOpeningContent;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure: (key: string) => void;
  highlightedFigureKey?: string | null;
}

export const PagePaperOpening: React.FC<PagePaperOpeningProps> = ({
  activePartId,
  activeSide,
  openingContent,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure,
  highlightedFigureKey
}) => {
  const sideLabel = openingContent.sideLabel || (activeSide === 'rental' ? 'Rental policy' : 'Preloved policy');

  return (
    <section
      id="opening"
      onClick={() => onSelectPart('opening')}
      className={`relative space-y-3 cursor-pointer p-4 -m-4 rounded transition-colors ${
        activePartId === 'opening' ? 'ring-1 ring-[#bda67b]/50 bg-[#fffdfa]' : 'hover:bg-[#fcfaf7]'
      }`}
    >
      <div className="text-[10.5px] uppercase tracking-wider text-[#8a7f73]">
        {sideLabel}
      </div>

      <div
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('opening', 'opening_text', 'Opening statement', 'Sets expectations for customer orders and policies.');
        }}
        className={`text-[13.5px] text-[#4a4238] leading-relaxed transition-all p-1.5 rounded ${
          focusedField?.fieldId === 'opening_text' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:bg-[#faf7f2]'
        }`}
        contentEditable={focusedField?.fieldId === 'opening_text'}
        suppressContentEditableWarning
        onBlur={e => onFieldChange('opening_text', e.currentTarget.textContent || '')}
      >
        {getVal('opening_text', openingContent.text)}
      </div>

      {/* Embedded live figure row (Spec §7.6) */}
      {openingContent.figures && openingContent.figures.length > 0 && (
        <div className="p-3 bg-[#faf7f2] rounded border border-[#ebe5dc] text-[12.5px] text-[#4a4238] flex flex-wrap items-center gap-1.5">
          {openingContent.figures.map(fig => (
            <React.Fragment key={fig.key}>
              {fig.contextBefore && <span>{fig.contextBefore}</span>}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onSelectFigure(fig.key);
                }}
                className={`px-1.5 py-0.5 rounded bg-[#f6eee0] text-[#8a6a36] underline decoration-[#c5ad7d] decoration-1 font-serif cursor-pointer hover:bg-[#eedfc4] transition-colors ${
                  highlightedFigureKey === fig.key ? 'ring-2 ring-[#c5ad7d] bg-[#eedfc4]' : ''
                }`}
                title={`Click to view figure ${fig.key}`}
              >
                {fig.displayValue}
              </button>
              {fig.contextAfter && <span>{fig.contextAfter}</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
};

export default PagePaperOpening;
