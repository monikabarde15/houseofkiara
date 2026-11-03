/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutSettingsWaysClosing (Spec §8.6, Screen 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface AboutSettingsWaysClosingProps {
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  showCircularMark: boolean;
  onToggleCircularMark: () => void;
  showFourthWayLine: boolean;
  onToggleFourthWayLine: () => void;
  showInstagramLine: boolean;
  onToggleInstagramLine: () => void;
}

export const AboutSettingsWaysClosing: React.FC<AboutSettingsWaysClosingProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden,
  showCircularMark,
  onToggleCircularMark,
  showFourthWayLine,
  onToggleFourthWayLine,
  showInstagramLine,
  onToggleInstagramLine
}) => {
  return (
    <>
      {/* 07 Why We Built It Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">07 Why We Built It</h3>
            <p className="text-[11.5px] text-[#73675a]">
              The market argument, with the circular mark drawn behind it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('why-we-built-it')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['why-we-built-it']}
            onChange={() => onTogglePartHidden('why-we-built-it')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#1a1612]">Draw the circular mark behind the text</span>
          <input
            type="checkbox"
            checked={showCircularMark}
            onChange={onToggleCircularMark}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 08 Three Ways Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">08 Three Ways</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Rent, Buy Preloved and List & Sell, and a line about the fourth way.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('three-ways')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['three-ways']}
            onChange={() => onTogglePartHidden('three-ways')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#1a1612]">Show the line underneath</span>
          <input
            type="checkbox"
            checked={showFourthWayLine}
            onChange={onToggleFourthWayLine}
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

export default AboutSettingsWaysClosing;
