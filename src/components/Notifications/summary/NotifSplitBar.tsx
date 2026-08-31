// src/components/Notifications/summary/NotifSplitBar.tsx
import React from 'react';
import { BandKey, NarrowingState, SummaryCounts } from '../types/notification.types';
import { Chip } from '../components/Chip';
import './styles/NotifSplitBar.css';

interface NotifSplitBarProps {
  summary: SummaryCounts;
  team: string[];
  narrowing: NarrowingState;
  onToggleBand: (band: BandKey) => void;
  onTogglePerson: (person: string) => void;
  onClearAll: () => void;
  putDownCount: number;
  onBringBack: () => void;
  bringingBack: boolean;
}

/**
 * Block 3 (§6) — the arithmetic on the left and who is carrying what on the
 * right. The equals sign is a promise (§6.2): the four band figures must
 * sum to the total, and separately, the person chips + "nobody yet" must
 * also sum to that same total. Both come straight off `summary`, which
 * `buildSummaryCounts` already guarantees can't drift (§6.5).
 */
export function NotifSplitBar({
  summary,
  team,
  narrowing,
  onToggleBand,
  onTogglePerson,
  onClearAll,
  putDownCount,
  onBringBack,
  bringingBack,
}: NotifSplitBarProps) {
  return (
    <div className="ntf-split">
      <div className="ntf-split-l">
        <Figure
          value={summary.today}
          tone="hot"
          label="dated or at risk"
          active={narrowing.band === 'today'}
          onClick={() => onToggleBand('today')}
        />
        <span className="ntf-split-sep">+</span>
        <Figure
          value={summary.waiting}
          tone="warm"
          label="waiting on us"
          active={narrowing.band === 'waiting'}
          onClick={() => onToggleBand('waiting')}
        />
        <span className="ntf-split-sep">+</span>
        <Figure
          value={summary.know}
          tone="plain"
          label="worth knowing"
          active={narrowing.band === 'know'}
          onClick={() => onToggleBand('know')}
        />
        <span className="ntf-split-sep">+</span>
        <Figure
          value={summary.them}
          tone="cool"
          label="with them"
          active={narrowing.band === 'them'}
          onClick={() => onToggleBand('them')}
        />
        <span className="ntf-split-sep">=</span>
        <Figure
          value={summary.open}
          tone="plain"
          label="open, each counted once"
          active={false}
          onClick={onClearAll}
          title="Show everything"
        />

        {putDownCount > 0 && (
          <button type="button" className="ntf-snz" onClick={onBringBack} disabled={bringingBack}>
            {putDownCount} put down · bring back
          </button>
        )}
      </div>

      <div className="ntf-split-r">
        {team.map((person) => (
          <Chip
            kind="person"
            key={person}
            label={person}
            count={summary.byPerson[person] ?? 0}
            carrying={(summary.byPerson[person] ?? 0) > 0}
            selected={narrowing.person === person}
            onClick={() => onTogglePerson(person)}
          />
        ))}
        <Chip
          kind="person"
          label="nobody yet"
          count={summary.nobodyYet}
          carrying={false}
          isNobody
          selected={narrowing.person === 'nobody'}
          onClick={() => onTogglePerson('nobody')}
        />
      </div>
    </div>
  );
}

interface FigureProps {
  value: number;
  tone: 'hot' | 'warm' | 'cool' | 'plain';
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
}

/**
 * §28.3 — the clickable figure control. At rest it's invisible; hover fills
 * white; active gets a 1px gold inset ring.
 */
function Figure({ value, tone, label, active, onClick, title }: FigureProps) {
  const numberClass =
    tone === 'hot' ? 'ntf-split-n ntf-split-n--hot'
    : tone === 'warm' ? 'ntf-split-n ntf-split-n--warm'
    : tone === 'cool' ? 'ntf-split-n ntf-split-n--cool'
    : 'ntf-split-n';

  return (
    <button
      type="button"
      className={`ntf-fig${active ? ' ntf-fig--on' : ''}`}
      onClick={onClick}
      title={title ?? `Show only ${label}`}
    >
      <span className={numberClass}>{value}</span> {label}
    </button>
  );
}