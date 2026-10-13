/**
 * House of Kaira: Shipping Print Document Component (D15)
 * Section 4.15 & Page 25, 26 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import {
  SHIPPING_INTRO,
  SHIPPING_WAYS_WE_DELIVER,
  SHIPPING_RENTAL_WINDOW_CARD,
  SHIPPING_SECTIONS,
  SHIPPING_FINE_PRINT
} from "../../data/shipping/shippingRegistry";

function ShippingPrintDocument() {
  return (
    <div id="printAll" aria-hidden="true">
      <h1>Shipping &amp; Delivery Policy · House of Kaira</h1>
      <div className="pr-meta">
        Last reviewed 10 October 2026 · Valid for all current bookings and orders
      </div>

      <h2>Introduction</h2>
      <p className="ans">
        {SHIPPING_INTRO.text}
        <strong>{SHIPPING_INTRO.emphasis}</strong>
        {SHIPPING_INTRO.suffix}
      </p>

      <h2>How your rental window works</h2>
      <p className="ans">
        Every rental has a standard window of 3 days:
      </p>
      <ul className="pr-steps">
        {SHIPPING_RENTAL_WINDOW_CARD.days.map((d) => (
          <li key={d.label}>
            <strong>{d.label}: {d.title}</strong> ( {d.line} )
          </li>
        ))}
      </ul>
      <p className="ans">
        Need it longer? Add days when you book, at the piece's daily rate.
      </p>

      <h2>Ways we deliver</h2>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Coverage</th>
            <th>Estimated Time</th>
            <th>Pricing &amp; Notes</th>
          </tr>
        </thead>
        <tbody>
          {SHIPPING_WAYS_WE_DELIVER.options.map((opt) => (
            <tr key={opt.id}>
              <td><strong>{opt.name}</strong></td>
              <td>{opt.place}</td>
              <td>{opt.time}</td>
              <td>{opt.tag.text}. {opt.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ans" style={{ fontStyle: "italic", marginTop: "6px" }}>
        {SHIPPING_WAYS_WE_DELIVER.footnote}
      </p>

      <h2>Policy Questions &amp; Answers</h2>
      {SHIPPING_SECTIONS.map((sec) => (
        <div key={sec.id}>
          <h2>
            Section {sec.num}: {sec.titlePrefix}{sec.italicWord}
          </h2>
          <p className="ans" style={{ marginBottom: "12px" }}>
            {sec.desc}
          </p>

          {sec.questions.map((q) => (
            <div key={q.id} className="pr-q">
              <h3>{q.question}</h3>
              <div className="ans">
                {q.paragraphs.map((p, idx) => (
                  <p key={idx} style={{ marginTop: idx > 0 ? "6px" : 0 }}>
                    {p}
                  </p>
                ))}
                {q.bullets && (
                  <ul>
                    {q.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
                {q.note && (
                  <p style={{ fontStyle: "italic", marginTop: "6px" }}>
                    {q.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      <p className="pr-meta" style={{ marginTop: "24px", borderTop: "1px solid #E8E0D4", paddingTop: "12px" }}>
        {SHIPPING_FINE_PRINT.text}
      </p>
    </div>
  );
}

export default React.memo(ShippingPrintDocument);
