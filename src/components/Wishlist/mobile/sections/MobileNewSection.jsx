import MobileSectionHeader from './MobileSectionHeader';
import MobileWishlistCard from '../cards/MobileWishlistCard';
import '../../../../styles/wishlist/mobile/sections/mobile-new-section.css';

const MobileNewSection = ({ viewMode, showToast, products, onRemoveCard, onOpenAddToBagSheet }) => {
  const pieceCount = products.length;

  if (pieceCount === 0) return null;

  return (
    <div className="wishlist-mobile-new-section">
      <MobileSectionHeader mode="new" pieceCount={pieceCount} />
      
      <div className="wishlist-mobile-new-section__cards">
        {products.map((item, index) => (
          <MobileWishlistCard 
            key={item.id} 
            item={item} 
            mode="new" 
            index={index}
            showToast={showToast}
            onRemoveCard={onRemoveCard}
            onOpenAddToBagSheet={onOpenAddToBagSheet}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileNewSection;