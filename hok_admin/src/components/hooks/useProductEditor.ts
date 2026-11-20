// src/hooks/useProductEditor.ts

import { useState, useCallback } from "react";
import {
  Product,
  ProductTab,
  PayoutRecord,
  ActivityLog,
} from "../types/product";
import * as productSectionsApi from "../../services/productSectionsApi";

interface ProductEditorState {
  isAdding: boolean;
  editingProduct: Product | null;
  activeTab: ProductTab;
  loading: boolean;
  uploadingImages: boolean;
  payoutHistory: PayoutRecord[];
  activityLog: ActivityLog[];
}

export function useProductEditor() {
  const [state, setState] = useState<ProductEditorState>({
    isAdding: false,
    editingProduct: null,
    activeTab: "Core",
    loading: false,
    uploadingImages: false,
    payoutHistory: [],
    activityLog: [],
  });

  const [formData, setFormData] = useState<Partial<Product>>({});

  // ✅ Helper function to ensure listingModes is uppercase
  const normalizeListingModes = (modes?: string[]): string[] => {
    if (!modes || !Array.isArray(modes) || modes.length === 0) {
      return ["RENTAL"];
    }
    return modes
      .map((mode: string) => mode.toUpperCase())
      .filter((mode: string) =>
        ["RENTAL", "PRELOVED", "BUY NEW"].includes(mode),
      );
  };

  // ✅ Helper function to clean product data
  const cleanProductData = (product: Product): Product => {
    const cleanProduct: any = { ...product };

    // ✅ Remove internal DB / adapter fields so nested _data never leaks
    const forbiddenFields = [
      "__v",
      "_data",
      "_model",
      "_isNew",
      "data",
      "listingModels",
      "listingMode",
    ];
    forbiddenFields.forEach((field) => {
      if (cleanProduct[field] !== undefined) {
        delete cleanProduct[field];
      }
    });

    // Normalize long LYP condition strings ("Excellent — Worn once...") to canonical grade
    const rawCond = String(cleanProduct.condition || "").trim();
    if (rawCond) {
      const lower = rawCond.toLowerCase();
      if (lower.startsWith("pristine")) cleanProduct.condition = "Pristine";
      else if (lower.startsWith("brand new")) cleanProduct.condition = "Brand New";
      else if (lower.startsWith("like new")) cleanProduct.condition = "Like New";
      else if (lower.startsWith("very good")) cleanProduct.condition = "Very Good";
      else if (lower.startsWith("excellent")) cleanProduct.condition = "Excellent";
      else if (lower.startsWith("good")) cleanProduct.condition = "Good";
      else if (lower.startsWith("fair")) cleanProduct.condition = "Fair";
    }

    // ✅ Ensure listingModes is uppercase
    cleanProduct.listingModes = normalizeListingModes(
      cleanProduct.listingModes,
    );

    return cleanProduct as Product;
  };

  const loadProductSections = useCallback(async (productId: string) => {
    if (!productId) return;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const [calendar, payout, activity] = await Promise.all([
        productSectionsApi
          .getCalendar(productId)
          .catch(() => ({ blockedDates: [], bookingHistory: [] })),
        productSectionsApi.getPayoutHistory(productId).catch(() => []),
        productSectionsApi.getActivity(productId).catch(() => []),
      ]);

      setState((prev) => {
        const productLog = (prev.editingProduct?.activityLog || []) as any[];
        const apiLog = (activity || []) as any[];
        const mergedLog = Array.from(
          new Set([...productLog, ...apiLog].map((a) => JSON.stringify(a))),
        ).map((s) => JSON.parse(s));

        return {
          ...prev,
          editingProduct: prev.editingProduct
            ? {
                ...prev.editingProduct,
                blockedDates: calendar?.blockedDates || [],
                bookingHistory: calendar?.bookingHistory || [],
                externalBookings: calendar?.externalBookings || [],
                orderHistory: calendar?.orderHistory || [],
              }
            : null,
          payoutHistory: payout || [],
          activityLog:
            mergedLog.length > 0 ? mergedLog : prev.activityLog || [],
          loading: false,
        };
      });
    } catch (error) {
      console.error("Unable to load product sections:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // ✅ FIXED: startEditing with cleaned data
  const startEditing = useCallback(
    (product: Product) => {
      // Clean the product data
      const cleanProduct = cleanProductData(product);
      const targetId =
        cleanProduct.productId ||
        (cleanProduct as any)._id ||
        cleanProduct.id ||
        "";

      setState((prev) => ({
        ...prev,
        editingProduct: cleanProduct,
        isAdding: false,
        activeTab: "Core",
      }));
      setFormData(cleanProduct);

      // ✅ Load additional sections (Calendar, Payout, Activity) from separate APIs
      if (targetId) {
        loadProductSections(targetId);
      }
    },
    [loadProductSections],
  );

  // ✅ FIXED: startAdding with UPPERCASE listingModes
  const startAdding = useCallback(() => {
    const defaultProduct: Partial<Product> = {
      name: "",
      designer: "",
      description: "",
      category: "",
      occasion: "",
      material: "Silk Organza",
      embellishments: "Zardozi",
      sizes: ["S", "M"],
      listingModes: ["RENTAL"], // ✅ FIXED - UPPERCASE!
      condition: "Excellent",
      status: "Review",
      rentalPrice: 5000,
      securityDeposit: 10000,
      listingPrice: 150000,
      commissionRate: 25,
      cleaningBufferDays: 2,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60",
      ],
      taxRate: 0,
      cleaningFee: 0,
      extensionPrice: 0,
      relatedProductIds: [],
    };

    setState((prev) => ({
      ...prev,
      editingProduct: null,
      isAdding: true,
      activeTab: "Core",
      payoutHistory: [],
      activityLog: [],
      loading: false,
    }));
    setFormData(defaultProduct);
  }, []);

  const setActiveTab = useCallback((tab: ProductTab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  // ✅ FIXED: updateFormField with listingModes normalization
  const updateFormField = useCallback(
    <K extends keyof Product>(field: K, value: Product[K]) => {
      // If field is listingModes, normalize it
      if (field === "listingModes" && Array.isArray(value)) {
        const normalized = (value as any[]).map((mode: string) =>
          mode.toUpperCase(),
        );
        setFormData((prev) => ({ ...prev, [field]: normalized }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    },
    [],
  );

  const cancelEditing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      editingProduct: null,
      isAdding: false,
      activeTab: "Core",
    }));
    setFormData({});
  }, []);

  const setUploadingImages = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, uploadingImages: loading }));
  }, []);

  // ✅ New helper to get clean form data
  const getCleanFormData = useCallback((): Partial<Product> => {
    const cleanData = { ...formData };

    // Remove forbidden fields
    const forbiddenFields = [
      "id",
      "listerName",
      "_id",
      "__v",
      "createdAt",
      "updatedAt",
      "listingModels",
      "listingMode",
    ];
    forbiddenFields.forEach((field) => {
      if ((cleanData as any)[field] !== undefined) {
        delete (cleanData as any)[field];
      }
    });

    // Normalize listingModes
    if (cleanData.listingModes) {
      cleanData.listingModes = normalizeListingModes(
        cleanData.listingModes as string[],
      );
    }

    return cleanData;
  }, [formData]);

  // ✅ NEW: resetForm function (Taaki CoreDetailsTab isko call kar sake)
  const resetForm = useCallback(() => {
    setFormData({});
    console.log("🔄 Form reset for new product.");
  }, []);

  return {
    state,
    formData,
    setFormData,
    startEditing,
    startAdding,
    setActiveTab,
    updateFormField,
    cancelEditing,
    loadProductSections,
    setUploadingImages,
    getCleanFormData,
    normalizeListingModes,
    resetForm, // ✅ EXPORT KAR DIYA
  };
}
