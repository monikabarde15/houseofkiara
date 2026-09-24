/* ========================================
   Promotions Module - Change History
   Timeline of edits
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.15
   ======================================== */

import React from 'react';
import './styles/ChangeHistory.css';
import { Card } from '../../components/UI';
import { PromoHistoryEntry } from '../../types/promotions.types';

interface ChangeHistoryProps {
  history: PromoHistoryEntry[];
}

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({ history }) => {
  const hasHistory = history && history.length > 0;

  return (
    <Card header={<span className="card__title">Change History</span>}>
      <div className="change-history__intro">
        Every edit to a code that gives money away, newest first — the answer to "who changed the cap, and when?"
      </div>

      {!hasHistory ? (
        <div className="change-history__empty">
          No changes recorded yet.
        </div>
      ) : (
        <>
          {history.map((entry, index) => (
            <div key={index} className="change-history__entry">
              <div className="change-history__dot" />
              <div className="change-history__content">
                <div className="change-history__text">{entry.e}</div>
                <div className="change-history__stamp">{entry.t}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </Card>
  );
};