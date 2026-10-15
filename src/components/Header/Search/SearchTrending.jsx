import {
  trendingSearches,
} from "../../../data/searchData";
import "../../../styles/Header/Search/search-overlay.css";

const SearchTrending = ({
  doSearch,
}) => {
  return (
    <div className="search-body">
      <span className="search-section-label">
        TRENDING NOW
      </span>

      <div className="trending-pills">
        {trendingSearches.map(
          (item) => (
            <button
              key={item}
              className="trending-pill"
              onClick={() =>
                doSearch(item)
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