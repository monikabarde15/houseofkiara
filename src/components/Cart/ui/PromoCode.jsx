import React, { useState, useRef } from "react";
import "../../../styles/cart/ui/promo-code.css";
import { PROMO_CODES } from "../../../utils/cart/promo";
import GoldParticles from "./GoldParticles";

const PromoCode = ({ onApply }) => {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const feedbackRef = useRef(null); // Add ref for anchor element

  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code) return;
    setLoading(true);
    setError("");
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/promotions/${code}`);
      const data = await res.json();
      
      if (!data.success || !data.data) {
        setError("This code is not valid or has expired.");
        setApplied(null);
        return;
      }

      // Check if it's inactive (admin might have toggled it off)
      if (data.data.status === "Inactive") {
        setError("This code is currently inactive.");
        setApplied(null);
        return;
      }

      const promo = data.data;
      const appliedData = { code: promo.code, type: promo.type, value: promo.value, label: promo.reason };

      setApplied(appliedData);
      onApply(appliedData);
      setError("");

      // Delay animation to ensure feedback element is rendered
      setTimeout(() => {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 2000);
      }, 50);
    } catch (err) {
      setError("Error validating promo code. Please try again.");
      setApplied(null);
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
        >
          {loading ? "..." : "APPLY"}
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

      {/*  GoldParticles */}
      <GoldParticles trigger={celebrate} anchorElement={feedbackRef.current} />
    </div>
  );
};

export default PromoCode;