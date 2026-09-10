import React, { useState } from "react";
import "./RegionalTab.css";

interface RegionalForm {
  timezone: string;
  currency: string;
  dateFormat: string;
  numberFormat: string;
}

const initialForm: RegionalForm = {
  timezone: "Asia/Kolkata (IST)",
  currency: "INR ₹",
  dateFormat: "DD MMM YYYY",
  numberFormat: "Indian — lakh and crore",
};

const timezones = [
  "Asia/Kolkata (IST)",
  "Asia/Dubai (GST)",
  "Asia/Singapore (SGT)",
  "Europe/London (GMT)",
  "America/New_York (EST)",
];

const currencies = [
  "INR ₹",
  "USD $",
  "GBP £",
  "EUR €",
  "AED د.إ",
];

const dateFormats = [
  "DD MMM YYYY",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
];

const numberFormats = [
  "Indian — lakh and crore",
  "International — million and billion",
];

export default function RegionalTab() {
  const [form, setForm] = useState<RegionalForm>(initialForm);

  const updateField = <K extends keyof RegionalForm>(
    field: K,
    value: RegionalForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="regional-tab">
      {/* =========================
          REGION HEADER
      ========================= */}

      <div className="regional-region-header">
        <div className="regional-title-row">
          <h2>Regional</h2>

          <span className="regional-meta">
            Priya (Ops) · 2 days ago
          </span>
        </div>

        <p>
          Timezone, currency and the way dates and figures are written.
          Environment settings, set once at launch — the same class of thing
          as the site&apos;s address, not a commercial rule like a payout split.
        </p>
      </div>

      {/* =========================
          REGIONAL CARD
      ========================= */}

      <section className="regional-card">
        <div className="regional-card-header">
          <h3>Regional</h3>

          <p>
            Set once at launch. Changing any of these re-reads every stored
            timestamp and price, so it is not a running adjustment.
          </p>
        </div>

        <div className="regional-card-body">
          {/* TIMEZONE + CURRENCY */}

          <div className="regional-grid-two">
            <RegionalSelect
              label="TIMEZONE"
              value={form.timezone}
              options={timezones}
              onChange={(value) =>
                updateField("timezone", value)
              }
            />

            <RegionalSelect
              label="CURRENCY"
              value={form.currency}
              options={currencies}
              onChange={(value) =>
                updateField("currency", value)
              }
            />
          </div>

          <div className="regional-grid-two regional-row-gap">
            <div className="regional-field">
              <RegionalSelect
                label="DATE FORMAT"
                value={form.dateFormat}
                options={dateFormats}
                onChange={(value) =>
                  updateField("dateFormat", value)
                }
              />

              <span className="regional-example">
                Prints: 23 Mar 2026
              </span>

              <span className="regional-help">
                How dates read in the panel and on order confirmations.
              </span>
            </div>

            <div className="regional-field">
              <RegionalSelect
                label="NUMBER FORMAT"
                value={form.numberFormat}
                options={numberFormats}
                onChange={(value) =>
                  updateField("numberFormat", value)
                }
              />

              <span className="regional-example">
                Prints: ₹1,50,000 and ₹1,25,00,000
              </span>

              <span className="regional-help">
                How a large figure is grouped wherever it is printed.
              </span>
            </div>
          </div>

          {/* EXPLANATION */}

          <div className="regional-note">
            These are read by Orders, the rental calendar, Dispatch, Payouts
            and every invoice, but they are configuration rather than a
            commercial rule — which is why they sit here and not in{" "}
            <strong>Master Data</strong>.
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   SELECT FIELD
========================= */

interface RegionalSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function RegionalSelect({
  label,
  value,
  options,
  onChange,
}: RegionalSelectProps) {
  return (
    <div className="regional-field">
      <label>{label}</label>

      <select
        className="regional-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {label === "TIMEZONE" && (
        <span className="regional-help">
          Every timestamp in Orders, the rental calendar, Dispatch and the
          08:00 notification digests.
        </span>
      )}

      {label === "CURRENCY" && (
        <span className="regional-help">
          Every price, invoice, payout statement and GST line.
        </span>
      )}
    </div>
  );
}