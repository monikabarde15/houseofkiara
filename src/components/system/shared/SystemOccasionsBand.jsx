/**
 * House of Kaira: System Occasions Index Band (S7 / C9)
 * Section 4 C9 & Appendix B of System Pages Specification v1.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { OCCASIONS_ORDER } from "../../../data/system/systemVocabulary";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-occasions.css";

export default function SystemOccasionsBand({
  eyebrow = "Another way in",
  title = "Or begin with the occasion"
}) {
  const allDesignersCell = {
    id: "all-designers",
    roman: "A to Z",
    name: "All designers",
    path: "/main-page?section=designers",
    action: "Browse",
    isAllDesigners: true
  };

  const cells = [
    ...OCCASIONS_ORDER.map((occ) => ({
      ...occ,
      action: "Explore",
      isAllDesigners: false
    })),
    allDesignersCell
  ];

  return (
    <section className="sys-occasions-band" aria-labelledby="sys-occasions-title">
      <div className="sys-occasions-inner">
        {eyebrow && (
          <div className="sys-occasions-eyebrow" aria-hidden="true">
            <span className="sys-occasions-eyebrow-rule" />
            <span className="sys-occasions-eyebrow-text">{eyebrow}</span>
          </div>
        )}

        <h2 id="sys-occasions-title" className="sys-occasions-title">
          Or begin with the <em>occasion</em>
        </h2>

        <div className="sys-occasions-grid">
          {cells.map((cell) => (
            <Link
              key={cell.id}
              to={cell.path}
              className={`sys-occasion-cell ${cell.isAllDesigners ? "all-designers" : ""}`}
            >
              <div className="sys-occasion-num">{cell.roman}</div>
              <div className="sys-occasion-name">{cell.name}</div>
              <div className="sys-occasion-link">
                <span>{cell.action}</span>
                <span className="sys-occasion-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
