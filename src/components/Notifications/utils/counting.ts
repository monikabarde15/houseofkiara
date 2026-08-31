// src/components/Notifications/utils/counting.ts
import {
  Alert,
  AssignmentMap,
  BandKey,
  PutDownState,
  SummaryCounts,
  URGENCY_ORDER,
  UrgencyMap,
} from '../types/notification.types';

/**
 * Whether an alert is currently put down (§9.4, §17.7).
 * A put-down alert contributes to no figure until its end date passes.
 * `today` is injected so this stays testable rather than reading Date.now() internally.
 */
export function isPutDown(
  alert: Alert,
  putDown: PutDownState,
  today: string = new Date().toISOString().slice(0, 10)
): boolean {
  const endDate = putDown[alert.key];
  if (!endDate) return false;
  return endDate >= today;
}

/**
 * Whether an alert's records are eligible to be counted anywhere at all (§17.2).
 * Excludes: record-surface alerts, not-counted alerts, the blocked alert, and
 * anything currently put down.
 */
export function isAlertCounted(
  alert: Alert,
  putDown: PutDownState,
  today?: string
): boolean {
  if (alert.surface !== 'desk') return false;
  if (alert.notCounted) return false;
  if (alert.blocked) return false;
  if (alert.canPutDown && isPutDown(alert, putDown, today)) return false;
  return true;
}

/**
 * §6.2.1 — one record has one urgency.
 * A record can appear under several alerts, possibly in different bands.
 * It is counted in exactly the MOST URGENT band it reaches, and nowhere else.
 *
 * Build the set of bands each record reaches, across every counted alert,
 * then resolve each record to the single most-urgent band in URGENCY_ORDER.
 * This is the one pass every other figure on the page reads from — the four
 * band figures are slices of this map, so they can never drift apart (§17.3).
 */
export function buildUrgencyMap(
  alerts: Alert[],
  putDown: PutDownState,
  today?: string
): UrgencyMap {
  const bandsReached: Record<string, Set<BandKey>> = {};

  for (const alert of alerts) {
    if (!isAlertCounted(alert, putDown, today)) continue;
    for (const record of alert.records) {
      if (!bandsReached[record.id]) bandsReached[record.id] = new Set();
      bandsReached[record.id].add(alert.band);
    }
  }

  const urgency: UrgencyMap = {};
  for (const [recordId, bands] of Object.entries(bandsReached)) {
    const mostUrgent = URGENCY_ORDER.find((band) => bands.has(band));
    if (mostUrgent) urgency[recordId] = mostUrgent;
  }
  return urgency;
}

/**
 * §5.4 — money at risk in the dated band: deposits uncollected, deposits past
 * T+3, and payouts already due. Summed from whichever "today"-band records
 * carry a non-null `money` value — the backend only sets `money` on the
 * alerts that clause names, so no alert-key allowlist is needed here.
 */
export function calcMoneyAtRisk(alerts: Alert[], urgency: UrgencyMap): number {
  let total = 0;
  for (const alert of alerts) {
    for (const record of alert.records) {
      if (urgency[record.id] === 'today' && typeof record.money === 'number') {
        total += record.money;
      }
    }
  }
  return total;
}

/**
 * §6.2 / §6.5 — the full reconciled summary. Both reconciliations below must
 * hold at all times:
 *   today + waiting + them + know === open
 *   sum(byPerson) + nobodyYet === open
 */
export function buildSummaryCounts(
  alerts: Alert[],
  urgency: UrgencyMap,
  assigned: AssignmentMap
): SummaryCounts {
  const counts: SummaryCounts = {
    today: 0,
    waiting: 0,
    them: 0,
    know: 0,
    open: 0,
    byPerson: {},
    nobodyYet: 0,
    putDownCount: 0,
    moneyAtRisk: 0,
  };

  for (const band of Object.values(urgency)) {
    if (band === 'today') counts.today += 1;
    else if (band === 'waiting') counts.waiting += 1;
    else if (band === 'them') counts.them += 1;
    else if (band === 'know') counts.know += 1;
  }
  counts.open = counts.today + counts.waiting + counts.them + counts.know;

  // Assignment is keyed to the record id alone (§17.5). An assignment on a
  // record no longer live in `urgency` counts for nobody automatically.
  for (const recordId of Object.keys(urgency)) {
    const owner = assigned[recordId]?.by;
    if (owner) {
      counts.byPerson[owner] = (counts.byPerson[owner] ?? 0) + 1;
    } else {
      counts.nobodyYet += 1;
    }
  }

  counts.moneyAtRisk = calcMoneyAtRisk(alerts, urgency);

  return counts;
}

/**
 * §17.7 / §6.3 — how many alerts are currently put down, for the
 * "{n} put down · bring back" link.
 */
export function getPutDownCount(putDown: PutDownState, today?: string): number {
  const cutoff = today ?? new Date().toISOString().slice(0, 10);
  return Object.values(putDown).filter((endDate) => endDate >= cutoff).length;
}

/**
 * §9.6 — the folded summary line at the foot of "Waiting on them" and
 * "Worth knowing": every alert in that band with zero records, plus every
 * alert currently put down, collapses into one line.
 */
export interface FoldedAlert {
  title: string;
  putDown: boolean;
}

export function getFoldedAlerts(
  alerts: Alert[],
  band: BandKey,
  putDown: PutDownState,
  today?: string
): FoldedAlert[] {
  return alerts
    .filter((a) => a.band === band && a.surface === 'desk' && !a.blocked)
    .filter((a) => {
      const down = a.canPutDown && isPutDown(a, putDown, today);
      return a.records.length === 0 || down;
    })
    .map((a) => ({
      title: a.title,
      putDown: a.canPutDown && isPutDown(a, putDown, today),
    }));
}

/**
 * §28.7 — narrowing to a person filters each alert's records down to that
 * person's, and drops an alert entirely if none of its records belong to
 * them. The row pill then shows the number SHOWN, not the alert's full count.
 */
export function filterRecordsByOwner(
  records: Alert['records'],
  person: string | 'nobody',
  assigned: AssignmentMap
): Alert['records'] {
  return records.filter((r) => {
    const owner = assigned[r.id]?.by;
    return person === 'nobody' ? !owner : owner === person;
  });
}
import { AlertDef } from '../types/notification.types';

/**
 * Bridges raw Alert[] (from the API/mock) into the AlertDef[] shape
 * NotifBand/NotifRow render from: per-record ownerId resolved, records
 * filtered to the band each one actually won (§6.2.1 dedup), and putDown
 * resolved to a plain boolean so components don't need the raw date map.
 * Zero-record alerts pass through untouched — they have nothing to dedupe.
 */
export function groupAlertsForRender(
  alerts: Alert[],
  urgency: UrgencyMap,
  assigned: AssignmentMap,
  putDown: PutDownState,
  today?: string
): Record<BandKey, AlertDef[]> {
  const result: Record<BandKey, AlertDef[]> = {
    today: [], waiting: [], them: [], know: [], blocked: [],
  };

  for (const alert of alerts) {
    if (alert.surface !== 'desk') continue; // §17.2 — record-surface alerts never render here

    const records = alert.records
      .filter((r) => alert.blocked || alert.records.length === 1 || urgency[r.id] === alert.band || alert.records.length === 0)
      .map((r) => ({ ...r, ownerId: assigned[r.id]?.by ?? null }));

    result[alert.band].push({
      ...alert,
      records,
      putDown: alert.canPutDown && isPutDown(alert, putDown, today),
    });
  }

  return result;
}