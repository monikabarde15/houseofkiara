import React from 'react';

/**
 * Terms & Conditions Part Header
 * Section 5.8 of Build Specification v3.0
 */
const PartHeader = ({ part }) => {
  const { partNumber, title, italicWord, anchor, description, startClause, endClause } = part;

  const rangeLabel = startClause === endClause
    ? `CLAUSE ${startClause}`
    : `CLAUSES ${startClause} TO ${endClause}`;

  // Render title with the specific italic word in gold
  const renderFormattedTitle = () => {
    if (!italicWord || !title.toLowerCase().includes(italicWord.toLowerCase())) {
      return title;
    }

    const regex = new RegExp(`(${italicWord})`, 'gi');
    const parts = title.split(regex);

    return parts.map((segment, idx) => {
      if (segment.toLowerCase() === italicWord.toLowerCase()) {
        return (
          <span key={`it-${idx}`} className="terms-part-title-italic">
            {segment}
          </span>
        );
      }
      return segment;
    });
  };

  return (
    <header className="terms-part-header" id={anchor.replace(/^#/, '')}>
      <div className="terms-part-range-tag">{rangeLabel}</div>
      <h2 className="terms-part-title">{renderFormattedTitle()}</h2>
      <p className="terms-part-description">{description}</p>
      <div className="terms-part-divider-line" aria-hidden="true" />
    </header>
  );
};

export default React.memo(PartHeader);
