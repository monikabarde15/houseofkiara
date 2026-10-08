/**
 * Automated Verification Audit for Seller Guidelines
 * Section 16 Build Checklist & Core Acceptance Verification
 */

import { SITE_TOKENS, SELLER_PAGE_CONFIG } from "../src/data/seller/sellerSettings.js";
import { SELLER_CHAPTERS, SELLER_QUESTIONS, getChapterById, getQuestionsByChapterId } from "../src/data/seller/sellerRegistry.js";
import { searchSellerGuidelines } from "../src/utils/seller/sellerSearch.js";
import { desktopFooterColumns, mobileFooterColumns } from "../src/components/Footer/footerData.js";
import fs from "fs";
import path from "path";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("=================================================");
console.log("SELLER GUIDELINES ACCEPTANCE AUDIT (SECTION 16)");
console.log("=================================================\n");

// 1. Chapters & Questions Verification
console.log("1. Checking Chapters & Questions Structure...");
const expectedChapters = [
  "ways", "start", "price", "care", "protect", "selling", "control", "payouts", "privacy"
];
assert(SELLER_CHAPTERS.length === 9, `Found exactly 9 chapters (got ${SELLER_CHAPTERS.length})`);
assert(
  JSON.stringify(SELLER_CHAPTERS.map(c => c.id)) === JSON.stringify(expectedChapters),
  `Chapter IDs match exact order: ${expectedChapters.join(", ")}`
);

const expectedCounts = {
  ways: 4,
  start: 9,
  price: 7,
  care: 4,
  protect: 5,
  selling: 3,
  control: 6,
  payouts: 4,
  privacy: 3
};

let totalQ = 0;
for (const [chId, count] of Object.entries(expectedCounts)) {
  const qs = getQuestionsByChapterId(chId);
  totalQ += qs.length;
  assert(qs.length === count, `Chapter '${chId}' has ${count} questions (got ${qs.length})`);
}
assert(SELLER_QUESTIONS.length === 45, `Total questions is exactly 45 (got ${SELLER_QUESTIONS.length})`);
assert(totalQ === 45, `Sum of chapter questions is exactly 45`);

// 2. Token Integrity & Usage
console.log("\n2. Checking Site Tokens...");
const requiredTokens = [
  "submission_reply",
  "payout_cycle",
  "issue_window",
  "latent_window",
  "support_whatsapp",
  "support_whatsapp_raw",
  "age_min",
  "withdraw_notice",
  "free_return_after",
  "borrow_notice",
  "handover_within",
  "page_updated"
];

for (const t of requiredTokens) {
  assert(SITE_TOKENS[t] !== undefined && SITE_TOKENS[t] !== "", `Token '${t}' is defined: "${SITE_TOKENS[t]}"`);
}

// Ensure no raw un-interpolated {{token}} placeholders remain in questions
let unreplacedTokens = 0;
for (const q of SELLER_QUESTIONS) {
  const jsonStr = JSON.stringify(q);
  if (jsonStr.includes("{{") || jsonStr.includes("}}")) {
    unreplacedTokens++;
    console.error(`Unreplaced token in question: ${q.id}`);
  }
}
assert(unreplacedTokens === 0, `All dynamic tokens interpolated (0 unreplaced {{tokens}} found)`);

// 3. Punctuation Dash Ban Audit
console.log("\n3. Checking Strict Punctuation Dash Ban (No —, –, or ' - ')...");
let dashErrors = 0;
for (const q of SELLER_QUESTIONS) {
  // Check title, tag text, and all string contents in body
  const checkText = (txt, location) => {
    if (typeof txt !== "string") return;
    if (txt.includes("—") || txt.includes("–") || txt.includes(" - ")) {
      dashErrors++;
      console.error(`Punctuation dash detected in ${location}: "${txt}"`);
    }
  };

  checkText(q.title, `${q.id}.title`);
  if (q.tag) checkText(q.tag.text, `${q.id}.tag.text`);
  if (Array.isArray(q.body)) {
    for (const b of q.body) {
      if (b.type === "p") checkText(b.text, `${q.id}.p`);
      if (b.type === "ul" && Array.isArray(b.items)) {
        b.items.forEach((item, idx) => checkText(item, `${q.id}.ul[${idx}]`));
      }
      if (b.type === "steps" && Array.isArray(b.items)) {
        b.items.forEach((item, idx) => {
          checkText(item.title, `${q.id}.step.title`);
          checkText(item.text, `${q.id}.step.text`);
        });
      }
      if (b.type === "grades" && Array.isArray(b.items)) {
        b.items.forEach((item, idx) => {
          checkText(item.name, `${q.id}.grade.name`);
          checkText(item.text, `${q.id}.grade.text`);
        });
      }
    }
  }
}
assert(dashErrors === 0, `Strict punctuation dash ban verified across all 45 questions (0 dashes found)`);

