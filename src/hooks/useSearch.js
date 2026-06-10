import { useEffect, useRef, useState } from "react";
import { designerPageMap } from "../data/designerMap";
import {
  products,
  searchCatalogue,
} from "../data/searchData";

// const DESIGNER_PAGE_MAP = {
//   sabyasachi: {
//     all: "sabyasachi_all",
//     rent: "rent_sabyasachi",
//     preloved: "preloved_sabyasachi",
//     new: "new_sabyasachi",
//   },

//   "manish malhotra": {
//     all: "mm_all",
//     rent: "rent_mm",
//     preloved: "preloved_mm",
//     new: "new_mm",
//   },

//   "anita dongre": {
//     all: "anita_all",
//     rent: "rent_anita",
//     preloved: "preloved_anita",
//     new: "new_anita",
//   },

//   "tarun tahiliani": {
//     all: "tarun_all",
//     rent: "rent_tarun",
//     preloved: "preloved_tarun",
//     new: "new_tarun",
//   },

//   torani: {
//     all: "torani_all",
//     rent: "rent_torani",
//     preloved: "preloved_torani",
//     new: "new_torani",
//   },

//   "raw mango": {
//     all: "rawmango_all",
//     rent: "rent_rawmango",
//     preloved: "preloved_rawmango",
//     new: "new_rawmango",
//   },
// };

