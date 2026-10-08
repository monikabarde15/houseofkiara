/**
 * Automated Responsiveness Verification Script
 * Validates layout rules and breakpoints against Section 4 of Seller Guidelines Build Spec
 */

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

console.log("====================================================================");
console.log("RESPONSIVENESS & BREAKPOINT VERIFICATION (SECTION 4.1 & 4.2)");
console.log("====================================================================\n");

const cssDir = path.resolve("src/styles/seller");
const files = {
  variables: fs.readFileSync(path.join(cssDir, "seller-variables.css"), "utf-8"),
  chrome: fs.readFileSync(path.join(cssDir, "seller-chrome.css"), "utf-8"),
  hero: fs.readFileSync(path.join(cssDir, "seller-hero.css"), "utf-8"),
  search: fs.readFileSync(path.join(cssDir, "seller-search.css"), "utf-8"),
  bar: fs.readFileSync(path.join(cssDir, "seller-section-bar.css"), "utf-8"),
  chapters: fs.readFileSync(path.join(cssDir, "seller-chapters.css"), "utf-8"),
  features: fs.readFileSync(path.join(cssDir, "seller-features.css"), "utf-8"),
  questions: fs.readFileSync(path.join(cssDir, "seller-questions.css"), "utf-8"),
  closing: fs.readFileSync(path.join(cssDir, "seller-closing.css"), "utf-8")
};

// 1. Foundation & Variables
console.log("1. Checking Variables & Gutters at Breakpoints...");
assert(files.variables.includes("--max: 1180px"), "Container max-width set to 1180px (--max: 1180px)");
assert(files.chrome.includes("--gut: 48px") || files.variables.includes("--gut: 48px"), "Desktop gutter set to 48px");
assert(files.chrome.includes("@media (max-width: 1199px)") && files.chrome.includes("--gut: 32px"), "Tablet landscape (1199px) gutter set to 32px");
assert(files.chrome.includes("@media (max-width: 900px)") && files.chrome.includes("--gut: 28px"), "Tablet portrait (900px) gutter set to 28px");
assert(files.chrome.includes("@media (max-width: 760px)") && files.chrome.includes("--gut: 18px"), "Mobile (760px) gutter set to 18px");
assert(files.variables.includes("@media (max-width: 1199px)") && files.variables.includes("--hdr-h: 61px"), "--hdr-h switches to 61px at max-width 1199px");
assert(files.chrome.includes("overflow-x: clip"), ".sg-page prevents horizontal scroll with overflow-x: clip");

// 2. Hero Band Responsiveness
console.log("\n2. Checking Hero Band Responsiveness...");
assert(files.hero.includes("grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr)"), "Desktop hero in two columns (1.25fr and 0.85fr)");
assert(files.hero.includes("gap: 80px"), "Desktop hero column gap 80px");
assert(files.hero.includes("@media (max-width: 1199px)") && files.hero.includes("gap: 48px"), "Tablet landscape hero gap narrows to 48px");
assert(files.hero.includes("@media (max-width: 900px)") && files.hero.includes("grid-template-columns: minmax(0, 1fr)"), "Tablet portrait (900px) hero collapses to 1 column");
assert(files.hero.includes("@media (max-width: 900px)") && files.hero.includes("padding-bottom: 56px"), "Tablet portrait hero padding-bottom 56px");
assert(files.hero.includes(".sg-shield") && files.hero.includes("margin-top: 40px"), "Protection card placed 40px below search on tablet/mobile");
assert(files.hero.includes("@media (max-width: 760px)") && files.hero.includes("padding-top: 30px"), "Mobile hero padding-top 30px");

// Page Title scaling
assert(files.hero.includes("font-size: 62px"), "Desktop page title 62px");
assert(files.hero.includes("@media (max-width: 1199px)") && files.hero.includes("font-size: 52px"), "Tablet landscape page title 52px");
assert(files.hero.includes("@media (max-width: 900px)") && files.hero.includes("font-size: 46px"), "Tablet portrait page title 46px");
assert(files.hero.includes("@media (max-width: 760px)") && files.hero.includes("font-size: 40px"), "Mobile page title 40px");

// Lead paragraph scaling
assert(files.hero.includes(".sg-lead") && files.hero.includes("font-size: 16.5px"), "Desktop/tablet lead paragraph 16.5px");
assert(files.hero.includes("@media (max-width: 760px)") && files.hero.includes("font-size: 15.5px"), "Mobile lead paragraph 15.5px");

// 3. Search Box & Protection Card Responsiveness
console.log("\n3. Checking Search & Protection Card...");
assert(files.search.includes("max-width: 560px"), "Desktop search box max-width 560px");
assert(files.search.includes("@media (max-width: 900px)") && files.search.includes("max-width: none"), "Tablet & mobile search box expands to full width");
assert(files.search.includes("@media (max-width: 760px)") && files.search.includes("font-size: 16px"), "Mobile search input font-size 16px (prevents iOS auto-zoom)");
assert(files.hero.includes(".sg-shield") && files.hero.includes("padding: 34px 34px 30px"), "Desktop protection card padding 34px 34px 30px");
assert(files.hero.includes("@media (max-width: 760px)") && files.hero.includes("padding: 26px 20px 22px"), "Mobile protection card padding 26px 20px 22px");

