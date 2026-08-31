// src/components/Notifications/rows/NotifRow.tsx
import React from 'react';
import { AlertDef, AlertRecord, BandKey } from '../types/notification.types';
import { Button } from '../../Messaging/components/Button';
import './styles/NotifRow.css';

interface NotifRowProps {
  alert: AlertDef;
  isOpen: boolean;
  onToggle: () => void;
  bandKey: BandKey;
  currentUser: string;
  team: string[];
  onAssign: (recordId: string, to: string | null) => void;
  onPutDown: (alertKey: string) => void;
  canEdit: boolean; // Edit/Full Access — View Only hides put-down, disables owner select (§25.3)
  personFilter: string | null; // §28.7 — narrows the record list shown, not the pill count logic
}

/**
 * The alert row (§8–10). Renders one of five kinds:
 *   A — standard row with records, opens on click
 *   B — routed row ("route" class, "worked in {place}" pill) — still opens
 *   C — clear row (zero records, dated bands only) — muted, no chevron
 *   D — put-down row — folded into the band's summary line, not rendered
 *       standalone here (NotifBand handles that via FoldedSummaryRow)
 *   E — blocked row — no records, no chevron, may carry message-join line
 */
export function NotifRow({
  alert,
  isOpen,
  onToggle,
  bandKey,
  currentUser,
  team,
  onAssign,
  onPutDown,
  canEdit,
  personFilter,
}: NotifRowProps) {
  const isBlocked = bandKey === 'blocked';
  const isClear = !isBlocked && alert.records.length === 0;
  const isRouted = !!alert.elsewhere;
  const isOpenable = !isBlocked && !isClear;

  // §28.7 — under a person filter, the row's own pill shows the count of
  // records SHOWN (that person's), not the alert's full record count.
  const visibleRecords = personFilter
    ? alert.records.filter((r) =>
        personFilter === 'nobody' ? r.ownerId === null : r.ownerId === personFilter
      )
    : alert.records;

  const pillValue = isBlocked ? '—' : isClear ? '0' : String(visibleRecords.length);
  const pillClass = isBlocked
    ? 'ntf-n ntf-n--dim'
    : isClear
      ? 'ntf-n ntf-n--ok'
      : 'ntf-n';

  const newCount = alert.records.filter((r) => r.isNew).length;
  const pickedCount = alert.records.filter((r) => r.ownerId !== null).length;

  const rowClasses = [
    'ntf-row',
    isRouted ? 'ntf-row--route' : '',
    isClear ? 'ntf-row--clear' : '',
    isBlocked ? 'ntf-row--blocked' : '',
    isOpen && isOpenable ? 'ntf-row--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rowClasses}>
      <div
        className="ntf-row-hd"
        onClick={isOpenable ? onToggle : undefined}
        style={{ cursor: isOpenable ? 'pointer' : 'default' }}
      >
        <div className={pillClass}>{pillValue}</div>

        <div className="ntf-row-body">
          <div className="ntf-t">
            {alert.title}
            {isRouted && <span className="ntf-el">worked in {alert.elsewhere}</span>}
            {alert.notCounted && <span className="ntf-el">not counted</span>}
          </div>

          <div className="ntf-w">
            {isClear && 'Nothing here. '}
            {alert.what}
          </div>

          {/* §8.6 — preview line, only when there's at least one record and
              the row isn't a clear/blocked row */}
          {isOpenable && visibleRecords.length > 0 && (
            <PreviewLine records={visibleRecords} />
          )}

          {/* §8.7 — tags: new first, then picked up */}
          {isOpenable && (newCount > 0 || pickedCount > 0) && (
            <div className="ntf-tags">
              {newCount > 0 && (
                <span className="ntf-newtag">{newCount} new</span>
              )}
              {pickedCount > 0 && (
                <span className="ntf-pickedtag">{pickedCount} picked up</span>
              )}
            </div>
          )}

          {/* §8.9 — message-join line */}
          {alert.message && <MessageJoinLine messageName={alert.message} />}
        </div>

        {isOpenable && <Chevron open={isOpen} />}
      </div>

      {isOpenable && isOpen && (
        <div className="ntf-body">
          <div className="ntf-recs">
            {visibleRecords.map((record) => (
              <RecordRow
                key={record.id}
                record={record}
                team={team}
                onAssign={onAssign}
                canEdit={canEdit}
              />
            ))}
          </div>

          <ActionBar
            alert={alert}
            canEdit={canEdit}
            bandKey={bandKey}
            onPutDown={() => onPutDown(alert.key)}
          />
        </div>
      )}
    </div>
  );
}

