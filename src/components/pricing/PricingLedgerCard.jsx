// src/components/pricing/PricingLedgerCard.jsx
// The Price Ledger Card (D5) matching Pages 12-17 of hok_pricing_fees_v4

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PRICING_LEDGER } from "../../data/pricing/pricingRegistry";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PricingLedgerCard({ activeSide, onSideChange, onSelectQuestion }) {
  // On phones, Renting (column 0) is shown first, with a column switch to Buying preloved (column 1)
  const [selectedCol, setSelectedCol] = useState(0);

  const isPay = activeSide === "pay";
  const ledgerData = isPay ? PRICING_LEDGER.pay : PRICING_LEDGER.earn;

  const handleCellClick = (targetId, side) => {
    if (onSelectQuestion && targetId) {
      onSelectQuestion(targetId, side);
    }
  };

  return (
    <section className="pf-card enter e3" id="ledger" aria-label="Price & Earning Ledger">
      {/* Side tabs */}
      <div className="side-tabs" role="tablist" aria-label="Pricing perspective tabs">
        <button
          type="button"
          role="tab"
          id="side-tab-pay"
          aria-selected={isPay}
          aria-controls="ledger-content-panel"
          className="side-tab"
          onClick={() => onSideChange("pay")}
        >
          <span className="st-k">{PRICING_LEDGER.tabs[0].label}</span>
          <span className="st-t">{PRICING_LEDGER.tabs[0].title}</span>
        </button>

        <button
          type="button"
          role="tab"
          id="side-tab-earn"
          aria-selected={!isPay}
          aria-controls="ledger-content-panel"
          className="side-tab"
          onClick={() => onSideChange("earn")}
        >
          <span className="st-k">{PRICING_LEDGER.tabs[1].label}</span>
          <span className="st-t">{PRICING_LEDGER.tabs[1].title}</span>
        </button>
      </div>

      <div id="ledger-content-panel" role="tabpanel" aria-labelledby={isPay ? "side-tab-pay" : "side-tab-earn"}>
        {/* Ledger Header */}
        <div className="lg-hd">
          <h2>{ledgerData.title}</h2>
          <p>{ledgerData.hint}</p>
        </div>

        {isPay ? (
          <>
            {/* Phone column switch (760px and narrower) */}
            <div className="lg-cols" role="group" aria-label="Choose column to view">
              <button
                type="button"
                className="lg-col"
                aria-pressed={selectedCol === 0}
                onClick={() => setSelectedCol(0)}
              >
                Renting
              </button>
              <button
                type="button"
                className="lg-col"
                aria-pressed={selectedCol === 1}
                onClick={() => setSelectedCol(1)}
              >
                Buying preloved
              </button>
            </div>

            {/* Table What you pay (3 columns) */}
            <div className={`lg show-${selectedCol}`}>
              <div className="lg-row hd" aria-hidden="true">
                <div className="lg-ch" />
                <div className="lg-ch">Renting</div>
                <div className="lg-ch">Buying preloved</div>
              </div>

              {PRICING_LEDGER.pay.rows.map((row) => (
                <div key={row.name} className="lg-row">
                  <div className="lg-k">{row.name}</div>

                  {/* Renting Cell */}
                  {row.rental.isNa ? (
                    <div className="lg-c na" data-i="0">
                      <span className="lg-h">{row.rental.figure}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="lg-c"
                      data-i="0"
                      onClick={() => handleCellClick(row.rental.targetId, "pay")}
                      aria-label={`${row.name}, Renting: ${row.rental.figure}. Opens explanation.`}
                    >
                      <span className="lg-h">{row.rental.figure}</span>
                      {row.rental.line && <span className="lg-d">{row.rental.line}</span>}
                      <ChevronIcon />
                    </button>
                  )}

                  {/* Preloved Cell */}
                  {row.preloved.isNa ? (
                    <div className="lg-c na" data-i="1">
                      <span className="lg-h">{row.preloved.figure}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="lg-c"
                      data-i="1"
                      onClick={() => handleCellClick(row.preloved.targetId, "pay")}
                      aria-label={`${row.name}, Buying preloved: ${row.preloved.figure}. Opens explanation.`}
                    >
                      <span className="lg-h">{row.preloved.figure}</span>
                      {row.preloved.line && <span className="lg-d">{row.preloved.line}</span>}
                      <ChevronIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Foot line */}
            <div className="lg-foot">
              <span>{PRICING_LEDGER.pay.footText}</span>
              <button
                type="button"
                className="lnk"
                onClick={() => handleCellClick(PRICING_LEDGER.pay.footTargetId, "pay")}
              >
                {PRICING_LEDGER.pay.footLinkText}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Table What you earn (2 columns) */}
            <div className="lg two">
              {PRICING_LEDGER.earn.rows.map((row) => (
                <div key={row.name} className="lg-row">
                  <div className="lg-k">{row.name}</div>
                  <button
                    type="button"
                    className="lg-c"
                    onClick={() => handleCellClick(row.targetId, "earn")}
                    aria-label={`${row.name}: ${row.figure}. Opens explanation.`}
                  >
                    <span className="lg-h">{row.figure}</span>
                    {row.line && <span className="lg-d">{row.line}</span>}
                    <ChevronIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Foot line */}
            <div className="lg-foot">
              <span>{PRICING_LEDGER.earn.footText}</span>
              <Link to={PRICING_LEDGER.earn.footPath} className="lnk">
                {PRICING_LEDGER.earn.footLinkText}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default React.memo(PricingLedgerCard);
