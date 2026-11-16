// src/components/Notifications/hooks/useAssignment.ts
import { useCallback, useState } from "react";
import { setAssignment } from "../services/assignmentService";

/**
 * §10.6 / §17.5 — assign or clear a record's owner. Keyed to the record id
 * alone, never the alert key. On success it calls `repaint`, which the
 * caller wires to useNotifications().repaint — per §3.3 the whole host
 * repaints, never a local patch, so the summary bar, bell and sidebar
 * badge can't drift from what's on screen.
 */
export function useAssignment(repaint: () => Promise<void>) {
  const [pendingRecordId, setPendingRecordId] = useState<string | null>(null);

  const assign = useCallback(
    async (recordId: string, to: string | null) => {
      setPendingRecordId(recordId);
      try {
        await setAssignment(recordId, to);
        await repaint();
      } finally {
        setPendingRecordId(null);
      }
    },
    [repaint],
  );

  return {
    assign,
    // lets a row show a disabled/spinner state on its own <select> only,
    // without needing a global loading flag for the whole page
    isPending: (recordId: string) => pendingRecordId === recordId,
  };
}