// 4. Section Bar Sticky Navigation
console.log("\n4. Checking Section Bar Navigation...");
assert(files.bar.includes("position: sticky"), "Section bar is sticky");
assert(files.bar.includes("top: var(--hdr-h)"), "Section bar sticks at header offset top: var(--hdr-h)");
assert(files.bar.includes("gap: 30px"), "Desktop/tablet section bar link gap 30px");
assert(files.bar.includes("@media (max-width: 760px)") && files.bar.includes("gap: 24px"), "Mobile section bar link gap 24px");
assert(files.bar.includes("overflow-x: auto"), "Section bar scrolls horizontally on narrow viewports");

// 5. Chapters Layout
console.log("\n5. Checking Chapters Layout...");
assert(files.chapters.includes("grid-template-columns: 300px minmax(0, 1fr)"), "Desktop chapters in two columns (300px + questions)");
assert(files.chapters.includes("gap: 72px"), "Desktop chapters gap 72px");
assert(files.chapters.includes("padding: 84px var(--gut)"), "Desktop chapters padding-top 84px");
assert(files.chapters.includes("@media (max-width: 1199px)") && files.chapters.includes("grid-template-columns: 250px minmax(0, 1fr)"), "Tablet landscape chapters 250px + questions");
assert(files.chapters.includes("@media (max-width: 1199px)") && files.chapters.includes("gap: 48px"), "Tablet landscape chapters gap 48px");
assert(files.chapters.includes("@media (max-width: 1199px)") && files.chapters.includes("padding: 72px var(--gut)"), "Tablet landscape chapters padding-top 72px");
assert(files.chapters.includes("@media (max-width: 900px)") && files.chapters.includes("grid-template-columns: minmax(0, 1fr)"), "Tablet portrait (900px) chapters collapse to 1 column");
assert(files.chapters.includes("@media (max-width: 900px)") && files.chapters.includes("position: static"), "Tablet portrait chapter header becomes static (no longer sticky)");
assert(files.chapters.includes("@media (max-width: 900px)") && files.chapters.includes("padding: 60px var(--gut)"), "Tablet portrait chapters padding-top 60px");
assert(files.chapters.includes("@media (max-width: 760px)") && files.chapters.includes("padding: 52px var(--gut)"), "Mobile chapters padding-top 52px");

// Chapter Titles
assert(files.chapters.includes(".ch-head h2") && files.chapters.includes("font-size: 40px"), "Desktop chapter title 40px");
assert(files.chapters.includes("@media (max-width: 1199px)") && files.chapters.includes("font-size: 36px"), "Tablet chapter title 36px");
assert(files.chapters.includes("@media (max-width: 760px)") && files.chapters.includes("font-size: 31px"), "Mobile chapter title 31px");

// 6. Visual Features Responsiveness
console.log("\n6. Checking Visual Features...");
// Two ways
assert(files.features.includes(".ways") && files.features.includes("grid-template-columns: 1fr 1fr"), "Two ways feature side-by-side on desktop/tablet");
assert(files.features.includes("@media (max-width: 760px)") && files.features.includes("grid-template-columns: 1fr"), "Two ways feature stacks on mobile (<=760px)");
assert(files.features.includes(".ways-or") && files.features.includes("position: absolute"), "Two ways 'or' circle centered on desktop/tablet");
assert(files.features.includes("@media (max-width: 760px)") && files.features.includes("margin: -17px auto"), "Two ways 'or' circle placed on seam on mobile");

// Care trio
assert(files.features.includes(".trio") && files.features.includes("grid-template-columns: repeat(3, minmax(0, 1fr))"), "Care trio 3 columns on desktop and tablet landscape");
assert(files.features.includes("@media (max-width: 900px)") && files.features.includes("grid-template-columns: 1fr"), "Care trio stacks to 1 column on tablet portrait & mobile (<=900px)");

// 7. Questions Accordion & Tags
console.log("\n7. Checking Questions Accordion & Tags...");
assert(files.questions.includes(".q-tag"), "Question tone tag present");
assert(files.questions.includes("@media (max-width: 760px)") && files.questions.includes(".q-tag") && files.questions.includes("order: 3"), "Question tag moves under question text on mobile (order: 3)");
assert(files.questions.includes("@media (max-width: 760px)") && files.questions.includes("font-size: 14.5px"), "Question answers scale to 14.5px on mobile");

// 8. Closing Band
console.log("\n8. Checking Closing Band...");
assert(files.closing.includes("grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr)"), "Desktop closing band in 2 columns (1.15fr and 0.85fr)");
assert(files.closing.includes("@media (max-width: 900px)") && files.closing.includes("grid-template-columns: minmax(0, 1fr)"), "Tablet portrait & mobile closing band collapses to 1 column");
assert(files.closing.includes("@media (max-width: 760px)") && files.closing.includes("width: 100%"), "Buttons fill 100% width on mobile");

console.log("\n====================================================================");
console.log(`TOTAL RESPONSIVENESS CHECKS: ${passed} PASSED, ${failed} FAILED`);
console.log("====================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
