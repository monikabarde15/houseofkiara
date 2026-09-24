/* ========================================
   Promotions Module - Attention Strip
   Flags with snooze + restore
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.2
   ======================================== */

import React from 'react';
import './styles/AttentionStrip.css';
import { AttentionFlag } from '../utils/derived';

interface AttentionStripProps {
  flags: AttentionFlag[];
  snoozedCount: number;
  onSnooze: (flagKey: string) => void;
  onRestore: () => void;
}

export const AttentionStrip: React.FC<AttentionStripProps> = ({
  flags,
  snoozedCount,
  onSnooze,
  onRestore,
}) => {
  const hasFlags = flags.length > 0;
  const hasSnoozed = snoozedCount > 0;

  if (!hasFlags && !hasSnoozed) {
    return null;
  }

  return (
    <div className="attention-strip">
      <span className="attention-strip__label">
        {hasFlags ? 'Needs attention' : 'Snoozed'}
      </span>

      {flags.map(flag => (
        <span key={flag.key} className="attention-strip__flag" title={flag.trigger}>
          {flag.fullSentence}
          <span className="attention-strip__flag-arrow"> →</span>
          <button
            className="attention-strip__flag-snooze"
            onClick={() => onSnooze(flag.key)}
            title="Snooze this flag for 30 days"
          >
            ×
          </button>
        </span>
      ))}

      {hasSnoozed && (
        <span className="attention-strip__snoozed">
          {snoozedCount} snoozed
          <button className="attention-strip__snoozed-restore" onClick={onRestore}>
            restore
          </button>
        </span>
      )}
    </div>
  );
};