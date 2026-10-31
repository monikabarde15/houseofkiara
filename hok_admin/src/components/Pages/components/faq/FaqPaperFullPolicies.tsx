/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaperFullPolicies (Spec §8.4 Part 07, Page 29)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface FaqPaperFullPoliciesProps {
  lastReviewed?: string;
  onNavigateToPage?: (slug: string) => void;
}

const POLICY_LINKS = [
  { name: 'Rental Terms & Conditions', slug: '/terms-and-conditions' },
  { name: 'Refund & Cancellation Policy', slug: '/refunds' },
  { name: 'Security Deposit Policy', slug: '/deposit-policy' },
  { name: 'Care, Cleaning & Damage Policy', slug: '/care-damage' },
  { name: 'Shipping & Delivery Policy', slug: '/shipping-delivery' }
];

export const FaqPaperFullPolicies: React.FC<FaqPaperFullPoliciesProps> = ({
  lastReviewed = '17 September 2026',
  onNavigateToPage
}) => {
  return (
    <div id="full-policies" className="mt-12 pt-8 border-t border-[#f0ebe3]">
      <div className="space-y-4">
        {/* Label before the links & Policy links row */}
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-[#8a6a36] uppercase block mb-2">
            Part 07 · Full Policies
          </span>
          <div className="text-xs text-[#73675a] mb-3">
            Our full statutory policies and binding terms:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {POLICY_LINKS.map(policy => (
              <button
                key={policy.slug}
                type="button"
                onClick={() => onNavigateToPage?.(policy.slug)}
                className="px-3 py-1.5 rounded-[4px] bg-[#f7f2ea] border border-[#e6dccb] text-xs font-medium text-[#1a1612] hover:bg-white hover:border-[#bda67b] hover:text-[#8a6a36] transition cursor-pointer"
              >
                {policy.name} ↗
              </button>
            ))}
          </div>
        </div>

        {/* Fine print with review date */}
        <div className="pt-4 border-t border-[#f7f2ea] text-[11.5px] text-[#8a7f73] leading-relaxed">
          <p>
            Help & FAQs Version 6. Last formally reviewed on <span className="text-[#1a1612] font-medium">{lastReviewed}</span>. Every statutory figure, timeline, and deposit rule printed across these answers is dynamically pulled from the single canonical House of Kaira policy register.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqPaperFullPolicies;
