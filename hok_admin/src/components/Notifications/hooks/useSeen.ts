// src/components/Notifications/hooks/useSeen.ts
import { useCallback, useState } from "react";
import { markSeen } from "../services/seenService";
import { UrgencyMap } from "../types/notification.types";

/**
 * §17.6 / §10 interaction #3 — "Mark what I have seen". Stores exactly the
 * deduplicated record ids on screen at the moment of the click (the keys of
 * the current urgency map), per user. Marking seen changes nothing else —
 * no count moves, no colour changes, only the "new" tags and the right-hand
 * column of the summary card.
 */
export function useSeen(repaint: () => Promise<void>) {
  const [marking, setMarking] = useState(false);

  const markAllSeen = useCallback(
    async (urgency: UrgencyMap) => {
      setMarking(true);
      try {
        await markSeen(Object.keys(urgency));
        await repaint();
      } finally {
        setMarking(false);
      }
    },
    [repaint],
  );

  return { markAllSeen, marking };
}
