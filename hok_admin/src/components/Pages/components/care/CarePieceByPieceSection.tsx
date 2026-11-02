/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CarePieceByPieceSection (Spec § 8.14 Part 06)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PIECE_BY_PIECE_DATA } from '../../data/careRegistry';

export const CarePieceByPieceSection: React.FC = () => {
  const [activePieceId, setActivePieceId] = useState<string>('lehenga');

  const currentPiece = PIECE_BY_PIECE_DATA.find((p: any) => p.id === activePieceId) || PIECE_BY_PIECE_DATA[0];

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#f1eee8]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#935b1e] block mb-1">
            Care, piece by piece
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">
            Special care for your outfit
          </h2>
        </div>
      </div>

      {/* Piece Selector Chips */}
      <div className="flex flex-wrap gap-2">
        {PIECE_BY_PIECE_DATA.map((p: any) => {
          const isActive = p.id === activePieceId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePieceId(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'bg-[#f8f6f2] border border-[#e8e2d8] text-[#57534e] hover:bg-[#efebe3]'
              }`}
            >
              {p.chip}
            </button>
          );
        })}
      </div>

      {/* Active Piece Guide */}
      <div className="bg-[#fcfaf7] border border-[#f0ebe3] rounded-lg p-5 sm:p-6 space-y-4">
        <h3 className="font-serif text-lg sm:text-xl text-[#1c1917] font-normal">
          {currentPiece.title}
        </h3>
        <ul className="space-y-3">
          {currentPiece.points.map((point: string, pIdx: number) => (
            <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#44403c] leading-relaxed">
              <span className="text-[#935b1e] font-semibold mt-0.5">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarePieceByPieceSection;
