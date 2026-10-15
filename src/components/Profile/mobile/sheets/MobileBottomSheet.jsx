import { useEffect } from "react";

import { X } from "lucide-react";

import "../../../../styles/Profile/mobile/sheets/MobileBottomSheet.css";

const MobileBottomSheet = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  /* =========================================
     Lock Body Scroll
     ========================================= */

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isOpen]);

  /* =========================================
     Escape Key Support
     ========================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  /* =========================================
     Guard
     ========================================= */

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* =====================================
          Backdrop
         ===================================== */}

      <div
        className="profile-mobile-sheet-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* =====================================
          Bottom Sheet
         ===================================== */}

      <section
        className="profile-mobile-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* =================================
            Sticky Header
           ================================= */}

        <header className="profile-mobile-sheet-header">
          <div className="profile-mobile-sheet-title">
            {title}
          </div>

          <button
            type="button"
            className="profile-mobile-sheet-close"
            onClick={onClose}
            aria-label="Close sheet"
          >
            <X
              className="profile-mobile-sheet-close-icon"
            />
          </button>
        </header>

        {/* =================================
            Sheet Body
           ================================= */}

        <div className="profile-mobile-sheet-body">
          {children}
        </div>
      </section>
    </>
  );
};

export default MobileBottomSheet;