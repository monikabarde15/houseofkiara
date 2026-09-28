/**
 * Exact Search Scoring Engine for Refund & Cancellation Policy
 * Spec v1.2 · Section 12.7
 */

import { ALL_REFUND_QUESTIONS, POLICY_SECTIONS } from "../data/refunds/refundPolicyRegistry.js";
import { REFUND_SEARCH_SYNONYMS, FILLER_WORDS } from "../data/refunds/refundKeywords.js";
import { replaceTokensInText } from "../data/refunds/refundTokens.js";

// Levenshtein distance helper (checks if strings differ by at most 1 edit: insertion, deletion, change)
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
 * Normalizes input:
 * Lower case. Remove apostrophes (’ and ').
 * Replace every character that is not a–z, 0–9, ₹ or a space with a space.
 */
export function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9₹\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits text into individual words
 */
export function splitWords(text) {
  const norm = normalizeText(text);
  return norm ? norm.split(" ").filter(Boolean) : [];
}

/**
 * Strips formatting tokens and Markdown syntax for search
 */
export function stripFormatting(text) {
  if (!text) return "";
  const tokenResolved = replaceTokensInText(text);
  return tokenResolved
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[->]\s+/gm, "")
    .replace(/\[\[steps\]\]/g, "You cancel in My Account or on WhatsApp We confirm the same day Your refund is started straight away It reaches you in 5 to 7 business days")
    .replace(/\*([^*]+)\*/g, "$1");
}

/**
 * Computes word match score for a search word against an answer word:
 * 3 if identical
 * 2 if the answer word starts with it
 * 1 if search word length >= 5 and differs by at most 1 edit from the first N, N+1, or N-1 letters of answer word
 * otherwise 0
 */
function getWordMatchScore(searchWord, targetWord) {
  if (!searchWord || !targetWord) return 0;
  if (targetWord === searchWord) return 3;
  if (targetWord.startsWith(searchWord)) return 2;

  const N = searchWord.length;
  if (N >= 5) {
    // Check first N, N+1, N-1 letters of targetWord
    const prefixes = [
      targetWord.slice(0, N),
      targetWord.slice(0, N + 1),
      targetWord.slice(0, Math.max(1, N - 1)),
    ];

    for (const prefix of prefixes) {
      if (prefix && isWithinOneEdit(searchWord, prefix)) {
        return 1;
      }
    }
  }

  return 0;
}

/**
 * Returns alternative synonym words for a given search word
 */
function getSynonymsForWord(searchWord) {
  if (searchWord.length < 3) return [];
  const alternatives = new Set();

  for (const [key, synList] of Object.entries(REFUND_SEARCH_SYNONYMS)) {
    const keyMatches =
      key.startsWith(searchWord) ||
      (searchWord.length >= 5 && isWithinOneEdit(searchWord, key));

    if (keyMatches) {
      for (const syn of synList) {
        // Only single-word synonyms as alternatives
        const words = syn.split(" ");
        for (const w of words) {
          const normW = normalizeText(w);
          if (normW && normW !== searchWord) {
            alternatives.add(normW);
          }
        }
      }
    }
  }

  return Array.from(alternatives);
}

/**
 * Computes section titles map for question keywords
 */
const SECTION_TITLES = {};
for (const [tabKey, sections] of Object.entries(POLICY_SECTIONS)) {
  for (const sec of sections) {
    const cleanTitle = sec.title.replace(/\*/g, "");
    if (!SECTION_TITLES[sec.id]) {
      SECTION_TITLES[sec.id] = new Set();
    }
    SECTION_TITLES[sec.id].add(cleanTitle);
    SECTION_TITLES[sec.id].add(sec.barLabel);
  }
}

/**
 * Prepares searchable content for all questions
 */
const SEARCH_INDEX = ALL_REFUND_QUESTIONS.map((q) => {
  const cleanQ = stripFormatting(q.q);
  const qWords = splitWords(cleanQ);

  const sectionTitles = Array.from(SECTION_TITLES[q.sec] || []).join(" ");
  const cleanKw = `${q.kw || ""} ${sectionTitles}`;
  const kwWords = splitWords(cleanKw);

  const cleanAns = Array.isArray(q.a)
    ? q.a.map((line) => stripFormatting(line)).join(" ")
    : stripFormatting(q.a);
  const aWords = splitWords(cleanAns);

  return {
    item: q,
    cleanQ,
    qWords,
    cleanKw,
    kwWords,
    cleanAns,
    aWords,
  };
});

/**
 * Highlights matching word beginnings in question text
 */
export function highlightQuestionMatches(questionText, searchWords) {
  if (!questionText || !searchWords || searchWords.length === 0) {
    return questionText;
  }

  // Create regex pattern to match word starts for all search words (excluding inside HTML entities)
  const escapedWords = searchWords
    .filter((w) => w.length >= 2)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (escapedWords.length === 0) return questionText;

  // We want to wrap matching portions with <mark>...</mark>
  const pattern = new RegExp(`\\b(${escapedWords.join("|")})[a-zA-Z0-9]*`, "gi");

  return questionText.replace(pattern, (match) => {
    return `<mark>${match}</mark>`;
  });
}

