/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Links & Addresses (Spec §6 & §13.1)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export type LinkHealthStatus = 'ok' | 'broken' | 'redirect' | 'missing-clause' | 'slow';

export interface HeaderFooterLinkItem {
  id: string;
  location: string;
  where?: string;
  label: string;
  address: string;
  targetType: 'page' | 'catalogue' | 'nowhere';
  targetSlug?: string;
  leadsTo?: string;
  isTerracotta?: boolean;
}

export interface LinkedNotBuiltItem {
  id: string;
  slug: string;
  title: string;
  decision?: string;
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
  subtitle?: string;
  hitsCount: number;
  visits?: number;
  lastHitDate: string;
  lastDate?: string;
  cameFrom?: string;
  referrers: string[];
  suggestedRedirect?: string;
  resolved: boolean;
  markedNowhere?: boolean;
}

export interface PageNameAliasItem {
  id: string;
  page?: string;
  name?: string;
  aliasName: string;
  alsoWrittenAs?: string;
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
