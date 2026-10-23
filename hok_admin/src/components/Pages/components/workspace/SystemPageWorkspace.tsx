/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: SystemPageWorkspace (Spec §8.2, Screens 60–62)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { SYSTEM_COPY } from '../../data/contentRegistries/system/systemCopy.js';
import { ExternalLink, Check, Save } from 'lucide-react';

interface SystemPageWorkspaceProps {
  page: PageCardData;
  figures?: FigureItem[];
  onSelectFigure?: (figure: FigureItem) => void;
  onNavigateToLinks?: () => void;
}

export const SystemPageWorkspace: React.FC<SystemPageWorkspaceProps> = ({
  page,
  figures = [],
  onSelectFigure,
  onNavigateToLinks
}) => {
  const is404 = page.slug === '/404';
  const isSearch = page.slug === '/search';
  const isMaintenance = page.slug === '/maintenance';

  // Situation chip lists per system page
  const situations404 = [
    { id: 'sold', label: 'A piece that has sold' },
    { id: 'mistyped', label: 'A mistyped link to a piece' },
    { id: 'unknown', label: 'A link with nothing to go on' }
  ];

  const situationsSearch = [
    { id: 'misspelling', label: 'A misspelling' },
    { id: 'no_category', label: 'No matches in category' },
    { id: 'out_of_stock', label: 'Out of stock search' }
  ];

  const situationsMaintenance = [
    { id: 'scheduled', label: 'Scheduled maintenance' },
    { id: 'late', label: 'Running late' },
    { id: 'unplanned', label: 'Unexpected pause' }
  ];

  // Default active situation
  const [activeSituation, setActiveSituation] = useState<string>(() => {
    if (is404) return 'sold';
    if (isSearch) return 'misspelling';
    return 'late';
  });

  // Editable copy state for each situation
  const [copy404SoldHeading, setCopy404SoldHeading] = useState(SYSTEM_COPY.page_not_found.sold_heading);
  const [copy404SoldSub, setCopy404SoldSub] = useState(SYSTEM_COPY.page_not_found.sold_sub);
  const [copy404GeneralHeading, setCopy404GeneralHeading] = useState(SYSTEM_COPY.page_not_found.heading);
  const [copy404GeneralSub, setCopy404GeneralSub] = useState(SYSTEM_COPY.page_not_found.sub);
  const [copy404SearchPlaceholder, setCopy404SearchPlaceholder] = useState(SYSTEM_COPY.page_not_found.search_placeholder);

  const [copySearchHeading, setCopySearchHeading] = useState(SYSTEM_COPY.search_empty.none_heading);
  const [copySearchSub, setCopySearchSub] = useState(SYSTEM_COPY.search_empty.none_sub);
  const [copySearchTrendLabel, setCopySearchTrendLabel] = useState(SYSTEM_COPY.search_empty.trend_label);
  const [copySearchDymLead, setCopySearchDymLead] = useState(SYSTEM_COPY.search_empty.dym_lead);

  const [copyMaintHeading, setCopyMaintHeading] = useState(SYSTEM_COPY.maintenance.heading);
  const [copyMaintPlannedSub, setCopyMaintPlannedSub] = useState(SYSTEM_COPY.maintenance.sub_planned);
  const [copyMaintLateStatus, setCopyMaintLateStatus] = useState(SYSTEM_COPY.maintenance.status_late);
  const [copyMaintCareTitle, setCopyMaintCareTitle] = useState(SYSTEM_COPY.maintenance.care_title);
  const [copyMaintCareText, setCopyMaintCareText] = useState(SYSTEM_COPY.maintenance.care_text);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Helper to render placeholder tokens as grey chips (§8.2)
  const renderTextWithPlaceholders = (text: string) => {
    const parts = text.split(/(\{[a-zA-Z0-9_]+\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const tokenName = part.slice(1, -1);
        if (tokenName === 'support_hours') {
          // It's a real figure token! (§8.2: prints days and hours set in Site Settings)
          const fig = figures.find(f => f.key === 'support_hours') || {
            key: 'support_hours',
            label: 'Support hours',
            value: 'seven days a week, 10 AM to 8 PM IST',
            displayValue: 'seven days a week, 10 AM to 8 PM IST',
            subject: 'support',
            owner: 'Site Settings',
            status: 'live',
            reachCount: 2,
            usedOnSlugs: [page.slug],
            format: 'text'
          };
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectFigure?.(fig)}
              className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-[2px] bg-[#c9a96e]/15 border border-[#c9a96e] text-[#8a6a36] font-mono text-[11px] hover:bg-[#c9a96e]/25 transition-colors cursor-pointer"
              title="Figure from Site Settings · Click to inspect"
            >
              {fig.displayValue}
            </button>
          );
        }
        // Standard placeholder chip
        return (
          <span
            key={i}
            className="inline-block px-1.5 py-0.2 mx-0.5 rounded-[3px] bg-[#efe7db] text-[#5c5248] border border-[#d9ccb6] font-mono text-[11px]"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Trending searches read from Site Settings (§8.2, Screen 76)
  const trendingSearches = [
    'Sabyasachi lehenga',
    'Tarun Tahiliani drape saree',
    'Ridhi Mehra anarkali',
    'Cocktail gowns',
    'Haldi yellow'
  ];

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-6 animate-in fade-in duration-150">
      {/* 1. Situation Selector Strip Above the Page (Spec §8.2, Screens 60–62) */}
      <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-serif font-medium text-[#6e6358] whitespace-nowrap">
            Showing the page for
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {is404 &&
              situations404.map(sit => (
                <button
                  key={sit.id}
                  onClick={() => setActiveSituation(sit.id)}
                  className={`text-xs px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
                    activeSituation === sit.id
                      ? 'bg-[#1a1612] text-white font-medium'
                      : 'bg-[#efe7db] text-[#5c5248] hover:bg-[#e4dacb]'
                  }`}
                >
                  {sit.label}
                </button>
              ))}

            {isSearch &&
              situationsSearch.map(sit => (
                <button
                  key={sit.id}
                  onClick={() => setActiveSituation(sit.id)}
                  className={`text-xs px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
                    activeSituation === sit.id
                      ? 'bg-[#1a1612] text-white font-medium'
                      : 'bg-[#efe7db] text-[#5c5248] hover:bg-[#e4dacb]'
                  }`}
                >
                  {sit.label}
                </button>
              ))}

            {isMaintenance &&
              situationsMaintenance.map(sit => (
                <button
                  key={sit.id}
                  onClick={() => setActiveSituation(sit.id)}
                  className={`text-xs px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
                    activeSituation === sit.id
                      ? 'bg-[#1a1612] text-white font-medium'
                      : 'bg-[#efe7db] text-[#5c5248] hover:bg-[#e4dacb]'
                  }`}
                >
                  {sit.label}
                </button>
              ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="self-end sm:self-auto px-3 py-1 rounded-[3px] bg-[#8a6a36] hover:bg-[#70552b] text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Saved' : 'Save page'}</span>
        </button>
      </div>

      {/* 2. Pointer Card for External Data (Spec §8.2) */}
      {is404 && (
        <div className="p-3.5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-[#1a1612]">Addresses that led here</span>
            <p className="text-[11px] text-[#5c5248]">
              Every address a visitor tried that led to this page is listed in Links and addresses, most followed first, so it can be sent to the right page.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToLinks}
            className="px-2.5 py-1 text-xs rounded-[3px] border border-[#d9ccb6] hover:bg-[#efe7db] text-[#1a1612] flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open the list</span>
            <ExternalLink className="w-3 h-3 text-[#6e6358]" />
          </button>
        </div>
      )}

      {isMaintenance && (
        <div className="p-3.5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-[#1a1612]">Switching it on</span>
            <p className="text-[11px] text-[#5c5248]">
              Switched off. No back by time is set, so the page reads as an unexpected pause. Reads Site Settings and changes to “running late” once back by time has passed.
            </p>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 text-xs rounded-[3px] border border-[#d9ccb6] hover:bg-[#efe7db] text-[#1a1612] flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open Site Settings</span>
            <ExternalLink className="w-3 h-3 text-[#6e6358]" />
          </button>
        </div>
      )}

      {/* 3. The Central Paper for the Chosen Situation (Spec §8.2) */}
      <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-12 space-y-8 text-[#1a1612]">
        {/* ======================= PAGE NOT FOUND (/404) ======================= */}
        {is404 && (
          <div className="space-y-6">
            {activeSituation === 'sold' ? (
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#a4512f]">
                  A piece that has sold
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={copy404SoldHeading}
                    onChange={e => setCopy404SoldHeading(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] font-serif text-2xl md:text-3xl font-normal text-[#1a1612] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                    Line under the heading
                  </label>
                  <textarea
                    rows={3}
                    value={copy404SoldSub}
                    onChange={e => setCopy404SoldSub(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#5c5248] focus:outline-none leading-relaxed"
                  />
                  <div className="text-[11px] text-[#6e6358] bg-[#fcfaf7] p-2.5 rounded-[3px] border border-[#efe7da]">
                    Preview on storefront: {renderTextWithPlaceholders(copy404SoldSub)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                  {activeSituation === 'mistyped' ? 'A mistyped link to a piece' : 'A link with nothing to go on'}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={copy404GeneralHeading}
                    onChange={e => setCopy404GeneralHeading(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] font-serif text-2xl md:text-3xl font-normal text-[#1a1612] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                    Line under the heading
                  </label>
                  <textarea
                    rows={3}
                    value={copy404GeneralSub}
                    onChange={e => setCopy404GeneralSub(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#5c5248] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Search Box on 404 */}
            <div className="space-y-2 pt-4 border-t border-[#efe7da]">
              <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                Words inside the search box
              </label>
              <input
                type="text"
                value={copy404SearchPlaceholder}
                onChange={e => setCopy404SearchPlaceholder(e.target.value)}
                className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
              />
            </div>

            {/* Support hours figure integration */}
            <div className="pt-4 border-t border-[#efe7da] p-3 bg-[#fcfaf7] rounded-[3px] border border-[#efe7da] text-xs space-y-1">
              <span className="font-semibold text-[#1a1612]">Concierge hours stamp</span>
              <p className="text-[#5c5248]">
                Storefront footer reads: “We reply {renderTextWithPlaceholders('{support_hours}')}.”
              </p>
            </div>
          </div>
        )}

        {/* ======================= NO SEARCH RESULTS (/search) ======================= */}
        {isSearch && (
          <div className="space-y-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
              {activeSituation === 'misspelling' && 'A misspelling'}
              {activeSituation === 'no_category' && 'No matches in category'}
              {activeSituation === 'out_of_stock' && 'Out of stock search'}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                Heading
              </label>
              <input
                type="text"
                value={copySearchHeading}
                onChange={e => setCopySearchHeading(e.target.value)}
                className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] font-serif text-2xl md:text-3xl font-normal text-[#1a1612] focus:outline-none"
              />
              <div className="text-[11px] text-[#6e6358] pt-1">
                Storefront reads: {renderTextWithPlaceholders(copySearchHeading)}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                Line under the heading
              </label>
              <textarea
                rows={3}
                value={copySearchSub}
                onChange={e => setCopySearchSub(e.target.value)}
                className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#5c5248] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Trending Searches Section (§8.2, Screen 76) */}
            <div className="space-y-3 pt-6 border-t border-[#efe7da]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                  Label above trending chips (on the page)
                </label>
                <button
                  type="button"
                  className="text-xs text-[#8a6a36] hover:text-[#1a1612] flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Site Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <input
                type="text"
                value={copySearchTrendLabel}
                onChange={e => setCopySearchTrendLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
              />

              <div className="p-3 bg-[#fcfaf7] rounded-[3px] border border-[#efe7da] space-y-2">
                <span className="text-[11px] text-[#6e6358] block">
                  Trending searches drawn as chips, read from Site Settings (Header › Search):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {trendingSearches.map((chip, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Did you mean suggestion line */}
            <div className="space-y-1 pt-4 border-t border-[#efe7da]">
              <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                Did you mean lead
              </label>
              <input
                type="text"
                value={copySearchDymLead}
                onChange={e => setCopySearchDymLead(e.target.value)}
                className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ======================= MAINTENANCE (/maintenance, Spec §8.26, Screen 62) ======================= */}
        {isMaintenance && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#efe7da] pb-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#a4512f]">
                {activeSituation === 'late' && 'Running late (Screen 62)'}
                {activeSituation === 'scheduled' && 'Scheduled maintenance (Planned with a time)'}
                {activeSituation === 'unplanned' && 'Unexpected pause'}
              </div>
              <span className="text-[11px] text-[#6e6358] font-mono">
                hok_maintenance_page_v1 · v1.0
              </span>
            </div>

            {/* Brand line & Eyebrow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                  Brand line
                </label>
                <input
                  type="text"
                  defaultValue="House of Kaira · Indore Studio"
                  className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                  Eyebrow
                </label>
                <input
                  type="text"
                  defaultValue="Maintenance"
                  className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#8a6a36] font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                Heading
              </label>
              <input
                type="text"
                value={copyMaintHeading}
                onChange={e => setCopyMaintHeading(e.target.value)}
                className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] font-serif text-2xl md:text-3xl font-normal text-[#1a1612] focus:outline-none"
              />
            </div>

            {/* Status / When we are back line (Spec §8.26 Part 01) */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                When we are back ({activeSituation === 'late' ? 'running late' : activeSituation === 'scheduled' ? 'planned' : 'unplanned'})
              </label>
              <input
                type="text"
                value={activeSituation === 'late' ? copyMaintLateStatus : copyMaintPlannedSub}
                onChange={e => {
                  if (activeSituation === 'late') setCopyMaintLateStatus(e.target.value);
                  else setCopyMaintPlannedSub(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
              />
              <div className="text-[11px] text-[#6e6358] pt-1">
                Storefront reads: {renderTextWithPlaceholders(activeSituation === 'late' ? copyMaintLateStatus : copyMaintPlannedSub)}
              </div>
            </div>

            {/* Celebrating Soon Band (§8.26: Celebrating soon heading & line) */}
            <div className="space-y-3 pt-4 border-t border-[#efe7da]">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                  Celebrating soon, heading
                </label>
                <input
                  type="text"
                  value={copyMaintCareTitle}
                  onChange={e => setCopyMaintCareTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs font-semibold text-[#1a1612] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                  Celebrating soon, line
                </label>
                <textarea
                  rows={2}
                  value={copyMaintCareText}
                  onChange={e => setCopyMaintCareText(e.target.value)}
                  className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#5c5248] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Buttons and lines (§8.26: Instagram line, Reply hours, Refresh line, Footnote) */}
            <div className="pt-4 border-t border-[#efe7da] space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                    Instagram update line
                  </label>
                  <input
                    type="text"
                    defaultValue="Follow @houseofkiara on Instagram for live status updates."
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                    Auto-refresh line
                  </label>
                  <input
                    type="text"
                    defaultValue="This page refreshes automatically every two minutes."
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-mono">
                  Reassurance footnote
                </label>
                <input
                  type="text"
                  defaultValue="Client bookings and scheduled dispatches continue without interruption."
                  className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#6e6358] focus:outline-none"
                />
              </div>
            </div>

            {/* Support figure on maintenance */}
            <div className="pt-4 border-t border-[#efe7da] p-3 bg-[#fcfaf7] rounded-[3px] border border-[#efe7da] text-xs space-y-1">
              <span className="font-semibold text-[#1a1612]">Support hours integration</span>
              <p className="text-[#5c5248]">
                Concierge card reads: “We reply {renderTextWithPlaceholders('{support_hours}')}.”
              </p>
            </div>
          </div>
        )}
      </article>

      {/* Under-paper caption */}
      <div className="text-center text-xs text-[#6e6358] py-2">
        Lines with grey chips are placeholders filled when the customer sees them. The support hours token links to Site Settings.
      </div>
    </div>
  );
};

export default SystemPageWorkspace;