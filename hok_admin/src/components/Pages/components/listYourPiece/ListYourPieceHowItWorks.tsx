/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceHowItWorks (Spec §8.8 Part 04, Page 35)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPieceHowItWorksProps extends EditableFieldProps {
  hidden?: boolean;
}

export const ListYourPieceHowItWorks: React.FC<ListYourPieceHowItWorksProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  const steps = [
    { num: '01', title: 'Submit online', body: 'Fill out the form in under 5 minutes with photos and basic details of your piece.' },
    { num: '02', title: 'Complimentary pickup', body: 'We send a trusted courier to collect your piece safely from your doorstep.' },
    { num: '03', title: 'Authentication & Photography', body: 'Our stylists photograph, measure, and catalogue your garment in high definition.' },
    { num: '04', title: 'Rent or Resell', body: 'Your piece goes live to our curated community of discerning shoppers across India.' },
    { num: '05', title: 'Receive payouts', body: 'Earn on every booking with direct bank transfers within 3 working days.' }
  ];

  return (
    <section
      id="how-it-works"
      className={`p-8 md:p-10 bg-white rounded-[10px] border border-[#ebe5dc] shadow-2xs space-y-6 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      <div>
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_hiw_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker for process section' })}
          onBlur={e => onFieldChange?.('lyp_hiw_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_hiw_eyebrow', 'THE PROCESS')}
        </span>
        <h2
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_hiw_heading', fieldName: 'Heading', helpText: 'Headline for 5-step process' })}
          onBlur={e => onFieldChange?.('lyp_hiw_heading', e.currentTarget.textContent || '')}
          className="font-serif text-2xl md:text-3xl text-[#1a1612] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_hiw_heading', 'From submission to your first payout')}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_hiw_lead', fieldName: 'Line under heading', helpText: 'Lead text for 5-step process' })}
          onBlur={e => onFieldChange?.('lyp_hiw_lead', e.currentTarget.textContent || '')}
          className="text-xs text-[#5c5248] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_hiw_lead', 'Five simple steps to unlock the earning potential of your wardrobe.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {steps.map(step => (
          <div key={step.num} className="p-4 bg-[#faf7f2] rounded-[8px] border border-[#eadecc] flex flex-col justify-between">
            <div>
              <div className="font-serif text-2xl text-[#8a6a36] mb-2">{step.num}</div>
              <h4
                contentEditable
                suppressContentEditableWarning
                onFocus={() => onFocusField?.({ fieldId: `lyp_step_${step.num}_title`, fieldName: `Step ${step.num} Title`, helpText: 'Title of lister journey step' })}
                onBlur={e => onFieldChange?.(`lyp_step_${step.num}_title`, e.currentTarget.textContent || '')}
                className="text-xs font-semibold text-[#1a1612] mb-1.5 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-0.5 rounded cursor-text"
              >
                {getVal(`lyp_step_${step.num}_title`, step.title)}
              </h4>
              <p
                contentEditable
                suppressContentEditableWarning
                onFocus={() => onFocusField?.({ fieldId: `lyp_step_${step.num}_body`, fieldName: `Step ${step.num} Body`, helpText: 'Description of lister journey step' })}
                onBlur={e => onFieldChange?.(`lyp_step_${step.num}_body`, e.currentTarget.textContent || '')}
                className="text-[11px] text-[#5c5248] leading-relaxed outline-none focus:ring-1 focus:ring-[#c5ad7d] px-0.5 rounded cursor-text"
              >
                {getVal(`lyp_step_${step.num}_body`, step.body)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListYourPieceHowItWorks;
