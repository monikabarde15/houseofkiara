/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ReviewSheetVersionsSection (Spec §10.2, §10.4)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface VersionImpact {
  pageName: string;
  fromVersion: string;
  toVersion: string;
  effectiveDate: string;
  summary: string[];
}

interface ScheduledItem {
  id: string;
  title: string;
  targetDate: string;
  who: string;
}

interface ReviewSheetVersionsSectionProps {
  versionImpacts: VersionImpact[];
  scheduledItems: ScheduledItem[];
  canCancelScheduled?: boolean;
  onCancelScheduled?: (id: string) => void;
}

export const ReviewSheetVersionsSection: React.FC<ReviewSheetVersionsSectionProps> = ({
  versionImpacts,
  scheduledItems,
  canCancelScheduled = true,
  onCancelScheduled
}) => {
  return (
    <div className="space-y-5">
      {/* 1. New versions preview (Spec §10.2) */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          New versions that will be created ({versionImpacts.length})
        </div>

        <div className="space-y-2">
          {versionImpacts.map(impact => (
            <div key={impact.pageName} className="p-3 bg-white border border-[#ebe5dc] rounded-[8px] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1a1612]">
                  {impact.pageName}
                </span>
                <span className="text-[11px] text-[#8a6a36] font-medium">
                  {impact.fromVersion} → {impact.toVersion}
                </span>
              </div>
              <div className="text-[10.5px] text-[#8a7f73]">
                Effective {impact.effectiveDate}
              </div>
              <ul className="text-[11px] text-[#5c5248] pl-3 list-disc space-y-0.5 pt-0.5">
                {impact.summary.map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Going live later (Scheduled changes, Spec §10.2) */}
      {scheduledItems.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-[#f0eae1]">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Going live later ({scheduledItems.length})
          </div>

          <div className="space-y-2">
            {scheduledItems.map(item => (
              <div key={item.id} className="p-3 bg-[#fcfaf7] border border-[#ebe5dc] rounded-[6px] flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#1a1612] text-xs">
                    {item.title}
                  </div>
                  <div className="text-[10.5px] text-[#8a7f73]">
                    From {item.targetDate} by {item.who}
                  </div>
                </div>
                {canCancelScheduled && onCancelScheduled && (
                  <button
                    type="button"
                    onClick={() => onCancelScheduled(item.id)}
                    className="text-xs text-[#993d3d] hover:underline"
                  >
                    Cancel it
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSheetVersionsSection;
