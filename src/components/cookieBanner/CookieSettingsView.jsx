/**
 * House of Kaira - Cookie Settings View Component
 * Section 6 & 13.2–13.4 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import React, { useState, useEffect, useRef } from 'react';
import { COOKIE_KINDS } from '../../data/cookieBanner/cookieBannerConfig.js';
import CookieKindItem from './CookieKindItem.jsx';
import { BackArrowIcon, CloseCardIcon } from './CookieBannerIcons.jsx';

const CookieSettingsView = ({
  hasSavedChoice = false,
  savedDateText = '',
  initialChoices = {},
  onBack,
  onClose,
  onSaveChoices,
  onQuickEssential,
  onQuickAllowAll
}) => {
  const [choices, setChoices] = useState({
    functional: Boolean(initialChoices?.functional),
    personalisation: Boolean(initialChoices?.personalisation),
    analytics: Boolean(initialChoices?.analytics),
    marketing: Boolean(initialChoices?.marketing),
  });

  const scrollRef = useRef(null);
  const backBtnRef = useRef(null);

  // Reset scroll to top and set initial focus on Back button when opened (Section 6.1 & 14)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    if (backBtnRef.current) {
      backBtnRef.current.focus();
    }
  }, []);

  const handleToggleKind = (key, value) => {
    setChoices(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveCurrent = (e) => {
    e.preventDefault();
    if (onSaveChoices) {
      onSaveChoices(choices);
    }
  };

  return (
    <div className="cb-settings-view-wrapper">
      {/* 1. Middle Scrolling Area (Top to Lifetimes Line) */}
      <div className="cb-settings-scroll-area" ref={scrollRef}>
        {/* Back Button (Section 6.1) */}
        <div className="cb-back-btn-row">
          <button
            ref={backBtnRef}
            type="button"
            className="cb-back-btn cb-focusable"
            onClick={onBack}
          >
            <BackArrowIcon />
            <span>Back</span>
          </button>
        </div>

        {/* Header Row: Title & Close Button */}
        <div className="cb-header-row">
          <h2 className="cb-card-title">Cookie settings</h2>
          <button
            type="button"
            className="cb-close-btn cb-focusable"
            onClick={onClose}
            aria-label={
              hasSavedChoice
                ? "Close without changing your choices"
                : "Close. Only essential cookies will be used"
            }
            title={
              hasSavedChoice
                ? "Close without changing your choices"
                : "Close. Only essential cookies will be used"
            }
          >
            <CloseCardIcon size={12} />
          </button>
        </div>

        {/* Introduction Text */}
        <p className="cb-body-text">
          Choose which kinds of cookie we may use. You can change this at any time from Cookie settings at the foot of every page.
        </p>

        {/* Saved Date Line (Shown only when visitor has a saved choice) */}
        {hasSavedChoice && savedDateText && (
          <p className="cb-saved-date-line">
            Your current choices were saved on {savedDateText}.
          </p>
        )}

        {/* 2. Kinds List (Section 6.1 & 6.2) */}
        <div className="cb-kinds-list">
          {COOKIE_KINDS.map((kind) => (
            <CookieKindItem
              key={`kind-${kind.key}`}
              kind={kind}
              checked={kind.isAlwaysOn ? true : Boolean(choices[kind.key])}
              onChange={(val) => handleToggleKind(kind.key, val)}
            />
          ))}
        </div>

        {/* 3. Lifetimes Line */}
        <div className="cb-lifetimes-line">
          <span>How long each cookie lasts is listed in our </span>
          <a href="/cookies" className="cb-inline-link cb-focusable">
            Cookie Policy
          </a>
          <span>.</span>
        </div>
      </div>

      {/* 4. Pinned Save Bar (Section 6.1) */}
      <div className="cb-pinned-save-bar">
        <button
          type="button"
          className="cb-btn-save-choices cb-focusable"
          onClick={handleSaveCurrent}
        >
          Save my choices
        </button>

        <div className="cb-quick-links-row">
          <button
            type="button"
            className="cb-quick-link cb-focusable"
            onClick={onQuickEssential}
          >
            Only essential
          </button>
          <span className="cb-quick-link-divider" aria-hidden="true" />
          <button
            type="button"
            className="cb-quick-link cb-focusable"
            onClick={onQuickAllowAll}
          >
            Allow all
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CookieSettingsView);
