// src/components/products/tabs/CoreDetailsTab.tsx

import React from 'react';
import { Product, Lister } from '../../types/product';

interface CoreDetailsTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  listers: Lister[];
}

// NOTE: The mockup includes several fields (subtitle, embroideryDetails,
// threadYarnDetail, setIncludes, origin, weight, deliveryTiming, listingModes,
// honestDisclosure, timesRented, bestSuitedForHeight, and cm variants of the
// measurements) that do not yet exist on the `Product` type used by
// `onFieldChange`. Per your instruction to only touch the frontend and not
// touch backend/type contracts, this component reads/writes those extra
// fields through a small local `set`/`get` helper that safely casts through
// `formData` without requiring you to change `Product` right now. Once you're
// ready, add these keys to `Product` and the casts can be removed.

export function CoreDetailsTab({ formData, onFieldChange }: CoreDetailsTabProps) {
  const data = formData as Record<string, any>;

  const set = (field: string, value: any) => {
    (onFieldChange as any)(field, value);
  };

  const labelClass = 'text-[11px] font-semibold text-stone-500 tracking-wide uppercase';
  const inputClass =
    'w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-stone-400';
  const helpClass = 'text-[11px] text-stone-400 mt-1';
  const helpOrangeClass = 'text-[11px] text-orange-700 font-medium mt-1';

  return (
    <div className="space-y-6">
      {/* ---------------- Core Details Card ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5">
        {/* Product Title / Designer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Product Title</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Designer</label>
            <input
              type="text"
              value={formData.designer || ''}
              onChange={(e) => onFieldChange('designer', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className={labelClass}>Subtitle (Listing Card)</label>
          <input
            type="text"
            value={data.subtitle || ''}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="Silk organza · Deep crimson"
            className={inputClass}
          />
        </div>

        {/* Full Description */}
        <div>
          <label className={labelClass}>Full Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onFieldChange('description', e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>

        {/* Rating / Review Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rating (out of 5)</label>
            <input
              type="text"
              value={data.rating || ''}
              onChange={(e) => set('rating', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Review Count</label>
            <input
              type="text"
              value={data.reviewCount || ''}
              onChange={(e) => set('reviewCount', e.target.value)}
              className={inputClass}
            />
          </div>
          <p className={`${helpClass} md:col-span-2 -mt-3`}>Shown as stars beside the title on the PDP</p>
        </div>

        {/* Category / Occasion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={formData.category || 'Bridal Lehenga'}
              onChange={(e) => onFieldChange('category', e.target.value)}
              className={inputClass}
            >
              <option value="Bridal Lehenga">Bridal Lehenga</option>
              <option value="Lehenga">Lehenga Only</option>
              <option value="Anarkali">Anarkali Suit</option>
              <option value="Sherwani">Sherwani Menswear</option>
              <option value="Saree">Saree / Draped Saree</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Occasion(s)</label>
            <input
              type="text"
              value={formData.occasion || ''}
              onChange={(e) => onFieldChange('occasion', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* Fabric/Material / Colour */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fabric / Material</label>
            <input
              type="text"
              value={formData.material || ''}
              onChange={(e) => onFieldChange('material', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Colour</label>
            <input
              type="text"
              value={formData.color || ''}
              onChange={(e) => onFieldChange('color', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Craft / Technique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Craft</label>
            <input
              type="text"
              value={formData.craft || ''}
              onChange={(e) => onFieldChange('craft', e.target.value)}
              placeholder="e.g. Chikankari, Bandhani, Zardozi"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Technique</label>
            <input
              type="text"
              value={formData.technique || ''}
              onChange={(e) => onFieldChange('technique', e.target.value)}
              placeholder="How the craft was executed"
              className={inputClass}
            />
          </div>
        </div>

        {/* Embroidery Details / Thread Yarn Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Embroidery Details</label>
            <input
              type="text"
              value={data.embellishments || formData.embellishments || ''}
              onChange={(e) => set('embellishments', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Thread / Yarn Detail</label>
            <input
              type="text"
              value={data.threadYarnDetail || ''}
              onChange={(e) => set('threadYarnDetail', e.target.value)}
              placeholder="Optional — thread or yarn used"
              className={inputClass}
            />
          </div>
        </div>

        {/* Set Includes / Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Set Includes</label>
            <input
              type="text"
              value={data.setIncludes || ''}
              onChange={(e) => set('setIncludes', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Origin</label>
            <input
              type="text"
              value={data.origin || ''}
              onChange={(e) => set('origin', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Size / Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Size — <span className="text-orange-700">one per listing, consignment model</span>
            </label>
            <input
              type="text"
              value={data.size || ''}
              onChange={(e) => set('size', e.target.value)}
              className={inputClass}
            />
            <p className={helpClass}>
              Each piece is a specific physical garment — enter the one size it fits, not a
              range. General size guidance lives in Master Data.
            </p>
          </div>
          <div>
            <label className={labelClass}>Weight (grams)</label>
            <input
              type="text"
              value={data.weight || ''}
              onChange={(e) => set('weight', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Delivery Timing */}
        <div>
          <label className={labelClass}>Delivery Timing</label>
          <input
            type="text"
            value={data.deliveryTiming || ''}
            onChange={(e) => set('deliveryTiming', e.target.value)}
            className={inputClass}
          />
          <p className={helpClass}>
            Default comes from Master Data → Shipping Defaults; override here only if this piece
            ships differently.
          </p>
        </div>

        <div className="border-t border-stone-100" />

        {/* Listing Mode(s) */}
        <div>
          <label className={labelClass}>Listing Mode(s)</label>
          <div className="flex items-center gap-6 mt-2">
            {(['RENTAL', 'PRELOVED', 'BUY NEW'] as const).map((mode) => {
              const key = mode.toLowerCase().replace(' ', '');
              const modes: string[] = data.listingModes || [];
              const checked = modes.includes(mode);
              return (
                <label key={mode} className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...modes, mode]
                        : modes.filter((m) => m !== mode);
                      set('listingModes', next);
                    }}
                    className="h-4 w-4 accent-blue-600"
                  />
                  {mode}
                </label>
              );
            })}
          </div>
        </div>

        {/* Condition Grade */}
        <div>
          <label className={labelClass}>Condition Grade</label>
          <select
            value={formData.condition || ''}
            onChange={(e) => onFieldChange('condition', e.target.value)}
            className={inputClass}
          >
            <option value="">Select condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
          <p className={helpClass}>Fair routes to rental-only — resale is disabled at this grade.</p>
        </div>

        {/* Honest Disclosure */}
        <div>
          <label className={labelClass}>
            Honest Disclosure — <span className="text-orange-700">Required for Preloved, gates publication</span>
          </label>
          <textarea
            value={data.honestDisclosure || ''}
            onChange={(e) => set('honestDisclosure', e.target.value)}
            rows={3}
            placeholder="Describe any visible wear, repairs, alterations, or imperfections honestly. Buyers rely on candour."
            className={inputClass}
          />
        </div>

        {/* Story */}
        <div>
          <label className={labelClass}>
            The Story of this Piece — <span className="text-stone-400 normal-case font-normal">shown as its own section on the PDP</span>
          </label>
          <textarea
            value={formData.story || ''}
            onChange={(e) => onFieldChange('story', e.target.value)}
            rows={3}
            placeholder="Where and when was it worn? What makes the craftsmanship special? Add a styling note if relevant."
            className={inputClass}
          />
        </div>

        {/* Times Rented / SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Times Rented (Display Counter)</label>
            <input
              type="text"
              value={data.timesRented || ''}
              onChange={(e) => set('timesRented', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>SKU</label>
            <input
              type="text"
              value={formData.sku || ''}
              onChange={(e) => onFieldChange('sku', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>Tags</label>
          <input
            value={formData.tags?.join(', ') || ''}
            onChange={(e) =>
              onFieldChange(
                'tags',
                e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
              )
            }
            placeholder="Featured, Rare Find, New Arrival..."
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
          >
            Discard
          </button>
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded bg-amber-700 text-white hover:bg-amber-800"
          >
            Save Core Details
          </button>
        </div>
      </div>

      {/* ---------------- Size & Measurements Card ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-serif font-bold text-stone-900 text-sm">Size &amp; Measurements — This Piece</h3>
          <span className="text-[11px] text-stone-400">Shown as "Size &amp; Fit" on the PDP</span>
        </div>

        <div className="border border-stone-200 rounded overflow-hidden">
          <div className="grid grid-cols-3 bg-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            <div className="p-2 px-3">Measurement</div>
            <div className="p-2 px-3">Inches</div>
            <div className="p-2 px-3">Centimetres</div>
          </div>

          {[
            { key: 'bust', label: 'Bust (blouse)' },
            { key: 'waist', label: 'Waist (skirt)' },
            { key: 'hips', label: 'Hips (skirt fall)' },
            { key: 'length', label: 'Length (skirt)' },
          ].map((row, idx) => (
            <div
              key={row.key}
              className={`grid grid-cols-3 items-center ${idx !== 0 ? 'border-t border-stone-100' : ''}`}
            >
              <div className="p-3 text-xs text-stone-700">{row.label}</div>
              <div className="p-2 px-3">
                <input
                  value={(formData.measurements as any)?.[row.key] || ''}
                  onChange={(e) =>
                    onFieldChange('measurements', {
                      ...formData.measurements,
                      [row.key]: e.target.value,
                    } as Product['measurements'])
                  }
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="p-2 px-3">
                <input
                  value={data.measurementsCm?.[row.key] || ''}
                  onChange={(e) =>
                    set('measurementsCm', { ...data.measurementsCm, [row.key]: e.target.value })
                  }
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
            </div>
          ))}

          {/* Best suited for height - highlighted row */}
          <div className="grid grid-cols-3 items-center border-t border-stone-100 bg-[#f4ece0]">
            <div className="p-3 text-xs font-semibold text-stone-800">Best suited for height</div>
            <div className="p-2 px-3 col-span-2">
              <input
                value={data.bestSuitedForHeight || ''}
                onChange={(e) => set('bestSuitedForHeight', e.target.value)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
              />
            </div>
          </div>
        </div>

        <p className={`${helpClass} mt-3`}>
          General size-to-measurement guidance is managed centrally in Master Data → Occasions &amp;
          Sizes → Sizes &amp; Fit Guide. These fields are this specific piece's actual measurements,
          since each listing is one physical garment.
        </p>

        <div className="flex justify-end pt-4 mt-2 border-t border-stone-100">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded bg-amber-700 text-white hover:bg-amber-800"
          >
            Save Measurements
          </button>
        </div>
      </div>
    </div>
  );
}