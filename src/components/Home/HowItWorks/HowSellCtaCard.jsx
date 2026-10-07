import React from "react";
import { useNavigate } from "react-router-dom";
import { renderHeadline } from "../../../utils/headlineParser";

const HowSellCtaCard = ({ data }) => {
  const navigate = useNavigate();

  const headText =
    data?.head ||
    data?.text ||
    "The hours of *craftsmanship* on that piece deserve more than a dark wardrobe shelf.";
  const bodyText =
    data?.body ||
    "Give your occasion wear another life. Let someone else fall in love with it — and earn while you do.";
  const quoteText =
    data?.quote || '"Every piece has a story. Don\'t let it end with you."';
  const ctaLabel =
    data?.cta?.lbl ||
    (data?.buttonText ? `${data.buttonText} →` : "List Your Piece →");
  const ctaUrl = data?.cta?.url || "/list-your-piece";

  const handleListYourPiece = () => {
    navigate(ctaUrl);
  };

  return (
    <article className="desk-how-sell-cta">
      <h3 className="desk-how-sell-cta-title">
        {renderHeadline(headText, "em")}
      </h3>

      <p className="desk-how-sell-cta-body">{bodyText}</p>

      <p className="desk-how-sell-cta-quote">{quoteText}</p>

      <button className="btn-primary" onClick={handleListYourPiece}>
        {ctaLabel}
      </button>
    </article>
  );
};

export default HowSellCtaCard;
