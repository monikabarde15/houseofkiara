/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: NotFoundLogsCard (Spec §6, Card 4)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { AlertCircle, CornerDownRight, Check, X } from 'lucide-react';
import { NotFound404LogItem } from '../../types/links.types';
import { SEED_PAGES } from '../../data';

interface NotFoundLogsCardProps {
  logs: NotFound404LogItem[];
  onSendToPage?: (id: string, targetSlug: string) => void;
  onMarkNowhere?: (id: string) => void;
}

export const NotFoundLogsCard: React.FC<NotFoundLogsCardProps> = ({
  logs,
  onSendToPage,
  onMarkNowhere
}) => {
  const [selectedTargets, setSelectedTargets] = useState<Record<string, string>>({});

  const handleTargetChange = (id: string, slug: string) => {
    setSelectedTargets(prev => ({ ...prev, [id]: slug }));
  };

  const handleSend = (id: string) => {
    const slug = selectedTargets[id];
    if (!slug) return;
    onSendToPage?.(id, slug);
  };

  return (
    <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_1px_3px_rgba(26,22,18,0.02)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#efe7da] bg-[#fffefb]">
        <h3 className="font-serif text-lg font-normal text-[#1a1612]">
          Addresses people tried that led nowhere
        </h3>
        <p className="text-xs text-[#6e6358] mt-0.5">
          Read from the storefront’s Page not found log, most followed first: the address, how often, when last, and where people came from.
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-[#efe7da]">
        {logs.map(log => (
          <div key={log.id} className="p-4 hover:bg-[#f7f2ea]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono font-medium text-[#1a1612] bg-[#f7f2ea] px-2 py-0.5 rounded-[4px] border border-[#d9ccb6]">
                  {log.attemptedPath}
                </code>
                <span className="text-[11px] font-mono text-[#a4512f] bg-[#a4512f]/10 px-1.5 py-0.2 rounded font-medium">
                  {log.hitsCount} hits
                </span>
                <span className="text-[11px] text-[#6e6358]">
                  last {log.lastHitDate}
                </span>
              </div>
              <div className="text-[11px] text-[#6e6358]">
                Referrers: {log.referrers.join(', ')}
              </div>
            </div>

            {/* Actions: Choose page and Send or Mark nowhere */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedTargets[log.id] || log.suggestedRedirect || ''}
                onChange={e => handleTargetChange(log.id, e.target.value)}
                className="px-2.5 py-1.5 rounded-[6px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
              >
                <option value="">Choose target page...</option>
                {SEED_PAGES.filter(p => p.isBuilt).map(p => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.slug})
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleSend(log.id)}
                disabled={!selectedTargets[log.id] && !log.suggestedRedirect}
                className="px-3 py-1.5 rounded-[6px] text-xs font-medium bg-[#c9a96e] hover:bg-[#b89558] text-[#1a1612] disabled:opacity-40 transition-colors cursor-pointer"
              >
                Send
              </button>

              <button
                onClick={() => onMarkNowhere?.(log.id)}
                className="px-2.5 py-1.5 rounded-[6px] text-xs text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db] border border-[#d9ccb6] transition-colors cursor-pointer"
                title="Mark as meant to lead nowhere"
              >
                Meant to lead nowhere
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotFoundLogsCard;
