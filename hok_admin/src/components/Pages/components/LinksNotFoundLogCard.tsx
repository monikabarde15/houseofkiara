/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksNotFoundLogCard (Spec §6, Screen 17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { NotFound404LogItem, PageCardData } from '../types';

interface LinksNotFoundLogCardProps {
  logs: NotFound404LogItem[];
  pages: PageCardData[];
  onSendToPage?: (logId: string, targetSlug: string) => void;
}

export const LinksNotFoundLogCard: React.FC<LinksNotFoundLogCardProps> = ({
  logs: initialLogs,
  pages,
  onSendToPage
}) => {
  const [logs, setLogs] = useState<NotFound404LogItem[]>(initialLogs);
  const [selectedTargets, setSelectedTargets] = useState<Record<string, string>>({});

  const handleSelectTarget = (logId: string, slug: string) => {
    setSelectedTargets(prev => ({
      ...prev,
      [logId]: slug
    }));
  };

  const handleSend = (logId: string) => {
    const targetSlug = selectedTargets[logId];
    if (!targetSlug) return;

    setLogs(prev =>
      prev.map(l => (l.id === logId ? { ...l, resolved: true, suggestedRedirect: targetSlug } : l))
    );

    if (onSendToPage) {
      onSendToPage(logId, targetSlug);
    }
  };

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="p-4 px-5 border-b border-[#f0ebe3]">
        <h2 className="text-[15px] font-semibold text-[#1a1612]">
          Addresses people tried that led nowhere
        </h2>
        <p className="text-[12px] text-[#73675a] mt-0.5">
          Read from the storefront's Page not found log, most followed first. Send one to a page and it becomes an old address of that page; the next visitor lands where they meant to.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] divide-y divide-[#f0ebe3]">
          <thead className="bg-[#faf7f2] text-[#73675a] font-normal">
            <tr>
              <th className="py-2.5 px-5 font-normal w-1/3">Address</th>
              <th className="py-2.5 px-5 font-normal text-right w-16">Visits</th>
              <th className="py-2.5 px-5 font-normal w-24">Last</th>
              <th className="py-2.5 px-5 font-normal w-28">Came from</th>
              <th className="py-2.5 px-5 font-normal w-1/4">Send to</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe3] text-[#1a1612]">
            {logs.map(log => {
              const currentChoice = selectedTargets[log.id] || '';
              return (
                <tr key={log.id} className="hover:bg-[#fcfaf7] transition-colors align-top">
                  <td className="py-3 px-5">
                    <span className="font-mono text-[11.5px] text-[#1a1612] block">
                      {log.attemptedPath}
                    </span>
                    {log.subtitle && (
                      <span className="text-[11px] text-[#73675a] block mt-0.5">
                        {log.subtitle}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-right font-medium">
                    {log.visits || log.hitsCount}
                  </td>
                  <td className="py-3 px-5 text-[#5c5248]">
                    {log.lastDate || log.lastHitDate}
                  </td>
                  <td className="py-3 px-5 text-[#5c5248]">
                    {log.cameFrom || log.referrers[0] || 'Unknown'}
                  </td>
                  <td className="py-3 px-5">
                    {log.resolved ? (
                      <span className="inline-flex items-center gap-1.5 text-[#40562e] font-medium text-[11px]">
                        <span>✓</span>
                        <span>Sent to {log.suggestedRedirect}</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={currentChoice}
                          onChange={e => handleSelectTarget(log.id, e.target.value)}
                          className="bg-white border border-[#e6dccb] rounded-[4px] px-2 py-1 text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
                        >
                          <option value="">Choose a page</option>
                          {pages.map(p => (
                            <option key={p.slug} value={p.slug}>
                              {p.title} ({p.slug})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!currentChoice}
                          onClick={() => handleSend(log.id)}
                          className="px-2.5 py-1 bg-white border border-[#e6dccb] rounded-[4px] text-xs text-[#1a1612] font-medium hover:bg-[#faf7f2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinksNotFoundLogCard;
