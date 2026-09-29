// src/utils/faqSearch.js
// Fuzzy search & prefix scoring algorithm supporting instant suggestions and partial queries
import React from "react";
import { ALL_QUESTIONS } from "../data/faq/faqRegistry.js";
import { SEARCH_ALTERNATIVES } from "../data/faq/searchKeywords.js";

/**
 * Normalizes text:
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
 * Splits text into individual words
 */
function getWords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9₹\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Computes word match score for a search word against target words:
 * 3 if exact match (or singular/plural match)
 * 2 if any target word starts with searchWord (prefix match)
 * 1.5 if searchWord >= 4 and target word contains searchWord
 * 0 otherwise
 */
function scoreWordAgainstWords(searchWord, targetWords) {
  if (!searchWord || !targetWords || targetWords.length === 0) return 0;
  
  let bestScore = 0;
  for (const tw of targetWords) {
    if (tw === searchWord) {
      return 3;
    }
    // Singular / plural match
    if (
      (searchWord.endsWith("s") && tw === searchWord.slice(0, -1)) ||
      (!searchWord.endsWith("s") && tw === searchWord + "s")
    ) {
      return 3;
    }
    // Prefix match
    if (tw.startsWith(searchWord)) {
      if (bestScore < 2) bestScore = 2;
    } else if (searchWord.length >= 4 && tw.includes(searchWord)) {
      if (bestScore < 1.5) bestScore = 1.5;
    }
  }
  return bestScore;
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
 * Returns alternative synonym words for a given search word (including prefix matching keys)
 */
function getAlternativesForWord(searchWord) {
  const alternatives = new Set();
  
  for (const [key, synList] of Object.entries(SEARCH_ALTERNATIVES)) {
    const keyMatches =
      key === searchWord ||
      key.startsWith(searchWord) ||
      (searchWord.length >= 4 && searchWord.startsWith(key));

    if (keyMatches) {
      for (const syn of synList) {
        if (syn !== searchWord) {
          alternatives.add(syn);
        }
      }
    }
  }
  return Array.from(alternatives);
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
    return {
      exact: word,
      alternatives: getAlternativesForWord(word),
    };
  });

  const matchingQuestions = [];

  for (const q of ALL_QUESTIONS) {
    const questionText = (q.question || "").toLowerCase();
    const topicText = (q.adminTopic || "").toLowerCase();
    const answerText = getAnswerPlainText(q.answer).toLowerCase();

    const qWords = getWords(questionText);
    const topicWords = getWords(topicText);
    const aWords = getWords(answerText);

    let allWordsMatched = true;
    let totalScore = 0;
    const matchedTerms = new Set();

    for (const group of wordTermGroups) {
      let groupMatched = false;
      let bestWordScore = 0;

      // 1. Check exact word & prefix against question, topic, answer
      const qScore = scoreWordAgainstWords(group.exact, qWords);
      const topicScore = scoreWordAgainstWords(group.exact, topicWords);
      const aScore = scoreWordAgainstWords(group.exact, aWords);

      const directWeighted = qScore * 3 + topicScore * 1.5 + aScore * 1;

      if (directWeighted > 0) {
        groupMatched = true;
        matchedTerms.add(group.exact);
        bestWordScore = directWeighted;
      } else {
        // 2. Check alternatives / synonyms
        for (const alt of group.alternatives) {
          const altWords = getWords(alt);
          let altQScore = 0;
          let altTopicScore = 0;
          let altAScore = 0;

          for (const aw of altWords) {
            altQScore = Math.max(altQScore, scoreWordAgainstWords(aw, qWords));
            altTopicScore = Math.max(altTopicScore, scoreWordAgainstWords(aw, topicWords));
            altAScore = Math.max(altAScore, scoreWordAgainstWords(aw, aWords));
          }

          const altWeighted = (altQScore * 3 + altTopicScore * 1.5 + altAScore * 1) * 0.7;
          if (altWeighted > bestWordScore) {
            bestWordScore = altWeighted;
            groupMatched = true;
            matchedTerms.add(alt);
          }
        }
      }

      if (!groupMatched || bestWordScore <= 0) {
        allWordsMatched = false;
        break;
      }
      totalScore += bestWordScore;
    }

    if (allWordsMatched && totalScore > 0) {
      // Phrase bonus
      if (isPhrase) {
        if (questionText.includes(fullPhrase)) {
          totalScore += 10;
        } else if (topicText.includes(fullPhrase)) {
          totalScore += 5;
        }
      }

      matchingQuestions.push({
        ...q,
        score: totalScore,
        matchedTerms: Array.from(matchedTerms),
      });
    }
  }

  // Sort descending by score; equal scores maintain registry order
  matchingQuestions.sort((a, b) => b.score - a.score);

  return {
    results: matchingQuestions.slice(0, 20),
    hasQuery: true,
    validWords,
    allQueryWords: rawWords,
  };
}

/**
 * Highlights matching words and prefixes inside question string
 */
export function highlightText(text, terms = []) {
  if (!terms || terms.length === 0 || !text) return text;

  // Flatten and escape terms
  const escapedTerms = terms
    .filter((t) => t && t.length >= 2)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (escapedTerms.length === 0) return text;

  const regex = new RegExp(`\\b(${escapedTerms.join("|")})[a-zA-Z0-9₹]*`, "gi");
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
