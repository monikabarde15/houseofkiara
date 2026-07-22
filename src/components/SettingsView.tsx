import React, { useState } from 'react';
import { Settings, Save, Sparkles, AlertCircle, Phone, Mail, FileText } from 'lucide-react';
import { SiteSettings } from '../types';

interface SettingsViewProps {
  siteSettings: SiteSettings;
  onUpdateSettings: (updated: SiteSettings) => void;
}

export default function SettingsView({ siteSettings, onUpdateSettings }: SettingsViewProps) {
  const [siteName, setSiteName] = useState(siteSettings.siteName || 'House of Kaira');
  const [tagline, setTagline] = useState(siteSettings.tagline || 'Curation of designer luxury dress rentals');
  const [supportEmail, setSupportEmail] = useState(siteSettings.supportEmail || 'support@houseofkaira.com');
  const [whatsappNumber, setWhatsappNumber] = useState(siteSettings.whatsappNumber || '+91 98765 43210');
  const [instagramHandle, setInstagramHandle] = useState(siteSettings.instagramHandle || '@houseofkaira');
  
  // Announcement Bar
  const [annBarText, setAnnBarText] = useState(siteSettings.announcementBar?.text || 'Free shipping on orders above ₹10,000!');
  const [annBarEnabled, setAnnBarEnabled] = useState(siteSettings.announcementBar?.enabled ?? true);
  const [annBarBg, setAnnBarBg] = useState(siteSettings.announcementBar?.backgroundColor || '#1e1412');
  const [annBarTextCol, setAnnBarTextCol] = useState(siteSettings.announcementBar?.textColor || '#ffffff');

  const handleSave = () => {
    const updated: SiteSettings = {
      siteName,
      tagline,
      supportEmail,
      whatsappNumber,
      instagramHandle,
      announcementBar: {
        text: annBarText,
        enabled: annBarEnabled,
        backgroundColor: annBarBg,
        textColor: annBarTextCol
      }
    };
    onUpdateSettings(updated);
    alert("Global site configuration successfully updated!");
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Site settings</h2>
          <p className="text-xs text-stone-500 mt-1">
            Configure global site descriptors, announcement bars, customer care escalation contacts, and theme parameters.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
        >
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Site Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Brand Identity Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">E-Commerce Brand Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Brand Slogan / Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Customer Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">WhatsApp Support Number</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-stone-500 font-medium">Instagram Handle Account</label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Announcement Bar Settings */}
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Storefront Announcement Bar</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-medium text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={annBarEnabled}
                  onChange={(e) => setAnnBarEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-[#c5a880] focus:ring-[#c5a880]"
                />
                <span>Enable Announcement Bar Promo banner</span>
              </label>

              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Announcement Banner Text</label>
                <input
                  type="text"
                  value={annBarText}
                  onChange={(e) => setAnnBarText(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Background Color (Hex)</label>
                  <input
                    type="text"
                    value={annBarBg}
                    onChange={(e) => setAnnBarBg(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Text Color (Hex)</label>
                  <input
                    type="text"
                    value={annBarTextCol}
                    onChange={(e) => setAnnBarTextCol(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2 text-[#c5a880]">
            <Sparkles className="h-4 w-4" />
            <h3 className="font-serif font-bold text-stone-900 text-sm">Live Preview helper</h3>
          </div>
          <div className="space-y-2 leading-relaxed text-stone-600">
            <p>Your storefront announcement banner will render like this:</p>
            {annBarEnabled && (
              <div 
                className="p-2 text-center rounded text-[10px] font-semibold"
                style={{ backgroundColor: annBarBg, color: annBarTextCol }}
              >
                {annBarText}
              </div>
            )}
            <p className="text-[10px] text-stone-400 border-t border-stone-100 pt-3 flex gap-1.5 items-start mt-4">
              <AlertCircle className="h-3.5 w-3.5 text-stone-400 shrink-0" />
              <span>All global configs are instantly stored inside local applet state context and synced.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