/**
 * §8.6 — "{first label} · {first sub}[, and {n-1} more]". Tail omitted with
 * exactly one record; "and 1 more" with two.
 */
function PreviewLine({ records }: { records: AlertRecord[] }) {
  const first = records[0];
  const rest = records.length - 1;
  return (
    <div className="ntf-worst">
      {first.label} · {first.sub}
      {rest > 0 && `, and ${rest} more`}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className="ntf-chev"
      style={{ transform: open ? 'rotate(90deg)' : undefined }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/**
 * §8.9 — "also reaches you as "{name}" on {channels}" / "…nowhere yet" when
 * no channel is on. Click must not open/close the row — stopPropagation.
 */
function MessageJoinLine({
  messageName,
  channels,
}: {
  messageName: string;
  channels?: string[];
}) {
  const hasChannels = channels && channels.length > 0;
  return (
    <div className="ntf-tags">
      <span
        className="msg-src"
        onClick={(e) => {
          e.stopPropagation();
          // navigate to Messaging wording editor for messageName — wired by parent later
        }}
      >
        also reaches you as &ldquo;{messageName}&rdquo;
        {hasChannels ? ` on ${joinWithAnd(channels!)}` : ', nowhere yet'}
      </span>
    </div>
  );
}

function joinWithAnd(items: string[]): string {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * §10.3–10.6 — a single record row inside the expanded body. Two children,
 * split with align-items:stretch: left half opens the record, right half is
 * the owner select. Each stops the other's click (§8: dropdown click must
 * not open the record).
 */
function RecordRow({
  record,
  team,
  onAssign,
  canEdit,
}: {
  record: AlertRecord;
  team: string[];
  onAssign: (recordId: string, to: string | null) => void;
  canEdit: boolean;
}) {
  const picked = record.ownerId !== null;

  return (
    <div className={`ntf-rec${picked ? ' ntf-rec--picked' : ''}`}>
      <div
        className="ntf-rec-main"
        onClick={() => {
          // navigate to record.target — wired by parent later
        }}
      >
        <div className="ntf-rec-l">
          {record.label}
          {record.isNew && <span className="ntf-newtag">new</span>}
        </div>
        <div className="ntf-rec-s">
          {record.sub}
          {record.blocks && <span className="ntf-blocks">→ {record.blocks}</span>}
        </div>
        <svg
          className="ntf-rec-go"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <select
        className={`ntf-pick${picked ? ' ntf-pick--on' : ''}`}
        value={record.ownerId ?? ''}
        disabled={!canEdit}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          onAssign(record.id, e.target.value || null);
        }}
      >
        <option value="">Nobody yet</option>
        {team.map((person) => (
          <option key={person} value={person}>
            {person}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * §10.7 — primary action button, put-down button (Worth-knowing + flagged
 * alerts only, and only for Edit/Full Access per §25.3), and the fixed hint
 * text (which itself changes copy under View Only).
 */
function ActionBar({
  alert,
  canEdit,
  bandKey,
  onPutDown,
}: {
  alert: AlertDef;
  canEdit: boolean;
  bandKey: BandKey;
  onPutDown: () => void;
}) {
  const showPutDown = canEdit && bandKey === 'know' && alert.canPutDown;

  return (
    <div className="ntf-act">
      {alert.act && (
        <Button variant="secondary" size="small" onClick={() => {/* navigate via alert.actTarget */}}>
          {alert.act}
        </Button>
      )}
      {showPutDown && (
        <Button variant="secondary" size="small" onClick={onPutDown}>
          Put down for 7 days
        </Button>
      )}
      <div className="fhint">
        {canEdit
          ? 'Each line opens the record it is about. Picking someone is logged to that record.'
          : `Read only. Every line still opens the record it is about.`}
      </div>
    </div>
  );
}