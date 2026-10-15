import "../../../styles/Header/Search/search-overlay.css";

const SearchResultCard = ({ item }) => {
  return (
    <article
      className="search-result-card"
      role="button"
      tabIndex={0}
    >
      <div className="search-result-image">
        <span
          className={`search-result-badge ${
            item.mode === "Rent"
              ? "badge-rent"
              : item.mode === "Preloved"
              ? "badge-preloved"
              : "badge-new"
          }`}
        >
          {item.mode}
        </span>

        <div
          className={`search-result-image-inner ${
            item.imageClass || "ci-a"
          }`}
        />
      </div>

      <div className="search-result-content">
        <span className="search-result-designer">
          {item.designer}
        </span>

        <h4 className="search-result-name">
          {item.label}
        </h4>

        <div className="search-result-price">
          {item.price}
        </div>
      </div>
    </article>
  );
};

export default SearchResultCard;