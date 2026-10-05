/**
 * House of Kaira - Privacy Policy Search Engine
 * Implementation of Section 8 (How search works) of Build Specification v2.0
 */

import { ALL_PRIVACY_CLAUSES, ALL_REGISTER_ROWS } from '../../data/privacy/privacyRegistry.js';
import { PRIVACY_SYNONYMS, IGNORED_COMMON_WORDS } from '../../data/privacy/privacyKeywords.js';

// Levenshtein helper for 1-edit typo tolerance (words of 5+ letters)
function isWithinOneEdit(s1, s2) {
  if (s1 === s2) return true;
  const len1 = s1.length;
  const len2 = s2.length;
  if (Math.abs(len1 - len2) > 1) return false;

  let i = 0;
  let j = 0;
  let diffCount = 0;

  while (i < len1 && j < len2) {
    if (s1[i] !== s2[j]) {
      diffCount++;
      if (diffCount > 1) return false;
      if (len1 > len2) {
        i++;
      } else if (len2 > len1) {
        j++;
      } else {
        i++;
        j++;
      }
    } else {
      i++;
      j++;
    }
  }

  if (i < len1 || j < len2) {
    diffCount++;
  }

  return diffCount <= 1;
}

/**
 * Normalizes query string into tokens, filtering ignored common words with active-typing support.
 * Section 8.1
 */
export function tokenizeQuery(query) {
  if (!query) return [];
  const rawTokens = query
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9₹\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);

  if (rawTokens.length === 0) return [];

  const endsWithSpace = query.endsWith(' ');
  const allAreIgnored = rawTokens.every(t => IGNORED_COMMON_WORDS.has(t));

  if (allAreIgnored) {
    return rawTokens;
  }

  // Filter out common words, but keep the last token if actively typing
  return rawTokens.filter((token, idx) => {
    const isLastToken = idx === rawTokens.length - 1;
    if (isLastToken && !endsWithSpace) {
      return true;
    }
    return !IGNORED_COMMON_WORDS.has(token);
  });
}

/**
 * Splits text into cleaned words
 */
function getWords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9₹\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Calculates score for a search token against target text:
 * 3 for exact match
 * 2 for prefix match (starts with token)
 * 1 for typo match (if token length >= 5 and 1 edit away)
 * 0 otherwise
 */
function scoreTokenAgainstWords(searchToken, targetWords) {
  if (!searchToken || !targetWords || targetWords.length === 0) return 0;
  
  let best = 0;
  for (const tw of targetWords) {
    if (tw === searchToken) {
      return 3;
    }
    if (tw.startsWith(searchToken)) {
      if (best < 2) best = 2;
    } else if (searchToken.length >= 5 && isWithinOneEdit(searchToken, tw.slice(0, searchToken.length))) {
      if (best < 1) best = 1;
    }
  }
  return best;
}

/**
 * Expands a token into synonyms
 */
function getSynonymsForToken(token) {
  if (token.length < 3) return [];
  const alternatives = new Set();

  for (const [key, synList] of Object.entries(PRIVACY_SYNONYMS)) {
    const keyMatches =
      key === token ||
      key.startsWith(token) ||
      (token.length >= 5 && isWithinOneEdit(token, key));

    if (keyMatches) {
      synList.forEach(syn => {
        const words = syn.split(/\s+/);
        words.forEach(w => {
          const cleanW = w.toLowerCase().replace(/[^a-z0-9₹]/g, '');
          if (cleanW && cleanW !== token) {
            alternatives.add(cleanW);
          }
        });
      });
    }
  }

  return Array.from(alternatives);
}

/**
 * Parses query for clause / subclause numbers.
 * Supports "7", "7.", "7.4", "clause 26", "c 7.4", etc.
 * Section 8.2
 */
export function parseClauseNumberQuery(query) {
  const clean = query.trim().toLowerCase().replace(/^clause\s*|^c\s*/i, '');
  
  // 1. Partial dot match: e.g. "7."
  const dotPartialMatch = clean.match(/^(\d+)\.$/);
  if (dotPartialMatch) {
    return {
      isNumberQuery: true,
      clauseNumber: parseInt(dotPartialMatch[1], 10),
      subclauseNumber: null,
      isPrefixDot: true
    };
  }

  // 2. Exact or partial subclause: e.g. "7.4"
  const subMatch = clean.match(/^(\d+)\.(\d+)$/);
  if (subMatch) {
    return {
      isNumberQuery: true,
      clauseNumber: parseInt(subMatch[1], 10),
      subclauseNumber: clean,
      isPrefixDot: false
    };
  }

  // 3. Exact clause number: e.g. "7" or "26"
  const numMatch = clean.match(/^(\d+)$/);
  if (numMatch) {
    return {
      isNumberQuery: true,
      clauseNumber: parseInt(numMatch[1], 10),
      subclauseNumber: null,
      isPrefixDot: false
    };
  }

  return { isNumberQuery: false, clauseNumber: null, subclauseNumber: null, isPrefixDot: false };
}

