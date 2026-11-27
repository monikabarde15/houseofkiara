// src/components/products/tabs/RelatedProductsTab.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, Shirt, ExternalLink } from "lucide-react";
import { Product } from "../../types/product";
import {
  collectProductIds,
  filterSelectableLiveProducts,
  getCanonicalProductId,
  resolveLiveRelatedProducts,
} from "../utils/relatedProductsHelpers";

interface RelatedProductsTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  allProducts: Product[];
  currentProductId?: string;
  onSave?: () => Promise<boolean> | boolean | void;
  isSaving?: boolean;
}

const getLivePdpPath = (p: Product): string => {
  const targetId = String(
    (p as any)?._id || p?.productId || p?.id || p?.sku || "",
  ).trim();
  if (!targetId) return "/products";
  const modes = (Array.isArray(p?.listingModes) ? p.listingModes : []).map((m) =>
    String(m || "").toUpperCase(),
  );
  const rent = modes.some((m) => m.includes("RENT"));
  const preloved = modes.some(
    (m) => m.includes("PRELOVED") || m.includes("RE-SELL"),
  );
  const buyNew = modes.some((m) => m.includes("NEW") || m.includes("BUY"));
  const encoded = encodeURIComponent(targetId);

  if (rent && preloved) return `/rentalandpreloved/${encoded}`;
  if (rent && buyNew) return `/rentalandbuy/${encoded}`;
  if (rent) return `/onlyrental/${encoded}`;
  if (preloved) return `/preloved/${encoded}`;
  if (buyNew) return `/buynew/${encoded}`;
  return `/product/${encoded}`;
};

export function RelatedProductsTab({
  formData,
  onFieldChange,
  allProducts,
  currentProductId,
  onSave,
  isSaving = false,
}: RelatedProductsTabProps) {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const relatedIds = formData.relatedProductIds || [];

  const excludedCurrentIds = useMemo(
    () =>
      [
        currentProductId,
        formData.productId,
        formData.id,
        (formData as any)._id,
      ]
        .filter(Boolean)
        .map((id) => String(id)),
    [currentProductId, formData.productId, formData.id, (formData as any)._id],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectableLiveProducts = useMemo(
    () =>
      filterSelectableLiveProducts(
        allProducts,
        excludedCurrentIds,
        relatedIds,
        query,
      ),
    [allProducts, excludedCurrentIds, relatedIds, query],
  );

  const relatedProducts = useMemo(
    () =>
      resolveLiveRelatedProducts(allProducts, excludedCurrentIds, relatedIds),
    [allProducts, excludedCurrentIds, relatedIds],
  );

  const handleAddRelated = (product: Product) => {
    const canonicalId = getCanonicalProductId(product);
    if (!canonicalId) return;

    const productAliases = new Set(collectProductIds(product));
    const alreadyExists = relatedIds.some((id) =>
      productAliases.has(String(id || "").trim()),
    );
    if (!alreadyExists) {
      onFieldChange("relatedProductIds", [...relatedIds, canonicalId]);
    }
    setQuery("");
    setIsDropdownOpen(true);
  };

  const handleRemoveRelated = (product: Product) => {
    const productAliases = new Set(collectProductIds(product));
    onFieldChange(
      "relatedProductIds",
      relatedIds.filter((id) => !productAliases.has(String(id || "").trim())),
    );
  };

  const renderThumb = (p: Product, boxClass: string, iconClass: string) => {
    const imgUrl = Array.isArray(p.images) ? p.images[0] : "";
    if (imgUrl) {
      return (
        <img
          src={imgUrl}
          alt={p.name}
          className={`${boxClass} rounded object-cover object-top shrink-0 bg-stone-100 border border-stone-200`}
        />
      );
    }
    return (
      <div
        className={`${boxClass} rounded bg-stone-900 flex items-center justify-center shrink-0`}
      >
        <Shirt className={iconClass} />
      </div>
    );
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5">
      {/* Info banner */}
      <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3">
        <p className="text-xs text-stone-600 leading-relaxed">
          Pieces added here appear in the &ldquo;You May Also Like&rdquo;
          section on this product&apos;s PDP. Only <strong>Live</strong>{" "}
          products are shown here and on the storefront. Aim for 4-8 relevant
          pieces &mdash; similar silhouette, same designer, or matching
          occasion.
        </p>
      </div>

      {/* Search / add */}
      <div className="space-y-2" ref={dropdownContainerRef}>
        <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wide">
          Add a Related Product
        </h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsDropdownOpen(true)}
            onClick={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Click to browse live products or search by name, SKU, or designer..."
            className="w-full rounded-md border border-stone-200 pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
          />

          {isDropdownOpen && (
            <div className="absolute z-20 mt-1 w-full rounded-md border border-stone-200 bg-white shadow-lg max-h-72 overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-1.5 bg-stone-50 border-b border-stone-100 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                <span>
                  {query.trim()
                    ? `Matching Live Products (${selectableLiveProducts.length})`
                    : `Live Products (${selectableLiveProducts.length})`}
                </span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  Close
                </button>
              </div>
              {selectableLiveProducts.length === 0 ? (
                <p className="px-3 py-3 text-xs text-stone-400">
                  {query.trim()
                    ? "No matching live products found."
                    : "No more live products available to add."}
                </p>
              ) : (
                selectableLiveProducts.map((p) => {
                  const key = getCanonicalProductId(p) || p.name;
                  return (
                    <button
                      key={key}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleAddRelated(p)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-stone-50 transition border-b border-stone-100 last:border-b-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {renderThumb(p, "w-8 h-8", "w-4 h-4 text-stone-400")}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-stone-800 truncate">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate">
                            {p.designer}
                            {p.sku ? ` · ${p.sku}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        Live
                      </span>
                    </button>
                  );
                })
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
          <p className="text-stone-400 text-xs">
            No related products selected yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {relatedProducts.map((p) => {
              const key = getCanonicalProductId(p) || p.name;
              return (
                <div
                  key={key}
                  className="relative flex items-center gap-3 rounded-md border border-stone-200 p-3"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveRelated(p)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition shadow-sm cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {renderThumb(p, "w-10 h-10", "w-5 h-5 text-stone-500")}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={getLivePdpPath(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open storefront PDP"
                        className="text-xs font-medium text-stone-800 hover:text-[#A56728] hover:underline truncate inline-flex items-center gap-1"
                      >
                        <span className="truncate">{p.name}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-stone-400" />
                      </a>
                      <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-medium text-emerald-700">
                        Live
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 truncate">
                      {p.designer}
                      {p.sku ? ` · ${p.sku}` : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save action */}
      <div className="pt-3 border-t border-stone-100 flex justify-end">
        <button
          type="button"
          onClick={() => onSave?.()}
          disabled={isSaving}
          className={`rounded-md bg-amber-700/90 hover:bg-amber-700 text-white text-xs font-medium px-4 py-2 transition shadow-sm cursor-pointer ${
            isSaving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Saving..." : "Save Related Products"}
        </button>
      </div>
    </div>
  );
}
