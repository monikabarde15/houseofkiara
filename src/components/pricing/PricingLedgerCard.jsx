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

function PricingLedgerCard({ activeSide, onSideChange, onSelectQuestion, getVal, extraLedgerRows }) {
  const gv = (k, fb) => (getVal ? getVal(k, fb) : fb);
  // On phones, Renting (column 0) is shown first, with a column switch to Buying preloved (column 1)
  const [selectedCol, setSelectedCol] = useState(0);

  const isPay = activeSide === "pay";
  const customPayRows = (extraLedgerRows?.pay || []).filter(
    (r) => r && !r.hidden && (r.name || r.rentFig || r.buyFig)
  );
  const customEarnRows = (extraLedgerRows?.earn || []).filter(
    (r) => r && !r.hidden && (r.name || r.fig)
  );

  const handleCellClick = (targetId, side) => {
    if (onSelectQuestion && targetId) {
      onSelectQuestion(targetId, side);
    }
  };

  const payCol1 = gv("pricing_ledger_pay_col1", PRICING_LEDGER.pay.columnHeaders?.[0] || "Renting");
  const payCol2 = gv("pricing_ledger_pay_col2", PRICING_LEDGER.pay.columnHeaders?.[1] || "Buying preloved");

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
          <span className="st-k">{gv("pricing_tab_pay_label", PRICING_LEDGER.tabs[0].label)}</span>
          <span className="st-t">{gv("pricing_tab_pay_title", PRICING_LEDGER.tabs[0].title)}</span>
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
          <span className="st-k">{gv("pricing_tab_earn_label", PRICING_LEDGER.tabs[1].label)}</span>
          <span className="st-t">{gv("pricing_tab_earn_title", PRICING_LEDGER.tabs[1].title)}</span>
        </button>
      </div>

      <div id="ledger-content-panel" role="tabpanel" aria-labelledby={isPay ? "side-tab-pay" : "side-tab-earn"}>
        {/* Ledger Header */}
        <div className="lg-hd">
          <h2>
            {isPay
              ? gv("pricing_ledger_pay_title", PRICING_LEDGER.pay.title)
              : gv("pricing_ledger_earn_title", PRICING_LEDGER.earn.title)}
          </h2>
          <p>
            {isPay
              ? gv("pricing_ledger_pay_hint", PRICING_LEDGER.pay.hint)
              : gv("pricing_ledger_earn_hint", PRICING_LEDGER.earn.hint)}
          </p>
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
                {payCol1}
              </button>
              <button
                type="button"
                className="lg-col"
                aria-pressed={selectedCol === 1}
                onClick={() => setSelectedCol(1)}
              >
                {payCol2}
              </button>
            </div>

            {/* Table What you pay (3 columns) */}
            <div className={`lg show-${selectedCol}`}>
              <div className="lg-row hd" aria-hidden="true">
                <div className="lg-ch" />
                <div className="lg-ch">{payCol1}</div>
                <div className="lg-ch">{payCol2}</div>
              </div>

              {PRICING_LEDGER.pay.rows.map((row, idx) => {
                const rowName = gv(`pricing_pay_row_${idx}_name`, row.name);
                const rentFig = gv(`pricing_pay_row_${idx}_rent_fig`, row.rental.figure);
                const rentLine = gv(`pricing_pay_row_${idx}_rent_line`, row.rental.line);
                const buyFig = gv(`pricing_pay_row_${idx}_buy_fig`, row.preloved.figure);
                const buyLine = gv(`pricing_pay_row_${idx}_buy_line`, row.preloved.line);
                return (
                <div key={row.name} className="lg-row">
                  <div className="lg-k">{rowName}</div>

                  {/* Renting Cell */}
                  {row.rental.isNa ? (
                    <div className="lg-c na" data-i="0">
                      <span className="lg-h">{rentFig}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="lg-c"
                      data-i="0"
                      onClick={() => handleCellClick(row.rental.targetId, "pay")}
                      aria-label={`${rowName}, ${payCol1}: ${rentFig}. Opens explanation.`}
                    >
                      <span className="lg-h">{rentFig}</span>
                      {rentLine && <span className="lg-d">{rentLine}</span>}
                      <ChevronIcon />
                    </button>
                  )}

                  {/* Preloved Cell */}
                  {row.preloved.isNa ? (
                    <div className="lg-c na" data-i="1">
                      <span className="lg-h">{buyFig}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="lg-c"
                      data-i="1"
                      onClick={() => handleCellClick(row.preloved.targetId, "pay")}
                      aria-label={`${rowName}, ${payCol2}: ${buyFig}. Opens explanation.`}
                    >
                      <span className="lg-h">{buyFig}</span>
                      {buyLine && <span className="lg-d">{buyLine}</span>}
                      <ChevronIcon />
                    </button>
                  )}
                </div>
                );
              })}

              {customPayRows.map((row, idx) => (
                <div key={row.id || `extra-pay-${idx}`} className="lg-row">
                  <div className="lg-k">{row.name}</div>
                  <div className="lg-c static" data-i="0">
                    <span className="lg-h">{row.rentFig || "—"}</span>
                    {row.rentLine && <span className="lg-d">{row.rentLine}</span>}
                  </div>
                  <div className="lg-c static" data-i="1">
                    <span className="lg-h">{row.buyFig || "—"}</span>
                    {row.buyLine && <span className="lg-d">{row.buyLine}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Foot line */}
            <div className="lg-foot">
              <span>{gv("pricing_ledger_pay_foot", PRICING_LEDGER.pay.footText)}</span>
              <button
                type="button"
                className="lnk"
                onClick={() => handleCellClick(PRICING_LEDGER.pay.footTargetId, "pay")}
              >
                {gv("pricing_ledger_pay_foot_link", PRICING_LEDGER.pay.footLinkText)}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Table What you earn (2 columns) */}
            <div className="lg two">
              {PRICING_LEDGER.earn.rows.map((row, idx) => {
                const rowName = gv(`pricing_earn_row_${idx}_name`, row.name);
                const rowFig = gv(`pricing_earn_row_${idx}_fig`, row.figure);
                const rowLine = gv(`pricing_earn_row_${idx}_line`, row.line);
                return (
                <div key={row.name} className="lg-row">
                  <div className="lg-k">{rowName}</div>
                  <button
                    type="button"
                    className="lg-c"
                    onClick={() => handleCellClick(row.targetId, "earn")}
                    aria-label={`${rowName}: ${rowFig}. Opens explanation.`}
                  >
                    <span className="lg-h">{rowFig}</span>
                    {rowLine && <span className="lg-d">{rowLine}</span>}
                    <ChevronIcon />
                  </button>
                </div>
                );
              })}

              {customEarnRows.map((row, idx) => (
                <div key={row.id || `extra-earn-${idx}`} className="lg-row">
                  <div className="lg-k">{row.name}</div>
                  <div className="lg-c static">
                    <span className="lg-h">{row.fig || "—"}</span>
                    {row.line && <span className="lg-d">{row.line}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Foot line */}
            <div className="lg-foot">
              <span>{gv("pricing_ledger_earn_foot", PRICING_LEDGER.earn.footText)}</span>
              <Link to={PRICING_LEDGER.earn.footPath} className="lnk">
                {gv("pricing_ledger_earn_foot_link", PRICING_LEDGER.earn.footLinkText)}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default React.memo(PricingLedgerCard);
