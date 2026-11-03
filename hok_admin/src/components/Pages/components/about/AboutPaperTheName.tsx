/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperTheName (Spec §7.4, §8.6 Part 02, Screen 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperTheNameProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  isHidden?: boolean;
}

const NAME_LETTERS = [
  {
    letter: 'K',
    word: 'Keepsake',
    meaning: 'A piece made with devotion, meant to live beyond a single evening and outlast the season it was created in.'
  },
  {
    letter: 'A',
    word: 'Authentic',
    meaning: 'Pristine condition guaranteed, verified by master artisans before every wear and documented in detail.'
  },
  {
    letter: 'I',
    word: 'Inherited',
    meaning: 'Honouring the craft and hand-loomed heritage passed down across celebrations and generations.'
  },
  {
    letter: 'R',
    word: 'Revolving',
    meaning: 'Giving storied garments a second life and a new audience, keeping exceptional design in continuous motion.'
  },
  {
    letter: 'A',
    word: 'Affection',
    meaning: 'Personal concierge care, bespoke fitting adjustments, and botanical restoration for every silhouette.'
  }
];

export const AboutPaperTheName: React.FC<AboutPaperTheNameProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  isHidden = false
}) => {
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const isSelected = activePartId === 'the-name';
  const currentLetter = NAME_LETTERS[activeLetterIndex];

  return (
    <section
      id="the-name"
      onClick={() => onSelectPart('the-name')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 text-center space-y-6 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            The Name · hidden on the page
          </span>
        </div>
      )}

      <div className="space-y-2 max-w-xl mx-auto">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('the-name', 'about_name_eyebrow', 'Eyebrow', 'Small label above section title');
          }}
          contentEditable={focusedField?.fieldId === 'about_name_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_name_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'about_name_eyebrow'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none'
              : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('about_name_eyebrow', 'THE ORIGIN')}
        </span>

        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('the-name', 'about_name_heading', 'Heading', 'The Name section heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'about_name_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_name_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal text-[#1a1612] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_name_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          Where the story <span className="italic text-[#8a6a36]">begins</span>
        </h2>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('the-name', 'about_name_lead', 'Line under the heading', 'Subtitle for The Name');
          }}
          contentEditable={focusedField?.fieldId === 'about_name_lead'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_name_lead', e.currentTarget.textContent || '')}
          className={`text-xs text-[#73675a] leading-relaxed cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_name_lead' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal(
            'about_name_lead',
            'Every letter in our name holds a promise to the clothes we care for and the community who wears them.'
          )}
        </p>
      </div>

      {/* Five Letters Tabs */}
      <div className="pt-4 flex justify-center items-center gap-4 md:gap-7">
        {NAME_LETTERS.map((item, idx) => {
          const isActive = activeLetterIndex === idx;
          return (
            <button
              key={`${item.letter}-${idx}`}
              type="button"
              onClick={e => {
                e.stopPropagation();
                setActiveLetterIndex(idx);
              }}
              className={`font-serif text-[38px] md:text-[48px] font-light tracking-wider px-3 py-1 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#8a6a36] scale-110 border-b-2 border-[#bda67b]'
                  : 'text-[#8a7f73] hover:text-[#1a1612]'
              }`}
            >
              {item.letter}
            </button>
          );
        })}
      </div>

      {/* Active Letter Meaning Box (In-place editable) */}
      <div className="max-w-md mx-auto pt-4 p-5 bg-[#faf7f2] rounded-[8px] border border-[#f0ebe3] space-y-2">
        <h4
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('the-name', `about_letter_word_${activeLetterIndex}`, 'Word', `Word for letter ${currentLetter.letter}`);
          }}
          contentEditable={focusedField?.fieldId === `about_letter_word_${activeLetterIndex}`}
          suppressContentEditableWarning
          onInput={e => onFieldChange(`about_letter_word_${activeLetterIndex}`, e.currentTarget.textContent || '')}
          className={`font-serif text-[20px] text-[#1a1612] font-medium cursor-text p-1 rounded ${
            focusedField?.fieldId === `about_letter_word_${activeLetterIndex}` ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal(`about_letter_word_${activeLetterIndex}`, currentLetter.word)}
        </h4>
        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('the-name', `about_letter_meaning_${activeLetterIndex}`, 'What it means', `Meaning for letter ${currentLetter.letter}`);
          }}
          contentEditable={focusedField?.fieldId === `about_letter_meaning_${activeLetterIndex}`}
          suppressContentEditableWarning
          onInput={e => onFieldChange(`about_letter_meaning_${activeLetterIndex}`, e.currentTarget.textContent || '')}
          className={`text-xs text-[#5c5248] leading-relaxed cursor-text p-1 rounded ${
            focusedField?.fieldId === `about_letter_meaning_${activeLetterIndex}` ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal(`about_letter_meaning_${activeLetterIndex}`, currentLetter.meaning)}
        </p>
      </div>

      {/* The Close lines */}
      <div className="pt-2 text-xs text-[#8a7f73] space-y-1">
        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('the-name', 'about_name_close', 'Closing line', 'Closing line for The Name');
          }}
          contentEditable={focusedField?.fieldId === 'about_name_close'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_name_close', e.currentTarget.textContent || '')}
          className={`font-serif italic text-sm text-[#5c5248] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_name_close' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('about_name_close', 'Five letters, each holding a reason to wear again.')}
        </p>
        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('the-name', 'about_name_origin', 'Where the name comes from', 'Origin explanation');
          }}
          contentEditable={focusedField?.fieldId === 'about_name_origin'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_name_origin', e.currentTarget.textContent || '')}
          className={`cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_name_origin' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('about_name_origin', 'Named after the Sanskrit root for moonlight, and the timelessness of pieces kept safe.')}
        </p>
      </div>
    </section>
  );
};

export default AboutPaperTheName;
