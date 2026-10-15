import { useRef, useState } from "react";
import ListImageArea from "./list/ListImageArea";
import ListMainColumn from "./list/ListMainColumn";
import ListAsideColumn from "./list/ListAsideColumn";
import "../../../styles/wishlist/cards/list/list-card.css";

const WishlistListCard = ({ product, type, onRemove, onOpenModal, isRestored }) => {  // Remove onShowToast
  const cardRef = useRef(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

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

      setTimeout(() => {
        if (onRemove) onRemove(product.id, product);
      }, 350);
    }, 280);
  };

  return (
    <div
      ref={cardRef}
      className={`desk-wishlist-list-card
        ${isRemoving ? "desk-wishlist-card-removing" : ""}
        ${isCollapsing ? "desk-wishlist-card-collapsing" : ""}
        ${isRestored ? "desk-wishlist-card-restore" : ""}
      `}
      data-mode={type}
      data-designer={product.designer}
    >
      <ListImageArea 
        product={product}
        type={type}
        onRemove={handleRemove}
      />
      <ListMainColumn 
        product={product}
        type={type}
        onRemove={handleRemove}
      />
      <ListAsideColumn 
        product={product}
        type={type}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};

export default WishlistListCard;