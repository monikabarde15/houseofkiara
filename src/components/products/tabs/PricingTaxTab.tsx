// src/components/products/tabs/PricingTaxTab.tsx

import React from 'react';
import { Product } from '../../../types/product';

interface PricingTaxTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
}

export function PricingTaxTab({ formData, onFieldChange }: PricingTaxTabProps) {
  return (
    <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
      <h3 className="font-serif font-bold text-stone-900 text-sm">Commercial Settings & Commission</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Rental Price (4 Days cycle) - ₹</label>
          <input
            type="number"
            value={formData.rentalPrice || 0}
            onChange={(e) => onFieldChange('rentalPrice', Number(e.target.value))}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Security Deposit held - ₹</label>
          <input
            type="number"
            value={formData.securityDeposit || 0}
            onChange={(e) => onFieldChange('securityDeposit', Number(e.target.value))}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Listing Retail Price (For Preloved/Buy) - ₹</label>
          <input
            type="number"
            value={formData.listingPrice || 0}
            onChange={(e) => onFieldChange('listingPrice', Number(e.target.value))}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">HOK Platform Commission %</label>
          <input
            type="number"
            value={formData.commissionRate || 25}
            onChange={(e) => onFieldChange('commissionRate', Number(e.target.value))}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Extension Price / Day - ₹</label>
          <input 
            type="number" 
            min="0" 
            value={formData.extensionPrice || 0} 
            onChange={e => onFieldChange('extensionPrice', Number(e.target.value))} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Cleaning Fee - ₹</label>
          <input 
            type="number" 
            min="0" 
            value={formData.cleaningFee || 0} 
            onChange={e => onFieldChange('cleaningFee', Number(e.target.value))} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">GST / Tax %</label>
          <input 
            type="number" 
            min="0" 
            max="100" 
            value={formData.taxRate || 0} 
            onChange={e => onFieldChange('taxRate', Number(e.target.value))} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Cleaning Buffer (Days)</label>
          <input
            type="number"
            value={formData.cleaningBufferDays || 2}
            onChange={(e) => onFieldChange('cleaningBufferDays', Number(e.target.value))}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
      </div>
    </div>
  );
}