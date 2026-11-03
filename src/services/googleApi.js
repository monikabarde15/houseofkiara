// src/services/googleApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent redundant fetches
let cachedGoogle = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultGoogleConfig = {
  headline: "House of Kaira — Rent, Buy & List Luxury Indian Occasion Wear",
  description:
    "Discover India’s most curated platform for luxury occasion wear — rent, buy preloved, or list your own Sabyasachi, Manish Malhotra, and more.",
  allowSearchEngines: true,
  tracking: {
    googleAnalytics: "",
    metaPixel: "",
    googleSearchConsole: "",
  },
  devSettings: {
    titleTemplate: "{{page_title}} {{sep}} {{site_name}}",
    separator: "—",
    canonicalAddress: "https://houseofkaira.com",
    publishSitemap: true,
  },
};

/**
 * Formats a page title according to titleTemplate and separator.
 */
export function formatPageTitle(
  pageTitle = "",
  siteName = "House of Kaira",
  devSettings = defaultGoogleConfig.devSettings
) {
  const sep = devSettings?.separator || "—";
  const template = devSettings?.titleTemplate || "{{page_title}} {{sep}} {{site_name}}";

  if (!pageTitle || pageTitle.trim() === "" || pageTitle === siteName) {
    return siteName;
  }

  return template
    .replace(/\{\{page_title\}\}/g, pageTitle.trim())
    .replace(/\{\{sep\}\}/g, sep)
    .replace(/\{\{site_name\}\}/g, siteName);
}

/**
 * Injects Google Analytics script safely if a valid Measurement ID is configured.
 * Avoids duplicate script injection and does not run if ID is empty.
 */
function injectGoogleAnalytics(gaId) {
  if (typeof document === "undefined" || !gaId) return;

  const cleanId = String(gaId).trim();
  const isValidFormat = /^(G-[A-Za-z0-9]+|UA-\d+-\d+)$/.test(cleanId);
  if (!isValidFormat) return;

  // Prevent multiple injections
  if (
    window.__hok_ga_id === cleanId ||
    document.getElementById("hok-google-analytics-script")
  ) {
    return;
  }

  window.__hok_ga_id = cleanId;

  // 1. Create external gtag script
  const script = document.createElement("script");
  script.id = "hok-google-analytics-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
  document.head.appendChild(script);

  // 2. Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", cleanId);
}

/**
 * Injects Meta Pixel script safely if a valid numeric Pixel ID is configured.
 * Avoids duplicate injection and validates format.
 */
function injectMetaPixel(pixelId) {
  if (typeof document === "undefined" || !pixelId) return;

  const cleanId = String(pixelId).trim();
  if (!/^\d+$/.test(cleanId)) return;

  if (
    window.__hok_pixel_id === cleanId ||
    document.getElementById("hok-meta-pixel-script")
  ) {
    return;
  }

  window.__hok_pixel_id = cleanId;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.id = "hok-meta-pixel-script";
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  /* eslint-enable */

  if (window.fbq) {
    window.fbq("init", cleanId);
    window.fbq("track", "PageView");
  }
}

/**
 * Synchronizes document SEO meta tags (title, description, robots, canonical, GSC).
 */
export function applyGoogleToDocument(google, context = {}) {
  if (typeof document === "undefined" || !google) return;

  // 1. Meta Description
  if (google.description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = google.description;
  }

  // 2. Robots Indexing Tag
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement("meta");
    robotsMeta.name = "robots";
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.content = google.allowSearchEngines ? "index, follow" : "noindex, nofollow";

  // 3. Google Search Console Verification Tag
  const gscToken = google.tracking?.googleSearchConsole?.trim();
  let gscMeta = document.querySelector('meta[name="google-site-verification"]');
  if (gscToken) {
    if (!gscMeta) {
      gscMeta = document.createElement("meta");
      gscMeta.name = "google-site-verification";
      document.head.appendChild(gscMeta);
    }
    gscMeta.content = gscToken;
  } else if (gscMeta) {
    gscMeta.remove();
  }

  // 4. Canonical Address Tag
  const canonicalAddr = google.devSettings?.canonicalAddress?.trim();
  if (canonicalAddr) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalAddr;
  }

  // 5. Tracking Integrations
  if (google.tracking?.googleAnalytics) {
    injectGoogleAnalytics(google.tracking.googleAnalytics);
  }
  if (google.tracking?.metaPixel) {
    injectMetaPixel(google.tracking.metaPixel);
  }
}

/**
 * Fetches the active Google configuration from the public API.
 */
export async function getGoogleSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedGoogle && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedGoogle;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/google/public`);
    if (res.ok) {
      const json = await res.json();
      const rawData = (json && (json.data || json.google)) || {};

      cachedGoogle = {
        headline: rawData.headline || defaultGoogleConfig.headline,
        description: rawData.description || defaultGoogleConfig.description,
        allowSearchEngines:
          rawData.allowSearchEngines !== undefined
            ? !!rawData.allowSearchEngines
            : defaultGoogleConfig.allowSearchEngines,
        tracking: {
          googleAnalytics:
            rawData.tracking?.googleAnalytics ||
            defaultGoogleConfig.tracking.googleAnalytics,
          metaPixel:
            rawData.tracking?.metaPixel ||
            defaultGoogleConfig.tracking.metaPixel,
          googleSearchConsole:
            rawData.tracking?.googleSearchConsole ||
            defaultGoogleConfig.tracking.googleSearchConsole,
        },
        devSettings: {
          titleTemplate:
            rawData.devSettings?.titleTemplate ||
            defaultGoogleConfig.devSettings.titleTemplate,
          separator:
            rawData.devSettings?.separator ||
            defaultGoogleConfig.devSettings.separator,
          canonicalAddress:
            rawData.devSettings?.canonicalAddress ||
            defaultGoogleConfig.devSettings.canonicalAddress,
          publishSitemap:
            rawData.devSettings?.publishSitemap !== undefined
              ? !!rawData.devSettings.publishSitemap
              : defaultGoogleConfig.devSettings.publishSitemap,
        },
      };

      lastFetchTime = now;
      applyGoogleToDocument(cachedGoogle);
      return cachedGoogle;
    }
  } catch (err) {
    console.warn("Could not fetch public Google settings, using fallback:", err);
  }

  applyGoogleToDocument(defaultGoogleConfig);
  return defaultGoogleConfig;
}
