/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: CookiePageSettingsCard (Spec §8.1 & §8.11, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface CookiePageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
}

export const CookiePageSettingsCard: React.FC<CookiePageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {}
}) => {
  return (
    <div className="space-y-6 text-xs">
      {/* 1. Part Configuration */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe3]">
          <div>
            <span className="text-[11px] font-mono text-[#8a7f73] uppercase tracking-wider block">Part 01</span>
            <h3 className="font-serif text-[16px] text-[#1a1612] font-normal">The policy</h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fbf4ea] text-[#935b1e] font-medium">
            Waiting for page file
          </span>
        </div>

        <p className="text-[12px] text-[#73675a] leading-relaxed">
          The Cookie Policy is built at v3 on the same engine as the Terms: parts, numbered clauses and sub-clauses, every figure as a token, and its own version and dates. The Cookie Policy has no search box, by decision.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#f0ebe3]">
          <div>
            <span className="text-[#8a7f73] block text-[11px]">Built from</span>
            <span className="font-mono text-[#1a1612] text-[12px]">hok_cookie_v3</span>
          </div>
          <div>
            <span className="text-[#8a7f73] block text-[11px]">Engine level</span>
            <span className="text-[#1a1612] text-[12px]">Version 3</span>
          </div>
          <div>
            <span className="text-[#8a7f73] block text-[11px]">Last reviewed</span>
            <span className="text-[#1a1612] text-[12px]">1 September 2026</span>
          </div>
          <div>
            <span className="text-[#8a7f73] block text-[11px]">Search box</span>
            <span className="text-[#1a1612] text-[12px]">None (by decision)</span>
          </div>
        </div>
      </div>

      {/* 2. Notice and Content Description */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4">
        <h4 className="font-medium text-[#1a1612] text-sm pb-2 border-b border-[#f0ebe3]">
          Policy summary & scope
        </h4>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-[#73675a] block mb-1">
              Short paper lead copy
            </label>
            <input
              type="text"
              readOnly
              value="Its words load here from its page file, which is still to come."
              className="w-full bg-[#faf7f2] border border-[#e6dccb] rounded-[6px] px-3 py-1.5 text-xs text-[#5c5248]"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#73675a] block mb-1">
              What it carries
            </label>
            <textarea
              readOnly
              rows={3}
              value="What cookies and similar technologies we use, who sets them, what each cookie does, how long each lasts, how to allow, refuse or change choices at any time, and the cookie card on every page."
              className="w-full bg-[#faf7f2] border border-[#e6dccb] rounded-[6px] p-2 text-xs text-[#5c5248] leading-relaxed"
            />
          </div>
        </div>

        <div className="bg-[#fcfaf7] border border-[#ebe5dc] rounded-[6px] p-3 text-[11px] text-[#73675a] leading-relaxed">
          When the page file arrives, this card automatically expands into the full clauses settings suite: Hero, Where to start, Opening, The essentials, Clauses, Our policies, and Questions (without a search box).
        </div>
      </div>
    </div>
  );
};

export default CookiePageSettingsCard;
