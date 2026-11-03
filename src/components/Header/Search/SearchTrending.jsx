import {
  trendingSearches as defaultTrendingSearches,
} from "../../../data/searchData";
import "../../../styles/Header/Search/search-overlay.css";

const SearchTrending = ({
  trendingItems,
  doSearch,
  setQuery,
  runSearch,
}) => {
  const pills =
    Array.isArray(trendingItems) && trendingItems.length > 0
      ? trendingItems
      : defaultTrendingSearches;

  const handleSelect = (item) => {
    if (typeof doSearch === "function") {
      doSearch(item);
      return;
    }
    if (typeof setQuery === "function") {
      setQuery(item);
    }
    if (typeof runSearch === "function") {
      runSearch(item);
    }
  };

  return (
    <div className="search-body">
      <span className="search-section-label">
        TRENDING NOW
      </span>

      <div className="trending-pills">
        {pills.map(
          (item) => (
            <button
              key={item}
              className="trending-pill"
              onClick={() =>
                handleSelect(item)
              }
            >
              {item}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SearchTrending;
