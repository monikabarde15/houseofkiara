// src/components/Notifications/summary/NotifLeadCard.tsx
import React from 'react';
import { SeenState, SummaryCounts } from '../types/notification.types';
import { formatINR, formatThingsHeadline, pluralize } from '../utils/formatting';
import { Button } from '../../Messaging/components/Button'; // shared primitive — confirm path
import './styles/NotifLeadCard.css';

interface NotifLeadCardProps {
  summary: SummaryCounts;
  seen: SeenState;
  onMarkSeen: () => void;
  marking: boolean;
}

/**
 * Block 2 (§5) — the big number, headline + prose, money-at-risk strip, and
 * the "what's changed since you looked" right column.
 */
export function NotifLeadCard({ summary, seen, onMarkSeen, marking }: NotifLeadCardProps) {
  const isHot = summary.today >= 1;

  return (
    <div className="ntf-lead">
      {/* §5.2 — the big number */}
      <div className={`ntf-lead-n${isHot ? ' ntf-lead-n--hot' : ''}`}>{summary.today}</div>

      {/* §5.3 / §5.4 — headline, prose, money strip */}
      <div className="ntf-lead-mid">
        <div className="ntf-lead-t">{formatThingsHeadline(summary.today)}</div>
        <div className="ntf-lead-s">
          {summary.today >= 1
            ? 'Read from the records themselves, so an item disappears when the thing it is about is dealt with. Nothing dated can be put down.'
            : 'Nothing overdue, nothing past a promise, nothing waiting to go out. The lists below are still worth a look.'}
        </div>
        {summary.moneyAtRisk > 0 && (
          <div className="ntf-money">
            {formatINR(summary.moneyAtRisk)} at risk in the dated band — deposits uncollected,
            deposits past T+3, and payouts already due.
          </div>
        )}
      </div>

      {/* §5.5 — the right-hand "since you looked" column */}
      <div className="ntf-lead-r">
        <SeenColumn seen={seen} />
        <Button variant="secondary" size="small" onClick={onMarkSeen} disabled={marking}>
          Mark what I have seen
        </Button>
      </div>
    </div>
  );
}

function SeenColumn({ seen }: { seen: SeenState }) {
  // First visit — this user has never pressed the button in this session (§5.5 "First visit")
  if (!seen.at) {
    return <div className="ntf-seen">Everything here is new to you</div>;
  }

  // Something new since last mark
  if (seen.list.length === 0) {
    // no baseline recorded — treated as "nothing new" rather than guessing
    return <div className="ntf-seen">Nothing new since you last looked</div>;
  }

  const newCount = seen.list.length; // caller passes only the ids that are actually new
  if (newCount > 0) {
    return (
      <>
        <div className="ntf-new-n">{pluralize(newCount, 'new item')}</div>
        <div className="ntf-seen">
          since {seen.at ? `you last looked, ${seen.at}` : 'you last looked'}
        </div>
      </>
    );
  }

  return <div className="ntf-seen">Nothing new since you last looked</div>;
}