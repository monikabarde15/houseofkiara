/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsTwoPoliciesCards (Spec §8.12 Part 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface RefundsTwoPoliciesCardsProps {
  activeTab: 'rental' | 'preloved';
  onTabChange: (tab: 'rental' | 'preloved') => void;
}

export const RefundsTwoPoliciesCards: React.FC<RefundsTwoPoliciesCardsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Rental Policy Card */}
      <button
        type="button"
        onClick={() => onTabChange('rental')}
        className={`p-6 md:p-8 rounded-[8px] text-left transition-all cursor-pointer ${
          activeTab === 'rental'
            ? 'bg-[#1a1612] text-white shadow-md'
            : 'bg-white border border-[#ebe5dc] text-[#1a1612] hover:border-[#dbc8af] shadow-2xs'
        }`}
      >
        <span
          className={`text-[10px] tracking-[0.2em] font-semibold uppercase block mb-2 ${
            activeTab === 'rental' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'
          }`}
        >
          FOR EVERY RENTAL
        </span>
        <h3 className="font-serif text-2xl md:text-3xl font-normal mb-2">
          Rental policy
        </h3>
        <div
          className={`text-[11px] font-mono tracking-wider uppercase ${
            activeTab === 'rental' ? 'text-white/70' : 'text-[#8a7f73]'
          }`}
        >
          68 ANSWERS{activeTab !== 'rental' && ' · SHOW THIS SIDE'}
        </div>
      </button>

      {/* 2. Preloved Policy Card */}
      <button
        type="button"
        onClick={() => onTabChange('preloved')}
        className={`p-6 md:p-8 rounded-[8px] text-left transition-all cursor-pointer ${
          activeTab === 'preloved'
            ? 'bg-[#1a1612] text-white shadow-md'
            : 'bg-white border border-[#ebe5dc] text-[#1a1612] hover:border-[#dbc8af] shadow-2xs'
        }`}
      >
        <span
          className={`text-[10px] tracking-[0.2em] font-semibold uppercase block mb-2 ${
            activeTab === 'preloved' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'
          }`}
        >
          FOR EVERY PRELOVED PIECE
        </span>
        <h3 className="font-serif text-2xl md:text-3xl font-normal mb-2">
          Preloved policy
        </h3>
        <div
          className={`text-[11px] font-mono tracking-wider uppercase ${
            activeTab === 'preloved' ? 'text-white/70' : 'text-[#8a7f73]'
          }`}
        >
          53 ANSWERS{activeTab !== 'preloved' && ' · SHOW THIS SIDE'}
        </div>
      </button>
    </div>
  );
};

export default RefundsTwoPoliciesCards;
