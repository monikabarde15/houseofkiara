import { apiRequest } from "./apiClient";

export interface PageContentPayload {
  slug: string;
  fieldValues?: Record<string, string>;
  answers?: any[];
  settings?: any;
  [key: string]: any;
}

/**
 * 1. Fetch all pages list for the Pages Workspace
 */
export const getAllPages = async (): Promise<any[]> => {
  try {
    const res = await apiRequest("/pages");
    if (res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (err) {
    console.warn("[pageApi.getAllPages] Error fetching pages:", err);
    return [];
  }
};

/**
 * Save / create page card record in database
 */
export const savePage = async (pageData: any): Promise<any> => {
  try {
    const res = await apiRequest("/pages", {
      method: "POST",
      body: JSON.stringify(pageData),
    });
    return res.data;
  } catch (err) {
    console.error("[pageApi.savePage] Error:", err);
    throw err;
  }
};

/**
 * 2. Fetch content for a specific page slug (fieldValues, answers, settings, etc.)
 */
export const getPageContent = async (slug: string): Promise<any> => {
  try {
    const cleanSlug = String(slug || "faqs").replace(/^\/+|\/+$/g, "");
    const res = await apiRequest(`/pages/content?slug=${encodeURIComponent(cleanSlug)}`);
    return res.data;
  } catch (err) {
    console.warn(`[pageApi.getPageContent] Could not load content for ${slug}:`, err);
    return null;
  }
};

/**
 * 3. Save page content (fieldValues, answers, hiddenParts, settings)
 */
export const savePageContent = async (
  slug: string,
  payload: Partial<PageContentPayload>
): Promise<any> => {
  try {
    const cleanSlug = String(slug || "faqs").replace(/^\/+|\/+$/g, "");
    const res = await apiRequest(`/pages/content`, {
      method: "POST",
      body: JSON.stringify({
        slug: cleanSlug,
        ...payload,
      }),
    });
    return res;
  } catch (err) {
    console.error(`[pageApi.savePageContent] Failed to save page content for ${slug}:`, err);
    throw err;
  }
};

/**
 * 4. Fetch all register figures
 */
export const getAllFigures = async (): Promise<any[]> => {
  try {
    const res = await apiRequest("/pages/figures");
    if (res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (err) {
    console.warn("[pageApi.getAllFigures] Error fetching figures:", err);
    return [];
  }
};

/**
 * 5. Save or update a single figure
 */
export const saveFigure = async (key: string, figureData: any): Promise<any> => {
  try {
    const res = await apiRequest("/pages/figures", {
      method: "POST",
      body: JSON.stringify({
        key,
        ...figureData,
      }),
    });
    return res;
  } catch (err) {
    console.error(`[pageApi.saveFigure] Failed to save figure ${key}:`, err);
    throw err;
  }
};

/**
 * 6. Confirm and publish all pending changes
 */
export const publishAllChanges = async (userRole = "Super Admin"): Promise<any> => {
  try {
    const res = await apiRequest("/pages/publish", {
      method: "POST",
      body: JSON.stringify({ userRole }),
    });
    return res;
  } catch (err) {
    console.error("[pageApi.publishAllChanges] Error:", err);
    throw err;
  }
};
