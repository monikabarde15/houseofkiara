// src/components/Notifications/bands/NotifBand.tsx
import React from 'react';
import { AlertDef, BandKey, NarrowingState } from '../types/notification.types';
import { NotifRow } from '../rows/NotifRow'; // next file — not yet built
import { pluralize } from '../utils/formatting';
import './styles/NotifBand.css';

const BAND_META: Record<BandKey, { label: string; explanation: string; cls: string }> = {
  today: {
    label: 'Needs doing today',
    explanation: 'Dated, breached, or money at risk. Nothing here can be put down.',
    cls: 'ntf-band--today',
  },
  waiting: {
    label: 'Waiting on us',
    explanation: 'Someone is waiting and we have not broken a promise yet.',
    cls: 'ntf-band--waiting',
  },
  them: {
    label: 'Waiting on them',
    explanation:
      'The ball is in their court. Not our failure — but it still needs nudging or closing.',
    cls: 'ntf-band--them',
  },
  know: {
    label: 'Worth knowing',
    explanation: 'No deadline. These can be put down for a week, in the open.',
    cls: 'ntf-band--know',
  },
  blocked: {
    label: 'Cannot be seen yet',
    explanation:
      'Asked for, and not derivable from what the panel holds today. Built anyway — it is how the panel admits a gap rather than showing a reassuring zero.',
    cls: 'ntf-band--know', // blocked band reuses the "know" (canvas) header colours per §7.1
  },
};

interface NotifBandProps {
  bandKey: BandKey;
  alerts: AlertDef[];
  openRowKeys: Set<string>;
  onToggleRow: (alertKey: string) => void;
  narrowing: NarrowingState;
  isNarrowedAway: boolean; // true when a different band is selected in narrowing (§28.1)
  onSelectBand: () => void;
  currentUser: string;
  team: string[];
  onAssign: (recordId: string, to: string | null) => void;
  onPutDown: (alertKey: string) => void;
  canEdit: boolean; // Edit/Full Access — gates put-down button, owner dropdown (§25.3)
}

/**
 * A single band card (§7.2). Handles which rows render per §7.3:
 *  - today/waiting: alerts with no records still render, as an explicit
 *    clear row (kind C) — a dated band reading zero is worth stating.
 *  - them/know: alerts with no records (and, in "know", alerts currently
 *    put down) fold into one summary line at the foot of the band (§9.6)
 *    instead of listing individually — a quiet band full of zero-rows
 *    trains the eye to skip the page.
 *  - blocked: always a blocked row (kind E), never folded, never a zero.
 */
export function NotifBand({
  bandKey,
  alerts,
  openRowKeys,
  onToggleRow,
  narrowing,
  isNarrowedAway,
  onSelectBand,
  currentUser,
  team,
  onAssign,
  onPutDown,
  canEdit,
}: NotifBandProps) {
  if (isNarrowedAway) return null;

  const meta = BAND_META[bandKey];
  const isFoldingBand = bandKey === 'them' || bandKey === 'know';

  // Under a person-narrowing, an alert with none of that person's records is
  // dropped from the page entirely — not shown empty (§28.7). Clear/put-down/
  // folded rows are suppressed under an owner filter, since they describe
  // absence, and absence isn't something a person carries.
 const personFilter = narrowing.person;

const visibleAlerts = personFilter
  ? alerts.filter((a) =>
      a.records.some((r) => matchesPersonFilter(r.ownerId, personFilter))
    )
  : alerts;

  if (narrowing.person && visibleAlerts.length === 0) {
    return null; // whole band drops when every alert in it drops (§28.7)
  }

  const totalCount = countBand(visibleAlerts, narrowing.person);

  const standardAlerts = isFoldingBand && !narrowing.person
    ? visibleAlerts.filter((a) => a.records.length > 0 && !a.putDown)
    : visibleAlerts;

  const foldedAlerts = isFoldingBand && !narrowing.person
    ? visibleAlerts.filter((a) => a.records.length === 0 || a.putDown)
    : [];

  return (
    <div className={`ntf-band ${meta.cls}`}>
      <div
        className={`ntf-band-hd${bandKey !== 'blocked' ? ' ntf-band-hd--go' : ''}`}
        onClick={bandKey !== 'blocked' ? onSelectBand : undefined}
      >
        <span>
          {meta.label}
          {narrowing.band === bandKey && <span className="ntf-only">only this band · clear</span>}
        </span>
        {/* §7.2 — "Cannot be seen yet" shows no count in its header; all others do */}
        {bandKey !== 'blocked' && <span className="ntf-band-n">{totalCount}</span>}
      </div>
      <div className="ntf-band-s">{meta.explanation}</div>

      {standardAlerts.map((alert) => (
        <NotifRow
          key={alert.key}
          alert={alert}
          isOpen={openRowKeys.has(alert.key)}
          onToggle={() => onToggleRow(alert.key)}
          bandKey={bandKey}
          currentUser={currentUser}
          team={team}
          onAssign={onAssign}
          onPutDown={onPutDown}
          canEdit={canEdit}
          personFilter={narrowing.person}
        />
      ))}

      {foldedAlerts.length > 0 && <FoldedSummaryRow alerts={foldedAlerts} />}
    </div>
  );
}

function matchesPersonFilter(ownerId: string | null, filter: string): boolean {
  if (filter === 'nobody') return ownerId === null;
  return ownerId === filter;
}

function countBand(alerts: AlertDef[], personFilter: string | null): number {
  if (!personFilter) {
    // Band header count is the deduplicated "most urgent band" figure,
    // which the caller (buildSummaryCounts) already computed per §6.2.1 —
    // NotifBand receives alerts pre-filtered to their most-urgent band, so a
    // plain sum of unique record ids here is safe and matches the summary bar.
    const ids = new Set<string>();
    alerts.forEach((a) => a.records.forEach((r) => ids.add(r.id)));
    return ids.size;
  }
  const ids = new Set<string>();
  alerts.forEach((a) =>
    a.records
      .filter((r) => matchesPersonFilter(r.ownerId, personFilter))
      .forEach((r) => ids.add(r.id))
  );
  return ids.size;
}

/**
 * §9.6 — the folded summary line. Green "clear" pill showing the NUMBER OF
 * FOLDED CHECKS (not zero), explanation lists the titles joined by " · ",
 * each suffixed "(put down)" where that applies. Not clickable.
 */
function FoldedSummaryRow({ alerts }: { alerts: AlertDef[] }) {
  const n = alerts.length;
  const titleLine = alerts
    .map((a) => (a.putDown ? `${a.title} (put down)` : a.title))
    .join(' · ');

  return (
    <div className="ntf-row ntf-row--clear">
      <div className="ntf-row-hd">
        <div className="ntf-n ntf-n--ok">{n}</div>
        <div className="ntf-row-body">
          <div className="ntf-t ntf-t--muted">
            {n === 1
              ? '1 more check is clear or put down'
              : `${n} more checks are clear or put down`}
          </div>
          <div className="ntf-w ntf-w--muted">{titleLine}</div>
        </div>
      </div>
    </div>
  );
}