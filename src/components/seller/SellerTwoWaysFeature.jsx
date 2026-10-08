/**
 * House of Kaira - Two Ways to List Feature Component (Component C6)
 * Section 5.7 & Appendix A of Build Specification 1.0
 */

import React from "react";
import { TWO_WAYS_FEATURE } from "../../data/seller/sellerRegistry";

export default function SellerTwoWaysFeature() {
  const { keep, send, marker } = TWO_WAYS_FEATURE;

  return (
    <div className="ways" aria-label="Two ways to list comparison">
      {/* Keep it with you Card */}
      <div className="way keep">
        <svg viewBox="0 0 24 24" className="way-icon" aria-hidden="true">
          <path d="M12 4a3 3 0 0 0-3 3c0 .8.4 1.5 1 2l-8 5a2 2 0 0 0-1 1.7v1.3h20v-1.3a2 2 0 0 0-1-1.7l-8-5c.6-.5 1-1.2 1-2a3 3 0 0 0-3-3z" />
        </svg>

        <h3>{keep.title}</h3>
        <p className="way-sum">{keep.summary}</p>

        <dl>
          {keep.rows.map((row, idx) => (
            <div className="way-row" key={idx}>
              <dt>{row.label}</dt>
              <dd>{row.desc}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Middle "or" Circle */}
      <div className="ways-or" aria-hidden="true">
        {marker}
      </div>

      {/* Send it to us Card */}
      <div className="way send">
        <svg viewBox="0 0 24 24" className="way-icon" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>

        <h3>{send.title}</h3>
        <p className="way-sum">{send.summary}</p>

        <dl>
          {send.rows.map((row, idx) => (
            <div className="way-row" key={idx}>
              <dt>{row.label}</dt>
              <dd>{row.desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
