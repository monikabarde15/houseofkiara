/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperWriteForm (Spec §7.4, §8.5 Part 05, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperWriteFormProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (figureKey: string) => void;
}

export const ContactPaperWriteForm: React.FC<ContactPaperWriteFormProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure
}) => {
  const isSelected = activePartId === 'write-a-note';

  return (
    <section
      id="write-a-note"
      onClick={() => onSelectPart('write-a-note')}
      className={`mt-12 pt-8 border-t border-[#f0ebe3] space-y-6 transition-all cursor-pointer ${
        isSelected ? 'ring-1 ring-[#bda67b] p-3 -m-3 rounded-[8px]' : ''
      }`}
    >
      <div>
        <h3
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('write-a-note', 'contact_write_heading', 'Heading', 'Write us a note title', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_write_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_write_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[24px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_write_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_write_heading', 'Write us a note')}
        </h3>

        <p className="mt-1 text-xs text-[#73675a]">
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('write-a-note', 'contact_write_lead', 'Line under heading', 'Explains that note will be answered by email');
            }}
            contentEditable={focusedField?.fieldId === 'contact_write_lead'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_write_lead', e.currentTarget.textContent || '')}
            className={`cursor-text p-0.5 rounded ${
              focusedField?.fieldId === 'contact_write_lead' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
            }`}
          >
            {getVal('contact_write_lead', 'Prefer to put it in writing? Send us a note here, and our team will reply by email within ')}
          </span>
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('email_sla');
            }}
            className="px-1.5 py-0.5 rounded bg-[#f7f2ea] border border-[#bda67b]/40 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
          >
            24 hours
          </span>
          .
        </p>
      </div>

      <div className="space-y-4 max-w-xl text-xs">
        <div>
          <label
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('write-a-note', 'contact_field_name_label', 'Your name label', 'Field label');
            }}
            contentEditable={focusedField?.fieldId === 'contact_field_name_label'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_field_name_label', e.currentTarget.textContent || '')}
            className={`block text-[11px] font-semibold text-[#8a7f73] uppercase tracking-wider mb-1 cursor-text p-0.5 rounded inline-block ${
              focusedField?.fieldId === 'contact_field_name_label' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('contact_field_name_label', 'Your name *')}
          </label>
          <div className="w-full border-b border-[#dcd4c7] py-2 text-[#73675a] italic bg-transparent">
            {getVal('contact_field_name_placeholder', 'Name')}
          </div>
        </div>

        <div>
          <label
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('write-a-note', 'contact_field_email_label', 'Email label', 'Field label');
            }}
            contentEditable={focusedField?.fieldId === 'contact_field_email_label'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_field_email_label', e.currentTarget.textContent || '')}
            className={`block text-[11px] font-semibold text-[#8a7f73] uppercase tracking-wider mb-1 cursor-text p-0.5 rounded inline-block ${
              focusedField?.fieldId === 'contact_field_email_label' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('contact_field_email_label', 'Email *')}
          </label>
          <div className="w-full border-b border-[#dcd4c7] py-2 text-[#73675a] italic bg-transparent">
            {getVal('contact_field_email_placeholder', 'Email address')}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('write-a-note', 'contact_field_phone_label', 'WhatsApp label', 'Field label');
              }}
              contentEditable={focusedField?.fieldId === 'contact_field_phone_label'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('contact_field_phone_label', e.currentTarget.textContent || '')}
              className={`text-[11px] font-semibold text-[#8a7f73] uppercase tracking-wider cursor-text p-0.5 rounded ${
                focusedField?.fieldId === 'contact_field_phone_label' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal('contact_field_phone_label', 'WhatsApp number')}
            </label>
            <span className="text-[10px] text-[#a89d8d] italic">Optional</span>
          </div>
          <div className="w-full border-b border-[#dcd4c7] py-2 text-[#73675a] italic bg-transparent">
            {getVal('contact_field_phone_placeholder', 'Mobile number with country code')}
          </div>
        </div>

        <div>
          <label
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('write-a-note', 'contact_field_topic_label', 'Topic label', 'Field label');
            }}
            contentEditable={focusedField?.fieldId === 'contact_field_topic_label'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_field_topic_label', e.currentTarget.textContent || '')}
            className={`block text-[11px] font-semibold text-[#8a7f73] uppercase tracking-wider mb-1 cursor-text p-0.5 rounded inline-block ${
              focusedField?.fieldId === 'contact_field_topic_label' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('contact_field_topic_label', 'What is it about? *')}
          </label>
          <div className="w-full border-b border-[#dcd4c7] py-2 text-[#5c5248] flex justify-between items-center">
            <span>Choosing a piece</span>
            <span className="text-[10px] text-[#8a7f73]">▼</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('write-a-note', 'contact_field_order_label', 'Order number label', 'Field label');
              }}
              contentEditable={focusedField?.fieldId === 'contact_field_order_label'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('contact_field_order_label', e.currentTarget.textContent || '')}
              className={`text-[11px] font-semibold text-[#8a7f73] uppercase tracking-wider cursor-text p-0.5 rounded ${
                focusedField?.fieldId === 'contact_field_order_label' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal('contact_field_order_label', 'Order number or piece')}
            </label>
            <span className="text-[10px] text-[#a89d8d] italic">Optional</span>
          </div>
          <div className="w-full border-b border-[#dcd4c7] py-2 text-[#73675a] italic bg-transparent">
            {getVal('contact_field_order_placeholder', 'Order ID or designer outfit title')}
          </div>
        </div>

        <div>
          <label
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('write-a-note', 'contact_field_msg_label', 'Your message label', 'Field label');
            }}
            contentEditable={focusedField?.fieldId === 'contact_field_msg_label'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_field_msg_label', e.currentTarget.textContent || '')}
            className={`block text-[11px] font-semibold text-[#8a7f73] uppercase tracking-wider mb-1 cursor-text p-0.5 rounded inline-block ${
              focusedField?.fieldId === 'contact_field_msg_label' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('contact_field_msg_label', 'Your message *')}
          </label>
          <div className="w-full border-b border-[#dcd4c7] py-3 text-[#73675a] italic bg-transparent min-h-[60px]">
            {getVal('contact_field_msg_placeholder', 'Tell us how we can help...')}
          </div>
        </div>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('write-a-note', 'contact_privacy_note', 'Privacy notice', 'Note under form');
          }}
          contentEditable={focusedField?.fieldId === 'contact_privacy_note'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_privacy_note', e.currentTarget.textContent || '')}
          className={`text-[11px] text-[#8a7f73] pt-2 cursor-text p-0.5 rounded ${
            focusedField?.fieldId === 'contact_privacy_note' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('contact_privacy_note', 'We use these details only to reply to you, as our Privacy Policy explains.')}
        </p>

        <div className="pt-2">
          <button
            type="button"
            className="px-6 py-2.5 rounded-[4px] bg-[#1a1612] text-[#f7f2ea] text-xs font-semibold tracking-wider uppercase hover:bg-[#332b21] transition cursor-pointer"
          >
            SEND YOUR NOTE
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactPaperWriteForm;
