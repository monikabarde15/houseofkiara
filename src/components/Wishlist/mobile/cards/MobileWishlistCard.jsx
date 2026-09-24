import { useRef, useState } from 'react';
import MobileWishlistImageArea from './MobileWishlistImageArea';
import MobileWishlistCardBody from './MobileWishlistCardBody';
import '../../../../styles/wishlist/mobile/cards/mobile-wishlist-card.css';
import { useNavigate } from 'react-router-dom';
import { makeProductDetail } from '../../../ProductList';

const MobileWishlistCard = ({ item, mode, index, showToast, onRemoveCard, onOpenAddToBagSheet }) => {
  const cardRef = useRef(null);
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Section 6: Card entry animation with staggered delays
  const getAnimationDelay = () => {
    const delays = [0.04, 0.09, 0.14, 0.19, 0.24, 0.29, 0.34];
    if (index < 7) {
      return `${delays[index]}s`;
    }
    return '0s';
  };

  const navigate = useNavigate();

  const handleCardTap = (e) => {
    // Don't navigate if the click target is a button or link
    if (e.target.closest('button')) return;
    
    const originalItem = item.originalData;
    if (!originalItem) return;

    const productId = item.id;
    const productData = makeProductDetail(originalItem);
    
    const { rent, preloved, isNew } = originalItem;

    if (rent && preloved) {
        navigate(`/rentalandpreloved/${productId}`, { state: { product: productData } });
    }
    else if (rent && isNew) {
        navigate(`/rentalandbuy/${productId}`, { state: { product: productData } });
    }
    else if (rent) {
        navigate(`/onlyrental/${productId}`, { state: { product: productData } });
    }
    else if (preloved) {
        navigate(`/preloved/${productId}`, { state: { product: productData } });
    }
    else {
        navigate(`/buynew/${productId}`, { state: { product: productData } });
    }
  };

  // Section 7.1: Handle remove from wishlist
  const handleRemove = () => {
    if (isRemoving) return;
    setIsRemoving(true);
    if (cardRef.current) {
      onRemoveCard?.(item, cardRef.current);
    }
  };

  const handleOpenAddToBagSheet = () => {
    onOpenAddToBagSheet?.(item, mode);
  };

  return (
    <div 
      ref={cardRef}
      className="wishlist-mobile-card"
      data-mode={mode}
      data-designer={item.designer}
      style={{
        animationDelay: getAnimationDelay(),
        animationFillMode: 'both'
      }}
      onClick={handleCardTap}
    >
      <MobileWishlistImageArea 
        item={item} 
        mode={mode} 
        showToast={showToast}
        onRemove={handleRemove}
      />
      <MobileWishlistCardBody 
        item={item} 
        mode={mode} 
        showToast={showToast}
        onRemove={handleRemove}
        onOpenAddToBagSheet={handleOpenAddToBagSheet}
      />
    </div>
  );
};

export default MobileWishlistCard;