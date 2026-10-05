import React, { useCallback, useMemo, useState } from "react";

import { useNotifications } from "./hooks/useNotifications";
import { useAssignment } from "./hooks/useAssignment";
import { useSeen } from "./hooks/useSeen";
import { usePutDown } from "./hooks/usePutDown";
import { useNarrowing } from "./hooks/useNarrowing";

import { NotifLeadCard } from "./summary/NotifLeadCard";
import { NotifSplitBar } from "./summary/NotifSplitBar";
import { NotifBandList } from "./bands/NotifBandList";

import { NotifMessageJoinPanel } from "./msgjoin/NotifMessageJoinPanel";
import { NotifHistoryPanel } from "./history/NotifHistoryPanel";

import { groupAlertsForRender } from "./utils/counting";
import type { AlertDef, BandKey } from "./types/notification.types";

import "./styles/NotificationsShared.css";
import "./NotificationsView.css";

/**
 * Notifications page
 *
 * Order:
 * 1. Section header
 * 2. Summary card
 * 3. Summary split bar
 * 4–8. Five alert bands
 * 9. Message join panel
 * 26.3. Alert history
 * 10. Footer note
 */
export function NotificationsView() {
  const {
    data,
    urgency,
    summary,
    putDownCount,
    loading,
    error,
    repaint,
    isRecordNew,
  } = useNotifications();

  const { assign } = useAssignment(repaint);
  const { markAllSeen, marking } = useSeen(repaint);
  const { putDown, bringBack, bringingBack } = usePutDown(repaint);

  const { narrowing, toggleBand, togglePerson, clearAll, isNarrowed } =
    useNarrowing();

  // Local UI state — which alert rows are expanded.
  const [openRowKeys, setOpenRowKeys] = useState<Set<string>>(new Set());

  const toggleRow = useCallback((alertKey: string) => {
    setOpenRowKeys((previous) => {
      const next = new Set(previous);

      if (next.has(alertKey)) {
        next.delete(alertKey);
      } else {
        next.add(alertKey);
      }

      return next;
    });
  }, []);

  // Temporary role gate.
  // Replace with the real role hook when roles are wired.
  const canEdit = true;

  /**
   * IMPORTANT:
   *
   * The previous version had invalid TypeScript here:
   *
   * as Record
   *   BandKey,
   *   ReturnType<...>
   * >
   *
   * BandKey is a type, not a runtime value.
   *
   * Explicitly typing useMemo fixes the entire group of errors.
   */
  const alertsByBand = useMemo<Record<BandKey, AlertDef[]>>(() => {
    if (!data) {
      return {
        today: [],
        waiting: [],
        them: [],
        know: [],
        blocked: [],
      };
    }

    return groupAlertsForRender(
      data.alerts,
      urgency,
      data.assigned,
      data.putDown,
    );
  }, [data, urgency]);

  /**
   * The Lead Card only needs records that are new since
   * the user's last seen marker.
   */
  const seenForCard = useMemo(() => {
    if (!data) {
      return {
        list: [],
        at: null,
      };
    }

    const newIds = Object.keys(urgency).filter((id) => isRecordNew(id));

    return {
      list: newIds,
      at: data.seen.at,
    };
  }, [data, urgency, isRecordNew]);

  const handleMarkSeen = useCallback(() => {
    markAllSeen(urgency);
  }, [markAllSeen, urgency]);

  if (loading && !data) {
    return (
      <div className="sp" id="sec-notifications">
        <div className="ntf-loading">Loading…</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="sp" id="sec-notifications">
        <div className="ntf-error">Could not load notifications: {error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="sp" id="sec-notifications">
      {/* =========================================================
          BLOCK 1 — SECTION HEADER
         ========================================================= */}
      <div className="mod-hd">
        <div className="mod-ey">Operations</div>

        <h1 className="mod-ttl">Notifications</h1>

        <p className="mod-sub">
          Everything the desk needs to act on, in one place. Each line is read
          from the records themselves rather than stored, so it appears when
          something needs doing and disappears when it is done. This is the only
          place an alert is defined — the lister strip, the promo chips, the
          dashboard and the messages that reach you off-panel are all views of
          this same list, never a second opinion about it.
        </p>
      </div>

      <div id="notif-host">
        {/* =====================================================
            BLOCK 2 — SUMMARY CARD
           ===================================================== */}
        <NotifLeadCard
          summary={summary}
          seen={seenForCard}
          onMarkSeen={handleMarkSeen}
          marking={marking}
        />

        {/* =====================================================
            BLOCK 3 — SUMMARY BAR
           ===================================================== */}
        <NotifSplitBar
          summary={summary}
          team={data.team}
          narrowing={narrowing}
          onToggleBand={toggleBand}
          onTogglePerson={togglePerson}
          onClearAll={clearAll}
          putDownCount={putDownCount}
          onBringBack={bringBack}
          bringingBack={bringingBack}
        />

        {/* =====================================================
            NARROWING BAR
           ===================================================== */}
        {isNarrowed && (
          <NarrowingBar
            narrowing={narrowing}
            summary={summary}
            onClear={clearAll}
          />
        )}

        {/* =====================================================
            BLOCKS 4–8 — FIVE ALERT BANDS
           ===================================================== */}
        <NotifBandList
          alertsByBand={alertsByBand}
          openRowKeys={openRowKeys}
          onToggleRow={toggleRow}
          narrowing={narrowing}
          onSelectBand={toggleBand}
          currentUser={data.currentUser}
          team={data.team}
          onAssign={assign}
          onPutDown={putDown}
          canEdit={canEdit}
        />

        {/* =====================================================
            BLOCK 9 — MESSAGE JOIN PANEL
           ===================================================== */}
        <NotifMessageJoinPanel />

        {/* =====================================================
            §26.3 — ALERT HISTORY
           ===================================================== */}
        <NotifHistoryPanel />
      </div>

      {/* =======================================================
          BLOCK 10 — FOOTER NOTE
         ======================================================= */}
      <div className="card ntf-footer-card">
        <div className="card-bd">
          <div className="prebuilt-note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />

              <line x1="12" y1="8" x2="12" y2="12" />

              <circle cx="12" cy="16" r="0.5" />
            </svg>

            <div>
              <strong>This page is about us, not about them</strong>

              <p>
                These are the alerts for the House of Kaira desk. What a
                customer or a lister is told is set on the message itself in{" "}
                <span className="ntf-inline-link">Messaging</span> — and so is
                what <em>you</em> are told when you are not looking at this
                screen, because seven of those messages are addressed to this
                desk. They are not a second set of rules: each one reads an
                alert defined here, and the join is listed at the foot of this
                page. What counts as late is decided here; how it reads is
                decided there. The counts on the Dashboard, the bell, the lister
                profiles and the promo codes are all read from this list rather
                than counted again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   §28.6 — NARROWING BAR
   =============================================================== */

function NarrowingBar({
  narrowing,
  summary,
  onClear,
}: {
  narrowing: {
    band: string | null;
    person: string | null;
  };

  summary: {
    open: number;
    today: number;
    waiting: number;
    them: number;
    know: number;
  };

  onClear: () => void;
}) {
  const bandLabel: Record<string, string> = {
    today: "Needs doing today",
    waiting: "Waiting on us",
    them: "Waiting on them",
    know: "Worth knowing",
    blocked: "Blocked",
  };

  const parts: string[] = [];

  if (narrowing.band) {
    parts.push(bandLabel[narrowing.band] ?? narrowing.band);
  }

  if (narrowing.person) {
    parts.push(
      narrowing.person === "nobody" ? "nobody has picked up" : narrowing.person,
    );
  }

  return (
    <div className="ntf-filt">
      <div className="ntf-filt-t">
        Showing <b>{parts.join(" · ")}</b>
        {" — "}
        {summary.open} items of {summary.open}
      </div>

      <button type="button" className="ntf-filt-x" onClick={onClear}>
        Show everything
      </button>
    </div>
  );
}
