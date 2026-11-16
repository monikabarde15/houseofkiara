import React from "react";
import "./styles/NotifHistoryPanel.css";

export interface NotifHistoryItem {
  key: string;
  alert: string;
  opened: number;
  cleared: number;
  stillOpen: number;
  average: string | number;
}

interface NotifHistoryPanelProps {
  items?: NotifHistoryItem[];
}

/**
 * Temporary visual seed.
 *
 * Once the exact return shape of useAlertHistory.ts is wired,
 * pass its computed rows through the `items` prop.
 */
const DEFAULT_HISTORY: NotifHistoryItem[] = [
  {
    key: "returnsOverdue",
    alert: "Returns overdue",
    opened: 8,
    cleared: 5,
    stillOpen: 3,
    average: "2d",
  },
  {
    key: "bookingConflict",
    alert: "One piece booked twice too close together",
    opened: 6,
    cleared: 4,
    stillOpen: 2,
    average: "1d",
  },
  {
    key: "depositsBeforeShip",
    alert: "Deposits to collect before the piece ships",
    opened: 5,
    cleared: 5,
    stillOpen: 0,
    average: "same day",
  },
  {
    key: "offersWaiting",
    alert: "Offers and enquiries waiting on us",
    opened: 4,
    cleared: 3,
    stillOpen: 1,
    average: "2d",
  },
  {
    key: "messagesFailed",
    alert: "Messages that did not reach her",
    opened: 3,
    cleared: 2,
    stillOpen: 1,
    average: "1d",
  },
  {
    key: "submissionsPast48h",
    alert: "Submissions past the 48-hour promise",
    opened: 2,
    cleared: 2,
    stillOpen: 0,
    average: "same day",
  },
  {
    key: "payoutsWaiting",
    alert: "Payouts waiting for approval",
    opened: 2,
    cleared: 1,
    stillOpen: 1,
    average: "3d",
  },
  {
    key: "paymentFailed",
    alert: "Payments the gateway could not take",
    opened: 1,
    cleared: 1,
    stillOpen: 0,
    average: "same day",
  },
];

export function NotifHistoryPanel({
  items = DEFAULT_HISTORY,
}: NotifHistoryPanelProps) {
  const rows = [...items].sort((a, b) => b.opened - a.opened).slice(0, 8);

  const totalCleared = rows.reduce((sum, row) => sum + row.cleared, 0);

  const rowsWithAverage = rows.filter(
    (row) =>
      row.cleared > 0 &&
      typeof row.average === "string" &&
      /^\d+d$/.test(row.average),
  );

  const averageDays =
    rowsWithAverage.length > 0
      ? Math.round(
          rowsWithAverage.reduce(
            (sum, row) => sum + Number(String(row.average).replace("d", "")),
            0,
          ) / rowsWithAverage.length,
        )
      : 0;

  return (
    <section className="ntf-history" aria-label="Alert history">
      <div className="ntf-history-hd">The last thirty days</div>

      <div className="ntf-history-intro">
        Kept because an alert disappearing is not the same as it never having
        happened.{" "}
        <span>
          {totalCleared} things were cleared in this window
          {averageDays > 0 ? `, taking ${averageDays} days on average.` : "."}
        </span>
      </div>

      <div className="ntf-history-grid ntf-history-grid--head">
        <div>Alert</div>
        <div>Opened</div>
        <div>Cleared</div>
        <div>Still open</div>
        <div>Average</div>
      </div>

      {rows.map((row) => (
        <div className="ntf-history-grid ntf-history-row" key={row.key}>
          <div className="ntf-history-alert">{row.alert}</div>

          <div>{row.opened}</div>

          <div>{row.cleared}</div>

          <div className={row.stillOpen > 0 ? "ntf-history-still" : ""}>
            {row.stillOpen}
          </div>

          <div>
            {row.cleared === 0
              ? "—"
              : row.average === 0
                ? "same day"
                : row.average}
          </div>
        </div>
      ))}
    </section>
  );
}
