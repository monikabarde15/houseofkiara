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

  // Apply custom style (colors & fonts) saved from Admin Pages Editor
  useEffect(() => {
    const styleCfg = pageData?.settings?.style;
    if (!styleCfg || typeof document === "undefined") return;
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-hok-page-style", String(slug));
    const rules = [];
    if (styleCfg.bgColor) {
      rules.push(`background-color: ${styleCfg.bgColor} !important;`);
    }
    if (styleCfg.textColor) {
      rules.push(`color: ${styleCfg.textColor} !important;`);
    }
    if (styleCfg.bodyFont) {
      rules.push(`font-family: ${styleCfg.bodyFont} !important;`);
    }
    let css = "";
    if (rules.length > 0) {
      css += `body, .au-desktop, .au-mobile, .hiw-page, .faq-page, .policy-page { ${rules.join(" ")} }\n`;
    }
    if (styleCfg.headingFont) {
      css += `h1, h2, h3, .au-hero__title, .au-name__title, .au-philosophy__title, .au-founder__title, .au-orbit__title, .au-closing__title { font-family: ${styleCfg.headingFont} !important; }\n`;
    }
    if (styleCfg.accentColor) {
      css += `.au-hero__eyebrow, .au-name__eyebrow, .au-philosophy__eyebrow, .au-founder__eyebrow, .au-orbit__eyebrow, .au-duality__eyebrow { color: ${styleCfg.accentColor} !important; }\n`;
    }
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => {
      styleEl.remove();
    };
  }, [pageData, slug]);

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

