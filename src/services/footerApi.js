// src/services/footerApi.js
import { desktopFooterColumns, desktopPolicyLinks } from "../components/Footer/footerData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent refetching on every render
let cachedFooter = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultFooterConfig = {
  blurbUnderWordmark: "Circular Luxury Fashion",
  copyrightLine: "© 2026 House of Kaira. All rights reserved. Indore, India.",
  trustBadges: "Secure Payments, Circular Fashion",
  paymentMethods: {
    upi: true,
    visa: true,
    mastercard: true,
    rupay: true,
    netbanking: true,
    paytm: false,
    amex: false,
    nocost_emi: false,
  },
  newsletter: {
    show: false,
    heading: "Stay in the loop",
    buttonLabel: "Subscribe",
    body: "Get early access to drops and exclusive promotions.",
    consentLine: "By subscribing you agree to our Privacy Policy.",
  },
  linkColumns: desktopFooterColumns.map((col, cIdx) => ({
    id: `col-${cIdx + 1}`,
    heading: col.title,
    links: col.links.map((lnk, lIdx) => ({
      id: `fl-${cIdx + 1}-${lIdx + 1}`,
      label: lnk.label,
      path: lnk.path,
    })),
  })),
  legalRow: desktopPolicyLinks.map((p, idx) => ({
    id: `leg-${idx + 1}`,
    label: p.label,
    path: p.path || "",
    isButton: !!p.isButton,
    action: p.action || "",
  })),
};

/**
 * Fetches the active footer configuration from the public API.
 */
export async function getFooterSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedFooter && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedFooter;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/footer/public`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        cachedFooter = {
          blurbUnderWordmark:
            json.data.blurbUnderWordmark || defaultFooterConfig.blurbUnderWordmark,
          copyrightLine:
            json.data.copyrightLine || defaultFooterConfig.copyrightLine,
          trustBadges:
            json.data.trustBadges || defaultFooterConfig.trustBadges,
          paymentMethods:
            json.data.paymentMethods || defaultFooterConfig.paymentMethods,
          newsletter:
            json.data.newsletter || defaultFooterConfig.newsletter,
          linkColumns:
            Array.isArray(json.data.linkColumns) && json.data.linkColumns.length > 0
              ? json.data.linkColumns
              : defaultFooterConfig.linkColumns,
          legalRow:
            Array.isArray(json.data.legalRow) && json.data.legalRow.length > 0
              ? json.data.legalRow
              : defaultFooterConfig.legalRow,
        };
        lastFetchTime = now;
        return cachedFooter;
      }
    }
  } catch (err) {
    console.warn("Could not fetch public footer settings, using fallback:", err);
  }

  return defaultFooterConfig;
}
