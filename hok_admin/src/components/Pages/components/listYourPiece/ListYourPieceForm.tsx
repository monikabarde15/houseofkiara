/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceForm (Spec §8.8 Part 06, Screen 48)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPieceFormProps extends EditableFieldProps {
  hidden?: boolean;
  onOpenCheck?: (check: any) => void;
}

export const ListYourPieceForm: React.FC<ListYourPieceFormProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  highlightedFigureKey,
  onSelectFigure,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;
  const [activeFormStep, setActiveFormStep] = useState<number>(1);

  return (
    <section
      id="the-form"
      className={`p-8 md:p-12 bg-white rounded-[10px] border border-[#ebe5dc] shadow-sm space-y-8 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      {/* Top Green Accent Border Line */}
      <div className="h-0.5 w-full bg-[#5c7a53] -mt-2 mb-4 rounded-full" />

      {/* Form Header (Screen 48) */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_form_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker above form' })}
          onBlur={e => onFieldChange?.('lyp_form_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.25em] uppercase text-[#5c7a53] font-medium outline-none focus:ring-1 focus:ring-[#5c7a53] px-1 rounded cursor-text"
        >
          {getVal('lyp_form_eyebrow', '— THE FORM —')}
        </span>

        <h2 className="font-serif text-3xl md:text-4xl text-[#1a1612]">
          <span>Tell us about </span>
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField?.({ fieldId: 'lyp_form_head_italic', fieldName: 'Heading green phrase', helpText: 'Green italic emphasis in form headline' })}
            onBlur={e => onFieldChange?.('lyp_form_head_italic', e.currentTarget.textContent || '')}
            className="italic text-[#47633c] font-normal outline-none focus:ring-1 focus:ring-[#5c7a53] px-1 rounded cursor-text"
          >
            {getVal('lyp_form_head_italic', 'your piece')}
          </span>
        </h2>

        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_form_lead', fieldName: 'Line under heading', helpText: 'Lead text under form heading' })}
          onBlur={e => onFieldChange?.('lyp_form_lead', e.currentTarget.textContent || '')}
          className="text-xs md:text-sm text-[#5c5248] leading-relaxed outline-none focus:ring-1 focus:ring-[#5c7a53] px-1 rounded cursor-text"
        >
          {getVal('lyp_form_lead', "The fewer surprises later, the better. Fill what you can, and we will follow up on anything we need.")}
        </p>

        <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-[#f5f8f3] border border-[#d8e3d3] rounded-full text-[11px] text-[#47633c] font-medium mt-1">
          <span>⏱</span>
          <span>Takes about 4 to 5 minutes</span>
        </div>
      </div>

      {/* Step Indicator Tabs */}
      <div className="flex items-center justify-between border-b border-[#ebe5dc] pb-3 text-xs overflow-x-auto gap-2">
        {[
          { num: 1, label: 'Your Details' },
          { num: 2, label: 'About the Piece' },
          { num: 3, label: 'Photographs' },
          { num: 4, label: 'Listing Preference' },
          { num: 5, label: 'Review & Submit' }
        ].map(s => (
          <button
            key={s.num}
            type="button"
            onClick={() => setActiveFormStep(s.num)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] cursor-pointer transition-colors whitespace-nowrap ${
              activeFormStep === s.num
                ? 'bg-[#47633c] text-white font-medium'
                : 'text-[#73675a] hover:bg-[#faf7f2]'
            }`}
          >
            <span className="font-mono text-[11px]">{s.num}.</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Form Step 1: Your Details (Screen 48) */}
      <div className={`space-y-4 pt-2 ${activeFormStep === 1 || activeFormStep === 0 ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-[#47633c] text-[#47633c] text-[11px] font-mono flex items-center justify-center font-semibold">
              1
            </span>
            <span className="font-serif text-lg text-[#1a1612]">Your Details</span>
          </div>
          <span className="text-xs text-[#8a7f73] italic">So we know who to call</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Full Name <span className="text-[#b85c38]">*</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="e.g. Priya Sharma"
              className="w-full h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#1a1612] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              City <span className="text-[#b85c38]">*</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="e.g. Mumbai, Indore, Delhi NCR"
              className="w-full h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#1a1612] focus:outline-none"
            />
            <div className="text-[11px] text-[#8a7f73] mt-1 flex items-center gap-1">
              <span>We currently collect from</span>
              <span
                onClick={() => onSelectFigure?.('pickup_cities')}
                className={`font-serif px-1 rounded cursor-pointer ${
                  highlightedFigureKey === 'pickup_cities'
                    ? 'ring-2 ring-[#c5ad7d] bg-[#faf1da] text-[#8a6a36]'
                    : 'bg-[#faf1da] text-[#8a6a36] border border-[#e6d8b5]'
                }`}
              >
                10
              </span>
              <span>cities. More coming soon.</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Email <span className="text-[#b85c38]">*</span>
            </label>
            <input
              type="email"
              readOnly
              placeholder="priya@example.com"
              className="w-full h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#1a1612] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Mobile Number <span className="text-[#b85c38]">*</span>
            </label>
            <input
              type="tel"
              readOnly
              placeholder="+91 98765 43210"
              className="w-full h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#1a1612] focus:outline-none"
            />
            <span className="text-[11px] text-[#8a7f73] mt-1 block italic">WhatsApp preferred</span>
          </div>
        </div>
      </div>

      {/* Form Step 2: About the Piece (Screen 48) */}
      <div className={`space-y-4 pt-4 border-t border-[#f0ebe3] ${activeFormStep === 2 || activeFormStep === 0 ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-[#47633c] text-[#47633c] text-[11px] font-mono flex items-center justify-center font-semibold">
              2
            </span>
            <span className="font-serif text-lg text-[#1a1612]">About the Piece</span>
          </div>
          <span className="text-xs text-[#8a7f73] italic">The essentials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Piece Type <span className="text-[#b85c38]">*</span>
            </label>
            <div className="h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#5c5248] flex items-center justify-between">
              <span>Select piece type...</span>
              <span className="text-[#8a7f73]">∨</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Designer / Brand <span className="text-[#8a7f73] font-normal lowercase">(optional)</span>
            </label>
            <div className="h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#5c5248] flex items-center justify-between">
              <span>Select designer or enter name...</span>
              <span className="text-[#8a7f73]">∨</span>
            </div>
            <span className="text-[11px] text-[#8a7f73] mt-1 block italic">
              Unbranded pieces are welcome: enter "bespoke" or "local designer".
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Size <span className="text-[#8a7f73] font-normal lowercase">(optional)</span>
            </label>
            <div className="h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#5c5248] flex items-center justify-between">
              <span>Select size (XS, S, M, L, XL)...</span>
              <span className="text-[#8a7f73]">∨</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Colour Family <span className="text-[#8a7f73] font-normal lowercase">(optional)</span>
            </label>
            <div className="h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#5c5248] flex items-center justify-between">
              <span>Select colour family...</span>
              <span className="text-[#8a7f73]">∨</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Times Worn <span className="text-[#8a7f73] font-normal lowercase">(optional)</span>
            </label>
            <div className="h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#5c5248] flex items-center justify-between">
              <span>Never worn, 1 to 2 times, etc.</span>
              <span className="text-[#8a7f73]">∨</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5c5248] mb-1">
              Condition <span className="text-[#b85c38]">*</span>
            </label>
            <div className="h-10 px-3 rounded-[6px] border border-[#dcd4c7] bg-[#faf7f2]/50 text-xs text-[#5c5248] flex items-center justify-between">
              <span>Brand New With Tags / Pristine / Excellent</span>
              <span className="text-[#8a7f73]">∨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Step 3 & 4 & 5 Preview */}
      <div className={`p-4 bg-[#fbf9f5] rounded-[8px] border border-[#eadecc] flex items-center justify-between text-xs text-[#5c5248] ${activeFormStep > 2 || activeFormStep === 0 ? 'block' : 'hidden'}`}>
        <div>
          <span className="font-semibold text-[#1a1612]">Step 3 to 5: </span>
          <span>Photographs (min 3, max 8), Listing preferences, and Submission consent.</span>
        </div>
        <span className="text-[11px] text-[#47633c] font-medium">Configured in Page Settings</span>
      </div>

      {/* Consent & Submit Button Row */}
      <div className="pt-4 border-t border-[#ebe5dc] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-[#8a7f73] leading-relaxed max-w-md">
          {getVal('lyp_form_consent', 'By submitting, you agree to our Lister Guidelines and Terms of Service. Every piece is safe and protected during transit and storage.')}
        </p>

        <button
          type="button"
          className="px-6 py-3 rounded-[6px] bg-[#47633c] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#3b5232] transition cursor-pointer shadow-sm shrink-0"
        >
          {getVal('lyp_form_btn_submit', 'SUBMIT YOUR PIECE FOR REVIEW →')}
        </button>
      </div>
    </section>
  );
};

export default ListYourPieceForm;
