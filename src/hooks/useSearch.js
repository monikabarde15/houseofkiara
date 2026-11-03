import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { designerPageMap } from "../data/designerMap";
import {
  products as staticSearchProducts,
  searchCatalogue as staticSearchCatalogue,
  trendingSearches as staticTrendingSearches,
} from "../data/searchData";
import { SPELLING_VARIANTS, SMALL_WORDS_IGNORED } from "../data/system/systemVocabulary";
import {
  SYSTEM_DESIGNERS,
  setDynamicBackendPieces,
} from "../data/system/systemRegistry";

const IMAGE_CLASSES = ["ci-a", "ci-b", "ci-c", "ci-d", "ci-e", "ci-f"];

const STOP_WORDS = new Set([
  ...(SMALL_WORDS_IGNORED || []),
  "set",
  "sets",
  "&",
]);

const normalizeQueryTokens = (rawValue) => {
  if (!rawValue) return [];
  const cleaned = String(rawValue)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
  if (!cleaned) return [];

  const tokens = [];
  for (const word of cleaned.split(/\s+/)) {
    if (!word) continue;
    const mapped = SPELLING_VARIANTS[word] || word;
    for (const part of String(mapped).split(/\s+/)) {
      if (part && !STOP_WORDS.has(part)) {
        tokens.push(part);
      }
    }
  }
  return tokens.length > 0 ? tokens : cleaned.split(/\s+/).filter(Boolean);
};

const fetchBackendJson = async (endpoint) => {
  const envUrl =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_BACKEND_URL) ||
    "";
  const urls = envUrl
    ? [`${envUrl}${endpoint}`, endpoint]
    : [endpoint, `http://localhost:5003${endpoint}`];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      if (json?.success) return json;
    } catch {
      // try next url
    }
  }
  return null;
};

