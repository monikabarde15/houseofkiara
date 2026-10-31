/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PrivacyNoticeCard (Spec §8.1 & §8.10, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface PrivacyNoticeCardProps extends EditableFieldProps {
  onOpenCheck?: (checkId: string) => void;
}

export const PrivacyNoticeCard: React.FC<PrivacyNoticeCardProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onOpenCheck
}) => {
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [isEditingWhatHeading, setIsEditingWhatHeading] = useState(false);
  const [isEditingWhatText, setIsEditingWhatText] = useState(false);

  const noticeText = fieldValues['privacy_notice_text'] ??
    "Privacy Policy is built at v3, on the same engine as the Terms. Its page file is still to come. When it arrives, its clauses load into Pages the same way the Terms' did: parts, clauses and sub-clauses, every figure as a chip, and its own version and dates. Until then, the figures it prints are listed in Figures under the subjects they belong to.";

  const whatHeading = fieldValues['privacy_what_heading'] ?? 'What it carries';
  const whatText = fieldValues['privacy_what_text'] ??
    "Who we are, what we collect, how we use it, who we share it with, how long we keep it, your rights, cookies, children, changes and complaints, with the Grievance Officer's details as legal figures.";

  return (
    <div className="relative bg-white border border-[#ebe5dc] rounded-[8px] p-6 md:p-8 shadow-2xs space-y-6 transition-all hover:border-[#dbc8af]">
      {/* Margin check mark (Spec §7.11, Screen 58) */}
      <div className="absolute -right-7 top-6 group">
        <button
          type="button"
          onClick={() => onOpenCheck?.('pc1')}
          className="w-4 h-4 rounded-full bg-[#c5ad7d] text-[#1a1612] flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer transition-transform hover:scale-110 ring-2 ring-[#faf2e3]"
          title="1 item to look at: Its words are not loaded into Pages yet"
        >
          •
        </button>
        <div className="hidden group-hover:block absolute right-6 top-0 w-60 p-2 bg-[#1a1612] text-white rounded-[5px] text-[11px] shadow-lg pointer-events-none z-30">
          <div className="font-medium text-[#c5ad7d] mb-0.5">
            Its words are not loaded into Pages yet
          </div>
          <div className="text-white/80">
            The policy · Medium importance
          </div>
        </div>
      </div>

      {/* Amber Notice Box */}
      <div className="bg-[#fbf6ee] border border-[#e6cba8] rounded-[8px] p-4 sm:p-5 flex items-start gap-3.5">
        <svg
          className="w-5 h-5 text-[#935b1e] shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <div className="flex-1 text-xs sm:text-[13px] text-[#78350f] leading-relaxed">
          {isEditingNotice ? (
            <textarea
              value={noticeText}
              autoFocus
              rows={4}
              onBlur={() => setIsEditingNotice(false)}
              onChange={(e) => onFieldChange('privacy_notice_text', e.target.value)}
              className="w-full bg-transparent border border-[#935b1e] rounded p-1.5 outline-none text-xs sm:text-[13px]"
            />
          ) : (
            <div
              onClick={() => {
                setIsEditingNotice(true);
                onFocusField('privacy_notice_text');
              }}
              className="cursor-pointer hover:bg-[#faeedd]/60 rounded p-1 transition-colors"
              title="Click to edit notice text"
            >
              {noticeText}
            </div>
          )}
        </div>
      </div>

      {/* What It Carries Section */}
      <div className="pt-1">
        <div className="mb-2">
          {isEditingWhatHeading ? (
            <input
              type="text"
              value={whatHeading}
              autoFocus
              onBlur={() => setIsEditingWhatHeading(false)}
              onChange={(e) => onFieldChange('privacy_what_heading', e.target.value)}
              className="font-semibold text-sm text-[#1c1917] border-b border-[#935b1e] bg-transparent outline-none"
            />
          ) : (
            <h3
              onClick={() => {
                setIsEditingWhatHeading(true);
                onFocusField('privacy_what_heading');
              }}
              className="font-semibold text-sm text-[#1c1917] cursor-pointer hover:bg-[#fbf4ea] px-1 py-0.5 rounded inline-block transition-colors"
              title="Click to edit heading"
            >
              {whatHeading}
            </h3>
          )}
        </div>

        <div>
          {isEditingWhatText ? (
            <textarea
              value={whatText}
              autoFocus
              rows={3}
              onBlur={() => setIsEditingWhatText(false)}
              onChange={(e) => onFieldChange('privacy_what_text', e.target.value)}
              className="w-full text-xs sm:text-[13px] text-[#57534e] border border-[#935b1e] rounded p-2 bg-transparent outline-none leading-relaxed"
            />
          ) : (
            <p
              onClick={() => {
                setIsEditingWhatText(true);
                onFocusField('privacy_what_text');
              }}
              className="text-xs sm:text-[13px] text-[#57534e] leading-relaxed cursor-pointer hover:bg-[#fbf4ea] p-1 rounded transition-colors"
              title="Click to edit description"
            >
              {whatText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyNoticeCard;
