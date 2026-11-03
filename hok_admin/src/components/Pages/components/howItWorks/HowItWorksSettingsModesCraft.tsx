/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksSettingsModesCraft (Spec §8.7, Page 34)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface HowItWorksSettingsModesCraftProps {
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
}

export const HowItWorksSettingsModesCraft: React.FC<HowItWorksSettingsModesCraftProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden
}) => {
  return (
    <>
      {/* 04 Two ways to shop Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">04 Two ways to shop</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Rent and Buy Preloved side by side, four steps each.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('two-ways-to-shop')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['two-ways-to-shop']}
            onChange={() => onTogglePartHidden('two-ways-to-shop')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 05 The Craft divider Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">05 The Craft divider</h3>
            <p className="text-[11.5px] text-[#73675a]">
              A pulled quote and three figures pointing at registered figures.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('the-craft-divider')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['the-craft-divider']}
            onChange={() => onTogglePartHidden('the-craft-divider')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 06 List & Earn Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">06 List & Earn</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Four earning figures, then the lister journey in four steps.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('list-and-earn')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['list-and-earn']}
            onChange={() => onTogglePartHidden('list-and-earn')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default HowItWorksSettingsModesCraft;
