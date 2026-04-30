import React, { useState } from "react";
import "../../../styles/cart/ui/promo-code.css";
import { PROMO_CODES } from "../../../utils/cart/promo";
import GoldParticles from "./GoldParticles";

const PromoCode = ({ onApply }) => {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);

  const handleApply = () => {
    const promo = PROMO_CODES[code];

    if (!promo) {
      setError("This code is not valid. Try KAIRA10 or NEWUSER.");
      setApplied(null);
      return;
    }

    const appliedData = { code, ...promo };

    setApplied(appliedData);
    onApply(appliedData); // 🔥 important
    setError("");

    // 🔥 trigger animation
    setCelebrate(true);

    // reset after animation
    setTimeout(() => setCelebrate(false), 2000);
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    onApply(null); // 🔥 reset
  };

  return (
    <div className="promo-wrapper">

      {/* Separator (SPEC) */}
      {/* <div className="items-end-sep"></div> */}

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
            if (error) setError("");   // ✅ FIX 2 also here
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


      {/* Feedback */}
      {(applied || error) && (
        <div className={`promo-feedback 
  ${applied ? "success show" : ""} 
  ${error ? "error show" : ""}`}
        >
          {applied
            ? `${applied.code} applied — ${applied.label}`
            : error}
        </div>
      )}

      <GoldParticles trigger={celebrate} />

    </div>
  );
};

export default PromoCode;