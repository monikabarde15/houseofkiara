/**
 * House of Kaira: Widen Notice Component (C10)
 * Section 4 C10 of System Pages Specification v1.0
 */

import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-widen.css";

export default function WidenNotice({
  query,
  otherMode = "preloved",
  count = 0,
  onWiden = null
}) {
  if (!count || count <= 0) return null;

  const isPreloved = otherMode === "preloved";

  const message = isPreloved
    ? count === 1
      ? `1 preloved piece matches “${query}”.`
      : `${count} preloved pieces match “${query}”.`
    : count === 1
      ? `1 piece to rent matches “${query}”.`
      : `${count} pieces to rent match “${query}”.`;

  const buttonText = isPreloved
    ? count === 1
      ? "See the preloved piece"
      : `See the ${count} preloved pieces`
    : count === 1
      ? "See the piece to rent"
      : `See the ${count} pieces to rent`;

  const targetUrl = `/search?q=${encodeURIComponent(query)}&mode=${otherMode}`;

  return (
    <aside className="sys-widen-box" role="status" aria-live="polite">
      <p className="sys-widen-text">
        <strong>{count === 1 ? "1" : count}</strong>{" "}
        {isPreloved
          ? count === 1
            ? `preloved piece matches “${query}”.`
            : `preloved pieces match “${query}”.`
          : count === 1
            ? `piece to rent matches “${query}”.`
            : `pieces to rent match “${query}”.`}
      </p>

      {onWiden ? (
        <button
          type="button"
          onClick={() => onWiden(otherMode)}
          className="sys-widen-btn"
        >
          {buttonText}
        </button>
      ) : (
        <Link to={targetUrl} className="sys-widen-btn">
          {buttonText}
        </Link>
      )}
    </aside>
  );
}
