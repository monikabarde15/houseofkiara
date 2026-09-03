// src/components/products/tabs/RelatedProductsTab.tsx

import React, { useMemo, useState } from 'react';
import { X, Search, Shirt } from 'lucide-react';
import { Product } from '../../types/product';

interface RelatedProductsTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  allProducts: Product[];
  currentProductId?: string;
  onSave?: () => void;
}

export function RelatedProductsTab({
  formData,
  onFieldChange,
  allProducts,
  currentProductId,
  onSave,
}: RelatedProductsTabProps) {
  const [query, setQuery] = useState('');

  const relatedIds = formData.relatedProductIds || [];

  const availableProducts = useMemo(
    () => allProducts.filter(p => p.id !== currentProductId),
    [allProducts, currentProductId]
  );

  const relatedProducts = useMemo(
    () => relatedIds
      .map(id => availableProducts.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p)),
    [relatedIds, availableProducts]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return availableProducts
      .filter(p => !relatedIds.includes(p.id))
      .filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        p.designer?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, availableProducts, relatedIds]);

  const handleAddRelated = (productId: string) => {
    onFieldChange('relatedProductIds', [...relatedIds, productId]);
    setQuery('');
  };

  const handleRemoveRelated = (productId: string) => {
    onFieldChange('relatedProductIds', relatedIds.filter(id => id !== productId));
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5">
      {/* Info banner */}
      <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3">
        <p className="text-xs text-stone-600 leading-relaxed">
          Pieces added here appear in the &ldquo;You May Also Like&rdquo; section on this product&apos;s PDP.
          Aim for 4-8 relevant pieces &mdash; similar silhouette, same designer, or matching occasion.
        </p>
      </div>

      {/* Search / add */}
      <div className="space-y-2">
        <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wide">
          Add a Related Product
        </h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, SKU, or designer..."
            className="w-full rounded-md border border-stone-200 pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
          />

          {query.trim() && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-stone-200 bg-white shadow-lg max-h-64 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="px-3 py-3 text-xs text-stone-400">No matching products found.</p>
              ) : (
                searchResults.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAddRelated(p.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-stone-50 transition border-b border-stone-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded bg-stone-900 flex items-center justify-center shrink-0">
                      <Shirt className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-stone-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {p.designer}{p.sku ? ` · ${p.sku}` : ''}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Currently related */}
      <div className="space-y-2">
        <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wide">
          Currently Related ({relatedProducts.length})
        </h4>

        {relatedProducts.length === 0 ? (
          <p className="text-stone-400 text-xs">No related products selected yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {relatedProducts.map(p => (
              <div
                key={p.id}
                className="relative flex items-center gap-3 rounded-md border border-stone-200 p-3"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveRelated(p.id)}
                  aria-label={`Remove ${p.name}`}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="w-10 h-10 rounded bg-stone-900 flex items-center justify-center shrink-0">
                  <Shirt className="w-5 h-5 text-stone-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-stone-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-stone-400 truncate">
                    {p.designer}{p.sku ? ` · ${p.sku}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save action */}
      <div className="pt-3 border-t border-stone-100 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-amber-700/90 hover:bg-amber-700 text-white text-xs font-medium px-4 py-2 transition shadow-sm"
        >
          Save Related Products
        </button>
      </div>
    </div>
  );
}
