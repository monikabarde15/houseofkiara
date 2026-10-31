/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceEarningsPreview (Spec §8.8 Part 05, Page 36)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPieceEarningsPreviewProps extends EditableFieldProps {
  hidden?: boolean;
}

export const ListYourPieceEarningsPreview: React.FC<ListYourPieceEarningsPreviewProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  highlightedFigureKey,
  onSelectFigure,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;
  const [estimatedValue, setEstimatedValue] = useState<number>(40000);

  const perRental = Math.round(estimatedValue * 0.15);
  const yearly = perRental * 4;

  return (
    <section
      id="earnings-preview"
      className={`p-8 md:p-10 bg-white rounded-[10px] border border-[#ebe5dc] shadow-2xs space-y-6 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      <div>
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_calc_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker for earnings calculator' })}
          onBlur={e => onFieldChange?.('lyp_calc_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_calc_eyebrow', 'EARNINGS CALCULATOR')}
        </span>
        <h2
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_calc_heading', fieldName: 'Heading', helpText: 'Headline for earnings calculator' })}
          onBlur={e => onFieldChange?.('lyp_calc_heading', e.currentTarget.textContent || '')}
          className="font-serif text-2xl md:text-3xl text-[#1a1612] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_calc_heading', 'See what your piece could earn')}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_calc_lead', fieldName: 'Line under heading', helpText: 'Lead text for earnings calculator' })}
          onBlur={e => onFieldChange?.('lyp_calc_lead', e.currentTarget.textContent || '')}
          className="text-xs text-[#5c5248] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_calc_lead', 'Estimates based on typical designer pieces across our rental calendar.')}
        </p>
      </div>

      {/* Interactive Estimator Box */}
      <div className="p-6 bg-[#faf7f2] rounded-[8px] border border-[#eadecc] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-[#1a1612]">Original retail value of the piece</div>
            <div className="text-[11px] text-[#8a7f73]">Adjust the slider to see estimated rental payouts</div>
          </div>
          <div className="font-serif text-2xl text-[#8a6a36]">₹{estimatedValue.toLocaleString('en-IN')}</div>
        </div>

        <input
          type="range"
          min={10000}
          max={250000}
          step={5000}
          value={estimatedValue}
          onChange={e => setEstimatedValue(Number(e.target.value))}
          className="w-full accent-[#8a6a36] cursor-pointer"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#f0ebe3]">
          <div className="p-4 bg-white rounded-[6px] border border-[#ebe5dc]">
            <div className="text-[11px] text-[#8a7f73] uppercase tracking-wider font-mono">Per rental estimate</div>
            <div className="font-serif text-2xl text-[#1a1612] mt-1">₹{perRental.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-[#5c5248] mt-1">Based on 15% typical rental rate</div>
          </div>

          <div className="p-4 bg-white rounded-[6px] border border-[#ebe5dc]">
            <div className="text-[11px] text-[#8a7f73] uppercase tracking-wider font-mono">Estimated 4 rentals/year</div>
            <div className="font-serif text-2xl text-[#8a6a36] mt-1">₹{yearly.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-[#5c5248] mt-1">Net seasonal earnings to lister</div>
          </div>
        </div>

        {/* Lister Share Figure Mention with Never Printed flag */}
        <div className="pt-2 flex items-center justify-between text-xs text-[#8a7f73] border-t border-[#f0ebe3]">
          <div className="flex items-center gap-2">
            <span>Commission model:</span>
            <span
              onClick={() => onSelectFigure?.('lister_share')}
              className={`font-serif text-sm text-[#8a6a36] px-1 rounded cursor-pointer ${
                highlightedFigureKey === 'lister_share' ? 'ring-2 ring-[#c5ad7d] bg-[#faf1da]' : 'hover:bg-[#faf1da]'
              }`}
            >
              Agreed piece by piece
            </span>
            <span className="text-[10px] text-[#7352a8] bg-[#f5effc] border border-[#d8c2f2] px-1.5 py-0.2 rounded font-mono">
              Never printed
            </span>
          </div>
          <span className="text-[11px] font-mono">Waiting on decision 14.1</span>
        </div>
      </div>

      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField?.({ fieldId: 'lyp_calc_note', fieldName: 'The line under the result', helpText: 'Disclaimer note under calculator' })}
        onBlur={e => onFieldChange?.('lyp_calc_note', e.currentTarget.textContent || '')}
        className="text-[11px] text-[#8a7f73] italic outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
      >
        {getVal('lyp_calc_note', '* Estimated returns based on market demand. Lister share is agreed piece by piece upon physical inspection.')}
      </p>
    </section>
  );
};

export default ListYourPieceEarningsPreview;
