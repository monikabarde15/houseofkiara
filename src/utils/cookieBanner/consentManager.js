/**
 * House of Kaira - Global Cookie Consent Manager & Hook
 * Section 11.5 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import { getStoredConsent, saveConsentRecord } from './cookieConsentStorage.js';

const settledCallbacks = new Set();

/**
 * Global Consent API Object (Section 11.5)
 */
export const HOK_CONSENT = {
  /**
   * Returns the saved consent record, or null if there is no valid choice
   */
  get: () => {
    return getStoredConsent();
  },

  /**
   * Returns true or false for functional, personalisation, analytics, or marketing
   */
  allowed: (kind) => {
    if (kind === 'strictly') return true;
    const record = getStoredConsent();
    if (!record || !record.c) return false;
    return Boolean(record.c[kind]);
  },

  /**
   * Runs the callback once a choice exists:
   * immediately for returning visitors, otherwise straight after the visitor chooses
   */
  onSettled: (callback) => {
    if (typeof callback !== 'function') return;

    const record = getStoredConsent();
    if (record) {
      try {
        callback(record);
      } catch (err) {
        console.error('[HOK_CONSENT.onSettled] Error executing callback:', err);
      }
      return;
    }

    settledCallbacks.add(callback);
  },

  /**
   * Opens Cookie settings, exactly as the footer link does
   */
  open: () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('hok_open_cookie_settings'));
  }
};

/**
 * Notifies all onSettled listeners that a consent choice has been made
 */
export const notifyConsentSettled = (record) => {
  settledCallbacks.forEach((cb) => {
    try {
      cb(record);
    } catch (err) {
      console.error('[notifyConsentSettled] Error executing callback:', err);
    }
  });
  settledCallbacks.clear();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hok_consent_updated', { detail: record }));
  }
};

/**
 * Mounts the global window.HOK_CONSENT object
 */
if (typeof window !== 'undefined') {
  window.HOK_CONSENT = HOK_CONSENT;
}

export default HOK_CONSENT;
