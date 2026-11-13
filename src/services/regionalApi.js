// src/services/regionalApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent redundant fetches
let cachedRegional = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultRegionalConfig = {
  timezone: "Asia/Kolkata (IST)",
  currency: "INR ₹",
  currencySymbol: "₹",
  dateFormat: "DD MMM YYYY",
  numberFormat: "Indian — lakh and crore",
};

/**
 * Returns clean currency symbol from regional configuration
 */
export function getCurrencySymbol(regionalConfig = cachedRegional || defaultRegionalConfig) {
  const curr = regionalConfig?.currency || defaultRegionalConfig.currency;
  if (curr.includes("INR") || curr.includes("₹")) return "₹";
  if (curr.includes("USD") || curr.includes("$")) return "$";
  if (curr.includes("AED") || curr.includes("د.إ")) return "AED ";
  if (curr.includes("GBP") || curr.includes("£")) return "£";
  if (curr.includes("EUR") || curr.includes("€")) return "€";
  return regionalConfig?.currencySymbol || "₹";
}

/**
 * Formats a numeric price using the regional number grouping
 */
export function formatPriceWithConfig(amount, regionalConfig = cachedRegional || defaultRegionalConfig) {
  const num = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  const isIndian =
    !regionalConfig?.numberFormat ||
    regionalConfig.numberFormat.includes("Indian");
  const locale = isIndian ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(num);
}

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Formats a Date object or timestamp string according to regional dateFormat
 */
export function formatRegionalDate(dateInput, regionalConfig = cachedRegional || defaultRegionalConfig) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate();
  const dayPad = day < 10 ? `0${day}` : `${day}`;
  const monthIdx = d.getMonth();
  const monthNum = monthIdx + 1;
  const monthPad = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
  const monthShort = MONTH_NAMES_SHORT[monthIdx];
  const year = d.getFullYear();

  const fmt = regionalConfig?.dateFormat || defaultRegionalConfig.dateFormat;
  switch (fmt) {
    case "DD/MM/YYYY":
      return `${dayPad}/${monthPad}/${year}`;
    case "MMM DD, YYYY":
      return `${monthShort} ${dayPad}, ${year}`;
    case "YYYY-MM-DD":
      return `${year}-${monthPad}-${dayPad}`;
    case "DD MMM YYYY":
    default:
      return `${day} ${monthShort} ${year}`;
  }
}

/**
 * Fetches the active Regional configuration from the public API.
 */
export async function getRegionalSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedRegional && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedRegional;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/regional/public`);
    if (res.ok) {
      const json = await res.json();
      const rawData = (json && (json.data || json.regional)) || {};

      cachedRegional = {
        timezone: rawData.timezone || defaultRegionalConfig.timezone,
        currency: rawData.currency || defaultRegionalConfig.currency,
        currencySymbol:
          rawData.currencySymbol ||
          getCurrencySymbol(rawData) ||
          defaultRegionalConfig.currencySymbol,
        dateFormat: rawData.dateFormat || defaultRegionalConfig.dateFormat,
        numberFormat: rawData.numberFormat || defaultRegionalConfig.numberFormat,
      };

      lastFetchTime = now;
      return cachedRegional;
    }
  } catch (err) {
    console.warn("Could not fetch public Regional settings, using fallback:", err);
  }

  return defaultRegionalConfig;
}
