/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NoSearchConciergeBand (Spec § 8.19, Screen 60)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

export interface NoSearchConciergeBandProps extends EditableFieldProps {
  onSelectFigure?: (figureKey: string) => void;
}

export const NoSearchConciergeBand: React.FC<NoSearchConciergeBandProps> = ({
  onSelectFigure,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const title = fieldValues['no_search_concierge_title'] || 'Can’t find ';
  const desc =
    fieldValues['no_search_concierge_desc'] ||
    'Tell us the piece, the designer or the occasion, and our team will look for it and come back to you on WhatsApp. Your search is already in the message.';

  return (
    <div className="bg-[#1c1917] text-white rounded-[10px] p-8 sm:p-10 space-y-5">
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5ad7d] font-semibold">
          OUR TEAM, ON WHATSAPP
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('no_search_concierge_title')}
            onBlur={(e) => onFieldChange('no_search_concierge_title', e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-white/10 px-1 rounded transition-colors focus:outline-none"
          >
            {title}
          </span>
          <span className="italic text-[#c5ad7d]">what you have in mind?</span>
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('no_search_concierge_desc')}
          onBlur={(e) => onFieldChange('no_search_concierge_desc', e.currentTarget.textContent || '')}
          className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl cursor-pointer hover:bg-white/10 px-1 rounded transition-colors focus:outline-none"
        >
          {desc}
        </p>
      </div>

      <div className="pt-1">
        <button
          type="button"
          className="px-5 py-2.5 bg-[#c5ad7d] text-[#1c1917] text-xs font-mono uppercase tracking-wider font-semibold rounded-[6px] hover:bg-[#bda67b] transition-colors cursor-pointer shadow-xs"
        >
          ASK US ON WHATSAPP
        </button>
      </div>

      <div className="text-xs text-stone-400 pt-2 border-t border-white/10 flex items-center gap-1.5">
        <span>We reply</span>
        <button
          type="button"
          onClick={() => onSelectFigure?.('support_hours')}
          className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold hover:bg-[#fef08a] cursor-pointer"
        >
          seven days a week, 10 AM to 8 PM IST
        </button>
      </div>
    </div>
  );
};

export default NoSearchConciergeBand;
