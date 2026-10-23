/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WorkspaceRightPanel (Spec §7.6 & §7.7, Pages 21 & 22)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { X, ChevronRight, Hash } from 'lucide-react';
import { PageCardData, FigureItem } from '../../types';
import { FigureInspectorPanel } from '../figures/FigureInspectorPanel';
import { PagePropertiesInspector } from './PagePropertiesInspector';

interface WorkspaceRightPanelProps {
  page: PageCardData;
  activeFigure: FigureItem | null;
  onClearActiveFigure: () => void;
  onUpdateFigureValue?: (key: string, newValue: string) => void;
  onNavigateToPage?: (slug: string) => void;
  onNavigateToChecks?: () => void;
  onNavigateToReach?: () => void;
}

export const WorkspaceRightPanel: React.FC<WorkspaceRightPanelProps> = ({
  page,
  activeFigure,
  onClearActiveFigure,
  onUpdateFigureValue,
  onNavigateToPage,
  onNavigateToChecks,
  onNavigateToReach
}) => {
  // If a figure token was clicked on the paper, render Figure Inspector with Screen 23 strip (Spec §7.6)
  if (activeFigure) {
    return (
      <div className="space-y-3">
        {/* Top Strip (Spec §7.6, Screen 23: verbatim) */}
        <div className="p-3 rounded-[6px] bg-[#f5edd8] border border-[#c9a96e]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11.5px] text-[#5c5248]">
              Prints <strong>{activeFigure.reachCount} times</strong> on this page, outlined in gold where in view.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => console.log('Next occurrence')}
              className="text-xs text-[#8a6a36] font-medium hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={onClearActiveFigure}
              className="p-1 rounded text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db] cursor-pointer"
              title="Close inspector"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Full Figure Inspector (Spec §5.2) */}
        <FigureInspectorPanel
          figure={activeFigure}
          onUpdateFigure={onUpdateFigureValue}
          onNavigateToPage={onNavigateToPage}
          onClose={onClearActiveFigure}
        />
      </div>
    );
  }

  // Otherwise render Page Properties Inspector (Spec §7.7, Screen 20)
  return (
    <PagePropertiesInspector
      page={page}
      onNavigateToChecks={() => onNavigateToChecks?.()}
      onNavigateToReach={() => onNavigateToReach?.()}
    />
  );
};

export default WorkspaceRightPanel;
