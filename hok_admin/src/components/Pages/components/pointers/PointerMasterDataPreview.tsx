/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PointerMasterDataPreview (Spec §12, Screens 66, 67)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem } from '../../types';
import { RegisterFigurePointer } from './RegisterFigurePointer';

interface PointerMasterDataPreviewProps {
  figures: FigureItem[];
  onOpenFigure?: (key: string) => void;
}

export const PointerMasterDataPreview: React.FC<PointerMasterDataPreviewProps> = ({
  figures,
  onOpenFigure
}) => {
  const getFig = (key: string, fallbackLabel: string, fallbackVal: string): FigureItem => {
    return (
      figures.find(f => f.key === key) || {
        key,
        label: fallbackLabel,
        subject: 'Master Data',
        type: 'time',
        displayValue: fallbackVal,
        owner: 'Pages',
        status: 'live',
        hasPendingChange: false
      }
    );
  };

  const rentalWindowFig = getFig('rental_window_std', 'Standard rental window', '4 days');
  const depositRefundFig = getFig('deposit_return_days', 'Deposit return window', 'within 48 hours of inspection');
  const dispatchPrelovedFig = getFig('dispatch_preloved', 'Preloved dispatch', 'within 24 hours');
  const deliveryStdFig = getFig('delivery_standard', 'Standard delivery time', '2 to 4 working days');
  const deliveryExpressFig = getFig('delivery_express', 'Express delivery time', 'Next business day');

  return (
    <div className="space-y-6">
      {/* Screen 66: Master Data Rental Logic */}
      <div>
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Master Data: Rental Logic
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screen 66. Rental duration limits and deposit timelines read the figure register.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegisterFigurePointer
            figure={rentalWindowFig}
            label="Minimum rental duration"
            hint="Standard rental window. Product booking cards, calendar selectors and the rental contract derive duration from this figure."
            onOpenFigure={onOpenFigure}
          />

          <RegisterFigurePointer
            figure={depositRefundFig}
            label="Deposit refund timeline"
            hint="Deposit refund window, counted from inspection. Printed on invoices, deposit receipts and the Deposit Policy."
            onOpenFigure={onOpenFigure}
          />
        </div>
      </div>

      {/* Screen 67: Master Data Shipping Defaults */}
      <div className="pt-4 border-t border-[#eee5d8]">
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Master Data: Shipping Defaults
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screen 67. Dispatch lead times and delivery promises shown on every product page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RegisterFigurePointer
            figure={dispatchPrelovedFig}
            label="Dispatch lead time (we hold)"
            hint="Dispatch window for pieces in House of Kaira vaults."
            onOpenFigure={onOpenFigure}
          />

          <RegisterFigurePointer
            figure={deliveryStdFig}
            label="Delivery estimate (standard)"
            hint="Standard delivery transit timeline across mainland India."
            onOpenFigure={onOpenFigure}
          />

          <RegisterFigurePointer
            figure={deliveryExpressFig}
            label="Delivery estimate (express)"
            hint="Express expedited courier transit timeline."
            onOpenFigure={onOpenFigure}
          />
        </div>
      </div>
    </div>
  );
};

export default PointerMasterDataPreview;
