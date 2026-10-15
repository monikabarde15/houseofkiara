import SearchResultCard from "./SearchResultCard";
import "../../../styles/Header/Search/search-overlay.css";

const SearchResults = ({
  query,
  results,
  viewFullCollection,
}) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results visible">
      <div className="search-results-container">

        <div className="search-results-header">
          <div className="search-results-info">
            <span className="search-results-label">
              SEARCH RESULTS
            </span>

            <h2 className="search-results-title">
              Pieces for <em>{query}</em>
            </h2>

            <p className="search-results-count">
              {results.length} result
              {results.length > 1 ? "s" : ""}
            </p>
          </div>

          <button
            className="search-view-all-btn"
            onClick={viewFullCollection}
          >
            View full collection →
          </button>
        </div>

        <div className="search-results-grid">
          {results
            .slice(0, 5)
            .map((item) => (
              <SearchResultCard
                key={item.id}
                item={item}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;