/**
 * Pre-compiled searchable indexes for fast execution
 */
function buildSearchIndex() {
  const items = [];

  // 1. Regular Clauses (47 items)
  ALL_PRIVACY_CLAUSES.forEach(clause => {
    let combinedText = "";
    if (clause.subclauses) {
      combinedText += clause.subclauses.map(s => s.text).join(" ");
    }

    items.push({
      type: 'clause',
      itemNumber: clause.number,
      clauseNumber: clause.number,
      subclauseNumber: null,
      title: clause.title,
      context: clause.partName,
      anchor: clause.anchor,
      titleWords: getWords(clause.title),
      keywordWords: getWords(`${clause.keywords} ${clause.partName}`),
      textWords: getWords(combinedText),
      rawTitle: clause.title,
      rawKeywords: `${clause.keywords} ${clause.partName}`,
      rawText: combinedText,
      subclauses: clause.subclauses || []
    });

    // Also index individual subclauses if present
    if (clause.subclauses) {
      clause.subclauses.forEach(sub => {
        items.push({
          type: 'clause_subclause',
          itemNumber: clause.number,
          clauseNumber: clause.number,
          subclauseNumber: sub.number,
          title: sub.label ? `${sub.number} ${sub.label}` : clause.title,
          context: `${clause.number} · ${clause.title}`,
          anchor: sub.anchor,
          titleWords: getWords(sub.label || clause.title),
          keywordWords: getWords(`${clause.keywords} ${clause.partName}`),
          textWords: getWords(sub.text),
          rawTitle: sub.label || clause.title,
          rawKeywords: `${clause.keywords} ${clause.partName}`,
          rawText: sub.text
        });
      });
    }
  });

  // 2. Register Rows (14 items from clauses 7 & 8)
  ALL_REGISTER_ROWS.forEach(row => {
    const rowText = row.rows.map(r => `${r.label} ${r.text}`).join(" ");

    items.push({
      type: 'register_row',
      itemNumber: row.clauseNumber,
      clauseNumber: row.clauseNumber,
      subclauseNumber: row.subclauseNumber,
      title: row.title,
      context: row.clauseTitle,
      anchor: row.anchor,
      titleWords: getWords(row.title),
      keywordWords: getWords(row.clauseTitle),
      textWords: getWords(rowText),
      rawTitle: row.title,
      rawKeywords: row.clauseTitle,
      rawText: rowText,
      rows: row.rows
    });
  });

  return items;
}

const SEARCH_INDEX = buildSearchIndex();

/**
 * Main Search Execution
 * Section 8.3, 8.4, 8.5
 */
