/**
 * House of Kaira - Deposit Policy Search Engine
 * Section 6.6 & 7.9 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import { DEPOSIT_SECTIONS } from '../../data/deposit/depositRegistry.js';
import { DEPOSIT_STOP_WORDS, DEPOSIT_SEARCH_SYNONYMS } from '../../data/deposit/depositSynonyms.js';

// Pre-flatten all questions with precomputed search tokens for fast matching
const flattenedQuestions = [];
DEPOSIT_SECTIONS.forEach((section, sIdx) => {
  section.questions.forEach((q, qIdx) => {
    // Extract plain text from content
    const answerText = q.content
      .map(block => {
        if (block.type === 'p' || block.type === 'note') {
          let str = block.text || '';
          if (block.links) {
            str += ' ' + block.links.map(l => l.label + (l.suffix || '')).join(' ');
          }
          return str;
        }
        if (block.type === 'ul' && Array.isArray(block.items)) {
          return block.items.join(' ');
        }
        return '';
      })
      .join(' ')
      .toLowerCase();

    flattenedQuestions.push({
      id: q.id,
      question: q.question,
      questionLower: q.question.toLowerCase(),
      keywordsLower: (q.keywords || '').toLowerCase(),
      answerTextLower: answerText,
      sectionId: section.id,
      sectionTitle: `${section.number} ${section.title}`,
      orderIndex: sIdx * 100 + qIdx
    });
  });
});

/**
 * Tokenizes and cleans a query string, dropping stop words
 */
export const cleanQueryWords = (rawQuery) => {
  if (!rawQuery || typeof rawQuery !== 'string') return [];
  // Remove punctuation except ₹, lowercase, split on whitespace
  const sanitized = rawQuery
    .toLowerCase()
    .replace(/[^\w\s₹]/g, ' ')
    .trim();

  if (!sanitized) return [];

  const rawWords = sanitized.split(/\s+/).filter(Boolean);
  const filteredWords = rawWords.filter(w => !DEPOSIT_STOP_WORDS.has(w));

  // If all typed words were stop words (e.g. "what is"), return raw words so search doesn't return 0 prematurely
  return filteredWords.length > 0 ? filteredWords : rawWords;
};

/**
 * Checks if targetText contains any word starting with prefix
 */
const hasWordStartingWith = (targetText, prefix) => {
  if (!targetText || !prefix) return false;
  // Match prefix at start of text or following a non-word boundary
  const regex = new RegExp(`(?:^|[\\s.,;!?()"'\\[\\]{}/-])${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  return regex.test(targetText);
};

/**
 * Searches the deposit policy answers
 * @param {string} query - The search query
 * @param {number} maxResults - Max results to return (default 8)
 * @returns {Object} { totalFound, results }
 */
export const searchDepositPolicy = (query, maxResults = 8) => {
  const words = cleanQueryWords(query);
  if (words.length === 0) {
    return { totalFound: 0, results: [] };
  }

  const scoredMatches = [];

  for (const item of flattenedQuestions) {
    let itemTotalScore = 0;
    let matchesAllWords = true;

    for (const word of words) {
      const synonyms = DEPOSIT_SEARCH_SYNONYMS[word] || [];
      let wordScore = 0;

      // 1. Direct question match (6 points)
      if (hasWordStartingWith(item.questionLower, word)) {
        wordScore = Math.max(wordScore, 6);
      }
      // 2. Synonym question match (4 points)
      else if (synonyms.some(syn => hasWordStartingWith(item.questionLower, syn))) {
        wordScore = Math.max(wordScore, 4);
      }

      // 3. Direct keywords match (3 points)
      if (hasWordStartingWith(item.keywordsLower, word)) {
        wordScore = Math.max(wordScore, 3);
      }
      // 4. Synonym keywords match (2 points)
      else if (synonyms.some(syn => hasWordStartingWith(item.keywordsLower, syn))) {
        wordScore = Math.max(wordScore, 2);
      }

      // 5. Direct answer text match (2 points)
      if (hasWordStartingWith(item.answerTextLower, word)) {
        wordScore = Math.max(wordScore, 2);
      }
      // 6. Synonym answer text match (1 point)
      else if (synonyms.some(syn => hasWordStartingWith(item.answerTextLower, syn))) {
        wordScore = Math.max(wordScore, 1);
      }

      // Every word in query must match
      if (wordScore === 0) {
        matchesAllWords = false;
        break;
      }

      itemTotalScore += wordScore;
    }

    if (matchesAllWords && itemTotalScore > 0) {
      scoredMatches.push({
        id: item.id,
        question: item.question,
        sectionTitle: item.sectionTitle,
        orderIndex: item.orderIndex,
        score: itemTotalScore
      });
    }
  }

  // Sort by highest score first; ties preserve document order
  scoredMatches.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.orderIndex - b.orderIndex;
  });

  return {
    totalFound: scoredMatches.length,
    results: scoredMatches.slice(0, maxResults)
  };
};

export default searchDepositPolicy;
