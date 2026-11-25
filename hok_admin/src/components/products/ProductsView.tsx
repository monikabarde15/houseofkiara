import React, { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Lister } from "../types/product";
import * as productApi from "../../services/productApi";
import * as productSectionsApi from "../../services/productSectionsApi";
import { getDesigners } from "../../services/designerApi";
import { getCategories } from "../../services/categoryApi";
import {
  collectProductIds,
  getCanonicalProductId,
  isLiveProductStatus,
} from "./utils/relatedProductsHelpers";
import { useProductEditor } from "../hooks/useProductEditor";
import { ProductHeader } from "./ProductHeader";
import { ProductFilters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import { ProductTabs, DEFAULT_TAB_LABELS } from "./ProductTabs";
import { CoreDetailsTab } from "./tabs/CoreDetailsTab";
import { PricingTaxTab } from "./tabs/PricingTaxTab";
import { ImagesTab } from "./tabs/ImagesTab";
import { SEOTab } from "./tabs/SEOTab";
import { RelatedProductsTab } from "./tabs/RelatedProductsTab";
import { AvailabilityCalendarTab } from "./tabs/AvailabilityCalendarTab";
import { PayoutHistoryTab } from "./tabs/PayoutHistoryTab";
import { EnquiryHistoryTab } from "./tabs/EnquiryHistoryTab";
import { ActivityLogTab } from "./tabs/ActivityLogTab";
import { ProductSidebar } from "./ProductSidebar";
import toast from "react-hot-toast";
import {
  validateProductForm,
  ProductValidationIssue,
  normalizeProductListingModes,
} from "./utils/validateProductForm";

type ProductTab =
  | "Core"
  | "Pricing"
  | "Images"
  | "Related Products"
  | "SEO"
  | "Calendar"
  | "Payout History"
  | "Enquiry History"
  | "Activity Log";

interface ProductsViewProps {
  products: Product[];
  orders?: any[];
  offers?: any[];
  enquiries?: any[];
  promoCodes?: any[];
  loading?: boolean;
  onAddProduct: (
    newProduct: Product,
    options?: { successMessage?: string },
  ) => Promise<any> | any;
  onUpdateProduct: (
    updatedProduct: Product,
    options?: { successMessage?: string; silent?: boolean },
  ) => Promise<any> | any;
  onProductPatched?: (updatedProduct: Product) => void;
  listers: any[];
  onEditingChange?: (isEditing: boolean) => void;
  onViewOrder?: (orderId: string) => void;
  onOpenEnquiry?: (enquiryId: string) => void;
  onLogEnquiryForPiece?: (product: Product) => void;
  onAddCustomer?: (newCustomer: any) => void;
  onAddOrder?: (newOrder: any) => void;
  onListerCreated?: (newLister: any) => void;
  onDesignerCreated?: (newDesigner: any) => void;
  customers?: any[];
  initialProductId?: string;
}

const computeLocalNextSku = (list: Product[], afterSku?: string): string => {
  const existingSet = new Set<string>();
  let maxNum = 0;

  const inspect = (raw?: string) => {
    const rawSku = String(raw || "").trim();
    if (!rawSku) return;
    existingSet.add(rawSku.toUpperCase());
    const match = rawSku.match(/^HOK-SKU-(\d+)$/i);
    if (match) {
      const parsed = Number.parseInt(match[1], 10);
      if (Number.isFinite(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  };

  for (const item of list || []) {
    inspect(item?.sku);
  }
  inspect(afterSku);

  let nextNum = maxNum + 1;
  let candidate = `HOK-SKU-${String(nextNum).padStart(4, "0")}`;
  while (existingSet.has(candidate.toUpperCase())) {
    nextNum += 1;
    candidate = `HOK-SKU-${String(nextNum).padStart(4, "0")}`;
  }
  return candidate;
};

export default function ProductsView({
  products,
  orders = [],
  offers = [],
  enquiries = [],
  promoCodes = [],
  loading = false,
  onAddProduct,
  onUpdateProduct,
  onProductPatched,
  listers,
  onEditingChange,
  onViewOrder,
  onOpenEnquiry,
  onLogEnquiryForPiece,
  onAddCustomer,
  onAddOrder,
  onListerCreated,
  onDesignerCreated,
  customers = [],
  initialProductId,
}: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isSaving, setIsSaving] = useState(false);
  const [generatingSku, setGeneratingSku] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFinalSaving, setIsFinalSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [validationIssues, setValidationIssues] = useState<
    ProductValidationIssue[]
  >([]);

  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortOption, setSortOption] = useState("Sort: Recent");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [dbDesigners, setDbDesigners] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([
    "All Categories",
  ]);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedMode, selectedStatus, sortOption]);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const list = await getDesigners();
        const valid = (Array.isArray(list) ? list : []).filter(
          (d: any) =>
            d &&
            d.name &&
            String(d.name).trim() !== "" &&
            d.name !== "undefined" &&
            d.status !== "Suspended" &&
            d.status !== "Inactive",
        );
        setDbDesigners(valid);
      } catch (e) {
        console.warn("Failed to fetch designers:", e);
      }
    };
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setDbCategories(["All Categories", ...cats.map((c) => c.name)]);
      } catch (e) {
        console.warn("Failed to fetch categories:", e);
      }
    };
    fetchDesigners();
    fetchCats();
  }, []);

  const {
    state,
    formData,
    setFormData,
    startEditing,
    startAdding,
    setActiveTab,
    updateFormField,
    cancelEditing,
    setUploadingImages,
  } = useProductEditor();

  const resetForm = () => {
    setFormData({});
    console.log("🔄 Form reset for new product.");
  };

  const skuSessionRef = React.useRef<string>("");

  const prefillNextSku = React.useCallback(
    (currentProducts: Product[], targetKey: string) => {
      const previewSku = computeLocalNextSku(currentProducts);
      setFormData((prev) => {
        const existing = String(prev.sku || "").trim();
        return existing ? prev : { ...prev, sku: previewSku };
      });
      productApi
        .getNextSku()
        .then((serverSku) => {
          const cleanServerSku = String(serverSku || "").trim();
          if (!cleanServerSku || skuSessionRef.current !== targetKey) return;
          setFormData((prev) => ({ ...prev, sku: cleanServerSku }));
        })
        .catch(() => {
          // Keep local increment preview if server fetch fails
        });
    },
    [setFormData],
  );

  const handleAutoGenerateSku = async () => {
    const currentSku = String(formData.sku || "").trim();
    const sessionKey = skuSessionRef.current;
    const localNext = computeLocalNextSku(products, currentSku);
    handleFormFieldChange("sku", localNext);
    setGeneratingSku(true);
    try {
      const serverNext = await productApi.getNextSku(currentSku);
      const cleanServerSku = String(serverNext || "").trim();
      if (cleanServerSku && skuSessionRef.current === sessionKey) {
        handleFormFieldChange("sku", cleanServerSku);
      }
    } catch {
      // Keep local incremented SKU if server request fails
    } finally {
      setGeneratingSku(false);
    }
  };

  useEffect(() => {
    const sessionKey = state.isAdding
      ? "__NEW__"
      : String(
          state.editingProduct?.productId ||
            (state.editingProduct as any)?._id ||
            state.editingProduct?.id ||
            "",
        );
    skuSessionRef.current = sessionKey;
    if (!sessionKey) return;

    const existingSku = state.isAdding
      ? ""
      : String(state.editingProduct?.sku || "").trim();
    if (!existingSku) {
      prefillNextSku(products, sessionKey);
    }
  }, [
    state.isAdding,
    state.editingProduct?.productId,
    (state.editingProduct as any)?._id,
  ]);

  const fetchProduct = async (productId: string) => {
    try {
      console.log("📤 Fetching product:", productId);
      const productData = await productApi.getProductById(productId);
      if (productData) {
        console.log("✅ Product fetched:", productData);
        const safeData = {
          ...productData,
          id: productData.id || productData._id || productData.productId,
          _id: productData._id || productData.id || productData.productId,
        };
        startEditing(safeData);
        await new Promise((r) => setTimeout(r, 100));
        const resolvedSku =
          String(safeData.sku || "").trim() || computeLocalNextSku(products);
        setFormData({ ...safeData, sku: resolvedSku });
        if (!String(safeData.sku || "").trim()) {
          const targetKey = String(
            safeData.productId || safeData._id || safeData.id || "",
          );
          if (targetKey) {
            skuSessionRef.current = targetKey;
            prefillNextSku(products, targetKey);
          }
        }
        updateFormField("name", safeData.name || "");
        updateFormField("designer", safeData.designer || "");
        updateFormField("listerId", safeData.listerId || "");
        updateFormField("productId", safeData.productId || "");
        updateFormField("_id", safeData._id || "");
        setActiveTab("Core");
        console.log(
          "✅ Product loaded successfully with ID:",
          safeData.productId,
        );
      } else {
        toast.error(`Product with ID ${productId} not found`);
      }
    } catch (error: any) {
      console.error("❌ Error fetching product:", error);
      toast.error(error.message || "Error connecting to server");
    }
  };

  const isEditing = !!(state.editingProduct || state.isAdding);
  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  const openedInitialRef = React.useRef<string>("");
  useEffect(() => {
    if (!initialProductId) {
      openedInitialRef.current = "";
      return;
    }
    const decoded = decodeURIComponent(initialProductId).trim();
    if (!decoded || openedInitialRef.current === decoded) return;
    if (!products || products.length === 0) return;

    const lower = decoded.toLowerCase();
    const matched = products.find((p: any) => {
      const ids = [p.id, p._id, p.productId, p.sku]
        .filter(Boolean)
        .map((x) => String(x).trim().toLowerCase());
      if (ids.includes(lower)) return true;
      if (String(p.name || "").trim().toLowerCase() === lower) return true;
      return false;
    });

    if (matched) {
      openedInitialRef.current = decoded;
      const safeData: any = {
        ...matched,
        id: matched.id || (matched as any)._id || matched.productId,
        _id: (matched as any)._id || matched.id || matched.productId,
      };
      startEditing(safeData);
      setFormData(safeData);
      setActiveTab("Core");
    } else if (!loading) {
      openedInitialRef.current = decoded;
      fetchProduct(decoded);
    }
  }, [initialProductId, products, loading]);

  useEffect(() => {
    if (state.editingProduct) {
      const updatedInList = products.find(
        (p) =>
          p.id === state.editingProduct?.id ||
          (p as any)._id === state.editingProduct?._id ||
          p.productId === state.editingProduct?.productId,
      );
      if (updatedInList) {
        startEditing(updatedInList, {
          preserveTab: true,
          skipSectionReload: true,
        });
      }
    }
  }, [products]);

  const validProducts = products.filter(
    (p) => p.id && p.name && p.name !== "undefined",
  );

  const filteredProducts = validProducts
    .filter((p) => {
      const term = searchTerm.toLowerCase().trim();
      const pName = p.name || "";
      const pDesigner = p.designer || "";
      const pCategory = p.category || "";
      const pListingModes = p.listingModes || [];

      const matchesSearch =
        !term ||
        pName.toLowerCase().includes(term) ||
        pDesigner.toLowerCase().includes(term) ||
        pCategory.toLowerCase().includes(term) ||
        (p.sku && (p.sku || "").toLowerCase().includes(term)) ||
        (p.id && (p.id || "").toLowerCase().includes(term));

      const matchesCat =
        selectedCategory === "All Categories" ||
        String(p.category || "")
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .includes(selectedCategory.trim().toLowerCase());
      const matchesMode =
        selectedMode === "All Modes" ||
        pListingModes.includes(selectedMode as any);
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        (p.status as string) === selectedStatus ||
        (selectedStatus === "Sold" &&
          ((p.status as string) === "Sold" || pName.includes("Sherwani")));

      return matchesSearch && matchesCat && matchesMode && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") {
        const priceA = a.rentalPrice || a.listingPrice || 0;
        const priceB = b.rentalPrice || b.listingPrice || 0;
        return priceA - priceB;
      }
      if (sortOption === "Price: High to Low") {
        const priceA = a.rentalPrice || a.listingPrice || 0;
        const priceB = b.rentalPrice || b.listingPrice || 0;
        return priceB - priceA;
      }
      if (sortOption === "Name: A-Z") {
        return a.name.localeCompare(b.name);
      }
      return 0; // Default: Recent
    });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize,
  );

  const clearValidationState = () => {
    setValidationErrors({});
    setValidationIssues([]);
    setSaveError(null);
  };

  const handleStartAdding = () => {
    clearValidationState();
    startAdding();
    skuSessionRef.current = "__NEW__";
    prefillNextSku(products, "__NEW__");
  };

  const handleCancelEditing = () => {
    clearValidationState();
    cancelEditing();
  };

  const handleEditWithTab = (product: Product, initialTab?: ProductTab) => {
    clearValidationState();
    startEditing(product);
    if (initialTab) {
      setActiveTab(initialTab);
    }
  };

  const handleFormFieldChange = <K extends keyof Product>(
    field: K,
    value: Product[K],
  ) => {
    updateFormField(field, value);

    const fieldKey = String(field);
    const keysToClear = new Set<string>([
      fieldKey,
      ...(fieldKey === "taxRate" || fieldKey === "gstRate"
        ? ["gstRate", "taxRate"]
        : []),
    ]);

    if (fieldKey === "listingModes" && Array.isArray(value)) {
      const nextModes = normalizeProductListingModes(value as string[]);
      if (!nextModes.includes("RENTAL")) {
        [
          "rentalPrice",
          "perDayRate",
          "extendedWindowPrice",
          "securityDeposit",
          "minimumDurationDays",
          "payoutPercentage",
          "preRentalBufferDays",
          "postRentalBufferDays",
          "cleaningBufferDays",
          "cleaningFee",
          "extensionPrice",
        ].forEach((k) => keysToClear.add(k));
      }
      if (!nextModes.includes("PRELOVED") && !nextModes.includes("BUY NEW")) {
        ["listingPrice", "originalRetailPrice"].forEach((k) =>
          keysToClear.add(k),
        );
      }
      if (!nextModes.includes("PRELOVED")) {
        ["resalePayoutPercentage", "minimumOffer"].forEach((k) =>
          keysToClear.add(k),
        );
      }
    }

    setValidationErrors((prev) => {
      let changed = false;
      const next = { ...prev };
      keysToClear.forEach((k) => {
        if (k in next) {
          delete next[k];
          changed = true;
        }
      });
      return changed ? next : prev;
    });

    setValidationIssues((prev) => {
      const filtered = prev.filter((issue) => !keysToClear.has(issue.field));
      return filtered.length === prev.length ? prev : filtered;
    });
  };

  const executeSave = async (options?: {
    preserveTab?: boolean;
    successMessage?: string;
  }): Promise<boolean> => {
    if (isSaving || isFinalSaving) {
      console.log("⏳ Save already in progress...");
      return false;
    }

    const validation = validateProductForm(formData, dbDesigners, products);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setValidationIssues(validation.issues);
      const firstIssue = validation.issues[0];
      const extraCount = validation.issues.length - 1;
      const extraSuffix =
        extraCount > 0
          ? ` (+${extraCount} more issue${extraCount > 1 ? "s" : ""})`
          : "";
      toast.error(`${firstIssue.message}${extraSuffix}`);
      if (
        validation.firstErrorTab &&
        !validation.errorTabs.includes(state.activeTab)
      ) {
        setActiveTab(validation.firstErrorTab);
      }
      return false;
    }

    clearValidationState();
    setIsSaving(true);
    setIsFinalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      let savedProduct: Product | null = null;

      const normalizeConditionGrade = (raw?: string): string => {
        const s = String(raw || "").trim();
        if (!s) return "";
        const lower = s.toLowerCase();
        if (lower.startsWith("pristine")) return "Pristine";
        if (lower.startsWith("brand new")) return "Brand New";
        if (lower.startsWith("like new")) return "Like New";
        if (lower.startsWith("very good")) return "Very Good";
        if (lower.startsWith("excellent")) return "Excellent";
        if (lower.startsWith("good")) return "Good";
        if (lower.startsWith("fair")) return "Fair";
        return "";
      };

      const sanitizeOutgoingProduct = (rawObj: any): Product => {
        const ALLOWED_PRODUCT_KEYS = [
          "productId",
          "sku",
          "name",
          "designer",
          "subtitle",
          "description",
          "story",
          "gender",
          "category",
          "occasion",
          "material",
          "color",
          "colorFamily",
          "colors",
          "craft",
          "technique",
          "embellishments",
          "threadYarnDetail",
          "threadWork",
          "setIncludes",
          "origin",
          "sizes",
          "sizeGuide",
          "measurements",
          "measurementsCm",
          "bestSuitedForHeight",
          "weight",
          "listingModes",
          "availability",
          "status",
          "condition",
          "honestDisclosure",
          "rentalPrice",
          "extendedWindowPrice",
          "perDayRate",
          "securityDeposit",
          "listingPrice",
          "originalRetailPrice",
          "resalePayoutPercentage",
          "minimumOffer",
          "allowMakeOffer",
          "stylistConsultationBanner",
          "commissionRate",
          "minimumDurationDays",
          "extensionWindowDays",
          "cleaningBufferDays",
          "preRentalBufferDays",
          "postRentalBufferDays",
          "deliveryTiming",
          "careByFabric",
          "care",
          "packaging",
          "shipping",
          "taxRate",
          "gstRate",
          "cleaningFee",
          "extensionPrice",
          "listerId",
          "payoutPercentage",
          "payoutTerms",
          "rating",
          "reviewCount",
          "timesRented",
          "images",
          "video",
          "seoTitle",
          "seoDescription",
          "urlSlug",
          "tags",
          "relatedProductIds",
          "blockedDates",
          "bookingHistory",
          "externalBookings",
          "activityLog",
          "isPinnedToAteliers",
          "ateliersOrder",
        ];

        const out: any = {};
        for (const k of ALLOWED_PRODUCT_KEYS) {
          if (rawObj[k] !== undefined) {
            out[k] = rawObj[k];
          }
        }

        const safeNum = (v: any, def = 0, min = 0, max?: number) => {
          const n = Number(v);
          let res = Number.isFinite(n) ? Math.max(min, n) : def;
          if (max !== undefined) res = Math.min(max, res);
          return res;
        };

        const safeOptionalNum = (
          v: any,
          min = 0,
          max?: number,
        ): number | null => {
          if (v === undefined || v === null || String(v).trim() === "") {
            return null;
          }
          const n = Number(v);
          if (!Number.isFinite(n)) return null;
          let res = Math.max(min, n);
          if (max !== undefined) res = Math.min(max, res);
          return res;
        };

        out.condition = normalizeConditionGrade(out.condition);
        out.listingModes = normalizeProductListingModes(out.listingModes);
        out.weight = out.weight !== undefined && out.weight !== null ? String(out.weight) : "";
        out.bestSuitedForHeight =
          out.bestSuitedForHeight !== undefined && out.bestSuitedForHeight !== null
            ? String(out.bestSuitedForHeight)
            : "";
        out.listerId =
          out.listerId && String(out.listerId).trim()
            ? String(out.listerId).trim()
            : "LST-GENERAL";

        out.rentalPrice = safeOptionalNum(out.rentalPrice, 0);
        out.extendedWindowPrice = safeOptionalNum(out.extendedWindowPrice, 0);
        out.perDayRate = safeOptionalNum(out.perDayRate, 0);
        out.securityDeposit = safeOptionalNum(out.securityDeposit, 0);
        out.listingPrice = safeOptionalNum(out.listingPrice, 0);
        out.originalRetailPrice = safeOptionalNum(out.originalRetailPrice, 0);
        out.resalePayoutPercentage = safeOptionalNum(out.resalePayoutPercentage, 0, 100);
        out.minimumOffer = safeOptionalNum(out.minimumOffer, 0);
        out.commissionRate = safeOptionalNum(out.commissionRate, 0, 100);
        out.minimumDurationDays = safeOptionalNum(out.minimumDurationDays, 1);
        out.extensionWindowDays = safeOptionalNum(out.extensionWindowDays, 0);
        out.cleaningBufferDays = safeOptionalNum(out.cleaningBufferDays, 0);
        out.preRentalBufferDays = safeOptionalNum(out.preRentalBufferDays, 0);
        out.postRentalBufferDays = safeOptionalNum(out.postRentalBufferDays, 0);
        out.taxRate = safeOptionalNum(out.taxRate, 0, 100);
        out.gstRate = safeOptionalNum(out.gstRate, 0, 100);
        out.cleaningFee = safeOptionalNum(out.cleaningFee, 0);
        out.extensionPrice = safeOptionalNum(out.extensionPrice, 0);
        out.payoutPercentage = safeOptionalNum(out.payoutPercentage, 0, 100);
        out.rating = safeNum(out.rating, 0, 0, 5);
        out.reviewCount = safeNum(out.reviewCount, 0, 0);
        out.timesRented = safeNum(out.timesRented, 0, 0);

        out.images = Array.isArray(out.images)
          ? out.images.filter((x: any) => typeof x === "string" && x.trim() !== "")
          : [];
        out.sizes = Array.isArray(out.sizes)
          ? out.sizes.map((x: any) => String(x).trim()).filter(Boolean)
          : [];
        out.tags = Array.isArray(out.tags)
          ? out.tags.map((x: any) => String(x).trim()).filter(Boolean)
          : [];
        out.relatedProductIds = Array.isArray(out.relatedProductIds)
          ? out.relatedProductIds.map((x: any) => String(x).trim()).filter(Boolean)
          : [];

        out.measurements = {
          bust: String(out.measurements?.bust ?? ""),
          waist: String(out.measurements?.waist ?? ""),
          hips: String(out.measurements?.hips ?? ""),
          length: String(out.measurements?.length ?? ""),
        };
        out.measurementsCm = {
          bust: String(out.measurementsCm?.bust ?? ""),
          waist: String(out.measurementsCm?.waist ?? ""),
          hips: String(out.measurementsCm?.hips ?? ""),
          length: String(out.measurementsCm?.length ?? ""),
        };

        out.blockedDates = Array.isArray(out.blockedDates)
          ? out.blockedDates
              .map((b: any) => {
                const toYmd = (v: any) => {
                  if (!v) return "";
                  if (typeof v === "string") return v.slice(0, 10);
                  const d = new Date(v);
                  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
                };
                const from = toYmd(b?.from);
                const to = toYmd(b?.to);
                if (!from || !to) return null;
                return {
                  from,
                  to,
                  ...(b?.depositStatus ? { depositStatus: String(b.depositStatus) } : {}),
                };
              })
              .filter(Boolean)
          : [];

        const stripInternalKeys = (item: any) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) return item;
          const cleanItem: any = {};
          for (const k of Object.keys(item)) {
            if (!k.startsWith("_") && k !== "data") {
              cleanItem[k] = item[k];
            }
          }
          return cleanItem;
        };

        out.activityLog = Array.isArray(out.activityLog)
          ? out.activityLog.map((a: any) => ({
              action: String(a?.action || "Updated"),
              user: String(a?.user || "Admin"),
              ...(a?.createdAt ? { createdAt: a.createdAt } : {}),
              remarks: String(a?.remarks || ""),
            }))
          : [];
        out.bookingHistory = Array.isArray(out.bookingHistory)
          ? out.bookingHistory.map(stripInternalKeys)
          : [];
        out.externalBookings = Array.isArray(out.externalBookings)
          ? out.externalBookings.map(stripInternalKeys)
          : [];

        if (out.care !== undefined && !Array.isArray(out.care)) {
          out.care = out.care ? [String(out.care)] : [];
        } else if (Array.isArray(out.care)) {
          out.care = out.care
            .map((line: any) => String(line || "").trim())
            .filter(Boolean);
        }
        out.colorFamily = String(out.colorFamily || "").trim();
        out.careByFabric = String(out.careByFabric || "").trim();
        out.color = String(out.color ?? "").trim();
        out.colors = Array.isArray(out.colors)
          ? out.colors
              .filter((c: any) => c && String(c.name || "").trim())
              .map((c: any) => ({
                name: String(c.name).trim(),
                hex: String(c.hex || ""),
                family: String(c.family || ""),
              }))
          : [];
        if (!out.color && out.colors.length > 0 && !out.colorFamily) {
          out.color = out.colors.map((c: any) => c.name).join(", ");
        }
        if (out.packaging !== undefined && !Array.isArray(out.packaging)) {
          out.packaging = out.packaging ? [String(out.packaging)] : [];
        }
        if (out.shipping !== undefined && !Array.isArray(out.shipping)) {
          delete out.shipping;
        }

        return out as Product;
      };

      if (state.isAdding) {
        const newProduct: Product = sanitizeOutgoingProduct({
          ...formData,
          productId: `HOK-PRD-${Date.now()}`,
          name: formData.name || "",
          designer: formData.designer || "",
          listerId: formData.listerId || "LST-GENERAL",
          description: formData.description || "",
          category: formData.category ?? "",
          occasion: formData.occasion ?? "",
          material: formData.material || "",
          embellishments: formData.embellishments || "",
          threadYarnDetail: formData.threadYarnDetail || "",
          setIncludes: formData.setIncludes || "",
          origin: formData.origin || "",
          weight: formData.weight || "",
          sizes: formData.sizes || [],
          listingModes: formData.listingModes || [],
          condition: formData.condition || "",
          availability: "Available Now",
          status: formData.status || "Draft",
          rentalPrice: formData.rentalPrice,
          extendedWindowPrice: formData.extendedWindowPrice,
          perDayRate: formData.perDayRate,
          securityDeposit: formData.securityDeposit,
          listingPrice: formData.listingPrice,
          originalRetailPrice: formData.originalRetailPrice,
          resalePayoutPercentage: formData.resalePayoutPercentage,
          minimumOffer: formData.minimumOffer,
          commissionRate: formData.commissionRate,
          minimumDurationDays: formData.minimumDurationDays,
          extensionWindowDays: formData.extensionWindowDays,
          cleaningBufferDays: formData.cleaningBufferDays,
          preRentalBufferDays: formData.preRentalBufferDays,
          postRentalBufferDays: formData.postRentalBufferDays,
          deliveryTiming: formData.deliveryTiming || "",
          images: formData.images || [],
          seoTitle: formData.seoTitle || "",
          seoDescription: formData.seoDescription || "",
          urlSlug:
            formData.urlSlug ||
            formData.name
              ?.toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") ||
            "",
          sku: formData.sku || "",
          color: formData.color || "",
          colorFamily: formData.colorFamily || "",
          colors: formData.colors || [],
          careByFabric: formData.careByFabric || "",
          care: formData.care || [],
          craft: formData.craft || "",
          technique: formData.technique || "",
          story: formData.story || "",
          tags: formData.tags || [],
          taxRate: formData.taxRate,
          gstRate: formData.gstRate,
          cleaningFee: formData.cleaningFee,
          extensionPrice: formData.extensionPrice,
          payoutPercentage: formData.payoutPercentage,
          payoutTerms: formData.payoutTerms || "",
          measurements: {
            bust: formData.measurements?.bust || "",
            waist: formData.measurements?.waist || "",
            hips: formData.measurements?.hips || "",
            length: formData.measurements?.length || "",
          },
          measurementsCm: formData.measurementsCm || {},
          bestSuitedForHeight: formData.bestSuitedForHeight || "",
          subtitle: formData.subtitle || "",
          honestDisclosure: formData.honestDisclosure || "",
          relatedProductIds: formData.relatedProductIds || [],
          blockedDates: formData.blockedDates || [],
          bookingHistory: formData.bookingHistory || [],
          externalBookings: formData.externalBookings || [],
          activityLog: formData.activityLog || [],
          timesRented: 0,
          rating: Number(formData.rating || 0),
          reviewCount: Number(formData.reviewCount || 0),
        });

        const result = await onAddProduct(newProduct, {
          successMessage: options?.successMessage,
        });
        savedProduct = result as Product;
        console.log("✅ Product created:", savedProduct);
      } else if (state.editingProduct) {
        const updated: Product = sanitizeOutgoingProduct({
          ...state.editingProduct,
          ...formData,
          name: formData.name ?? state.editingProduct.name,
          designer: formData.designer ?? state.editingProduct.designer,
          listerId:
            formData.listerId !== undefined
              ? formData.listerId || "LST-GENERAL"
              : state.editingProduct.listerId || "LST-GENERAL",
          description:
            formData.description !== undefined
              ? formData.description
              : state.editingProduct.description,
          category:
            formData.category !== undefined
              ? formData.category
              : state.editingProduct.category || "",
          occasion:
            formData.occasion !== undefined
              ? formData.occasion
              : state.editingProduct.occasion || "",
          material:
            formData.material !== undefined
              ? formData.material
              : state.editingProduct.material,
          embellishments:
            formData.embellishments !== undefined
              ? formData.embellishments
              : state.editingProduct.embellishments,
          sizes:
            formData.sizes !== undefined
              ? formData.sizes
              : state.editingProduct.sizes,
          listingModes:
            formData.listingModes !== undefined
              ? formData.listingModes
              : state.editingProduct.listingModes || [],
          condition:
            formData.condition !== undefined
              ? formData.condition
              : state.editingProduct.condition,
          status: formData.status || state.editingProduct.status || "Draft",
          rentalPrice:
            formData.rentalPrice !== undefined
              ? formData.rentalPrice
              : state.editingProduct.rentalPrice,
          extendedWindowPrice:
            formData.extendedWindowPrice !== undefined
              ? formData.extendedWindowPrice
              : state.editingProduct.extendedWindowPrice,
          perDayRate:
            formData.perDayRate !== undefined
              ? formData.perDayRate
              : state.editingProduct.perDayRate,
          securityDeposit:
            formData.securityDeposit !== undefined
              ? formData.securityDeposit
              : state.editingProduct.securityDeposit,
          listingPrice:
            formData.listingPrice !== undefined
              ? formData.listingPrice
              : state.editingProduct.listingPrice,
          originalRetailPrice:
            formData.originalRetailPrice !== undefined
              ? formData.originalRetailPrice
              : state.editingProduct.originalRetailPrice,
          resalePayoutPercentage:
            formData.resalePayoutPercentage !== undefined
              ? formData.resalePayoutPercentage
              : state.editingProduct.resalePayoutPercentage,
          minimumOffer:
            formData.minimumOffer !== undefined
              ? formData.minimumOffer
              : state.editingProduct.minimumOffer,
          commissionRate:
            formData.commissionRate !== undefined
              ? formData.commissionRate
              : state.editingProduct.commissionRate,
          minimumDurationDays:
            formData.minimumDurationDays !== undefined
              ? formData.minimumDurationDays
              : state.editingProduct.minimumDurationDays,
          extensionWindowDays:
            formData.extensionWindowDays !== undefined
              ? formData.extensionWindowDays
              : state.editingProduct.extensionWindowDays,
          cleaningBufferDays:
            formData.cleaningBufferDays !== undefined
              ? formData.cleaningBufferDays
              : state.editingProduct.cleaningBufferDays,
          preRentalBufferDays:
            formData.preRentalBufferDays !== undefined
              ? formData.preRentalBufferDays
              : state.editingProduct.preRentalBufferDays,
          postRentalBufferDays:
            formData.postRentalBufferDays !== undefined
              ? formData.postRentalBufferDays
              : state.editingProduct.postRentalBufferDays,
          deliveryTiming:
            formData.deliveryTiming !== undefined
              ? formData.deliveryTiming
              : state.editingProduct.deliveryTiming,
          images:
            formData.images !== undefined
              ? formData.images
              : state.editingProduct.images || [],
          seoTitle:
            formData.seoTitle !== undefined
              ? formData.seoTitle
              : state.editingProduct.seoTitle || "",
          seoDescription:
            formData.seoDescription !== undefined
              ? formData.seoDescription
              : state.editingProduct.seoDescription || "",
          urlSlug:
            formData.urlSlug !== undefined
              ? formData.urlSlug
              : state.editingProduct.urlSlug || "",
          sku:
            formData.sku !== undefined
              ? formData.sku
              : state.editingProduct.sku || "",
          color:
            formData.color !== undefined
              ? formData.color
              : state.editingProduct.color || "",
          colorFamily:
            formData.colorFamily !== undefined
              ? formData.colorFamily
              : state.editingProduct.colorFamily || "",
          colors:
            formData.colors !== undefined
              ? formData.colors
              : state.editingProduct.colors || [],
          careByFabric:
            formData.careByFabric !== undefined
              ? formData.careByFabric
              : state.editingProduct.careByFabric || "",
          care:
            formData.care !== undefined
              ? formData.care
              : (state.editingProduct as any).care || [],
          craft:
            formData.craft !== undefined
              ? formData.craft
              : state.editingProduct.craft || "",
          technique:
            formData.technique !== undefined
              ? formData.technique
              : state.editingProduct.technique || "",
          story:
            formData.story !== undefined
              ? formData.story
              : state.editingProduct.story || "",
          tags:
            formData.tags !== undefined
              ? formData.tags
              : state.editingProduct.tags || [],
          taxRate:
            formData.taxRate !== undefined
              ? formData.taxRate
              : state.editingProduct.taxRate,
          gstRate:
            formData.gstRate !== undefined
              ? formData.gstRate
              : state.editingProduct.gstRate,
          cleaningFee:
            formData.cleaningFee !== undefined
              ? formData.cleaningFee
              : state.editingProduct.cleaningFee,
          extensionPrice:
            formData.extensionPrice !== undefined
              ? formData.extensionPrice
              : state.editingProduct.extensionPrice,
          payoutPercentage:
            formData.payoutPercentage !== undefined
              ? formData.payoutPercentage
              : state.editingProduct.payoutPercentage,
          payoutTerms:
            formData.payoutTerms !== undefined
              ? formData.payoutTerms
              : state.editingProduct.payoutTerms,
          measurements: {
            bust:
              formData.measurements?.bust !== undefined
                ? formData.measurements.bust
                : state.editingProduct.measurements?.bust || "",
            waist:
              formData.measurements?.waist !== undefined
                ? formData.measurements.waist
                : state.editingProduct.measurements?.waist || "",
            hips:
              formData.measurements?.hips !== undefined
                ? formData.measurements.hips
                : state.editingProduct.measurements?.hips || "",
            length:
              formData.measurements?.length !== undefined
                ? formData.measurements.length
                : state.editingProduct.measurements?.length || "",
          },
          measurementsCm:
            formData.measurementsCm ||
            state.editingProduct.measurementsCm ||
            {},
          bestSuitedForHeight:
            formData.bestSuitedForHeight !== undefined
              ? formData.bestSuitedForHeight
              : state.editingProduct.bestSuitedForHeight || "",
          subtitle:
            formData.subtitle !== undefined
              ? formData.subtitle
              : state.editingProduct.subtitle || "",
          honestDisclosure:
            formData.honestDisclosure !== undefined
              ? formData.honestDisclosure
              : state.editingProduct.honestDisclosure || "",
          relatedProductIds:
            formData.relatedProductIds !== undefined
              ? formData.relatedProductIds
              : state.editingProduct.relatedProductIds || [],
          timesRented: Number(
            formData.timesRented ?? state.editingProduct.timesRented ?? 0,
          ),
          rating: Number(formData.rating ?? state.editingProduct.rating ?? 0),
          reviewCount: Number(
            formData.reviewCount ?? state.editingProduct.reviewCount ?? 0,
          ),
        });

        const result = await onUpdateProduct(updated, {
          successMessage: options?.successMessage,
        });
        savedProduct = result as Product;
        console.log("✅ Product updated:", savedProduct);
      }

      if (savedProduct) {
        const productWithId = {
          ...savedProduct,
          productId:
            savedProduct.productId || savedProduct._id || savedProduct.id,
          _id: savedProduct._id || savedProduct.id || savedProduct.productId,
        };
        startEditing(productWithId, {
          preserveTab: options?.preserveTab ?? true,
          skipSectionReload: true,
        });
        setFormData(productWithId);
        updateFormField("productId", productWithId.productId);
        updateFormField("_id", productWithId._id);
        console.log(
          "✅ Product state updated with ID:",
          productWithId.productId,
        );
      }

      setSaveSuccess(true);
      setIsSaving(false);
      setIsFinalSaving(false);
      return true;
    } catch (error) {
      console.error("❌ Save error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to save product";
      setSaveError(message);
      toast.error(message);
      setIsFinalSaving(false);
      setIsSaving(false);
      return false;
    }
  };

  const handleSave = async (): Promise<boolean> => {
    return executeSave({ preserveTab: true });
  };

  const handleSaveRelatedProducts = async (): Promise<boolean> => {
    if (isSaving || isFinalSaving) return false;

    if (state.isAdding || !state.editingProduct) {
      return executeSave({
        preserveTab: true,
        successMessage: "Related products saved successfully!",
      });
    }

    const editing = state.editingProduct;
    const targetId = getCanonicalProductId(editing);
    if (!targetId) {
      toast.error("Product ID is missing.");
      return false;
    }

    const selfAliases = new Set(collectProductIds(editing));
    const rawIds =
      formData.relatedProductIds ?? editing.relatedProductIds ?? [];
    const seen = new Set<string>();
    const liveCanonicalIds: string[] = [];

    for (const rawId of rawIds) {
      const cleanId = String(rawId || "").trim();
      if (!cleanId || selfAliases.has(cleanId)) continue;
      const matchedProd = products.find((p) =>
        collectProductIds(p).includes(cleanId),
      );
      if (matchedProd) {
        if (!isLiveProductStatus(matchedProd.status)) continue;
        const canonical = getCanonicalProductId(matchedProd);
        if (canonical && !selfAliases.has(canonical) && !seen.has(canonical)) {
          seen.add(canonical);
          liveCanonicalIds.push(canonical);
        }
      } else if (!seen.has(cleanId)) {
        seen.add(cleanId);
        liveCanonicalIds.push(cleanId);
      }
    }

    setIsSaving(true);
    setIsFinalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const savedResult = await productSectionsApi.updateRelatedProducts(
        targetId,
        liveCanonicalIds,
      );
      const savedIds = Array.isArray(savedResult?.relatedProductIds)
        ? savedResult.relatedProductIds
        : Array.isArray(savedResult)
          ? savedResult
          : liveCanonicalIds;

      const updatedProduct: Product = {
        ...editing,
        ...formData,
        ...(savedResult &&
        typeof savedResult === "object" &&
        !Array.isArray(savedResult)
          ? savedResult
          : {}),
        relatedProductIds: savedIds,
      };

      startEditing(updatedProduct, {
        preserveTab: true,
        skipSectionReload: true,
      });
      setFormData(updatedProduct);
      onProductPatched?.(updatedProduct);
      setSaveSuccess(true);
      toast.success("Related products saved successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save related products";
      setSaveError(message);
      toast.error(message);
      return false;
    } finally {
      setIsSaving(false);
      setIsFinalSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!formData.productId && !state.editingProduct) {
      toast.error("No product to duplicate!");
      return;
    }
    if (isSaving || isFinalSaving) return;

    setIsSaving(true);
    setIsFinalSaving(true);

    try {
      const originalProduct = state.editingProduct || formData;
      const duplicateProduct: Product = {
        ...originalProduct,
        productId: `HOK-PRD-${Date.now()}`,
        sku: "",
        name: `${originalProduct.name} (Draft)`,
        status: "Draft",
        images: [...(originalProduct.images || [])],
        tags: [...(originalProduct.tags || [])],
        sizes: [...(originalProduct.sizes || [])],
        measurements: { ...(originalProduct.measurements || {}) },
        measurementsCm: { ...(originalProduct.measurementsCm || {}) },
        listingModes: [...(originalProduct.listingModes || [])],
        blockedDates: [],
        bookingHistory: [],
        externalBookings: [],
        activityLog: [],
        relatedProductIds: [],
        timesRented: 0,
        rating: 0,
        reviewCount: 0,
      } as any;

      const result = await onAddProduct(duplicateProduct);
      const savedProduct = result as Product;
      console.log("✅ Duplicate created:", savedProduct);

      toast.success("📋 Product duplicated as draft!");
      setIsSaving(false);
      setIsFinalSaving(false);
    } catch (error) {
      console.error("❌ Duplicate error:", error);
      toast.error("❌ Failed to duplicate product!");
      setIsFinalSaving(false);
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!formData.productId && !state.editingProduct) {
      toast.error("No product to archive!");
      return;
    }
    if (!window.confirm("Are you sure you want to archive this product?"))
      return;
    if (isSaving || isFinalSaving) return;

    setIsSaving(true);
    setIsFinalSaving(true);

    try {
      const updatedProduct = {
        ...state.editingProduct,
        status: "Archived",
      } as Product;

      const result = await onUpdateProduct(updatedProduct);
      console.log("✅ Product archived:", result);

      toast.success("🗑️ Product archived successfully!");
      setIsSaving(false);
      setIsFinalSaving(false);
    } catch (error) {
      console.error("❌ Archive error:", error);
      toast.error("❌ Failed to archive product!");
      setIsFinalSaving(false);
      setIsSaving(false);
    }
  };

  // ✅ RENDER: Editing Mode
  if (state.editingProduct || state.isAdding) {
    return (
      <div className="text-xs font-sans relative">
        <header className="sticky top-0 z-40 bg-white border-b border-[#E8E0D6]">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <button
                onClick={handleCancelEditing}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E6DED3] bg-white px-3 text-[12px] font-medium text-[#6F675D] hover:bg-[#FAF8F5]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 text-[13px]">
                <span className="text-[#9B9287]">Products</span>
                <span className="text-[#C3BAAF]">/</span>
                <span className="truncate font-semibold text-[#2C2926]">
                  {formData.name || state.editingProduct?.name || "New Product"}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!state.isAdding && (
                <button
                  onClick={() =>
                    window.open(
                      `/product/${state.editingProduct?.urlSlug}`,
                      "_blank",
                    )
                  }
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-[#E5DDD3] bg-white px-4 text-[13px] font-medium text-[#38332D] hover:bg-[#FAF8F5]"
                >
                  <ExternalLink className="h-4 w-4" /> View Live Site
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving || isFinalSaving}
                className={`inline-flex h-9 items-center rounded-md px-5 text-[13px] font-semibold text-[#2B2218] transition-all duration-200 ${isSaving || isFinalSaving ? "bg-gray-300 cursor-not-allowed opacity-70" : "bg-[#C7A55C] hover:bg-[#B9974B] active:scale-95"}`}
              >
                {isSaving || isFinalSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#2B2218]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>{" "}
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-8 space-y-5 sm:space-y-6">
          <div>
            {(() => {
              const history = (state.editingProduct?.bookingHistory ||
                []) as any[];
              const activeBooking = history.find(
                (b) => b.startDate && b.endDate && b.status !== "Cancelled",
              );
              const timesRented =
                state.editingProduct?.timesRented || history.length || 0;
              const bookingEarned = history
                .filter(
                  (b) =>
                    b.status === "Confirmed" ||
                    b.status === "Completed" ||
                    b.status === "Delivered" ||
                    b.amount,
                )
                .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
              const earnedAmount =
                (state.editingProduct as any)?.earnedAmount !== undefined
                  ? Number((state.editingProduct as any).earnedAmount)
                  : bookingEarned;

              let rentalStatus = "Not Rented";
              let currentRenterName: string | undefined;
              let currentOrderId: string | undefined;
              let rentUntil: string | undefined;
              let nextFreeDate: string | undefined;

              if (activeBooking) {
                rentalStatus = "In Rental";
                currentRenterName = activeBooking.customerName;
                currentOrderId = activeBooking.orderId;
                rentUntil = activeBooking.endDate;
                const endD = new Date(activeBooking.endDate);
                if (!isNaN(endD.getTime())) {
                  endD.setDate(endD.getDate() + 3);
                  nextFreeDate = endD.toISOString().slice(0, 10);
                }
              }

              const liveModes = normalizeProductListingModes(
                formData.listingModes !== undefined
                  ? formData.listingModes
                  : state.editingProduct?.listingModes,
              );
              const liveSizes =
                formData.sizes !== undefined
                  ? formData.sizes
                  : state.editingProduct?.sizes || [];

              return (
                <ProductHeader
                  isEditing={!!state.editingProduct}
                  isAdding={state.isAdding}
                  productName={
                    formData.name !== undefined
                      ? formData.name
                      : state.editingProduct?.name
                  }
                  designer={
                    formData.designer !== undefined
                      ? formData.designer
                      : state.editingProduct?.designer
                  }
                  sku={
                    formData.sku !== undefined
                      ? formData.sku
                      : state.editingProduct?.sku
                  }
                  listingMode={
                    liveModes.length > 0 ? liveModes.join(" · ") : ""
                  }
                  condition={
                    formData.condition !== undefined
                      ? formData.condition
                      : state.editingProduct?.condition || ""
                  }
                  size={liveSizes.length > 0 ? liveSizes.join(", ") : ""}
                  status={
                    formData.status !== undefined
                      ? formData.status
                      : state.editingProduct?.status ||
                        (state.isAdding ? "Draft" : "Live")
                  }
                  listerName={
                    state.editingProduct?.listerName ||
                    listers.find(
                      (l: any) =>
                        (l.listerId || l._id || l.id) ===
                          (formData.listerId ||
                            state.editingProduct?.listerId) ||
                        l.name ===
                          (formData.listerId || state.editingProduct?.listerId),
                    )?.name ||
                    formData.listerId ||
                    state.editingProduct?.listerId
                  }
                  rentedCount={timesRented}
                  rentalStatus={rentalStatus}
                  currentRenterName={currentRenterName}
                  currentOrderId={currentOrderId}
                  rentUntil={rentUntil}
                  nextFreeDate={nextFreeDate}
                  earnedAmount={earnedAmount}
                  isSaving={isFinalSaving}
                  onSave={handleSave}
                  onAdd={handleStartAdding}
                  showAddButton={false}
                  onDuplicate={handleDuplicate}
                  onArchive={handleArchive}
                />
              );
            })()}
            <div className="mt-4">
              <ProductTabs
                activeTab={state.activeTab}
                onTabChange={setActiveTab}
                isAdding={state.isAdding}
                errorTabs={Array.from(
                  new Set(validationIssues.map((issue) => issue.tab)),
                )}
              />
            </div>
          </div>

          {validationIssues.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50/90 px-4 py-3 text-red-800 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <p className="text-xs font-semibold text-red-900">
                    Please complete the required details before saving (
                    {validationIssues.length} issue
                    {validationIssues.length > 1 ? "s" : ""}):
                  </p>
                  <ul className="space-y-1 text-xs">
                    {validationIssues.map((issue, idx) => (
                      <li
                        key={`${issue.field}-${idx}`}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveTab(issue.tab)}
                          className="rounded border border-red-300 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700 hover:bg-red-100 transition cursor-pointer"
                        >
                          {DEFAULT_TAB_LABELS[issue.tab] || issue.tab}
                        </button>
                        <span>{issue.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={clearValidationState}
                  aria-label="Dismiss validation errors"
                  className="text-xs font-semibold text-red-600 hover:text-red-900 px-1.5 py-0.5 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 xl:flex-row xl:gap-6">
            <div className="min-w-0 flex-1 space-y-6">
              {state.activeTab === "Core" && (
                <CoreDetailsTab
                  formData={formData}
                  onFieldChange={handleFormFieldChange}
                  listers={listers}
                  designers={dbDesigners}
                  onDesignerCreated={(newDes) => {
                    setDbDesigners((prev) => [newDes, ...prev]);
                    onDesignerCreated?.(newDes);
                  }}
                  onListerCreated={(newLis) => {
                    onListerCreated?.(newLis);
                  }}
                  onCategoryCreated={(newCat) => {
                    if (newCat?.name) {
                      setDbCategories((prev) =>
                        prev.includes(newCat.name)
                          ? prev
                          : [...prev, newCat.name],
                      );
                    }
                  }}
                  onSave={handleSave}
                  onDiscard={handleCancelEditing}
                  errors={validationErrors}
                  productId={state.editingProduct?.productId}
                  isSaving={isSaving || isFinalSaving}
                  onAutoGenerateSku={handleAutoGenerateSku}
                  generatingSku={generatingSku}
                />
              )}
              {state.activeTab === "Pricing" && (
                <PricingTaxTab
                  formData={formData}
                  onFieldChange={handleFormFieldChange}
                  isAdding={state.isAdding}
                  errors={validationErrors}
                  onSave={handleSave}
                  isSaving={isSaving || isFinalSaving}
                  onNavigateToCore={() => setActiveTab("Core")}
                />
              )}
              {state.activeTab === "Images" && (
                <ImagesTab
                  formData={formData}
                  onFieldChange={handleFormFieldChange}
                  uploadingImages={state.uploadingImages}
                  setUploadingImages={setUploadingImages}
                  onSave={handleSave}
                  errors={validationErrors}
                  isSaving={isSaving || isFinalSaving}
                />
              )}
              {state.activeTab === "Related Products" && (
                <RelatedProductsTab
                  formData={formData}
                  onFieldChange={handleFormFieldChange}
                  allProducts={products}
                  currentProductId={getCanonicalProductId(
                    state.editingProduct || formData,
                  )}
                  onSave={handleSaveRelatedProducts}
                  isSaving={isSaving || isFinalSaving}
                />
              )}
              {state.activeTab === "SEO" && (
                <SEOTab
                  formData={formData}
                  onFieldChange={handleFormFieldChange}
                  onSave={handleSave}
                  onNavigateToRelatedProducts={() =>
                    setActiveTab("Related Products")
                  }
                  isSaving={isSaving || isFinalSaving}
                />
              )}
              {state.activeTab === "Calendar" && state.editingProduct && (
                <AvailabilityCalendarTab
                  editingProduct={state.editingProduct}
                  onUpdateProduct={(updatedProd) => {
                    startEditing(updatedProd);
                    setFormData(updatedProd);
                  }}
                  onOpenGlobalCalendar={() => {}}
                  orders={orders}
                  offers={offers}
                  promoCodes={promoCodes}
                  loading={state.loading}
                  onViewOrder={onViewOrder}
                  customers={customers}
                  onAddOrder={(newOrder) => {
                    if (onUpdateProduct) {
                      onUpdateProduct({
                        ...state.editingProduct!,
                        bookingHistory: [
                          ...(state.editingProduct?.bookingHistory || []),
                          newOrder,
                        ],
                      } as any);
                    }
                    if (onAddOrder) {
                      onAddOrder(newOrder);
                    }
                  }}
                  onAddCustomer={onAddCustomer}
                />
              )}
              {state.activeTab === "Payout History" &&
                (state.editingProduct || state.isAdding) && (
                  <PayoutHistoryTab
                    payoutHistory={
                      state.editingProduct ? state.payoutHistory : []
                    }
                    loading={state.editingProduct ? state.loading : false}
                    isAdding={state.isAdding}
                  />
                )}
              {state.activeTab === "Enquiry History" &&
                (state.editingProduct || state.isAdding) && (
                  <EnquiryHistoryTab
                    product={state.editingProduct}
                    enquiries={enquiries}
                    orders={orders}
                    isAdding={state.isAdding}
                    onOpenEnquiry={onOpenEnquiry}
                    onLogEnquiryForPiece={onLogEnquiryForPiece}
                  />
                )}
              {state.activeTab === "Activity Log" &&
                (state.isAdding ? (
                  <div className="overflow-hidden rounded-lg border border-[#E8E0D6] bg-white shadow-sm">
                    <div className="border-b border-[#EEE8E1] px-5 py-3">
                      <h3 className="text-[15px] font-semibold text-[#2F2B27]">
                        Activity Log
                      </h3>
                    </div>
                    <div className="px-5 py-6">
                      <p className="text-[13px] text-[#9B9388]">
                        No activity yet — this piece's story starts here.
                      </p>
                    </div>
                  </div>
                ) : state.editingProduct ? (
                  <ActivityLogTab
                    activityLog={state.activityLog}
                    loading={state.loading}
                  />
                ) : null)}
            </div>

            {(state.editingProduct || state.isAdding) && (
              <div className="w-full xl:w-[300px] 2xl:w-[330px] xl:shrink-0">
                <ProductSidebar
                  product={(state.editingProduct || formData) as Product}
                  isNew={state.isAdding}
                  onViewLive={() =>
                    state.editingProduct?.urlSlug &&
                    window.open(
                      `/product/${state.editingProduct.urlSlug}`,
                      "_blank",
                    )
                  }
                  onArchive={handleArchive}
                  onOpenGlobalCalendar={() => {
                    console.log("Open global rental calendar");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const liveCount = filteredProducts.filter(
    (p) =>
      p.status === "Live" || p.status === "Active" || p.status === "Published",
  ).length;
  const draftCount = filteredProducts.filter(
    (p) => p.status === "Draft" || p.status === "Pending Review",
  ).length;
  const pausedCount = filteredProducts.filter(
    (p) =>
      p.status === "Archived" ||
      p.status === "Paused" ||
      p.status === "Inactive",
  ).length;

  // Dynamic portfolio revenue calculation using real DB orders prop
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.orderValue || o.grandTotal || o.amount || 0),
    0,
  );
  const hokRetained = orders.reduce((sum, o) => {
    const val = Number(o.orderValue || o.grandTotal || o.amount || 0);
    const listerPayout = Number(o.listerPayout || Math.round(val * 0.45));
    return sum + (val - listerPayout);
  }, 0);

  // Active rentals count from DB orders
  const inRental = orders.filter(
    (o) =>
      o.status === "Confirmed" ||
      o.status === "Dispatched" ||
      o.status === "Shipped" ||
      o.status === "In Rental",
  ).length;
  const needsAttention = filteredProducts.filter(
    (p) =>
      p.status === "Pending Review" ||
      p.status === "Review" ||
      p.status === "Draft",
  ).length;

  return (
    <div className="space-y-6 text-xs font-sans">
      <ProductHeader
        isEditing={false}
        isAdding={false}
        onBack={() => {}}
        onSave={() => {}}
        onAdd={handleStartAdding}
      />

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={dbCategories}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onAddProduct={handleStartAdding}
      />

      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="space-y-5 text-xs font-sans p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
                LIVE PIECES
              </div>
              <div className="text-[26px] font-serif text-[#2B2520] font-normal my-0.5 leading-tight">
                {liveCount}
              </div>
              <div className="text-[12px] text-[#8A8177]">
                {draftCount} draft · {pausedCount} paused
              </div>
            </div>
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
                PORTFOLIO REVENUE (PAID)
              </div>
              <div className="text-[26px] font-serif text-[#2B2520] font-normal my-0.5 leading-tight">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
              <div className="text-[12px] text-[#8A8177]">
                HOK retained ₹{hokRetained.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
                IN RENTAL TODAY
              </div>
              <div className="text-[26px] font-serif text-[#C04838] font-normal my-0.5 leading-tight">
                {inRental}
              </div>
              <div className="text-[12px] text-[#8A8177]">active rentals</div>
            </div>
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
                NEEDS ATTENTION
              </div>
              <div className="text-[26px] font-serif text-[#C04838] font-normal my-0.5 leading-tight">
                {needsAttention}
              </div>
              <div className="text-[12px] text-[#8A8177]">
                flagged on the rows below
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#EBE5DF] shadow-sm overflow-hidden">
            <ProductTable
              products={paginatedProducts}
              loading={loading}
              onEdit={handleEditWithTab}
            />

            {/* Pagination Controls (10 items per page) */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-[#FAF8F5] border-t border-[#EBE5DF] text-xs">
                <div className="text-[#8C847A] font-sans">
                  Showing{" "}
                  <span className="font-semibold text-[#2B2520]">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#2B2520]">
                    {Math.min(startIndex + pageSize, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#2B2520]">
                    {filteredProducts.length}
                  </span>{" "}
                  pieces
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={validCurrentPage <= 1}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#E2DAD1] bg-white text-[#524B43] hover:bg-[#FAF8F5] hover:border-[#C7A55C] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#E2DAD1] text-[11px] font-medium transition cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        const isActive = pageNum === validCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`min-w-[28px] h-7 px-2 rounded-md text-[11px] font-medium transition cursor-pointer ${
                              isActive
                                ? "bg-[#2B2520] text-white shadow-2xs"
                                : "bg-white border border-[#E2DAD1] text-[#524B43] hover:bg-[#FAF8F5] hover:border-[#C7A55C]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={validCurrentPage >= totalPages}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#E2DAD1] bg-white text-[#524B43] hover:bg-[#FAF8F5] hover:border-[#C7A55C] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#E2DAD1] text-[11px] font-medium transition cursor-pointer shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
