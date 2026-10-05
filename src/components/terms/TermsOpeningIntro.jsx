import React from 'react';
import { OPENING_PARAGRAPH } from '../../data/terms/termsRegistry.js';

/**
 * Terms & Conditions Opening Introduction Paragraph
 * Section 5.6 of Build Specification v3.0
 */
const TermsOpeningIntro = () => {
  return (
    <div className="terms-opening-intro-wrapper">
      <p className="terms-opening-text">
        {OPENING_PARAGRAPH}
      </p>
    </div>
  );
};

export default React.memo(TermsOpeningIntro);
