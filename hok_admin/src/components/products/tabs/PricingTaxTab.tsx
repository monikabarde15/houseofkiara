// src/components/products/tabs/PricingTaxTab.tsx

import React from "react";
import { Lock } from "lucide-react";
import { Product } from "../../types/product";
import { useTeamPermissions } from "../../TeamPermissions";

interface PricingTaxTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  /**
   * true  -> "Add New Product" flow
   * false/undefined -> existing Edit flow
   */
  isAdding?: boolean;
  errors?: Record<string, string>;
  onSave?: () => Promise<boolean> | boolean | void;
  isSaving?: boolean;
  onNavigateToCore?: () => void;
}

export function PricingTaxTab({
  formData,
  onFieldChange,
  isAdding = false,
  errors = {},
  onSave,
  isSaving = false,
  onNavigateToCore,
}: PricingTaxTabProps) {
  const { hasDecision } = useTeamPermissions();
  const canSetPrices = hasDecision("set_or_change_prices");
  const canSetShare = hasDecision("set_lister_share");

  const data = formData as Record<string, any>;
  const set = (field: string, value: any) =>
    (onFieldChange as any)(field, value);

  const activeModes = Array.isArray(formData.listingModes)
    ? formData.listingModes.map((m) => String(m || "").trim().toUpperCase())
    : [];
  const hasRental = activeModes.includes("RENTAL");
  const hasPreloved = activeModes.includes("PRELOVED");
  const hasBuyNew = activeModes.includes("BUY NEW");
  const hasResaleOrBuyNew = hasPreloved || hasBuyNew;

  const numVal = (v: unknown): string | number =>
    v === undefined || v === null || v === "" ? "" : (v as number);

  const parseNumericInput = (raw: string): any =>
    raw.trim() === "" ? undefined : Number(raw);

  const roundCurrency = (n: number) => Math.round(n * 100) / 100;

  const perDayNum =
    data.perDayRate !== undefined &&
    data.perDayRate !== null &&
    String(data.perDayRate).trim() !== ""
      ? Number(data.perDayRate)
      : NaN;
  const autoFourDayPrice =
    Number.isFinite(perDayNum) && perDayNum > 0
      ? roundCurrency(perDayNum * 4)
      : null;
  const autoSevenDayPrice =
    Number.isFinite(perDayNum) && perDayNum > 0
      ? roundCurrency(perDayNum * 7)
      : null;

  const handlePerDayRateChange = (raw: string) => {
    const perDay = parseNumericInput(raw);
    set("perDayRate", perDay);

    if (perDay === undefined) {
      onFieldChange("rentalPrice", undefined as any);
      set("extendedWindowPrice", undefined);
      return;
    }

    if (Number.isFinite(perDay) && perDay >= 0) {
      onFieldChange("rentalPrice", roundCurrency(perDay * 4));
      set("extendedWindowPrice", roundCurrency(perDay * 7));
    }
  };

  const labelClass =
    "text-[11px] font-semibold text-stone-500 tracking-wide uppercase";
  const baseInputClass =
    "block w-full p-2 rounded text-xs mt-1 focus:outline-none focus:ring-1 border";
  const inputClass = `${baseInputClass} bg-[#fcf9f5] border-stone-200 focus:ring-stone-400`;
  const getInputClass = (field: string, extra = "", locked = false) =>
    `${baseInputClass} ${
      locked
        ? "tp-locked-field border-stone-200"
        : errors[field]
          ? "bg-red-50/40 border-red-400 focus:ring-red-300"
          : "bg-[#fcf9f5] border-stone-200 focus:ring-stone-400"
    } ${extra}`.trim();
  const LockedNotice = ({ text }: { text: string }) => (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#5C5248]">
      <Lock className="h-3 w-3 text-[#6E6358] shrink-0" />
      <span>{text}</span>
    </p>
  );
  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-[11px] text-red-600 mt-1">{errors[field]}</p>
    ) : null;
  const helpClass = "text-[11px] text-stone-400 mt-1";
  const helpOrangeClass = "text-orange-700";

  const listedResalePrice = Number(data.listingPrice || 0);
  const originalRetailPrice = Number(data.originalRetailPrice || 0);
  const discountVsRetail =
    originalRetailPrice > 0 && listedResalePrice > 0
      ? Math.round(
          ((originalRetailPrice - listedResalePrice) / originalRetailPrice) *
            100,
        )
      : 0;

  const resalePayoutPercentage = Number(data.resalePayoutPercentage || 0);
  const listerPayoutAuto = Math.round(
    (listedResalePrice * resalePayoutPercentage) / 100,
  );
  const hasCommissionRate =
    formData.commissionRate !== undefined &&
    formData.commissionRate !== null &&
    String(formData.commissionRate) !== "";
  const hokCommissionPct = hasCommissionRate
    ? Number(formData.commissionRate)
    : resalePayoutPercentage > 0
      ? Math.max(0, 100 - resalePayoutPercentage)
      : 0;
  const hokCommissionAuto = Math.max(listedResalePrice - listerPayoutAuto, 0);

  const resaleSectionTitle =
    hasPreloved && hasBuyNew
      ? "Preloved & Buy New Pricing"
      : hasBuyNew
        ? "Buy New Pricing"
        : "Preloved / Resale Pricing";

  const listingPriceLabel =
    hasPreloved && hasBuyNew
      ? "Listed Resale / Buy New Price (₹)"
      : hasBuyNew
        ? "Buy New Price (₹)"
        : "Listed Resale Price (₹)";

  // Simple toggle switch, matches the pill toggles in the Add-Product design
  const Toggle = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: React.ReactNode;
  }) => (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-stone-800" : "bg-stone-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
      <span className="text-xs text-stone-600">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ---------------- Active Listing Mode(s) Banner ---------------- */}
      {activeModes.length === 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-amber-900">
              No Listing Mode(s) selected yet
            </p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Select RENTAL, PRELOVED, or BUY NEW under Core Details so required
              pricing rules apply accurately.
            </p>
          </div>
          {onNavigateToCore && (
            <button
              type="button"
              onClick={onNavigateToCore}
              className="rounded border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-100 transition cursor-pointer"
            >
              Select Listing Mode(s) in Core Details →
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200/80 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Active Listing Mode(s):
            </span>
            {activeModes.map((mode) => (
              <span
                key={mode}
                className="rounded bg-[#FAF6EF] border border-[#DFC9A1] px-2 py-0.5 text-[11px] font-semibold text-[#6F4E1E]"
              >
                {mode}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-stone-500">
            Pricing &amp; Tax validation follows the checked Listing Mode(s).
          </span>
        </div>
      )}

      {/* ---------------- Rental Pricing ---------------- */}
      <div
        className={`bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5 transition-opacity ${
          !hasRental ? "opacity-65" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className={labelClass}>Rental Pricing</label>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              hasRental
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-stone-100 text-stone-500 border border-stone-200"
            }`}
          >
            {hasRental
              ? "Required for RENTAL"
              : "Not enabled in Listing Mode(s)"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Standard Window Price (4 Days)
              {hasRental && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter 4-day rental price (₹)"
              value={numVal(formData.rentalPrice)}
              readOnly={!canSetPrices}
              onChange={(e) => {
                if (!canSetPrices) return;
                onFieldChange(
                  "rentalPrice",
                  parseNumericInput(e.target.value),
                );
              }}
              className={getInputClass("rentalPrice", "", !canSetPrices)}
            />
            {renderError("rentalPrice")}
            {!canSetPrices && (
              <LockedNotice text="Not your role’s decision: set or change prices." />
            )}
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-stone-400">
                Auto-calculated as 4 × Per-Day Rate (editable).
              </p>
              {canSetPrices &&
                autoFourDayPrice !== null &&
                Number(formData.rentalPrice) !== autoFourDayPrice && (
                  <button
                    type="button"
                    onClick={() =>
                      onFieldChange("rentalPrice", autoFourDayPrice)
                    }
                    className="text-[11px] font-medium text-amber-800 hover:underline cursor-pointer"
                  >
                    Reset to ₹{autoFourDayPrice.toLocaleString("en-IN")}
                  </button>
                )}
            </div>
          </div>
          <div>
            <label className={labelClass}>Extended Window Price (7 Days)</label>
            <input
              type="number"
              min="0"
              placeholder="Optional 7-day rental price (₹)"
              value={numVal(data.extendedWindowPrice)}
              readOnly={!canSetPrices}
              onChange={(e) => {
                if (!canSetPrices) return;
                set("extendedWindowPrice", parseNumericInput(e.target.value));
              }}
              className={getInputClass("extendedWindowPrice", "", !canSetPrices)}
            />
            {renderError("extendedWindowPrice")}
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-stone-400">
                Auto-calculated as 7 × Per-Day Rate (editable).
              </p>
              {canSetPrices &&
                autoSevenDayPrice !== null &&
                Number(data.extendedWindowPrice) !== autoSevenDayPrice && (
                  <button
                    type="button"
                    onClick={() =>
                      set("extendedWindowPrice", autoSevenDayPrice)
                    }
                    className="text-[11px] font-medium text-amber-800 hover:underline cursor-pointer"
                  >
                    Reset to ₹{autoSevenDayPrice.toLocaleString("en-IN")}
                  </button>
                )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Per-Day Rate (Custom Durations)
              {hasRental && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter per-day rate (₹)"
              value={numVal(data.perDayRate)}
              readOnly={!canSetPrices}
              onChange={(e) => {
                if (!canSetPrices) return;
                handlePerDayRateChange(e.target.value);
              }}
              className={getInputClass("perDayRate", "", !canSetPrices)}
            />
            {renderError("perDayRate")}
            <p className={helpClass}>
              Auto-fills 4-day (×4) and 7-day (×7) window prices above — both
              remain editable.
            </p>
          </div>
          <div>
            <label className={labelClass}>Min Rental Duration (Days)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 3 or 4"
              value={numVal(formData.minimumDurationDays)}
              onChange={(e) =>
                onFieldChange(
                  "minimumDurationDays",
                  parseNumericInput(e.target.value),
                )
              }
              className={getInputClass("minimumDurationDays")}
            />
            {renderError("minimumDurationDays")}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Lister Payout % — Rental —{" "}
            <span className={helpOrangeClass}>
              per-piece suggestion; the split is decided per transaction, at
              booking or at payout approval
            </span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="0 - 100"
            value={numVal(formData.payoutPercentage)}
            readOnly={!canSetShare}
            onChange={(e) => {
              if (!canSetShare) return;
              onFieldChange(
                "payoutPercentage",
                parseNumericInput(e.target.value),
              );
            }}
            className={getInputClass("payoutPercentage", "max-w-sm", !canSetShare)}
          />
          {renderError("payoutPercentage")}
          <p className={helpClass}>
            Dynamic share: couture &amp; in-demand silhouettes carry a higher
            lister % (the piece recovers the lister's investment faster);
            high-rotation pieces on their 9th–10th rental — priced lower to the
            customer — carry a lower %, reflecting HOK's effort to keep them
            booked.
          </p>
          {!canSetShare && (
            <LockedNotice text="Not your role’s decision: set a lister’s share." />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Security Deposit —{" "}
              <span className={helpOrangeClass}>per-listing field</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter security deposit (₹)"
              value={numVal(formData.securityDeposit)}
              readOnly={!canSetPrices}
              onChange={(e) => {
                if (!canSetPrices) return;
                onFieldChange(
                  "securityDeposit",
                  parseNumericInput(e.target.value),
                );
              }}
              className={getInputClass("securityDeposit", "", !canSetPrices)}
            />
            {renderError("securityDeposit")}
            <p className={helpClass}>
              Charged at checkout, held until return inspection passes, then
              released.
            </p>
          </div>
          <div>
            <label className={labelClass}>
              Pre-Dispatch Buffer (Before Rental Start)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Days"
              value={numVal(formData.preRentalBufferDays)}
              onChange={(e) =>
                onFieldChange(
                  "preRentalBufferDays",
                  parseNumericInput(e.target.value),
                )
              }
              className={getInputClass("preRentalBufferDays")}
            />
            {renderError("preRentalBufferDays")}
            <p className={helpClass}>
              Days blocked before dispatch — default from Master Data, override
              if this piece needs less prep time.
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Post-Return Buffer + Cleaning (After Return)
          </label>
          <input
            type="number"
            min="0"
            placeholder="Days"
            value={numVal(formData.postRentalBufferDays)}
            onChange={(e) =>
              onFieldChange(
                "postRentalBufferDays",
                parseNumericInput(e.target.value),
              )
            }
            className={getInputClass("postRentalBufferDays", "max-w-sm")}
          />
          {renderError("postRentalBufferDays")}
          <p className={helpClass}>
            Days blocked after return — default is Master Data's Post-Rental
            Buffer (2) + Cleaning Period (1). Lower this if your dry-cleaner
            turns pieces around faster.
          </p>
        </div>
      </div>

      {/* ---------------- Preloved / Buy New Pricing ---------------- */}
      <div
        className={`bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5 transition-opacity ${
          !hasResaleOrBuyNew ? "opacity-65" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className={labelClass}>{resaleSectionTitle}</label>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              hasResaleOrBuyNew
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-stone-100 text-stone-500 border border-stone-200"
            }`}
          >
            {hasPreloved && hasBuyNew
              ? "Required for PRELOVED & BUY NEW"
              : hasPreloved
                ? "Required for PRELOVED"
                : hasBuyNew
                  ? "Required for BUY NEW"
                  : "Not enabled in Listing Mode(s)"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {listingPriceLabel}
              {hasResaleOrBuyNew && <span className="text-red-500"> *</span>} —{" "}
              <span className={helpOrangeClass}>main PDP price</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter listing price (₹)"
              value={numVal(formData.listingPrice)}
              readOnly={!canSetPrices}
              onChange={(e) => {
                if (!canSetPrices) return;
                onFieldChange(
                  "listingPrice",
                  parseNumericInput(e.target.value),
                );
              }}
              className={getInputClass("listingPrice", "", !canSetPrices)}
            />
            {renderError("listingPrice")}
          </div>
          <div>
            <label className={labelClass}>Original Retail Price (RRP)</label>
            <input
              type="number"
              min="0"
              placeholder="Optional original MRP (₹)"
              value={numVal(data.originalRetailPrice)}
              readOnly={!canSetPrices}
              onChange={(e) => {
                if (!canSetPrices) return;
                set("originalRetailPrice", parseNumericInput(e.target.value));
              }}
              className={getInputClass("originalRetailPrice", "", !canSetPrices)}
            />
            {renderError("originalRetailPrice")}
          </div>
        </div>

        {(hasPreloved || !hasBuyNew) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Discount vs Retail —{" "}
                  <span className={helpOrangeClass}>
                    auto-calculated, shown on PDP
                  </span>
                </label>
                <div className={`${inputClass} bg-stone-100 text-stone-600`}>
                  {originalRetailPrice > 0 && listedResalePrice > 0
                    ? `${discountVsRetail}% off retail`
                    : "—"}
                </div>
                <p className={helpClass}>
                  RRP shown struck through beside the resale price on the PDP.
                </p>
              </div>
              <div>
                <label className={labelClass}>
                  Lister Payout % — Resale —{" "}
                  <span className={helpOrangeClass}>
                    per-piece suggestion; decided per transaction at acceptance
                    or payout approval
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={numVal(data.resalePayoutPercentage)}
                  readOnly={!canSetShare}
                  onChange={(e) => {
                    if (!canSetShare) return;
                    set(
                      "resalePayoutPercentage",
                      parseNumericInput(e.target.value),
                    );
                  }}
                  className={getInputClass("resalePayoutPercentage", "", !canSetShare)}
                />
                {renderError("resalePayoutPercentage")}
                {!canSetShare && (
                  <LockedNotice text="Not your role’s decision: set a lister’s share." />
                )}
                <p className={helpClass}>
                  Per-product; drives the auto-calculated payout below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Minimum Offer (₹) —{" "}
                  <span className={helpOrangeClass}>optional</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="₹ — overrides sitewide floor"
                  value={numVal(data.minimumOffer)}
                  readOnly={!canSetPrices}
                  onChange={(e) => {
                    if (!canSetPrices) return;
                    set("minimumOffer", parseNumericInput(e.target.value));
                  }}
                  className={getInputClass("minimumOffer", "", !canSetPrices)}
                />
                {renderError("minimumOffer")}
                <p className={helpClass}>
                  Absolute floor for this listing; blank uses the sitewide %
                  floor in Site Settings.
                </p>
              </div>
              <div>
                <label className={labelClass}>Lister Payout (Auto)</label>
                <div className={`${inputClass} bg-stone-100 text-stone-600`}>
                  {listedResalePrice > 0 && resalePayoutPercentage > 0
                    ? `₹${listerPayoutAuto.toLocaleString("en-IN")}`
                    : "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  HOK Commission ({hokCommissionPct}%)
                </label>
                <div className={`${inputClass} bg-stone-100 text-stone-600`}>
                  {listedResalePrice > 0 && resalePayoutPercentage > 0
                    ? `₹${hokCommissionAuto.toLocaleString("en-IN")}`
                    : "—"}
                </div>
              </div>
              <div className="flex items-end pb-2">
                <Toggle
                  checked={!!data.allowMakeOffer}
                  onChange={(v) => set("allowMakeOffer", v)}
                  label="Buyers can submit offers on this preloved listing"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---------------- Commission, Fees & Tax ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm">
          Commission, Fees &amp; Tax
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>HOK Platform Commission %</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="0 - 100"
              value={numVal(formData.commissionRate)}
              onChange={(e) =>
                onFieldChange(
                  "commissionRate",
                  parseNumericInput(e.target.value),
                )
              }
              className={getInputClass("commissionRate")}
            />
            {renderError("commissionRate")}
          </div>
          <div>
            <label className={labelClass}>
              Extension Price / Day — ₹
              {!hasRental && (
                <span className="ml-1 text-[10px] font-normal text-stone-400 normal-case">
                  (Rental)
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Optional per-day extension fee (₹)"
              value={numVal(formData.extensionPrice)}
              onChange={(e) =>
                onFieldChange(
                  "extensionPrice",
                  parseNumericInput(e.target.value),
                )
              }
              className={getInputClass("extensionPrice")}
            />
            {renderError("extensionPrice")}
          </div>
          <div>
            <label className={labelClass}>
              Cleaning Fee — ₹
              {!hasRental && (
                <span className="ml-1 text-[10px] font-normal text-stone-400 normal-case">
                  (Rental)
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Optional cleaning fee (₹)"
              value={numVal(formData.cleaningFee)}
              onChange={(e) =>
                onFieldChange(
                  "cleaningFee",
                  parseNumericInput(e.target.value),
                )
              }
              className={getInputClass("cleaningFee")}
            />
            {renderError("cleaningFee")}
          </div>
          <div>
            <label className={labelClass}>GST / Tax % Rate</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="0 - 100"
              value={numVal(formData.gstRate ?? formData.taxRate)}
              onChange={(e) => {
                const val = parseNumericInput(e.target.value);
                onFieldChange("gstRate", val);
                onFieldChange("taxRate", val);
              }}
              className={getInputClass("gstRate")}
            />
            {renderError("gstRate")}
          </div>
          <div>
            <label className={labelClass}>
              Cleaning Buffer (Days)
              {!hasRental && (
                <span className="ml-1 text-[10px] font-normal text-stone-400 normal-case">
                  (Rental)
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Optional days"
              value={numVal(formData.cleaningBufferDays)}
              onChange={(e) =>
                onFieldChange(
                  "cleaningBufferDays",
                  parseNumericInput(e.target.value),
                )
              }
              className={getInputClass("cleaningBufferDays")}
            />
            {renderError("cleaningBufferDays")}
          </div>
          <div className="flex items-end pb-2">
            <Toggle
              checked={!!data.stylistConsultationBanner}
              onChange={(v) => set("stylistConsultationBanner", v)}
              label="Show banner on PDP (Preloved & Buy New only)"
            />
          </div>
        </div>
      </div>

      {onSave && (
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-stone-500">
            Validates Core Details, checked Listing Mode pricing, and product
            images before saving.
          </p>
          <button
            type="button"
            onClick={() => onSave()}
            disabled={isSaving}
            className={`px-5 py-2 text-xs font-semibold rounded transition ${
              isSaving
                ? "bg-gray-300 text-stone-600 cursor-not-allowed opacity-70"
                : "bg-amber-700 hover:bg-amber-800 text-white cursor-pointer"
            }`}
          >
            {isSaving ? "Saving..." : "Save Pricing & Tax"}
          </button>
        </div>
      )}
    </div>
  );
}
