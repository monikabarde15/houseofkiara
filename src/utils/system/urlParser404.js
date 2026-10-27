/**
 * House of Kaira: 404 URL Parser & Pieces Selector
 * Sections 5.1, 5.4, 5.5, 5.6 of System Pages Specification v1.0
 */

import {
  SMALL_WORDS_IGNORED,
  SPELLING_VARIANTS,
  ROUTE_WORDS_IGNORED,
  CATEGORY_PLURALS
} from "../../data/system/systemVocabulary";
import {
  findPieceBySlugOrHouseNumber,
  getLivePieces,
  getPiecesByDesigner,
  getPiecesByCategory,
  getNewestLivePieces,
  SYSTEM_DESIGNERS
} from "../../data/system/systemRegistry";
import { executeSearch, normalizeText } from "./searchEngine";

/**
 * Extracts usable words from an unknown URL path
 * Section 5.5
 */
export const extractWordsFromPath = (pathname) => {
  if (!pathname) return [];

  let decoded = "";
  try {
    decoded = decodeURIComponent(pathname);
  } catch (e) {
    decoded = pathname;
  }

  // Split at slashes, hyphens, underscores, full stops and plus signs
  const rawParts = decoded.split(/[/\-_+.]+/);
  const candidateWords = [];

  for (const part of rawParts) {
    if (!part) continue;
    const lower = part.toLowerCase();

    // Drop words that contain digits
    if (/\d/.test(lower)) continue;

    // Drop words fewer than 3 letters
    if (lower.length < 3) continue;

    // Drop route words
    if (ROUTE_WORDS_IGNORED.includes(lower)) continue;

    // Drop small words
    if (SMALL_WORDS_IGNORED.includes(lower)) continue;

    // Map spelling variants
    const mapped = SPELLING_VARIANTS[lower] || lower;

    // Re-check small words and route words on mapped
    if (SMALL_WORDS_IGNORED.includes(mapped) || ROUTE_WORDS_IGNORED.includes(mapped)) continue;

    if (!candidateWords.includes(mapped)) {
      candidateWords.push(mapped);
    }
  }

  // Keep only words that find at least one live piece on their own, at most 5, in order
  const validWords = [];
  for (const word of candidateWords) {
    const matches = executeSearch(word);
    if (matches.length > 0) {
      validWords.push(word);
    }
    if (validWords.length >= 5) break;
  }

  return validWords;
};

/**
 * Analyzes an unknown URL to determine 404 state and wording
 * Section 5.1, 5.4, 5.5
 */
export const analyze404Url = (pathname) => {
  const cleanPath = (pathname || "").trim();

  // 1. Check piece records by slug or house number
  const matchedPiece = findPieceBySlugOrHouseNumber(cleanPath);

  if (matchedPiece) {
    const isSold = matchedPiece.status === "sold";
    const wording = isSold ? "sold" : "gone";

    // Section 5.5: for a piece's address, use designer + category, or designer alone
    let suggestQuery = null;
    const designerCatQuery = `${matchedPiece.designer} ${matchedPiece.category}`.trim();
    if (executeSearch(designerCatQuery).length > 0) {
      suggestQuery = designerCatQuery;
    } else if (executeSearch(matchedPiece.designer).length > 0) {
      suggestQuery = matchedPiece.designer;
    }

    return {
      type: "piece",
      wording,
      piece: matchedPiece,
      suggestQuery
    };
  }

  // 2. General wording
  const extractedWords = extractWordsFromPath(cleanPath);
  const suggestQuery = extractedWords.length > 0 ? extractedWords.join(" ") : null;

  return {
    type: "general",
    wording: "general",
    piece: null,
    suggestQuery,
    extractedWords
  };
};

/**
 * Selects 4 pieces and generates title/eyebrow/link for S5 pieces band
 * Section 5.6
 */
export const select404PiecesBand = (analysis) => {
  const livePieces = getLivePieces();
  if (livePieces.length < 2) {
    return null; // Section 5.6 item 4: if fewer than 2 live pieces exist, hide band
  }

  const selectedPieces = [];
  const selectedSlugs = new Set();

  const addPiece = (piece) => {
    if (!piece || selectedSlugs.has(piece.slug)) return;
    if (analysis.piece && piece.slug === analysis.piece.slug) return;
    selectedPieces.push(piece);
    selectedSlugs.add(piece.slug);
  };

  let eyebrow = "Still available";
  let title = "";
  let link = { label: "", href: "" };

  if (analysis.type === "piece" && analysis.piece) {
    const p = analysis.piece;
    // Step 1: same designer's pieces first
    const designerPieces = getPiecesByDesigner(p.designer, p.slug);
    designerPieces.forEach(addPiece);

    // If all four pieces are by designer from address
    if (selectedPieces.length >= 4) {
      title = `More from ${p.designer}`;
      link = {
        label: `All ${p.designer} pieces`,
        href: `/main-page?section=designers&d=${p.designerId || normalizeText(p.designer).replace(/\s+/g, "-")}`
      };
    } else {
      // Step 2: pieces in the same category
      const categoryPieces = getPiecesByCategory(p.category, p.slug);
      categoryPieces.forEach(addPiece);

      title = "In the same spirit";
      const catPlural = CATEGORY_PLURALS[p.category.toLowerCase()] || `${p.category}s`;
      link = {
        label: `All ${catPlural}`,
        href: `/main-page?section=new&category=${p.category.toLowerCase()}`
      };
    }
  } else {
    // For any other address: designer named in words, then all words, then each word
    const words = analysis.extractedWords || [];
    let foundNamedDesigner = null;

    for (const w of words) {
      const dMatch = SYSTEM_DESIGNERS.find((d) => normalizeText(d.name) === w);
      if (dMatch) {
        foundNamedDesigner = dMatch;
        getPiecesByDesigner(dMatch.name).forEach(addPiece);
      }
    }

    if (words.length > 0) {
      executeSearch(words.join(" ")).forEach(addPiece);
      for (const w of words) {
        executeSearch(w).forEach(addPiece);
      }
    }

    if (selectedPieces.length > 0) {
      title = "Close to what you were looking for";
      link = {
        label: "See every match",
        href: `/search?q=${encodeURIComponent(words.join(" "))}`
      };
    } else {
      eyebrow = "Just arrived";
      title = "New to the house";
      link = {
        label: "All new arrivals",
        href: "/main-page?section=new"
      };
    }
  }

  // Fill up to 4 with newest live pieces
  if (selectedPieces.length < 4) {
    const newest = getNewestLivePieces(4, Array.from(selectedSlugs));
    newest.forEach(addPiece);
  }

  return {
    eyebrow,
    title,
    link,
    pieces: selectedPieces.slice(0, 4)
  };
};
