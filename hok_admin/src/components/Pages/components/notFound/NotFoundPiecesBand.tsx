/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NotFoundPiecesBand (Spec § 8.18, Screen 59)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { NotFoundScenario } from '../../data/pageNotFoundData';

export interface NotFoundPiecesBandProps {
  scenario: NotFoundScenario;
}

export const NotFoundPiecesBand: React.FC<NotFoundPiecesBandProps> = ({ scenario }) => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 space-y-4 shadow-xs">
      <div className="space-y-1">
        <div className="text-[10.5px] font-mono tracking-widest text-[#935b1e] uppercase font-semibold">
          {scenario.piecesBandEyebrow}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-normal">
            <span>{scenario.piecesBandTitlePrefix}</span>
            {scenario.piecesBandTitleToken && (
              <span className="bg-[#f5f1eb] px-1.5 py-0.5 rounded font-mono text-xs text-[#785b1a] border border-dashed border-[#d6cfc4] ml-1">
                {scenario.piecesBandTitleToken}
              </span>
            )}
          </h2>
          <button
            type="button"
            className="text-[11px] font-mono tracking-wider text-[#1c1917] uppercase underline font-semibold hover:text-[#935b1e] transition-colors cursor-pointer self-start sm:self-auto"
          >
            {scenario.piecesBandLink}
          </button>
        </div>
      </div>

      {/* 4 Catalogue Pieces in a row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="space-y-2 group cursor-pointer">
            <div className="aspect-3/4 bg-[#231f1c] rounded-[6px] border border-[#38332e] flex items-center justify-center group-hover:border-[#c5ad7d] transition-all">
              <span className="text-[10px] text-[#73675a] font-mono">piece {num}</span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif text-xs sm:text-sm text-[#1c1917] group-hover:text-[#935b1e] transition-colors">
                Piece {num}
              </div>
              <div className="text-[10.5px] text-[#8a7f73]">
                Drawn from the catalogue
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotFoundPiecesBand;
