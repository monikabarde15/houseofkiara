/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Links & Addresses (Spec §6, Pages 15 & 16)
   Admin panel v217 · 20 October 2026
========================================================= */

export type LinkHealthStatus = 'ok' | 'broken' | 'redirect' | 'missing-clause' | 'slow';

export interface HeaderFooterLinkItem {
  id: string;
  location: string; // e.g. "Site Settings > Header menu", "Footer policy row", "Mobile bar"
  label: string;
  address: string;
  targetType: 'page' | 'catalogue' | 'nowhere';
  targetSlug?: string;
}

export interface LinkedNotBuiltItem {
  id: string;
  slug: string;
  title: string;
  linksPointingAtIt: Array<{
    location: string;
    label: string;
  }>;
}

export interface OldAddressItem {
  id: string;
  oldPath: string;
  targetSlug: string;
  targetPageTitle: string;
  isEnabled: boolean;
}

export interface NotFound404LogItem {
  id: string;
  attemptedPath: string;
  hitsCount: number;
  lastHitDate: string;
  referrers: string[];
  suggestedRedirect?: string;
  resolved: boolean;
  markedNowhere?: boolean;
}

export interface PageNameAliasItem {
  id: string;
  aliasName: string; // e.g. "hok_terms", "hok_faq", "hok_contact"
  resolvedSlug: string;
  resolvedTitle: string;
}

export interface ExternalLinkItem {
  id: string;
  url: string;
  domain: string;
  statusCode: number;
  statusText: string;
  health: LinkHealthStatus;
  usedOnPages: string[];
  lastChecked: string;
  responseTimeMs?: number;
}

export interface InternalCrossLinkItem {
  id: string;
  sourceSlug: string;
  sourceAnchorText: string;
  targetSlug: string;
  targetClauseAnchor?: string;
  health: LinkHealthStatus;
  problemDetails?: string;
}

export interface LinksAndAddressesData {
  headerFooterLinks: HeaderFooterLinkItem[];
  linkedNotBuilt: LinkedNotBuiltItem[];
  oldAddresses: OldAddressItem[];
  notFound404Logs: NotFound404LogItem[];
  pageNameAliases: PageNameAliasItem[];
  externalLinks: ExternalLinkItem[];
  internalCrossLinks: InternalCrossLinkItem[];
  summary: {
    thingsToFixCount: number;
    linksNowhereCount: number;
    notBuiltPagesCount: number;
    notFoundUnresolvedCount: number;
    oldAddressesCount: number;
    externalBrokenCount: number;
    internalBrokenCount: number;
  };
}
