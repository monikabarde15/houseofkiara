/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksSettingsPoliciesFAQ (Spec §8.7, Pages 34-35)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface HowItWorksSettingsPoliciesFAQProps {
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  showInstagramLine: boolean;
  onToggleInstagramLine: () => void;
}

export const HowItWorksSettingsPoliciesFAQ: React.FC<HowItWorksSettingsPoliciesFAQProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden,
  showInstagramLine,
  onToggleInstagramLine
}) => {
  return (
    <>
      {/* 07 Good to Know Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">07 Good to Know</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Six cards, each one ending in a link to a policy page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('good-to-know')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['good-to-know']}
            onChange={() => onTogglePartHidden('good-to-know')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 08 FAQ Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">08 FAQ</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Answers picked from Help & FAQs and the Seller Guidelines. Nothing is written twice.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('faq')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['faq']}
            onChange={() => onTogglePartHidden('faq')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 09 Closing Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">09 Closing</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Two buttons and the Instagram line.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('closing')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['closing']}
            onChange={() => onTogglePartHidden('closing')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#1a1612]">Show the handle under the buttons</span>
          <input
            type="checkbox"
            checked={showInstagramLine}
            onChange={onToggleInstagramLine}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default HowItWorksSettingsPoliciesFAQ;
