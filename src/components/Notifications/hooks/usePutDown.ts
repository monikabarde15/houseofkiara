// src/components/Notifications/hooks/usePutDown.ts
import { useCallback, useState } from "react";
import { putAlertDown, bringBackAll } from "../services/putDownService";

/**
 * §17.7 / §10.7 — "Put down for 7 days", limited to the four alerts flagged
 * canPutDown in "Worth knowing", and "{n} put down · bring back" in the
 * summary bar, which brings every put-down alert back at once (§6.3 — there
 * is no per-alert undo in that bar).
 */
export function usePutDown(repaint: () => Promise<void>) {
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [bringingBack, setBringingBack] = useState(false);

  const putDown = useCallback(
    async (alertKey: string) => {
      setPendingKey(alertKey);
      try {
        await putAlertDown(alertKey);
        await repaint();
      } finally {
        setPendingKey(null);
      }
    },
    [repaint],
  );

  const bringBack = useCallback(async () => {
    setBringingBack(true);
    try {
      await bringBackAll();
      await repaint();
    } finally {
      setBringingBack(false);
    }
  }, [repaint]);

  return {
    putDown,
    bringBack,
    isPending: (alertKey: string) => pendingKey === alertKey,
    bringingBack,
  };
}
