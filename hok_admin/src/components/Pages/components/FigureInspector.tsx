/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureInspector (Spec §5.2, §5.3, §5.4, Screens 04-16)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { FigureItem } from '../types';
import { FigureInspectorHeader } from './FigureInspectorHeader';
import { FigureValueBlock } from './FigureValueBlock';
import { FigureWhereReadBlock } from './FigureWhereReadBlock';
import { FigureMetaBlock } from './FigureMetaBlock';

interface FigureInspectorProps {
  figure: FigureItem;
  onAddChange: (key: string, newValue: string, when: 'now' | 'date', date?: string, why?: string) => void;
  onDiscardChange: (key: string) => void;
  onReviewAndPublish?: () => void;
  onNavigateToPage?: (slug: string) => void;
  onOpenSection?: (sectionName: string) => void;
}

export const FigureInspector: React.FC<FigureInspectorProps> = ({
  figure,
  onAddChange,
  onDiscardChange,
  onReviewAndPublish,
  onNavigateToPage,
  onOpenSection
}) => {
  const [pendingPreviewValue, setPendingPreviewValue] = useState<string | null>(null);

  const handleAddChangeWrapped = (
    key: string,
    newValue: string,
    when: 'now' | 'date',
    date?: string,
    why?: string
  ) => {
    setPendingPreviewValue(newValue);
    onAddChange(key, newValue, when, date, why);
  };

  const handleDiscardWrapped = (key: string) => {
    setPendingPreviewValue(null);
    onDiscardChange(key);
  };

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
      {/* 1. Header (Subject, Badges, Serif Name, Description, Page Files) */}
      <FigureInspectorHeader figure={figure} />

      {/* 2. Value Block (Set here editor / pointer cards) */}
      <FigureValueBlock
        figure={figure}
        onAddChange={handleAddChangeWrapped}
        onDiscardChange={handleDiscardWrapped}
        onReviewAndPublish={onReviewAndPublish}
      />

      {/* 3. Where Customers Read It (Accordions with before/after diffs) */}
      <FigureWhereReadBlock
        figure={figure}
        pendingNewValue={pendingPreviewValue}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 4. Drives Behind the Scenes & History */}
      <FigureMetaBlock
        figure={figure}
        onOpenSection={onOpenSection}
      />
    </div>
  );
};

export default FigureInspector;
