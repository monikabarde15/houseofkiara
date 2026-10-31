/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperManifesto (Spec §7.4, §8.6 Part 03, Screens 44 & 45)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperManifestoProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  isHidden?: boolean;
}

export const AboutPaperManifesto: React.FC<AboutPaperManifestoProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  isHidden = false
}) => {
  const isSelected = activePartId === 'manifesto';

  return (
    <section
      id="manifesto"
      onClick={() => onSelectPart('manifesto')}
      className={`mt-10 relative rounded-[10px] bg-[#fffefb] p-10 md:p-14 text-center transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : 'border border-[#e6dccb]'
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge if toggled off in settings (Screen 45) */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            Manifesto · hidden on the page
          </span>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Quote mark */}
        <div className="font-serif text-[42px] leading-none text-[#bda67b]">
          “
        </div>

        {/* The Quote Statement */}
        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('manifesto', 'about_manifesto_quote', 'Quote', 'Main manifesto pulled quote', true);
          }}
          contentEditable={focusedField?.fieldId === 'about_manifesto_quote'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_manifesto_quote', e.currentTarget.textContent || '')}
          className={`font-serif italic text-[28px] md:text-[36px] font-normal leading-snug text-[#8a6a36] cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'about_manifesto_quote'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none'
              : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('about_manifesto_quote', 'Every garment deserves a second standing ovation.')}
        </h2>

        {/* Paragraph under quote */}
        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('manifesto', 'about_manifesto_body', 'Paragraph under it', 'Manifesto narrative paragraph');
          }}
          contentEditable={focusedField?.fieldId === 'about_manifesto_body'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_manifesto_body', e.currentTarget.textContent || '')}
          className={`text-[13px] md:text-sm text-[#73675a] leading-relaxed cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'about_manifesto_body'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#1a1612] outline-none'
              : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal(
            'about_manifesto_body',
            'We do not sell clothes, we give them somewhere to go next. A lehenga that watched one wedding does not retire after it. It waits, carefully kept, for its next entrance.'
          )}
        </p>
      </div>
    </section>
  );
};

export default AboutPaperManifesto;
