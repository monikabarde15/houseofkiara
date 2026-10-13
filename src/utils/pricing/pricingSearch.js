// src/utils/pricing/pricingSearch.js
// Two-sided search algorithm for Pricing & Fees specification matching Section 5.7 & 8.3

import { PRICING_SECTIONS } from "../../data/pricing/pricingRegistry";
import { PRICING_SYNONYMS, PRICING_STOP_WORDS } from "../../data/pricing/pricingSynonyms";

// Helper to normalize and tokenize text into words
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s₹]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !PRICING_STOP_WORDS.has(word));
}

// Extract all searchable questions across both sides
export function getAllPricingQuestions() {
  const allQuestions = [];
  PRICING_SECTIONS.forEach((section) => {
    section.questions.forEach((q) => {
      allQuestions.push({
        ...q,
        sectionTitle: section.title,
        sectionNumber: section.number,
      });
    });
  });
  return allQuestions;
}

// Perform scored query search
export function searchPricing(query, activeSide = "pay") {
  if (!query || typeof query !== "string") return [];
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.length < 2) return [];

  const queryTerms = tokenize(cleanQuery);
  if (queryTerms.length === 0) return [];

  const questions = getAllPricingQuestions();
  const scoredResults = [];

  questions.forEach((item) => {
    let score = 0;
    const questionLower = (item.question || "").toLowerCase();
    const summaryLower = (item.summary || "").toLowerCase();
    const keywordsLower = (item.keywords || []).map((k) => k.toLowerCase());

    queryTerms.forEach((term) => {
      // 1. Direct question match (score 6)
      if (questionLower.includes(term)) {
        score += 6;
      }

      // 2. Keyword exact match (score 3)
      const hasKeyword = keywordsLower.some((k) => k.includes(term));
      if (hasKeyword) {
        score += 3;
      }

      // 3. Summary or answer match (score 2)
      if (summaryLower.includes(term)) {
        score += 2;
      }

      // 4. Synonym expansion checks
      const synonyms = PRICING_SYNONYMS[term] || [];
      synonyms.forEach((syn) => {
        if (questionLower.includes(syn)) {
          score += 4;
        }
        if (keywordsLower.some((k) => k.includes(syn))) {
          score += 2;
        }
        if (summaryLower.includes(syn)) {
          score += 1;
        }
      });
    });

    if (score > 0) {
      // Active side bonus: +0.5 if question is on current active side
      if (item.side === activeSide) {
        score += 0.5;
      }

      scoredResults.push({
        ...item,
        score,
      });
    }
  });

  // Sort descending by score
  scoredResults.sort((a, b) => (b.score > a.score ? 1 : b.score < a.score ? -1 : 0));

  // Return top 8 results
  return scoredResults.slice(0, 8);
}
