import { useState, useRef } from "react";
import UndoToast from "../toast/UndoToast";
import WishlistToast from "../toast/WishlistToast";
import "../../../styles/wishlist/sections/wishlist-grid.css";
import WishlistGridCard from "../cards/WishlistGridCard";
import WishlistListCard from "../cards/WishlistListCard";
import EmptyWishlistState from "./EmptyWishlistState";

const WishlistGrid = ({ viewMode, type, products, onRemoveCard, onOpenModal }) => {
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [showGeneralToast, setShowGeneralToast] = useState(false);
  const [generalToastMessage, setGeneralToastMessage] = useState("");
  const [restoredCardId, setRestoredCardId] = useState(null);
  const gridContainerRef = useRef(null);

  const handleCardRemove = (productId, productData) => {
    // setShowUndoToast(true);
    onRemoveCard(productId, productData);
  };

  const handleUndo = () => {
    setShowUndoToast(false);
  };

  const showGeneralToastMessage = (message) => {
    setGeneralToastMessage(message);
    setShowGeneralToast(true);
    setTimeout(() => {
      setShowGeneralToast(false);
    }, 3000);
  };

  if (!products || products.length === 0) {
    return <EmptyWishlistState />;
  }

  return (
    <>
      <div ref={gridContainerRef} className={`desk-wishlist-grid-${viewMode}`}>
        {products.map((product, index) => {
          const isRestored = restoredCardId === product.id;
          
          if (viewMode === "grid") {
            return (
              <WishlistGridCard
                key={product.id}
                product={product}
                type={type}
                index={index}
                onRemove={handleCardRemove}
                onShowToast={() => setShowUndoToast(true)}
                onShowGeneralToast={showGeneralToastMessage}
                onOpenModal={onOpenModal}
                isRestored={isRestored}
              />
            );
          }
          return (
            <WishlistListCard
              key={product.id}
              product={product}
              type={type}
              index={index}
              onRemove={handleCardRemove}
              onShowToast={() => setShowUndoToast(true)}
              onShowGeneralToast={showGeneralToastMessage}
              onOpenModal={onOpenModal}
              isRestored={isRestored}
            />
          );
        })}
      </div>

      {showUndoToast && (
        <UndoToast
          onUndo={handleUndo}
          onClose={() => setShowUndoToast(false)}
        />
      )}
      
      {showGeneralToast && (
        <WishlistToast
          message={generalToastMessage}
          onClose={() => setShowGeneralToast(false)}
        />
      )}
    </>
  );
};

export default WishlistGrid;