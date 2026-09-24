// src/components/Notifications/components/NotificationsHeader.tsx
import React from 'react';
import './styles/NotificationsHeader.css';

/**
 * Block 1 (§4) — static section header. Eyebrow says "Operations" even
 * though this tab sits under the "Overview" sidebar group — that split is
 * deliberate (§4 copy note) and must not be "fixed" to match the sidebar.
 */
export function NotificationsHeader() {
  return (
    <div className="mod-hd">
      <div className="mod-ey">Operations</div>
      <h1 className="mod-ttl">Notifications</h1>
      <p className="mod-sub">
        Everything the desk needs to act on, in one place. Each line is read from the records
        themselves rather than stored, so it appears when something needs doing and disappears
        when it is done. This is the only place an alert is defined — the lister strip, the promo
        chips, the dashboard and the messages that reach you off-panel are all views of this same
        list, never a second opinion about it.
      </p>
    </div>
  );
}