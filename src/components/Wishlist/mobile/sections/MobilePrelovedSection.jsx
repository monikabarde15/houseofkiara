import MobileSectionHeader from './MobileSectionHeader';
import MobileWishlistCard from '../cards/MobileWishlistCard';
import { wishlistItems } from '../../data/wishlistData';
import '../../../../styles/wishlist/mobile/sections/mobile-preloved-section.css';

const MobilePrelovedSection = ({ viewMode, showToast,onRemoveCard }) => {
  const prelovedItems = wishlistItems.preloved;
  const pieceCount = prelovedItems.length;

  if (pieceCount === 0) return null;

  return (
    <div className="wishlist-mobile-preloved-section">
      <MobileSectionHeader mode="preloved" pieceCount={pieceCount} />
      
      <div className="wishlist-mobile-preloved-section__cards">
        {prelovedItems.map((item, index) => (
          <MobileWishlistCard 
            key={item.id} 
            item={item} 
            mode="preloved" 
            index={index}
            showToast={showToast}
            onRemoveCard={onRemoveCard}
          />
        ))}
      </div>
    </div>
  );
};

export default MobilePrelovedSection;