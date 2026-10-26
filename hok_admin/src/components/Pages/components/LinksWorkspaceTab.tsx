/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksWorkspaceTab (Spec §6, Screen 17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { LinksAndAddressesData, PageCardData } from '../types';
import { LinksHeaderFooterCard } from './LinksHeaderFooterCard';
import { LinksNotBuiltCard } from './LinksNotBuiltCard';
import { LinksOldAddressesCard } from './LinksOldAddressesCard';
import { LinksNotFoundLogCard } from './LinksNotFoundLogCard';
import { LinksPageAliasesCard } from './LinksPageAliasesCard';

interface LinksWorkspaceTabProps {
  data: LinksAndAddressesData;
  pages: PageCardData[];
  onNavigateToPage?: (slug: string) => void;
  onOpenSiteSettings?: () => void;
  onSend404ToPage?: (logId: string, targetSlug: string) => void;
}

export const LinksWorkspaceTab: React.FC<LinksWorkspaceTabProps> = ({
  data,
  pages,
  onNavigateToPage,
  onOpenSiteSettings,
  onSend404ToPage
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Explanatory Banner (Spec §6, Screen 17) */}
      <div className="flex items-center gap-2 p-3 px-4 rounded-[6px] bg-[#f0f6fa] border border-[#d6e5ef] text-[12px] text-[#2c5270] shadow-2xs leading-relaxed">
        <span className="text-[14px] leading-none select-none">ⓘ</span>
        <span>
          <strong className="font-semibold text-[#1c4463]">A link is not a page.</strong> Site Settings owns the header and the footer; Pages owns what is behind each link. This view reads both, so a link with nothing behind it, or an old address that people still follow, is never missed.
        </span>
      </div>

      {/* 2. Card 1: Links in the header and footer */}
      <LinksHeaderFooterCard
        links={data.headerFooterLinks}
        onOpenSiteSettings={onOpenSiteSettings}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 3. Card 2: Pages linked but not built */}
      <LinksNotBuiltCard
        items={data.linkedNotBuilt}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 4. Card 3: Old addresses sent to a page */}
      <LinksOldAddressesCard
        items={data.oldAddresses}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 5. Card 4: Addresses people tried that led nowhere */}
      <LinksNotFoundLogCard
        logs={data.notFound404Logs}
        pages={pages}
        onSendToPage={onSend404ToPage}
      />

      {/* 6. Card 5: Names the built pages use for each page */}
      <LinksPageAliasesCard
        aliases={data.pageNameAliases}
        onNavigateToPage={onNavigateToPage}
      />
    </div>
  );
};

export default LinksWorkspaceTab;
