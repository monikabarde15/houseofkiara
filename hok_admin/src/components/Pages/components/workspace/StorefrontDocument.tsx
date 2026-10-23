/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: StorefrontDocument (Customer-Facing Document)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { PageCardData, FigureItem } from '../../types';
import { SEED_FIGURES } from '../../data';
import { ShieldCheck, Clock, Check } from 'lucide-react';

interface StorefrontDocumentProps {
  page: PageCardData;
  figures: FigureItem[];
  isSimulatingScheduled: boolean;
}

export const StorefrontDocument: React.FC<StorefrontDocumentProps> = ({
  page,
  figures,
  isSimulatingScheduled
}) => {
  // Helper to retrieve display value for figure
  const val = (key: string, scheduledFallback?: string): string => {
    if (isSimulatingScheduled && scheduledFallback) {
      return scheduledFallback;
    }
    const found = figures.find(f => f.key === key) || SEED_FIGURES.find(f => f.key === key);
    return found ? found.displayValue : '---';
  };

  return (
    <div className="bg-[#fffefb] text-[#1a1612] min-h-[600px] flex flex-col font-sans select-text">
      {/* Scheduled Release Simulator Banner if active (Spec §13) */}
      {isSimulatingScheduled && (
        <div className="bg-[#3d6e8e] text-white px-4 py-2 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="font-medium">
              Simulating Scheduled Version (Effective 01 Nov 2026, 00:00 IST)
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded-[4px]">
            Future Simulation Mode
          </span>
        </div>
      )}

      {/* Simulated Storefront Header Band */}
      <div className="border-b border-[#e6dccb] bg-[#fffefb] px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="font-serif text-lg tracking-wider uppercase font-semibold text-[#1a1612]">
          House of Kiara
        </div>
        <div className="text-[11px] text-[#6e6358] tracking-widest uppercase hidden sm:flex gap-6">
          <span>Rentals</span>
          <span>Preloved</span>
          <span>Designers</span>
          <span>Concierge</span>
        </div>
      </div>

      {/* Customer Breadcrumb */}
      <div className="px-6 md:px-12 py-4 text-[11px] text-[#6e6358] border-b border-[#efe7da] flex items-center gap-1.5">
        <span>Home</span>
        <span>/</span>
        <span>Information</span>
        <span>/</span>
        <span className="text-[#1a1612] font-medium">{page.title}</span>
      </div>

      {/* Main Document Content Body */}
      <div className="flex-1 px-6 md:px-12 py-10 md:py-14 max-w-3xl mx-auto space-y-10">
        {/* Document Header */}
        <div className="space-y-3 pb-8 border-b border-[#e6dccb]">
          <h1 className="text-3xl md:text-5xl font-serif font-normal text-[#1a1612] tracking-tight leading-tight">
            {page.title}
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] font-sans leading-relaxed">
            {page.summary}
          </p>
          <div className="pt-2 text-xs text-[#6e6358] flex items-center gap-2">
            <span>Last updated: {isSimulatingScheduled ? '01 Nov 2026' : page.lastPublished}</span>
            <span>·</span>
            <span>Version: {isSimulatingScheduled ? 'v5.0-scheduled' : page.version}</span>
          </div>
        </div>

        {/* Clauses with Natural Typography (NO Admin Tokens) */}
        <div className="space-y-8 text-sm md:text-base text-[#2c241c] leading-relaxed font-sans">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-[#1a1612] font-normal border-b border-[#efe7da] pb-1.5">
              1. Rental Duration & Reservations
            </h2>
            <p>
              House of Kiara luxury apparel rentals are curated under strict quality protocols. Standard rental durations are for <strong>{val('rental_period_primary_days')}</strong>, with extended options of <strong>{val('rental_period_extended_days')}</strong> for special events and destination travel.
            </p>
            <p>
              Your rental timeframe formally begins <strong>{val('rental_period_start_time')}</strong>. Please ensure the garment is prepared in its bespoke garment carrier for pickup between <strong>{val('rental_period_return_cutoff_time')}</strong> on your designated return day.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-[#1a1612] font-normal border-b border-[#efe7da] pb-1.5">
              2. Security Deposit & Damage Assurance
            </h2>
            <p>
              A refundable security deposit of <strong>{val('deposit_default_percent')}</strong> is held prior to shipment. For luxury pieces exceeding retail valuation thresholds, a fixed deposit of <strong>{val('deposit_luxury_tier_inr', isSimulatingScheduled ? '₹5,500' : '₹5,000')}</strong> is applicable.
            </p>
            <p>
              All deposits are placed via <strong>{val('deposit_hold_mode')}</strong>. Our warehouse quality team inspects each garment within <strong>{val('deposit_qc_duration_hours')}</strong> of receipt, and releases holds within <strong>{val('deposit_release_hours_after_qc')}</strong>.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-[#1a1612] font-normal border-b border-[#efe7da] pb-1.5">
              3. Cancellation & Dispatch Window
            </h2>
            <p>
              Orders may be cancelled free of charge within <strong>{val('cancel_free_window_hours')}</strong>. Thereafter, an administrative inventory holding fee of <strong>{val('cancel_prior_dispatch_fee_percent')}</strong> applies prior to courier handover.
            </p>
            <p>
              Approved refunds are credited to the <strong>{val('refund_mode_original_source')}</strong> within <strong>{val('refund_processing_business_days')}</strong>. Orders placed prior to <strong>{val('delivery_dispatch_same_day_cutoff')}</strong> dispatch on the same business day via <strong>{val('delivery_dispatch_courier_partners')}</strong>.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-[#1a1612] font-normal border-b border-[#efe7da] pb-1.5">
              4. Statutory Framework & Grievance Contact
            </h2>
            <p>
              House of Kiara operates under the Consumer Protection Act, 2019 and the DPDP Act, 2023.
            </p>
            <p>
              For grievances, please contact <strong>{val('grievance_name')}</strong> at <strong>{val('grievance_email')}</strong>. All formal inquiries are processed within <strong>{val('grievance_resolve')}</strong>.
            </p>
          </div>
        </div>

        {/* Storefront Footer Note */}
        <div className="pt-10 border-t border-[#e6dccb] text-xs text-[#6e6358] space-y-1">
          <p>© 2026 {val('legal_name')}. All rights reserved.</p>
          <p>Registered Office: {val('registered_address')}.</p>
        </div>
      </div>
    </div>
  );
};

export default StorefrontDocument;
