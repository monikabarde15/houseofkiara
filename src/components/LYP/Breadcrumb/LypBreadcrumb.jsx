import React from "react";
import "../../../styles/LYP/breadcrumb.css";

const LypBreadcrumb = () => {
  return (
    <div className="lyp-breadcrumb">
      <div className="lyp-breadcrumb-inner">
        
        <a href="/" data-route="homepage" className="crumb-link">
          Home
        </a>

        <span className="crumb-separator">›</span>

        <a href="/sell" data-route="sell-with-us" className="crumb-link">
          Sell with Us
        </a>

        <span className="crumb-separator">›</span>

        <span className="crumb-current">
          List Your Piece
        </span>

      </div>
    </div>
  );
};

export default LypBreadcrumb;