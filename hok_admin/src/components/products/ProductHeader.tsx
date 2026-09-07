import React from 'react';
import { Plus, ExternalLink } from 'lucide-react';

interface ProductHeaderProps {
  isEditing: boolean;
  isAdding: boolean;
  productName?: string;

  // ✅ API se aane wale saare naye props
  designer?: string;
  sku?: string;
  listingMode?: string;
  condition?: string;
  size?: string;
  status?: string;
  listerName?: string;
  rentedCount?: number;

  // ✅ Rental Status ke props
  rentalStatus?: string;
  currentRenterName?: string;
  currentOrderId?: string;
  rentUntil?: string;
  nextFreeDate?: string;
  earnedAmount?: number;

  // ✅ NAYA PROP: Save button disabled karne ke liye
  isSaving?: boolean;

  // ✅ NAYE PROPS: Duplicate aur Archive ke liye
  onDuplicate?: () => void;
  onArchive?: () => void;

  onSave: () => void;
  onAdd: () => void;
  onBack?: () => void;
  showAddButton?: boolean;
}

export function ProductHeader({
  isEditing,
  isAdding,
  productName,

  // ✅ API data
  designer,
  sku,
  listingMode,
  condition,
  size,
  status,
  listerName,
  rentedCount,

  rentalStatus,
  currentRenterName,
  currentOrderId,
  rentUntil,
  nextFreeDate,
  earnedAmount,

  isSaving = false, // ✅ Default false rakho
  onDuplicate,      // ✅ Naya prop
  onArchive,        // ✅ Naya prop
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

            {/* DESIGNER, SKU, LISTING MODE */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[13px] font-normal text-[#81786D]">
              {designer && (
                <>
                  <span>{designer}</span>
                  <span>·</span>
                </>
              )}
              {sku && (
                <>
                  <span>SKU: {sku}</span>
                  <span>·</span>
                </>
              )}
              <span>{listingMode || 'RENTAL'}</span>
            </div>

            {/* LISTER, CONDITION, SIZE, RENTED COUNT */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-[#8A8177]">
              <span>
                Lister:
                <span className="ml-1 font-medium text-[#6C645B]">
                  {listerName || 'Select a lister'}
                </span>
              </span>

              <span>•</span>
              <span>{condition || 'Excellent'}</span>

              <span>•</span>
              <span>Size {size || 'S'}</span>

              <span>•</span>
              <span>Rented {rentedCount || 0}×</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5 self-start shrink-0">

            {/* STATUS */}
            <span className="inline-flex h-6 items-center rounded-md bg-[#EEF8EE] px-2.5 text-[11px] font-semibold text-[#4E8E58]">
              {status || 'Live'}
            </span>

            {/* ✅ DUPLICATE BUTTON (Ab clickable hai!) */}
            <button
              onClick={onDuplicate}
              disabled={isSaving}
              className={`inline-flex h-8 items-center rounded-md border border-[#E7DED2] bg-white px-3.5 text-[12px] font-medium text-[#3D3832] transition hover:bg-[#FBF9F6] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Duplicate as Draft
            </button>

            {/* ✅ ARCHIVE BUTTON (Ab clickable hai!) */}
            <button
              onClick={onArchive}
              disabled={isSaving}
              className={`inline-flex h-8 items-center rounded-md border border-[#F3D5CF] bg-white px-3.5 text-[12px] font-medium text-[#CC6E56] transition hover:bg-[#FFF8F6] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Archive
            </button>

            <button className="inline-flex h-8 items-center rounded-md border border-[#E7DED2] bg-white px-3.5 text-[12px] font-medium text-[#3D3832] transition hover:bg-[#FBF9F6]">
              View on Site →
            </button>

            {/* ✅ SAVE CHANGES BUTTON */}
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`inline-flex h-8 items-center rounded-md px-4 text-[12px] font-semibold shadow-sm transition ${isSaving
                ? 'bg-gray-400 text-gray-100 cursor-not-allowed opacity-70'
                : 'bg-[#C9A75B] text-[#2A2118] hover:bg-[#BC9A4F]'
                }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div >
        </div >

        {/* Rental Status Banner */}
        <div className="rounded-md border border-[#E8DDD0] bg-[#FFF9F2] px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-full bg-[#F2D8B8] text-[10px]">
              ⚠
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">

                {/* RENTAL STATUS, RENTER, ORDER ID */}
                <span className="text-[13px] font-semibold text-[#2E2923]">
                  {rentalStatus || 'Not Rented'}
                </span>
                {currentRenterName && (
                  <>
                    <span className="text-[#B2A79A]">—</span>
                    <span className="text-[13px] text-[#2D241D]">{currentRenterName}</span>
                  </>
                )}
                {currentOrderId && (
                  <span className="rounded-sm bg-[#F4EADF] px-1.5 py-0.5 text-[11px] font-medium text-[#C49348]">
                    {currentOrderId}
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[13px] text-[#4E4740]">

                {/* DATES, RENTED COUNT, EARNED AMOUNT */}
                {rentUntil && <span>Until <strong>{rentUntil}</strong></span>}
                {nextFreeDate && <span>Next free <strong>{nextFreeDate}</strong></span>}
                <span>Rented <strong>{rentedCount || 0}×</strong></span>
                <span>Earned <strong>₹{(earnedAmount || 0).toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }

  // ================= Main products list view =================
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