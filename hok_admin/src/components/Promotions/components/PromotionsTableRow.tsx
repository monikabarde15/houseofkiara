/* ========================================
   Promotions Module - Table Row
   Individual row with all columns
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.9
   ======================================== */

import React from 'react';
import './styles/PromotionsTableRow.css';
import { PromoCode, DerivedPromoState } from '../types/promotions.types';
import { StatusBadge, AttentionPill, Button } from './UI';
import { formatOfferLine, formatAudiencePhrase, formatUsedCell, formatWindowDate } from '../utils/formatter';
import { AttentionFlag } from '../utils/derived';

interface PromotionsTableRowProps {
  code: PromoCode;
  derivedState: DerivedPromoState;
  redemptions: number;
  flags: AttentionFlag[];
  selected: boolean;
  onSelect: (code: string, selected: boolean) => void;
  onClick: (code: string) => void;
}

export const PromotionsTableRow: React.FC<PromotionsTableRowProps> = ({
  code,
  derivedState,
  redemptions,
  flags,
  selected,
  onSelect,
  onClick,
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(code.code, e.target.checked);
  };

  const handleRowClick = () => {
    onClick(code.code);
  };

  // Format window cell
  let windowText = 'no expiry';
  if (derivedState === 'Scheduled' && code.validFrom) {
    windowText = formatWindowDate(code.validFrom, 'starts');
  } else if (derivedState === 'Expired' && code.validUntil) {
    windowText = formatWindowDate(code.validUntil, 'ended');
  } else if (code.validUntil) {
    windowText = formatWindowDate(code.validUntil, 'ends');
  }

  const displayFlags = flags.slice(0, 2);
  const overflowCount = flags.length - 2;

  return (
    <tr className="table-row" onClick={handleRowClick}>
      <td className="table-row__cell table-row__cell--checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={handleCheckboxChange}
        />
      </td>
      <td className="table-row__cell table-row__cell--code">
        <div className="table-row__code">{code.code}</div>
        <div className="table-row__offer">{formatOfferLine(code)}</div>
      </td>
      <td className="table-row__cell table-row__cell--audience">
        {formatAudiencePhrase(code)}
      </td>
      <td className="table-row__cell table-row__cell--used">
        {formatUsedCell(redemptions, code.usesTotalCap)}
      </td>
      <td className="table-row__cell table-row__cell--window">
        {windowText}
      </td>
      <td className="table-row__cell table-row__cell--status">
        <StatusBadge status={derivedState} />
      </td>
      <td className="table-row__cell table-row__cell--attention">
        {displayFlags.length > 0 ? <>
          {displayFlags.map(flag => (
            <AttentionPill key={flag.key} title={flag.trigger}>
              {flag.chip}
            </AttentionPill>
          ))}
          {overflowCount > 0 && (
            <AttentionPill>+{overflowCount}</AttentionPill>
          )}
        </> : <span className="text-stone-400 text-xs">No attention</span>}
      </td>
      <td className="table-row__cell table-row__cell--action">
        <Button variant="secondary" size="small">View →</Button>
      </td>
    </tr>
  );
};
