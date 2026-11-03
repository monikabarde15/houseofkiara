/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingRelatedPolicies (Spec § 8.16 Part 08)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

export interface PricingRelatedPoliciesProps {
  onNavigateToPage?: (slug: string) => void;
}

export const PricingRelatedPolicies: React.FC<PricingRelatedPoliciesProps> = ({
  onNavigateToPage
}) => {
  const policies = [
    { title: 'Deposit Policy', slug: '/deposit-policy' },
    { title: 'Care, Cleaning & Damage Policy', slug: '/care-policy' },
    { title: 'Shipping & Delivery Policy', slug: '/shipping-policy' },
    { title: 'Refund & Cancellation Policy', slug: '/refunds' },
    { title: 'Terms & Conditions', slug: '/terms' },
    { title: 'Privacy Policy', slug: '/privacy' },
    { title: 'Help & FAQs', slug: '/faqs' }
  ];

  return (
    <div className="pt-2 pb-2">
      <div className="border-t border-dashed border-[#dcd7ce] pt-6 pb-2 space-y-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
          <span className="font-serif italic text-[#8a7f73]">Related policies:</span>
          {policies.map((p, idx) => (
            <React.Fragment key={p.slug}>
              <button
                type="button"
                onClick={() => onNavigateToPage?.(p.slug)}
                className="text-[#935b1e] hover:underline cursor-pointer font-medium"
              >
                {p.title}
              </button>
              {idx < policies.length - 1 && <span className="text-[#dcd7ce]">·</span>}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-[#78716c] leading-relaxed">
          This page explains our pricing and fee rules in plain words. Where it flows from our Terms & Conditions, the Terms apply. Last reviewed{' '}
          <span className="text-[#1c1917] font-medium">11 October 2026</span>.{' '}
          <button
            type="button"
            onClick={() => window.print()}
            className="text-[#935b1e] underline hover:text-[#785b1a] cursor-pointer"
          >
            Print or save as PDF
          </button>
        </p>
      </div>
    </div>
  );
};

export default PricingRelatedPolicies;
