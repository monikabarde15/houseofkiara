/**
 * House of Kaira - Care Policy Search Engine
 * Section 6.4 of Build Specification 2.0
 *
 * Multi-field scoring engine:
 * - Match in question title: 6 pts (4 pts via synonym)
 * - Match in search words: 3 pts (2 pts via synonym)
 * - Match in answer text: 2 pts (1 pt via synonym)
 * - Ignores common stop words
 * - Highest score first; equal scores keep original page order
 * - Returns maximum 8 results
 */

import { ALL_QUESTIONS } from "../../data/care/careRegistry.js";
import { CARE_SYNONYMS, CARE_STOP_WORDS } from "../../data/care/careSynonyms.js";

export function searchCarePolicy(rawQuery) {
  const query = (rawQuery || "").trim().toLowerCase();
  if (!query || query.length < 2) {
    return { totalFound: 0, results: [] };
  }

  // Tokenize query words, ignoring common stop words
  const terms = query
    .split(/\s+/)
    .map(t => t.replace(/[^a-z0-9]/gi, ""))
    .filter(t => t.length > 0 && !CARE_STOP_WORDS.has(t));

  if (terms.length === 0) {
    return { totalFound: 0, results: [] };
  }

  const scoredResults = [];

  for (let idx = 0; idx < ALL_QUESTIONS.length; idx++) {
    const q = ALL_QUESTIONS[idx];
    const titleLower = q.title.toLowerCase();
    const searchWordsLower = (q.searchWords || "").toLowerCase();
    const answerLower = (q.answer || "").toLowerCase();

    let totalScore = 0;
    let allTermsMatched = true;

    for (const term of terms) {
      let termScore = 0;

      // 1. Direct prefix or substring match
      const inTitle = titleLower.includes(term);
      const inSearchWords = searchWordsLower.includes(term);
      const inAnswer = answerLower.includes(term);

      if (inTitle) termScore = Math.max(termScore, 6);
      if (inSearchWords) termScore = Math.max(termScore, 3);
      if (inAnswer) termScore = Math.max(termScore, 2);

      // 2. Synonym match if no higher direct match
      if (termScore < 6) {
        const synList = CARE_SYNONYMS[term] || [];
        for (const syn of synList) {
          if (titleLower.includes(syn)) {
            termScore = Math.max(termScore, 4);
          } else if (searchWordsLower.includes(syn)) {
            termScore = Math.max(termScore, 2);
          } else if (answerLower.includes(syn)) {
            termScore = Math.max(termScore, 1);
          }
        }
      }

      if (termScore === 0) {
        allTermsMatched = false;
        break;
      }

      totalScore += termScore;
    }

    if (allTermsMatched && totalScore > 0) {
      scoredResults.push({
        question: q,
        score: totalScore,
        index: idx
      });
    }
  }

  // Sort by highest score first; equal scores retain page index order
  scoredResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  return {
    totalFound: scoredResults.length,
    results: scoredResults.slice(0, 8).map(item => item.question)
  };
}
