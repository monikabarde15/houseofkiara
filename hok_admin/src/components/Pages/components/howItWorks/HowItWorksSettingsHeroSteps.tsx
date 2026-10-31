/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksSettingsHeroSteps (Spec §8.7, Pages 33-34)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface HowItWorksSettingsHeroStepsProps {
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  showLoopCard: boolean;
  onToggleLoopCard: () => void;
}

export const HowItWorksSettingsHeroSteps: React.FC<HowItWorksSettingsHeroStepsProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden,
  showLoopCard,
  onToggleLoopCard
}) => {
  return (
    <>
      {/* 01 Hero Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">01 Hero</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Kicker, headline, two intent buttons that jump down the page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('hero')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['hero']}
            onChange={() => onTogglePartHidden('hero')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Intent jump buttons
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-[#73675a] mb-1">Shopper button label</label>
              <input
                type="text"
                defaultValue="I want to shop"
                className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#ebe5dc] rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#73675a] mb-1">Lister button label</label>
              <input
                type="text"
                defaultValue="I want to list & earn"
                className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#ebe5dc] rounded text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 02 What's on this page Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">02 What's on this page</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Two columns of four steps each, and the tabs that follow the reader down the page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('whats-on-this-page')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['whats-on-this-page']}
            onChange={() => onTogglePartHidden('whats-on-this-page')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
        <p className="text-[11.5px] text-[#73675a]">
          What it lists is read from the steps further down the page, never typed here, so the two cannot disagree.
        </p>
      </div>

      {/* 03 Shopping steps Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">03 Shopping steps</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Four steps in a drag strip, then the Loop card.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('shopping-steps')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['shopping-steps']}
            onChange={() => onTogglePartHidden('shopping-steps')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#1a1612]">Show the Loop card</span>
          <input
            type="checkbox"
            checked={showLoopCard}
            onChange={onToggleLoopCard}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default HowItWorksSettingsHeroSteps;
