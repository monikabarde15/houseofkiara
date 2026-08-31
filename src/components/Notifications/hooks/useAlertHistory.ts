// src/components/Notifications/hooks/useAlertHistory.ts
import { useMemo } from 'react';
import { Alert } from '../types/notification.types';

interface HistoryLedgerEntry {
  key: string; // alert key
  rid: string; // record id
  openedOn: string;
  closedOn: string | null;
  by: string | null;
}

export interface HistoryRow {
  alertKey: string;
  title: string;
  opened: number;
  cleared: number;
  stillOpen: number;
  averageDays: number | null; // null => nothing has closed yet, renders as an em dash
}

/**
 * §26 — the alert history sweep. This is a CLIENT-SIDE read model over a
 * ledger the SERVER maintains (§26.2 says the sweep "runs on every paint,
 * before anything is drawn" — that's a backend guarantee we consume, not
 * something this hook recomputes). This hook only aggregates the ledger
 * rows the backend already swept into the last-30-days window (§26.3) into
 * per-alert totals for the history panel.
 *
 * Swap `ledger` for a real fetched ledger once the backend endpoint for
 * Section 26's data exists — record-surface and blocked alerts are excluded
 * server-side already (§26.2), so nothing here needs to re-filter for that.
 */
export function useAlertHistory(alerts: Alert[], ledger: HistoryLedgerEntry[]) {
  const rows = useMemo<HistoryRow[]>(() => {
    const byKey: Record<string, HistoryLedgerEntry[]> = {};
    for (const entry of ledger) {
      if (!byKey[entry.key]) byKey[entry.key] = [];
      byKey[entry.key].push(entry);
    }

    const titleByKey: Record<string, string> = {};
    for (const alert of alerts) titleByKey[alert.key] = alert.title;

    const result: HistoryRow[] = Object.entries(byKey).map(([key, entries]) => {
      const opened = entries.length;
      const closedEntries = entries.filter((e) => e.closedOn !== null);
      const cleared = closedEntries.length;
      const stillOpen = opened - cleared;

      let averageDays: number | null = null;
      if (cleared > 0) {
        const totalDays = closedEntries.reduce((sum, e) => {
          const opened = new Date(e.openedOn).getTime();
          const closed = new Date(e.closedOn as string).getTime();
          const days = Math.round((closed - opened) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
        averageDays = Math.round(totalDays / cleared);
      }

      return {
        alertKey: key,
        title: titleByKey[key] ?? key,
        opened,
        cleared,
        stillOpen,
        averageDays,
      };
    });

    // §26.3 — sorted by number opened, most first, capped at eight.
    return result.sort((a, b) => b.opened - a.opened).slice(0, 8);
  }, [alerts, ledger]);

  const totalClearedInWindow = useMemo(
    () => rows.reduce((sum, r) => sum + r.cleared, 0),
    [rows]
  );

  const averageAcrossAll = useMemo(() => {
    const withAverages = rows.filter((r) => r.averageDays !== null);
    if (withAverages.length === 0) return null;
    const total = withAverages.reduce((sum, r) => sum + (r.averageDays as number), 0);
    return Math.round(total / withAverages.length);
  }, [rows]);

  return { rows, totalClearedInWindow, averageAcrossAll };
}