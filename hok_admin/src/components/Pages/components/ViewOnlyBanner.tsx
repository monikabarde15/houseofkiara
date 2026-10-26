/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ViewOnlyBanner (Spec §11, Screen 63)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface ViewOnlyBannerProps {
  userRole: string;
}

export const ViewOnlyBanner: React.FC<ViewOnlyBannerProps> = ({ userRole }) => {
  return (
    <div className="bg-[#fff9ea] border-b border-[#ebdcb9] px-6 py-2 text-xs text-[#785b1a] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#c5ad7d]" />
        <span>
          View only. Your role ({userRole}) has View Only on this section. Nothing can be changed.
        </span>
      </div>
      <span className="text-[11px] text-[#8a7f73]">
        Read only mode
      </span>
    </div>
  );
};

export default ViewOnlyBanner;
