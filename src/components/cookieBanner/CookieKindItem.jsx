/**
 * House of Kaira - Cookie Kind Item & Accordion Block
 * Section 6.2 & 6.4 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import React, { useState } from 'react';
import CookieSwitch from './CookieSwitch.jsx';
import { ChevronIncludesIcon } from './CookieBannerIcons.jsx';

const CookieKindItem = ({
  kind,
  checked = false,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const listId = `cb-kind-list-${kind.key}`;

  const toggleAccordion = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="cb-kind-item-block">
      {/* 1. Main Kind Row (Name, Description & Switch / Always On) */}
      <div className="cb-kind-main-row">
        <div className="cb-kind-info-col">
          <h3 className="cb-kind-name">{kind.name}</h3>
          <p className="cb-kind-desc">{kind.description}</p>
        </div>

        <div className="cb-kind-control-col">
          {kind.isAlwaysOn ? (
            <span className="cb-always-on-label">Always on</span>
          ) : (
            <CookieSwitch
              id={`cb-switch-${kind.key}`}
              checked={checked}
              onChange={onChange}
              label={kind.name}
            />
          )}
        </div>
      </div>

      {/* 2. What this includes Accordion Trigger */}
      <div className="cb-accordion-trigger-row">
        <button
          type="button"
          className="cb-accordion-btn cb-focusable"
          onClick={toggleAccordion}
          aria-expanded={isOpen}
          aria-controls={listId}
        >
          <span className="cb-accordion-text">What this includes</span>
          <span className="cb-accordion-count">{kind.countText}</span>
          <ChevronIncludesIcon isOpen={isOpen} size={9} />
        </button>
      </div>

      {/* 3. Cookie List Panel (Section 6.4) */}
      {isOpen && (
        <div className="cb-cookie-list-panel" id={listId}>
          {kind.cookies && kind.cookies.length > 0 ? (
            <div className="cb-cookies-table">
              {kind.cookies.map((cookie, idx) => (
                <div key={`cookie-${kind.key}-${idx}`} className="cb-cookie-row">
                  <div className="cb-cookie-head-row">
                    <span className="cb-cookie-name">{cookie.name}</span>
                    <span className="cb-cookie-who">{cookie.who}</span>
                  </div>
                  <p className="cb-cookie-purpose">{cookie.purpose}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="cb-cookie-empty-text">{kind.emptyText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CookieKindItem);
