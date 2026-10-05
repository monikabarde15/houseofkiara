// src/components/Notifications/services/putDownService.ts

const PUT_DOWN_URL = "/admin/notifications/put-down";

/**
 * §19.2 / §17.7 — put an alert down for seven days. Must only ever be called
 * for an alert flagged `canPutDown` — the four in "Worth knowing". The
 * button itself is never rendered anywhere else (§10.7), and the backend is
 * the final gate against a misuse from elsewhere.
 */
export async function putAlertDown(alertKey: string): Promise<void> {
  const res = await fetch(PUT_DOWN_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: alertKey }),
  });

  if (!res.ok) {
    throw new Error(`Failed to put down alert ${alertKey}: ${res.status}`);
  }
}

/**
 * §6.3 — "bring back" clears every put-down alert at once. There is no
 * per-alert undo in the summary bar, so this is a single DELETE with no key.
 */
export async function bringBackAll(): Promise<void> {
  const res = await fetch(PUT_DOWN_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to bring back put-down alerts: ${res.status}`);
  }
}
