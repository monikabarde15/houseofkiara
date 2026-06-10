import "../../../styles/Header/Search/search-overlay.css";

const TYPE_LABELS = {
  product: "Piece",
  category: "Category",
  occasion: "Occasion",
  mode: "Mode",
};

const SearchSuggestions = ({
  suggestions,
  highlightedIndex,
  setHighlightedIndex,
  setQuery,
  runSearch,
}) => {
  if (
    !suggestions ||
    suggestions.length === 0
  ) {
    return null;
  }

  const handleSelect = (
    suggestion
  ) => {
    setQuery(suggestion.label);

    runSearch(suggestion.label);
  };

  const renderIcon = (
    suggestion
  ) => {
    switch (
      suggestion.type
    ) {
      case "product":
        return (
          <svg
            className="suggestion-icon"
            viewBox="0 0 24 24"
          >
            <rect
              x="5"
              y="4"
              width="14"
              height="16"
              rx="1"
            />
            <line
              x1="8"
              y1="8"
              x2="16"
              y2="8"
            />
          </svg>
        );

      case "category":
        return (
          <svg
            className="suggestion-icon"
            viewBox="0 0 24 24"
          >
            <rect
              x="4"
              y="4"
              width="7"
              height="7"
            />
            <rect
              x="13"
              y="4"
              width="7"
              height="7"
            />
            <rect
              x="4"
              y="13"
              width="7"
              height="7"
            />
            <rect
              x="13"
              y="13"
              width="7"
              height="7"
            />
          </svg>
        );

      case "occasion":
        return (
          <svg
            className="suggestion-icon"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
            />
          </svg>
        );

      case "mode":
        return (
          <svg
            className="suggestion-icon"
            viewBox="0 0 24 24"
          >
            <path d="M7 12h10" />
            <path d="M13 8l4 4-4 4" />
          </svg>
        );

      default:
        return (
          <svg
            className="suggestion-icon"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
            />
          </svg>
        );
    }
  };

  return (
    <div className="search-suggestions visible">
      <div className="search-suggestions-inner">
        <span className="search-section-label">
          SUGGESTIONS
        </span>

        <div className="suggestions-list">
          {suggestions.map(
            (
              suggestion,
              index
            ) => (
              <button
                key={`${suggestion.type}-${suggestion.label}`}
                className={`suggestion-item ${
                  highlightedIndex ===
                  index
                    ? "active"
                    : ""
                }`}
                onMouseEnter={() =>
                  setHighlightedIndex(
                    index
                  )
                }
                onClick={() =>
                  handleSelect(
                    suggestion
                  )
                }
              >
                <div className="suggestion-left">
                  {renderIcon(
                    suggestion
                  )}

                  <span className="suggestion-text">
                    {
                      suggestion.label
                    }
                  </span>
                </div>

                <span className="suggestion-type">
                  {TYPE_LABELS[
                    suggestion
                      .type
                  ] ||
                    "Item"}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;