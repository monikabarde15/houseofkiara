/**
 * House of Kaira - Terms & Conditions Search Engine
 * Implementation of Section 7 (Search rules) of Build Specification v3.0
 */

import { ALL_CLAUSES, DEFINITIONS } from '../../data/terms/termsRegistry.js';
import { TERMS_SYNONYMS, IGNORED_COMMON_WORDS } from '../../data/terms/termsKeywords.js';

/**
 * Normalizes query string into tokens, filtering ignored common words.
 * @param {string} query 
 * @returns {string[]}
 */
export function tokenizeQuery(query) {
  if (!query) return [];
  return query
    .toLowerCase()
    .replace(/[^\w\s.]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0 && !IGNORED_COMMON_WORDS.has(token));
}

/**
 * Expands tokens with configured synonyms.
 * @param {string[]} tokens 
 * @returns {Array<{ word: string, isSynonym: boolean }>}
 */
export function expandSynonyms(tokens) {
  const expanded = [];
  
  tokens.forEach(token => {
    expanded.push({ word: token, isSynonym: false });
    
    // Check synonyms dictionary
    for (const [key, synList] of Object.entries(TERMS_SYNONYMS)) {
      if (key.startsWith(token) || token.startsWith(key)) {
        synList.forEach(syn => {
          if (!expanded.some(e => e.word === syn)) {
            expanded.push({ word: syn, isSynonym: true });
          }
        });
      }
    }
  });

  return expanded;
}

/**
 * Tests if target word starts with or contains candidate token.
 * @param {string} target 
 * @param {string} candidate 
 * @returns {boolean}
 */
function wordMatches(target, candidate) {
  if (!target || !candidate) return false;
  const t = target.toLowerCase();
  const c = candidate.toLowerCase();
  return t.includes(c);
}

/**
 * Checks if search query is a specific clause number reference.
 * Handles "20", "20.4", "clause 26", "clause 27.1", "c20", etc.
 * @param {string} query 
 * @returns {{ isNumberQuery: boolean, clauseNumber: number|null, subclauseNumber: string|null }}
 */
export function parseClauseNumberQuery(query) {
  const clean = query.trim().toLowerCase().replace(/^clause\s*|^c\s*/i, '');
  const subMatch = clean.match(/^(\d+)\.(\d+)$/);
  if (subMatch) {
    return {
      isNumberQuery: true,
      clauseNumber: parseInt(subMatch[1], 10),
      subclauseNumber: clean
    };
  }
  const numMatch = clean.match(/^(\d+)$/);
  if (numMatch) {
    return {
      isNumberQuery: true,
      clauseNumber: parseInt(numMatch[1], 10),
      subclauseNumber: null
    };
  }
  return { isNumberQuery: false, clauseNumber: null, subclauseNumber: null };
}

/**
 * Executes search across all clauses and definitions.
 * @param {string} query - Raw search input string.
 * @returns {Array<Object>} - Ranked search results.
 */
export function searchTerms(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const trimmed = query.trim();
  const numQuery = parseClauseNumberQuery(trimmed);

  // Direct clause number match gets highest rank
  if (numQuery.isNumberQuery && numQuery.clauseNumber !== null) {
    const directClause = ALL_CLAUSES.find(c => c.number === numQuery.clauseNumber);
    if (directClause) {
      let matchedSub = null;
      if (numQuery.subclauseNumber) {
        matchedSub = directClause.subclauses.find(s => s.number === numQuery.subclauseNumber);
      }
      return [{
        clauseNumber: directClause.number,
        title: directClause.title,
        anchor: directClause.anchor,
        score: 1000,
        subclauseNumber: matchedSub ? matchedSub.number : null,
        snippet: matchedSub ? matchedSub.text : (directClause.subclauses[0]?.text || ''),
        matchedWords: [trimmed]
      }];
    }
  }

  const tokens = tokenizeQuery(trimmed);
  if (tokens.length === 0) {
    return [];
  }

  const expandedTokens = expandSynonyms(tokens);
  const results = [];

  ALL_CLAUSES.forEach(clause => {
    let score = 0;
    const matchedWords = new Set();
    let bestSnippet = clause.subclauses[0]?.text || '';
    let highestSubScore = 0;
    let matchedSubclauseNumber = null;

    expandedTokens.forEach(({ word, isSynonym }) => {
      const weightMultiplier = isSynonym ? 0.6 : 1.0;

      // 1. Heading match (Weight: 3.0)
      if (wordMatches(clause.title, word)) {
        score += 3.0 * weightMultiplier;
        matchedWords.add(word);
      }

      // 2. Hidden keywords match (Weight: 1.5)
      if (wordMatches(clause.keywords, word)) {
        score += 1.5 * weightMultiplier;
        matchedWords.add(word);
      }

      // 3. Subclauses text match (Weight: 1.0)
      clause.subclauses.forEach(sub => {
        let subScore = 0;
        if (wordMatches(sub.text, word)) {
          subScore += 1.0 * weightMultiplier;
          matchedWords.add(word);
        }
        if (subScore > highestSubScore) {
          highestSubScore = subScore;
          bestSnippet = sub.text;
          matchedSubclauseNumber = sub.number;
        }
      });

      // Special definitions check for clause 4
      if (clause.number === 4 && clause.definitions) {
        clause.definitions.forEach(def => {
          if (wordMatches(def.term, word) || wordMatches(def.meaning, word)) {
            score += 1.2 * weightMultiplier;
            matchedWords.add(word);
          }
        });
      }
    });

    score += highestSubScore;

    if (score > 0) {
      results.push({
        clauseNumber: clause.number,
        title: clause.title,
        anchor: clause.anchor,
        score,
        subclauseNumber: matchedSubclauseNumber,
        snippet: bestSnippet,
        matchedWords: Array.from(matchedWords)
      });
    }
  });

  // Sort by score descending, then by clause number ascending (Section 7.4)
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.clauseNumber - b.clauseNumber;
  });

  return results;
}

/**
 * Highlights matched keywords within a snippet text.
 * @param {string} text - Raw snippet text.
 * @param {string[]} matchedWords - List of matched words to highlight.
 * @returns {string} - HTML string with <mark> tags.
 */
export function highlightMatches(text, matchedWords) {
  if (!text || !matchedWords || matchedWords.length === 0) return text;
  
  const regex = new RegExp(`(${matchedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.replace(regex, '<mark class="terms-search-highlight">$1</mark>');
}
