/* ========================================
   Promotions Module - Unknown Codes Card
   "Codes People Try That Don't Exist"
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.5
   ======================================== */

import React from 'react';
import './styles/UnknownCodesCard.css';
import { Card, StatusBadge } from './UI';
import { formatDate } from '../utils/formatter';

interface UnknownCodesCardProps {
  codes: { code: string; count: number; lastAttempt: string }[];
}

export const UnknownCodesCard: React.FC<UnknownCodesCardProps> = ({ codes }) => {
  const totalCodes = codes.length;

  return (
    <Card
      header={
        <>
          <span className="card__title">Codes People Try That Don't Exist</span>
          <StatusBadge status={totalCodes === 0 ? 'None' : `${totalCodes} codes`} />
        </>
      }
    >
      <div className="unknown-codes__intro">
        Codes shoppers typed that House of Kaira has never issued — what they expected to be on offer, and where an announcement may have gone out with the wrong wording. Seeded for design; checkout doesn't log these yet.
      </div>

      {totalCodes === 0 ? (
        <div className="unknown-codes__empty">
          Nobody has tried a code that doesn't exist.
        </div>
      ) : (
        <>
          {codes.map(({ code, count, lastAttempt }) => (
            <div key={code} className="unknown-codes__row">
              <span className="unknown-codes__code">{code}</span>
              <span className="unknown-codes__meta">
                tried {count} time{count > 1 ? 's' : ''} · last {formatDate(lastAttempt)}
              </span>
            </div>
          ))}
          <div className="unknown-codes__closing">
            If a name keeps coming back, either issue it or find the post that promised it.
          </div>
        </>
      )}
    </Card>
  );
};