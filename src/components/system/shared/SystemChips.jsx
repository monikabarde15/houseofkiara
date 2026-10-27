/**
 * House of Kaira: System Chips Component (C5)
 * Section 4 C5 of System Pages Specification v1.0
 */

import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-chips.css";

export default function SystemChips({
  label,
  chips = [],
  onSelectChip = null
}) {
  if (!chips || chips.length === 0) return null;

  return (
    <section className="sys-chips-section" aria-label={label}>
      {label && <span className="sys-chips-label">{label}</span>}

      <div className="sys-chips-grid">
        {chips.map((item, index) => {
          const text = typeof item === "string" ? item : item.word || item.label;
          const count = typeof item === "object" && item.count !== undefined ? item.count : null;
          const countLabel = count === 1 ? "1 piece" : count !== null ? `${count} pieces` : null;

          const content = (
            <>
              <span>{text}</span>
              {countLabel && <span className="sys-chip-count">{countLabel}</span>}
            </>
          );

          if (onSelectChip) {
            return (
              <button
                type="button"
                key={text + index}
                onClick={() => onSelectChip(text)}
                className="sys-chip-btn"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={text + index}
              to={`/search?q=${encodeURIComponent(text)}`}
              className="sys-chip-btn"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
