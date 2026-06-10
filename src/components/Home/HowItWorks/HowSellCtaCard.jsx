import React from "react";

const HowSellCtaCard = ({ data }) => {
  return (
    <article className="desk-how-sell-cta">
      <h3 className="desk-how-sell-cta-title">
        The hours of <em>craftsmanship</em> on that piece
        deserve more than a dark wardrobe shelf.
      </h3>

      <p className="desk-how-sell-cta-body">
        Give your occasion wear another life. Let someone
        else fall in love with it — and earn while you do.
      </p>

      <p className="desk-how-sell-cta-quote">
        "Every piece has a story. Don't let it end with you."
      </p>

      <button className="btn-primary">
        List Your Piece →
      </button>
    </article>
  );
};

export default HowSellCtaCard;