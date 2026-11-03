/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutSettingsHeroTheName (Spec §8.6, Screen 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';

interface AboutSettingsHeroTheNameProps {
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
}

export const AboutSettingsHeroTheName: React.FC<AboutSettingsHeroTheNameProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden
}) => {
  const [darkenPct, setDarkenPct] = useState(45);
  const [cropFrame, setCropFrame] = useState('Center');
  const [layoutMode, setLayoutMode] = useState<'bleed' | 'inset'>('bleed');
  const [showFilmSlot, setShowFilmSlot] = useState(true);

  return (
    <>
      {/* 01 Hero Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">01 Hero</h3>
            <p className="text-[11.5px] text-[#73675a]">
              A full bleed portrait, three facts, and the brand film slot underneath.
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

        <div className="flex items-center justify-between py-2 border-b border-[#f7f2ea]">
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
            Picture & film settings
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-[#73675a] mb-1">Alt text</label>
              <input
                type="text"
                defaultValue="House of Kaira flagship atelier and couture collection"
                className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#ebe5dc] rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#73675a] mb-1">Keep this part in frame</label>
              <select
                value={cropFrame}
                onChange={e => setCropFrame(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#ebe5dc] rounded text-xs"
              >
                <option value="Center">Center</option>
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] text-[#73675a]">Layout:</span>
              <button
                type="button"
                onClick={() => setLayoutMode('bleed')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  layoutMode === 'bleed' ? 'bg-[#1a1612] text-white' : 'bg-[#faf7f2] border border-[#ebe5dc]'
                }`}
              >
                Full bleed
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('inset')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  layoutMode === 'inset' ? 'bg-[#1a1612] text-white' : 'bg-[#faf7f2] border border-[#ebe5dc]'
                }`}
              >
                Inset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11.5px] text-[#73675a]">Darken behind words:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={darkenPct}
                onChange={e => setDarkenPct(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-[#fcfaf7] border border-[#ebe5dc] rounded text-xs"
              />
              <span className="text-xs text-[#73675a]">%</span>
              {darkenPct < 25 && (
                <span className="text-[11px] text-[#b85c38]">Below 25% the headline is hard to read</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#1a1612]">Show brand film slot</span>
            <input
              type="checkbox"
              checked={showFilmSlot}
              onChange={() => setShowFilmSlot(!showFilmSlot)}
              className="accent-[#b89047] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 02 The Name Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">02 The Name</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Five letters, K, A, I, R and A, each one tappable and each one meaning something.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('the-name')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['the-name']}
            onChange={() => onTogglePartHidden('the-name')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>

      {/* 03 Manifesto Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">03 Manifesto</h3>
            <p className="text-[11.5px] text-[#73675a]">
              One pulled quote on its own. The only band with nothing else in it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('manifesto')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-medium text-[#1a1612]">Show this band on the page</span>
          <input
            type="checkbox"
            checked={!hiddenParts['manifesto']}
            onChange={() => onTogglePartHidden('manifesto')}
            className="accent-[#b89047] cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default AboutSettingsHeroTheName;
