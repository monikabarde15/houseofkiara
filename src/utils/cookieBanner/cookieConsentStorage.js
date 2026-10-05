/**
 * House of Kaira - Cookie Consent Storage Engine
 * Section 11.1, 11.2 & 11.4 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import { COOKIE_BANNER_CONFIG } from '../../data/cookieBanner/cookieBannerConfig.js';

/**
 * Reads a raw cookie by name from document.cookie
 */
export const getRawCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? match[1] : null;
};

/**
 * Sets a cookie with specified options
 */
export const setRawCookie = (name, value, maxAgeSeconds = COOKIE_BANNER_CONFIG.maxAgeSeconds) => {
  if (typeof document === 'undefined') return;

  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  let cookieString = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  if (isSecure) {
    cookieString += '; Secure';
  }
  document.cookie = cookieString;
};

/**
 * Deletes a cookie across various possible path and domain variations
 */
export const deleteRawCookie = (name) => {
  if (typeof document === 'undefined') return;

  const host = window.location.hostname;
  const hostParts = host.split('.');
  const rootDomain = hostParts.length >= 2 ? '.' + hostParts.slice(-2).join('.') : host;

  const variations = [
    `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `${name}=; path=/; domain=${host}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `${name}=; path=/; domain=${rootDomain}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `${name}=; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  ];

  variations.forEach(cookieStr => {
    document.cookie = cookieStr;
  });
};

/**
 * Retrieves and validates the consent record from hok_consent
 * Returns the valid record object or null if expired, corrupted, or version mismatch
 */
export const getStoredConsent = () => {
  try {
    const raw = getRawCookie(COOKIE_BANNER_CONFIG.cookieName);
    if (!raw) return null;

    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);

    // 1. Check version match (Section 11.2)
    if (!parsed || parsed.v !== COOKIE_BANNER_CONFIG.version) {
      return null;
    }

    // 2. Check 12-month lifetime (Section 11.2)
    if (!parsed.t || typeof parsed.t !== 'number') {
      return null;
    }
    const ageMs = Date.now() - parsed.t;
    if (ageMs < 0 || ageMs > COOKIE_BANNER_CONFIG.maxAgeMs) {
      return null;
    }

    // 3. Validate choices object
    if (!parsed.c || typeof parsed.c !== 'object') {
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn('[HOK Consent] Error parsing stored consent record:', err);
    return null;
  }
};

/**
 * Saves a consent record into the hok_consent cookie
 * Section 11.1 & 11.2 of Build Specification v1.0
 * 
 * 1. Writes to document.cookie immediately so client state and script loading never wait on network.
 * 2. Asynchronously POSTs to /api/consent with credentials: "same-origin" and keepalive: true
 *    to establish a 1-year first-party HTTP response Set-Cookie (bypassing Safari ITP 7-day client-side capping).
 * 3. Falls back silently to the client-side document.cookie write if the network request fails,
 *    ensuring the banner never reappears due to connectivity issues.
 * 
 * @param {Object} choices - { functional: bool, personalisation: bool, analytics: bool, marketing: bool }
 * @param {string} howMethod - "allowall" | "only-essential" | "settings" | "closed"
 */
export const saveConsentRecord = (choices, howMethod = "settings") => {
  const record = {
    v: COOKIE_BANNER_CONFIG.version,
    t: Date.now(),
    c: {
      functional: Boolean(choices?.functional),
      personalisation: Boolean(choices?.personalisation),
      analytics: Boolean(choices?.analytics),
      marketing: Boolean(choices?.marketing),
    },
    how: howMethod
  };

  // 1. Apply immediately to document.cookie (zero latency for UI and scripts)
  const serialized = encodeURIComponent(JSON.stringify(record));
  setRawCookie(COOKIE_BANNER_CONFIG.cookieName, serialized, COOKIE_BANNER_CONFIG.maxAgeSeconds);

  // If analytics was turned off, clean up _ga cookies (Section 11.4)
  if (!record.c.analytics) {
    cleanAnalyticsCookies();
  }

  // 2. Non-blocking POST to /api/consent for server-set cookie (Safari ITP 1-year retention)
  if (typeof fetch === 'function') {
    fetch('/api/consent', {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        v: record.v,
        functional: record.c.functional,
        personalisation: record.c.personalisation,
        analytics: record.c.analytics,
        marketing: record.c.marketing,
        how: howMethod
      })
    })
      .then((res) => {
        if (!res.ok) {
          console.warn(`[HOK Consent] /api/consent request failed with HTTP ${res.status} (${res.statusText})`);
          setRawCookie(COOKIE_BANNER_CONFIG.cookieName, serialized, COOKIE_BANNER_CONFIG.maxAgeSeconds);
        }
      })
      .catch((err) => {
        // Fallback: Ensure client cookie is preserved so banner never reappears
        console.warn('[HOK Consent] /api/consent network error, retained client-side cookie fallback:', err);
        setRawCookie(COOKIE_BANNER_CONFIG.cookieName, serialized, COOKIE_BANNER_CONFIG.maxAgeSeconds);
      });
  }

  return record;
};

/**
 * Deletes all Google Analytics cookies (_ga and _ga_*) on revocation (Section 11.4)
 */
export const cleanAnalyticsCookies = () => {
  if (typeof document === 'undefined') return;

  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_')) {
      deleteRawCookie(name);
    }
  });
};

export default {
  getRawCookie,
  setRawCookie,
  deleteRawCookie,
  getStoredConsent,
  saveConsentRecord,
  cleanAnalyticsCookies
};
