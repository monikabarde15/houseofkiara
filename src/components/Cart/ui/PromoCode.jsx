import React, { useState, useRef, useEffect } from "react";
import "../../../styles/cart/ui/promo-code.css";
import { PROMO_CODES } from "../../../utils/cart/promo";
import GoldParticles from "./GoldParticles";
import useAuthStore from "../../../store/authStore";

const PromoCode = ({ onApply, subtotal = 0 }) => {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [availableOffers, setAvailableOffers] = useState([]);
  const feedbackRef = useRef(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    const userEmail = (user.email || "").toLowerCase().trim();
    const userPhone = (user.phone || "").replace(/\D/g, "");
    const userCustId = (user.customerId || user.id || user._id || "")
      .toLowerCase()
      .trim();

    fetch("/api/promotions")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const userPromos = res.data.filter((p) => {
            if (p.status !== "Active") return false;
            if (Array.isArray(p.customerIds) && p.customerIds.length > 0) {
              return p.customerIds.some((cid) => {
                const c = String(cid).toLowerCase().trim();
                const cDigits = String(cid).replace(/\D/g, "");
                return (
                  (userEmail && c === userEmail) ||
                  (userCustId && c === userCustId) ||
                  (userPhone &&
                    cDigits &&
                    cDigits.endsWith(userPhone.slice(-10)))
                );
              });
            }
            return false;
          });
          setAvailableOffers(userPromos);
        }
      })
      .catch(() => {});
  }, [user]);

  const applySpecificCode = async (codeToApply) => {
    const trimmed = (codeToApply || "").trim().toUpperCase();
    if (!trimmed) return;
    setCode(trimmed);

    let promoData = null;

    try {
      const res = await fetch(`/api/promotions/${encodeURIComponent(trimmed)}`);
      const data = await res.json().catch(() => ({}));
      if (data.success && data.data && data.data.status === "Active") {
        promoData = data.data;
      }
    } catch (e) {}

    if (!promoData) {
      const localPromo = PROMO_CODES[trimmed];
      if (localPromo) {
        promoData = { code: trimmed, ...localPromo };
      }
    }

    if (!promoData) {
      setError("This code is not valid.");
      setApplied(null);
      onApply(null);
      return;
    }

    const minReq = Number(promoData.minOrder) || 0;
    const numSubtotal = Number(subtotal) || 0;
    if (minReq > 0 && numSubtotal > 0 && numSubtotal < minReq) {
      setError(`Minimum order of ₹${minReq.toLocaleString("en-IN")} required for ${promoData.code}.`);
      setApplied(null);
      onApply(null);
      return;
    }

    const discountAmount =
      promoData.type === "percent" || promoData.type === "percentage"
        ? Math.round((numSubtotal * Number(promoData.value || 0)) / 100)
        : Number(promoData.value || 0);

    const appliedData = {
      code: promoData.code,
      type: promoData.type,
      value: Number(promoData.value),
      maxDiscount: promoData.maxDiscount ? Number(promoData.maxDiscount) : null,
      minOrder: promoData.minOrder ? Number(promoData.minOrder) : null,
      label:
        promoData.publicDesc ||
        promoData.reason ||
        (discountAmount > 0
          ? `${promoData.value}${promoData.type === "percent" ? "%" : " OFF"} (Save ₹${discountAmount.toLocaleString("en-IN")})`
          : `${promoData.value}${promoData.type === "percent" ? "%" : " OFF"}`),
    };

    setApplied(appliedData);
    onApply(appliedData);
    setError("");
    setTimeout(() => {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2000);
    }, 50);
  };

  const handleApply = async () => {
    applySpecificCode(code);
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    onApply(null);
  };

  return (
    <div className="promo-wrapper">
      <div className="promo-zone">
        {/* Label */}
        <div className="promo-label">
          Promo code
        </div>

        {/* Input */}
        <input
          className={`promo-input 
    ${applied ? "success" : ""} 
    ${error ? "error" : ""}`}
          placeholder="Enter code "
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !applied) {
              handleApply();
            }
          }}
          disabled={!!applied}
        />

        {/* Button */}
        <button
          className="promo-btn apply-btn"
          onClick={handleApply}
          style={{ display: applied ? "none" : "block" }}
        >
          APPLY
        </button>

        <button
          className="promo-btn remove-btn"
          onClick={handleRemove}
          style={{ display: applied ? "block" : "none" }}
        >
          REMOVE
        </button>
      </div>

      {/* Feedback with ref */}
      {(applied || error) && (
        <div
          ref={feedbackRef}
          className={`promo-feedback 
  ${applied ? "success show" : ""} 
  ${error ? "error show" : ""}`}
        >
          {applied
            ? `${applied.code} applied — ${applied.label}`
            : error}
        </div>
      )}

      {/* Available User Offers Banner */}
      {availableOffers.length > 0 && !applied && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 12px",
            background: "#fdfbf7",
            border: "1px dashed #c8aa68",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#8a6e30",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>🏷️ Special Negotiated Offer for You</span>
          </div>
          {availableOffers.map((promo) => (
            <div
              key={promo.code}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
                background: "#ffffff",
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ebdcc1",
              }}
            >
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: "700",
                    fontSize: "12px",
                    color: "#2b261f",
                  }}
                >
                  {promo.code}
                </span>
                <div style={{ fontSize: "11px", color: "#736b5e" }}>
                  {promo.publicDesc || promo.reason || `₹${promo.value} OFF`}
                </div>
              </div>
              <button
                type="button"
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#8a6e30",
                  background: "#fbf6eb",
                  border: "1px solid #d9c49a",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                onClick={() => applySpecificCode(promo.code)}
              >
                APPLY
              </button>
            </div>
          ))}
        </div>
      )}

      {/*  GoldParticles */}
      <GoldParticles trigger={celebrate} anchorElement={feedbackRef.current} />
    </div>
  );
};

export default PromoCode;