export function searchPrivacyPolicy(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const trimmed = query.trim();
  const numQuery = parseClauseNumberQuery(trimmed);

  // Direct Clause Number / Prefix Dot Query (Section 8.2)
  if (numQuery.isNumberQuery && numQuery.clauseNumber !== null) {
    if (numQuery.subclauseNumber) {
      // Subclause match (e.g. "7.4")
      const matches = SEARCH_INDEX.filter(item => item.subclauseNumber === numQuery.subclauseNumber);
      if (matches.length > 0) {
        return matches.map(item => ({
          type: item.type,
          clauseNumber: item.clauseNumber,
          subclauseNumber: item.subclauseNumber,
          numberDisplay: item.subclauseNumber,
          title: item.title,
          context: item.context,
          anchor: item.anchor,
          score: 1000,
          matchedWords: [trimmed]
        }));
      }
    }

    // Prefix dot query (e.g. "7.") or clause number query (e.g. "7")
    const matchingItems = SEARCH_INDEX.filter(item => item.clauseNumber === numQuery.clauseNumber);
    if (matchingItems.length > 0) {
      // If prefix dot ("7."), put subclauses / register rows first
      const sorted = [...matchingItems].sort((a, b) => {
        if (numQuery.isPrefixDot) {
          if (a.subclauseNumber && !b.subclauseNumber) return -1;
          if (!a.subclauseNumber && b.subclauseNumber) return 1;
        }
        if (a.subclauseNumber && b.subclauseNumber) {
          return a.subclauseNumber.localeCompare(b.subclauseNumber, undefined, { numeric: true });
        }
        return 0;
      });

      return sorted.map((item, idx) => ({
        type: item.type,
        clauseNumber: item.clauseNumber,
        subclauseNumber: item.subclauseNumber,
        numberDisplay: item.subclauseNumber || String(item.clauseNumber),
        title: item.title,
        context: item.context,
        anchor: item.anchor,
        score: 1000 - idx,
        matchedWords: [trimmed]
      }));
    }
  }

  const tokens = tokenizeQuery(trimmed);
  if (tokens.length === 0) {
    return [];
  }

  const results = [];
  const isPhrase = tokens.length > 1;
  const fullPhrase = tokens.join(' ');

  for (const entry of SEARCH_INDEX) {
    let allTokensMatched = true;
    let totalScore = 0;
    const matchedWords = new Set();

    for (const token of tokens) {
      // 1. Direct Token Match (Title x3, Keywords x1.5, Text x1)
      const titleScore = scoreTokenAgainstWords(token, entry.titleWords);
      const kwScore = scoreTokenAgainstWords(token, entry.keywordWords);
      const textScore = scoreTokenAgainstWords(token, entry.textWords);

      let bestWeighted = titleScore * 3 + kwScore * 1.5 + textScore * 1;

      if (bestWeighted > 0) {
        matchedWords.add(token);
      } else {
        // 2. Synonyms Match (at 60% weight multiplier)
        const synonyms = getSynonymsForToken(token);
        for (const syn of synonyms) {
          const synWords = getWords(syn);
          let maxSynTitle = 0;
          let maxSynKw = 0;
          let maxSynText = 0;

          for (const sw of synWords) {
            maxSynTitle = Math.max(maxSynTitle, scoreTokenAgainstWords(sw, entry.titleWords));
            maxSynKw = Math.max(maxSynKw, scoreTokenAgainstWords(sw, entry.keywordWords));
            maxSynText = Math.max(maxSynText, scoreTokenAgainstWords(sw, entry.textWords));
          }

          const synWeighted = (maxSynTitle * 3 + maxSynKw * 1.5 + maxSynText * 1) * 0.6;
          if (synWeighted > bestWeighted) {
            bestWeighted = synWeighted;
            // Highlighting note (Section 8.5): highlight parts of words that begin with typed word (not synonyms)
          }
        }
      }

      if (bestWeighted <= 0) {
        allTokensMatched = false;
        break;
      }

      totalScore += bestWeighted;
    }

    if (allTokensMatched && totalScore > 0) {
      // Phrase bonus: +10 if 2+ words appear in title or keyword list
      if (isPhrase) {
        const normTitle = entry.rawTitle.toLowerCase();
        const normKeywords = entry.rawKeywords.toLowerCase();
        if (normTitle.includes(fullPhrase) || normKeywords.includes(fullPhrase)) {
          totalScore += 10;
        }
      }

      const numberDisplay = entry.subclauseNumber ? entry.subclauseNumber : String(entry.clauseNumber);

      results.push({
        type: entry.type,
        clauseNumber: entry.clauseNumber,
        subclauseNumber: entry.subclauseNumber,
        numberDisplay,
        title: entry.title,
        context: entry.context,
        anchor: entry.anchor,
        score: totalScore,
        matchedWords: Array.from(matchedWords)
      });
    }
  }

  // Sort by highest score first; tie break by clause order, then subclause order (Section 8.5)
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.clauseNumber !== b.clauseNumber) {
      return a.clauseNumber - b.clauseNumber;
    }
    if (a.subclauseNumber && b.subclauseNumber) {
      return a.subclauseNumber.localeCompare(b.subclauseNumber, undefined, { numeric: true });
    }
    return 0;
  });

  return results;
}

/**
 * Highlights matched typed words at word beginnings inside titles
 * Section 8.5
 */
export function highlightTitleMatches(title, matchedWords) {
  if (!title || !matchedWords || matchedWords.length === 0) return title;

  const escaped = matchedWords
    .filter(w => w && w.length >= 2)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (escaped.length === 0) return title;

  const regex = new RegExp(`\\b(${escaped.join('|')})[a-zA-Z0-9₹]*`, 'gi');
  return title.replace(regex, '<mark class="privacy-search-highlight">$&</mark>');
}

export default {
  searchPrivacyPolicy,
  highlightTitleMatches,
  tokenizeQuery,
  parseClauseNumberQuery
};
