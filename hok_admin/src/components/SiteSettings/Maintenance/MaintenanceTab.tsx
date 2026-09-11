import React, { useState } from "react";
import "./MaintenanceTab.css";

interface MaintenanceForm {
  maintenanceEnabled: boolean;
  heading: string;
  expectedBack: string;
  body: string;
  allowList: string;

  notFoundHeading: string;
  notFoundBody: string;
  suggestedLinks: string;
}

const initialForm: MaintenanceForm = {
  maintenanceEnabled: false,

  heading: "We’ll be right back",

  expectedBack: "",

  body:
    "House of Kaira is briefly down for scheduled work. Rentals already booked are unaffected.",

  allowList: "Soumya, Priya (Ops)",

  notFoundHeading: "This piece has moved on",

  notFoundBody:
    "The page you were looking for is no longer here — which happens on a platform where pieces find new homes.",

  suggestedLinks: "Rent, Buy Preloved, New Arrivals",
};

export default function MaintenanceTab() {
  const [form, setForm] = useState<MaintenanceForm>(initialForm);

  const updateField = <K extends keyof MaintenanceForm>(
    field: K,
    value: MaintenanceForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="maintenance-tab">
      {/* =================================================
          REGION HEADER
      ================================================= */}

      <div className="maintenance-region-header">
        <div className="maintenance-title-row">
          <div>
            <h2>Site status</h2>

            <p>
              Maintenance mode takes the storefront down for everyone outside
              the allow list. It sits apart from the copy for that reason.
            </p>
          </div>

          <span className="maintenance-meta">
            Priya (Ops) · 2 days ago
          </span>
        </div>
      </div>

      {/* =================================================
          MAINTENANCE MODE
      ================================================= */}

      <section className="maintenance-card">
        <div className="maintenance-card-header">
          <h3>Maintenance mode</h3>
        </div>

        <div className="maintenance-card-body">
          {/* TOGGLE */}

          <label className="maintenance-toggle-row">
            <button
              type="button"
              className={`maintenance-toggle ${
                form.maintenanceEnabled ? "on" : ""
              }`}
              onClick={() =>
                updateField(
                  "maintenanceEnabled",
                  !form.maintenanceEnabled
                )
              }
              aria-pressed={form.maintenanceEnabled}
            >
              <span />
            </button>

            <span>
              Take the storefront down and show a holding page
            </span>
          </label>

          {/* HEADING + EXPECTED BACK */}

          <div className="maintenance-grid-two">
            <MaintenanceField
              label="HEADING"
              value={form.heading}
              onChange={(value) =>
                updateField("heading", value)
              }
            />

            <div className="maintenance-field">
              <label>EXPECTED BACK</label>

              <input
                className="maintenance-input"
                value={form.expectedBack}
                onChange={(e) =>
                  updateField("expectedBack", e.target.value)
                }
              />

              <span className="maintenance-help">
                Blank says nothing rather than guessing.
              </span>
            </div>
          </div>

          {/* BODY */}

          <div className="maintenance-field maintenance-body-field">
            <label>BODY</label>

            <textarea
              rows={3}
              value={form.body}
              onChange={(e) =>
                updateField("body", e.target.value)
              }
            />
          </div>

          {/* ALLOW LIST */}

          <div className="maintenance-field maintenance-allow-field">
            <label>ALLOW LIST</label>

            <input
              className="maintenance-input"
              value={form.allowList}
              onChange={(e) =>
                updateField("allowList", e.target.value)
              }
            />

            <span className="maintenance-help">
              These accounts still see the live site.
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          404 PAGE
      ================================================= */}

      <section className="maintenance-card">
        <div className="maintenance-card-header">
          <h3>404 page</h3>
        </div>

        <div className="maintenance-card-body">
          <MaintenanceField
            label="HEADING"
            value={form.notFoundHeading}
            onChange={(value) =>
              updateField("notFoundHeading", value)
            }
          />

          <div className="maintenance-field maintenance-body-field">
            <label>BODY</label>

            <textarea
              rows={3}
              value={form.notFoundBody}
              onChange={(e) =>
                updateField("notFoundBody", e.target.value)
              }
            />
          </div>

          <div className="maintenance-field maintenance-links-field">
            <label>SUGGESTED LINKS</label>

            <input
              className="maintenance-input"
              value={form.suggestedLinks}
              onChange={(e) =>
                updateField(
                  "suggestedLinks",
                  e.target.value
                )
              }
            />

            <span className="maintenance-help">
              A solid preloved piece leaves a dead URL behind, so this page
              sees more traffic than it should.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

interface MaintenanceFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function MaintenanceField({
  label,
  value,
  onChange,
}: MaintenanceFieldProps) {
  return (
    <div className="maintenance-field">
      <label>{label}</label>

      <input
        className="maintenance-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}