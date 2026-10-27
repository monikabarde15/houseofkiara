/**
 * House of Kaira: Did You Mean Spellcheck Algorithm
 * Section 6.6 of System Pages Specification v1.0
 */

import { executeSearch, normalizeText } from "./searchEngine";
import { SYSTEM_DESIGNERS, SYSTEM_PIECES, getLivePieces } from "../../data/system/systemRegistry";
import { OCCASIONS_ORDER, CATEGORY_PLURALS } from "../../data/system/systemVocabulary";

/**
 * Calculates Damerau-Levenshtein distance (substitution, insertion, deletion, transposition)
 */
export const damerauLevenshteinDistance = (source, target) => {
  if (!source || !target) return (source || target || "").length;
  const s = source.toLowerCase();
  const t = target.toLowerCase();
  const slen = s.length;
  const tlen = t.length;

  const matrix = Array.from({ length: slen + 1 }, () => new Array(tlen + 1).fill(0));

  for (let i = 0; i <= slen; i++) matrix[i][0] = i;
  for (let j = 0; j <= tlen; j++) matrix[0][j] = j;

  for (let i = 1; i <= slen; i++) {
    for (let j = 1; j <= tlen; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }

  return matrix[slen][tlen];
};

/**
 * Builds vocabulary set with piece occurrence frequencies
 */
export const buildSearchVocabulary = () => {
  const vocabMap = new Map(); // word -> pieceCount

  const addTerm = (term, weight = 1) => {
    const tokens = normalizeText(term).split(" ");
    for (const tok of tokens) {
      if (tok.length >= 3) {
        vocabMap.set(tok, (vocabMap.get(tok) || 0) + weight);
      }
    }
  };

  // 1. Designers from registry
  for (const d of SYSTEM_DESIGNERS) {
    addTerm(d.name, 5);
  }

  // 2. Categories and their plurals
  for (const [cat, plural] of Object.entries(CATEGORY_PLURALS)) {
    addTerm(cat, 5);
    addTerm(plural, 5);
  }

  // 3. Occasions from registry
  for (const occ of OCCASIONS_ORDER) {
    addTerm(occ.name, 4);
  }

  // 4. Live pieces words
  for (const piece of getLivePieces()) {
    addTerm(piece.name, 2);
    addTerm(piece.category, 3);
    for (const occ of piece.occasions || []) {
      addTerm(occ, 2);
    }
  }

  return vocabMap;
};

/**
 * Finds closest vocabulary word for an unmatched word
 * Section 6.6: at most 1 distance for words <=4 chars, at most 2 for longer
 */
export const findClosestWord = (word, vocabMap) => {
  const cleanWord = normalizeText(word);
  if (!cleanWord || cleanWord.length < 3) return null;

  const maxAllowedDist = cleanWord.length <= 4 ? 1 : 2;
  let bestCandidate = null;
  let minDistance = Infinity;
  let maxWeight = -1;

  for (const [vocabWord, weight] of vocabMap.entries()) {
    const dist = damerauLevenshteinDistance(cleanWord, vocabWord);
    if (dist <= maxAllowedDist) {
      if (dist < minDistance || (dist === minDistance && weight > maxWeight)) {
        minDistance = dist;
        maxWeight = weight;
        bestCandidate = vocabWord;
      }
    }
  }

  return bestCandidate;
};

/**
 * Evaluates raw query and generates "Did you mean" suggestion
 * Returns corrected string if it finds live pieces, otherwise null
 */
export const getDidYouMeanSuggestion = (rawQuery) => {
  if (!rawQuery) return null;

  const initialMatches = executeSearch(rawQuery);
  if (initialMatches.length > 0) {
    return null; // Already finds live pieces
  }

  const rawWords = normalizeText(rawQuery).split(" ").filter(Boolean);
  if (rawWords.length === 0) return null;

  const vocabMap = buildSearchVocabulary();
  let hasCorrection = false;
  const correctedTokens = [];

  for (const word of rawWords) {
    // Check if the word finds anything on its own
    const wordMatches = executeSearch(word);
    if (wordMatches.length > 0) {
      correctedTokens.push(word);
    } else {
      const candidate = findClosestWord(word, vocabMap);
      if (candidate && candidate !== word) {
        hasCorrection = true;
        correctedTokens.push(candidate);
      } else {
        correctedTokens.push(word);
      }
    }
  }

  if (!hasCorrection) {
    return null;
  }

  const correctedQuery = correctedTokens.join(" ");
  // Offer the corrected search ONLY if it finds live pieces
  const correctedMatches = executeSearch(correctedQuery);
  if (correctedMatches.length > 0) {
    return correctedQuery;
  }

  return null;
};