export const useSearch = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [query, setQueryState] = useState("");

  const [results, setResults] = useState([]);

  const [suggestions, setSuggestions] = useState([]);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [showResults, setShowResults] = useState(false);

  const [liveProducts, setLiveProducts] = useState([]);
  const [liveFilters, setLiveFilters] = useState(null);

  const focusTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchBackendJson("/api/web-products"),
      fetchBackendJson("/api/web-products/filters"),
    ]).then(([productsJson, filtersJson]) => {
      if (!isMounted) return;

      if (filtersJson?.data) {
        setLiveFilters(filtersJson.data);
      }

      if (Array.isArray(productsJson?.data) && productsJson.data.length > 0) {
        setDynamicBackendPieces(productsJson.data);

        const mapped = productsJson.data.map((p, idx) => {
          const rawModes = Array.isArray(p.listingModes)
            ? p.listingModes.map((m) => String(m).toLowerCase())
            : [];
          const isPreloved =
            p.preloved === true ||
            String(p.type || "").toLowerCase() === "preloved" ||
            rawModes.some((m) => m.includes("preloved"));
          const isRent =
            p.rent === true ||
            String(p.type || "").toLowerCase() === "rent" ||
            rawModes.some((m) => m.includes("rent"));

          const modeLabel = isPreloved
            ? "Preloved"
            : isRent
            ? "Rent"
            : "New";

          const rawPrice =
            (isPreloved ? p.buyPrice || p.listingPrice : p.rentPrice || p.rentalPrice) ||
            p.rentPrice ||
            p.rentalPrice ||
            p.buyPrice ||
            p.listingPrice ||
            p.price ||
            "14,999";
          const formattedPrice = String(rawPrice).startsWith("₹")
            ? String(rawPrice)
            : `₹${rawPrice}`;

          const firstImage = Array.isArray(p.image)
            ? p.image[0]
            : Array.isArray(p.images)
            ? p.images[0]
            : p.image || "";

          const rawCat = String(p.category || "").toLowerCase();
          const rawOcc = String(p.occasion || "").toLowerCase();
          const extraSynonyms = [];
          if (rawCat.includes("bridal") || rawCat.includes("lehenga")) {
            extraSynonyms.push("bridal", "lehenga", "lehengas", "wedding");
          }
          if (rawCat.includes("anarkali")) {
            extraSynonyms.push("anarkali", "anarkalis");
          }
          if (rawCat.includes("saree")) {
            extraSynonyms.push("saree", "sarees", "sari", "cocktail");
          }
          if (rawCat.includes("sharara")) {
            extraSynonyms.push("sharara", "shararas", "mehendi", "sangeet");
          }
          if (rawCat.includes("bandhgala") || rawCat.includes("sherwani")) {
            extraSynonyms.push("bandhgala", "sherwani", "sherwanis", "men", "menswear");
          }
          if (rawCat.includes("gown") || rawCat.includes("indo")) {
            extraSynonyms.push("gown", "gowns", "indo-western", "indowestern", "cocktail", "reception");
          }
          if (modeLabel === "Rent") {
            extraSynonyms.push("rent", "rental", "rentals");
          } else if (modeLabel === "Preloved") {
            extraSynonyms.push("preloved", "resale", "preowned");
          } else {
            extraSynonyms.push("new", "buy");
          }

          return {
            id: p._id || p.id || p.productId || p.sku || `live-${idx}`,
            type: "product",
            designer: p.designer || "House of Kaira",
            label: p.name || p.title || "Designer Piece",
            price: formattedPrice,
            mode: modeLabel,
            imageClass: IMAGE_CLASSES[idx % IMAGE_CLASSES.length],
            image: typeof firstImage === "string" ? firstImage : firstImage?.url || "",
            tags: [
              rawCat,
              rawOcc,
              String(p.gender || "").toLowerCase(),
              ...(Array.isArray(p.color) ? p.color : p.color ? [p.color] : []),
              ...extraSynonyms,
            ]
              .join(" ")
              .toLowerCase()
              .split(/\s+/)
              .filter(Boolean),
            rawProduct: p,
          };
        });

        setLiveProducts(mapped);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Use real backend products when loaded; fallback to static only if backend is unavailable
  const allProducts = useMemo(() => {
    if (liveProducts.length > 0) {
      return liveProducts;
    }
    return staticSearchProducts;
  }, [liveProducts]);

  // Build dynamic suggestions catalogue from live backend products & filters
  const fullCatalogue = useMemo(() => {
    if (liveProducts.length === 0) {
      return staticSearchCatalogue;
    }

    const dynamicCategoriesMap = new Map();
    const dynamicOccasionsMap = new Map();
    const dynamicDesignersMap = new Map();

    liveProducts.forEach((lp) => {
      const rawCat = lp.rawProduct?.category;
      if (rawCat && !dynamicCategoriesMap.has(rawCat.toLowerCase())) {
        dynamicCategoriesMap.set(rawCat.toLowerCase(), {
          type: "category",
          label: rawCat,
          tags: [rawCat.toLowerCase(), ...lp.tags],
        });
      }

      const rawOcc = lp.rawProduct?.occasion;
      if (rawOcc && !dynamicOccasionsMap.has(rawOcc.toLowerCase())) {
        dynamicOccasionsMap.set(rawOcc.toLowerCase(), {
          type: "occasion",
          label: rawOcc,
          tags: [rawOcc.toLowerCase(), "occasion", "event"],
        });
      }

      if (lp.designer && !dynamicDesignersMap.has(lp.designer.toLowerCase())) {
        dynamicDesignersMap.set(lp.designer.toLowerCase(), {
          type: "category",
          label: lp.designer,
          tags: [lp.designer.toLowerCase(), "designer"],
        });
      }
    });

    if (Array.isArray(liveFilters?.category)) {
      liveFilters.category.forEach(([catName, count]) => {
        if (catName && count > 0 && !dynamicCategoriesMap.has(catName.toLowerCase())) {
          dynamicCategoriesMap.set(catName.toLowerCase(), {
            type: "category",
            label: catName,
            tags: [catName.toLowerCase()],
          });
        }
      });
    }

    if (Array.isArray(liveFilters?.occasion)) {
      liveFilters.occasion.forEach(([occName, count]) => {
        if (occName && count > 0 && !dynamicOccasionsMap.has(occName.toLowerCase())) {
          dynamicOccasionsMap.set(occName.toLowerCase(), {
            type: "occasion",
            label: occName,
            tags: [occName.toLowerCase(), "occasion"],
          });
        }
      });
    }

    const dynamicModes = [
      { type: "mode", label: "Rent", tags: ["rent", "rental", "rentals"] },
      { type: "mode", label: "Preloved", tags: ["preloved", "resale", "secondhand"] },
      { type: "mode", label: "New", tags: ["new", "buy", "fresh"] },
    ];

    return [
      ...liveProducts,
      ...Array.from(dynamicCategoriesMap.values()),
      ...Array.from(dynamicOccasionsMap.values()),
      ...Array.from(dynamicDesignersMap.values()),
      ...dynamicModes,
    ];
  }, [liveProducts, liveFilters]);

  // Dynamic Trending Now pills generated from live backend products & filters
  const trendingSearches = useMemo(() => {
    if (liveProducts.length === 0) {
      return staticTrendingSearches;
    }

    const pills = [];
    const addPill = (val) => {
      if (!val) return;
      const clean = String(val).trim();
      if (
        clean &&
        clean.toLowerCase() !== "other designers" &&
        clean.toLowerCase() !== "designer atelier" &&
        !pills.some((p) => p.toLowerCase() === clean.toLowerCase())
      ) {
        pills.push(clean);
      }
    };

    // 1. Top live categories with count > 0
    if (Array.isArray(liveFilters?.category)) {
      liveFilters.category
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([catName]) => addPill(catName));
    }

    // 2. Top live designers from backend products
    const designerCounts = new Map();
    liveProducts.forEach((lp) => {
      if (lp.designer) {
        designerCounts.set(lp.designer, (designerCounts.get(lp.designer) || 0) + 1);
      }
    });
    Array.from(designerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([designerName]) => addPill(designerName));

    // 3. Remaining distinct categories/occasions from live products
    liveProducts.forEach((lp) => {
      if (pills.length < 8 && lp.rawProduct?.category) {
        addPill(lp.rawProduct.category);
      }
      if (pills.length < 8 && lp.rawProduct?.occasion) {
        addPill(lp.rawProduct.occasion);
      }
    });

    return pills.slice(0, 8);
  }, [liveProducts, liveFilters]);

  const setQuery = (value) => {
    setQueryState(value);
    setShowResults(false);
    setHighlightedIndex(-1);
  };

  /* ==========================
     SCORING
  ========================== */

  const scoreItem = (item, value) => {
    if (!value || !String(value).trim()) return 0;

    const cleanQuery = String(value).toLowerCase().trim();

    // Check if query explicitly targets a designer with no live pieces (e.g. Rahul Mishra)
    const emptyDesigner = SYSTEM_DESIGNERS.find(
      (d) =>
        !d.hasLivePieces &&
        cleanQuery.includes(d.name.toLowerCase()),
    );
    if (emptyDesigner) {
      return 0;
    }

    const label = item.label?.toLowerCase() || "";
    const designer = item.designer?.toLowerCase() || "";
    const mode = item.mode?.toLowerCase() || "";
    const tags = (item.tags || []).join(" ").toLowerCase();
    const searchable = `${label} ${designer} ${mode} ${tags}`;

    if (label === cleanQuery || designer === cleanQuery || mode === cleanQuery) {
      return 150;
    }

    if (label.startsWith(cleanQuery)) {
      return 100;
    }

    if (designer.startsWith(cleanQuery)) {
      return 95;
    }

    if (label.includes(cleanQuery)) {
      return 75;
    }

    if (designer.includes(cleanQuery)) {
      return 70;
    }

    const words = normalizeQueryTokens(cleanQuery);
    if (words.length === 0) return 0;

    const allMatch = words.every((word) => searchable.includes(word));

    if (allMatch) {
      return 50;
    }

    const matchedWordsCount = words.filter((word) => searchable.includes(word)).length;
    if (matchedWordsCount > 0) {
      return 25 * matchedWordsCount;
    }

    return 0;
  };

  /* ==========================
     SUGGESTIONS
  ========================== */

  const generateSuggestions = (value) => {
    const matches = fullCatalogue
      .map((item) => ({
        ...item,
        score: scoreItem(item, value),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const unique = [];

    matches.forEach((item) => {
      const exists = unique.find(
        (u) => u.label === item.label && u.type === item.type,
      );

      if (!exists) {
        unique.push(item);
      }
    });

    return unique.slice(0, 6);
  };

  /* ==========================
     SEARCH
  ========================== */

  const runSearch = (value) => {
    const searchVal = value !== undefined ? value : query;
    if (value !== undefined) {
      setQueryState(value);
    }

    const matches = allProducts
      .map((item) => ({
        ...item,
        score: scoreItem(item, searchVal),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setResults(matches);
    setShowResults(true);
    setHighlightedIndex(-1);
  };

  const selectSuggestion = (suggestion) => {
    if (!suggestion) return;
    setQueryState(suggestion.label);
    runSearch(suggestion.label);
    setHighlightedIndex(-1);
  };

  /* ==========================
     OPEN / CLOSE
  ========================== */

  const openSearch = () => {
    setIsOpen(true);

    document.body.style.overflow = "hidden";

    focusTimerRef.current = setTimeout(() => {
      document.getElementById("search-input")?.focus();
    }, 80);
  };

  const closeSearch = () => {
    setIsOpen(false);

    document.body.style.overflow = "";

    setQueryState("");
    setSuggestions([]);
    setResults([]);

    setHighlightedIndex(-1);

    setShowResults(false);

    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
    }
  };

  /* ==========================
     DESIGNER DETECTION
  ========================== */

  const detectDesigner = (value) => {
    const q = value.toLowerCase();

    return Object.keys(designerPageMap).find((designer) =>
      q.includes(designer),
    );
  };

  const detectMode = (value) => {
    const q = value.toLowerCase();

    if (q.includes("rent")) return "rent";

    if (q.includes("preloved") || q.includes("pre-loved"))
      return "preloved";

    if (q.includes("new")) return "new";

    return "all";
  };

  const viewFullCollection = () => {
    if (query && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  /* ==========================
     LIVE SUGGESTIONS
  ========================== */

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      setSuggestions(generateSuggestions(query));
    }, 120);

    return () => clearTimeout(timer);
  }, [query, fullCatalogue]);

  /* ==========================
     KEYBOARD NAVIGATION
  ========================== */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        closeSearch();
        return;
      }

      if (suggestions.length === 0 || showResults) {
        if (event.key === "Enter" && query.trim()) {
          event.preventDefault();
          runSearch(query);
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      }

      if (event.key === "Enter") {
        event.preventDefault();

        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          selectSuggestion(suggestions[highlightedIndex]);
        } else if (query.trim()) {
          runSearch(query);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, query, suggestions, highlightedIndex, showResults]);

  /* ==========================
     HOTKEYS
  ========================== */

  useEffect(() => {
    const openHotkey = (event) => {
      const target = event.target;

      const typing =
        target instanceof HTMLElement && target.matches("input, textarea");

      const slash = event.key === "/" && !typing;

      const ctrlK = event.ctrlKey && event.key.toLowerCase() === "k";

      const cmdK = event.metaKey && event.key.toLowerCase() === "k";

      if (slash || ctrlK || cmdK) {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", openHotkey);

    return () => window.removeEventListener("keydown", openHotkey);
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
    trendingSearches,

    setQuery,
    setHighlightedIndex,

    openSearch,
    closeSearch,

    runSearch,
    selectSuggestion,

    viewFullCollection,
  };
};
