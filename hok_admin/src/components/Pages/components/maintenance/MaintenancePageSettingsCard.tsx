/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: MaintenancePageSettingsCard (Spec §8.20 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { MAINTENANCE_SCENARIOS } from '../../data/maintenanceData';

export const MaintenancePageSettingsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'sla' | 'sitesettings'>('scenarios');

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
          Scenarios (3)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sla')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'sla'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Concierge SLA
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sitesettings')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'sitesettings'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Site status switch
        </button>
      </div>

      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Holding Page Scenarios
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            The maintenance holding page adapts its status copy based on whether work is planned with a target time, running late, or handling an unexpected outage.
          </p>
          <div className="space-y-2 pt-1">
            {MAINTENANCE_SCENARIOS.map((sc, idx) => (
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
                  Notice: “{sc.statusText}”
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sla' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Concierge Operating Hours
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            While the website is paused, customers with upcoming bookings or orders can reach the team directly over WhatsApp.
          </p>
          <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-2">
            <div className="flex justify-between items-center text-[11.5px]">
              <span className="text-[#73675a]">Hours we answer</span>
              <span className="font-medium text-[#1a1612]">10 AM to 8 PM IST</span>
            </div>
            <div className="flex justify-between items-center text-[11.5px]">
              <span className="text-[#73675a]">Days we answer</span>
              <span className="font-medium text-[#1a1612]">Seven days a week</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sitesettings' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Site Settings Link
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            The switch to take the site down, set the expected back time, and manage the allow list of IP addresses lives in Site Settings under Site status.
          </p>
          <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px]">
            <span className="text-[11px] text-[#5c5248]">
              Location: <strong>Site Settings → Site status → Maintenance mode</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePageSettingsCard;
