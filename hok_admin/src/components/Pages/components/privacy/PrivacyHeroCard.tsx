/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PrivacyHeroCard (Spec §8.1 & §8.10, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

export const PrivacyHeroCard: React.FC<EditableFieldProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const [isEditingEyebrow, setIsEditingEyebrow] = useState(false);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);

  const eyebrow = fieldValues['privacy_eyebrow'] ?? 'PRIVACY POLICY';
  const heading = fieldValues['privacy_heading'] ?? 'Privacy Policy';
  const lead = fieldValues['privacy_lead'] ?? 'Its words load here from its page file, which is still to come.';

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-8 md:p-14 shadow-2xs text-center transition-all hover:border-[#dbc8af]">
      {/* Eyebrow */}
      <div className="mb-3">
        {isEditingEyebrow ? (
          <input
            type="text"
            value={eyebrow}
            autoFocus
            onBlur={() => setIsEditingEyebrow(false)}
            onChange={(e) => onFieldChange('privacy_eyebrow', e.target.value)}
            className="text-[11px] font-semibold tracking-[0.2em] text-[#935b1e] uppercase text-center border-b border-[#935b1e] bg-transparent outline-none max-w-sm mx-auto"
          />
        ) : (
          <span
            onClick={() => {
              setIsEditingEyebrow(true);
              onFocusField('privacy_eyebrow');
            }}
            className="text-[11px] font-semibold tracking-[0.2em] text-[#935b1e] uppercase cursor-pointer hover:bg-[#fbf4ea] px-2 py-0.5 rounded transition-colors"
            title="Click to edit eyebrow"
          >
            {eyebrow}
          </span>
        )}
      </div>

      {/* Main Heading */}
      <div className="mb-3">
        {isEditingHeading ? (
          <input
            type="text"
            value={heading}
            autoFocus
            onBlur={() => setIsEditingHeading(false)}
            onChange={(e) => onFieldChange('privacy_heading', e.target.value)}
            className="text-3xl md:text-[38px] font-serif text-[#1c1917] font-normal text-center border-b border-[#935b1e] bg-transparent outline-none w-full max-w-md mx-auto"
          />
        ) : (
          <h1
            onClick={() => {
              setIsEditingHeading(true);
              onFocusField('privacy_heading');
            }}
            className="text-3xl md:text-[38px] font-serif text-[#1c1917] font-normal cursor-pointer hover:bg-[#fbf4ea] px-3 py-1 rounded inline-block transition-colors"
            title="Click to edit heading"
          >
            {heading}
          </h1>
        )}
      </div>

      {/* Subtitle / Lead */}
      <div>
        {isEditingLead ? (
          <textarea
            value={lead}
            autoFocus
            rows={2}
            onBlur={() => setIsEditingLead(false)}
            onChange={(e) => onFieldChange('privacy_lead', e.target.value)}
            className="text-[#57534e] text-sm text-center border border-[#935b1e] rounded p-2 bg-transparent outline-none w-full max-w-lg mx-auto"
          />
        ) : (
          <p
            onClick={() => {
              setIsEditingLead(true);
              onFocusField('privacy_lead');
            }}
            className="text-[#57534e] text-sm max-w-lg mx-auto leading-relaxed cursor-pointer hover:bg-[#fbf4ea] p-1.5 rounded transition-colors"
            title="Click to edit subtitle"
          >
            {lead}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrivacyHeroCard;