export const useSearch = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [
    suggestions,
    setSuggestions,
  ] = useState([]);

  const [
    highlightedIndex,
    setHighlightedIndex,
  ] = useState(-1);

  const [
    showResults,
    setShowResults,
  ] = useState(false);

  const focusTimerRef =
    useRef(null);

  /* ==========================
     SCORING
  ========================== */

  const scoreItem = (
    item,
    value
  ) => {
    if (!value) return 0;

    const query =
      value.toLowerCase();

    const label =
      item.label?.toLowerCase() ||
      "";

    const designer =
      item.designer?.toLowerCase() ||
      "";

    const tags = (
      item.tags || []
    )
      .join(" ")
      .toLowerCase();

    if (
      label === query ||
      designer === query
    ) {
      return 150;
    }

    if (
      label.startsWith(
        query
      )
    ) {
      return 100;
    }

    if (
      designer.startsWith(
        query
      )
    ) {
      return 95;
    }

    if (
      label.includes(query)
    ) {
      return 75;
    }

    if (
      designer.includes(
        query
      )
    ) {
      return 70;
    }

    const words =
      query.split(" ");

    const allMatch =
      words.every(
        (word) =>
          label.includes(word) ||
          designer.includes(
            word
          ) ||
          tags.includes(word)
      );

    if (allMatch) {
      return 50;
    }

    const anyMatch =
      words.some(
        (word) =>
          label.includes(word) ||
          designer.includes(
            word
          ) ||
          tags.includes(word)
      );

    if (anyMatch) {
      return 25;
    }

    return 0;
  };

  /* ==========================
     SUGGESTIONS
  ========================== */

  const generateSuggestions =
    (value) => {
      const matches =
        searchCatalogue
          .map((item) => ({
            ...item,
            score:
              scoreItem(
                item,
                value
              ),
          }))
          .filter(
            (item) =>
              item.score > 0
          )
          .sort(
            (a, b) =>
              b.score -
              a.score
          );

      const unique = [];

      matches.forEach(
        (item) => {
          const exists =
            unique.find(
              (u) =>
                u.label ===
                  item.label &&
                u.type ===
                  item.type
            );

          if (!exists) {
            unique.push(item);
          }
        }
      );

      return unique.slice(
        0,
        6
      );
    };

  /* ==========================
     SEARCH
  ========================== */

  const runSearch = (
    value
  ) => {
    const matches =
      products
        .map((item) => ({
          ...item,
          score:
            scoreItem(
              item,
              value
            ),
        }))
        .filter(
          (item) =>
            item.score > 0
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        )
        .slice(0, 5);

    setResults(matches);
    setShowResults(true);
  };

  const selectSuggestion =
    (suggestion) => {
      setQuery(
        suggestion.label
      );

      runSearch(
        suggestion.label
      );

      setHighlightedIndex(
        -1
      );
    };

  /* ==========================
     OPEN / CLOSE
  ========================== */

  const openSearch = () => {
    setIsOpen(true);

    document.body.style.overflow =
      "hidden";

    focusTimerRef.current =
      setTimeout(() => {
        document
          .getElementById(
            "search-input"
          )
          ?.focus();
      }, 80);
  };

  const closeSearch = () => {
    setIsOpen(false);

    document.body.style.overflow =
      "";

    setQuery("");
    setSuggestions([]);
    setResults([]);

    setHighlightedIndex(
      -1
    );

    setShowResults(false);

    if (
      focusTimerRef.current
    ) {
      clearTimeout(
        focusTimerRef.current
      );
    }
  };

  /* ==========================
     DESIGNER DETECTION
  ========================== */

  const detectDesigner =
    (value) => {
      const query =
        value.toLowerCase();

      return Object.keys(
        designerPageMap
      ).find(
        (designer) =>
          query.includes(
            designer
          )
      );
    };

  const detectMode = (
    value
  ) => {
    const query =
      value.toLowerCase();

    if (
      query.includes(
        "rent"
      )
    )
      return "rent";

    if (
      query.includes(
        "preloved"
      ) ||
      query.includes(
        "pre-loved"
      )
    )
      return "preloved";

    if (
      query.includes(
        "new"
      )
    )
      return "new";

    return "all";
  };

  const viewFullCollection =
    () => {
      const designer =
        detectDesigner(
          query
        );

      const mode =
        detectMode(query);

      if (
        designer &&
        designerPageMap[
          designer
        ]
      ) {
        const page =
          designerPageMap[
            designer
          ]?.[mode] ||
          designerPageMap[
            designer
          ]?.all;

        console.log(
          "Navigate:",
          page
        );

        return;
      }

      console.log(
        "Navigate collection:",
        query
      );
    };

  /* ==========================
     LIVE SUGGESTIONS
  ========================== */

  useEffect(() => {
    if (
      !query.trim()
    ) {
      setSuggestions([]);
      setResults([]);
      setShowResults(
        false
      );
      return;
    }

    const timer =
      setTimeout(() => {
        setSuggestions(
          generateSuggestions(
            query
          )
        );
      }, 120);

    return () =>
      clearTimeout(timer);
  }, [query]);

  /* ==========================
     KEYBOARD NAVIGATION
  ========================== */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (!isOpen)
          return;

        if (
          event.key ===
          "Escape"
        ) {
          closeSearch();
          return;
        }

        if (
          suggestions.length ===
          0
        ) {
          if (
            event.key ===
            "Enter"
          ) {
            runSearch(
              query
            );
          }
          return;
        }

        if (
          event.key ===
          "ArrowDown"
        ) {
          event.preventDefault();

          setHighlightedIndex(
            (prev) =>
              prev <
              suggestions.length -
                1
                ? prev + 1
                : 0
          );
        }

        if (
          event.key ===
          "ArrowUp"
        ) {
          event.preventDefault();

          setHighlightedIndex(
            (prev) =>
              prev > 0
                ? prev - 1
                : suggestions.length -
                  1
          );
        }

        if (
          event.key ===
          "Enter"
        ) {
          event.preventDefault();

          if (
            highlightedIndex >=
            0
          ) {
            selectSuggestion(
              suggestions[
                highlightedIndex
              ]
            );
          } else {
            runSearch(
              query
            );
          }
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    isOpen,
    query,
    suggestions,
    highlightedIndex,
  ]);

  /* ==========================
     HOTKEYS
  ========================== */

  useEffect(() => {
    const openHotkey =
      (event) => {
        const target =
          event.target;

        const typing =
          target instanceof
            HTMLElement &&
          target.matches(
            "input, textarea"
          );

        const slash =
          event.key === "/" &&
          !typing;

        const ctrlK =
          event.ctrlKey &&
          event.key.toLowerCase() ===
            "k";

        const cmdK =
          event.metaKey &&
          event.key.toLowerCase() ===
            "k";

        if (
          slash ||
          ctrlK ||
          cmdK
        ) {
          event.preventDefault();
          openSearch();
        }
      };

    window.addEventListener(
      "keydown",
      openHotkey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        openHotkey
      );
  }, []);

  /* ==========================
     RETURN
  ========================== */

  return {
    isOpen,
    query,
    results,
    suggestions,
    highlightedIndex,
    showResults,

    setQuery,
    setHighlightedIndex,

    openSearch,
    closeSearch,

    runSearch,
    selectSuggestion,

    viewFullCollection,
  };
};