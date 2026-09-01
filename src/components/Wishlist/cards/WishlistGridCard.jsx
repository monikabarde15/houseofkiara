import { useRef, useState } from "react";
import GridImageArea from "./grid/GridImageArea";
import GridCardBody from "./grid/GridCardBody";
import "../../../styles/wishlist/cards/grid/grid-card.css";

const WishlistGridCard = ({ product, type, index, onRemove, onOpenModal, isRestored }) => {  // Remove onShowToast
  const cardRef = useRef(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const staggerDelays = [0.04, 0.10, 0.16, 0.22, 0.28, 0.34, 0.40, 0.46];
  const animationDelay = index < 8 ? `${staggerDelays[index]}s` : "0s";

  const handleRemove = () => {
    setIsRemoving(true);

    setTimeout(() => {
      if (!cardRef.current) return;
      const height = cardRef.current.offsetHeight;
      cardRef.current.style.maxHeight = `${height}px`;
      cardRef.current.offsetHeight;
      setIsCollapsing(true);
      cardRef.current.style.maxHeight = "0";
      cardRef.current.style.paddingTop = "0";
      cardRef.current.style.paddingBottom = "0";
      cardRef.current.style.marginTop = "0";
      cardRef.current.style.marginBottom = "0";
    }, 280);

    setTimeout(() => {
      if (onRemove) onRemove(product.id, product);
    }, 710);
  };

  return (
    <div
      ref={cardRef}
      className={`desk-wishlist-grid-card
        ${isRemoving ? "desk-wishlist-card-removing" : ""}
        ${isCollapsing ? "desk-wishlist-card-collapsing" : ""}
        ${isRestored ? "desk-wishlist-card-restore" : ""}
      `}
      data-mode={type}
      data-designer={product.designer}
      style={{ animationDelay }}
    >
      <GridImageArea 
        product={product}
        type={type}
        onRemove={handleRemove}
        onOpenModal={onOpenModal}
      />
      <GridCardBody 
        product={product}
        type={type}
        onRemove={handleRemove}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};

export default WishlistGridCard;