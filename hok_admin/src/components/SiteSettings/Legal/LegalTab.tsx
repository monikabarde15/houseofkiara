import React, { useState } from "react";
import "./LegalTab.css";

interface LegalForm {
  registeredName: string;
  gstin: string;
  cin: string;
  registeredAddress: string;

  consentEnabled: boolean;
  heading: string;
  position: string;
  body: string;
  acceptLabel: string;
  rejectLabel: string;
  manageLabel: string;
  policyLink: string;
}

const initialForm: LegalForm = {
  registeredName: "House of Kaira Retail Pvt Ltd",
  gstin: "23AABCH1234K1ZV",
  cin: "U52609MP2025PTC071482",
  registeredAddress:
    "14 Vijay Nagar, Scheme 54, Indore, Madhya Pradesh",

  consentEnabled: false,
  heading: "We use cookies",
  position: "Bottom bar",
  body:
    "We use cookies to run the site, remember your bag, and understand what people browse. You can accept all, or take only what the site needs to work.",
  acceptLabel: "Accept all",
  rejectLabel: "Only essential",
  manageLabel: "Manage",
  policyLink: "/cookies",
};

export default function LegalTab() {
  const [form, setForm] = useState<LegalForm>(initialForm);
  const [showManageDetails, setShowManageDetails] = useState(false);

  const updateField = <K extends keyof LegalForm>(
    field: K,
    value: LegalForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="legal-tab">
      {/* REGION HEADER */}
      <div className="legal-region-header">
        <div>
          <div className="legal-title-row">
            <h2>Legal &amp; consent</h2>

            <span className="legal-meta">
              Priya (Ops) · 2 days ago
            </span>
          </div>

          <p>
            The registered entity, and the cookie banner the storefront does
            not have yet.
          </p>
        </div>
      </div>

      {/* STATUS NOTE */}
      <div className="legal-status-note">
        The banner is off, which is fine for now — only essential cookies run.
        It becomes a requirement the moment a tracking code is set on Google.
      </div>

      {/* REGISTERED ENTITY */}
      <section className="legal-card">
        <div className="legal-card-header">
          <h3>Registered entity</h3>

          <p>
            Printed on invoices and the legal pages, not in the storefront
            chrome.
          </p>
        </div>

        <div className="legal-card-body">
          <div className="legal-grid-two">
            <LegalField
              label="REGISTERED NAME"
              value={form.registeredName}
              onChange={(value) =>
                updateField("registeredName", value)
              }
            />

            <LegalField
              label="GSTIN"
              value={form.gstin}
              onChange={(value) => updateField("gstin", value)}
            />
          </div>

          <div className="legal-grid-two legal-row-gap">
            <LegalField
              label="CIN"
              value={form.cin}
              onChange={(value) => updateField("cin", value)}
            />

            <LegalField
              label="REGISTERED ADDRESS"
              value={form.registeredAddress}
              onChange={(value) =>
                updateField("registeredAddress", value)
              }
            />
          </div>
        </div>
      </section>

      {/* COOKIE CONSENT */}
      <section className="legal-card">
        <div className="legal-card-header">
          <h3>Cookie consent</h3>

          <p>
            The footer links to a Cookie Policy on every page, but no banner
            exists on the storefront yet.
          </p>
        </div>

        <div className="legal-card-body">
          <label className="legal-toggle-row">
            <button
              type="button"
              className={`legal-toggle ${
                form.consentEnabled ? "on" : ""
              }`}
              onClick={() =>
                updateField(
                  "consentEnabled",
                  !form.consentEnabled
                )
              }
              aria-pressed={form.consentEnabled}
            >
              <span />
            </button>

            <span>Show the consent banner</span>
          </label>

          <div className="legal-grid-two legal-row-gap">
            <LegalField
              label="HEADING"
              value={form.heading}
              onChange={(value) =>
                updateField("heading", value)
              }
            />

            <div className="legal-field">
              <label>POSITION</label>

              <select
                className="legal-input"
                value={form.position}
                onChange={(e) =>
                  updateField("position", e.target.value)
                }
              >
                <option>Bottom bar</option>
                <option>Top bar</option>
              </select>
            </div>
          </div>

          <div className="legal-field legal-body-field">
            <label>BODY</label>

            <textarea
              rows={3}
              value={form.body}
              onChange={(e) =>
                updateField("body", e.target.value)
              }
            />
          </div>

          <div className="legal-grid-three">
            <LegalField
              label="ACCEPT"
              value={form.acceptLabel}
              onChange={(value) =>
                updateField("acceptLabel", value)
              }
            />

            <LegalField
              label="REJECT"
              value={form.rejectLabel}
              onChange={(value) =>
                updateField("rejectLabel", value)
              }
            />

            <LegalField
              label="MANAGE"
              value={form.manageLabel}
              onChange={(value) =>
                updateField("manageLabel", value)
              }
            />
          </div>

          <div className="legal-field legal-policy-field">
            <label>POLICY LINK</label>

            <input
              className="legal-input"
              value={form.policyLink}
              onChange={(e) =>
                updateField("policyLink", e.target.value)
              }
            />
          </div>

          <div className="legal-trail-note">
            Decisions are recorded against the customer record.{" "}
            <button type="button">See the DPDP trail</button>
          </div>
        </div>
      </section>

      {/* BEHIND MANAGE BUTTON */}
      <section className="legal-card manage-card">
        <div className="legal-card-header">
          <h3>Behind the “Manage” button</h3>

          <p>
            The choices a customer gets. Which rows appear is worked out from
            the tracking codes on Google — there is no point offering a choice
            about something the site does not run.
          </p>
        </div>

        <div className="legal-card-body">
          <ConsentCategory
            title="Essential"
            status="ALWAYS ON"
            statusClass="always"
            description="Keeps you signed in, remembers your bag, and lets checkout work. These cannot be turned off."
            rightText="Always on — the site cannot work without these"
          />

          <ConsentCategory
            title="Analytics"
            status="NOT SHOWN"
            description="Lets us see which pieces people browse and where they arrived from, so we know what to stock more of."
            rightText="Hidden, because no Google Analytics code is set"
          />

          <ConsentCategory
            title="Marketing"
            status="NOT SHOWN"
            description="Lets us measure advertising and build audiences for relevant campaigns."
            rightText="Hidden, because no Meta Pixel code is set"
          />

          {showManageDetails && (
            <div className="legal-extra-details">
              <p>
                These categories become available when the corresponding
                tracking configuration is added under Google &amp; sharing.
              </p>
            </div>
          )}

          <button
            type="button"
            className="legal-show-button"
            onClick={() =>
              setShowManageDetails((prev) => !prev)
            }
          >
            {showManageDetails ? "hide" : "show"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

interface LegalFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function LegalField({
  label,
  value,
  onChange,
}: LegalFieldProps) {
  return (
    <div className="legal-field">
      <label>{label}</label>

      <input
        className="legal-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* =========================================================
   CONSENT CATEGORY
========================================================= */

interface ConsentCategoryProps {
  title: string;
  status: string;
  description: string;
  rightText: string;
  statusClass?: string;
}

function ConsentCategory({
  title,
  status,
  description,
  rightText,
  statusClass = "",
}: ConsentCategoryProps) {
  return (
    <div className="consent-category">
      <div className="consent-category-top">
        <div className="consent-name">
          <h4>{title}</h4>

          <span className={`consent-status ${statusClass}`}>
            {status}
          </span>
        </div>

        <span className="consent-right-text">
          {rightText}
        </span>
      </div>

      <div className="consent-description">
        {description}
      </div>
    </div>
  );
}