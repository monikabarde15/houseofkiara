/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsPoliciesLine (Spec §8.9 Part 06, Page 37)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface TermsPoliciesLineProps extends EditableFieldProps {
  hidden?: boolean;
  onNavigateToPage?: (slug: string) => void;
}

export const TermsPoliciesLine: React.FC<TermsPoliciesLineProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden,
  onNavigateToPage
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  const policies = [
    { name: 'Care, Cleaning & Damage Policy', slug: '/care-cleaning-damage' },
    { name: 'Deposit Policy', slug: '/deposit-policy' },
    { name: 'Seller Guidelines', slug: '/seller-guidelines' },
    { name: 'Shipping & Delivery Policy', slug: '/shipping-delivery' },
    { name: 'Refund & Cancellation Policy', slug: '/refund-cancellation' },
    { name: 'Privacy Policy', slug: '/privacy-policy' },
    { name: 'Cookie Policy', slug: '/cookie-policy' }
  ];

  return (
    <section
      id="our-policies"
      className={`p-6 bg-white border border-[#ebe5dc] rounded-[8px] space-y-4 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-[#1a1612]">Read alongside our dedicated policies:</span>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[#8a6a36] hover:underline cursor-pointer text-[11px] self-start md:self-auto font-mono"
        >
          Print this document (A4 PDF) ↗
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {policies.map(p => (
          <button
            key={p.slug}
            type="button"
            onClick={() => onNavigateToPage?.(p.slug)}
            className="px-2.5 py-1 bg-[#faf7f2] border border-[#e6dccb] rounded text-xs text-[#5c5248] hover:text-[#1a1612] hover:border-[#bda67b] cursor-pointer transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="pt-3 border-t border-[#f0ebe3] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-[#8a7f73]">
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'terms_fine_print', fieldName: 'Fine print', helpText: 'Legal review and jurisdiction stamp' })}
          onBlur={e => onFieldChange?.('terms_fine_print', e.currentTarget.textContent || '')}
          className="outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('terms_fine_print', 'These Terms are governed by the laws of India. Last reviewed and verified on 26 September 2026.')}
        </p>
        <span className="font-mono text-[#8a6a36]">Registered in Indore, MP</span>
      </div>
    </section>
  );
};

export default TermsPoliciesLine;
