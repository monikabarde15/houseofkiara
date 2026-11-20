import { apiRequest } from "./apiClient";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiRequest("/categories");
  return res.data || [];
};

export const createCategory = async (name: string): Promise<Category> => {
  const res = await apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
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
