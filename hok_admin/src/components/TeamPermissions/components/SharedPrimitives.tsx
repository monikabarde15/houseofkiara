import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Info, X } from "lucide-react";
import { computeInitials } from "../constants";
import { MemberStatus, PanelToastMessage } from "../types";

/**
 * Spec 4.7: Avatar circle in role colour with white initials
 */
export const TeamAvatar: React.FC<{
  name: string;
  colour?: string;
  size?: 34 | 48;
}> = ({ name, colour = "#8A7E72", size = 34 }) => {
  const initials = computeInitials(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: colour || "#8A7E72",
        fontSize: size === 48 ? 16 : 12,
      }}
      className="shrink-0 rounded-full flex items-center justify-center font-semibold text-white select-none tracking-wide"
    >
      {initials}
    </div>
  );
};

/**
 * Spec 4.7: Status pill
 */
const STATUS_STYLES: Record<MemberStatus, { bg: string; color: string }> = {
  Active: { bg: "#E9EFE2", color: "#4F6142" },
  Invited: { bg: "#F5EDD8", color: "#7A5C26" },
  Paused: { bg: "#F6E7DF", color: "#A4512F" },
  Left: { bg: "#EEE8DF", color: "#6E6358" },
};

export const StatusPill: React.FC<{ status: MemberStatus }> = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Active;
  return (
    <span
      style={{ backgroundColor: style.bg, color: style.color }}
      className="inline-flex items-center justify-center rounded-full px-3 py-0.5 text-[12px] font-medium leading-5 whitespace-nowrap"
    >
      {status}
    </span>
  );
};

/**
 * Spec 4.4: Standard 520px Dialog
 */
export const TpDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="tp-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="tp-dialog-box" onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="tp-dialog-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

/**
 * Spec 4.5: 270px Contextual Menu anchored below or above the clicked element
 */
export const TpMenu: React.FC<{
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ anchorEl, onClose, children }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: -9999,
    left: -9999,
  });

  useLayoutEffect(() => {
    if (!anchorEl || !menuRef.current) return;
    const rect = anchorEl.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const width = 270;

    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));

    let top = rect.bottom + 6;
    if (top + menuRect.height > window.innerHeight - 16) {
      top = Math.max(12, rect.top - menuRect.height - 6);
    }

    setPos({ top, left });
  }, [anchorEl]);

  useEffect(() => {
    if (!anchorEl) return;
    // Focus first available button inside menu
    const timer = window.setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector(
        "button:not(:disabled)",
      ) as HTMLElement | null;
      firstFocusable?.focus();
    }, 10);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    const handleScroll = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [anchorEl, onClose]);

  if (!anchorEl) return null;

  return (
    <div
      ref={menuRef}
      className="tp-menu-popover"
      style={{ top: pos.top, left: pos.left }}
      role="menu"
    >
      {children}
    </div>
  );
};

/**
 * Spec 4.3: Dark bottom-centred toast message
 */
export const TpToastContainer: React.FC<{
  toast: PanelToastMessage | null;
  onDismiss: () => void;
}> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="tp-toast-wrap" role="status" aria-live="polite">
      <div className="tp-toast-card">
        <Info className="h-4 w-4 text-[#C9A96E] shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div>
            {toast.boldPrefix && (
              <strong className="font-semibold text-[#F3EADB]">
                {toast.boldPrefix}
                {toast.message ? " " : ""}
              </strong>
            )}
            <span>{toast.message}</span>
          </div>
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={toast.onAction}
              className="tp-toast-action"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close message"
          className="text-[#BDB1A0] hover:text-white shrink-0 mt-0.5 cursor-pointer bg-transparent border-0 p-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
