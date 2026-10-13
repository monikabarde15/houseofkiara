/**
 * House of Kaira: Shipping & Delivery Policy Search Algorithm
 * Section 5.5 & 8.3 of Build Specification v2 (hok_shipping_policy_v3)
 */

import { SHIPPING_SECTIONS } from "../../data/shipping/shippingRegistry";
import { SHIPPING_SYNONYMS } from "../../data/shipping/shippingSynonyms";

const STOP_WORDS = new Set([
  "the", "and", "can", "my", "is", "it", "do", "if", "of", "to", "in", "on",
  "for", "what", "how", "an", "get", "does", "will", "am", "me", "at", "or",
  "be", "a", "i", "you", "your"
]);

/**
 * Normalizes query string: lower-cased, removes punctuation except rupee symbol ₹
 */
export function normalizeQuery(query) {
  if (!query) return "";
  return query
    .toLowerCase()
    .replace(/[^\w\s₹]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits query into meaningful search terms, filtering out stop words
 */
export function extractSearchTokens(rawQuery) {
  const normalized = normalizeQuery(rawQuery);
  if (!normalized) return [];
  const words = normalized.split(" ");
  return words.filter((w) => w.length > 0 && !STOP_WORDS.has(w));
}

/**
 * Checks if a token matches the start of any word in targetText
 * Regex pattern: (^|[^a-z0-9₹])token
 */
function matchesWordPrefix(targetText, token) {
  if (!targetText || !token) return false;
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|[^a-z0-9₹])${escaped}`, "i");
  return regex.test(targetText);
}

/**
 * Executes full search across all 7 shipping policy sections
 */
export function searchShippingPolicy(rawQuery, maxResults = 8) {
  const tokens = extractSearchTokens(rawQuery);
  if (tokens.length === 0) {
    return {
      results: [],
      totalFound: 0,
      countLine: ""
    };
  }

  const allQuestions = [];
  let displayOrder = 0;

  SHIPPING_SECTIONS.forEach((section) => {
    section.questions.forEach((q) => {
      allQuestions.push({
        ...q,
        sectionId: section.id,
        sectionTitle: `${section.titlePrefix}${section.italicWord}`,
        displayOrder: displayOrder++
      });
    });
  });

  const matched = [];

  allQuestions.forEach((item) => {
    const questionText = item.question || "";
    const keywordsText = item.keywords || "";
    const answerText = Array.isArray(item.paragraphs) ? item.paragraphs.join(" ") : "";

    let totalScore = 0;
    let allTokensMatched = true;

    for (const token of tokens) {
      let tokenMatched = false;
      let tokenScore = 0;

      // 1. Direct prefix match
      if (matchesWordPrefix(questionText, token)) {
        tokenScore = Math.max(tokenScore, 6);
        tokenMatched = true;
      }
      if (matchesWordPrefix(keywordsText, token)) {
        tokenScore = Math.max(tokenScore, 3);
        tokenMatched = true;
      }
      if (matchesWordPrefix(answerText, token)) {
        tokenScore = Math.max(tokenScore, 2);
        tokenMatched = true;
      }

      // 2. Synonym prefix match
      const synonyms = SHIPPING_SYNONYMS[token] || [];
      for (const syn of synonyms) {
        if (matchesWordPrefix(questionText, syn)) {
          tokenScore = Math.max(tokenScore, 4);
          tokenMatched = true;
        }
        if (matchesWordPrefix(keywordsText, syn)) {
          tokenScore = Math.max(tokenScore, 2);
          tokenMatched = true;
        }
        if (matchesWordPrefix(answerText, syn)) {
          tokenScore = Math.max(tokenScore, 1);
          tokenMatched = true;
        }
      }

      if (!tokenMatched) {
        allTokensMatched = false;
        break;
      }

      totalScore += tokenScore;
    }

    if (allTokensMatched && totalScore > 0) {
      matched.push({
        ...item,
        score: totalScore
      });
    }
  });

  // Sort by score descending, then by order of appearance
  matched.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score-a.score;
    }
    return a.displayOrder-b.displayOrder;
  });

  const totalFound = matched.length;
  const sliced = matched.slice(0, maxResults);

  let countLine = "";
  if (totalFound === 1) {
    countLine = "1 answer";
  } else if (totalFound <= maxResults) {
    countLine = `${totalFound} answers`;
  } else {
    countLine = `${totalFound} answers, showing the closest ${maxResults}`;
  }

  return {
    results: sliced,
    totalFound,
    countLine
  };
}
