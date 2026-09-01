import { recommendationItems } from '../../data/recommendationData';
import MobileRecommendationCard from './MobileRecommendationCard';
import '../../../../styles/wishlist/mobile/sections/mobile-recommendations.css';

const MobileRecommendations = ({ showToast }) => {
  const handleExploreClick = () => {
    showToast('Opening collection browse page');
  };

  const handleAddToWishlist = (message) => {
    showToast(message);
  };

  const handleCardTap = (item) => {
    showToast(`Opening ${item.name}`);
  };

  return (
    <div className="wishlist-mobile-recommendations">
      {/* Section 12.1: Section Header */}
      <div className="wishlist-mobile-recommendations__header">
        <div className="wishlist-mobile-recommendations__header-left">
          <div className="wishlist-mobile-recommendations__eyebrow">BECAUSE YOU SAVED THESE</div>
          <h3 className="wishlist-mobile-recommendations__title">
            You may also <span className="wishlist-mobile-recommendations__title-italic">love</span>
          </h3>
        </div>
        <button 
          className="wishlist-mobile-recommendations__explore"
          onClick={handleExploreClick}
        >
          EXPLORE MORE →
        </button>
      </div>
      
      {/* Section 12.2: Recommendation Cards Scroll */}
      <div className="wishlist-mobile-recommendations__scroll">
        <div className="wishlist-mobile-recommendations__cards">
          {recommendationItems.map((item) => (
            <MobileRecommendationCard 
              key={item.id}
              item={item}
              onAddToWishlist={handleAddToWishlist}
              onCardTap={handleCardTap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileRecommendations;