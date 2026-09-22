// src/utils/faqSearch.js
// Whole-word fuzzy search & scoring algorithm strictly following Section 10.4 & Appendix C
import React from "react";
import { ALL_QUESTIONS } from "../data/faq/faqRegistry";
import { SEARCH_ALTERNATIVES } from "../data/faq/searchKeywords";

/**
 * Normalizes text per Section 10.4:
 * Lowercases, converts non-letter/number/space/₹ to space, removes extra spaces.
 */
export function normalizeSearchQuery(query) {
  if (!query) return "";
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s₹]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if a candidate word matches a target whole word with optional trailing 's' / singular.
 */
function wordMatches(word, targetText) {
  if (!word || !targetText) return false;
  // Regex whole word match: \bword(s)?\b or if word ends with s, singular match
  const variations = [word];
  if (word.endsWith("s") && word.length > 3) {
    variations.push(word.slice(0, -1));
  }
  if (!word.endsWith("s")) {
    variations.push(word + "s");
  }

  for (const v of variations) {
    const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9₹])${escaped}($|\\s|[^a-zA-Z0-9₹])`, "i");
    if (regex.test(targetText)) {
      return true;
    }
  }
  return false;
}

/**
 * Extracts plain text from an answer object
 */
function getAnswerPlainText(answer) {
  if (!answer) return "";
  const parts = [];
  if (answer.paragraphs) parts.push(...answer.paragraphs);
  if (answer.bullets) parts.push(...answer.bullets);
  if (answer.afterBullets) parts.push(...answer.afterBullets);
  return parts.join(" ");
}

/**
 * Searches and scores all questions.
 * Returns { results: Array, hasQuery: boolean, validWords: Array, allQueryWords: Array }
 */
export function searchQuestions(rawQuery) {
  const normalized = normalizeSearchQuery(rawQuery);
  if (!normalized) {
    return { results: [], hasQuery: false, validWords: [], allQueryWords: [] };
  }

  const rawWords = normalized.split(" ").filter(Boolean);
  const validWords = rawWords.filter((w) => w.length >= 2);

  if (validWords.length === 0) {
    return { results: [], hasQuery: true, validWords: [], allQueryWords: rawWords };
  }

  const isPhrase = validWords.length > 1;
  const fullPhrase = validWords.join(" ");

  // Collect all terms including synonyms for each word
  const wordTermGroups = validWords.map((word) => {
    const alts = SEARCH_ALTERNATIVES[word] || [];
    return {
      exact: word,
      alternatives: alts.filter((a) => a !== word),
    };
  });

  const matchingQuestions = [];

  for (const q of ALL_QUESTIONS) {
    const questionText = q.question.toLowerCase();
    const topicText = (q.adminTopic || "").toLowerCase();
    const answerText = getAnswerPlainText(q.answer).toLowerCase();

    let allWordsMatched = true;
    let totalScore = 0;
    const matchedTerms = new Set();

    for (const group of wordTermGroups) {
      let groupMatched = false;
      let wordScore = 0;

      // 1. Check exact word
      const inQ = wordMatches(group.exact, questionText);
      const inK = wordMatches(group.exact, topicText);
      const inA = wordMatches(group.exact, answerText);

      if (inQ || inK || inA) {
        groupMatched = true;
        matchedTerms.add(group.exact);
        if (inQ) wordScore += 6;
        if (inK) wordScore += 3;
        if (inA) wordScore += 2;
      } else {
        // 2. Check alternatives
        for (const alt of group.alternatives) {
          const altInQ = wordMatches(alt, questionText);
          const altInK = wordMatches(alt, topicText);
          const altInA = wordMatches(alt, answerText);

          if (altInQ || altInK || altInA) {
            groupMatched = true;
            matchedTerms.add(alt);
            if (altInQ) wordScore = Math.max(wordScore, 4);
            if (altInK) wordScore = Math.max(wordScore, 2);
            if (altInA) wordScore = Math.max(wordScore, 1);
            break;
          }
        }
      }

      if (!groupMatched) {
        allWordsMatched = false;
        break;
      }
      totalScore += wordScore;
    }

    if (allWordsMatched && totalScore > 0) {
      // Phrase bonus
      if (isPhrase) {
        if (questionText.includes(fullPhrase)) {
          totalScore += 8;
        } else if (topicText.includes(fullPhrase)) {
          totalScore += 4;
        }
      }

      matchingQuestions.push({
        ...q,
        score: totalScore,
        matchedTerms: Array.from(matchedTerms),
      });
    }
  }

  // Sort descending by score; equal scores maintain admin order
  matchingQuestions.sort((a, b) => b.score - a.score);

  return {
    results: matchingQuestions.slice(0, 20),
    hasQuery: true,
    validWords,
    allQueryWords: rawWords,
  };
}

/**
 * Highlights matching words inside question string
 */
export function highlightText(text, terms = []) {
  if (!terms || terms.length === 0 || !text) return text;

  // Flatten and escape terms
  const escapedTerms = terms
    .filter((t) => t && t.length > 0)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (escapedTerms.length === 0) return text;

  const regex = new RegExp(`\\b(${escapedTerms.join("|")})(s)?\\b`, "gi");
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      React.createElement("mark", { key: match.index }, match[0])
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
