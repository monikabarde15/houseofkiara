/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperOpenClosed (Spec §7.4, §8.5 Part 02, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperOpenClosedProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (figureKey: string) => void;
}

export const ContactPaperOpenClosed: React.FC<ContactPaperOpenClosedProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure
}) => {
  const [activeTab, setActiveTab] = useState<'within' | 'outside'>('within');
  const isSelected = activePartId === 'open-closed';

  return (
    <section
      id="open-closed"
      onClick={() => onSelectPart('open-closed')}
      className={`mt-8 space-y-3 cursor-pointer ${
        isSelected ? 'p-1 rounded-[10px] ring-1 ring-[#bda67b]' : ''
      }`}
    >
      {/* Switcher bar: Showing the line for */}
      <div className="border border-[#e6dccb] bg-[#faf7f2] rounded-[8px] p-2.5 flex items-center gap-3 text-xs text-[#73675a]">
        <span className="font-serif italic text-sm text-[#5c5248]">Showing the line for</span>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-[6px] border border-[#e6dccb]">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setActiveTab('within');
            }}
            className={`px-3 py-1 rounded-[4px] text-xs font-medium transition cursor-pointer ${
              activeTab === 'within'
                ? 'bg-[#1a1612] text-white shadow-2xs'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Within support hours
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setActiveTab('outside');
            }}
            className={`px-3 py-1 rounded-[4px] text-xs font-medium transition cursor-pointer ${
              activeTab === 'outside'
                ? 'bg-[#1a1612] text-white shadow-2xs'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Outside support hours
          </button>
        </div>
      </div>

      {/* The Live Status Card */}
      <div className="rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-7 md:p-8 shadow-sm">
        {activeTab === 'within' ? (
          <div>
            <span className="text-[10.5px] font-semibold tracking-widest text-[#d4af37] uppercase block mb-2">
              WITHIN SUPPORT HOURS
            </span>
            <h3
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('open-closed', 'contact_open_heading', 'Heading within hours', 'Status message while team is active', true);
              }}
              contentEditable={focusedField?.fieldId === 'contact_open_heading'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('contact_open_heading', e.currentTarget.textContent || '')}
              className={`font-serif text-[24px] font-normal text-[#f7f2ea] cursor-text p-1 rounded inline-block ${
                focusedField?.fieldId === 'contact_open_heading'
                  ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none'
                  : 'hover:ring-1 hover:ring-[#d4af37]/40'
              }`}
            >
              {getVal('contact_open_heading', 'Our team is here now')}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span
                onClick={e => {
                  e.stopPropagation();
                  onSelectFigure?.('support_days');
                }}
                className="px-2.5 py-1 rounded bg-[#2b241b] border border-[#d4af37]/60 text-[#f5d77f] font-mono text-[12px] cursor-pointer hover:bg-[#382f23] transition-colors"
              >
                Seven days a week
              </span>
              <span
                onClick={e => {
                  e.stopPropagation();
                  onSelectFigure?.('support_hours');
                }}
                className="px-2.5 py-1 rounded bg-[#2b241b] border border-[#d4af37]/60 text-[#f5d77f] font-mono text-[12px] cursor-pointer hover:bg-[#382f23] transition-colors"
              >
                10 AM to 8 PM IST
              </span>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-[10.5px] font-semibold tracking-widest text-[#d4af37] uppercase block mb-2">
              OUTSIDE SUPPORT HOURS
            </span>
            <div className="flex items-center flex-wrap gap-2 font-serif text-[24px] font-normal text-[#f7f2ea]">
              <span
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('open-closed', 'contact_closed_prefix', 'Closed line prefix', 'Words before opening token', true);
                }}
                contentEditable={focusedField?.fieldId === 'contact_closed_prefix'}
                suppressContentEditableWarning
                onInput={e => onFieldChange('contact_closed_prefix', e.currentTarget.textContent || '')}
                className={`cursor-text p-0.5 rounded ${
                  focusedField?.fieldId === 'contact_closed_prefix' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/40'
                }`}
              >
                {getVal('contact_closed_prefix', 'We’re back')}
              </span>
              <span
                onClick={e => {
                  e.stopPropagation();
                  onSelectFigure?.('next_opening_day');
                }}
                className="px-2 py-0.5 rounded bg-[#2b241b] border border-dashed border-[#d4af37] text-[#f5d77f] font-mono text-[16px] italic cursor-pointer"
              >
                when we open
              </span>
              <span>at</span>
              <span
                onClick={e => {
                  e.stopPropagation();
                  onSelectFigure?.('next_opening_time');
                }}
                className="px-2 py-0.5 rounded bg-[#2b241b] border border-dashed border-[#d4af37] text-[#f5d77f] font-mono text-[16px] italic cursor-pointer"
              >
                the time
              </span>
              <span>IST</span>
            </div>

            <p
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('open-closed', 'contact_closed_sub', 'Line under closed heading', 'Sub-heading shown while closed');
              }}
              contentEditable={focusedField?.fieldId === 'contact_closed_sub'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('contact_closed_sub', e.currentTarget.textContent || '')}
              className={`mt-2 text-xs text-[#dcd4c7] cursor-text p-1 rounded inline-block ${
                focusedField?.fieldId === 'contact_closed_sub' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/40'
              }`}
            >
              {getVal('contact_closed_sub', 'Leave us a message, and we’ll reply as soon as we’re back.')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactPaperOpenClosed;
