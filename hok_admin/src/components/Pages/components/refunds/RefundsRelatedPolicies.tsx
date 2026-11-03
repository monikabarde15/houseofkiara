/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsRelatedPolicies (Spec §8.12 Part 07)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface RefundsRelatedPoliciesProps {
  onNavigateToPage?: (slug: string) => void;
}

export const RefundsRelatedPolicies: React.FC<RefundsRelatedPoliciesProps> = ({
  onNavigateToPage
}) => {
  const policies = [
    { title: 'Deposit Policy', slug: '/deposit-policy' },
    { title: 'Care, Cleaning & Damage Policy', slug: '/care-policy' },
    { title: 'Terms & Conditions', slug: '/terms' },
    { title: 'Privacy Policy', slug: '/privacy' },
    { title: 'Help & FAQs', slug: '/faqs' }
  ];

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-4 text-xs">
      {/* Related Policies Links */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[#57534e]">
        <span className="font-serif italic font-normal text-sm text-[#1c1917]">
          Related policies:
        </span>
        {policies.map((p, idx) => (
          <React.Fragment key={p.slug}>
            <button
              type="button"
              onClick={() => onNavigateToPage?.(p.slug)}
              className="text-[#1c1917] hover:text-[#935b1e] hover:underline cursor-pointer transition-colors"
            >
              {p.title}
            </button>
            {idx < policies.length - 1 && <span className="text-[#a8a29e]">,</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Legal Fine Print with Stamped Review Date */}
      <div className="border-t border-[#f0ebe3] pt-3 text-[11px] text-[#73675a] leading-relaxed">
        <span>This page explains our policy in plain words. Where it never differs from our Terms & Conditions, the Terms apply. Last reviewed </span>
        <span className="inline-block bg-[#fbf4ea] text-[#935b1e] border-b border-[#935b1e] px-1 font-medium">
          23 September 2026
        </span>
        <span>. </span>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[#935b1e] hover:underline cursor-pointer font-medium"
        >
          Print or save as PDF
        </button>
      </div>
    </div>
  );
};

export default RefundsRelatedPolicies;
