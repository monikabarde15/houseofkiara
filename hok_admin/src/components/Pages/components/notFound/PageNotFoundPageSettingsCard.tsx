/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PageNotFoundPageSettingsCard (Spec § 8.18 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { NOT_FOUND_SCENARIOS, NOT_FOUND_QUIET_LINKS } from '../../data/pageNotFoundData';

export const PageNotFoundPageSettingsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'search' | 'concierge'>('scenarios');

  return (
    <div className="space-y-6 text-xs">
      {/* Subtab navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#ebe5dc] pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('scenarios')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'scenarios'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Scenarios (5)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'search'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Search &amp; Links
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('concierge')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'concierge'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Concierge
        </button>
      </div>

      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Automatic Scenario Detection
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            The 404 page analyzes the incoming URL. If it matches a sold piece, gone piece or search keywords, it adapts its copy and recommendations automatically.
          </p>
          <div className="space-y-2 pt-1">
            {NOT_FOUND_SCENARIOS.map((sc, idx) => (
              <div
                key={sc.id}
                className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1a1612]">
                    {idx + 1}. {sc.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#935b1e] uppercase">
                    {sc.id}
                  </span>
                </div>
                <div className="text-[#73675a] text-[11px] leading-relaxed">
                  Heading: "{sc.headingPrefix}{sc.headingGoldItalic}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Quiet Navigation Links
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            Four quiet fallback links displayed at the base of the framed card.
          </p>
          <div className="space-y-1.5 pt-1">
            {NOT_FOUND_QUIET_LINKS.map((link) => (
              <div
                key={link.label}
                className="p-2.5 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] flex items-center justify-between text-[11.5px]"
              >
                <span className="text-[#1a1612] font-medium">{link.label}</span>
                <span className="text-[10px] font-mono text-[#8a7f73]">
                  {link.href}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#f5f1eb] space-y-2">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Default Search Suggestion
            </div>
            <p className="text-[11.5px] text-[#73675a] leading-relaxed">
              When a piece category or designer is identified in the URL, a search suggestion link is printed. Default fallback is "Sabyasachi lehenga".
            </p>
          </div>
        </div>
      )}

      {activeTab === 'concierge' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            WhatsApp Concierge Message
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            The button launches WhatsApp with a prefilled message containing the piece name or URL so the visitor does not have to retype it.
          </p>
          <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1.5">
            <div className="font-semibold text-[#1a1612]">WhatsApp Message Template</div>
            <p className="text-[11px] font-mono text-[#57534e] leading-relaxed bg-white p-2 rounded border border-[#ebe5dc]">
              Hello House of Kaira, I was looking for a piece which is no longer available. Could you help me find something like it?
            </p>
          </div>
          <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
            <div className="font-semibold text-[#1a1612]">Hours We Answer</div>
            <div className="text-[#73675a] text-[11px]">Seven days a week, 10 AM to 8 PM IST.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageNotFoundPageSettingsCard;
