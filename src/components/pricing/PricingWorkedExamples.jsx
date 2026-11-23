// src/components/pricing/PricingWorkedExamples.jsx
// In Numbers: The Worked Examples (D8) matching Pages 20-24 & 45 of hok_pricing_fees_v4

import React, { useState } from "react";
import { PRICING_WORKED_EXAMPLES } from "../../data/pricing/pricingRegistry";

// Formats number into Indian Rupee grouping without punctuation dashes
function formatInr(num) {
  return "₹" + num.toLocaleString("en-IN");
}

const toNum = (v, fallback) => {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

function PricingWorkedExamples({ getVal }) {
  const gv = (k, fb) => (getVal ? getVal(k, fb) : fb);
  const [activeTab, setActiveTab] = useState("rental");
  const [rentalChoice, setRentalChoice] = useState("two"); // Default "Two days" (Page 34 & 45)
  const [prelovedChoice, setPrelovedChoice] = useState("list"); // Default "The listed price" (Page 34 & 45)

  const rentalData = PRICING_WORKED_EXAMPLES.examples[0];
  const prelovedData = PRICING_WORKED_EXAMPLES.examples[1];

  const rentalWindowPrice = toNum(gv("pricing_ex_rental_window_price", rentalData.windowPrice), rentalData.windowPrice);
  const rentalDailyRate = toNum(gv("pricing_ex_rental_daily_rate", rentalData.dailyRate), rentalData.dailyRate);
  const rentalDepositAmount = toNum(gv("pricing_ex_rental_deposit", rentalData.depositAmount), rentalData.depositAmount);

  // Rental math according to Section 5.6
  const extraDays = rentalChoice === "one" ? 0 : rentalChoice === "two" ? 1 : 2;
  const extraCost = extraDays * rentalDailyRate;
  const rentalFee = rentalWindowPrice + extraCost;
  const rentalGst = Math.round(rentalFee * 0.18);
  const rentalTotal = rentalFee + rentalGst;

  // Preloved math according to Section 5.6
  const prelovedListPrice = toNum(gv("pricing_ex_preloved_list_price", 60000), 60000);
  const prelovedOfferPrice = toNum(gv("pricing_ex_preloved_offer_price", 54000), 54000);
  const prelovedPrice = prelovedChoice === "list" ? prelovedListPrice : prelovedOfferPrice;
  const prelovedGst = Math.round(prelovedPrice * 0.05);
  const prelovedTotal = prelovedPrice + prelovedGst;

  return (
    <section className="num" id="numbers" aria-label="In numbers worked examples">
      {/* Heading */}
      <div className="ex-hd">
        <h2>
          {gv("pricing_ex_title_prefix", PRICING_WORKED_EXAMPLES.titlePrefix)}
          <em>{gv("pricing_ex_italic", PRICING_WORKED_EXAMPLES.italicWord)}</em>
        </h2>
        <p>{gv("pricing_ex_subline", PRICING_WORKED_EXAMPLES.subline)}</p>
      </div>

      {/* Example Tabs */}
      <div className="ex-tabs" role="tablist" aria-label="Worked example options">
        <button
          type="button"
          role="tab"
          id="tab-worked-rental"
          aria-selected={activeTab === "rental"}
          aria-controls="worked-example-content"
          className="ex-tab"
          onClick={() => setActiveTab("rental")}
        >
          {gv("pricing_ex_rental_tab", rentalData.tabLabel)}
        </button>
        <button
          type="button"
          role="tab"
          id="tab-worked-preloved"
          aria-selected={activeTab === "preloved"}
          aria-controls="worked-example-content"
          className="ex-tab"
          onClick={() => setActiveTab("preloved")}
        >
          {gv("pricing_ex_preloved_tab", prelovedData.tabLabel)}
        </button>
      </div>

      <div id="worked-example-content" role="tabpanel" aria-labelledby={activeTab === "rental" ? "tab-worked-rental" : "tab-worked-preloved"}>
        {activeTab === "rental" ? (
          <div className="num-body">
            {/* The Example */}
            <div className="num-left">
              <p className="num-lead">{gv("pricing_ex_rental_lead", rentalData.lead)}</p>

              <div className="chips-k">{rentalData.choiceLabel}</div>
              <div className="chips" role="group" aria-label="Days of celebrations choices">
                {rentalData.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className="chip"
                    aria-pressed={rentalChoice === choice.id}
                    onClick={() => setRentalChoice(choice.id)}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>

              <p className="num-note">{gv("pricing_ex_rental_note", rentalData.note)}</p>
            </div>

            {/* The Receipt */}
            <div className="num-right">
              <div className="rc" aria-label="Rental receipt breakdown">
                <div className="rc-row">
                  <span>Standard rental window, 3 days</span>
                  <b>{formatInr(rentalWindowPrice)}</b>
                </div>

                {extraDays === 1 && (
                  <div className="rc-row">
                    <span>1 extra day at {formatInr(rentalDailyRate)}</span>
                    <b>{formatInr(extraCost)}</b>
                  </div>
                )}

                {extraDays === 2 && (
                  <div className="rc-row">
                    <span>2 extra days at {formatInr(rentalDailyRate)} each</span>
                    <b>{formatInr(extraCost)}</b>
                  </div>
                )}

                <div className="rc-row sub">
                  <span>Rental fee</span>
                  <b>{formatInr(rentalFee)}</b>
                </div>

                <div className="rc-row">
                  <span>GST at 18%</span>
                  <b>{formatInr(rentalGst)}</b>
                </div>

                <div className="rc-row free">
                  <span>Delivery, both journeys</span>
                  <b>Free</b>
                </div>

                <div className="rc-total">
                  <span>Paid at checkout</span>
                  <b>{formatInr(rentalTotal)}</b>
                </div>

                {/* Deposit Aside */}
                <aside className="rc-aside" aria-label="Security deposit held separately">
                  <div>
                    <span>Deposit, held separately</span>
                    <b>{formatInr(rentalDepositAmount)}</b>
                  </div>
                  <p>{gv("pricing_ex_rental_deposit_note", rentalData.depositNote)}</p>
                </aside>
              </div>
            </div>
          </div>
        ) : (
          <div className="num-body">
            {/* The Example */}
            <div className="num-left">
              <p className="num-lead">{gv("pricing_ex_preloved_lead", prelovedData.lead)}</p>

              <div className="chips-k">{prelovedData.choiceLabel}</div>
              <div className="chips" role="group" aria-label="Bought at choices">
                {prelovedData.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className="chip"
                    aria-pressed={prelovedChoice === choice.id}
                    onClick={() => setPrelovedChoice(choice.id)}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>

              <p className="num-note">{gv("pricing_ex_preloved_note", prelovedData.note)}</p>
            </div>

            {/* The Receipt */}
            <div className="num-right">
              <div className="rc" aria-label="Preloved receipt breakdown">
                <div className="rc-row">
                  <span>{prelovedChoice === "list" ? "The listed price" : "Your accepted offer"}</span>
                  <b>{formatInr(prelovedPrice)}</b>
                </div>

                <div className="rc-row">
                  <span>GST at 5%</span>
                  <b>{formatInr(prelovedGst)}</b>
                </div>

                <div className="rc-row free">
                  <span>Delivery within India</span>
                  <b>Free</b>
                </div>

                <div className="rc-total">
                  <span>Paid at checkout</span>
                  <b>{formatInr(prelovedTotal)}</b>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default React.memo(PricingWorkedExamples);
