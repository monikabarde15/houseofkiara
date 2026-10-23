/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksWorkspaceTab (Spec §6, Pages 15 & 16, Screen 17)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { Info } from 'lucide-react';
import { LinksAndAddressesData } from '../../types';
import { HeaderFooterLinksCard } from './HeaderFooterLinksCard';
import { LinkedNotBuiltCard } from './LinkedNotBuiltCard';
import { OldAddressesCard } from './OldAddressesCard';
import { NotFoundLogsCard } from './NotFoundLogsCard';
import { PageNameAliasesCard } from './PageNameAliasesCard';

interface LinksWorkspaceTabProps {
  data: LinksAndAddressesData;
  onUpdateData: (newData: LinksAndAddressesData) => void;
  onNavigateToPage?: (slug: string) => void;
  onQueueChange?: (change: {
    id: string;
    type: 'figure' | 'page' | 'check';
    title: string;
    details: string;
    source: string;
  }) => void;
}

export const LinksWorkspaceTab: React.FC<LinksWorkspaceTabProps> = ({
  data,
  onUpdateData,
  onNavigateToPage,
  onQueueChange
}) => {
  const handleToggleOldAddress = (id: string) => {
    const updated = {
      ...data,
      oldAddresses: data.oldAddresses.map(a =>
        a.id === id ? { ...a, isEnabled: !a.isEnabled } : a
      )
    };
    onUpdateData(updated);
  };

  const handleSendNotFoundToPage = (id: string, targetSlug: string) => {
    const log = data.notFound404Logs.find(l => l.id === id);
    if (!log) return;

    // Add to oldAddresses as an active redirect
    const newOldAddress = {
      id: `old_redirect_${Date.now()}`,
      oldPath: log.attemptedPath,
      targetSlug,
      targetPageTitle: targetSlug,
      isEnabled: true
    };

    const updated = {
      ...data,
      oldAddresses: [newOldAddress, ...data.oldAddresses],
      notFound404Logs: data.notFound404Logs.filter(l => l.id !== id),
      summary: {
        ...data.summary,
        notFoundUnresolvedCount: Math.max(0, data.summary.notFoundUnresolvedCount - 1),
        thingsToFixCount: Math.max(0, data.summary.thingsToFixCount - 1)
      }
    };

    onUpdateData(updated);
    onQueueChange?.({
      id: `redirect_${id}`,
      type: 'page',
      title: `Routed ${log.attemptedPath} to ${targetSlug}`,
      details: 'Created redirect so next visitor lands on target page',
      source: 'Links and addresses'
    });
  };

  const handleMarkNowhere = (id: string) => {
    const updated = {
      ...data,
      notFound404Logs: data.notFound404Logs.map(l =>
        l.id === id ? { ...l, resolved: true, markedNowhere: true } : l
      ),
      summary: {
        ...data.summary,
        notFoundUnresolvedCount: Math.max(0, data.summary.notFoundUnresolvedCount - 1),
        thingsToFixCount: Math.max(0, data.summary.thingsToFixCount - 1)
      }
    };
    onUpdateData(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Note (Spec §6, Page 15: verbatim) */}
      <div className="p-3.5 rounded-[6px] bg-[#fffefb] border border-[#e6dccb] flex items-center gap-2.5 text-xs text-[#5c5248]">
        <Info className="w-4 h-4 text-[#8a6a36] shrink-0" />
        <span>
          A link is not a page; Site Settings owns the header and the footer, Pages owns what is behind each link, and this view reads both.
        </span>
      </div>

      {/* Card 1: Links in the header and footer (Spec §6) */}
      <HeaderFooterLinksCard
        links={data.headerFooterLinks}
        onNavigateToPage={onNavigateToPage}
      />

      {/* Card 2: Pages linked but not built (Spec §6) */}
      <LinkedNotBuiltCard
        items={data.linkedNotBuilt}
        onNavigateToPage={onNavigateToPage}
      />

      {/* Card 3: Old addresses sent to a page (Spec §6) */}
      <OldAddressesCard
        items={data.oldAddresses}
        onToggleAddress={handleToggleOldAddress}
        onNavigateToPage={onNavigateToPage}
      />

      {/* Card 4: Addresses people tried that led nowhere (Spec §6) */}
      <NotFoundLogsCard
        logs={data.notFound404Logs}
        onSendToPage={handleSendNotFoundToPage}
        onMarkNowhere={handleMarkNowhere}
      />

      {/* Card 5: Names the built pages use for each page (Spec §6) */}
      <PageNameAliasesCard
        aliases={data.pageNameAliases}
        onNavigateToPage={onNavigateToPage}
      />
    </div>
  );
};

export default LinksWorkspaceTab;
