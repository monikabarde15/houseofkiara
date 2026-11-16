// src/components/Notifications/components/Table.tsx
import React from "react";
import "./styles/Table.css";

interface TableProps {
  /** column widths, left to right, e.g. ['1fr', '68px', '68px', '78px', '78px'] (§26.3) */
  columns: string[];
  headers: string[];
  children: React.ReactNode;
}

/**
 * A generic grid-based table shell. Built for the alert history panel
 * (§26.3's five-column grid), but kept generic on column widths so any
 * future fixed-width grid table in this module can reuse it rather than
 * hand-rolling display:grid again.
 */
export function Table({ columns, headers, children }: TableProps) {
  const gridTemplateColumns = columns.join(" ");
  return (
    <div className="ntf-table">
      <div className="ntf-table-hd" style={{ gridTemplateColumns }}>
        {headers.map((h, i) => (
          <div
            key={h}
            className={i > 0 ? "ntf-table-hd-cell--right" : undefined}
          >
            {h}
          </div>
        ))}
      </div>
      <div
        className="ntf-table-body"
        style={{ ["--ntf-table-cols" as string]: gridTemplateColumns }}
      >
        {children}
      </div>
    </div>
  );
}

interface TableRowProps {
  columns: string[];
  children: React.ReactNode;
}

export function TableRow({ columns, children }: TableRowProps) {
  const gridTemplateColumns = columns.join(" ");
  return (
    <div className="ntf-table-row" style={{ gridTemplateColumns }}>
      {children}
    </div>
  );
}
