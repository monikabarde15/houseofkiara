/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsAddressCard (Spec §7.9, Screen 29)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../types';

interface PageSettingsAddressCardProps {
  page: PageCardData;
}

export const PageSettingsAddressCard: React.FC<PageSettingsAddressCardProps> = ({
  page
}) => {
  const [oldAddresses, setOldAddresses] = useState<Array<{ id: string; path: string; enabled: boolean }>>([
    { id: 'oa_1', path: '/cancellation-policy', enabled: true },
    { id: 'oa_2', path: '/return-refund', enabled: true },
    { id: 'oa_3', path: '/help/returns', enabled: false }
  ]);

  const [newOldAddress, setNewOldAddress] = useState('');
  const [addingOld, setAddingOld] = useState(false);

  const inboundLinks = [
    { label: 'Site header navigation', location: 'Site Settings › Navigation' },
    { label: 'Site footer legal column', location: 'Site Settings › Footer' },
    { label: 'Cart checkout agreement checkbox', location: 'Checkout Page' },
    { label: 'Popular questions on Help & FAQs', location: 'Help & FAQs' }
  ];

  const handleToggleOld = (id: string) => {
    setOldAddresses(prev =>
      prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleRemoveOld = (id: string) => {
    setOldAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleAddOld = () => {
    if (!newOldAddress.trim()) return;
    const formatted = newOldAddress.startsWith('/') ? newOldAddress.trim() : `/${newOldAddress.trim()}`;
    setOldAddresses(prev => [...prev, { id: `oa_${Date.now()}`, path: formatted, enabled: true }]);
    setNewOldAddress('');
    setAddingOld(false);
  };

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-6 text-xs text-[#1a1612]">
      {/* 1. Header */}
      <div className="border-b border-[#f0eae1] pb-3">
        <h3 className="font-serif text-[18px] text-[#1a1612]">
          Address
        </h3>
        <p className="text-[11.5px] text-[#73675a] mt-0.5">
          Canonical web path, redirect aliases, and all internal links pointing here.
        </p>
      </div>

      {/* 2. Canonical Address */}
      <div className="space-y-2">
        <label className="block text-[11px] font-medium text-[#73675a]">
          Answers on
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`/${page.slug}`}
            className="flex-1 p-2 bg-[#f5f1eb] border border-[#e6dccb] rounded-[5px] text-xs text-[#3d362e] font-mono cursor-not-allowed"
          />
          <span className="text-[11px] px-2.5 py-1 rounded bg-[#eef7ee] text-[#2c5e2e] font-medium border border-[#bcdbb8]">
            Fixed
          </span>
        </div>
        <p className="text-[10.5px] text-[#8a7f73]">
          Fixed once the page is live. To move it, give it a new address and keep this one as an old address below.
        </p>
        <p className="text-[10.5px] text-[#8a7f73]">
          Page file key: <code className="text-[#3d362e] bg-[#f5f1eb] px-1 py-0.5 rounded font-mono">{page.pageFile || `hok_${page.slug}_v1`}</code>
        </p>
      </div>

      {/* 3. Old addresses that lead here */}
      <div className="space-y-3 pt-3 border-t border-[#f0eae1]">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Old addresses that lead here
          </div>
          {!addingOld && (
            <button
              type="button"
              onClick={() => setAddingOld(true)}
              className="text-xs text-[#8a6a36] hover:underline font-medium"
            >
              + Add an old address
            </button>
          )}
        </div>

        {addingOld && (
          <div className="p-3 bg-[#fcfaf7] border border-[#e6dccb] rounded-[6px] flex items-center gap-2">
            <input
              type="text"
              value={newOldAddress}
              onChange={e => setNewOldAddress(e.target.value)}
              placeholder="/old-path-name"
              autoFocus
              className="flex-1 p-1.5 bg-white border border-[#e6dccb] rounded text-xs text-[#1a1612]"
            />
            <button
              type="button"
              onClick={handleAddOld}
              className="px-2.5 py-1.5 bg-[#1a1612] text-white rounded text-xs font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setAddingOld(false)}
              className="px-2 py-1.5 text-xs text-[#73675a] hover:text-[#1a1612]"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          {oldAddresses.map(addr => (
            <div key={addr.id} className="flex items-center justify-between p-2.5 rounded bg-[#fcfaf7] border border-[#ebe5dc]">
              <span className="font-mono text-[11.5px] text-[#3d362e]">
                {addr.path}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleOld(addr.id)}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                    addr.enabled ? 'bg-[#eef7ee] text-[#2c5e2e]' : 'bg-[#f0eae1] text-[#73675a]'
                  }`}
                >
                  {addr.enabled ? 'Redirecting' : 'Off'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveOld(addr.id)}
                  className="text-xs text-[#993d3d] hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Everything on the site that links here */}
      <div className="space-y-2 pt-3 border-t border-[#f0eae1]">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Everything on the site that links here ({inboundLinks.length})
        </div>
        <div className="space-y-1.5">
          {inboundLinks.map(link => (
            <div key={link.label} className="flex items-center justify-between p-2 rounded bg-[#faf7f2] border border-[#ebe5dc]">
              <div>
                <div className="font-medium text-[#1a1612]">{link.label}</div>
                <div className="text-[10.5px] text-[#8a7f73]">{link.location}</div>
              </div>
              <span className="text-[11px] text-[#8a6a36] font-medium hover:underline cursor-pointer">
                Open
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSettingsAddressCard;
