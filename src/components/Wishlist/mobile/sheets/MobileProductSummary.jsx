import '../../../../styles/wishlist/mobile/sheets/mobile-product-summary.css';

const MobileProductSummary = ({ item, mode }) => {
  // Get background color for product image
  const getImageBg = () => {
    switch (mode) {
      case 'rent':
        return '#242019';
      case 'preloved':
        return '#FAF7F2';
      case 'new':
        return '#EDEBE4';
      default:
        return '#FAF7F2';
    }
  };

  // Get SVG stroke color
  const getSvgStroke = () => {
    switch (mode) {
      case 'rent':
        return 'rgba(201, 169, 110, 0.22)';
      case 'preloved':
        return 'rgba(201, 169, 110, 0.16)';
      case 'new':
        return 'rgba(107, 126, 90, 0.20)';
      default:
        return 'rgba(201, 169, 110, 0.22)';
    }
  };

  const getPriceText = () => {
    return `₹${item.price.toLocaleString('en-IN')}`;
  };

  const getMetaText = () => {
    if (mode === 'rent') {
      return `${item.designer} - ${getPriceText()} / ${item.rentalDuration}`;
    }
    return `${item.designer} - ${getPriceText()}`;
  };

  const imgUrl =
    item?.image ||
    (Array.isArray(item?.images) && item.images[0]) ||
    (Array.isArray(item?.photos) && item.photos[0]) ||
    item?.originalData?.image ||
    (Array.isArray(item?.originalData?.images) && item.originalData.images[0]) ||
    "";

  return (
    <div className="wishlist-mobile-product-summary">
      {/* Product image */}
      <div 
        className="wishlist-mobile-product-summary__image"
        style={{ backgroundColor: getImageBg(), overflow: "hidden" }}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <svg className="wishlist-mobile-product-summary__garment" viewBox="0 0 28 36" fill="none">
            <path d="M7 9L14 4L21 9L23 15L21 22L14 32L7 22L5 15L7 9Z" 
              stroke={getSvgStroke()} 
              strokeWidth="0.65" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"/>
            <path d="M14 4V32" stroke={getSvgStroke()} strokeWidth="0.65" strokeLinecap="round" fill="none"/>
          </svg>
        )}
      </div>
      
      {/* Product info */}
      <div className="wishlist-mobile-product-summary__info">
        <div className="wishlist-mobile-product-summary__name">{item.name}</div>
        <div className="wishlist-mobile-product-summary__meta">{getMetaText()}</div>
      </div>
    </div>
  );
};

export default MobileProductSummary;