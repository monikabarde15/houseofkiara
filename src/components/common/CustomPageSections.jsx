import React from "react";
import { sanitizeRichHtml } from "../../utils/sanitizeRichHtml";
import "../../styles/custom-page-sections.css";

function CustomPageSections({
  sections = [],
  placement = null,
  activeSide = null,
  compact = false,
}) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  const visibleSections = sections.filter((sec) => {
    if (!sec || sec.hidden) return false;
    if (placement && (sec.placement || "before_closing") !== placement) {
      return false;
    }
    if (activeSide && sec.side && sec.side !== "all" && sec.side !== activeSide) {
      return false;
    }
    const hasTitle = Boolean(String(sec.title || "").trim());
    const hasSubtitle = Boolean(String(sec.subtitle || "").trim());
    const hasHtml = Boolean(String(sec.htmlContent || "").trim());
    return hasTitle || hasSubtitle || hasHtml;
  });

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <div
      className={`hok-custom-sections${compact ? " hok-custom-sections--compact" : ""}`}
    >
      {visibleSections.map((sec, idx) => {
        const cleanHtml = sanitizeRichHtml(sec.htmlContent || "");
        const title = String(sec.title || "").trim();
        const subtitle = String(sec.subtitle || "").trim();
        return (
          <section
            key={sec.id || `custom-sec-${idx}`}
            id={sec.id || `custom-sec-${idx}`}
            className="hok-custom-sec"
          >
            {(title || subtitle) && (
              <div className="hok-custom-sec-hd">
                {title && <h2>{title}</h2>}
                {subtitle && <p>{subtitle}</p>}
              </div>
            )}
            {cleanHtml && (
              <div
                className="hok-rich-content"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}

export default React.memo(CustomPageSections);
