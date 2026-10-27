/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinkPickerPopover (Spec §7.5, Screen 35)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { SEED_PAGES } from '../data';

export interface LinkPickerPopoverProps {
  initialWords?: string;
  initialDestination?: string;
  isExisting?: boolean;
  onSaveLink: (words: string, destination: string) => void;
  onRemoveLink?: () => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

export const LinkPickerPopover: React.FC<LinkPickerPopoverProps> = ({
  initialWords = '',
  initialDestination = 'Questions on this page: How soon can I cancel?',
  isExisting = false,
  onSaveLink,
  onRemoveLink,
  onClose,
  style
}) => {
  const [words, setWords] = useState(initialWords);
  const [destination, setDestination] = useState(initialDestination);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!words.trim()) {
      setErrorMessage('Write the words that make up the link.');
      return;
    }
    onSaveLink(words.trim(), destination);
    onClose();
  };

  const standardDestinations = [
    'Homepage',
    'My Account',
    'WhatsApp',
    'Email',
    'List Your Piece',
    'Lister Terms'
  ];

  const questionsOnThisPage = [
    'How soon can I cancel?',
    'What do I get back if I cancel more than 7 days before?',
    'When do I get my deposit back?',
    'Can I swap sizes after booking?'
  ];

  const partsOnThisPage = [
    'Hero',
    'Two policies',
    'Opening',
    'The policy in brief',
    'Sections',
    'Answers'
  ];

  return (
    <div
      style={style}
      className="absolute z-50 w-[360px] bg-white border border-[#ebe5dc] rounded-[8px] shadow-[0_8px_30px_rgba(26,22,18,0.15)] p-4 text-xs text-[#1a1612] animate-in fade-in"
    >
      {/* Title (Spec §7.5: "A new link" or "A link") */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
        <h3 className="font-serif text-[15px] font-normal text-[#1a1612]">
          {isExisting ? 'A link' : 'A new link'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[#8a7f73] hover:text-[#1a1612] p-1 rounded"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="pt-3 space-y-3.5">
        {/* Words that are the link (Spec §7.5) */}
        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            Words that are the link
          </label>
          <input
            type="text"
            value={words}
            onChange={e => {
              setWords(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Selected words"
            autoFocus
            className={`w-full p-2 bg-[#fcfaf7] border rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:bg-white ${
              errorMessage ? 'border-[#993d3d]' : 'border-[#e6dccb] focus:border-[#bda67b]'
            }`}
          />
          {errorMessage && (
            <p className="mt-1 text-[11px] text-[#993d3d] font-medium">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Opens (Spec §7.5: questions, parts, pages, external) */}
        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            Opens
          </label>
          <select
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:bg-white focus:border-[#bda67b]"
          >
            <optgroup label="Questions on this page">
              {questionsOnThisPage.map(q => (
                <option key={q} value={`question:${q}`}>
                  {q}
                </option>
              ))}
            </optgroup>

            <optgroup label="Parts of this page">
              {partsOnThisPage.map(p => (
                <option key={p} value={`part:${p}`}>
                  {p}
                </option>
              ))}
            </optgroup>

            <optgroup label="Every page">
              {SEED_PAGES.map(p => (
                <option key={p.slug} value={`page:${p.slug}`}>
                  {p.name} {p.status === 'not-built' ? '(not built)' : ''}
                </option>
              ))}
            </optgroup>

            <optgroup label="Standard destinations">
              {standardDestinations.map(d => (
                <option key={d} value={`standard:${d}`}>
                  {d}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Action Buttons (Spec §7.5) */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#f0eae1]">
          {isExisting && onRemoveLink ? (
            <button
              type="button"
              onClick={() => {
                onRemoveLink();
                onClose();
              }}
              className="text-[11px] text-[#993d3d] hover:underline cursor-pointer"
            >
              Remove the link, keep the words
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 text-xs text-[#73675a] hover:text-[#1a1612]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-[#1a1612] text-white text-xs font-medium hover:bg-[#332e27] transition-colors"
            >
              {isExisting ? 'Save' : 'Add the link'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LinkPickerPopover;
