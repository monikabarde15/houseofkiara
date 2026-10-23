/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsDrawer (Spec §7.9, Screens 28–30)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../../types';
import { X, Globe, Share2, MapPin, History, Plus, Trash2, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface PageSettingsDrawerProps {
  page: PageCardData;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: any) => void;
  onMarkReviewedToday?: () => void;
  onReadAsOnDate?: (date: string) => void;
  accessLevel?: 'Full Access' | 'Edit' | 'View Only';
}

export const PageSettingsDrawer: React.FC<PageSettingsDrawerProps> = ({
  page,
  isOpen,
  onClose,
  onSave,
  onMarkReviewedToday,
  onReadAsOnDate,
  accessLevel = 'Full Access'
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'address' | 'versions'>('search');
  const [asOnDateInput, setAsOnDateInput] = useState('15 September 2026');
  const [reviewedStamped, setReviewedStamped] = useState(false);

  // Search & sharing fields
  const [metaTitle, setMetaTitle] = useState(
    `${page.title} | House of Kiara`
  );
  const [metaDescription, setMetaDescription] = useState(page.summary);
  const [allowIndexing, setAllowIndexing] = useState(page.group !== 'system');
  const [canonicalAddress, setCanonicalAddress] = useState('');
  const [sharingAltText, setSharingAltText] = useState(`House of Kiara ${page.title} overview`);

  // Address fields
  const [oldAddresses, setOldAddresses] = useState([
    { id: '1', slug: `${page.slug}-old`, isEnabled: true },
    { id: '2', slug: `${page.slug}-v1`, isEnabled: false }
  ]);
  const [newOldAddress, setNewOldAddress] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Versions history (§10.5, Screen 30)
  const versionsList = [
    {
      version: page.version,
      date: page.lastPublished,
      author: 'Mohan Sharma',
      summary: 'Current live version, aligned with legal disclosures and figure registers.'
    },
    {
      version: 'v4',
      date: '12 Sep 2026',
      author: 'Mohan Sharma',
      summary: 'Updated concierge support SLA and courier transit durations.'
    },
    {
      version: 'v3',
      date: '04 Aug 2026',
      author: 'Pooja Mehta',
      summary: 'Initial revision for autumn festive collections.'
    }
  ];

  const handleAddOldAddress = () => {
    if (!newOldAddress.trim()) return;
    const formatted = newOldAddress.startsWith('/') ? newOldAddress.trim() : `/${newOldAddress.trim()}`;
    setOldAddresses(prev => [...prev, { id: String(Date.now()), slug: formatted, isEnabled: true }]);
    setNewOldAddress('');
    setIsAddingAddress(false);
  };

  const handleToggleOldAddress = (id: string) => {
    setOldAddresses(prev => prev.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a));
  };

  const handleRemoveOldAddress = (id: string) => {
    setOldAddresses(prev => prev.filter(a => a.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1612]/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#fffefb] border-l border-[#e6dccb] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#e6dccb] flex items-center justify-between bg-[#fffefb]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#6e6358]">
              {page.slug}
            </div>
            <h2 className="text-lg font-serif font-bold text-[#1a1612]">
              Page settings: Everything that is not on the page itself
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db] transition-colors cursor-pointer"
            title="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#e6dccb] flex gap-6 text-xs bg-[#fcfaf7]">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-3 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'border-[#8a6a36] text-[#8a6a36] font-semibold'
                : 'border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search & sharing (Screen 29)</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`py-3 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'address'
                ? 'border-[#8a6a36] text-[#8a6a36] font-semibold'
                : 'border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Address</span>
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`py-3 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'versions'
                ? 'border-[#8a6a36] text-[#8a6a36] font-semibold'
                : 'border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Versions (Screen 30)</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* ===================== TAB 1: SEARCH & SHARING ===================== */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* In a search result */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
                  In a search result
                </h3>

                {/* Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#1a1612] font-medium">Title</label>
                    <span className={`text-[11px] font-mono ${metaTitle.length > 60 ? 'text-[#a4512f] font-semibold' : 'text-[#6e6358]'}`}>
                      {metaTitle.length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={e => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#6e6358]">
                    About 60 characters is all Google shows. The separator and the site name in it are figures, set in Site Settings.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#1a1612] font-medium">Description</label>
                    <span className={`text-[11px] font-mono ${metaDescription.length > 155 ? 'text-[#a4512f] font-semibold' : 'text-[#6e6358]'}`}>
                      {metaDescription.length} / 155 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none leading-relaxed"
                  />
                  <p className="text-[11px] text-[#6e6358]">
                    About 155 characters. Leave it empty and Google writes its own.
                  </p>
                </div>

                {/* Switch: Let search engines list this page */}
                <div className="p-3 bg-[#fcfaf7] rounded-[4px] border border-[#efe7da] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-[#1a1612]">Let search engines list this page</span>
                    <p className="text-[11px] text-[#6e6358]">
                      {allowIndexing ? 'Listed.' : 'Asked not to list it. Right for system pages.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowIndexing(!allowIndexing)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      allowIndexing ? 'bg-[#8a6a36]' : 'bg-[#d9ccb6]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        allowIndexing ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Canonical */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#1a1612] font-medium">Canonical address</label>
                  <input
                    type="text"
                    value={canonicalAddress}
                    onChange={e => setCanonicalAddress(e.target.value)}
                    placeholder="https://houseofkaira.com/..."
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#6e6358]">
                    If this page repeats another: the address search engines should find instead, empty unless it does.
                  </p>
                </div>
              </div>

              {/* When the link is shared */}
              <div className="space-y-4 pt-4 border-t border-[#efe7da]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
                  When the link is shared
                </h3>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-[#1a1612]">Sharing picture</span>
                  <div className="p-4 rounded-[4px] border-2 border-dashed border-[#d9ccb6] bg-[#fcfaf7] flex flex-col items-center justify-center text-center gap-2">
                    <ImageIcon className="w-8 h-8 text-[#8a6a36]" />
                    <span className="text-xs font-medium text-[#1a1612]">Landscape, 1200 by 630</span>
                    <span className="text-[11px] text-[#6e6358]">
                      Without one the card shows only the words.
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#1a1612] font-medium">Alt text for sharing image</label>
                  <input
                    type="text"
                    value={sharingAltText}
                    onChange={e => setSharingAltText(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
                  />
                </div>
              </div>

              {/* Previews */}
              <div className="space-y-4 pt-4 border-t border-[#efe7da]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
                  Search & social card preview
                </h3>

                {/* Google snippet preview */}
                <div className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1 shadow-xs">
                  <div className="text-[11px] text-[#202124] flex items-center gap-1.5 font-sans">
                    <span className="font-semibold">houseofkaira.com</span>
                    <span>›</span>
                    <span className="text-[#5f6368]">{page.slug.replace('/', '')}</span>
                  </div>
                  <div className="text-base text-[#1a0dab] hover:underline cursor-pointer font-sans truncate">
                    {metaTitle}
                  </div>
                  <p className="text-xs text-[#4d5156] font-sans line-clamp-2 leading-relaxed">
                    {metaDescription}
                  </p>
                </div>

                {/* Social Card Preview */}
                <div className="rounded-[4px] border border-[#e6dccb] overflow-hidden bg-[#fffefb] shadow-xs">
                  <div className="h-32 bg-[#efe7db] flex items-center justify-center text-[#8a6a36]">
                    <span className="font-serif text-lg font-bold">House of Kiara</span>
                  </div>
                  <div className="p-3 space-y-1 bg-[#fffefb]">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#6e6358]">
                      houseofkaira.com
                    </span>
                    <div className="font-semibold text-xs text-[#1a1612] truncate">
                      {metaTitle}
                    </div>
                    <p className="text-[11px] text-[#5c5248] line-clamp-2">
                      {metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: ADDRESS ===================== */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              {/* Current Address */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
                  The address
                </label>
                <div className="p-3 rounded-[3px] bg-[#fcfaf7] border border-[#d9ccb6] flex items-center justify-between text-xs">
                  <span className="font-mono text-[#1a1612] font-semibold">{page.slug}</span>
                  <span className="text-[11px] text-[#6e6358]">Answers on, fixed once live</span>
                </div>
                <p className="text-[11px] text-[#6e6358]">
                  To move it, give it a new address and keep this one as an old address below.
                </p>
                <div className="text-[11px] text-[#6e6358] pt-1">
                  Built from page file: <code className="font-mono text-[#8a6a36] bg-[#efe7db] px-1.5 py-0.5 rounded-[2px]">{page.builtFrom || 'hok_page'}</code>
                </div>
              </div>

              {/* Old addresses that lead here */}
              <div className="space-y-3 pt-4 border-t border-[#efe7da]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
                    Old addresses that lead here
                  </label>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="text-xs text-[#8a6a36] hover:text-[#1a1612] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add an old address</span>
                    </button>
                  )}
                </div>

                {isAddingAddress && (
                  <div className="p-3 bg-[#fcfaf7] rounded-[4px] border border-[#d9ccb6] space-y-2 animate-in fade-in">
                    <input
                      type="text"
                      value={newOldAddress}
                      onChange={e => setNewOldAddress(e.target.value)}
                      placeholder="/legacy-slug"
                      className="w-full px-3 py-1.5 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612] focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="px-2.5 py-1 text-xs text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddOldAddress}
                        className="px-3 py-1 text-xs bg-[#8a6a36] text-white rounded-[3px] font-semibold cursor-pointer"
                      >
                        Save address
                      </button>
                    </div>
                  </div>
                )}

                <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
                  {oldAddresses.map(old => (
                    <div key={old.id} className="p-3 flex items-center justify-between bg-[#fffefb]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#1a1612]">{old.slug}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                          old.isEnabled ? 'bg-[#6b7e5a]/10 text-[#6b7e5a]' : 'bg-[#efe7db] text-[#6e6358]'
                        }`}>
                          {old.isEnabled ? 'Redirect active' : 'Switched off'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleOldAddress(old.id)}
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            old.isEnabled ? 'bg-[#8a6a36]' : 'bg-[#d9ccb6]'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              old.isEnabled ? 'translate-x-3' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleRemoveOldAddress(old.id)}
                          className="text-[#6e6358] hover:text-[#a4512f] cursor-pointer p-1"
                          title="Remove address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Everything on the site that links here */}
              <div className="space-y-3 pt-4 border-t border-[#efe7da]">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
                  Everything on the site that links here
                </label>
                <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
                  <div className="p-3 flex items-center justify-between bg-[#fffefb]">
                    <div className="space-y-0.5">
                      <span className="font-medium text-[#1a1612]">Footer Atelier Column</span>
                      <span className="text-[11px] text-[#6e6358] block">Site Settings › Navigation › Footer</span>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs rounded-[3px] border border-[#d9ccb6] hover:bg-[#efe7db] text-[#1a1612] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3 text-[#6e6358]" />
                    </button>
                  </div>

                  <div className="p-3 flex items-center justify-between bg-[#fffefb]">
                    <div className="space-y-0.5">
                      <span className="font-medium text-[#1a1612]">Help & FAQs Related Links</span>
                      <span className="text-[11px] text-[#6e6358] block">Pages › /faqs › Part 07 Full policies</span>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs rounded-[3px] border border-[#d9ccb6] hover:bg-[#efe7db] text-[#1a1612] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3 text-[#6e6358]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: VERSIONS (Spec §10.5, Screen 30) ===================== */}
          {activeTab === 'versions' && (
            <div className="space-y-6">
              {/* Note on legal policy versions (Spec §10.5) */}
              <div className="p-3.5 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] text-xs text-[#5c5248] space-y-1.5 leading-relaxed">
                <span className="font-semibold text-[#1a1612] block">Policy version principle</span>
                <p>
                  A customer is held to the version of a policy in force when she ordered. Every published change makes a new version, dated, with what changed in plain words. A change to a figure the page prints counts too, dated the day the figure changes.
                </p>
              </div>

              {/* This Version Block (Spec §10.5) */}
              <div className="p-4 bg-white border border-[#d9ccb6] rounded-[2px] space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                  This version
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#6e6358] block">Current version</span>
                    <span className="font-mono font-bold text-[#1a1612] text-sm">
                      Version {page.version.replace('v', '')}
                    </span>
                    <span className="text-[10px] text-[#8a8075] block mt-0.5">
                      {page.slug === '/terms' ? 'Advances by 0.1 on publish' : 'Counted by the panel'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6e6358] block">Last updated</span>
                    <span className="text-[#1a1612] font-medium">
                      {page.lastPublished}
                    </span>
                    <span className="text-[10px] text-[#8a8075] block mt-0.5">
                      Stamped when published
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6e6358] block">In force from</span>
                    <span className="text-[#1a1612] font-medium">
                      {page.lastPublished}
                    </span>
                    <span className="text-[10px] text-[#8a8075] block mt-0.5">
                      Orders before keep old version
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6e6358] block">Last reviewed</span>
                    <span className="text-[#1a1612] font-medium">
                      {reviewedStamped ? 'Today, 20 Oct 2026' : '18 Oct 2026'}
                    </span>
                    <span className="text-[10px] text-[#8a8075] block mt-0.5">
                      Printed in the fine print
                    </span>
                  </div>
                </div>

                {/* Mark as reviewed today button (§10.4 & §10.5) */}
                <div className="pt-3 border-t border-[#efe7da] flex items-center justify-between">
                  <span className="text-[11px] text-[#6e6358]">
                    {accessLevel === 'Full Access'
                      ? 'Stamps review date without making a new version.'
                      : 'Requires Full Access to stamp review date.'}
                  </span>

                  {accessLevel === 'Full Access' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setReviewedStamped(true);
                        onMarkReviewedToday?.();
                      }}
                      className="px-3 py-1.5 bg-[#f7f2ea] hover:bg-[#ede4d4] border border-[#d9ccb6] text-xs font-semibold text-[#8a6a36] rounded cursor-pointer transition-colors"
                    >
                      {reviewedStamped ? 'Marked as reviewed' : 'Mark as reviewed today'}
                    </button>
                  ) : (
                    <span className="text-xs text-[#8a8075] italic">Full Access only</span>
                  )}
                </div>
              </div>

              {/* Read it as on a date Block (Spec §10.6, Screen 31) */}
              <div className="p-4 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] space-y-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36] block">
                    Read it as on a date
                  </span>
                  <p className="text-xs text-[#6e6358] mt-0.5">
                    For a dispute about what this policy said when a customer booked.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={asOnDateInput}
                    onChange={e => setAsOnDateInput(e.target.value)}
                    placeholder="e.g. 15 September 2026"
                    className="flex-1 px-3 py-1.5 bg-white border border-[#d9ccb6] rounded text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onReadAsOnDate?.(asOnDateInput);
                      onClose();
                    }}
                    className="px-4 py-1.5 bg-[#8a6a36] hover:bg-[#72572c] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                  >
                    Read it
                  </button>
                </div>
              </div>

              {/* Every Version, newest first (Spec §10.5) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#e6dccb] pb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                    Every version, newest first ({versionsList.length})
                  </span>
                </div>

                <div className="space-y-3">
                  {versionsList.map((ver, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-[2px] border space-y-2 ${
                        idx === 0
                          ? 'bg-[#fcfaf7] border-[#8a6a36]/50 shadow-xs'
                          : 'bg-[#fffefb] border-[#e6dccb]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1a1612]">
                            Version {ver.version.replace('v', '')}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#6b7e5a]/10 text-[#6b7e5a] font-semibold">
                              In force today
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#6e6358]">
                          {ver.date} · {ver.author}
                        </span>
                      </div>

                      <p className="text-xs text-[#5c5248] leading-relaxed">
                        {ver.summary}
                      </p>

                      <div className="pt-2 border-t border-[#efe7da] flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            onReadAsOnDate?.(ver.date);
                            onClose();
                          }}
                          className="text-[#8a6a36] hover:underline cursor-pointer"
                        >
                          View words as on this date
                        </button>
                        <span className="text-[10px] text-[#8a8075]">Permanent record</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[#e6dccb] bg-[#fffefb] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-[3px] border border-[#d9ccb6] hover:bg-[#efe7db] text-xs font-medium text-[#1a1612] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.({ metaTitle, metaDescription, allowIndexing, canonicalAddress, oldAddresses });
              onClose();
            }}
            className="px-4 py-1.5 rounded-[3px] bg-[#8a6a36] hover:bg-[#70552b] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSettingsDrawer;