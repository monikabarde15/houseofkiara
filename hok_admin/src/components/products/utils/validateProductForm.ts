import { Product, ProductTab } from "../../types/product";

export interface ProductValidationIssue {
  field: string;
  tab: ProductTab;
  message: string;
}

export interface ProductValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  issues: ProductValidationIssue[];
  firstErrorTab: ProductTab | null;
  errorTabs: ProductTab[];
}

export const VALID_LISTING_MODES = ["RENTAL", "PRELOVED", "BUY NEW"] as const;

export function normalizeProductListingModes(modes?: string[]): string[] {
  if (!Array.isArray(modes) || modes.length === 0) return [];
  return Array.from(
    new Set(
      modes
        .map((m) => String(m || "").trim().toUpperCase())
        .filter((m) =>
          (VALID_LISTING_MODES as readonly string[]).includes(m),
        ),
    ),
  );
}

const isBlank = (v: unknown): boolean =>
  v === undefined || v === null || String(v).trim() === "";

const toNum = (v: unknown): number => (isBlank(v) ? NaN : Number(v));

export function validateProductForm(
  formData: Partial<Product>,
  dbDesigners: any[] = [],
  existingProducts: Product[] = [],
): ProductValidationResult {
  const errors: Record<string, string> = {};
  const issues: ProductValidationIssue[] = [];

  const addIssue = (field: string, tab: ProductTab, message: string) => {
    if (!errors[field]) {
      errors[field] = message;
    }
    issues.push({ field, tab, message });
  };

  // 1. Core Details ("Core")
  const trimmedName = String(formData.name || "").trim();
  if (!trimmedName || trimmedName.length < 3) {
    addIssue(
      "name",
      "Core",
      "Product Title is required (at least 3 characters).",
    );
  }

  const trimmedDesigner = String(formData.designer || "").trim();
  if (!trimmedDesigner) {
    addIssue("designer", "Core", "Designer / Brand is required.");
  } else if (
    Array.isArray(dbDesigners) &&
    dbDesigners.length > 0 &&
    !dbDesigners.some(
      (d: any) =>
        String(d?.name || "").trim().toLowerCase() ===
        trimmedDesigner.toLowerCase(),
    )
  ) {
    addIssue(
      "designer",
      "Core",
      `"${trimmedDesigner}" is not in the Designers list. Please select a registered designer.`,
    );
  }

  const trimmedDescription = String(formData.description || "").trim();
  if (!trimmedDescription) {
    addIssue("description", "Core", "Full Description is required.");
  }

  const modes = normalizeProductListingModes(formData.listingModes);
  if (modes.length === 0) {
    addIssue(
      "listingModes",
      "Core",
      "Select at least one Listing Mode (RENTAL, PRELOVED, or BUY NEW).",
    );
  }

  const trimmedSku = String(formData.sku || "").trim();
  if (
    trimmedSku &&
    Array.isArray(existingProducts) &&
    existingProducts.length > 0
  ) {
    const currentIds = new Set(
      [formData.productId, (formData as any)._id, formData.id]
        .filter(Boolean)
        .map((x) => String(x).trim().toLowerCase()),
    );
    const duplicate = existingProducts.find((p: any) => {
      if (!p) return false;
      const pIds = [p.productId, p._id, p.id]
        .filter(Boolean)
        .map((x) => String(x).trim().toLowerCase());
      if (pIds.some((pid) => currentIds.has(pid))) return false;
      const pSku = String(p.sku || "").trim().toLowerCase();
      return Boolean(pSku && pSku === trimmedSku.toLowerCase());
    });
    if (duplicate) {
      addIssue(
        "sku",
        "Core",
        `SKU "${trimmedSku}" already exists on "${duplicate.name || duplicate.productId}". Every product must have a unique SKU.`,
      );
    }
  }

  // 2. Conditional Pricing & Tax ("Pricing")
  const hasRental = modes.includes("RENTAL");
  const hasPreloved = modes.includes("PRELOVED");
  const hasBuyNew = modes.includes("BUY NEW");

  if (hasRental) {
    const rentalPrice = toNum(formData.rentalPrice);
    if (
      isBlank(formData.rentalPrice) ||
      !Number.isFinite(rentalPrice) ||
      rentalPrice <= 0
    ) {
      addIssue(
        "rentalPrice",
        "Pricing",
        "Standard Rental Price (4 Days) must be greater than ₹0 for Rental listings.",
      );
    }

    const perDayRate = toNum(formData.perDayRate);
    if (
      isBlank(formData.perDayRate) ||
      !Number.isFinite(perDayRate) ||
      perDayRate <= 0
    ) {
      addIssue(
        "perDayRate",
        "Pricing",
        "Per-Day Rate must be greater than ₹0 for Rental listings.",
      );
    }

    if (!isBlank(formData.extendedWindowPrice)) {
      const extWin = toNum(formData.extendedWindowPrice);
      if (!Number.isFinite(extWin) || extWin < 0) {
        addIssue(
          "extendedWindowPrice",
          "Pricing",
          "Extended Window Price cannot be negative.",
        );
      }
    }

    if (!isBlank(formData.securityDeposit)) {
      const secDep = toNum(formData.securityDeposit);
      if (!Number.isFinite(secDep) || secDep < 0) {
        addIssue(
          "securityDeposit",
          "Pricing",
          "Security Deposit cannot be negative.",
        );
      }
    }

    if (!isBlank(formData.minimumDurationDays)) {
      const minDays = toNum(formData.minimumDurationDays);
      if (!Number.isFinite(minDays) || minDays < 1) {
        addIssue(
          "minimumDurationDays",
          "Pricing",
          "Min Rental Duration must be at least 1 day.",
        );
      }
    }

    if (!isBlank(formData.payoutPercentage)) {
      const rentalPayout = toNum(formData.payoutPercentage);
      if (
        !Number.isFinite(rentalPayout) ||
        rentalPayout < 0 ||
        rentalPayout > 100
      ) {
        addIssue(
          "payoutPercentage",
          "Pricing",
          "Rental Lister Payout % must be between 0 and 100.",
        );
      }
    }

    const nonNegativeRentalFields: Array<{
      field: keyof Product;
      label: string;
    }> = [
      { field: "preRentalBufferDays", label: "Pre-Dispatch Buffer" },
      { field: "postRentalBufferDays", label: "Post-Return Buffer" },
      { field: "cleaningBufferDays", label: "Cleaning Buffer (Days)" },
      { field: "cleaningFee", label: "Cleaning Fee" },
      { field: "extensionPrice", label: "Extension Price / Day" },
    ];

    nonNegativeRentalFields.forEach(({ field, label }) => {
      const raw = formData[field];
      if (!isBlank(raw)) {
        const val = toNum(raw);
        if (!Number.isFinite(val) || val < 0) {
          addIssue(String(field), "Pricing", `${label} cannot be negative.`);
        }
      }
    });
  }

  const listingPrice = toNum(formData.listingPrice);
  if (hasPreloved || hasBuyNew) {
    if (
      isBlank(formData.listingPrice) ||
      !Number.isFinite(listingPrice) ||
      listingPrice <= 0
    ) {
      let msg = "Buy New Price (₹) must be greater than ₹0 for Buy New listings.";
      if (hasPreloved && hasBuyNew) {
        msg =
          "Listed Price (₹) must be greater than ₹0 for Preloved / Buy New listings.";
      } else if (hasPreloved) {
        msg =
          "Preloved / Resale Price (₹) must be greater than ₹0 for Preloved listings.";
      }
      addIssue("listingPrice", "Pricing", msg);
    }

    if (!isBlank(formData.originalRetailPrice)) {
      const rrp = toNum(formData.originalRetailPrice);
      if (!Number.isFinite(rrp) || rrp < 0) {
        addIssue(
          "originalRetailPrice",
          "Pricing",
          "Original Retail Price (RRP) cannot be negative.",
        );
      }
    }
  }

  if (hasPreloved) {
    if (!isBlank(formData.resalePayoutPercentage)) {
      const resalePayout = toNum(formData.resalePayoutPercentage);
      if (
        !Number.isFinite(resalePayout) ||
        resalePayout < 0 ||
        resalePayout > 100
      ) {
        addIssue(
          "resalePayoutPercentage",
          "Pricing",
          "Resale Lister Payout % must be between 0 and 100.",
        );
      }
    }

    if (!isBlank(formData.minimumOffer)) {
      const minOffer = toNum(formData.minimumOffer);
      if (!Number.isFinite(minOffer) || minOffer < 0) {
        addIssue(
          "minimumOffer",
          "Pricing",
          "Minimum Offer cannot be negative.",
        );
      } else if (
        Number.isFinite(listingPrice) &&
        listingPrice > 0 &&
        minOffer > listingPrice
      ) {
        addIssue(
          "minimumOffer",
          "Pricing",
          "Minimum Offer cannot exceed the Listed Resale Price.",
        );
      }
    }
  }

  if (modes.length > 0) {
    if (!isBlank(formData.commissionRate)) {
      const commission = toNum(formData.commissionRate);
      if (!Number.isFinite(commission) || commission < 0 || commission > 100) {
        addIssue(
          "commissionRate",
          "Pricing",
          "HOK Platform Commission % must be between 0 and 100.",
        );
      }
    }

    const rawGst = !isBlank(formData.gstRate)
      ? formData.gstRate
      : formData.taxRate;
    if (!isBlank(rawGst)) {
      const gst = toNum(rawGst);
      if (!Number.isFinite(gst) || gst < 0 || gst > 100) {
        addIssue(
          "gstRate",
          "Pricing",
          "GST / Tax % Rate must be between 0 and 100.",
        );
      }
    }
  }

  // 3. Images ("Images")
  const validImages = Array.isArray(formData.images)
    ? formData.images.filter(
        (img) => typeof img === "string" && img.trim() !== "",
      )
    : [];
  if (validImages.length === 0) {
    addIssue(
      "images",
      "Images",
      "At least 1 product image is required before saving.",
    );
  }

  const errorTabs = Array.from(new Set(issues.map((issue) => issue.tab)));
  return {
    valid: issues.length === 0,
    errors,
    issues,
    firstErrorTab: errorTabs[0] ?? null,
    errorTabs,
  };
}
