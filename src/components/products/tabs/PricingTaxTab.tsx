// src/components/products/tabs/PricingTaxTab.tsx

import React from 'react';
import { Product } from '../../types/product';

interface PricingTaxTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
}

export function PricingTaxTab({ formData, onFieldChange }: PricingTaxTabProps) {
  const data = formData as Record<string, any>;
  const set = (field: string, value: any) => (onFieldChange as any)(field, value);

  const labelClass = 'text-[11px] font-semibold text-stone-500 tracking-wide uppercase';
  const inputClass =
    'w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-stone-400';
  const helpClass = 'text-[11px] text-stone-400 mt-1';
  const helpOrangeClass = 'text-orange-700';

  const listedResalePrice = Number(data.listingPrice || 0);
  const originalRetailPrice = Number(data.originalRetailPrice || 0);
  const discountVsRetail =
    originalRetailPrice > 0
      ? Math.round(((originalRetailPrice - listedResalePrice) / originalRetailPrice) * 100)
      : 0;

  return (
    <div className="space-y-6">

      {/* ---------------- Rental Pricing ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5">
        <label className={labelClass}>Rental Pricing</label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Standard Window Price (4 Days)</label>
            <input
              type="number"
              value={formData.rentalPrice || ''}
              onChange={(e) => onFieldChange('rentalPrice', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Extended Window Price (7 Days)</label>
            <input
              type="number"
              value={data.extendedWindowPrice || ''}
              onChange={(e) => set('extendedWindowPrice', Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Per-Day Rate (Custom Durations)</label>
            <input
              type="number"
              value={data.perDayRate || ''}
              onChange={(e) => set('perDayRate', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Min Rental Duration (Days)</label>
            <input
              type="number"
              value={formData.minimumDurationDays || ''}
              onChange={(e) => onFieldChange('minimumDurationDays', Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Lister Payout % — Rental —{' '}
            <span className={helpOrangeClass}>
              per-piece suggestion; the split is decided per transaction, at booking or at payout approval
            </span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.payoutPercentage || ''}
            onChange={(e) => onFieldChange('payoutPercentage', Number(e.target.value))}
            className={`${inputClass} max-w-sm`}
          />
          <p className={helpClass}>
            Dynamic share: couture &amp; in-demand silhouettes carry a higher lister % (the piece
            recovers the lister's investment faster); high-rotation pieces on their 9th–10th
            rental — priced lower to the customer — carry a lower %, reflecting HOK's effort to
            keep them booked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Security Deposit — <span className={helpOrangeClass}>per-listing field</span>
            </label>
            <input
              type="number"
              value={formData.securityDeposit || ''}
              onChange={(e) => onFieldChange('securityDeposit', Number(e.target.value))}
              className={inputClass}
            />
            <p className={helpClass}>Charged at checkout, held until return inspection passes, then released.</p>
          </div>
          <div>
            <label className={labelClass}>Pre-Dispatch Buffer (Before Rental Start)</label>
            <input
              type="number"
              value={formData.preRentalBufferDays ?? ''}
              onChange={(e) => onFieldChange('preRentalBufferDays', Number(e.target.value))}
              className={inputClass}
            />
            <p className={helpClass}>
              Days blocked before dispatch — default from Master Data, override if this piece needs less prep time.
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Post-Return Buffer + Cleaning (After Return)</label>
          <input
            type="number"
            value={formData.postRentalBufferDays ?? ''}
            onChange={(e) => onFieldChange('postRentalBufferDays', Number(e.target.value))}
            className={`${inputClass} max-w-sm`}
          />
          <p className={helpClass}>
            Days blocked after return — default is Master Data's Post-Rental Buffer (2) + Cleaning
            Period (1). Lower this if your dry-cleaner turns pieces around faster.
          </p>
        </div>
      </div>

      {/* ---------------- Preloved / Resale Pricing ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5">
        <label className={labelClass}>Preloved / Resale Pricing</label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Listed Resale Price (₹) — <span className={helpOrangeClass}>main PDP price</span>
            </label>
            <input
              type="number"
              value={formData.listingPrice || ''}
              onChange={(e) => onFieldChange('listingPrice', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Original Retail Price (RRP)</label>
            <input
              type="number"
              value={data.originalRetailPrice || ''}
              onChange={(e) => set('originalRetailPrice', Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Discount vs Retail — <span className={helpOrangeClass}>auto-calculated, shown on PDP</span>
          </label>
          <div className={`${inputClass} max-w-sm bg-stone-100 text-stone-600`}>
            {originalRetailPrice > 0 ? `${discountVsRetail}% off retail` : '—'}
          </div>
        </div>
      </div>

      {/* ---------------- Commission & Fees ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm">Commission &amp; Fees</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>HOK Platform Commission %</label>
            <input
              type="number"
              value={formData.commissionRate ?? 25}
              onChange={(e) => onFieldChange('commissionRate', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Extension Price / Day — ₹</label>
            <input
              type="number"
              min="0"
              value={formData.extensionPrice || ''}
              onChange={(e) => onFieldChange('extensionPrice', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cleaning Fee — ₹</label>
            <input
              type="number"
              min="0"
              value={formData.cleaningFee || ''}
              onChange={(e) => onFieldChange('cleaningFee', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>GST / Tax %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.taxRate || ''}
              onChange={(e) => onFieldChange('taxRate', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cleaning Buffer (Days)</label>
            <input
              type="number"
              value={formData.cleaningBufferDays ?? 2}
              onChange={(e) => onFieldChange('cleaningBufferDays', Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}