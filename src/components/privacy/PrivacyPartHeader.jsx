/**
 * House of Kaira - Privacy Policy Part Header Component
 * Section 5.9 of Build Specification v2.0
 */

import React from 'react';

const PrivacyPartHeader = ({ part }) => {
  const cleanAnchor = part.anchor.replace(/^#/, '');

  // Render title with the specific italic Gold word
  const renderTitle = () => {
    if (!part.italicWord) return part.title;

    const parts = part.title.split(new RegExp(`(${part.italicWord})`, 'i'));
    return parts.map((segment, idx) => {
      if (segment.toLowerCase() === part.italicWord.toLowerCase()) {
        return (
          <em key={`italic-${idx}`} className="privacy-part-title-italic">
            {segment}
          </em>
        );
      }
      return segment;
    });
  };

  return (
    <header className="privacy-part-header" id={cleanAnchor}>
      <span className="privacy-part-range">{part.range}</span>
      <h2 className="privacy-part-title">{renderTitle()}</h2>
      {part.description && (
        <p className="privacy-part-description">{part.description}</p>
      )}
      <div className="privacy-part-rule" aria-hidden="true" />
    </header>
  );
};

export default React.memo(PrivacyPartHeader);
