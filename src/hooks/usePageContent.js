import { useState, useEffect, useCallback } from "react";
import { fetchPageContent } from "../services/pageService";

const DEFAULT_STYLE = {
  bgColor: "#faf7f2",
  textColor: "#1e1412",
  accentColor: "#c5a880",
  headingFont: "'Cormorant Garamond', Georgia, serif",
  bodyFont: "'DM Sans', 'Inter', sans-serif",
};

const PAGE_ROOTS = [
  ".pf-page",
  ".hok-custom-sections",
  ".au-desktop",
  ".mob-about-us",
  ".hok-hiw-page",
  ".hok-faq-page",
  ".cu-page",
  ".sh-page",
  ".hok-refunds-page",
  ".deposit-page",
  ".care-page",
  ".sg-page",
  ".terms-page",
  ".privacy-page",
  ".cookie-page",
  ".sys-maint-page",
];

const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap";

const SLUG_ALIAS_GROUPS = {
  "pricing-fees": "pricing-fees",
  pricing: "pricing-fees",
  "pricing-policy": "pricing-fees",
  about: "about",
  "about-us": "about",
  faqs: "faqs",
  faq: "faqs",
  cookies: "cookies",
  cookie: "cookies",
  "cookie-policy": "cookies",
  terms: "terms",
  "terms-and-conditions": "terms",
  "terms-conditions": "terms",
  seller: "seller-guidelines",
  "seller-guidelines": "seller-guidelines",
  "seller-faq": "seller-guidelines",
  shipping: "shipping-policy",
  "shipping-policy": "shipping-policy",
  "shipping-and-delivery": "shipping-policy",
  deposit: "deposit-policy",
  "deposit-policy": "deposit-policy",
  care: "care-policy",
  "care-policy": "care-policy",
  refunds: "refunds",
  refund: "refunds",
  "refunds-cancellations": "refunds",
};

