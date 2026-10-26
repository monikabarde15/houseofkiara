// src/components/pricing/PricingPrintDocument.jsx
// D16 Print Version: Complete two-sided document for print or save as PDF

import React from "react";
import {
  PRICING_SIDE_INTROS,
  PRICING_LEDGER,
  PRICING_WORKED_EXAMPLES,
  PRICING_SECTIONS,
} from "../../data/pricing/pricingRegistry";

export default function PricingPrintDocument() {
  const paySections = PRICING_SECTIONS.filter((s) => s.side === "pay");
  const earnSections = PRICING_SECTIONS.filter((s) => s.side === "earn");

  const rentalExample = PRICING_WORKED_EXAMPLES.examples.find(
    (ex) => ex.id === "rental"
  );
  const prelovedExample = PRICING_WORKED_EXAMPLES.examples.find(
    (ex) => ex.id === "preloved"
  );

  return (
    <div id="printAll" aria-hidden="true">
      <h1>Pricing &amp; Fees · House of Kaira</h1>
      <div className="pr-meta">
        Last reviewed 11 October 2026 · Valid for all current bookings, purchases and consignment listings
      </div>

      {/* ================= SIDE 1: WHAT YOU PAY ================= */}
      <div className="pr-side">What you pay</div>
      <p className="ans">{PRICING_SIDE_INTROS.pay}</p>

      <h2>Price Ledger: What you pay</h2>
      <table>
        <thead>
          <tr>
            <th style={{ width: "28%" }}>Charge / Fee</th>
            <th style={{ width: "36%" }}>Renting</th>
            <th style={{ width: "36%" }}>Buying preloved</th>
          </tr>
        </thead>
        <tbody>
          {PRICING_LEDGER.pay.rows.map((row) => (
            <tr key={row.name}>
              <td>
                <strong>{row.name}</strong>
              </td>
              <td>
                <strong>{row.rental.figure}</strong>
                <br />
                {row.rental.line}
              </td>
              <td>
                <strong>{row.preloved.figure}</strong>
                <br />
                {row.preloved.line}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="pr-small">{PRICING_LEDGER.pay.footText}</p>

      <h2>Worked Examples: Your order, in numbers</h2>
      <p className="ans">{PRICING_WORKED_EXAMPLES.subline}</p>

      {/* Rental Worked Example */}
      {rentalExample && (
        <div style={{ marginTop: "14px" }}>
          <h3>A rental example</h3>
          <p className="ans">{rentalExample.lead}</p>
          <table>
            <thead>
              <tr>
                <th>Booking Choice</th>
                <th>Window / Extra Days</th>
                <th>GST (18%)</th>
                <th>Deposit</th>
                <th>Total Paid at Booking</th>
                <th>Net Cost (After Deposit Return)</th>
              </tr>
            </thead>
            <tbody>
              {rentalExample.choices.map((c) => {
                const subtotal =
                  rentalExample.windowPrice + c.extraDays * rentalExample.dailyRate;
                const gst = Math.round(subtotal * 0.18);
                const total = subtotal + gst + rentalExample.depositAmount;
                const net = subtotal + gst;
                return (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.label}</strong>
                    </td>
                    <td>
                      ₹{subtotal.toLocaleString("en-IN")}
                      <br />
                      <span className="pr-small">
                        {c.extraDays === 0
                          ? "Standard 3 days"
                          : `3 days + ${c.extraDays} extra day(s)`}
                      </span>
                    </td>
                    <td>₹{gst.toLocaleString("en-IN")}</td>
                    <td>₹{rentalExample.depositAmount.toLocaleString("en-IN")}</td>
                    <td>
                      <strong>₹{total.toLocaleString("en-IN")}</strong>
                    </td>
                    <td>
                      <strong>₹{net.toLocaleString("en-IN")}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="pr-small">
            {rentalExample.note} {rentalExample.depositNote}
          </p>
        </div>
      )}

      {/* Preloved Worked Example */}
      {prelovedExample && (
        <div style={{ marginTop: "14px" }}>
          <h3>A preloved example</h3>
          <p className="ans">{prelovedExample.lead}</p>
          <table>
            <thead>
              <tr>
                <th>Purchase Choice</th>
                <th>Base Price</th>
                <th>GST (5%)</th>
                <th>Security Deposit</th>
                <th>Total to Pay</th>
              </tr>
            </thead>
            <tbody>
              {prelovedExample.choices.map((c) => {
                const gst = Math.round(c.price * 0.05);
                const total = c.price + gst;
                return (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.label}</strong>
                    </td>
                    <td>₹{c.price.toLocaleString("en-IN")}</td>
                    <td>₹{gst.toLocaleString("en-IN")}</td>
                    <td>₹0 (No deposit)</td>
                    <td>
                      <strong>₹{total.toLocaleString("en-IN")}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="pr-small">{prelovedExample.note}</p>
        </div>
      )}

      {/* What You Pay Policy Sections */}
      <h2>What you pay: Policy Questions &amp; Answers</h2>
      {paySections.map((sec) => (
        <div key={sec.id} style={{ marginTop: "16px" }}>
          <h2>
            Section {sec.number}: {sec.title}
          </h2>
          <p className="ans" style={{ marginBottom: "10px" }}>
            {sec.summary}
          </p>

          {sec.questions.map((q) => (
            <div key={q.id} className="pr-q">
              <h3>{q.question}</h3>
              <div className="ans">
                {q.content ? (
                  q.content.map((block, bIdx) => {
                    if (block.type === "paragraph") {
                      return (
                        <p
                          key={bIdx}
                          style={{ marginTop: bIdx > 0 ? "6px" : 0 }}
                        >
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "list") {
                      return (
                        <ul key={bIdx} style={{ margin: "6px 0 6px 18px" }}>
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (block.type === "callout" || block.type === "note") {
                      return (
                        <p
                          key={bIdx}
                          style={{ fontStyle: "italic", marginTop: "6px" }}
                        >
                          {block.title && <strong>{block.title}: </strong>}
                          {block.text}
                        </p>
                      );
                    }
                    return null;
                  })
                ) : (
                  <p>{q.summary}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* ================= SIDE 2: WHAT YOU EARN ================= */}
      <div className="pr-side">What you earn</div>
      <p className="ans">{PRICING_SIDE_INTROS.earn}</p>

      <h2>Price Ledger: What you earn</h2>
      <table>
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Aspect</th>
            <th style={{ width: "30%" }}>What you earn</th>
            <th style={{ width: "40%" }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {PRICING_LEDGER.earn.rows.map((row) => (
            <tr key={row.name}>
              <td>
                <strong>{row.name}</strong>
              </td>
              <td>
                <strong>{row.figure}</strong>
              </td>
              <td>{row.line}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="pr-small">{PRICING_LEDGER.earn.hint}</p>

      {/* What You Earn Policy Sections */}
      <h2>What you earn: Policy Questions &amp; Answers</h2>
      {earnSections.map((sec) => (
        <div key={sec.id} style={{ marginTop: "16px" }}>
          <h2>
            Section {sec.number}: {sec.title}
          </h2>
          <p className="ans" style={{ marginBottom: "10px" }}>
            {sec.summary}
          </p>

          {sec.questions.map((q) => (
            <div key={q.id} className="pr-q">
              <h3>{q.question}</h3>
              <div className="ans">
                {q.content ? (
                  q.content.map((block, bIdx) => {
                    if (block.type === "paragraph") {
                      return (
                        <p
                          key={bIdx}
                          style={{ marginTop: bIdx > 0 ? "6px" : 0 }}
                        >
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "list") {
                      return (
                        <ul key={bIdx} style={{ margin: "6px 0 6px 18px" }}>
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (block.type === "callout" || block.type === "note") {
                      return (
                        <p
                          key={bIdx}
                          style={{ fontStyle: "italic", marginTop: "6px" }}
                        >
                          {block.title && <strong>{block.title}: </strong>}
                          {block.text}
                        </p>
                      );
                    }
                    return null;
                  })
                ) : (
                  <p>{q.summary}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Fine Print Footer */}
      <p
        className="pr-meta"
        style={{
          marginTop: "28px",
          borderTop: "1px solid #E8E0D4",
          paddingTop: "12px",
        }}
      >
        This page explains our prices, charges and shares in plain words. Where
        it ever differs from our Terms &amp; Conditions, the Terms apply. Last
        reviewed 11 October 2026.
      </p>
    </div>
  );
}
