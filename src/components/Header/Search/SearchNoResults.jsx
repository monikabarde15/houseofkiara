import "../../../styles/Header/Search/search-overlay.css";
import { rescuePills } from "../../../data/rescuePills";
const SearchNoResults = ({
  query,
  setQuery,
}) => {


  return (
    <div className="search-no-results">
      <div className="search-no-results-inner">

        <h2 className="search-no-results-title">
          Nothing found for{" "}
          <em>{query}</em>
        </h2>

        <p className="search-no-results-subtitle">
          Try searching for a designer,
          category, occasion, or mode.
        </p>

        <div className="search-rescue-pills">
          {rescuePills.map(
            (item) => (
              <button
                key={item}
                className="search-rescue-pill"
                onClick={() =>
                  setQuery(item)
                }
              >
                {item}
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchNoResults;