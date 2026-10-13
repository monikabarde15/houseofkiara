import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import WishlistCard from "../cards/WishlistCard";
import AddToBagModal from "../../Wishlist/modal/AddToBagModal";
import "../../../styles/Profile/right/ViewWishlist.css";
import { useWishlistProducts } from "../../Wishlist/hooks/useWishlistProducts";
import useCartStore from "../../../store/cartStore";
import { makeProductDetail } from "../../ProductList";

const ViewWishlist = ({ onBack }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPieceType, setSelectedPieceType] = useState("rent");

  const { products, removeProduct } = useWishlistProducts();
  const savedPieces = products || [];

  const handleAddToBag = (piece) => {
    if (!piece) return;
    const isRental =
      piece.condition === "Rental" ||
      piece.mode === "Rental" ||
      piece.originalData?.rent;
    const isPreloved =
      piece.condition === "Preloved" || piece.originalData?.preloved;
    const type = isRental ? "rent" : isPreloved ? "preloved" : "new";

    setSelectedPiece(piece);
    setSelectedPieceType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleConfirmAddToBag = (details) => {
    const rawProduct =
      details.product?.originalData ||
      details.product ||
      selectedPiece?.originalData ||
      selectedPiece;
    const isRental =
      selectedPieceType === "rent" || details.product?.condition === "Rental";
    const normalizedType = isRental
      ? "rental"
      : selectedPieceType === "preloved"
        ? "preloved"
        : "buy";

    useCartStore.getState().addToCart(rawProduct, {
      type: normalizedType,
      size:
        details.size ||
        (rawProduct.sizes && rawProduct.sizes[0]) ||
        "Default",
      rentalDates:
        details.startDate && details.endDate
          ? { start: details.startDate, end: details.endDate }
          : null,
      price:
        details.product?.price ||
        selectedPiece?.price ||
        rawProduct.buyPrice ||
        rawProduct.rentPrice ||
        0,
    });

    toast.success(`${selectedPiece?.name || "Item"} added to your bag!`);
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleViewProduct = (id, piece) => {
    const targetPiece =
      piece || savedPieces.find((p) => String(p.id) === String(id));
    const item = targetPiece?.originalData || targetPiece;
    if (!item) return;

    const productId = targetPiece?.id || item._id || item.id || id;
    const productData = makeProductDetail ? makeProductDetail(item) : item;

    const rent =
      item.rent ||
      targetPiece?.condition === "Rental" ||
      targetPiece?.mode === "Rental";
    const preloved =
      item.preloved ||
      targetPiece?.condition === "Preloved" ||
      targetPiece?.mode === "Preloved";
    const isNew =
      item.isNew ||
      targetPiece?.condition === "New" ||
      targetPiece?.mode === "Buy New" ||
      targetPiece?.mode === "New";

    let path = `/onlyrental/${productId}`;
    if (rent && preloved && isNew) {
      path = `/all-modes/${productId}`;
    } else if (rent && preloved) {
      path = `/rentalandpreloved/${productId}`;
    } else if (rent && isNew) {
      path = `/rentalandbuy/${productId}`;
    } else if (rent) {
      path = `/onlyrental/${productId}`;
    } else if (preloved) {
      path = `/preloved/${productId}`;
    } else {
      path = `/buynew/${productId}`;
    }

    navigate(path, { state: { product: productData } });
  };

  const handleRemoveItem = (id) => {
    removeProduct(id);
    toast.success("Item removed from your saved pieces");
  };

  return (
    <>
      <div className="profile-fv-wishlist">
        <div className="profile-fv-wishlist-bar">
          <button className="profile-fv-wishlist-back" onClick={onBack}>
            <ChevronLeft size={14} strokeWidth={1.5} />
            Back to overview
          </button>
          <div className="profile-fv-wishlist-bar-title">Saved Pieces</div>
          <div className="profile-fv-wishlist-bar-count">
            {savedPieces.length} saved
          </div>
        </div>

        <div className="profile-fv-wishlist-grid">
          {savedPieces.map((piece) => (
            <WishlistCard
              key={piece.id}
              piece={piece}
              onAddToBag={handleAddToBag}
              onViewProduct={handleViewProduct}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      </div>

      <AddToBagModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedPiece}
        type={selectedPieceType}
        onAddToBag={handleConfirmAddToBag}
      />
    </>
  );
};

export default ViewWishlist;
