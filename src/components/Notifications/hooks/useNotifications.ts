// src/components/Notifications/hooks/useNotifications.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  NotificationsResponse,
  SummaryCounts,
  UrgencyMap,
} from "../types/notification.types";
import { fetchNotifications } from "../services/notificationsService";
import { mockNotificationsResponse } from "../data/mockAlerts";
import {
  buildUrgencyMap,
  buildSummaryCounts,
  getPutDownCount,
} from "../utils/counting";

// Flip to false once the real backend endpoint (§19.1) is live.
const USE_MOCK_DATA = true;

export interface UseNotificationsResult {
  data: NotificationsResponse | null;
  urgency: UrgencyMap;
  summary: SummaryCounts;
  putDownCount: number;
  loading: boolean;
  error: string | null;
  /**
   * §3.3 — "There is no partial update anywhere on this screen: any change
   * repaints the whole host." Every hook that writes (assign, seen, put
   * down) calls this when it succeeds, rather than patching local state
   * piecemeal — so the summary counts, the bell, and the sidebar badge can
   * never drift from what's actually on screen.
   */
  repaint: () => Promise<void>;
  /** True when a record id is in the current user's "new since last seen" set (§17.6). */
  isRecordNew: (recordId: string) => boolean;
}

export function useNotifications(): UseNotificationsResult {
  const [data, setData] = useState<NotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = USE_MOCK_DATA
        ? mockNotificationsResponse
        : await fetchNotifications();
      setData(result);
    } catch (err) {
      // §15.1 — a computation failing must never take the page down; the
      // page still has to render something. We surface the error but do
      // not fabricate a partial alert list to hide it.
      setError(
        err instanceof Error ? err.message : "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // §6.2.1 / §17.3 — one pass, everything else reads from it.
  const urgency = useMemo(() => {
    if (!data) return {};
    return buildUrgencyMap(data.alerts, data.putDown);
  }, [data]);

  const summary = useMemo(() => {
    if (!data) {
      return {
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
    }
    return buildSummaryCounts(data.alerts, urgency, data.assigned);
  }, [data, urgency]);

  const putDownCount = useMemo(() => {
    if (!data) return 0;
    return getPutDownCount(data.putDown);
  }, [data]);

  const isRecordNew = useCallback(
    (recordId: string) => {
      if (!data) return false;
      // First visit — nothing is new (§17.6, §15 "Default, first visit").
      if (!data.seen.at) return false;
      return !data.seen.list.includes(recordId);
    },
    [data],
  );

  return {
    data,
    urgency,
    summary,
    putDownCount,
    loading,
    error,
    repaint: load,
    isRecordNew,
  };
}
