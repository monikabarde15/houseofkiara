// src/components/Notifications/services/seenService.ts

const SEEN_URL = "/admin/notifications/seen";

/**
 * §19.2 — "Mark what I have seen". Stores the current deduplicated record id
 * list plus today's date, against the REQUESTING USER only (§17.6) — this is
 * per-person handover state, never global. The record ids to store are
 * passed in rather than recomputed here, so the caller can pass exactly the
 * urgency-map keys that were on screen at click time.
 */
export async function markSeen(recordIds: string[]): Promise<void> {
  const res = await fetch(SEEN_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recordIds }),
  });

  if (!res.ok) {
    throw new Error(`Failed to mark seen: ${res.status}`);
  }
}