// 4. Search Behavior Verification (Spec Item 9)
console.log("\n4. Checking Live Search Behavior (Spec Item 9)...");
// "payo" -> shows payout answers
const resPayo = searchSellerGuidelines("payo");
assert(
  resPayo.results.length > 0 && resPayo.results.some(r => r.question.chapterId === "payouts" || r.question.id.includes("pay")),
  `"payo" matches payout answers (${resPayo.results.length} matches)`
);

// "DAMAGE" -> matches like "damage"
const resDamageUpper = searchSellerGuidelines("DAMAGE");
const resDamageLower = searchSellerGuidelines("damage");
assert(
  resDamageUpper.results.length > 0 && resDamageUpper.results.length === resDamageLower.results.length,
  `"DAMAGE" matches identically to "damage" (${resDamageUpper.results.length} matches)`
);

// "take back" -> lists "Can I take my piece back?" first
const resTakeBack = searchSellerGuidelines("take back");
assert(
  resTakeBack.results.length > 0 && resTakeBack.results[0].question.id === "take-back",
  `"take back" lists 'Can I take my piece back?' first (got '${resTakeBack.results[0]?.question?.id}')`
);

// "velvet" -> shows no match
const resVelvet = searchSellerGuidelines("velvet");
assert(resVelvet.results.length === 0, `"velvet" returns 0 matches (triggers suggestion chips & WhatsApp message)`);

// "my" alone -> shows nothing (stop word)
const resMy = searchSellerGuidelines("my");
assert(resMy.results.length === 0 && resMy.isOnlyStopWords, `"my" alone returns 0 matches and is marked as only stop words`);

// "can i" alone -> shows nothing (stop words)
const resCanI = searchSellerGuidelines("can i");
assert(resCanI.results.length === 0 && resCanI.isOnlyStopWords, `"can i" alone returns 0 matches and is marked as only stop words`);

// 5. Footer Link Integration Verification
console.log("\n5. Checking Footer Links...");
const desktopHasLink = desktopFooterColumns.some(col =>
  col.links.some(l => l.path === "/seller-guidelines" && l.label === "Seller Guidelines")
);
assert(desktopHasLink, `Desktop footer includes '/seller-guidelines' with label 'Seller Guidelines'`);

const mobileHasLink = mobileFooterColumns.some(col =>
  col.links.some(l => l.path === "/seller-guidelines" && l.label === "Seller Guidelines")
);
assert(mobileHasLink, `Mobile footer includes '/seller-guidelines' with label 'Seller Guidelines'`);

// 6. Print Styles & Skip Link in Codebase
console.log("\n6. Checking Print Styles & Skip Link...");
const chromeCss = fs.readFileSync(path.resolve("src/styles/seller/seller-chrome.css"), "utf-8");
assert(chromeCss.includes("@media print"), `seller-chrome.css contains @media print stylesheet`);
assert(chromeCss.includes(".q-ans"), `seller-chrome.css contains .q-ans rules for print`);
assert(chromeCss.includes("display: block !important"), `seller-chrome.css forces display: block !important on answers in print`);

const pageJsx = fs.readFileSync(path.resolve("src/pages/SellerGuidelinesPage.jsx"), "utf-8");
assert(pageJsx.includes('href="#ch-ways"'), `SellerGuidelinesPage.jsx contains skip link targeting '#ch-ways'`);
assert(pageJsx.includes('className="sg-skip"'), `SellerGuidelinesPage.jsx has '.sg-skip' accessibility class`);
assert(pageJsx.includes('<SellerHero'), `SellerGuidelinesPage mounts SellerHero`);
assert(pageJsx.includes('<SellerSectionBar'), `SellerGuidelinesPage mounts SellerSectionBar`);
assert(pageJsx.includes('<SellerClosingBand'), `SellerGuidelinesPage mounts SellerClosingBand`);

console.log("\n=================================================");
console.log(`AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
