/**
 * House of Kaira - Cookie Policy Part Header Component
 * Section 5.7 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';

const CookiePartHeader = ({ part }) => {
  const cleanAnchor = part.anchor.replace(/^#/, '');

  // Render title with the specific italic Gold word
  const renderTitle = () => {
    if (!part.italicWord) return part.title;

    const parts = part.title.split(new RegExp(`(${part.italicWord})`, 'i'));
    return parts.map((segment, idx) => {
      if (segment.toLowerCase() === part.italicWord.toLowerCase()) {
        return (
          <em key={`italic-${idx}`} className="cookie-part-title-italic">
            {segment}
          </em>
        );
      }
      return segment;
    });
  };

  return (
    <header className="cookie-part-header" id={cleanAnchor}>
      <span className="cookie-part-range">{part.range}</span>
      <h2 className="cookie-part-title">{renderTitle()}</h2>
      {part.description && (
        <p className="cookie-part-description">{part.description}</p>
      )}
      <div className="cookie-part-rule" aria-hidden="true" />
    </header>
  );
};

export default React.memo(CookiePartHeader);
