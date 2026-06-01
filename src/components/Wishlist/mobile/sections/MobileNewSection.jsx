import MobileSectionHeader from './MobileSectionHeader';
import MobileWishlistCard from '../cards/MobileWishlistCard';
import { wishlistItems } from '../../data/wishlistData';
import '../../../../styles/wishlist/mobile/sections/mobile-new-section.css';

const MobileNewSection = ({ viewMode, showToast,onRemoveCard  }) => {
  const newItems = wishlistItems.new;
  const pieceCount = newItems.length;

  if (pieceCount === 0) return null;

  return (
    <div className="wishlist-mobile-new-section">
      <MobileSectionHeader mode="new" pieceCount={pieceCount} />
      
      <div className="wishlist-mobile-new-section__cards">
        {newItems.map((item, index) => (
          <MobileWishlistCard 
            key={item.id} 
            item={item} 
            mode="new" 
            index={index}
            showToast={showToast}
            onRemoveCard={onRemoveCard}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileNewSection;