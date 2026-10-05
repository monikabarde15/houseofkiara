/**
 * House of Kaira - Cookie Saved Note Confirmation Component
 * Section 7 & 13.5 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import React, { useEffect, useRef, useState } from 'react';
import { COOKIE_BANNER_CONFIG } from '../../data/cookieBanner/cookieBannerConfig.js';
import { SavedNoteTickIcon, SavedNoteCloseIcon } from './CookieBannerIcons.jsx';

const CookieSavedNote = ({
  message,
  onDismiss
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef(null);
  const remainingTimeRef = useRef(COOKIE_BANNER_CONFIG.noteDurationMs);
  const startTimeRef = useRef(Date.now());
  const isHoveredRef = useRef(false);

  const startDismissTimer = (duration) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startTimeRef.current = Date.now();
    remainingTimeRef.current = duration;

    timerRef.current = setTimeout(() => {
      triggerLeave();
    }, duration);
  };

  const triggerLeave = () => {
    setIsLeaving(true);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 400); // 400ms exit animation
  };

  useEffect(() => {
    startDismissTimer(COOKIE_BANNER_CONFIG.noteDurationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Section 4.5 & 7: Pointer rests on note -> pause timer. Pointer leaves -> close 1,800ms later.
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    startDismissTimer(COOKIE_BANNER_CONFIG.notePauseResumeDelayMs);
  };

  const handleManualClose = (e) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    triggerLeave();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`cb-saved-note-region ${isLeaving ? 'cb-note-leave' : 'cb-note-arrive'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cb-saved-note-surface">
        {/* Gold Tick Icon (16x16px) */}
        <div className="cb-saved-note-icon-col">
          <SavedNoteTickIcon size={16} />
        </div>

        {/* Message Text */}
        <p className="cb-saved-note-text">
          {message}
        </p>

        {/* Dismiss Close Button (28x28px) */}
        <button
          type="button"
          className="cb-saved-note-close-btn cb-focusable"
          onClick={handleManualClose}
          aria-label="Dismiss"
          title="Dismiss"
        >
          <SavedNoteCloseIcon size={10} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(CookieSavedNote);
