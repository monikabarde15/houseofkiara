import React, { useState } from 'react'
import { Product, Lister } from '../../types/product';
import toast from 'react-hot-toast';
import { getDesigners } from '../../../services/designerApi';
import { apiRequest } from '../../../services/apiClient';
import DynamicCategorySelect from '../../ui/DynamicCategorySelect';

interface Designer {
  id: string;
  name: string;
}

interface CoreDetailsTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  listers: Lister[];
  designers?: Designer[];        // ✅ NEW — dropdown source; see note below
  onSave: (data?: Product) => void;
  productId?: string;
  isSaving?: boolean;
  resetForm?: () => void;
}

const STATUS_OPTIONS = ['Draft', 'Pending Review', 'Live', 'Paused', 'Out of Stock', 'Archived'];

export function CoreDetailsTab({
  formData,
  onFieldChange,
  listers,
  designers = [],
  onSave,
  productId,
  isSaving: externalIsSaving = false
}: CoreDetailsTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localSaving, setLocalSaving] = useState(false);
  const [fetchedDesigners, setFetchedDesigners] = useState<Designer[]>([]);

  React.useEffect(() => {
    const fetchDesignersFromApi = async () => {
      try {
        const data = await getDesigners();
        setFetchedDesigners(data.map((d: any) => ({ id: d.id || d._id, name: d.name })));
      } catch (e) {
        console.warn('Failed to fetch designers in CoreDetailsTab:', e);
      }
    };
    fetchDesignersFromApi();
  }, []);

  const activeDesigners = designers.length > 0 ? designers : fetchedDesigners;

  const data = formData as Record<string, any>;

  const labelClass = 'text-[11px] font-semibold text-stone-500 tracking-wide uppercase';
  const inputClass =
    'w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-stone-400';
  const helpClass = 'text-[11px] text-stone-400 mt-1';

  const prepareProductData = (data: Partial<Product>): any => {
    const {
      id, _id, __v, createdAt, updatedAt,
      listerName, listingModels, listingMode, listingmodel,
      ...cleanData
    } = data as any;

    const payload: any = {};
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] !== undefined && cleanData[key] !== null && cleanData[key] !== '') {
        payload[key] = cleanData[key];
      }
    });

    if (!payload.productId) payload.productId = `HOK-PRD-${Date.now()}`;

    if (!payload.listingModes || !Array.isArray(payload.listingModes) || payload.listingModes.length === 0) {
      payload.listingModes = ['RENTAL'];
    }
    const validModes = ['RENTAL', 'PRELOVED', 'BUY NEW'];
    payload.listingModes = payload.listingModes
      .map((mode: string) => mode.toUpperCase())
      .filter((mode: string) => validModes.includes(mode));
    if (payload.listingModes.length === 0) payload.listingModes = ['RENTAL'];

    if (!payload.measurements) payload.measurements = {};

    Object.keys(payload).forEach(key => {
      if (payload[key] === '') delete payload[key];
    });

    return payload;
  };

  const handleSaveCoreDetails = async () => {
    if (isSaving || localSaving || externalIsSaving) return;

    setIsSaving(true);
    setLocalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const payload = prepareProductData(formData);
      const endpoint = productId ? `/products/${productId}` : '/products';
      const method = productId ? 'PUT' : 'POST';

      const result = await apiRequest(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (onSave) onSave(result.data);

      setSaveSuccess(true);
      setLocalSaving(false);
      setIsSaving(false);

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'An error occurred while saving');
      setLocalSaving(false);
      setIsSaving(false);
    }
  };

  const handleSaveMeasurements = async () => {
    if (Object.keys(formData.measurements || {}).length === 0 && !formData.bestSuitedForHeight) return;
    if (!productId) { toast.error("⚠️ Please save Core Details first!"); return; }
    if (isSaving || localSaving || externalIsSaving) return;

    setIsSaving(true);
    setLocalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const measurementsData = {
        measurements: formData.measurements || {},
        measurementsCm: data.measurementsCm || {},
        bestSuitedForHeight: formData.bestSuitedForHeight || '',
      };

      await apiRequest(`/products/${productId}/measurements`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurementsData),
      });
      setSaveSuccess(true);
      setLocalSaving(false);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'An error occurred');
      setLocalSaving(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {saveError}
          <button onClick={() => setSaveError(null)} className="float-right text-red-500 hover:text-red-700">×</button>
        </div>
      )}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✅ Product saved successfully!
          <button onClick={() => setSaveSuccess(false)} className="float-right text-green-500 hover:text-green-700">×</button>
        </div>
      )}

      {/* ---------------- Status & Publishing Workflow ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-serif font-bold text-stone-900 text-sm">Status &amp; Publishing Workflow</h3>
          <span className="text-[10px] font-semibold tracking-wide text-stone-400 uppercase">
            Ops Prepares · Super Admin Publishes
          </span>
        </div>

        <div className="border-t border-stone-100 pt-4">
          {!productId && (
            <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 mb-4">
              <span className="shrink-0 px-2 py-0.5 text-[11px] font-semibold text-stone-500 bg-white border border-stone-300 rounded">
                New
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Not yet created. Fill in details, pricing and photos — the piece is saved as a{' '}
                <strong className="font-semibold text-stone-800">Draft</strong> when you click{' '}
                <strong className="font-semibold text-stone-800">Create Product</strong>, and enters
                the review workflow from there.
              </p>
            </div>
          )}
          <p className="text-xs text-stone-500 mb-4">
            Draft → Pending Review → Live · Paused, Out of Stock and Archived are side states
          </p>
          <label className={labelClass}>Set Status Directly (Super Admin Override)</label>
          <select
            value={formData.status || 'Draft'}
            onChange={(e) => onFieldChange('status', e.target.value as Product['status'])}
            className={`${inputClass} max-w-sm`}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <p className={helpClass}>Prefer the workflow buttons — the override path is still logged to Activity.</p>
        </div>
      </div>

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
            <select
              value={formData.designer || ''}
              onChange={(e) => onFieldChange('designer', e.target.value)}
              className={inputClass}
            >
              <option value="">Select designer...</option>
              {activeDesigners.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
              {/* keep an existing free-text value visible even if it's not in the registry yet */}
              {formData.designer && !activeDesigners.some(d => d.name === formData.designer) && (
                <option value={formData.designer}>{formData.designer}</option>
              )}
            </select>
            <p className={helpClass}>
              One registry, one spelling — mapping here is what powers the designer page, filter facet and reports for this piece.
            </p>
          </div>
        </div>

        {/* Lister — Supply Owner */}
        <div>
          <label className={labelClass}>Lister — Supply Owner</label>
          <select
            value={formData.listerId || ''}
            onChange={(e) => onFieldChange('listerId', e.target.value)}
            className={inputClass}
          >
            <option value="">Select a lister</option>
            {listers.map((lister) => {
              const uniqueId = lister.listerId || lister._id || lister.id || '';
              return (
                <option key={uniqueId} value={uniqueId}>
                  {lister.name} ({uniqueId})
                </option>
              );
            })}
          </select>
          <p className={helpClass}>
            Who owns this piece — powers the lister profile grid, payout attribution and supply reports. Leave on HOK stock for designer-partner pieces.
          </p>
        </div>

        {/* Subtitle */}
        <div>
          <label className={labelClass}>Subtitle (Listing Card)</label>
          <input
            type="text"
            value={formData.subtitle || ''}
            onChange={(e) => onFieldChange('subtitle', e.target.value)}
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
              type="number"
              value={formData.rating || ''}
              onChange={(e) => onFieldChange('rating', parseFloat(e.target.value) || 0)}
              className={inputClass}
              min="0" max="5" step="0.1"
            />
          </div>
          <div>
            <label className={labelClass}>Review Count</label>
            <input
              type="number"
              value={formData.reviewCount || ''}
              onChange={(e) => onFieldChange('reviewCount', parseInt(e.target.value) || 0)}
              className={inputClass}
              min="0"
            />
          </div>
          <p className={`${helpClass} md:col-span-2 -mt-3`}>Shown as stars beside the title on the PDP</p>
        </div>

        {/* Category / Occasion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <DynamicCategorySelect 
              value={formData.category || ''}
              onChange={(value) => onFieldChange('category', value)}
              className="mt-1"
            />
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
              value={formData.embellishments || ''}
              onChange={(e) => onFieldChange('embellishments', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Thread / Yarn Detail</label>
            <input
              type="text"
              value={formData.threadYarnDetail || ''}
              onChange={(e) => onFieldChange('threadYarnDetail', e.target.value)}
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
              value={formData.setIncludes || ''}
              onChange={(e) => onFieldChange('setIncludes', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Origin</label>
            <input
              type="text"
              value={formData.origin || ''}
              onChange={(e) => onFieldChange('origin', e.target.value)}
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
              value={formData.sizes?.[0] || ''}
              onChange={(e) => onFieldChange('sizes', [e.target.value])}
              className={inputClass}
            />
            <p className={helpClass}>
              Each piece is a specific physical garment — enter the one size it fits, not a range. General size guidance lives in Master Data.
            </p>
          </div>
          <div>
            <label className={labelClass}>Weight (grams)</label>
            <input
              type="text"
              value={formData.weight || ''}
              onChange={(e) => onFieldChange('weight', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Delivery Timing */}
        <div>
          <label className={labelClass}>Delivery Timing</label>
          <input
            type="text"
            value={formData.deliveryTiming || ''}
            onChange={(e) => onFieldChange('deliveryTiming', e.target.value)}
            className={inputClass}
          />
          <p className={helpClass}>
            Default comes from Master Data → Shipping Defaults; override here only if this piece ships differently.
          </p>
        </div>

        <div className="border-t border-stone-100" />

        {/* Listing Mode(s) */}
        <div>
          <label className={labelClass}>Listing Mode(s)</label>
          <div className="flex items-center gap-6 mt-2">
            {(['RENTAL', 'PRELOVED', 'BUY NEW'] as const).map((mode) => {
              const modes = Array.isArray(formData.listingModes) ? formData.listingModes : [];
              const checked = modes.includes(mode);
              return (
                <label key={mode} className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked ? [...modes, mode] : modes.filter((m) => m !== mode);
                      onFieldChange('listingModes', next);
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
            <option value="Pristine">Pristine</option>
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
            value={formData.honestDisclosure || ''}
            onChange={(e) => onFieldChange('honestDisclosure', e.target.value)}
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
              type="number"
              value={formData.timesRented || ''}
              onChange={(e) => onFieldChange('timesRented', parseInt(e.target.value) || 0)}
              className={inputClass}
              min="0"
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
              onFieldChange('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSaving && !localSaving && !externalIsSaving) handleSaveCoreDetails();
            }}
            disabled={isSaving || localSaving || saveSuccess || externalIsSaving}
            className={`px-4 py-2 text-xs font-semibold rounded transition ${isSaving || localSaving || saveSuccess || externalIsSaving
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
          >
            {isSaving || localSaving ? 'Saving...' : saveSuccess ? '✅ Saved!' : 'Save Core Details'}
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
            <div key={row.key} className={`grid grid-cols-3 items-center ${idx !== 0 ? 'border-t border-stone-100' : ''}`}>
              <div className="p-3 text-xs text-stone-700">{row.label}</div>
              <div className="p-2 px-3">
                <input
                  value={formData.measurements?.[row.key as keyof typeof formData.measurements] || ''}
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
                  value={formData.measurementsCm?.[row.key as keyof typeof formData.measurementsCm] || ''}
                  onChange={(e) =>
                    onFieldChange('measurementsCm', {
                      ...formData.measurementsCm,
                      [row.key]: e.target.value,
                    } as Product['measurementsCm'])
                  }
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 items-center border-t border-stone-100 bg-[#f4ece0]">
            <div className="p-3 text-xs font-semibold text-stone-800">Best suited for height</div>
            <div className="p-2 px-3 col-span-2">
              <input
                value={formData.bestSuitedForHeight || ''}
                onChange={(e) => onFieldChange('bestSuitedForHeight', e.target.value)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
              />
            </div>
          </div>
        </div>

        <p className={`${helpClass} mt-3`}>
          General size-to-measurement guidance is managed centrally in Master Data → Occasions &amp; Sizes → Sizes &amp; Fit Guide. These fields are this specific piece's actual measurements, since each listing is one physical garment.
        </p>

        <div className="flex justify-end pt-4 mt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSaving && !localSaving && !externalIsSaving) handleSaveMeasurements();
            }}
            disabled={
              isSaving || localSaving || saveSuccess || externalIsSaving ||
              (!formData.measurements?.bust && !formData.measurements?.waist &&
                !formData.measurements?.hips && !formData.measurements?.length &&
                !formData.measurementsCm?.bust && !formData.measurementsCm?.waist &&
                !formData.measurementsCm?.hips && !formData.measurementsCm?.length &&
                !formData.bestSuitedForHeight)
            }
            className={`px-4 py-2 text-xs font-semibold rounded transition ${isSaving || localSaving || saveSuccess || externalIsSaving ||
                (!formData.measurements?.bust && !formData.measurements?.waist &&
                  !formData.measurements?.hips && !formData.measurements?.length &&
                  !formData.measurementsCm?.bust && !formData.measurementsCm?.waist &&
                  !formData.measurementsCm?.hips && !formData.measurementsCm?.length &&
                  !formData.bestSuitedForHeight)
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
          >
            {isSaving || localSaving ? 'Saving...' : saveSuccess ? '✅ Saved!' : 'Save Measurements'}
          </button>
        </div>
      </div>
    </div>
  );
}
