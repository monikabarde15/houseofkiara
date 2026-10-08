/**
 * House of Kaira - Seller Guidelines Search Engine
 * Section 5.3 & Appendix B of Build Specification 1.0
 */

import { IGNORED_WORDS, SELLER_SYNONYMS } from "../../data/seller/sellerSynonyms.js";
import { SELLER_QUESTIONS, getChapterById } from "../../data/seller/sellerRegistry.js";

/**
 * Normalizes text: lowercase, removes punctuation and apostrophes.
 */
export function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Given a word, returns a set of expansion terms including the word itself,
 * any configured synonyms, and for words >= 3 chars, synonyms of any vocabulary key it prefixes.
 */
export function expandWordWithSynonyms(word) {
  const expansions = new Set([word]);
  const normWord = normalizeText(word);
  if (!normWord) return expansions;

  // Direct synonym check
  if (SELLER_SYNONYMS[normWord]) {
    SELLER_SYNONYMS[normWord].forEach((syn) => expansions.add(syn.toLowerCase()));
  }

  // Prefix check against vocabulary keys if word length >= 3
  if (normWord.length >= 3) {
    Object.keys(SELLER_SYNONYMS).forEach((key) => {
      if (key.startsWith(normWord) || normWord.startsWith(key)) {
        expansions.add(key);
        SELLER_SYNONYMS[key].forEach((syn) => expansions.add(syn.toLowerCase()));
      }
    });
  }

  return expansions;
}

/**
 * Checks if a candidate target text matches a query word (prefix matching)
 */
function textMatchesWord(targetTextNorm, word) {
  if (!targetTextNorm || !word) return false;
  // Word boundary or start of any word
  const words = targetTextNorm.split(" ");
  return words.some((w) => w.startsWith(word));
}

/**
 * Extracts plain text from a question's body items
 */
function getAnswerPlainText(question) {
  if (!question.body || !Array.isArray(question.body)) return "";
  const parts = [];
  question.body.forEach((item) => {
    if (item.type === "p") {
      parts.push(item.text || item.content || "");
    } else if (item.type === "ul" && Array.isArray(item.items)) {
      parts.push(item.items.join(" "));
    } else if (item.type === "steps" && Array.isArray(item.items)) {
      item.items.forEach((s) => parts.push(`${s.title || ""} ${s.text || ""}`));
    } else if (item.type === "grades" && Array.isArray(item.items)) {
      item.items.forEach((g) => parts.push(`${g.name || ""} ${g.text || ""}`));
    }
  });
  return parts.join(" ");
}

/**
 * Finds the first sentence in the answer containing any matched words
 */
export function extractAnswerSnippet(question, queryWords) {
  const plain = getAnswerPlainText(question);
  if (!plain) return "";

  // Split into sentences
  const sentences = plain.match(/[^.!?]+[.!?]+/g) || [plain];
  const normQueryWords = queryWords.map((w) => normalizeText(w)).filter(Boolean);

  for (const sentence of sentences) {
    const normSent = normalizeText(sentence);
    const hasMatch = normQueryWords.some((qw) => {
      const expansions = expandWordWithSynonyms(qw);
      return Array.from(expansions).some((term) => textMatchesWord(normSent, term));
    });
    if (hasMatch) {
      return sentence.trim();
    }
  }

  // Fallback to first sentence
  return sentences[0] ? sentences[0].trim() : plain.slice(0, 120);
}

/**
 * Searches the guidelines registry.
 * Returns { results: Array, isOnlyStopWords: boolean, activeWords: Array }
 */
export function searchGuidelines(rawQuery) {
  const normQuery = normalizeText(rawQuery);
  if (!normQuery) {
    return { results: [], isOnlyStopWords: false, activeWords: [] };
  }

  const rawWords = normQuery.split(" ").filter(Boolean);
  const activeWords = rawWords.filter((w) => !IGNORED_WORDS.has(w));

  // If only stop words are typed, do not open or show results
  if (activeWords.length === 0) {
    return { results: [], isOnlyStopWords: true, activeWords: [] };
  }

  const matches = [];

  SELLER_QUESTIONS.forEach((question, originalIndex) => {
    const qNorm = normalizeText(question.title);
    const swNorm = normalizeText((question.searchWords || []).join(" "));
    const ansPlain = getAnswerPlainText(question);
    const ansNorm = normalizeText(ansPlain);
    const chap = getChapterById(question.chapterId);
    const chapNorm = chap ? normalizeText(chap.title) : "";

    let totalScore = 0;
    let allWordsMatched = true;
    let directQuestionWordCount = 0;

    // Every active word must match (AND condition)
    for (const word of activeWords) {
      const isDirectQMatch = textMatchesWord(qNorm, word);
      const isDirectSWMatch = textMatchesWord(swNorm, word);
      const isDirectAnsMatch = textMatchesWord(ansNorm, word);
      const isDirectChapMatch = textMatchesWord(chapNorm, word);

      if (isDirectQMatch) directQuestionWordCount++;

      let wordScore = 0;

      if (isDirectQMatch) {
        wordScore = Math.max(wordScore, 4);
      }
      if (isDirectSWMatch) {
        wordScore = Math.max(wordScore, 2);
      }
      if (isDirectAnsMatch || isDirectChapMatch) {
        wordScore = Math.max(wordScore, 1);
      }

      // Check synonyms if no direct high match or to augment
      const expansions = expandWordWithSynonyms(word);
      expansions.delete(word); // only consider pure synonyms

      for (const syn of expansions) {
        if (textMatchesWord(qNorm, syn)) {
          wordScore = Math.max(wordScore, 4 * 0.8);
        }
        if (textMatchesWord(swNorm, syn)) {
          wordScore = Math.max(wordScore, 2 * 0.8);
        }
        if (textMatchesWord(ansNorm, syn) || textMatchesWord(chapNorm, syn)) {
          wordScore = Math.max(wordScore, 1 * 0.8);
        }
      }

      if (wordScore === 0) {
        allWordsMatched = false;
        break;
      }

      totalScore += wordScore;
    }

    if (allWordsMatched && totalScore > 0) {
      // Phrase bonuses when 2+ words are typed
      if (activeWords.length >= 2) {
        const fullPhrase = activeWords.join(" ");
        if (qNorm.includes(fullPhrase)) {
          totalScore += 6;
        }
        if (swNorm.includes(fullPhrase)) {
          totalScore += 4;
        }
        if (directQuestionWordCount === activeWords.length) {
          totalScore += 3;
        }
      }

      const snippet = extractAnswerSnippet(question, activeWords);
      matches.push({
        question,
        score: totalScore,
        originalIndex,
        chapterTitle: chap ? chap.title : "",
        snippet
      });
    }
  });

  // Sort descending by score, tie-break by originalIndex
  matches.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.originalIndex - b.originalIndex;
  });

  return {
    results: matches,
    isOnlyStopWords: false,
    activeWords
  };
}

export const searchSellerGuidelines = searchGuidelines;
