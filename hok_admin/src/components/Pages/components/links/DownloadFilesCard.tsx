/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: DownloadFilesCard (Spec §6.6)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { DownloadCloud, CheckCircle2, AlertTriangle, FileText, Upload, ExternalLink } from 'lucide-react';
import { DownloadFileItem } from '../../types';

interface DownloadFilesCardProps {
  files: DownloadFileItem[];
  onRepairFile?: (id: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const DownloadFilesCard: React.FC<DownloadFilesCardProps> = ({
  files,
  onRepairFile,
  onNavigateToPage
}) => {
  return (
    <div className="rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#e6dccb] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-[4px] bg-[#f5edd8] text-[#8a6a36]">
            <DownloadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-[#1a1612]">
              5. Files available to download
            </h3>
            <p className="text-[11px] text-[#6e6358] mt-0.5">
              Legal agreements, size matrices, and press kit downloads hosted on CDN storage.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#6e6358] bg-[#efe7db] px-2 py-0.5 rounded-[4px]">
          {files.length} downloads hosted
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-[#e6dccb]/70">
        {files.map(file => (
          <div key={file.id} className="p-4 hover:bg-[#f7f2ea]/40 transition-colors space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#8a6a36] shrink-0" />
                <span className="text-xs font-medium text-[#1a1612] truncate">
                  {file.fileName}
                </span>
                <span className="text-[11px] font-mono text-[#6e6358] bg-[#f7f2ea] px-1.5 py-0.5 rounded-[3px] border border-[#e6dccb]">
                  {file.fileSizeFormatted}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {file.checksumMatches ? (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#6b7e5a]/10 text-[#6b7e5a] border border-[#6b7e5a]/30 font-mono text-[10px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>CDN Checksum OK</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#a4512f]/10 text-[#a4512f] border border-[#a4512f]/30 font-mono text-[10px] font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>Asset Corrupt or Missing</span>
                  </span>
                )}

                {!file.checksumMatches && (
                  <button
                    onClick={() => onRepairFile?.(file.id)}
                    className="px-2.5 py-1 rounded-[4px] text-[11px] font-medium text-[#1a1612] bg-[#f7f2ea] border border-[#d9ccb6] hover:bg-[#efe7db] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Re-upload asset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footnote */}
            <div className="flex items-center justify-between text-[11px] text-[#6e6358]">
              <div className="flex items-center gap-1.5">
                <span>Appears on:</span>
                {file.usedOnPages.map(slug => (
                  <button
                    key={slug}
                    onClick={() => onNavigateToPage?.(slug)}
                    className="font-mono text-[10px] bg-[#fffefb] hover:bg-[#efe7db] text-[#5c5248] px-1.5 py-0.5 rounded-[3px] border border-[#e6dccb] transition-colors cursor-pointer"
                  >
                    {slug}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#b4a99e]">
                Updated {file.lastUpdated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadFilesCard;
