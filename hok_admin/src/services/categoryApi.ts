import { apiRequest } from "./apiClient";

export interface MainCategory {
  id: string;
  mainCategoryId: string;
  name: string;
  slug: string;
  sortOrder?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  mainCategoryId?: string;
  mainCategory?: string;
  image?: string;
  description?: string;
}

export const getMainCategories = async (): Promise<MainCategory[]> => {
  try {
    const res = await apiRequest("/categories/main-categories");
    return res.data || [];
  } catch {
    return [
      { id: "MC-WOMEN", mainCategoryId: "MC-WOMEN", name: "Women", slug: "women", sortOrder: 1 },
      { id: "MC-MEN", mainCategoryId: "MC-MEN", name: "Men", slug: "men", sortOrder: 2 },
      { id: "MC-UNISEX", mainCategoryId: "MC-UNISEX", name: "Unisex", slug: "unisex", sortOrder: 3 },
    ];
  }
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiRequest("/categories");
  return res.data || [];
};

export const createCategory = async (
  name: string,
  extra?: { mainCategoryId?: string; mainCategory?: string },
): Promise<Category> => {
  const res = await apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify({ name, ...(extra || {}) }),
  });
  return res.data;
};

export const updateCategory = async (
  id: string,
  data: Partial<Category>,
): Promise<Category> => {
  const res = await apiRequest(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiRequest(`/categories/${id}`, { method: "DELETE" });
};

export interface SizeOption {
  id: string;
  name: string;
}

export const getSizes = async (): Promise<SizeOption[]> => {
  const res = await apiRequest("/categories/sizes");
  return res.data || [];
};

export const createSize = async (name: string): Promise<SizeOption> => {
  const res = await apiRequest("/categories/sizes", {
    method: "POST",
    body: JSON.stringify({ name: name.trim() }),
  });
  return res.data;
};

export const deleteSize = async (name: string): Promise<void> => {
  await apiRequest(`/categories/sizes/${encodeURIComponent(name.trim())}`, {
    method: "DELETE",
  });
};

export interface OccasionOption {
  id: string;
  name: string;
}

const DEFAULT_OCCASION_FALLBACKS: OccasionOption[] = [
  "Cocktail",
  "Engagement",
  "Festive",
  "Haldi",
  "Mehendi",
  "Reception",
  "Sangeet",
  "Wedding",
].map((name) => ({ id: name.toLowerCase(), name }));

export const getOccasions = async (): Promise<OccasionOption[]> => {
  try {
    const res = await apiRequest("/categories/occasions");
    if (Array.isArray(res?.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Fallback if backend route hasn't reloaded yet
  }
  const localExtra: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("hok_custom_occasions") || "[]");
    } catch {
      return [];
    }
  })();
  const merged = new Map<string, OccasionOption>();
  [
    ...DEFAULT_OCCASION_FALLBACKS,
    ...localExtra.map((n) => ({
      id: n.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: n,
    })),
  ].forEach((item) => {
    merged.set(item.name.toLowerCase(), item);
  });
  return Array.from(merged.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

export const createOccasion = async (name: string): Promise<OccasionOption> => {
  const trimmed = name.trim();
  try {
    const localExtra: string[] = JSON.parse(
      localStorage.getItem("hok_custom_occasions") || "[]",
    );
    if (!localExtra.some((x) => x.toLowerCase() === trimmed.toLowerCase())) {
      localStorage.setItem(
        "hok_custom_occasions",
        JSON.stringify([...localExtra, trimmed]),
      );
    }
  } catch {}

  try {
    const res = await apiRequest("/categories/occasions", {
      method: "POST",
      body: JSON.stringify({ name: trimmed }),
    });
    if (res?.data?.name) return res.data;
  } catch {
    // Graceful fallback if backend route hasn't reloaded yet
  }
  return {
    id: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: trimmed,
  };
};

// ================== COLOURS ==================
export interface ColorOption {
  id?: string;
  name: string;
  hex: string;
  family: string;
}

export const getColors = async (): Promise<ColorOption[]> => {
  try {
    const res = await apiRequest("/categories/colors");
    if (Array.isArray(res?.data) && res.data.length > 0) return res.data;
  } catch {
    // backend not reloaded yet -> caller falls back to built-in palette
  }
  return [];
};

export const createColor = async (
  color: ColorOption,
): Promise<ColorOption> => {
  const res = await apiRequest("/categories/colors", {
    method: "POST",
    body: JSON.stringify({
      name: color.name.trim(),
      hex: color.hex,
      family: color.family,
    }),
  });
  return res.data;
};

// ================== FABRIC CARE ==================
export interface FabricCareOption {
  id: string;
  label: string;
  instructions: string[];
}

export const getFabricCareOptions = async (): Promise<FabricCareOption[]> => {
  try {
    const res = await apiRequest("/categories/fabric-care");
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    return [];
  }
};

export const createFabricCareOption = async (payload: {
  label: string;
  instructions?: string[];
}): Promise<FabricCareOption> => {
  const res = await apiRequest("/categories/fabric-care", {
    method: "POST",
    body: JSON.stringify({
      label: payload.label.trim(),
      instructions: payload.instructions || [],
    }),
  });
  return res.data;
};

// ================== SIZE & FIT MASTER OPTIONS ==================
export interface CategoryPieceOption {
  piece: string;
  name: string;
}

export interface SizeFitMasterOptions {
  masterPieces: Array<{
    id: string;
    name: string;
    details: Array<"padded" | "cancan" | "closure">;
    measures: Array<{
      k: string;
      lbl: string;
      unit: "in" | "m";
      std: boolean;
      role: "bust" | "chest" | "waist" | "hips" | null;
    }>;
  }>;
  categoryPieces: Record<string, Array<{ piece: string; name: string }>>;
  categoryAllowedPieces?: Record<string, string[]>;
  categoryAddOptions?: Record<string, CategoryPieceOption[]>;
  sizeGuides: Record<
    "womens_sets" | "saree_blouse" | "menswear",
    {
      id: "womens_sets" | "saree_blouse" | "menswear";
      label: string;
      allow: number;
      rows: Array<{
        size: string;
        bust?: number;
        chest?: number;
        waist?: number;
        hips?: number;
      }>;
    }
  >;
  measuredByOptions: string[];
  howItFitsOptions: string[];
  closureOptions: string[];
  paddedOptions: string[];
  cancanOptions: string[];
  heightOptions: string[];
  designerLabels: string[];
  designers?: Array<{ id: string; name: string }>;
}

export type SizeFitOptionListType =
  | "measuredByOptions"
  | "howItFitsOptions"
  | "closureOptions"
  | "paddedOptions"
  | "cancanOptions"
  | "heightOptions"
  | "designerLabels";

export const getSizeFitOptions = async (): Promise<SizeFitMasterOptions | null> => {
  try {
    const res = await apiRequest("/categories/size-fit-options");
    return res?.data || null;
  } catch {
    return null;
  }
};

export const addSizeFitOption = async (
  listType: SizeFitOptionListType,
  value: string,
): Promise<{
  listType: SizeFitOptionListType;
  value: string;
  list: string[];
  createdDesigner?: any;
  designerCreated?: boolean;
} | null> => {
  const res = await apiRequest("/categories/size-fit-options", {
    method: "POST",
    body: JSON.stringify({ listType, value: value.trim() }),
  });
  return res?.data || null;
};

export const addCategoryPieceOption = async (
  category: string,
  name: string,
  templatePieceId = "cape",
  gender = "",
): Promise<{
  pieceId: string;
  name: string;
  categoryKey: string;
  masterPieces: SizeFitMasterOptions["masterPieces"];
  categoryAddOptions: Record<string, CategoryPieceOption[]>;
  categoryAllowedPieces: Record<string, string[]>;
} | null> => {
  const res = await apiRequest("/categories/size-fit-options", {
    method: "POST",
    body: JSON.stringify({
      listType: "categoryPiece",
      category: String(category || "").trim(),
      gender: String(gender || "").trim(),
      name: name.trim(),
      templatePieceId,
    }),
  });
  return res?.data || null;
};
