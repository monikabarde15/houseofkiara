// src/components/products/ProductHeader.tsx

import React from 'react';
import { Plus } from 'lucide-react';

interface ProductHeaderProps {
  isEditing: boolean;
  isAdding: boolean;
  productName?: string;
  // onBack: () => void;
  onSave: () => void;
  onAdd: () => void;
  showAddButton?: boolean;
}

export function ProductHeader({
  isEditing,
  isAdding,
  productName,
  // onBack,
  onSave,
  onAdd,
  showAddButton = true
}: ProductHeaderProps) {
  if (isEditing || isAdding) {
    return (
      <div className="space-y-5">

        {/* Breadcrumb */}
        {/* <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E8E0D6] bg-white px-3 text-[12px] font-medium text-[#6F675D] transition hover:bg-[#FAF8F5]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <div className="flex items-center text-[12px] text-[#9A9186]">
            <span>Products</span>

            <svg
              className="mx-2 h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>

            <span className="font-medium text-[#2B2622]">
              {productName}
            </span>
          </div>
        </div> */}

        {/* Product Header */}

        <div className="flex items-start justify-between gap-12 pt-1">

          {/* Left */}
          <div className="min-w-0 flex-1">

            <h1 className="font-serif text-[44px] leading-[1.08] font-normal tracking-[-0.02em] text-[#2A241F]">
              {productName}
            </h1>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[13px] font-normal text-[#81786D]">
              <span>Sabyasachi</span>
              <span>·</span>
              <span>SKU: HOK-SAB-001</span>
              <span>·</span>
              <span>Rental</span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-[#8A8177]">
              <span>
                Lister:
                <span className="ml-1 font-medium text-[#6C645B]">
                  Meera Joshi
                </span>
              </span>

              <span>•</span>
              <span>Excellent</span>

              <span>•</span>
              <span>Size S</span>

              <span>•</span>
              <span>Rented 6×</span>

              <span>•</span>
              <span>From 29 Mar</span>
            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-2.5 self-start shrink-0">

            <span className="inline-flex h-6 items-center rounded-md bg-[#EEF8EE] px-2.5 text-[11px] font-semibold text-[#4E8E58]">
              Live
            </span>

            <button className="inline-flex h-8 items-center rounded-md border border-[#E7DED2] bg-white px-3.5 text-[12px] font-medium text-[#3D3832] transition hover:bg-[#FBF9F6]">
              Duplicate as Draft
            </button>

            <button className="inline-flex h-8 items-center rounded-md border border-[#F3D5CF] bg-white px-3.5 text-[12px] font-medium text-[#CC6E56] transition hover:bg-[#FFF8F6]">
              Archive
            </button>

            <button className="inline-flex h-8 items-center rounded-md border border-[#E7DED2] bg-white px-3.5 text-[12px] font-medium text-[#3D3832] transition hover:bg-[#FBF9F6]">
              View on Site →
            </button>

            <button
              onClick={onSave}
              className="inline-flex h-8 items-center rounded-md bg-[#C9A75B] px-4 text-[12px] font-semibold text-[#2A2118] shadow-sm transition hover:bg-[#BC9A4F]"
            >
              Save Changes
            </button>

          </div>

        </div>

        {/* Rental Status */}

        <div className="rounded-md border border-[#E8DDD0] bg-[#FFF9F2] px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-full bg-[#F2D8B8] text-[10px]">
              ⚠
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold text-[#2E2923]">
                  In rental
                </span>
                <span className="text-[#B2A79A]">—</span>
                <span className="text-[13px] text-[#2D241D]">
                  Sneha Iyer
                </span>
                <span className="rounded-sm bg-[#F4EADF] px-1.5 py-0.5 text-[11px] font-medium text-[#C49348]">
                  HOK-ORD-009
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[13px] text-[#4E4740]">
                <span>Until <strong>25 Mar</strong></span>
                <span>Next free <strong>29 Mar</strong></span>
                <span>Rented <strong>6×</strong></span>
                <span>Earned <strong>₹17,000</strong></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Products</h2>
        <p className="text-xs text-stone-500 mt-1">
          Complete inventory manager. Edit any row to open the full product editor with availability calendar.
        </p>
      </div>
      {showAddButton && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      )}
    </div>
  );
}