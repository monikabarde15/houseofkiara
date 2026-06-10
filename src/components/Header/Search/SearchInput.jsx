import "../../../styles/Header/Search/search-overlay.css";

const SearchInput = ({
  query,
  setQuery,
  closeSearch,
}) => {
  return (
    <div className="search-input-row">
      <svg
        viewBox="0 0 24 24"
        className="search-input-icon"
      >
        <circle cx="11" cy="11" r="7" />
        <line
          x1="16.5"
          y1="16.5"
          x2="20"
          y2="20"
        />
      </svg>

      <input
        id="search-input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="Search lehengas, designers, occasions..."
      />

      <button
        className="search-close-btn"
        onClick={closeSearch}
      >
        <svg viewBox="0 0 24 24">
          <line
            x1="5"
            y1="5"
            x2="19"
            y2="19"
          />
          <line
            x1="19"
            y1="5"
            x2="5"
            y2="19"
          />
        </svg>

        Esc
      </button>
    </div>
  );
};

export default SearchInput;