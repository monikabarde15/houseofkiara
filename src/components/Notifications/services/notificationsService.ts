// src/components/Notifications/services/notificationsService.ts
import { NotificationsResponse } from "../types/notification.types";

const BASE_URL = "/admin/notifications";

/**
 * §19.1 — the single endpoint that returns the whole computed list.
 * The front end never computes alerts itself; it renders what this returns.
 */
export async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status}`);
  }

  return res.json();
}
