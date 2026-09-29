/**
 * House of Kaira - Terms & Conditions Search Engine
 * Implementation of Section 7 (Search rules) of Build Specification v3.0
 * Supports prefix matching, active typing buffer, clause numbers, and synonyms.
 */

import { ALL_CLAUSES, DEFINITIONS } from '../../data/terms/termsRegistry.js';
import { TERMS_SYNONYMS, IGNORED_COMMON_WORDS } from '../../data/terms/termsKeywords.js';

/**
 * Normalizes query string into tokens, filtering ignored common words with active-typing support.
 * @param {string} query 
 * @returns {string[]}
 */
export function tokenizeQuery(query) {
  if (!query) return [];
  const rawTokens = query
    .toLowerCase()
    .replace(/[^\w\s.]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);

  if (rawTokens.length === 0) return [];

  const endsWithSpace = query.endsWith(' ');
  const allAreIgnored = rawTokens.every(t => IGNORED_COMMON_WORDS.has(t));

  if (allAreIgnored) {
    return rawTokens.filter(t => t.length > 1);
  }

  // Filter out ignored words, but keep the last token if the user is actively typing it
  return rawTokens.filter((token, idx) => {
    const isLastToken = idx === rawTokens.length - 1;
    if (isLastToken && !endsWithSpace) {
      return token.length > 1;
    }
    return token.length > 1 && !IGNORED_COMMON_WORDS.has(token);
  });
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
    
    // Check synonyms dictionary for exact or prefix matches
    for (const [key, synList] of Object.entries(TERMS_SYNONYMS)) {
      if (key === token || key.startsWith(token) || (token.length >= 4 && token.startsWith(key))) {
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
 * Tests if target text contains candidate token with word-prefix priority.
 * Returns score: 3 for whole word match, 2 for prefix match, 1 for substring match, 0 for none.
 * @param {string} target 
 * @param {string} candidate 
 * @returns {number}
 */
function scoreTargetMatch(target, candidate) {
  if (!target || !candidate) return 0;
  const t = target.toLowerCase();
  const c = candidate.toLowerCase();

  const words = t.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  let best = 0;

  for (const w of words) {
    if (w === c) {
      return 3;
    }
    if (w.startsWith(c)) {
      if (best < 2) best = 2;
    }
  }

  if (best > 0) return best;

  if (c.length >= 4 && t.includes(c)) {
    return 1;
  }

  return 0;
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

      // 1. Heading match (Weight: up to 4.0)
      const titleScore = scoreTargetMatch(clause.title, word);
      if (titleScore > 0) {
        score += titleScore * 1.5 * weightMultiplier;
        matchedWords.add(word);
      }

      // 2. Hidden keywords match (Weight: up to 2.0)
      const kwScore = scoreTargetMatch(clause.keywords, word);
      if (kwScore > 0) {
        score += kwScore * 1.0 * weightMultiplier;
        matchedWords.add(word);
      }

      // 3. Subclauses text match (Weight: up to 1.5)
      clause.subclauses.forEach(sub => {
        const subMatchScore = scoreTargetMatch(sub.text, word);
        if (subMatchScore > 0) {
          const weightedSub = subMatchScore * 0.8 * weightMultiplier;
          if (weightedSub > highestSubScore) {
            highestSubScore = weightedSub;
            bestSnippet = sub.text;
            matchedSubclauseNumber = sub.number;
          }
          matchedWords.add(word);
        }
      });

      // Special definitions check for clause 4
      if (clause.number === 4 && clause.definitions) {
        clause.definitions.forEach(def => {
          const defTermScore = scoreTargetMatch(def.term, word);
          const defMeaningScore = scoreTargetMatch(def.meaning, word);
          const maxDef = Math.max(defTermScore, defMeaningScore);
          if (maxDef > 0) {
            score += maxDef * 1.2 * weightMultiplier;
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
 * Highlights matched keywords and prefixes within a snippet text.
 * @param {string} text - Raw snippet text.
 * @param {string[]} matchedWords - List of matched words to highlight.
 * @returns {string} - HTML string with <mark> tags.
 */
export function highlightMatches(text, matchedWords) {
  if (!text || !matchedWords || matchedWords.length === 0) return text;
  
  const escaped = matchedWords
    .filter(w => w && w.length >= 2)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return text;
  
  const regex = new RegExp(`\\b(${escaped.join('|')})[a-zA-Z0-9]*`, 'gi');
  return text.replace(regex, '<mark class="terms-search-highlight">$&</mark>');
}
