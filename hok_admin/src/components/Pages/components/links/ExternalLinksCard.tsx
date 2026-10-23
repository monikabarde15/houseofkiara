/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ExternalLinksCard (Spec §6.2)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { ExternalLinkItem } from '../../types';

interface ExternalLinksCardProps {
  links: ExternalLinkItem[];
  onFixLink?: (id: string, newUrl: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const ExternalLinksCard: React.FC<ExternalLinksCardProps> = ({
  links,
  onFixLink,
  onNavigateToPage
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedUrl, setEditedUrl] = useState('');

  const getStatusBadge = (item: ExternalLinkItem) => {
    switch (item.health) {
      case 'broken':
        return (
          <span className="px-2 py-0.5 rounded-[4px] bg-[#a4512f]/10 text-[#a4512f] border border-[#a4512f]/30 font-mono text-[10px] font-semibold flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>HTTP {item.statusCode} ({item.statusText})</span>
          </span>
        );
      case 'redirect':
        return (
          <span className="px-2 py-0.5 rounded-[4px] bg-[#d19a3c]/10 text-[#d19a3c] border border-[#d19a3c]/30 font-mono text-[10px] font-semibold flex items-center gap-1">
            <RefreshCw className="w-2.5 h-2.5" />
            <span>HTTP {item.statusCode} Redirect</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-[4px] bg-[#6b7e5a]/10 text-[#6b7e5a] border border-[#6b7e5a]/30 font-mono text-[10px] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>200 OK · {item.responseTimeMs}ms</span>
          </span>
        );
    }
  };

  const handleStartEdit = (item: ExternalLinkItem) => {
    setEditingId(item.id);
    setEditedUrl(item.url);
  };

  const handleSaveEdit = (id: string) => {
    if (!editedUrl.trim()) return;
    onFixLink?.(id, editedUrl.trim());
    setEditingId(null);
  };

  return (
    <div className="rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-[#e6dccb] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-[4px] bg-[#f5edd8] text-[#8a6a36]">
            <ExternalLink className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-[#1a1612]">
              1. Links leaving houseofkiara.com
            </h3>
            <p className="text-[11px] text-[#6e6358] mt-0.5">
              Outbound third-party URLs monitored for uptime, redirects, and SSL certificate validity.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#6e6358] bg-[#efe7db] px-2 py-0.5 rounded-[4px]">
          {links.length} links checked
        </span>
      </div>

      {/* Links List */}
      <div className="divide-y divide-[#e6dccb]/70">
        {links.map(link => {
          const isEditing = editingId === link.id;

          return (
            <div key={link.id} className="p-4 hover:bg-[#f7f2ea]/40 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-xs text-[#1a1612] truncate">
                    {link.domain}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-[#8a6a36] hover:underline truncate max-w-sm flex items-center gap-1"
                  >
                    <span>{link.url}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(link)}
                  {link.health !== 'ok' && !isEditing && (
                    <button
                      onClick={() => handleStartEdit(link)}
                      className="px-2.5 py-1 rounded-[4px] text-[11px] font-medium text-[#1a1612] bg-[#f7f2ea] border border-[#d9ccb6] hover:bg-[#efe7db] transition-colors cursor-pointer"
                    >
                      Update URL
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Edit Bar */}
              {isEditing && (
                <div className="p-3 rounded-[6px] bg-[#f5edd8]/40 border border-[#c9a96e]/40 flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    value={editedUrl}
                    onChange={e => setEditedUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-[4px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
                    placeholder="Enter valid replacement URL..."
                  />
                  <button
                    onClick={() => handleSaveEdit(link.id)}
                    className="px-3 py-1 rounded-[4px] bg-[#8a6a36] text-white font-medium hover:bg-[#70552b] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2.5 py-1 rounded-[4px] text-[#6e6358] hover:text-[#1a1612] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Connected Pages Footnote */}
              <div className="flex items-center gap-2 text-[11px] text-[#6e6358]">
                <span>Used on:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {link.usedOnPages.map(slug => (
                    <button
                      key={slug}
                      onClick={() => onNavigateToPage?.(slug)}
                      className="font-mono text-[10px] bg-[#fffefb] hover:bg-[#efe7db] text-[#5c5248] px-1.5 py-0.5 rounded-[3px] border border-[#e6dccb] transition-colors cursor-pointer"
                    >
                      {slug}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#b4a99e] ml-auto">
                  Checked: {link.lastChecked}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExternalLinksCard;
