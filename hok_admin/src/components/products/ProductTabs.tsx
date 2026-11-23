// src/components/products/ProductTabs.tsx

import React from "react";
import { ProductTab } from "../types/product";

interface ProductTabsProps {
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
  isAdding: boolean;
  errorTabs?: ProductTab[];
}

export const DEFAULT_TAB_LABELS: Record<ProductTab, string> = {
  Core: "Core Details",
  Pricing: "Pricing & Tax",
  Images: "Images",
  "Related Products": "Related Products",
  SEO: "SEO",
  Calendar: "Availability Calendar",
  "Payout History": "Payout History",
  "Enquiry History": "Enquiry History",
  "Activity Log": "Activity Log",
};

const ALL_TABS: ProductTab[] = [
  "Core",
  "Pricing",
  "Images",
  "Related Products",
  "SEO",
  "Calendar",
  "Payout History",
  "Enquiry History",
  "Activity Log",
];

export function ProductTabs({
  activeTab,
  onTabChange,
  isAdding,
  errorTabs = [],
}: ProductTabsProps) {
  // ✅ Sab tabs dikhao
  const visibleTabs = ALL_TABS;

  return (
    <div className="flex border-b border-stone-200 gap-1 select-none font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab;
        const hasError = errorTabs.includes(tab);

        // ✅ Check karo ki yeh Calendar ya Enquiry History hai aur kya hum Adding mode mein hain
        const isDisabled =
          isAdding && (tab === "Calendar" || tab === "Enquiry History");

        return (
          <button
            key={tab}
            onClick={() => {
              // Agar disabled hai toh click hone par kuch mat karo
              if (!isDisabled) {
                onTabChange(tab);
              }
            }}
            className={`shrink-0 px-3 xl:px-4 py-2 border-b-2 text-xs transition cursor-pointer inline-flex items-center gap-1.5 ${
              isDisabled
                ? "border-transparent text-stone-300 cursor-not-allowed" // ✅ Disabled look
                : isActive
                  ? "border-[#c5a880] text-stone-900 font-bold"
                  : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <span>{DEFAULT_TAB_LABELS[tab]}</span>
            {hasError && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-red-500"
                title="Has required fields"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
