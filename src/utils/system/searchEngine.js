/**
 * House of Kaira: System Search Engine
 * Sections 6.4, 6.5, 6.8 of System Pages Specification v1.0
 */

import {
  SMALL_WORDS_IGNORED,
  SPELLING_VARIANTS,
  WAY_OF_SHOPPING_WORDS,
  SHOPPING_PREFIX_WORDS
} from "../../data/system/systemVocabulary";
import {
  getLivePieces,
  SYSTEM_DESIGNERS,
  SYSTEM_PIECES
} from "../../data/system/systemRegistry";

/**
 * Normalizes text: ignores accents, apostrophes, lowercases, punctuation becomes spaces
 */
export const normalizeText = (text) => {
  if (!text) return "";
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

/**
 * Normalizes a list of words, applying spelling variants and dropping small words
 */
export const normalizeWords = (query) => {
  const normalized = normalizeText(query);
  if (!normalized) return [];

  const rawWords = normalized.split(" ");
  const processed = [];

  for (const raw of rawWords) {
    if (!raw) continue;
    const mapped = SPELLING_VARIANTS[raw] || raw;
    if (!SMALL_WORDS_IGNORED.includes(mapped) && mapped.length >= 2) {
      processed.push(mapped);
    }
  }

  return processed;
};

/**
 * Detects mode words from raw query and extracts clean search query
 * Section 6.4: rent, rental, rentals, renting, hire -> rent
 * preloved, resale, preowned, secondhand, pre loved, pre-owned -> preloved
 * Also strips preceding prepositions like "to rent", "on hire"
 */
export const extractModeAndCleanQuery = (rawQuery, urlMode = null) => {
  if (!rawQuery) {
    return { mode: urlMode || null, cleanQuery: "", detectedFromWords: false };
  }

  let text = String(rawQuery).trim();
  let detectedMode = null;

  // Handle multi-word phrases first
  const prelovedPhrases = ["pre loved", "pre-owned", "second hand"];
  for (const phrase of prelovedPhrases) {
    const regex = new RegExp(`\\b(?:${SHOPPING_PREFIX_WORDS.join("|")}\\s+)?${phrase}\\b`, "gi");
    if (regex.test(text)) {
      detectedMode = "preloved";
      text = text.replace(regex, " ").trim();
    }
  }

  // Handle single mode words
  const words = text.split(/\s+/);
  const remaining = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i].toLowerCase();
    const prev = i > 0 ? words[i - 1].toLowerCase() : null;

    if (WAY_OF_SHOPPING_WORDS.rent.includes(w)) {
      detectedMode = detectedMode || "rent";
      if (prev && SHOPPING_PREFIX_WORDS.includes(prev) && remaining.length > 0) {
        remaining.pop();
      }
      continue;
    }

    if (WAY_OF_SHOPPING_WORDS.preloved.includes(w)) {
      detectedMode = detectedMode || "preloved";
      if (prev && SHOPPING_PREFIX_WORDS.includes(prev) && remaining.length > 0) {
        remaining.pop();
      }
      continue;
    }

    remaining.push(words[i]);
  }

  const cleanQuery = remaining.join(" ").replace(/\s+/g, " ").trim();
  const finalMode = urlMode ? urlMode.toLowerCase() : detectedMode;

  return {
    mode: finalMode,
    cleanQuery: cleanQuery || rawQuery.trim(),
    detectedFromWords: !urlMode && !!detectedMode
  };
};

/**
 * Check if a piece matches a search word
 * Prefix match across designer, name, category, occasions, mode
 */
const pieceMatchesWord = (piece, searchWord) => {
  const searchableText = [
    piece.designer,
    piece.name,
    piece.category,
    ...(piece.occasions || []),
    piece.mode
  ].join(" ");

  const normalizedTokens = normalizeText(searchableText).split(" ");
  return normalizedTokens.some((token) => token.startsWith(searchWord));
};

/**
 * Executes product search matching Section 6.8 rules
 */
export const executeSearch = (rawQuery, modeFilter = null) => {
  const livePieces = getLivePieces();
  const searchWords = normalizeWords(rawQuery);

  if (searchWords.length === 0) {
    return [];
  }

  return livePieces.filter((piece) => {
    if (modeFilter && piece.mode !== modeFilter) {
      return false;
    }
    return searchWords.every((word) => pieceMatchesWord(piece, word));
  });
};

/**
 * Analyzes the no-results state and determines what the page should display
 * Section 6.4 & 6.5
 */
export const analyzeNoResultsState = (rawQuery, urlMode = null) => {
  const { mode, cleanQuery } = extractModeAndCleanQuery(rawQuery, urlMode);
  const livePieces = getLivePieces();

  // 1. Check for designer with nothing live (Section 6.4 item 2)
  const normClean = normalizeText(cleanQuery);
  const emptyDesigner = SYSTEM_DESIGNERS.find(
    (d) => !d.hasLivePieces && (normClean === normalizeText(d.name) || normClean.includes(normalizeText(d.name)))
  );

  if (emptyDesigner) {
    return {
      state: "designer_empty",
      designer: emptyDesigner,
      query: cleanQuery || rawQuery,
      mode
    };
  }

  // 2. Check for Narrowed state (Section 6.4 item 3)
  if (mode) {
    const currentModeResults = executeSearch(cleanQuery, mode);
    if (currentModeResults.length === 0) {
      const otherMode = mode === "rent" ? "preloved" : "rent";
      const otherModeResults = executeSearch(cleanQuery, otherMode);

      if (otherModeResults.length > 0) {
        return {
          state: "narrowed",
          askedMode: mode,
          otherMode,
          otherCount: otherModeResults.length,
          query: cleanQuery || rawQuery,
          otherResults: otherModeResults
        };
      }
    }
  }

  // 3. Multi-word individual matching chips (Section 6.4 item 4 & Section 6.5)
  const words = normalizeWords(cleanQuery || rawQuery);
  let wordChips = [];

  if (words.length >= 2) {
    wordChips = words
      .map((word) => {
        const matches = livePieces.filter((p) => pieceMatchesWord(p, word));
        return {
          word,
          label: word.charAt(0).toUpperCase() + word.slice(1),
          count: matches.length
        };
      })
      .filter((item) => item.count > 0);
  }

  return {
    state: "nothing",
    query: cleanQuery || rawQuery,
    mode,
    wordChips
  };
};
