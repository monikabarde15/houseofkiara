/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureInspectorPanel (Spec §5.2 & §5.3, Pages 11 & 12)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState, useEffect } from 'react';
import { Lock, Clock, AlertCircle, ExternalLink, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { FigureItem } from '../../types';

interface FigureInspectorPanelProps {
  figure: FigureItem | null;
  onUpdateFigure?: (key: string, newValue: string) => void;
  onNavigateToPage?: (slug: string) => void;
  onClose?: () => void;
}

export const FigureInspectorPanel: React.FC<FigureInspectorPanelProps> = ({
  figure,
  onUpdateFigure,
  onNavigateToPage,
  onClose
}) => {
  const [inputValue, setInputValue] = useState('');
  const [changeTiming, setChangeTiming] = useState<'immediate' | 'date'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({
    '/shipping-policy': true,
    '/terms': true
  });

  useEffect(() => {
    if (figure) {
      setInputValue(String(figure.value));
      setReason('');
      setIsSaved(false);
    }
  }, [figure]);

  if (!figure) {
    return (
      <div className="p-8 text-center rounded-[8px] bg-[#fffefb] border border-[#e6dccb] text-[#6e6358] text-xs">
        Select a figure from the register to inspect its details.
      </div>
    );
  }

  const isValueModified = inputValue.trim() !== String(figure.value);
  const isLocked = figure.locked || figure.owner === 'By law' || figure.owner === 'Counted';

  const handleApplyChange = () => {
    if (!inputValue.trim() || isLocked) return;
    onUpdateFigure?.(figure.key, inputValue.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const togglePageExpand = (pageSlug: string) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageSlug]: !prev[pageSlug]
    }));
  };

  return (
    <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_1px_3px_rgba(26,22,18,0.03)] overflow-hidden flex flex-col">
      {/* 1. Header (Spec §5.2) */}
      <div className="p-5 border-b border-[#efe7da] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a6a36]">
            {figure.subject}
          </span>
          <div className="flex items-center gap-1.5">
            {figure.status === 'retired' && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#f8e3da] text-[#b85c38] border border-[#b85c38]/40">
                Retired
              </span>
            )}
            {figure.decisionRequired && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#f5edd8] text-[#8a6a36] border border-[#c9a96e]/60 border-dashed">
                Waiting for a decision
              </span>
            )}
            {figure.status === 'never-printed' && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#eee9f5] text-[#5b4a7a] border border-[#5b4a7a]/40">
                Never printed
              </span>
            )}
            {figure.status === 'waiting' && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#e3f0da] text-[#6e8d58] border border-[#6e8d58]/40">
                Change waiting
              </span>
            )}
          </div>
        </div>

        <h2 className="font-serif text-[26px] font-normal leading-tight text-[#1a1612]">
          {figure.label}
        </h2>

        <p className="text-xs text-[#5c5248] leading-relaxed">
          {figure.notes || 'Figure definition maintained across all published store clauses.'}
        </p>

        <div className="pt-1 flex items-baseline gap-2 text-xs">
          <span className="text-[#6e6358] text-[11px]">Name in the page files:</span>
          <code className="font-mono text-[11px] text-[#1a1612] bg-[#f7f2ea] px-1.5 py-0.5 rounded-[3px] border border-[#d9ccb6]">
            {figure.key}
          </code>
        </div>
      </div>

      <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-280px)] text-xs">
        {/* 2. Value Block by Owner (§5.3) */}
        <div className="p-4 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1a1612]">Value</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[3px] bg-[#fffefb] text-[#6e6358] border border-[#d9ccb6]">
              {figure.owner}
            </span>
          </div>

          {/* Set Here: Editable Input */}
          {figure.owner === 'Set here' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#6e6358] mb-1">
                  Prints as: <span className="font-serif text-sm text-[#1a1612] font-medium">{inputValue || figure.displayValue}</span>
                  {isValueModified && (
                    <span className="text-[#6e6358] ml-1.5">(instead of {figure.displayValue})</span>
                  )}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[6px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
                />
              </div>

              {/* If value differs, show When it changes and Why it is changing (Spec §5.4) */}
              {isValueModified && (
                <div className="pt-2 border-t border-[#efe7da] space-y-3">
                  <div>
                    <label className="block text-[11px] text-[#6e6358] mb-1">When it changes:</label>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="changeTiming"
                          checked={changeTiming === 'immediate'}
                          onChange={() => setChangeTiming('immediate')}
                          className="accent-[#8a6a36]"
                        />
                        <span className="text-xs text-[#1a1612]">As soon as it is published</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="changeTiming"
                          checked={changeTiming === 'date'}
                          onChange={() => setChangeTiming('date')}
                          className="accent-[#8a6a36]"
                        />
                        <span className="text-xs text-[#1a1612]">From a date</span>
                      </label>
                    </div>

                    {changeTiming === 'date' && (
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={e => setScheduledDate(e.target.value)}
                        className="mt-2 w-full px-2.5 py-1 rounded-[6px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612]"
                      />
                    )}

                    <p className="mt-1 text-[10.5px] text-[#6e6358] leading-tight">
                      Orders and bookings made before the change keep the figure they were made under.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6e6358] mb-1">
                      Why it is changing:
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="e.g. Revised courier rate agreement"
                      className="w-full px-3 py-1.5 rounded-[6px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleApplyChange}
                      className="flex-1 px-3 py-1.5 rounded-[6px] text-xs font-semibold bg-[#c9a96e] hover:bg-[#b89558] text-[#1a1612] transition-colors cursor-pointer shadow-xs"
                    >
                      {isSaved ? 'Change queued' : 'Add to changes'}
                    </button>
                    <button
                      onClick={() => setInputValue(String(figure.value))}
                      className="px-3 py-1.5 rounded-[6px] text-xs font-medium bg-[#fffefb] border border-[#d9ccb6] text-[#6e6358] hover:text-[#1a1612] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Site Settings Pointer */}
          {figure.owner === 'Site settings' && (
            <div className="space-y-2">
              <div className="font-serif text-[18px] text-[#1a1612]">
                {figure.displayValue}
              </div>
              <p className="text-[11.5px] text-[#6e6358] leading-relaxed">
                Set in Site Settings, because the header, the footer and the WhatsApp button print it too.
              </p>
              <button className="flex items-center gap-1.5 text-xs text-[#8a6a36] font-medium hover:underline pt-1">
                <span>Open Site Settings</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* By Law */}
          {figure.owner === 'By law' && (
            <div className="space-y-2">
              <div className="font-serif text-[18px] text-[#1a1612] flex items-center gap-2">
                <span>{figure.displayValue}</span>
                <Lock className="w-3.5 h-3.5 text-[#8a6a36]" />
              </div>
              <p className="text-[11.5px] text-[#6e6358] leading-relaxed">
                Fixed by statutory regulation (GST classification and DPDP Act compliance).
              </p>
            </div>
          )}

          {/* Counted */}
          {figure.owner === 'Counted' && (
            <div className="space-y-2">
              <div className="font-serif text-[18px] text-[#1a1612]">
                {figure.displayValue}
              </div>
              <p className="text-[11.5px] text-[#6e6358] leading-relaxed">
                Counted live from active database records. It cannot be typed or go out of date.
              </p>
            </div>
          )}

          {/* Each page */}
          {figure.owner === 'Each page' && (
            <div className="space-y-2">
              <div className="font-serif text-[18px] text-[#1a1612]">
                Per page
              </div>
              <p className="text-[11.5px] text-[#6e6358] leading-relaxed">
                Page dates and versions. Each page keeps its own with its versions, in its Page settings, set when published.
              </p>
            </div>
          )}
        </div>

        {/* 3. Retired Warning Banner (§5.2, Screen 05) */}
        {figure.status === 'retired' && (
          <div className="p-3.5 rounded-[6px] bg-[#f8e3da] border border-[#b85c38]/40 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b85c38]">
              Retired figure
            </span>
            <p className="text-[11.5px] text-[#5c5248]">
              {figure.notes || 'This figure has been retired from production circulation.'}
            </p>
          </div>
        )}

        {/* 3b. Waiting for a Decision (§5.2, §14.1) */}
        {figure.decisionRequired && (
          <div className="p-3.5 rounded-[6px] bg-[#f5edd8] border border-[#c9a96e]/60 border-dashed space-y-1">
            <span className="text-[11px] font-semibold text-[#8a6a36]">
              Decision pending
            </span>
            <p className="text-[11.5px] text-[#5c5248]">
              {figure.notes || 'Awaiting executive sign-off before entering production circulation.'}
            </p>
          </div>
        )}

        {/* 3c. Legacy Page File Mappings (§14.3) */}
        {figure.legacyValues && figure.legacyValues.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1a1612]">Values in legacy page files</span>
              <span className="text-[10px] text-[#8a6a36] font-medium bg-[#f5edd8] px-1.5 py-0.5 rounded">§14.3 Audit</span>
            </div>
            <div className="space-y-1.5">
              {figure.legacyValues.map((lv, idx) => (
                <div key={idx} className="p-2.5 rounded-[6px] bg-[#fffefb] border border-[#e6dccb] text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="font-mono text-[10.5px] text-[#1a1612] bg-[#f7f2ea] px-1 rounded">{lv.file}</code>
                    <span className={`text-[9.5px] px-1 py-0.2 rounded font-medium ${
                      lv.kind === 'Retired figure' ? 'bg-[#f8e3da] text-[#b85c38]' :
                      lv.kind === 'Waiting for a decision' ? 'bg-[#f5edd8] text-[#8a6a36]' :
                      'bg-[#eee9f5] text-[#5b4a7a]'
                    }`}>
                      {lv.kind}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] pt-0.5">
                    <div>
                      <span className="text-[#8c827a] block text-[10px]">The file says:</span>
                      <span className="font-mono text-[#b85c38] font-medium">{lv.fileSays}</span>
                    </div>
                    <div>
                      <span className="text-[#8c827a] block text-[10px]">The figure is:</span>
                      <span className="font-mono text-[#6e8d58] font-medium">{String(figure.value)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Where customers read it (§5.2) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1a1612]">Where customers read it</span>
            <span className="text-[#6e6358] text-[11px]">
              {figure.reachCount} places · {figure.reachPages?.length || 1} pages
            </span>
          </div>

          {figure.reachPages && figure.reachPages.length > 0 ? (
            <div className="space-y-2">
              {figure.reachPages.map(pageSlug => {
                const isOpen = expandedPages[pageSlug] !== false;
                return (
                  <div key={pageSlug} className="rounded-[6px] border border-[#e6dccb] bg-[#fffefb] overflow-hidden">
                    <button
                      onClick={() => togglePageExpand(pageSlug)}
                      className="w-full px-3 py-2 bg-[#f7f2ea] flex items-center justify-between text-left text-xs font-medium text-[#1a1612] hover:bg-[#efe7db] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#6e6358]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6e6358]" />}
                        <code className="font-mono text-[11px]">{pageSlug}</code>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onNavigateToPage?.(pageSlug);
                        }}
                        className="text-[10px] text-[#8a6a36] hover:underline flex items-center gap-0.5"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </button>

                    {isOpen && (
                      <div className="p-3 text-[11.5px] text-[#5c5248] leading-relaxed border-t border-[#efe7da] space-y-2 bg-[#fffefb]">
                        <p>
                          Orders qualifying over <span className="bg-[#f5edd8] text-[#8a6a36] px-1 py-0.2 rounded font-medium">{figure.displayValue}</span> receive complimentary express doorstep dispatch.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[11.5px] text-[#6e6358]">
              No page prints it. Add it to a sentence with Add a figure, in the bar above the words.
            </p>
          )}
        </div>

        {/* 5. What it drives behind the scenes (§5.2, Appendix A) */}
        <div className="space-y-1.5 pt-1">
          <span className="font-semibold text-xs text-[#1a1612]">What it drives behind the scenes</span>
          <div className="p-3 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] text-[11.5px] text-[#5c5248] space-y-1">
            {figure.drives && figure.drives.length > 0 ? (
              figure.drives.map((driveItem, dIdx) => (
                <p key={dIdx}>• {driveItem}</p>
              ))
            ) : (
              <p className="text-[#8c827a] italic">Nothing outside the pages</p>
            )}
          </div>
        </div>

        {/* 6. History (§5.2) */}
        <div className="space-y-2 pt-1 border-t border-[#efe7da]">
          <span className="font-semibold text-xs text-[#1a1612]">History</span>
          <div className="space-y-1.5 text-[11px] text-[#6e6358]">
            <div className="flex items-center justify-between">
              <span>{figure.displayValue} (Current)</span>
              <span>12 Oct 2026 · Aman S.</span>
            </div>
            <div className="flex items-center justify-between text-[#b4a99e]">
              <span>Previous initial baseline</span>
              <span>01 Sep 2026 · System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigureInspectorPanel;
