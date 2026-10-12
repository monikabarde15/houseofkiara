/**
 * House of Kaira: Shipping Rental Window Card (D5)
 * Section 4.5 & Page 11, 12, 13, 14 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { SHIPPING_RENTAL_WINDOW_CARD } from "../../data/shipping/shippingRegistry";

function ShippingRentalWindowCard({ onSelectQuestion }) {
  const handleNote2LinkClick = () => {
    if (onSelectQuestion) {
      onSelectQuestion(`#${SHIPPING_RENTAL_WINDOW_CARD.note2.targetAnswerId}`);
    }
  };

  return (
    <section
      className="jr enter e5"
      id="rental-window"
      data-anchor="card:window"
      aria-labelledby="rental-window-title"
    >
      <div className="jr-hd">
        <h2 id="rental-window-title">{SHIPPING_RENTAL_WINDOW_CARD.title}</h2>
        <p>{SHIPPING_RENTAL_WINDOW_CARD.hint}</p>
      </div>

      <div className="wn">
        {/* Three day box */}
        <div
          className="wn-days"
          role="list"
          aria-label="Standard rental window, 3 days, one price"
        >
          {SHIPPING_RENTAL_WINDOW_CARD.days.map((day) => (
            <div
              key={day.label}
              className={`wn-day ${day.isCelebration ? "is-day" : ""}`}
              role="listitem"
            >
              <span className="wn-n">{day.label}</span>
              <b className="wn-k">{day.title}</b>
              <span className="wn-d">{day.line}</span>
            </div>
          ))}
        </div>

        {/* Plus separator */}
        <div className="wn-plus" aria-hidden="true">
          <span>+</span>
        </div>

        {/* Extra days box */}
        <div
          className="wn-extra"
          role="group"
          aria-label="Optional, daily rate"
        >
          <span className="wn-n">{SHIPPING_RENTAL_WINDOW_CARD.extraDays.label}</span>
          <b className="wn-k">{SHIPPING_RENTAL_WINDOW_CARD.extraDays.title}</b>
          <span className="wn-d">{SHIPPING_RENTAL_WINDOW_CARD.extraDays.line}</span>
        </div>

        {/* Bracket under the 3 days */}
        <div className="wn-span s1" aria-hidden="true">
          <span>{SHIPPING_RENTAL_WINDOW_CARD.bracketDaysLabel}</span>
        </div>

        {/* Bracket under extra days */}
        <div className="wn-span s2" aria-hidden="true">
          <span>{SHIPPING_RENTAL_WINDOW_CARD.bracketExtraLabel}</span>
        </div>
      </div>

      {/* Two notes side by side */}
      <div className="wn-notes">
        <div className="wn-note">
          <b>{SHIPPING_RENTAL_WINDOW_CARD.note1.title}</b>
          <p>{SHIPPING_RENTAL_WINDOW_CARD.note1.text}</p>
        </div>
        <div className="wn-note">
          <b>{SHIPPING_RENTAL_WINDOW_CARD.note2.title}</b>
          <p>
            {SHIPPING_RENTAL_WINDOW_CARD.note2.textPrefix}
            <button
              type="button"
              className="sh-inline-link"
              onClick={handleNote2LinkClick}
            >
              {SHIPPING_RENTAL_WINDOW_CARD.note2.linkText}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default React.memo(ShippingRentalWindowCard);
