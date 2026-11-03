/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: MaintenanceFooter (Spec §8.20, Screen 61)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface MaintenanceFooterProps {
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldKey: string, value: string) => void;
  onFocusField?: (fieldKey: string, fieldTitle: string, initialValue: string) => void;
}

export const MaintenanceFooter: React.FC<MaintenanceFooterProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const refreshNotice = fieldValues['maint_refresh_notice'] ?? 'This page will refresh by itself the moment we\'re back.';
  const copyrightLine = fieldValues['maint_copyright_line'] ?? '© 2026 House of Kaira · Indore, India';

  return (
    <div className="w-full max-w-[700px] mx-auto text-center space-y-4 pt-3 pb-8">
      {/* Auto refresh notice */}
      <p className="text-[12.5px] text-[#73675a]">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onFieldChange('maint_refresh_notice', e.currentTarget.innerText)}
          onFocus={() => onFocusField('maint_refresh_notice', 'Auto refresh notice', refreshNotice)}
          className="outline-none hover:bg-[#fff9e6] rounded px-1 transition-colors cursor-text"
        >
          {refreshNotice}
        </span>
      </p>

      {/* Copyright line with hand typed year triggering check */}
      <footer className="text-[11.5px] text-[#8a7f73] tracking-wide">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onFieldChange('maint_copyright_line', e.currentTarget.innerText)}
          onFocus={() => onFocusField('maint_copyright_line', 'Footnote copyright line', copyrightLine)}
          className="outline-none hover:bg-[#faebd7] rounded px-1 transition-colors cursor-text"
          title="Click to edit footnote"
        >
          {copyrightLine}
        </span>
      </footer>
    </div>
  );
};

export default MaintenanceFooter;
