/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingWorkedExamplesSection (Spec § 8.16 Part 05, Screen 57)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PRICING_WORKED_EXAMPLES } from '../../data/pricingRegistry';

export interface PricingWorkedExamplesSectionProps {
  onSelectFigure?: (figureKey: string) => void;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
}

export const PricingWorkedExamplesSection: React.FC<PricingWorkedExamplesSectionProps> = ({
  onSelectFigure,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'rental' | 'preloved'>('rental');

  const titlePrefix = fieldValues['pricing_examples_prefix'] || PRICING_WORKED_EXAMPLES.titlePrefix;
  const italicWord = fieldValues['pricing_examples_italic'] || PRICING_WORKED_EXAMPLES.italicWord;
  const subline = fieldValues['pricing_examples_subline'] || PRICING_WORKED_EXAMPLES.subline;

  const isRental = activeTab === 'rental';

  return (
    <div className="pt-2 pb-4 space-y-6">
      {/* Section Header */}
      <div className="border-t border-dashed border-[#dcd7ce] pt-8">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal">
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('pricing_examples_prefix')}
            onBlur={(e) => onFieldChange('pricing_examples_prefix', e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
          >{titlePrefix}</span>
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('pricing_examples_italic')}
            onBlur={(e) => onFieldChange('pricing_examples_italic', e.currentTarget.textContent || '')}
            className="italic text-[#935b1e] cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
          >{italicWord}</span>
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('pricing_examples_subline')}
          onBlur={(e) => onFieldChange('pricing_examples_subline', e.currentTarget.textContent || '')}
          className="text-xs sm:text-sm text-[#57534e] mt-1.5 leading-relaxed cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors"
        >{subline}</p>
      </div>

      {/* Segmented Switcher */}
      <div className="inline-flex p-1 bg-[#ede8e1] rounded-[6px] gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('rental')}
          className={`px-4 py-1.5 rounded-[4px] text-xs font-medium transition-all cursor-pointer ${
            isRental ? 'bg-[#1c1917] text-white shadow-xs' : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >A rental</button>
        <button
          type="button"
          onClick={() => setActiveTab('preloved')}
          className={`px-4 py-1.5 rounded-[4px] text-xs font-medium transition-all cursor-pointer ${
            !isRental ? 'bg-[#1c1917] text-white shadow-xs' : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >A preloved piece</button>
      </div>

      {/* Story / Lead paragraph */}
      <div className="text-base sm:text-lg font-serif text-[#1c1917] leading-relaxed">
        {isRental ? (
          <p>
            <span>A </span>
            <span className="border-b border-dotted border-[#935b1e] text-[#935b1e] italic">bridal lehenga</span>
            <span> priced at </span>
            <span className="font-mono text-sm sm:text-base border border-[#d6cfc4] bg-[#f8f5f0] px-1.5 py-0.5 rounded">₹18,000</span>
            <span> for its standard window of </span>
            <button
              type="button"
              onClick={() => onSelectFigure?.('standard_rental_window')}
              className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm font-semibold cursor-pointer hover:bg-[#fef08a]"
            >3 days</button>
            <span>, with a daily rate of </span>
            <span className="font-mono text-sm sm:text-base border border-[#d6cfc4] bg-[#f8f5f0] px-1.5 py-0.5 rounded">₹3,500</span>
            <span> and a deposit of </span>
            <span className="font-mono text-sm sm:text-base border border-[#d6cfc4] bg-[#f8f5f0] px-1.5 py-0.5 rounded">₹20,000</span>
            <span>.</span>
          </p>
        ) : (
          <p>
            <span>A </span>
            <span className="border-b border-dotted border-[#935b1e] text-[#935b1e] italic">designer saree</span>
            <span> listed at </span>
            <span className="font-mono text-sm sm:text-base border border-[#d6cfc4] bg-[#f8f5f0] px-1.5 py-0.5 rounded">₹60,000</span>
            <span>, on which an offer of </span>
            <span className="font-mono text-sm sm:text-base border border-[#d6cfc4] bg-[#f8f5f0] px-1.5 py-0.5 rounded">₹54,000</span>
            <span> has been accepted.</span>
          </p>
        )}
      </div>

      {/* Statement Card */}
      <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs">
        {isRental ? (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
              <span className="text-[#44403c]">
                <span>Standard rental window, </span>
                <button
                  type="button"
                  onClick={() => onSelectFigure?.('standard_rental_window')}
                  className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
                >3 days</button>
              </span>
              <span className="font-mono text-[#1c1917] font-medium">₹18,000</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
              <span className="text-[#44403c]">
                <span>1 extra day at </span>
                <span className="font-mono text-xs border border-[#d6cfc4] bg-[#f8f5f0] px-1 py-0.5 rounded">₹3,500</span>
              </span>
              <span className="font-mono text-[#1c1917] font-medium">₹3,500</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
              <span className="font-serif text-[#1c1917] font-medium">Rental fee</span>
              <span className="font-mono text-[#1c1917] font-semibold">₹21,500</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
              <span className="text-[#44403c]">
                <span>GST at </span>
                <button
                  type="button"
                  onClick={() => onSelectFigure?.('gst_rental')}
                  className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
                >18%</button>
              </span>
              <span className="font-mono text-[#1c1917] font-medium">₹3,870</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-[#ded8cf]">
              <span className="text-[#44403c]">Delivery, both journeys</span>
              <span className="text-[#2e7d32] font-semibold">Free</span>
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-lg text-[#1c1917] font-medium">Paid at checkout</span>
              <span className="font-mono text-2xl sm:text-3xl text-[#1c1917] font-bold">₹25,370</span>
            </div>

            {/* Callouts */}
            <div className="space-y-3 pt-4 border-t border-[#f1ece4]">
              <div className="pl-3.5 border-l-2 border-[#c5ad7d] text-xs text-[#57534e] leading-relaxed">
                <span>Deposit, held separately ₹20,000. Returned within </span>
                <button
                  type="button"
                  onClick={() => onSelectFigure?.('deposit_refund_window')}
                  className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold cursor-pointer hover:bg-[#fef08a]"
                >3 to 5 business days</button>
                <span> of inspection, to the account it came from.</span>
              </div>
              <div className="pl-3.5 border-l-2 border-[#c5ad7d] text-xs text-[#57534e] leading-relaxed">
                If it comes back after its Return Date, each late day costs ₹3,500 plus GST, exactly like an extra day.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
              <span className="text-[#44403c]">Accepted offer price</span>
              <span className="font-mono text-[#1c1917] font-medium">₹54,000</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
              <span className="text-[#44403c]">
                <span>GST at </span>
                <button
                  type="button"
                  onClick={() => onSelectFigure?.('gst_preloved')}
                  className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
                >5%</button>
              </span>
              <span className="font-mono text-[#1c1917] font-medium">₹2,700</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-[#ded8cf]">
              <span className="text-[#44403c]">Delivery in India</span>
              <span className="text-[#2e7d32] font-semibold">Free</span>
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif text-lg text-[#1c1917] font-medium">Paid at checkout</span>
              <span className="font-mono text-2xl sm:text-3xl text-[#1c1917] font-bold">₹56,700</span>
            </div>

            {/* Callout */}
            <div className="pt-4 border-t border-[#f1ece4]">
              <div className="pl-3.5 border-l-2 border-[#c5ad7d] text-xs text-[#57534e] leading-relaxed">
                No deposit, and nothing more to pay once it is yours.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingWorkedExamplesSection;
