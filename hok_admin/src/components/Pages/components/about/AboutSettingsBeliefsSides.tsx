/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutSettingsBeliefsSides (Spec §8.6, Screen 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface AboutSettingsBeliefsSidesProps {
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
}

export const AboutSettingsBeliefsSides: React.FC<AboutSettingsBeliefsSidesProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden
}) => {
  return (
    <>
      {/* 04 What We Believe Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">04 What We Believe</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Four ideas, each a heading in two halves and a paragraph.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('what-we-believe')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['what-we-believe']}
            onChange={() => onTogglePartHidden('what-we-believe')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 05 Two Sides Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">05 Two Sides</h3>
            <p className="text-[11.5px] text-[#73675a]">
              A switch between the two people the platform serves, each with its own door.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('two-sides')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['two-sides']}
            onChange={() => onTogglePartHidden('two-sides')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 06 From The Founder Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">06 From The Founder</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Portrait, three paragraphs, signature.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('from-the-founder')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['from-the-founder']}
            onChange={() => onTogglePartHidden('from-the-founder')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default AboutSettingsBeliefsSides;
