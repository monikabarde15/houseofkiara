// src/services/legalApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent redundant fetches
let cachedLegal = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultLegalConfig = {
  registeredEntity: {
    registeredName: "House of Kaira Retail Pvt Ltd",
    gstin: "23AABCH1234K1ZV",
    cin: "U52609MP2025PTC071482",
    registeredAddress: "14 Vijay Nagar, Scheme 54, Indore, Madhya Pradesh 452010",
  },
  cookieConsent: {
    showBanner: false,
    heading: "We use cookies",
    position: "Bottom bar",
    body: "We use cookies to run the site, remember your bag, and understand what people browse. You can accept all, or take only what the site needs to work.",
    acceptLabel: "Accept all",
    rejectLabel: "Only essential",
    manageLabel: "Manage",
    policyLink: "/cookies",
    categories: {
      essential:
        "Keeps you signed in, remembers your bag, and lets checkout work. These cannot be turned off.",
      analytics:
        "Lets us see which pieces people browse and where they arrived from, so we know what to stock more of.",
      marketing:
        "Lets us show House of Kaira pieces on Instagram and Facebook to people who have visited before.",
    },
  },
};

/**
 * Fetches the active legal configuration from the public API.
 */
export async function getLegalSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedLegal && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedLegal;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/legal/public`);
    if (res.ok) {
      const json = await res.json();
      const rawData = (json && (json.data || json.legal)) || {};

      cachedLegal = {
        registeredEntity: {
          registeredName:
            rawData.registeredEntity?.registeredName ||
            defaultLegalConfig.registeredEntity.registeredName,
          gstin:
            rawData.registeredEntity?.gstin ||
            defaultLegalConfig.registeredEntity.gstin,
          cin:
            rawData.registeredEntity?.cin ||
            defaultLegalConfig.registeredEntity.cin,
          registeredAddress:
            rawData.registeredEntity?.registeredAddress ||
            defaultLegalConfig.registeredEntity.registeredAddress,
        },
        cookieConsent: {
          showBanner:
            rawData.cookieConsent?.showBanner !== undefined
              ? !!rawData.cookieConsent.showBanner
              : defaultLegalConfig.cookieConsent.showBanner,
          heading:
            rawData.cookieConsent?.heading ||
            defaultLegalConfig.cookieConsent.heading,
          position:
            rawData.cookieConsent?.position ||
            defaultLegalConfig.cookieConsent.position,
          body:
            rawData.cookieConsent?.body || defaultLegalConfig.cookieConsent.body,
          acceptLabel:
            rawData.cookieConsent?.acceptLabel ||
            defaultLegalConfig.cookieConsent.acceptLabel,
          rejectLabel:
            rawData.cookieConsent?.rejectLabel ||
            defaultLegalConfig.cookieConsent.rejectLabel,
          manageLabel:
            rawData.cookieConsent?.manageLabel ||
            defaultLegalConfig.cookieConsent.manageLabel,
          policyLink:
            rawData.cookieConsent?.policyLink ||
            defaultLegalConfig.cookieConsent.policyLink,
          categories: {
            essential:
              rawData.cookieConsent?.categories?.essential ||
              defaultLegalConfig.cookieConsent.categories.essential,
            analytics:
              rawData.cookieConsent?.categories?.analytics ||
              defaultLegalConfig.cookieConsent.categories.analytics,
            marketing:
              rawData.cookieConsent?.categories?.marketing ||
              defaultLegalConfig.cookieConsent.categories.marketing,
          },
        },
      };

      lastFetchTime = now;
      return cachedLegal;
    }
  } catch (err) {
    console.warn("Could not fetch public Legal settings, using fallback:", err);
  }

  return defaultLegalConfig;
}
