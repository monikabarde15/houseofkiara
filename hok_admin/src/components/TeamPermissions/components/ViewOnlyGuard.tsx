import React, { useCallback } from "react";
import { Lock } from "lucide-react";
import { useTeamPermissions } from "../TeamPermissionsContext";
import { SECTION_BY_ID, resolveViewPermissionSection } from "../constants";

/**
 * Sections that draw their own read-only state or are always read-only (Spec 9.3)
 */
const SELF_HANDLED_SECTIONS = new Set([
  "dashboard",
  "reports",
  "notifications",
  "settings",
  "homepage",
  "pages",
  "pages_editor",
  "master_data",
  "roles_permissions",
]);

function isSafeViewOnlyControl(el: HTMLElement): boolean {
  if (el.closest("[data-tp-allow-view='true']")) return true;

  if (el.tagName === "A") {
    const href = (el as HTMLAnchorElement).getAttribute("href") || "";
    if (href.startsWith("https://wa.me") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return true;
    }
  }

  const inputEl = el.closest("input, select, textarea") as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;
  if (inputEl) {
    const type = (inputEl.getAttribute("type") || "").toLowerCase();
    const ph = (inputEl.getAttribute("placeholder") || "").toLowerCase();
    const aria = (inputEl.getAttribute("aria-label") || "").toLowerCase();
    if (
      type === "search" ||
      type === "date" ||
      ph.includes("search") ||
      ph.includes("filter") ||
      aria.includes("search") ||
      aria.includes("filter")
    ) {
      return true;
    }
    if (inputEl.tagName === "SELECT") {
      const valText = Array.from((inputEl as HTMLSelectElement).options)
        .map((o) => o.text.toLowerCase())
        .join(" ");
      if (
        valText.includes("all ") ||
        valText.includes("sort") ||
        valText.includes("filter")
      ) {
        return true;
      }
    }
    return false;
  }

  const btn = el.closest("button");
  if (!btn) return true;
  const text = (btn.textContent || "").trim().toLowerCase();
  const title = (btn.getAttribute("title") || "").toLowerCase();
  const aria = (btn.getAttribute("aria-label") || "").toLowerCase();
  const combined = `${text} ${title} ${aria}`;

  // Navigation, viewing, tabs, filters, print, WhatsApp/email links stay enabled
  if (
    btn.getAttribute("role") === "tab" ||
    combined.includes("view") ||
    combined.includes("open") ||
    combined.includes("back") ||
    combined.includes("close") ||
    combined.includes("cancel") ||
    combined.includes("print") ||
    combined.includes("whatsapp") ||
    combined.includes("email") ||
    combined.includes("filter") ||
    combined.includes("prev") ||
    combined.includes("next") ||
    combined.includes("today") ||
    combined.includes("week") ||
    combined.includes("month") ||
    combined.includes("export") ||
    combined.includes("download") ||
    combined.includes("csv")
  ) {
    return true;
  }

  return false;
}

export const ViewOnlyGuard: React.FC<{
  currentView: string;
  children: React.ReactNode;
}> = ({ currentView, children }) => {
  const {
    effectivePermissions,
    getSectionLevel,
    hasDecision,
    refuseDecision,
    refuseViewOnlySave,
  } = useTeamPermissions();

  const govSection = resolveViewPermissionSection(currentView);
  const level = getSectionLevel(govSection);
  const isViewOnly =
    !effectivePermissions.isFounder &&
    level === "View" &&
    !SELF_HANDLED_SECTIONS.has(govSection);

  const secLabel = SECTION_BY_ID[govSection]?.label || govSection;
  const roleName = effectivePermissions.roleName || "your role";

  const handleClickCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Export / Download Lists check works in both Edit and View Only (Spec 9.4)
      const btn = target.closest("button, a");
      if (btn) {
        const text = (btn.textContent || "").trim().toLowerCase();
        if (
          text.includes("export csv") ||
          text.includes("download list") ||
          text.includes("export list") ||
          text.includes("export travel")
        ) {
          if (!hasDecision("download_lists")) {
            e.preventDefault();
            e.stopPropagation();
            refuseDecision("download_lists");
            return;
          }
          return;
        }
      }

      if (!isViewOnly) return;

      if (!isSafeViewOnlyControl(target)) {
        e.preventDefault();
        e.stopPropagation();
        refuseViewOnlySave(govSection);
      }
    },
    [isViewOnly, hasDecision, refuseDecision, refuseViewOnlySave, govSection],
  );

  const handleChangeOrSubmitCapture = useCallback(
    (e: React.SyntheticEvent<HTMLDivElement>) => {
      if (!isViewOnly) return;
      const target = e.target as HTMLElement | null;
      if (e.type === "submit") {
        e.preventDefault();
        e.stopPropagation();
        refuseViewOnlySave(govSection);
        return;
      }
      if (target && !isSafeViewOnlyControl(target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isViewOnly, refuseViewOnlySave, govSection],
  );

  return (
    <div
      data-tp-view-only={isViewOnly ? "true" : undefined}
      onClickCapture={handleClickCapture}
      onSubmitCapture={handleChangeOrSubmitCapture}
      onChangeCapture={handleChangeOrSubmitCapture}
      className="relative"
    >
      {isViewOnly && (
        <div className="px-4 sm:px-6 pt-4">
          <div className="tp-view-only-banner mb-0">
            <Lock className="h-3.5 w-3.5 shrink-0 text-[#6B5B82]" />
            <span>
              <strong className="font-semibold">View only.</strong> Your role (
              {roleName}) can view {secLabel} but not change it. Every record
              still opens; nothing here can be changed.
            </span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
