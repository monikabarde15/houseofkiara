/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: MaintenanceCard (Spec §8.20, Screen 61)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { MaintenanceScenario } from '../../data/maintenanceData';

interface MaintenanceCardProps {
  scenario: MaintenanceScenario;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldKey: string, value: string) => void;
  onFocusField?: (fieldKey: string, fieldTitle: string, initialValue: string) => void;
  onSelectFigure?: (figureKey: string) => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  scenario,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onSelectFigure = () => {}
}) => {
  const eyebrow = fieldValues['maint_eyebrow'] ?? scenario.eyebrow;
  const headingPrefix = fieldValues['maint_heading_prefix'] ?? scenario.headingPrefix;
  const headingItalic = fieldValues['maint_heading_italic'] ?? scenario.headingGoldItalic;
  const lead = fieldValues['maint_lead'] ?? scenario.lead;
  const statusText = fieldValues['maint_status_text'] ?? scenario.statusText;
  const celebratingHeading = fieldValues['maint_celebrating_heading'] ?? 'Celebrating ';
  const celebratingItalic = fieldValues['maint_celebrating_italic'] ?? 'soon?';
  const celebratingText = fieldValues['maint_celebrating_text'] ??
    'Your bookings, orders and payouts are safe. Deliveries, pickups and returns carry on as planned, and our team is on WhatsApp if you need anything.';
  const whatsappCta = fieldValues['maint_whatsapp_cta'] ?? 'MESSAGE US ON WHATSAPP';
  const instagramCta = fieldValues['maint_instagram_cta'] ?? 'OUR LATEST PIECES ON INSTAGRAM';

  return (
    <div className="w-full max-w-[700px] mx-auto text-center space-y-5">
      {/* Brand Wordmark M3 */}
      <div className="text-[13px] font-serif tracking-[0.28em] text-[#1a1612] uppercase font-medium">
        HOUSE OF KAIRA
      </div>

      {/* Framed Card M4 */}
      <div className="relative bg-[#fcfaf7] border border-[#d6cbba] p-10 md:p-12 shadow-[0_12px_40px_rgba(26,22,18,0.04)]">
        {/* Double keyline and diamond accent */}
        <div className="absolute inset-[8px] border border-[#eae2d5] pointer-events-none" />
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#fcfaf7] border border-[#bda67b] rotate-45 z-10" />

        {/* Eyebrow M5 */}
        <div className="mb-4">
          <input
            type="text"
            value={eyebrow}
            onChange={(e) => onFieldChange('maint_eyebrow', e.target.value)}
            onFocus={() => onFocusField('maint_eyebrow', 'Eyebrow', eyebrow)}
            className="text-[10px] tracking-[0.25em] text-[#8a7f73] uppercase text-center bg-transparent border-b border-transparent hover:border-[#d6cbba] focus:border-[#bda67b] focus:outline-none w-full max-w-[200px]"
          />
        </div>

        {/* Primary Heading M6 */}
        <h1 className="font-serif text-[38px] md:text-[46px] leading-[1.12] text-[#1a1612] mb-4">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onFieldChange('maint_heading_prefix', e.currentTarget.innerText)}
            onFocus={() => onFocusField('maint_heading_prefix', 'Heading prefix', headingPrefix)}
            className="outline-none hover:bg-[#fff9e6] rounded px-0.5 transition-colors cursor-text"
          >
            {headingPrefix}
          </span>
          <em
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onFieldChange('maint_heading_italic', e.currentTarget.innerText)}
            onFocus={() => onFocusField('maint_heading_italic', 'Heading italic', headingItalic)}
            className="italic text-[#935b1e] font-serif outline-none hover:bg-[#fff9e6] rounded px-0.5 transition-colors cursor-text"
          >
            {headingItalic}
          </em>
        </h1>

        {/* Lead Line M7 */}
        <p className="max-w-[500px] mx-auto text-[14px] text-[#5c5248] leading-relaxed mb-6">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onFieldChange('maint_lead', e.currentTarget.innerText)}
            onFocus={() => onFocusField('maint_lead', 'Lead paragraph', lead)}
            className="outline-none hover:bg-[#fff9e6] rounded px-1 transition-colors cursor-text"
          >
            {lead}
          </span>
        </p>

        {/* Status Box M8, M9 */}
        <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 bg-[#f4efe8] border border-[#e3dacd] rounded-[2px] text-xs text-[#2b251f] mb-8">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              scenario.dotColor === 'gold' ? 'bg-[#b89047]' : 'bg-[#5b7a42]'
            }`}
          />
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onFieldChange('maint_status_text', e.currentTarget.innerText)}
            onFocus={() => onFocusField('maint_status_text', 'Status notice', statusText)}
            className="outline-none hover:bg-white/80 rounded px-1 transition-colors cursor-text font-normal"
          >
            {statusText}
          </span>
        </div>

        {/* Interior divider line */}
        <div className="w-full border-t border-[#e8dfd1] my-8" />

        {/* Celebrating Soon Sub-section */}
        <div className="space-y-4 max-w-[540px] mx-auto">
          <h2 className="font-serif text-[24px] text-[#1a1612]">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onFieldChange('maint_celebrating_heading', e.currentTarget.innerText)}
              onFocus={() => onFocusField('maint_celebrating_heading', 'Section heading', celebratingHeading)}
              className="outline-none hover:bg-[#fff9e6] rounded px-0.5 transition-colors cursor-text"
            >
              {celebratingHeading}
            </span>
            <em
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onFieldChange('maint_celebrating_italic', e.currentTarget.innerText)}
              onFocus={() => onFocusField('maint_celebrating_italic', 'Section italic', celebratingItalic)}
              className="italic text-[#935b1e] font-serif outline-none hover:bg-[#fff9e6] rounded px-0.5 transition-colors cursor-text"
            >
              {celebratingItalic}
            </em>
          </h2>

          <p className="text-[13px] text-[#5c5248] leading-relaxed">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onFieldChange('maint_celebrating_text', e.currentTarget.innerText)}
              onFocus={() => onFocusField('maint_celebrating_text', 'Celebration body text', celebratingText)}
              className="outline-none hover:bg-[#fff9e6] rounded px-1 transition-colors cursor-text"
            >
              {celebratingText}
            </span>
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="px-5 py-2.5 bg-[#1a1612] text-white text-[11px] tracking-wider font-semibold rounded-[2px] hover:bg-[#332e27] transition-colors cursor-pointer shadow-2xs"
            >
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onFieldChange('maint_whatsapp_cta', e.currentTarget.innerText)}
                onFocus={() => onFocusField('maint_whatsapp_cta', 'WhatsApp button label', whatsappCta)}
                className="outline-none"
              >
                {whatsappCta}
              </span>
            </button>
            <button
              type="button"
              className="text-[11px] tracking-wider text-[#1a1612] font-semibold underline underline-offset-4 hover:text-[#935b1e] transition-colors cursor-pointer"
            >
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onFieldChange('maint_instagram_cta', e.currentTarget.innerText)}
                onFocus={() => onFocusField('maint_instagram_cta', 'Instagram link label', instagramCta)}
                className="outline-none"
              >
                {instagramCta}
              </span>
            </button>
          </div>

          {/* SLA Line with Clickable Figure */}
          <div className="pt-2 text-[12px] text-[#73675a]">
            <span>We reply </span>
            <button
              type="button"
              onClick={() => onSelectFigure('support_hours')}
              className="bg-[#fcf8ec] text-[#935b1e] border-b border-[#cca352] px-1 font-medium hover:bg-[#faeed6] transition-colors cursor-pointer"
              title="Click to view figure in panel"
            >
              seven days a week, 10 AM to 8 PM IST
            </button>
            <span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCard;
