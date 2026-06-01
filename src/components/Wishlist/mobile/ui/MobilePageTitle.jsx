import '../../../../styles/wishlist/mobile/ui/mobile-page-title.css';

const MobilePageTitle = ({
  savedCount,
  designersCount,
  toRentCount,
}) => {
  return (
    <section className="wishlist-mobile-page-title">

      {/* 3.1 Heading */}
      <h1 className="wishlist-mobile-page-title__heading">
        <span className="wishlist-mobile-page-title__normal">
          My
        </span>{' '}
        <span className="wishlist-mobile-page-title__italic">
          Wishlist
        </span>
      </h1>

      {/* 3.2 Subheading */}
      <p className="wishlist-mobile-page-title__subheading">
        Every piece you've set aside — waiting for the right occasion.
      </p>

      {/* 3.3 Stats Row */}
      <div className="wishlist-mobile-stats-row">

        <div className="wishlist-mobile-stats-row__stat">
          <div className="wishlist-mobile-stats-row__number">
            {savedCount}
          </div>
          <div className="wishlist-mobile-stats-row__label">
            Saved
          </div>
        </div>

        <div className="wishlist-mobile-stats-row__divider" />

        <div className="wishlist-mobile-stats-row__stat">
          <div className="wishlist-mobile-stats-row__number">
            {designersCount}
          </div>
          <div className="wishlist-mobile-stats-row__label">
            Designers
          </div>
        </div>

        <div className="wishlist-mobile-stats-row__divider" />

        <div className="wishlist-mobile-stats-row__stat">
          <div className="wishlist-mobile-stats-row__number">
            {toRentCount}
          </div>
          <div className="wishlist-mobile-stats-row__label">
            To Rent
          </div>
        </div>

      </div>

    </section>
  );
};

export default MobilePageTitle;