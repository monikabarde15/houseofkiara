/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PrivacyPaperSection (Spec §8.1 & §8.10, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import PrivacyHeroCard from './PrivacyHeroCard';
import PrivacyNoticeCard from './PrivacyNoticeCard';
import { EditableFieldProps } from '../types';

interface PrivacyPaperSectionProps extends EditableFieldProps {
  page: any;
  onOpenCheck?: (checkId: string) => void;
}

export const PrivacyPaperSection: React.FC<PrivacyPaperSectionProps> = ({
  page,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onOpenCheck
}) => {
  return (
    <div className="max-w-[760px] mx-auto w-full space-y-6 pt-2 pb-16">
      {/* 1. Short paper: Name & waiting message (Screen 58) */}
      <PrivacyHeroCard
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
      />

      {/* 2. Notice card: v3 explanation & What it carries (Screen 58) */}
      <PrivacyNoticeCard
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        onOpenCheck={onOpenCheck}
      />
    </div>
  );
};

export default PrivacyPaperSection;
