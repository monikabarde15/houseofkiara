/**
 * House of Kiara - Cookie Consent Backend Controller
 * Section 11.1 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

// Single source of truth for supported policy versions
export const ALLOWED_POLICY_VERSIONS = new Set([
  'cookie-v1'
]);

// Allowed consent action methods (canonical list without aliases)
export const ALLOWED_HOW_METHODS = new Set([
  'allowall',
  'only-essential',
  'settings',
  'closed'
]);

/**
 * POST /api/consent
 * Validates consent payload, issues a 1-year server-set cookie (NOT HttpOnly),
 * and returns the consent record JSON.
 */
export const setConsent = async (req, res) => {
  try {
    const { v, functional, personalisation, analytics, marketing, how } = req.body || {};

    // 1. Validate version (single source of truth)
    if (!v || typeof v !== 'string' || !ALLOWED_POLICY_VERSIONS.has(v)) {
      return res.status(400).json({
        success: false,
        message: `Invalid or unsupported consent version: "${v}". Allowed versions: ${Array.from(ALLOWED_POLICY_VERSIONS).join(', ')}`
      });
    }

    // 2. Validate boolean fields
    const isBool = (val) => typeof val === 'boolean';
    if (!isBool(functional) || !isBool(personalisation) || !isBool(analytics) || !isBool(marketing)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consent payload: functional, personalisation, analytics, and marketing must be booleans.'
      });
    }

    // 3. Validate how method (allowall | only-essential | settings | closed)
    if (!how || typeof how !== 'string' || !ALLOWED_HOW_METHODS.has(how)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consent payload: "how" must be one of allowall, only-essential, settings, closed.'
      });
    }

    // 4. Build server-side record { v, t, c, how }
    const record = {
      v,
      t: Date.now(),
      c: {
        functional,
        personalisation,
        analytics,
        marketing
      },
      how
    };

    // 5. Serialize to URL-encoded JSON
    const serializedCookie = encodeURIComponent(JSON.stringify(record));

    // 6. Check if connection is secure (HTTPS or behind reverse proxy)
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';

    // 7. Build Set-Cookie header (Max-Age=31536000, Path=/, SameSite=Lax, Secure on https, NOT HttpOnly)
    let cookieHeader = `hok_consent=${serializedCookie}; Max-Age=31536000; Path=/; SameSite=Lax`;
    if (isSecure) {
      cookieHeader += '; Secure';
    }

    res.setHeader('Set-Cookie', cookieHeader);

    // 8. Return record as JSON
    return res.status(200).json(record);
  } catch (error) {
    console.error('[HOK Backend Consent Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing consent record.'
    });
  }
};
