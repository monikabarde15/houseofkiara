/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperClosing (Spec §7.4, §8.6 Part 09, Screen 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperClosingProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
  showInstagramLine?: boolean;
  isHidden?: boolean;
}

export const AboutPaperClosing: React.FC<AboutPaperClosingProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage,
  showInstagramLine = true,
  isHidden = false
}) => {
  const isSelected = activePartId === 'closing';

  return (
    <section
      id="closing"
      onClick={() => onSelectPart('closing')}
      className={`mt-10 relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-12 text-center transition-all cursor-pointer ${
        isHidden ? 'opacity-50 ring-1 ring-dashed ring-[#b85c38]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#f5d77f] bg-[#2b241b] border border-[#b85c38] px-2.5 py-0.5 rounded-full">
            Closing · hidden on the page
          </span>
        </div>
      )}

      <div className="max-w-xl mx-auto space-y-4">
        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('closing', 'about_closing_heading', 'Heading', 'Closing section heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'about_closing_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_closing_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal leading-tight text-[#f7f2ea] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_closing_heading' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/40'
          }`}
        >
          Your piece’s <span className="italic text-[#d4af37]">next chapter</span> starts here.
        </h2>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('closing', 'about_closing_sub', 'Line under the heading', 'Closing explanation');
          }}
          contentEditable={focusedField?.fieldId === 'about_closing_sub'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_closing_sub', e.currentTarget.textContent || '')}
          className={`text-xs text-[#dcd4c7] leading-relaxed cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_closing_sub' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/30'
          }`}
        >
          {getVal(
            'about_closing_sub',
            'Whether you are dressing for your best friend’s sangeet or giving an heirloom bridal lehenga a second life, we are here in Indore to guide every step.'
          )}
        </p>

        {/* Two buttons */}
        <div className="pt-4 flex flex-wrap justify-center items-center gap-3">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onNavigateToPage?.('/catalogue');
            }}
            className="px-6 py-2.5 rounded-[4px] bg-[#d4af37] text-[#1a1612] text-xs font-semibold tracking-wider uppercase hover:bg-[#c29f2f] transition cursor-pointer"
          >
            {getVal('about_closing_btn1', 'RENT YOUR FIRST PIECE')}
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onNavigateToPage?.('/list-your-piece');
            }}
            className="px-6 py-2.5 rounded-[4px] bg-[#2b241b] border border-[#4a3f33] text-xs font-semibold text-[#f7f2ea] tracking-wider uppercase hover:bg-[#342c23] transition cursor-pointer"
          >
            {getVal('about_closing_btn2', 'LIST YOUR WARDROBE')}
          </button>
        </div>

        {/* Instagram line (Spec §8.6 Part 09) */}
        {showInstagramLine && (
          <div className="pt-3 text-[11.5px] text-[#a89d8d]">
            <span
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('closing', 'about_instagram_lead', 'The words before it', 'Words before handle');
              }}
              contentEditable={focusedField?.fieldId === 'about_instagram_lead'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_instagram_lead', e.currentTarget.textContent || '')}
              className="cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#d4af37]/30"
            >
              {getVal('about_instagram_lead', 'Follow our celebrations on Instagram at ')}
            </span>
            <span className="text-[#f5d77f] font-mono">@houseofkaira</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutPaperClosing;
