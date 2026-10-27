/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PointerPlatformLegalPreview (Spec §12, Screens 68-71)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem, PageCardData } from '../../types';
import { RegisterFigurePointer } from './RegisterFigurePointer';
import { RegisterPagePointer } from './RegisterPagePointer';

interface PointerPlatformLegalPreviewProps {
  figures: FigureItem[];
  pages: PageCardData[];
  onOpenFigure?: (key: string) => void;
  onOpenPage?: (slug: string) => void;
}

export const PointerPlatformLegalPreview: React.FC<PointerPlatformLegalPreviewProps> = ({
  figures,
  pages,
  onOpenFigure,
  onOpenPage
}) => {
  const getFig = (key: string, fallbackLabel: string, fallbackVal: string): FigureItem => {
    return (
      figures.find(f => f.key === key) || {
        key,
        label: fallbackLabel,
        subject: 'Platform & Legal',
        type: 'words',
        displayValue: fallbackVal,
        owner: 'Pages',
        status: 'live',
        hasPendingChange: false
      }
    );
  };

  const gstinFig = getFig('gstin', 'GSTIN', '07AAAAA0000A1Z5');
  const legalNameFig = getFig('business_legal_name', 'Legal name', 'House of Kaira Private Limited');
  const legalAddressFig = getFig('legal_address', 'Principal place of business', 'Old Palasiya, A.B. Road, Indore 452001');
  const listerPayoutFig = getFig('payout_lister_days', 'Lister payout within', '7 days of return inspection');

  const shippingPage = pages.find(p => p.slug === 'shipping') || {
    id: 'p-shipping',
    slug: 'shipping',
    title: 'Shipping & Delivery',
    canonicalGroup: 'Policies',
    status: 'live',
    version: 'Version 6',
    lastReviewed: '20 October 2026'
  };

  const policyPages = pages.filter(p => p.canonicalGroup === 'Policies').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Screen 70: Tax & GST */}
      <div>
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Platform & Legal: Tax & GST
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screen 70. Statutory business figures are set once in Pages and read on every tax invoice and receipt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RegisterFigurePointer
            figure={gstinFig}
            label="GSTIN"
            hint="Printed on tax invoices, checkout GST summaries and legal notices."
            onOpenFigure={onOpenFigure}
          />
          <RegisterFigurePointer
            figure={legalNameFig}
            label="Legal entity name"
            hint="Official registered company name."
            onOpenFigure={onOpenFigure}
          />
          <RegisterFigurePointer
            figure={legalAddressFig}
            label="Invoice address"
            hint="Principal registered business address printed on all customer invoices."
            onOpenFigure={onOpenFigure}
          />
        </div>
      </div>

      {/* Screen 68 & 69: Shipping & Payments */}
      <div className="pt-4 border-t border-[#eee5d8]">
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Platform & Legal: Shipping & Payments
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screens 68 and 69. Policies and payout cycles point directly to Pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegisterFigurePointer
            figure={listerPayoutFig}
            label="Lister payout cycle"
            hint="Days after garment return inspection before funds are transferred to owners."
            onOpenFigure={onOpenFigure}
          />

          <RegisterPagePointer
            page={shippingPage}
            label="Shipping policy"
            hint="The pickup is booked for the Return Date, the last day of the standard window. Text boxes are replaced by this pointer."
            onOpenPage={onOpenPage}
          />
        </div>
      </div>

      {/* Screen 71: Legal Pages */}
      <div className="pt-4 border-t border-[#eee5d8]">
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Platform & Legal: Policy Pages
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screen 71. Replaces legacy disconnected text boxes with live pointers to the canonical policy pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policyPages.map(pol => (
            <RegisterPagePointer
              key={pol.slug}
              page={pol}
              onOpenPage={onOpenPage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointerPlatformLegalPreview;