const normalizeSlug = (s) => {
  const cleaned = String(s || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  if (!cleaned) return "";
  if (SLUG_ALIAS_GROUPS[cleaned]) return SLUG_ALIAS_GROUPS[cleaned];
  const stripped = cleaned.replace(/-us$/, "").replace(/-policy$/, "");
  return SLUG_ALIAS_GROUPS[stripped] || stripped;
};

const normVal = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const normColor = (v) => String(v || "").trim().toLowerCase();

/**
 * Custom React hook for public website pages to render dynamic content
 * saved in the admin panel database, plus real-time iframe preview sync.
 *
 * @param {string} slug - Page slug, e.g. '/contact' or 'pricing-fees' or 'about'
 * @param {object} initialValues - Optional fallback values
 */
export function usePageContent(slug, initialValues = {}) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isImportStatic =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("import_static") === "1";

  const loadData = useCallback(async () => {
    if (!slug || isImportStatic) {
      setPageData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setPageData(null);
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
  }, [slug, isImportStatic]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time preview sync with Admin Pages Editor iframe
  useEffect(() => {
    if (typeof window === "undefined" || !slug || isImportStatic) return;

    const targetNorm = normalizeSlug(slug);
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      const msg = event.data;
      if (!msg || msg.type !== "HOK_PAGE_PREVIEW") return;
      if (normalizeSlug(msg.slug) !== targetNorm) return;

      setPageData((prev) => ({
        ...(prev || {}),
        slug: msg.slug,
        fieldValues: msg.fieldValues || {},
        hiddenParts: msg.hiddenParts || {},
        settings: msg.settings || {},
        ...(Array.isArray(msg.answers) ? { answers: msg.answers } : {}),
      }));
    };

    window.addEventListener("message", handleMessage);

    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          { type: "HOK_PAGE_PREVIEW_READY", slug },
          window.location.origin
        );
      } catch {
        // Ignore cross-frame postMessage errors if parent origin differs
      }
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [slug, isImportStatic]);

  // Apply custom style (colors & fonts) saved from Admin Pages Editor or live preview
  useEffect(() => {
    const dynCfg = pageData?.settings?.dynamicPage;
    if (dynCfg && dynCfg.published !== true) return;

    const styleCfg = pageData?.settings?.style;
    if (!styleCfg || isImportStatic || typeof document === "undefined") return;

    const bgDiff =
      styleCfg.bgColor &&
      normColor(styleCfg.bgColor) !== normColor(DEFAULT_STYLE.bgColor);
    const textDiff =
      styleCfg.textColor &&
      normColor(styleCfg.textColor) !== normColor(DEFAULT_STYLE.textColor);
    const accentDiff =
      styleCfg.accentColor &&
      normColor(styleCfg.accentColor) !== normColor(DEFAULT_STYLE.accentColor);
    const headingFontDiff =
      styleCfg.headingFont &&
      normVal(styleCfg.headingFont) !== normVal(DEFAULT_STYLE.headingFont);
    const bodyFontDiff =
      styleCfg.bodyFont &&
      normVal(styleCfg.bodyFont) !== normVal(DEFAULT_STYLE.bodyFont);

    if (!bgDiff && !textDiff && !accentDiff && !headingFontDiff && !bodyFontDiff) {
      return;
    }

    if (
      (headingFontDiff || bodyFontDiff) &&
      !document.getElementById("hok-dynamic-google-fonts")
    ) {
      const link = document.createElement("link");
      link.id = "hok-dynamic-google-fonts";
      link.rel = "stylesheet";
      link.href = GOOGLE_FONTS_HREF;
      document.head.appendChild(link);
    }

    const rootsSel = PAGE_ROOTS.join(", ");
    const varRules = [];
    const cssBlocks = [];

    if (bgDiff) {
      const bg = styleCfg.bgColor;
      varRules.push(
        `--cream: ${bg};`,
        `--warm-white: ${bg};`,
        `--care-cream: ${bg};`,
        `--care-warm-white: ${bg};`,
        `--dp-cream: ${bg};`,
        `--hok-cream: ${bg};`,
        `--hok-warm-white: ${bg};`,
        `--hok-faq-cream: ${bg};`,
        `--hok-faq-warm-white: ${bg};`,
        `--sys-cream: ${bg};`,
        `--sys-warm-white: ${bg};`
      );
      const bgTargets = PAGE_ROOTS.flatMap((r) => [
        r,
        `${r} .dp-hero`,
        `${r} .crumbs`,
        `${r} .dp-body`,
      ]).join(", ");
      cssBlocks.push(`${bgTargets} { background-color: ${bg} !important; }`);
    }

    if (textDiff) {
      const txt = styleCfg.textColor;
      varRules.push(
        `--ink: ${txt};`,
        `--ink-2: ${txt};`,
        `--ink-3: ${txt};`,
        `--ink-soft: ${txt};`,
        `--dp-ink: ${txt};`,
        `--dp-ink-2: ${txt};`,
        `--dp-ink-3: ${txt};`,
        `--hok-body-brown: ${txt};`,
        `--hok-secondary-brown: ${txt};`,
        `--hok-soft-brown: ${txt};`,
        `--sys-ink-soft: ${txt};`
      );
      const textTargets = PAGE_ROOTS.flatMap((r) => [
        r,
        `${r} h1:not(.still *):not(.au-hero *):not(.au-philosophy *):not(.au-founder *):not(.au-closing *):not(.btn-wa):not(.btn-wa *):not(.pf-toast):not(.pf-toast *)`,
        `${r} h2:not(.still *):not(.au-hero *):not(.au-philosophy *):not(.au-founder *):not(.au-closing *):not(.btn-wa):not(.btn-wa *):not(.pf-toast):not(.pf-toast *)`,
        `${r} h3:not(.still *):not(.au-hero *):not(.au-philosophy *):not(.au-founder *):not(.au-closing *):not(.btn-wa):not(.btn-wa *):not(.pf-toast):not(.pf-toast *)`,
        `${r} h4:not(.still *):not(.au-hero *):not(.au-philosophy *):not(.au-founder *):not(.au-closing *):not(.btn-wa):not(.btn-wa *):not(.pf-toast):not(.pf-toast *)`,
        `${r} p:not(.still *):not(.au-hero *):not(.au-philosophy *):not(.au-founder *):not(.au-closing *):not(.btn-wa):not(.btn-wa *):not(.pf-toast):not(.pf-toast *)`,
        `${r} li:not(.still *):not(.au-hero *):not(.au-philosophy *):not(.au-founder *):not(.au-closing *):not(.btn-wa):not(.btn-wa *):not(.pf-toast):not(.pf-toast *)`,
        `${r} .dp-h1:not(.still *)`,
        `${r} .dp-sub:not(.still *)`,
        `${r} .dp-intro:not(.still *)`,
        `${r} .cq-t:not(.still *)`,
        `${r} .lg-k:not(.still *)`,
        `${r} .lg-h:not(.still *)`,
        `${r} .lg-d:not(.still *)`,
      ]).join(", ");
      cssBlocks.push(`${textTargets} { color: ${txt} !important; }`);
    }

    if (accentDiff) {
      const acc = styleCfg.accentColor;
      varRules.push(
        `--gold: ${acc};`,
        `--gold-deep: ${acc};`,
        `--care-gold: ${acc};`,
        `--care-gold-deep: ${acc};`,
        `--dp-gold: ${acc};`,
        `--dp-gold-deep: ${acc};`,
        `--hok-gold: ${acc};`,
        `--hok-gold-deep: ${acc};`,
        `--hok-faq-gold: ${acc};`,
        `--sys-gold: ${acc};`,
        `--sys-gold-deep: ${acc};`
      );
      const accentTextTargets = PAGE_ROOTS.flatMap((r) => [
        `${r} .fq-eyebrow span`,
        `${r} .dp-h1 em`,
        `${r} .ex-hd h2 em`,
        `${r} .sec-hd h2 em`,
        `${r} .still h2 em`,
        `${r} .au-hero__eyebrow`,
        `${r} .au-name__eyebrow`,
        `${r} .au-philosophy__eyebrow`,
        `${r} .au-founder__eyebrow`,
        `${r} .au-orbit__eyebrow`,
        `${r} .au-duality__eyebrow`,
      ]).join(", ");
      const accentRuleTargets = PAGE_ROOTS.map((r) => `${r} .fq-eyebrow i`).join(", ");
      cssBlocks.push(`${accentTextTargets} { color: ${acc} !important; }`);
      cssBlocks.push(`${accentRuleTargets} { background-color: ${acc} !important; }`);
    }

    if (headingFontDiff) {
      const hf = styleCfg.headingFont;
      varRules.push(`--serif: ${hf};`);
      const headingTargets = PAGE_ROOTS.flatMap((r) => [
        `${r} h1`,
        `${r} h2`,
        `${r} h3`,
        `${r} h4`,
        `${r} .dp-h1`,
        `${r} .lg-hd h2`,
        `${r} .ex-hd h2`,
        `${r} .sec-hd h2`,
        `${r} .still h2`,
        `${r} .au-hero__title`,
        `${r} .au-name__title`,
        `${r} .au-philosophy__title`,
        `${r} .au-founder__title`,
        `${r} .au-orbit__title`,
        `${r} .au-closing__title`,
      ]).join(", ");
      cssBlocks.push(`${headingTargets} { font-family: ${hf} !important; }`);
    }

    if (bodyFontDiff) {
      const bf = styleCfg.bodyFont;
      varRules.push(`--sans: ${bf};`);
      const bodyTargets = PAGE_ROOTS.flatMap((r) => [
        r,
        `${r} p`,
        `${r} li`,
        `${r} button`,
        `${r} input`,
        `${r} td`,
        `${r} th`,
        `${r} span`,
      ]).join(", ");
      cssBlocks.push(`${bodyTargets} { font-family: ${bf} !important; }`);
    }

    if (varRules.length > 0) {
      cssBlocks.unshift(`${rootsSel} { ${varRules.join(" ")} }`);
    }

    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-hok-page-style", String(slug));
    styleEl.textContent = cssBlocks.join("\n");
    document.head.appendChild(styleEl);

    return () => {
      styleEl.remove();
    };
  }, [pageData, slug, isImportStatic]);

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

  const isSectionHidden = useCallback(
    (sectionId) => Boolean(pageData?.hiddenParts?.[sectionId]),
    [pageData]
  );

  return {
    pageData,
    fieldValues: pageData?.fieldValues || {},
    answers: pageData?.answers || null,
    hiddenParts: pageData?.hiddenParts || {},
    settings: pageData?.settings || {},
    loading,
    getVal,
    isSectionHidden,
    reload: loadData,
  };
}

export default usePageContent;
