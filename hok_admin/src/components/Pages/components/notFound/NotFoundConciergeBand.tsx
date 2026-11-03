/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NotFoundConciergeBand (Spec § 8.18, Screen 59)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { NotFoundScenario } from '../../data/pageNotFoundData';

export interface NotFoundConciergeBandProps {
  scenario: NotFoundScenario;
  onSelectFigure?: (figureKey: string) => void;
}

export const NotFoundConciergeBand: React.FC<NotFoundConciergeBandProps> = ({
  scenario,
  onSelectFigure
}) => {
  return (
    <div className="bg-[#1c1917] text-white rounded-[10px] p-8 sm:p-10 space-y-5">
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5ad7d] font-semibold">
          OUR TEAM, ON WHATSAPP
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
          <span>{scenario.conciergeTitlePrefix}</span>
          <span className="italic text-[#c5ad7d]">{scenario.conciergeTitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
          {scenario.conciergeDesc}
        </p>
      </div>

      <div className="pt-1">
        <button
          type="button"
          className="px-5 py-2.5 bg-[#c5ad7d] text-[#1c1917] text-xs font-mono uppercase tracking-wider font-semibold rounded-[6px] hover:bg-[#bda67b] transition-colors cursor-pointer shadow-xs"
        >
          MESSAGE US ON WHATSAPP
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

export default NotFoundConciergeBand;