/**
 * Main Search Function
 * @param {string} rawQuery - The typed query string
 * @param {string} currentTab - 'rental' | 'preloved'
 * @returns {Array|null} Array of matching question objects or null if input too short
 */
export function searchRefundPolicy(rawQuery, currentTab = "rental") {
  if (!rawQuery) return null;

  const rawTrimmed = rawQuery.trim();
  if (!rawTrimmed) return null;

  const endsWithSpace = rawQuery.endsWith(" ");
  const rawWords = splitWords(rawQuery);

  if (rawWords.length === 0) return null;

  // Search words filter rules per Section 12.7:
  // Drop filler words: the, and, can, my, is, it, do, if, of, to, in, on, for, what, how, an, get, does, will, am, me, at, or, be, a, i.
  // Exception: the last word is kept if the visitor is still typing it (no space typed after it), so "can" still finds "cancel".
  // If every word is a filler word, keep them all.
  // Then drop any single-letter word. If nothing is left, the results panel stays closed.

  let searchWords = [];
  const allAreFillers = rawWords.every((w) => FILLER_WORDS.has(w));

  if (allAreFillers) {
    searchWords = [...rawWords];
  } else {
    searchWords = rawWords.filter((w, idx) => {
      const isLastWord = idx === rawWords.length - 1;
      if (isLastWord && !endsWithSpace) {
        return true; // Keep last word if user is still typing it
      }
      return !FILLER_WORDS.has(w);
    });
  }

  // Drop single-letter words
  searchWords = searchWords.filter((w) => w.length > 1);

  if (searchWords.length === 0) {
    return null; // Results panel stays closed
  }

  const results = [];
  const phraseQuery = normalizeText(rawQuery);
  const isMultiWord = rawWords.length >= 2;

  for (const entry of SEARCH_INDEX) {
    const { item, cleanQ, qWords, kwWords, aWords } = entry;

    let allWordsMatched = true;
    let totalScore = 0;

    for (const searchWord of searchWords) {
      // Find best match for original searchWord
      let bestQScore = 0;
      for (const w of qWords) {
        const score = getWordMatchScore(searchWord, w);
        if (score > bestQScore) bestQScore = score;
        if (bestQScore === 3) break;
      }

      let bestKwScore = 0;
      for (const w of kwWords) {
        const score = getWordMatchScore(searchWord, w);
        if (score > bestKwScore) bestKwScore = score;
        if (bestKwScore === 3) break;
      }

      let bestAScore = 0;
      for (const w of aWords) {
        const score = getWordMatchScore(searchWord, w);
        if (score > bestAScore) bestAScore = score;
        if (bestAScore === 3) break;
      }

      let bestWordWeighted = bestQScore * 3 + bestKwScore * 1.5 + bestAScore * 1;

      // Check synonyms (for 3+ letters) at 0.6x
      const synonyms = getSynonymsForWord(searchWord);
      for (const syn of synonyms) {
        let synQ = 0;
        for (const w of qWords) {
          const score = getWordMatchScore(syn, w);
          if (score > synQ) synQ = score;
          if (synQ === 3) break;
        }

        let synKw = 0;
        for (const w of kwWords) {
          const score = getWordMatchScore(syn, w);
          if (score > synKw) synKw = score;
          if (synKw === 3) break;
        }

        let synA = 0;
        for (const w of aWords) {
          const score = getWordMatchScore(syn, w);
          if (score > synA) synA = score;
          if (synA === 3) break;
        }

        const synWeighted = (synQ * 3 + synKw * 1.5 + synA * 1) * 0.6;
        if (synWeighted > bestWordWeighted) {
          bestWordWeighted = synWeighted;
        }
      }

      if (bestWordWeighted <= 0) {
        allWordsMatched = false;
        break;
      }

      totalScore += bestWordWeighted;
    }

    if (allWordsMatched && totalScore > 0) {
      // Ranking bonus: +0.5 if belongs to current tab
      const isCurrentTab =
        item.for === "both" ||
        (currentTab === "rental" ? item.for === "rent" : item.for === "pre");
      if (isCurrentTab) {
        totalScore += 0.5;
      }

      // Ranking bonus: +10 if typed text (2+ words) appears as a phrase in the question
      if (isMultiWord && normalizeText(cleanQ).includes(phraseQuery)) {
        totalScore += 10;
      }

      // Determine sub-line policy/section label (Section 04.5)
      let policySectionLabel = "";
      if (item.for === "both") {
        const sectionObj = POLICY_SECTIONS[currentTab]?.find((s) => s.id === item.sec);
        policySectionLabel = `Both policies · ${sectionObj?.barLabel || ""}`;
      } else if (item.for === "rent") {
        const sectionObj = POLICY_SECTIONS.rental?.find((s) => s.id === item.sec);
        policySectionLabel = `Rental policy · ${sectionObj?.barLabel || ""}`;
      } else {
        const sectionObj = POLICY_SECTIONS.preloved?.find((s) => s.id === item.sec);
        policySectionLabel = `Preloved policy · ${sectionObj?.barLabel || ""}`;
      }

      results.push({
        ...item,
        score: totalScore,
        policySectionLabel,
        highlightedQuestion: highlightQuestionMatches(item.q, searchWords),
      });
    }
  }

  // Sort by highest score first, keeping original order on ties
  results.sort((a, b) => b.score - a.score);

  return results;
}
