import React from "react";
import "../../../styles/maincategorypage/mobile/mobile-footer.css";

const MobileFooter = () => {
  return (
    <footer className="mob-footer">
      
      {/* Brand Line */}
      <div className="mob-footer__brand">
        House of Kaira — Circular Luxury Fashion
      </div>

      {/* Links Container */}
      <div className="mob-footer__links">
        <a href="#" onClick={(e) => { e.preventDefault(); console.log("Navigate to Rent"); }}>
          Rent
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); console.log("Navigate to Preloved"); }}>
          Preloved
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); console.log("Navigate to Buy New"); }}>
          Buy New
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); console.log("Navigate to List Your Piece"); }}>
          List Your Piece
        </a>
      </div>

      {/* Copyright */}
      <div className="mob-footer__copy">
        © 2024 House of Kaira. All rights reserved.
      </div>

    </footer>
  );
};

export default MobileFooter;