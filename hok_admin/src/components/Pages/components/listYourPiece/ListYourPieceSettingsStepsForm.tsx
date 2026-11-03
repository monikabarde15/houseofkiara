/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceSettingsStepsForm (Spec §8.8 Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';

interface ListYourPieceSettingsStepsFormProps {
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  onNavigateToLYP?: () => void;
}

export const ListYourPieceSettingsStepsForm: React.FC<ListYourPieceSettingsStepsFormProps> = ({
  hiddenParts,
  onTogglePartHidden,
  onNavigateToLYP
}) => {
  const [selectedFormTab, setSelectedFormTab] = useState<'details' | 'piece' | 'photos' | 'pref' | 'submit'>('details');

  return (
    <div className="space-y-6">
      {/* 04 How It Works Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 04 · How It Works</div>
            <div className="text-[11px] text-[#73675a]">Five steps from submission to payout</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['how-it-works']}
              onChange={() => onTogglePartHidden('how-it-works')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="p-3 bg-[#fbf9f5] border border-[#e6d8b5] rounded-[6px] flex items-center justify-between">
          <div className="text-[11px] text-[#5c5248]">
            Everything the form sends arrives in <strong className="text-[#1a1612]">LYP Submissions</strong>.
          </div>
          {onNavigateToLYP && (
            <button
              type="button"
              onClick={onNavigateToLYP}
              className="text-[#8a6a36] font-medium hover:underline text-[11px] cursor-pointer"
            >
              Open LYP Submissions →
            </button>
          )}
        </div>
      </div>

      {/* 05 Earnings preview Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 05 · Earnings preview</div>
            <div className="text-[11px] text-[#73675a]">Calculator assumptions and decision status</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['earnings-preview']}
              onChange={() => onTogglePartHidden('earnings-preview')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-[#8a7f73] mb-1">Starting value</label>
            <input
              type="text"
              defaultValue="₹40,000"
              className="w-full px-2 py-1 border border-[#dcd4c7] rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8a7f73] mb-1">Rental share</label>
            <input
              type="text"
              defaultValue="15%"
              className="w-full px-2 py-1 border border-[#dcd4c7] rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8a7f73] mb-1">Rentals/year</label>
            <input
              type="text"
              defaultValue="4"
              className="w-full px-2 py-1 border border-[#dcd4c7] rounded text-xs"
            />
          </div>
        </div>

        <div className="p-2.5 bg-[#fdfaf2] border border-[#fae2b8] rounded text-[11px] text-[#8a6a36]">
          <strong>Decision 14.1 pending:</strong> Lister share is agreed piece by piece and never shown on public storefront.
        </div>
      </div>

      {/* 06 The Form Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 06 · The Form</div>
            <div className="text-[11px] text-[#73675a]">Five steps of fields reading panel lists</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['the-form']}
              onChange={() => onTogglePartHidden('the-form')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#f0ebe3] pb-2 text-[11px]">
          {[
            { id: 'details', label: '1. Details' },
            { id: 'piece', label: '2. Piece' },
            { id: 'photos', label: '3. Photos' },
            { id: 'pref', label: '4. Preference' },
            { id: 'submit', label: '5. Submit' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFormTab(tab.id as any)}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                selectedFormTab === tab.id
                  ? 'bg-[#47633c] text-white font-medium'
                  : 'text-[#73675a] hover:bg-[#faf7f2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Step details editor */}
        {selectedFormTab === 'details' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <div>
                <span className="font-medium text-[#1a1612]">Full Name</span>
                <span className="text-[#8a7f73] text-[11px] ml-2">(Text, Required)</span>
              </div>
              <span className="text-[10px] text-[#4a6b35] font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <div>
                <span className="font-medium text-[#1a1612]">City</span>
                <span className="text-[#8a7f73] text-[11px] ml-2">(List: Serviceable cities 10)</span>
              </div>
              <span className="text-[10px] text-[#4a6b35] font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <div>
                <span className="font-medium text-[#1a1612]">Email & Mobile</span>
                <span className="text-[#8a7f73] text-[11px] ml-2">(Contact, Required)</span>
              </div>
              <span className="text-[10px] text-[#4a6b35] font-semibold">Active</span>
            </div>
          </div>
        )}

        {selectedFormTab === 'photos' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#8a7f73] mb-1">Minimum photos</label>
                <input type="number" defaultValue={3} className="w-full px-2 py-1 border border-[#dcd4c7] rounded text-xs" />
              </div>
              <div>
                <label className="block text-[11px] text-[#8a7f73] mb-1">Maximum photos</label>
                <input type="number" defaultValue={8} className="w-full px-2 py-1 border border-[#dcd4c7] rounded text-xs" />
              </div>
            </div>
            <p className="text-[11px] text-[#8a7f73]">Warns if the fewest photos is more than the most.</p>
          </div>
        )}

        {selectedFormTab === 'submit' && (
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-[#8a7f73] mb-1">Document it names</label>
              <input
                type="text"
                defaultValue="Lister Guidelines and Terms of Service v1.0"
                className="w-full px-2.5 py-1.5 border border-[#dcd4c7] rounded text-xs text-[#1a1612]"
              />
            </div>
            <p className="text-[11px] text-[#8a7f73]">
              A submission stores the document version in force when it was sent.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListYourPieceSettingsStepsForm;
