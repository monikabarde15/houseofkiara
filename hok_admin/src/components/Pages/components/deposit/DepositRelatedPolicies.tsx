/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositRelatedPolicies (Spec § 8.13 Part 08)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface DepositRelatedPoliciesProps {
  onNavigateToPage?: (slug: string) => void;
}

export const DepositRelatedPolicies: React.FC<DepositRelatedPoliciesProps> = ({
  onNavigateToPage
}) => {
  const policies = [
    { title: 'Refund & Cancellation Policy', slug: 'refunds' },
    { title: 'Care, Cleaning & Damage Policy', slug: 'care-and-cleaning' },
    { title: 'Terms & Conditions', slug: 'terms' },
    { title: 'Privacy Policy', slug: 'privacy' },
    { title: 'Help & FAQ', slug: 'faq' }
  ];

  return (
    <div className="pt-6 pb-2 text-xs text-[#78716c] leading-relaxed">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
        <span className="font-serif italic text-sm text-[#44403c]">Related policies</span>
        {policies.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => onNavigateToPage?.(p.slug)}
            className="text-[#935b1e] hover:underline cursor-pointer"
          >
            {p.title}
          </button>
        ))}
      </div>
      <p>
        This page explains our policy in plain words. Where it ever differs from our Terms &amp; Conditions, the Terms apply. Last reviewed{' '}
        <span className="border-b border-[#d6cfc4] text-[#44403c] font-medium">6 October 2026</span>.
        {' '}
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[#935b1e] hover:underline cursor-pointer ml-1"
        >
          Print or save as PDF
        </button>
      </p>
    </div>
  );
};

export default DepositRelatedPolicies;
