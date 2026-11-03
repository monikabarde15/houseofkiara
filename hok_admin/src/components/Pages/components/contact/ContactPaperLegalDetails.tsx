/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperLegalDetails (Spec §7.4, §8.5 Parts 08 & 09, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperLegalDetailsProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const ContactPaperLegalDetails: React.FC<ContactPaperLegalDetailsProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure,
  onNavigateToPage
}) => {
  const isConcernSelected = activePartId === 'raising-a-concern';
  const isDetailsSelected = activePartId === 'our-details';

  return (
    <div className="mt-12 space-y-12">
      {/* Part 08: Raising a concern */}
      <section
        id="raising-a-concern"
        onClick={() => onSelectPart('raising-a-concern')}
        className={`pt-8 border-t border-[#f0ebe3] space-y-3.5 transition-all cursor-pointer ${
          isConcernSelected ? 'ring-1 ring-[#bda67b] p-3 -m-3 rounded-[8px]' : ''
        }`}
      >
        <h3
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('raising-a-concern', 'contact_concern_heading', 'Heading', 'Raising a concern title', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_concern_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_concern_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[24px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_concern_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_concern_heading', 'Raising a concern')}
        </h3>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('raising-a-concern', 'contact_concern_intro', 'Intro paragraph', 'Encourages conversation first');
          }}
          contentEditable={focusedField?.fieldId === 'contact_concern_intro'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_concern_intro', e.currentTarget.textContent || '')}
          className={`text-xs text-[#5c5248] leading-relaxed cursor-text p-0.5 rounded ${
            focusedField?.fieldId === 'contact_concern_intro' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal(
            'contact_concern_intro',
            'We’d always rather put things right in conversation, so please message us first. If you’re not happy with how we’ve handled something, write to our Grievance Officer.'
          )}
        </p>

        <p className="text-xs text-[#5c5248] leading-relaxed">
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('raising-a-concern', 'contact_concern_promise_lead', 'Promise lead', 'Resolution timeline text');
            }}
            contentEditable={focusedField?.fieldId === 'contact_concern_promise_lead'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_concern_promise_lead', e.currentTarget.textContent || '')}
            className={`cursor-text p-0.5 rounded ${
              focusedField?.fieldId === 'contact_concern_promise_lead' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('contact_concern_promise_lead', 'We acknowledge every complaint within ')}
          </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('grievance_ack');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            24 hours
          </span>{' '}
          <span>and resolve it within </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('grievance_resolve');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            one month
          </span>
          .
        </p>

        <p className="text-xs text-[#5c5248] leading-relaxed">
          <span>You can also contact the National Consumer Helpline on </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('nch_phone');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            1915
          </span>
          <span>, on WhatsApp at </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('nch_whatsapp');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            +91 88000 01915
          </span>
          <span>, or at </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('nch_web');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            consumerhelpline.gov.in
          </span>
          <span>. Your rights are set out in our Terms & Conditions.</span>
        </p>
      </section>

      {/* Part 09: Our details */}
      <section
        id="our-details"
        onClick={() => onSelectPart('our-details')}
        className={`pt-8 border-t border-[#f0ebe3] space-y-4 transition-all cursor-pointer ${
          isDetailsSelected ? 'ring-1 ring-[#bda67b] p-3 -m-3 rounded-[8px]' : ''
        }`}
      >
        <h3
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('our-details', 'contact_details_heading', 'Heading', 'Our details title', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_details_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_details_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[24px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_details_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_details_heading', 'Our details')}
        </h3>

        <p className="text-xs text-[#5c5248] leading-relaxed">
          <span>House of Kaira is a brand of </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('trade_name');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            Sebshine Apparels
          </span>
          <span>, </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('legal_form');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            a sole proprietorship
          </span>{' '}
          <span>owned by </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('legal_name');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            Ekta Agrawal
          </span>
          <span>.</span>
        </p>

        {/* Sending something to us box */}
        <div className="pt-2">
          <div
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('our-details', 'contact_details_send_title', 'Subheading', 'Shipping return title');
            }}
            contentEditable={focusedField?.fieldId === 'contact_details_send_title'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_details_send_title', e.currentTarget.textContent || '')}
            className={`font-serif text-[16px] text-[#1a1612] mb-1 cursor-text p-0.5 rounded inline-block ${
              focusedField?.fieldId === 'contact_details_send_title' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('contact_details_send_title', 'Sending something to us?')}
          </div>

          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('our-details', 'contact_details_send_text', 'Instructions', 'Returns packing guidance');
            }}
            contentEditable={focusedField?.fieldId === 'contact_details_send_text'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_details_send_text', e.currentTarget.textContent || '')}
            className={`text-xs text-[#73675a] leading-relaxed cursor-text p-0.5 rounded ${
              focusedField?.fieldId === 'contact_details_send_text' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal(
              'contact_details_send_text',
              'Please speak to us before you send anything. Every return travels with our prepaid label or a collection we arrange, so it’s tracked and protected all the way.'
            )}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPaperLegalDetails;
