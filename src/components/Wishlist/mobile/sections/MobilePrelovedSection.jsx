import MobileSectionHeader from './MobileSectionHeader';
import MobileWishlistCard from '../cards/MobileWishlistCard';
import '../../../../styles/wishlist/mobile/sections/mobile-preloved-section.css';

const MobilePrelovedSection = ({ viewMode, showToast, products, onRemoveCard, onOpenAddToBagSheet }) => {
  const pieceCount = products.length;

  if (pieceCount === 0) return null;

  return (
    <div className="wishlist-mobile-preloved-section">
      <MobileSectionHeader mode="preloved" pieceCount={pieceCount} />
      
      <div className="wishlist-mobile-preloved-section__cards">
        {products.map((item, index) => (
          <MobileWishlistCard 
            key={item.id} 
            item={item} 
            mode="preloved" 
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

export default MobilePrelovedSection;