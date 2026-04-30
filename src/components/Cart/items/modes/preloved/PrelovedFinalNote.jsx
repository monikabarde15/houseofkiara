import React from "react";
import "../../../../../styles/cart/items/disclosure-notice.css";


const PrelovedFinalNote = ({ product }) => {
  const note = product?.preloved?.finalSaleNote;

  if (!note) return null;

  return (
    <div className="preloved-final-note">

      <span className="preloved-final-note__label">
        Final sale.
      </span>

      <span className="preloved-final-note__body">
        {note}
      </span>

    </div>
  );
};

export default PrelovedFinalNote;