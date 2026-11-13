import { useState, useEffect, useCallback } from "react";
import { fetchPageContent } from "../services/pageService";

/**
 * Custom React hook for public website pages to render dynamic content
 * saved in the admin panel database.
 * 
 * @param {string} slug - Page slug, e.g. '/contact' or 'contact' or 'about'
 * @param {object} initialValues - Optional fallback values
 */
export function usePageContent(slug, initialValues = {}) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!slug) return;
    try {
      const result = await fetchPageContent(slug);
      if (result) {
        setPageData(result);
      }
    } catch (err) {
      console.warn(`[usePageContent] Failed to load data for ${slug}:`, err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    loadData();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  /**
   * Helper function to get the dynamic value from database,
   * with fallback to default content if not customized yet.
   */
  const getVal = useCallback(
    (fieldId, fallbackValue = "") => {
      const dbVal = pageData?.fieldValues?.[fieldId];
      if (
        dbVal !== undefined &&
        dbVal !== null &&
        dbVal !== "" &&
        String(dbVal).trim() !== "undefined" &&
        String(dbVal).trim() !== "null"
      ) {
        return dbVal;
      }
      if (initialValues && initialValues[fieldId] !== undefined) {
        return initialValues[fieldId];
      }
      return fallbackValue;
    },
    [pageData, initialValues]
  );

  return {
    pageData,
    fieldValues: pageData?.fieldValues || {},
    answers: pageData?.answers || null,
    hiddenParts: pageData?.hiddenParts || {},
    settings: pageData?.settings || {},
    loading,
    getVal,
    reload: loadData,
  };
}

export default usePageContent;

