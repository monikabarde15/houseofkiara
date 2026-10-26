/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureSetHereEditor (Spec §5.3, §5.4, Screens 10-12)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useEffect } from 'react';
import { FigureItem } from '../types';

interface FigureSetHereEditorProps {
  figure: FigureItem;
  onAddChange: (key: string, newValue: string, when: 'now' | 'date', date?: string, why?: string) => void;
  onDiscardChange: (key: string) => void;
  onReviewAndPublish?: () => void;
}

export const FigureSetHereEditor: React.FC<FigureSetHereEditorProps> = ({
  figure,
  onAddChange,
  onDiscardChange,
  onReviewAndPublish
}) => {
  const [inputValue, setInputValue] = useState(String(figure.value ?? figure.displayValue ?? ''));
  const [whenOption, setWhenOption] = useState<'now' | 'date'>('now');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(String(figure.value ?? figure.displayValue ?? ''));
    setWhenOption('now');
    setEffectiveDate('');
    setChangeReason('');
    setErrorMessage(null);
  }, [figure.key, figure.value, figure.displayValue]);

  const originalValueStr = String(figure.value ?? figure.displayValue ?? '');
  const hasChanged = inputValue.trim() !== '' && inputValue.trim() !== originalValueStr;

  const validateValue = (val: string): string | null => {
    if (val.includes('-')) return 'No dashes: write "to" for a range, or use a comma.';
    if (figure.type === 'amount' || figure.format === 'currency') {
      const num = Number(val.replace(/[^\d.]/g, ''));
      if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Enter an amount in whole rupees.';
    }
    if (figure.type === 'percentage') {
      const num = Number(val);
      if (isNaN(num) || num < 0 || num > 100) return 'Enter a percentage between 0 and 100.';
    }
    return null;
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setErrorMessage(validateValue(val));
  };

  const handleSave = () => {
    const err = validateValue(inputValue);
    if (err) {
      setErrorMessage(err);
      return;
    }
    const formattedVal = (figure.type === 'amount' || figure.format === 'currency') && !inputValue.startsWith('₹')
      ? `₹${Number(inputValue).toLocaleString('en-IN')}`
      : inputValue;
    onAddChange(figure.key, formattedVal, whenOption, effectiveDate, changeReason);
  };

  if (figure.hasPendingChange && figure.waitingChange) {
    return (
      <div className="bg-[#fffdf7] border border-[#e8dcb8] rounded-[6px] p-3 text-[12px] space-y-2">
        <div className="flex items-center gap-1.5 text-[#8a6a36] font-medium">
          <span>ⓘ</span>
          <span>Waiting to publish: {figure.displayValue} to {figure.waitingChange.value}, as soon as it is published</span>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button type="button" onClick={() => onDiscardChange(figure.key)} className="text-xs text-[#b85c38] hover:underline cursor-pointer">
            Discard the change
          </button>
          {onReviewAndPublish && (
            <button type="button" onClick={onReviewAndPublish} className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer">
              Review & publish
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {(figure.type === 'amount' || figure.format === 'currency') && (
          <span className="text-[15px] font-serif text-[#73675a]">₹</span>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          className="w-36 px-2.5 py-1 text-[13px] bg-white border border-[#e6dccb] rounded-[4px] text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
        />
      </div>

      <div className="text-[12px] text-[#73675a] flex items-baseline gap-1.5">
        <span>Prints as</span>
        <span className="font-serif text-[17px] text-[#1a1612]">
          {(figure.type === 'amount' || figure.format === 'currency') && !inputValue.startsWith('₹')
            ? `₹${Number(inputValue || 0).toLocaleString('en-IN')}`
            : inputValue}
        </span>
        {hasChanged && (
          <span className="text-[12px]">
            instead of <span className="line-through">{figure.displayValue}</span>
          </span>
        )}
      </div>

      <p className="text-[11.5px] text-[#8a7f73]">
        {figure.ruleLine || 'Whole rupees. Counted on the pieces before GST.'}
      </p>

      {errorMessage && (
        <p className="text-[12px] text-[#b85c38] font-medium">{errorMessage}</p>
      )}

      {hasChanged && (
        <div className="space-y-3 pt-2 border-t border-[#f0ebe3]">
          <div>
            <label className="block text-[12px] font-medium text-[#1a1612] mb-1.5">When it changes</label>
            <div className="space-y-1.5 text-[12px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="whenChange" checked={whenOption === 'now'} onChange={() => setWhenOption('now')} className="text-[#8a6a36]" />
                <span>As soon as it is published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="whenChange" checked={whenOption === 'date'} onChange={() => setWhenOption('date')} className="text-[#8a6a36]" />
                <span>From a date</span>
                {whenOption === 'date' && (
                  <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className="ml-2 px-2 py-0.5 border border-[#e6dccb] rounded text-xs" />
                )}
              </label>
            </div>
            <div className="mt-2 p-2.5 rounded-[4px] bg-[#f4f7f9] border border-[#d8e3ea] text-[11px] text-[#33556f] leading-relaxed">
              Orders and bookings made before the change keep the figure they were made under. Every order stores the terms in force when it was placed, and every refund, late charge and due date on it is worked out from those.
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#1a1612] mb-1">Why it is changing</label>
            <textarea
              rows={2}
              value={changeReason}
              onChange={e => setChangeReason(e.target.value)}
              placeholder="e.g. Festive season offer"
              className="w-full p-2 text-xs border border-[#e6dccb] rounded-[4px] text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
            />
            <p className="text-[11px] text-[#8a7f73] mt-0.5">Kept in this figure's history, and in the history of every policy page that prints it.</p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              disabled={!!errorMessage}
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded-[4px] bg-[#c5ad7d] text-[#1a1612] text-xs font-medium hover:bg-[#b89e6c] disabled:opacity-50 cursor-pointer"
            >
              Add to changes
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue(originalValueStr);
                setErrorMessage(null);
              }}
              className="text-xs text-[#73675a] hover:text-[#1a1612] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FigureSetHereEditor;
