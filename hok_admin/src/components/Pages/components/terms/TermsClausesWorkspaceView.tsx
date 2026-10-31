/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsClausesWorkspaceView (Spec §7.8, Screen 50)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import TermsClausesListColumn from './TermsClausesListColumn';
import TermsClausePaperColumn from './TermsClausePaperColumn';
import TermsClauseInspectorColumn from './TermsClauseInspectorColumn';
import { EditableFieldProps } from '../types';

interface TermsClausesWorkspaceViewProps extends EditableFieldProps {
  initialClauseNum?: number;
  onBackToPaper?: () => void;
}

export const TermsClausesWorkspaceView: React.FC<TermsClausesWorkspaceViewProps> = ({
  initialClauseNum = 46,
  fieldValues,
  onFieldChange,
  onFocusField,
  onBackToPaper
}) => {
  const [selectedClauseNum, setSelectedClauseNum] = useState<number>(initialClauseNum);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Bar with Back to Paper View */}
      {onBackToPaper && (
        <div className="flex items-center justify-between bg-white px-4 py-2 border border-[#ebe5dc] rounded-[6px] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1a1612]">Clauses Workspace</span>
            <span className="text-[#8a7f73]">·</span>
            <span className="text-[#5c5248]">59 numbered clauses in 12 parts</span>
          </div>
          <button
            type="button"
            onClick={onBackToPaper}
            className="text-[#8a6a36] hover:underline font-medium cursor-pointer"
          >
            ← Back to Overview Paper
          </button>
        </div>
      )}

      {/* 3-Column Desk Layout (Screen 50) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Column: Clauses Navigator */}
        <TermsClausesListColumn
          selectedClauseNum={selectedClauseNum}
          onSelectClause={setSelectedClauseNum}
        />

        {/* Center Column: Clause Paper Canvas */}
        <TermsClausePaperColumn
          selectedClauseNum={selectedClauseNum}
          fieldValues={fieldValues}
          onFieldChange={onFieldChange}
          onFocusField={onFocusField}
        />

        {/* Right Column: Clause Inspector */}
        <TermsClauseInspectorColumn
          selectedClauseNum={selectedClauseNum}
        />
      </div>
    </div>
  );
};

export default TermsClausesWorkspaceView;
