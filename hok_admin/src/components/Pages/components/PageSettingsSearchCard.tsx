/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsSearchCard (Spec §7.9, Screen 29)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../types';

interface PageSettingsSearchCardProps {
  page: PageCardData;
}

export const PageSettingsSearchCard: React.FC<PageSettingsSearchCardProps> = ({
  page
}) => {
  const [metaTitle, setMetaTitle] = useState(
    `${page.name} · House of Kaira`
  );
  const [metaDesc, setMetaDesc] = useState(
    'Everything you need to know about our customer promises, transparent rental windows, security deposit releases, and luxury couture care.'
  );
  const [isListed, setIsListed] = useState(true);
  const [altText, setAltText] = useState('House of Kaira luxury fashion editorial');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-6 text-xs text-[#1a1612]">
      {/* 1. Header */}
      <div className="border-b border-[#f0eae1] pb-3">
        <h3 className="font-serif text-[18px] text-[#1a1612]">
          Search & sharing
        </h3>
        <p className="text-[11.5px] text-[#73675a] mt-0.5">
          How this page looks on Google and when shared on WhatsApp, Instagram, or iMessage.
        </p>
      </div>

      {/* 2. In a search result */}
      <div className="space-y-4">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          In a search result
        </div>

        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-[#73675a]">
              Title
            </label>
            <span className={`text-[10.5px] ${metaTitle.length > 60 ? 'text-[#993d3d] font-semibold' : 'text-[#8a7f73]'}`}>
              {metaTitle.length}/60 characters
            </span>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={e => setMetaTitle(e.target.value)}
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
          />
          <p className="text-[10.5px] text-[#8a7f73] mt-1">
            About 60 characters is all Google shows. The separator and the site name in it are figures, set in Site Settings.
          </p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-[#73675a]">
              Description
            </label>
            <span className={`text-[10.5px] ${metaDesc.length > 155 ? 'text-[#993d3d] font-semibold' : 'text-[#8a7f73]'}`}>
              {metaDesc.length}/155 characters
            </span>
          </div>
          <textarea
            rows={2}
            value={metaDesc}
            onChange={e => setMetaDesc(e.target.value)}
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b] resize-none"
          />
          <p className="text-[10.5px] text-[#8a7f73] mt-1">
            About 155 characters. Leave it empty and Google writes its own.
          </p>
        </div>

        {/* Let search engines list this page */}
        <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#faf7f2] border border-[#ebe5dc]">
          <div>
            <div className="font-medium text-[#1a1612]">
              Let search engines list this page
            </div>
            <div className="text-[11px] text-[#73675a]">
              {isListed ? 'Listed.' : 'Asked not to list it. Right for system pages.'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsListed(!isListed)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              isListed ? 'bg-[#1a1612]' : 'bg-[#d6ccbd]'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                isListed ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. When the link is shared */}
      <div className="space-y-4 pt-3 border-t border-[#f0eae1]">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          When the link is shared
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            Sharing picture (landscape, 1200 by 630)
          </label>
          <div className="h-32 rounded-[6px] border-2 border-dashed border-[#e6dccb] bg-[#faf7f2] flex flex-col items-center justify-center text-center p-4">
            <svg className="w-6 h-6 text-[#8a7f73] mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-[#8a6a36] font-medium hover:underline cursor-pointer">
              Upload sharing picture
            </span>
            <span className="text-[10.5px] text-[#8a7f73] mt-0.5">
              Without one the card shows only the words
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            Picture alt text
          </label>
          <input
            type="text"
            value={altText}
            onChange={e => setAltText(e.target.value)}
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            Canonical address (if this page repeats another)
          </label>
          <input
            type="text"
            value={canonicalUrl}
            onChange={e => setCanonicalUrl(e.target.value)}
            placeholder="Empty unless it repeats another"
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
          />
        </div>
      </div>

      {/* 4. Live Previews (Google SERP & Social card) */}
      <div className="space-y-3 pt-3 border-t border-[#f0eae1]">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Previews
        </div>

        {/* Google SERP Preview */}
        <div className="p-3 bg-white rounded border border-[#ebe5dc] space-y-1">
          <div className="text-[10px] text-[#202124] flex items-center gap-1">
            <span>https://houseofkiara.com</span>
            <span>›</span>
            <span>{page.slug}</span>
          </div>
          <div className="text-[#1a0dab] hover:underline font-medium text-[14px] leading-snug cursor-pointer line-clamp-1">
            {metaTitle}
          </div>
          <div className="text-[12px] text-[#4d5156] line-clamp-2 leading-relaxed">
            {metaDesc}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSettingsSearchCard;
