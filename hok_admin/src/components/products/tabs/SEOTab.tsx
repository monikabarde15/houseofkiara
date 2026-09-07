// src/components/products/tabs/SEOTab.tsx

import React, { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types/product';

interface SEOTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  onNavigateToRelatedProducts?: () => void;
  onSave?: () => void;
  siteDomain?: string;
}

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

export function SEOTab({
  formData,
  onFieldChange,
  onNavigateToRelatedProducts,
  onSave,
  siteDomain = 'houseofkaira.com',
}: SEOTabProps) {
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  const seoTitle = formData.seoTitle || '';
  const seoDescription = formData.seoDescription || '';
  const urlSlug = formData.urlSlug || '';
  const ogImage = (formData as any).ogImage as string | undefined;

  const previewTitle = seoTitle || `${formData.name || 'Product'} — Rent · House of Kaira`;
  const previewDescription =
    seoDescription ||
    `Rent the ${formData.name || 'product'} from House of Kaira.`;
  const previewPath = urlSlug || 'your-product-name';

  const handleOgImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onFieldChange('ogImage' as keyof Product, url as any);
  };
  const liveProductImage = formData.images?.find(img => img && typeof img === 'string' && !img.startsWith('blob:')) || formData.images?.[0] || '';
  const rawOgImage = (formData as any).ogImage as string | undefined;
  const displayOgImage = (rawOgImage && typeof rawOgImage === 'string' && !rawOgImage.startsWith('blob:')) ? rawOgImage : liveProductImage;

  return (
    <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5">
      <h3 className="font-serif font-bold text-stone-900 text-sm">SEO &amp; URL Slugs</h3>

      <div className="grid grid-cols-1 gap-5">
        {/* Meta title */}
        <div className="space-y-1">
          <label className="text-stone-500 font-medium text-[11px] uppercase tracking-wide">
            Meta Title (Max {TITLE_MAX} chars)
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => onFieldChange('seoTitle', e.target.value.slice(0, TITLE_MAX))}
            maxLength={TITLE_MAX}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            placeholder="Title for search engines"
          />
          <p className="text-[10px] text-stone-400 text-right">
            {seoTitle.length} / {TITLE_MAX}
          </p>
        </div>

        {/* Meta description */}
        <div className="space-y-1">
          <label className="text-stone-500 font-medium text-[11px] uppercase tracking-wide">
            Meta Description (Max {DESCRIPTION_MAX} chars)
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => onFieldChange('seoDescription', e.target.value.slice(0, DESCRIPTION_MAX))}
            maxLength={DESCRIPTION_MAX}
            rows={3}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            placeholder="Description for search engines"
          />
          <p className="text-[10px] text-stone-400 text-right">
            {seoDescription.length} / {DESCRIPTION_MAX}
          </p>
        </div>

        {/* URL slug */}
        <div className="space-y-1">
          <label className="text-stone-500 font-medium text-[11px] uppercase tracking-wide">
            URL Slug
          </label>
          <input
            type="text"
            value={urlSlug}
            onChange={(e) => onFieldChange('urlSlug', e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            placeholder="your-product-name"
          />
          <p className="text-[10px] text-stone-400">
            Leave blank to auto-generate from product name
          </p>
        </div>

        {/* OG / Social image */}
        <div className="space-y-1">
          <label className="text-stone-500 font-medium text-[11px] uppercase tracking-wide">
            OG / Social Image (1200×630)
          </label>
          <input
            ref={ogImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleOgImagePick}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => ogImageInputRef.current?.click()}
            className="w-full aspect-[1200/300] rounded-md border-2 border-dashed border-stone-300 bg-[#fcf9f5] flex flex-col items-center justify-center gap-1 hover:bg-stone-50 transition overflow-hidden"
            style={{ minHeight: 140 }}
          >
            {displayOgImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayOgImage}
                alt="Social share preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (liveProductImage && e.currentTarget.src !== liveProductImage) {
                    e.currentTarget.src = liveProductImage;
                  }
                }}
              />
            ) : (
              <>
                <ImageIcon className="w-4 h-4 text-stone-400 mb-1" />
                <p className="text-xs font-semibold text-stone-700">Social share preview image</p>
                <p className="text-[10px] text-stone-400">Shown when this PDP URL is shared</p>
              </>
            )}
          </button>
        </div>

        {/* Related products pointer */}
        <div className="space-y-2 pt-1">
          <label className="text-stone-500 font-medium text-[11px] uppercase tracking-wide">
            Related Products
          </label>
          <div className="flex items-center  gap-3 border-b border-stone-100 pb-4">
            <p className="text-xs text-stone-400">Now managed in its own tab</p>
            <button
              type="button"
              onClick={onNavigateToRelatedProducts}
              className="whitespace-nowrap rounded border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              Related Products →
            </button>
          </div>
        </div>

        {/* Search preview */}
        <div className="rounded-md border border-stone-200 p-4 space-y-1">
          <p className="text-xs text-green-700">
            {siteDomain} <span className="text-stone-400">›</span> rent <span className="text-stone-400">›</span> {previewPath}
          </p>
          <p className="text-lg text-blue-700 leading-snug">
            {previewTitle}
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            {previewDescription}
          </p>
        </div>
      </div>

      {/* Save action */}
      <div className="pt-3 border-t border-stone-100 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-amber-700/90 hover:bg-amber-700 text-white text-xs font-medium px-4 py-2 transition shadow-sm"
        >
          Save SEO
        </button>
      </div>
    </div>
  );
}
