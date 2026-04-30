import React, { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import '../../../styles/cart/ui/remove-dialog.css'
const RemoveDialog = ({ open, onClose, onConfirm, onWishlist, item }) => {


  const primaryBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Track last focused element BEFORE open
  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement;
    }
  }, [open]);

  // Focus primary CTA on open
  useEffect(() => {
    if (open && primaryBtnRef.current) {
      primaryBtnRef.current.focus();
    }
  }, [open]);

  // Restore focus on close:

  useEffect(() => {
  return () => {
    if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  };
}, []);


  // 🔒 Scroll lock (SPEC)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ⌨️ ESC KEY (SPEC)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="remove-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-heading"
    >

      {/* PANEL */}
      <div
        className="remove-dialog"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE BUTTON */}
        <button
          className="remove-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* ITEM PREVIEW STRIP */}
        <div className="remove-preview">

          <div className="remove-thumb">
            <img src={item?.product?.images?.[0]} alt="" />
          </div>

          <div className="remove-info">
            <div className="remove-brand">
              {item?.product?.designer}
            </div>
            <div className="remove-name">
              {item?.product?.title}
            </div>
          </div>

        </div>

        {/* TEXT */}
        <h2 id="dialog-heading" className="remove-title">
          Remove this Piece?
        </h2>

        <p className="remove-desc">
          You can move it to your wishlist instead and keep it saved for later.
        </p>

        {/* CTA */}
        <div className="remove-actions">

          {/* PRIMARY */}
          <button  ref={primaryBtnRef} className="dialog-btn-primary"
          onClick={onWishlist}>

            <Heart size={13} strokeWidth={1.5} />
            Add to Wishlist
          </button>

          {/* SECONDARY */}
          <button className="dialog-btn-secondary" onClick={onConfirm}>
            Remove from Cart
          </button>

        </div>

      </div>
    </div>
  );
};

export default RemoveDialog;