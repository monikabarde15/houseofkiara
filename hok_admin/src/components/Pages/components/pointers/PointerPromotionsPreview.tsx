/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PointerPromotionsPreview (Spec §12, Screen 65)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { FigureItem } from '../../types';
import { RegisterFigurePointer } from './RegisterFigurePointer';

interface PointerPromotionsPreviewProps {
  figures: FigureItem[];
  onOpenFigure?: (key: string) => void;
}

export const PointerPromotionsPreview: React.FC<PointerPromotionsPreviewProps> = ({
  figures,
  onOpenFigure
}) => {
  const [measureRule, setMeasureRule] = useState<'before' | 'after'>('after');
  const freeDeliveryFig = figures.find(f => f.key === 'free_delivery_min') || {
    key: 'free_delivery_min',
    label: 'Free delivery from',
    subject: 'Shipping & Delivery',
    type: 'amount',
    displayValue: '₹5,000',
    owner: 'Pages',
    status: 'live',
    hasPendingChange: false
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e8dfd2] pb-3">
        <h3 className="font-serif text-lg font-normal text-[#1a1612]">
          Promotions: Checkout Rules
        </h3>
        <p className="text-xs text-[#6e6358] mt-1">
          Screen 65. The free delivery threshold is not kept here. It is read directly from the Pages figure register.
        </p>
      </div>

      <RegisterFigurePointer
        figure={freeDeliveryFig}
        label="Free delivery threshold"
        hint="A figure, set once in Pages under Figures. The cart, checkout and every page that mentions it read it from there."
        onOpenFigure={onOpenFigure}
        extraControls={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-medium text-[#1a1612]">Threshold measured on</div>
              <div className="text-[11px] text-[#6e6358] mt-0.5">
                Stays here because it is a checkout rule, not a printed figure.
              </div>
            </div>
            <div className="inline-flex rounded-md border border-[#d9ccb6] bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setMeasureRule('before')}
                className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                  measureRule === 'before'
                    ? 'bg-[#1a1612] text-white font-medium'
                    : 'text-[#6e6358] hover:text-[#1a1612]'
                }`}
              >
                Before discount
              </button>
              <button
                type="button"
                onClick={() => setMeasureRule('after')}
                className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                  measureRule === 'after'
                    ? 'bg-[#1a1612] text-white font-medium'
                    : 'text-[#6e6358] hover:text-[#1a1612]'
                }`}
              >
                After discount
              </button>
            </div>
          </div>
        }
      />

      <div className="bg-[#f7f2ea] border border-[#e5ddd0] rounded-[6px] p-3 text-xs text-[#6e6358]">
        <span className="font-medium text-[#1a1612]">Promotions New Code hint: </span>
        <span>Orders of {freeDeliveryFig.displayValue} or more already ship free. The discount code creator reads this live figure.</span>
      </div>
    </div>
  );
};

export default PointerPromotionsPreview;
