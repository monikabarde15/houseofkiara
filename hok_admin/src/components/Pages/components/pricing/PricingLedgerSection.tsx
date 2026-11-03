/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingLedgerSection (Spec § 8.16 Part 03, Screen 56)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PRICING_LEDGER } from '../../data/pricingRegistry';

export interface PricingLedgerSectionProps {
  activeSide: 'pay' | 'earn';
  onSideChange: (side: 'pay' | 'earn') => void;
  onSelectFigure?: (figureKey: string) => void;
  onOpenQuestion?: (questionId: string) => void;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
}

export const PricingLedgerSection: React.FC<PricingLedgerSectionProps> = ({
  activeSide,
  onSideChange,
  onSelectFigure,
  onOpenQuestion,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const isPay = activeSide === 'pay';
  const ledger = isPay ? PRICING_LEDGER.pay : PRICING_LEDGER.earn;

  const title = fieldValues[`pricing_ledger_title_${activeSide}`] || ledger.title;
  const hint = fieldValues[`pricing_ledger_hint_${activeSide}`] || ledger.hint;

  return (
    <div className="pt-2 pb-4 space-y-6">
      {/* Perspective Toggle Buttons (Screen 56) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSideChange('pay')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
            isPay
              ? 'bg-[#1c1917] text-white shadow-xs'
              : 'bg-white border border-[#ded8cf] text-[#44403c] hover:bg-[#faf8f5]'
          }`}
        >
          What you pay
        </button>
        <button
          type="button"
          onClick={() => onSideChange('earn')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
            !isPay
              ? 'bg-[#1c1917] text-white shadow-xs'
              : 'bg-white border border-[#ded8cf] text-[#44403c] hover:bg-[#faf8f5]'
          }`}
        >
          What you earn
        </button>
      </div>

      {/* Header */}
      <div>
        <h2
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField(`pricing_ledger_title_${activeSide}`)}
          onBlur={(e) => onFieldChange(`pricing_ledger_title_${activeSide}`, e.currentTarget.textContent || '')}
          className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors"
        >
          {title}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField(`pricing_ledger_hint_${activeSide}`)}
          onBlur={(e) => onFieldChange(`pricing_ledger_hint_${activeSide}`, e.currentTarget.textContent || '')}
          className="text-xs sm:text-sm text-[#78716c] mt-1 cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors"
        >
          {hint}
        </p>
      </div>

      {/* Table (Screen 56) */}
      {isPay ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#ded8cf]">
                <th className="py-2.5 pr-4 font-normal text-[#8a7f73] w-1/4"></th>
                <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-wider text-[#935b1e] font-semibold w-3/8">
                  RENTING
                </th>
                <th className="py-2.5 pl-4 font-mono text-[11px] uppercase tracking-wider text-[#935b1e] font-semibold w-3/8">
                  BUYING PRELOVED
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1ece4]">
              {PRICING_LEDGER.pay.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-3 pr-4 font-serif text-sm sm:text-base text-[#1c1917] font-normal">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-[#44403c]">
                    {row.rentalFigureKey ? (
                      <span>
                        {row.rental.split(row.rentalFigureValue || '')[0]}
                        <button
                          type="button"
                          onClick={() => onSelectFigure?.(row.rentalFigureKey!)}
                          className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
                        >
                          {row.rentalFigureValue}
                        </button>
                        {row.rental.split(row.rentalFigureValue || '')[1]}
                      </span>
                    ) : (
                      <span>{row.rental}</span>
                    )}
                  </td>
                  <td className="py-3 pl-4 text-[#44403c]">
                    {row.prelovedFigureKey ? (
                      <span>
                        {row.preloved.split(row.prelovedFigureValue || '')[0]}
                        <button
                          type="button"
                          onClick={() => onSelectFigure?.(row.prelovedFigureKey!)}
                          className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
                        >
                          {row.prelovedFigureValue}
                        </button>
                        {row.preloved.split(row.prelovedFigureValue || '')[1]}
                      </span>
                    ) : (
                      <span>{row.preloved}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <tbody className="divide-y divide-[#f1ece4]">
              {PRICING_LEDGER.earn.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-3.5 pr-4 font-serif text-sm sm:text-base text-[#1c1917] font-normal w-1/3">
                    {row.name}
                  </td>
                  <td className="py-3.5 pl-4 text-[#44403c] w-2/3">
                    <div className="font-medium text-[#1c1917]">
                      {row.figureKey ? (
                        <span>
                          {row.detail.split(row.figureValue || '')[0]}
                          <button
                            type="button"
                            onClick={() => onSelectFigure?.(row.figureKey!)}
                            className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
                          >
                            {row.figureValue}
                          </button>
                          {row.detail.split(row.figureValue || '')[1]}
                        </span>
                      ) : (
                        <span>{row.detail}</span>
                      )}
                    </div>
                    <div className="text-xs text-[#78716c] mt-0.5">
                      {row.subtext}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footnote */}
      <p className="text-xs text-[#78716c] leading-relaxed pt-1">
        {ledger.footText}
        {isPay && (
          <button
            type="button"
            onClick={() => onOpenQuestion?.('y-ways')}
            className="text-[#935b1e] underline hover:text-[#785b1a] ml-1 cursor-pointer font-medium"
          >
            Every way to pay
          </button>
        )}
      </p>
    </div>
  );
};

export default PricingLedgerSection;
