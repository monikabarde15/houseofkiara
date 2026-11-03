/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsSettingsPoliciesQuestions (Spec §8.9 Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface TermsSettingsPoliciesQuestionsProps {
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
}

export const TermsSettingsPoliciesQuestions: React.FC<TermsSettingsPoliciesQuestionsProps> = ({
  hiddenParts,
  onTogglePartHidden
}) => {
  return (
    <div className="space-y-6">
      {/* 06 Our policies Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 06 · Our policies</div>
            <div className="text-[11px] text-[#73675a]">Seven policy links and review date fine print</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['our-policies']}
              onChange={() => onTogglePartHidden('our-policies')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] text-[#8a7f73]">Linked policy pages (7 in order):</div>
          {[
            'Care, Cleaning & Damage Policy',
            'Deposit Policy',
            'Seller Guidelines',
            'Shipping & Delivery Policy',
            'Refund & Cancellation Policy',
            'Privacy Policy',
            'Cookie Policy'
          ].map((name, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <span className="text-[#1a1612]">{name}</span>
              <span className="text-[10px] text-[#4a6b35] font-semibold">Active</span>
            </div>
          ))}
        </div>
      </div>

      {/* 07 Questions Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 07 · Questions</div>
            <div className="text-[11px] text-[#73675a]">Closing contact band and grievance details</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['questions']}
              onChange={() => onTogglePartHidden('questions')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
            <span className="font-medium text-[#1a1612]">WhatsApp Concierge</span>
            <span className="text-[#8a7f73] font-mono text-[11px]">+91 93401 39300</span>
          </div>
          <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
            <span className="font-medium text-[#1a1612]">Support Email</span>
            <span className="text-[#8a7f73] font-mono text-[11px]">hello@houseofkaira.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsSettingsPoliciesQuestions;
