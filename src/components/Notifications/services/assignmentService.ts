// src/components/Notifications/services/assignmentService.ts

const ASSIGN_URL = '/admin/notifications/assign';

/**
 * §19.2 — assign or clear a record's owner. Keyed on recordId ALONE, never
 * on the alert key (§17.5) — if the same record later appears under a
 * different alert, it is still theirs.
 *
 * Passing `to: null` clears the assignment (§10.6 "Nobody yet").
 */
export async function setAssignment(recordId: string, to: string | null): Promise<void> {
  const res = await fetch(ASSIGN_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recordId, to }),
  });

  if (!res.ok) {
    throw new Error(`Failed to set assignment for ${recordId}: ${res.status}`);
  }
}