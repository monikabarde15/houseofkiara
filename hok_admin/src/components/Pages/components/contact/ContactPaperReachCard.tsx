/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperReachCard (Spec §7.4, §8.5 Part 03, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperReachCardProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (figureKey: string) => void;
  onOpenCheck?: () => void;
}

export const ContactPaperReachCard: React.FC<ContactPaperReachCardProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure,
  onOpenCheck
}) => {
  const isSelected = activePartId === 'ways-to-reach';

  return (
    <section
      id="ways-to-reach"
      onClick={() => onSelectPart('ways-to-reach')}
      className={`mt-8 relative rounded-[10px] border border-[#e6dccb] bg-white p-7 md:p-8 space-y-6 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'
      }`}
    >
      {/* Margin indicator for check (Spec §7.5, Screen 42) */}
      <div
        onClick={e => {
          e.stopPropagation();
          onOpenCheck?.();
        }}
        title="1 check to look at: Phone number waiting for a decision"
        className="absolute -right-11 md:-right-14 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#d19a3c] ring-4 ring-[#f7f2ea] shadow-xs cursor-pointer hover:scale-125 transition-transform"
      />

      {/* Eyebrow */}
      <div>
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('ways-to-reach', 'contact_reach_heading', 'Eyebrow', 'Card heading');
          }}
          contentEditable={focusedField?.fieldId === 'contact_reach_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_reach_heading', e.currentTarget.textContent || '')}
          className={`font-serif italic text-[#8a6a36] text-[15px] inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'contact_reach_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_reach_heading', 'Ways to reach us')}
        </span>
      </div>

      {/* Row 1: WhatsApp */}
      <div className="space-y-2 pb-6 border-b border-[#f4ede2]">
        <h4
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('ways-to-reach', 'contact_wa_title', 'WhatsApp heading', 'Method title', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_wa_title'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_wa_title', e.currentTarget.textContent || '')}
          className={`font-serif text-[22px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_wa_title' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_wa_title', 'WhatsApp')}
        </h4>

        <div className="flex items-center gap-2">
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('support_whatsapp');
            }}
            className="px-2 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/50 text-[#8a6a36] font-semibold text-sm cursor-pointer hover:bg-[#ede5d8]"
          >
            +91 93401 39300
          </span>
        </div>

        <p className="text-xs text-[#5c5248] leading-relaxed">
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('ways-to-reach', 'contact_wa_note', 'WhatsApp line', 'Explains WhatsApp reply speed');
            }}
            contentEditable={focusedField?.fieldId === 'contact_wa_note'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_wa_note', e.currentTarget.textContent || '')}
            className={`cursor-text p-0.5 rounded ${
              focusedField?.fieldId === 'contact_wa_note' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
            }`}
          >
            {getVal('contact_wa_note', 'The quickest way to reach us. During our hours, we usually reply within ')}
          </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('support_sla');
            }}
            className="px-1.5 py-0.5 rounded bg-[#fbf9f5] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            2 hours
          </span>
          .
        </p>

        <div className="pt-1">
          <button
            type="button"
            className="px-4 py-2 rounded-[4px] bg-[#1a1612] text-[#f7f2ea] text-[11px] font-semibold tracking-wider uppercase hover:bg-[#332b21] transition cursor-pointer"
          >
            MESSAGE US ON WHATSAPP
          </button>
        </div>
      </div>

      {/* Row 2: Email */}
      <div className="space-y-2 pb-6 border-b border-[#f4ede2]">
        <h4
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('ways-to-reach', 'contact_email_title', 'Email heading', 'Method title', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_email_title'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_email_title', e.currentTarget.textContent || '')}
          className={`font-serif text-[22px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_email_title' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_email_title', 'Email')}
        </h4>

        <div className="flex items-center gap-2">
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('support_email');
            }}
            className="px-2 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/50 text-[#8a6a36] font-semibold text-sm cursor-pointer hover:bg-[#ede5d8]"
          >
            hello@houseofkaira.com
          </span>
        </div>

        <p className="text-xs text-[#5c5248] leading-relaxed">
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('ways-to-reach', 'contact_email_note', 'Email line', 'Explains email reply expectations');
            }}
            contentEditable={focusedField?.fieldId === 'contact_email_note'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_email_note', e.currentTarget.textContent || '')}
            className={`cursor-text p-0.5 rounded ${
              focusedField?.fieldId === 'contact_email_note' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
            }`}
          >
            {getVal('contact_email_note', 'Best for photographs and documents, and for press and partnerships. We reply within ')}
          </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('email_sla');
            }}
            className="px-1.5 py-0.5 rounded bg-[#fbf9f5] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            24 hours
          </span>
          .
        </p>
      </div>

      {/* Row 3: Call */}
      <div className="space-y-2">
        <h4
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('ways-to-reach', 'contact_call_title', 'Call heading', 'Method title', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_call_title'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_call_title', e.currentTarget.textContent || '')}
          className={`font-serif text-[22px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_call_title' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_call_title', 'Call')}
        </h4>

        <div className="flex items-center gap-2">
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('support_phone');
            }}
            className="px-2 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/50 text-[#8a6a36] font-semibold text-sm cursor-pointer hover:bg-[#ede5d8]"
          >
            +91 93401 39300
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#5c5248]">
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('support_days');
            }}
            className="px-1.5 py-0.5 rounded bg-[#fbf9f5] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            Seven days a week
          </span>
          <span>,</span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('support_hours');
            }}
            className="px-1.5 py-0.5 rounded bg-[#fbf9f5] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            10 AM to 8 PM IST
          </span>
          <span>.</span>
        </div>
      </div>
    </section>
  );
};

export default ContactPaperReachCard;
