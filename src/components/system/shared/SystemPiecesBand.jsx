/**
 * House of Kaira: System Pieces Band (S5 / C7)
 * Sections 4 C7 & 5.6 of System Pages Specification v1.0
 */

import React from "react";
import { Link } from "react-router-dom";
import SystemProductCard from "./SystemProductCard";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-pieces.css";

export default function SystemPiecesBand({
  eyebrow = "Still available",
  title = "In the same spirit",
  highlightWord = null,
  link = null,
  pieces = []
}) {
  if (!pieces || pieces.length < 2) {
    return null; // Section 5.6 item 4
  }

  const renderTitle = () => {
    if (!title) return null;
    const text = String(title);

    if (highlightWord && text.includes(highlightWord)) {
      const parts = text.split(highlightWord);
      return (
        <>
          {parts[0]}
          <em>{highlightWord}</em>
          {parts.slice(1).join(highlightWord)}
        </>
      );
    }

    if (text.includes("More from ")) {
      const name = text.replace("More from ", "");
      return (
        <>
          More from <em>{name}</em>
        </>
      );
    }

    return text;
  };

  return (
    <section className="sys-pieces-band" aria-labelledby="sys-pieces-title">
      <div className="sys-pieces-inner">
        <div className="sys-pieces-heading-row">
          <div className="sys-pieces-title-group">
            {eyebrow && (
              <div className="sys-pieces-eyebrow" aria-hidden="true">
                <span className="sys-pieces-eyebrow-rule" />
                <span className="sys-pieces-eyebrow-text">{eyebrow}</span>
              </div>
            )}
            <h2 id="sys-pieces-title" className="sys-pieces-title">
              {renderTitle()}
            </h2>
          </div>

          {link && link.label && link.href && (
            <Link to={link.href} className="sys-pieces-view-all">
              <span>{link.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <div className="sys-pieces-grid">
          {pieces.map((piece) => (
            <SystemProductCard key={piece.id || piece.houseNumber} piece={piece} />
          ))}
        </div>
      </div>
    </section>
  );
}
