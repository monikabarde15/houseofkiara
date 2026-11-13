/**
 * House of Kaira: Maintenance Page (503)
 * Section 8 & Appendix A, B of System Pages Specification v1.0
 */

import React, { useState, useEffect } from "react";
import logo from "../assets/logo/logo.png";
import { SITE_SETTINGS } from "../data/system/systemTokens";
import { formatMaintenanceTime } from "../utils/system/timeFormatter";
import { getMaintenanceSettings } from "../services/maintenanceApi";
import { usePageContent } from "../hooks/usePageContent";
import "../styles/system/system-variables.css";
import "../styles/system/system-maintenance.css";

export default function MaintenancePage({
  initialState = "planned",
  backByTime = "2026-10-17T18:00:00+05:30",
  settings: propSettings,
}) {
  const [activeState, setActiveState] = useState(initialState);
  const [cmsSettings, setCmsSettings] = useState(propSettings || null);
  const { getVal } = usePageContent("/maintenance");

  useEffect(() => {
    if (propSettings) {
      setCmsSettings(propSettings);
    } else {
      let isMounted = true;
      getMaintenanceSettings().then((cfg) => {
        if (isMounted && cfg?.maintenance) {
          setCmsSettings(cfg.maintenance);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [propSettings]);

  const customHeading = cmsSettings?.heading;
  const customBody = cmsSettings?.body;
  const customExpected = cmsSettings?.expectedBack;

  const eyebrowText = getVal("maint_eyebrow", "A short pause");
  const headingPrefix = getVal("maint_heading_prefix", "We’ll be back");
  const headingItalic = getVal("maint_heading_italic", "very shortly");

  // Set page title and noindex
  useEffect(() => {
    const titleStr = customHeading || `${headingPrefix} ${headingItalic}`;
    document.title = `${titleStr} · House of Kaira`;

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = "noindex";

    return () => {
      if (robotsMeta) {
        robotsMeta.content = "index, follow";
      }
    };
  }, [customHeading, headingPrefix, headingItalic]);

  // Section 8.7: Auto-refresh polling every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(window.location.href, { method: "HEAD", cache: "no-store" });
        if (res.status === 200 && !res.headers.get("X-HOK-Maintenance")) {
          window.location.reload();
        }
      } catch (e) {
        // App is still unreachable, continue waiting
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Copy definitions for the 3 states (Section 8.5)
  const isUnexpected = activeState === "unexpected";
  const isRunningLate = activeState === "late";

  const defaultLead = isUnexpected
    ? "House of Kaira is taking a short pause while we put something right. Everything will be exactly where you left it."
    : "We’re making a few refinements to House of Kaira. Everything will be exactly where you left it, from your wishlist to your bookings.";

  const leadText = customBody || getVal("maint_lead", defaultLead);

  const defaultStatus = customExpected
    ? `Expected back by ${customExpected}`
    : isUnexpected
    ? "We’re on it, and will be back as soon as we can."
    : isRunningLate
    ? "Taking a little longer than planned. Thank you for waiting with us."
    : formatMaintenanceTime(backByTime) || "Expected back by 6:00 PM IST today";

  const statusText = customExpected
    ? `Expected back by ${customExpected}`
    : getVal("maint_status_text", defaultStatus);

  const dotClass = isRunningLate ? "gold" : "sage";

  const whatsAppUrl = `https://wa.me/${SITE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(
    "Hello House of Kaira, I tried to visit the website while it was being updated. Could you help me with something?"
  )}`;

  const celebratingHeading = getVal("maint_celebrating_heading", "Celebrating");
  const celebratingItalic = getVal("maint_celebrating_italic", "soon?");
  const celebratingText = getVal(
    "maint_celebrating_text",
    "Your bookings, orders and payouts are safe. Deliveries, pickups and returns carry on as planned, and our team is on WhatsApp if you need anything."
  );
  const whatsappCta = getVal("maint_whatsapp_cta", "Message us on WhatsApp");
  const instagramCta = getVal("maint_instagram_cta", "Our latest pieces on Instagram");
  const refreshNotice = getVal(
    "maint_refresh_notice",
    "This page will refresh by itself the moment we’re back."
  );
  const copyrightLine = getVal(
    "maint_copyright_line",
    "© 2026 House of Kaira · Indore, India"
  );

  return (
    <main className="sys-maint-page" id="maintenance-page">
      {/* Team / Admin Preview Switcher */}
      <div className="sys-maint-preview-bar" role="toolbar" aria-label="Maintenance state preview">
        <button
          type="button"
          className={`sys-maint-preview-btn ${activeState === "planned" ? "active" : ""}`}
          onClick={() => setActiveState("planned")}
        >
          Planned State
        </button>
        <button
          type="button"
          className={`sys-maint-preview-btn ${activeState === "late" ? "active" : ""}`}
          onClick={() => setActiveState("late")}
        >
          Running Late State
        </button>
        <button
          type="button"
          className={`sys-maint-preview-btn ${activeState === "unexpected" ? "active" : ""}`}
          onClick={() => setActiveState("unexpected")}
        >
          Unexpected State
        </button>
      </div>

      {/* Brand Header M2, M3 */}
      <div className="sys-maint-brand">
        <img
          src={logo}
          alt="House of Kaira"
          className="sys-maint-logo"
        />
        <span className="sys-maint-wordmark">House of Kaira</span>
      </div>

      {/* Maintenance Card M4 */}
      <article className="sys-maint-card">
        <div className="sys-maint-keyline" aria-hidden="true" />
        <div className="sys-maint-diamond" aria-hidden="true" />

        {/* Eyebrow */}
        <div className="sys-eyebrow" aria-hidden="true">
          <span className="sys-eyebrow-rule" />
          <span className="sys-eyebrow-text">{eyebrowText}</span>
          <span className="sys-eyebrow-rule" />
        </div>

        {/* Heading */}
        <h1 className="sys-maint-h1">
          {customHeading ? (
            customHeading
          ) : (
            <>
              {headingPrefix} <em>{headingItalic}</em>
            </>
          )}
        </h1>

        {/* Lead Line */}
        <p className="sys-maint-lead">{leadText}</p>

        {/* Status Line */}
        <div className="sys-maint-status-box" role="status" aria-live="polite">
          <span className={`sys-maint-dot ${dotClass}`} aria-hidden="true" />
          <span>{statusText}</span>
        </div>

        {/* Rule */}
        <div className="sys-maint-rule" aria-hidden="true" />

        {/* Celebrating Soon */}
        <h2 className="sys-maint-care-title">
          {celebratingHeading} <em>{celebratingItalic}</em>
        </h2>

        <p className="sys-maint-care-text">{celebratingText}</p>

        {/* WhatsApp & Instagram Actions */}
        <div className="sys-maint-actions">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sys-maint-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.531 1.77.813 2.796.814 3.183 0 5.77-2.586 5.771-5.766.001-3.181-2.585-5.8-5.771-5.8zm3.376 8.21c-.144.405-.837.774-1.17.824-.312.045-.694.079-2.127-.514-1.834-.759-3.003-2.617-3.094-2.738-.09-.121-.745-.989-.745-1.887 0-.898.469-1.339.636-1.523.167-.184.364-.23.485-.23.122 0 .243.002.349.007.112.006.262-.042.41.314.152.364.517 1.26.562 1.352.045.092.076.199.015.321-.06.121-.091.198-.182.304-.09.106-.191.237-.273.318-.091.091-.186.19-.08.372.106.182.472.778 1.013 1.259.697.621 1.285.814 1.468.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.061.5 1.243.591.182.091.303.136.349.213.045.076.045.438-.099.843z" />
            </svg>
            <span>{whatsappCta}</span>
          </a>

          <a
            href={SITE_SETTINGS.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="sys-maint-insta-link"
          >
            {instagramCta}
          </a>
        </div>

        {/* Reply Hours */}
        <div className="sys-maint-hours">
          We reply {SITE_SETTINGS.support_hours}.
        </div>
      </article>

      {/* Refresh Line */}
      <div className="sys-maint-refresh">{refreshNotice}</div>

      {/* Footer Line */}
      <footer className="sys-maint-foot">{copyrightLine}</footer>
    </main>
  );
}
