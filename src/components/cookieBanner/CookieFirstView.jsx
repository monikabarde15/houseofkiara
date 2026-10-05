/**
 * House of Kaira - Cookie Banner First View Component
 * Section 5 & 13.1 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import React from 'react';
import { CloseCardIcon } from './CookieBannerIcons.jsx';

const CookieFirstView = ({
  onClose,
  onChooseEssential,
  onChooseAllowAll,
  onOpenSettings
}) => {
  return (
    <div className="cb-first-view-content">
      {/* 1. Header Row: Title & Close Button */}
      <div className="cb-header-row">
        <h2 className="cb-card-title">A note on cookies</h2>
        <button
          type="button"
          className="cb-close-btn cb-focusable"
          onClick={onClose}
          aria-label="Close. Only essential cookies will be used"
          title="Close. Only essential cookies will be used"
        >
          <CloseCardIcon size={12} />
        </button>
      </div>

      {/* 2. Body Text with Policy Links */}
      <p className="cb-body-text">
        A few cookies keep our website working, such as the ones that remember your bag. The rest, for Instagram posts, personalisation, analytics and marketing, stay off unless you allow them. Read our{' '}
        <a href="/cookies" className="cb-inline-link cb-focusable">
          Cookie Policy
        </a>{' '}
        and{' '}
        <a href="/privacy" className="cb-inline-link cb-focusable">
          Privacy Policy
        </a>
        .
      </p>

      {/* 3. Equal Outlined Button Pair (Section 2: Identical size, style & prominence) */}
      <div className="cb-button-pair">
        <button
          type="button"
          className="cb-btn-outline cb-focusable"
          onClick={onChooseEssential}
        >
          Only essential
        </button>
        <button
          type="button"
          className="cb-btn-outline cb-focusable"
          onClick={onChooseAllowAll}
        >
          Allow all
        </button>
      </div>

      {/* 4. Cookie Settings Link */}
      <div className="cb-settings-link-wrapper">
        <button
          type="button"
          className="cb-settings-link cb-focusable"
          onClick={onOpenSettings}
        >
          Cookie settings
        </button>
      </div>
    </div>
  );
};

export default React.memo(CookieFirstView);
