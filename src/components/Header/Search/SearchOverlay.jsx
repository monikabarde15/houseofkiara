// src\components\Header\Search\SearchOverlay.jsx
import SearchInput from "./SearchInput";
import SearchTrending from "./SearchTrending";
import SearchSuggestions from "./SearchSuggestions";
import SearchResults from "./SearchResults";
import SearchNoResults from "./SearchNoResults";

const SearchOverlay = ({
    isOpen,
    query,
    results = [],
    suggestions = [],
    highlightedIndex,
    showResults,
    setQuery,
    setHighlightedIndex,
    closeSearch,
    runSearch,
    viewFullCollection,
}) => {
    return (
        <div
            id="search-overlay"
            className={isOpen ? "open" : ""}
        > <div
                className="search-backdrop"
                onClick={closeSearch}
            />

            <div
                className="search-panel"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <SearchInput
                    query={query}
                    setQuery={setQuery}
                    closeSearch={closeSearch}
                />

                {!query && (
                    <SearchTrending
                        setQuery={setQuery}
                        runSearch={runSearch}
                    />
                )}

                {query &&
                    !showResults &&
                    suggestions.length > 0 && (
                        <SearchSuggestions
                            suggestions={suggestions}
                            highlightedIndex={
                                highlightedIndex
                            }
                            setHighlightedIndex={
                                setHighlightedIndex
                            }
                            setQuery={setQuery}
                            runSearch={runSearch}
                        />
                    )}

                {showResults &&
                    results?.length > 0 && (
                        <SearchResults
                            query={query}
                            results={results}
                            viewFullCollection={
                                viewFullCollection
                            }
                        />
                    )}

                {showResults &&
                    results?.length === 0 && (
                        <SearchNoResults
                            query={query}
                            setQuery={setQuery}
                        />
                    )}
            </div>
        </div>

    );
};

export default SearchOverlay;
