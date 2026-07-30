import React from 'react';
import { Plus, ExternalLink } from 'lucide-react';

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
    <div className="space-y-1 pt-1">
      <span className="text-[11px] font-medium tracking-[0.18em] text-[#B39B6B] uppercase block mb-0.5">
        CATALOGUE
      </span>
      <h1 className="text-3xl sm:text-[34px] font-serif text-[#2B2520] font-normal tracking-tight leading-tight">
        Products
      </h1>
      <p className="text-xs sm:text-[13px] text-[#8C847A] mt-1 max-w-2xl leading-relaxed">
        Full catalogue across Rental, Preloved and Buy New. Click any row to open the full product editor with availability calendar. Use Cal button to jump straight to the calendar.
      </p>
    </div>
  );
}