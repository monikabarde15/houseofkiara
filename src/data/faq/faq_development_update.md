# Help & FAQs Page — Client & Team Progress Update

---

## PART 1: Core Data Engine, Chrome, Concierge Hero & Moment Cards

### 1. Central Data Engine & FAQ Registry
* **Admin Figures Module (`Appendix D`)**:
  * Centralized 27 dynamic figures (WhatsApp contact, SLA, delivery thresholds, GST rates, refund windows, rental durations, and lead times).
  * Updating a figure in one place automatically reflects across all 120 answers and timeline calculations.
* **120-Question Registry (`Appendix A & B`)**:
  * Structured all 7 moments (6 card moments + 1 account moment) and all sections.
  * Formatted complete answers with exact typography, bold key phrases, gold bullet points, and cross-question links.
* **Search Synonyms & Most Asked Registry (`Appendix C`)**:
  * Configured keyword alternative dictionary (e.g. `cod` ↔ `cash`, `fake` ↔ `authentic`, `late` ↔ `delay`, `deposit` ↔ `refund`).
  * Mapped the 4 popular quick-access questions.

### 2. Global Chrome & Utilities (`A8, A9, A10, A11`)
* **Breadcrumb Navigation (`A8`)**:
  * Added `Home / Support / Help & FAQs` with responsive padding and gold slash dividers.
* **Floating WhatsApp Action Button (`A9, 10.6`)**:
  * Fixed bottom-right round button with smooth hover scale effect.
  * Tooltip displaying `"ASK US ANYTHING"` on hover and focus.
  * Integrated direct WhatsApp chat generator with pre-filled message.
* **Toast Notification System (`A10`)**:
  * Bottom-center rising notification banner with 2.2-second auto-dismissal.
  * Handles copy-to-clipboard confirmations and external link toasts.
* **Shared Brand Buttons (`A11`)**:
  * Green WhatsApp CTA button with standardized 16px icon.
  * Outlined dark-mode `"WRITE TO US"` button with 15px line icon.

### 3. Concierge Hero & Search System (`B1–B7, B13`)
* **Greeting & Headline (`B2, B3`)**:
  * Cormorant Garamond italic greeting: *"Hello, we're so glad you're here"*.
  * Fluid H1 headline: *"What's on your mind?"* with custom italic gold accent.
* **Live Search Controller (`B4, 10.4`)**:
  * Centered search field with 110ms debounce and clear button.
  * Global keyboard shortcut: pressing `/` anywhere on the page focuses and centers the search input.
* **Search Results Dropdown (`B5`)**:
  * Live answer ranking algorithm based on exact vs. synonym matches across questions (`+6`), keywords (`+3`), and answer bodies (`+2`), plus phrase bonuses (`+8`).
  * Instant `<mark>` highlighting of matched keywords in question titles.
  * Full keyboard navigation support (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
* **Empty / No-Results Fallback State (`B6`)**:
  * Contextual message when no matches are found: *"We haven't written about that yet."*
  * Direct WhatsApp CTA button that forwards the user's typed search query straight to support.
* **Popular Questions Row (`B7`)**:
  * Quick-select row of the top 4 most-asked questions directly switching to their home moment.

### 4. Moment Cards & Hygiene Promise (`B8–B13`)
* **Lede & Moment Cards Grid (`B8, B9`)**:
  * Added *"OR CHOOSE WHERE YOU ARE"* uppercase section lede.
  * 6 gradient cards with inline gold SVG arches (`Appendix E`), answer counts, and applies-to badges.
  * Card selection animation: 10px upward lift, 3px expanding gold bottom line, solid gold arch, and deep shadow.
  * Responsive layout: 6-column grid on desktop, 2 rows of 3 on iPad, and touch-snapping sideways carousel on mobile (≤760px).
* **Hygiene Promise Banner (`B11`)**:
  * 3-column card with 3px gold left border, circular pale gold hanger icon, and italic statement.
  * `"HOW WE KEEP PIECES FRESH"` CTA button navigating straight to the hygiene answer (`#hygiene`).
* **Account Moment Link (`B12`)**:
  * Centered link accessing the hidden 7th *Your account & help* moment.

---

## PART 2: Interactive Moment Widgets, Reading Pane Split, Policies & Bottom Support

### 5. Open Moment Header & Section Chips (`C1–C3`)
* **Moment Header (`C2`)**:
  * Moment kicker, Cormorant Garamond heading with italic gold accent word, subline, and bottom 1px charcoal divider.
* **Section Chips (`C3`)**:
  * Pill filter buttons with live question count badges.
  * Active chip filled in charcoal with gold count highlight; automatically hidden for single-section moments.
  * Horizontal swipeable row on mobile.

### 6. Interactive Moment Widgets (`C4–C6, 10.7`)
* **Care Note: Treat it as your own (`C4`)**:
  * Cream pledge panel with 240px background watermark quote (`“`).
  * `"WHAT WE ASK OF EVERYONE"` link navigating to the care answer (`#care`).
  * Dynamically rendered only in *While I'm wearing it* and *Sending it back > Wear & damage*.
* **Dated Rental Strip & Date Calculator (`C5, C6, 10.7`)**:
  * Deep charcoal interactive planner in *Before I book > Rental dates*.
  * Date picker preset to `today + 30 days` with **Standard (4 days)** and **Extended (7 days)** toggle buttons.
  * **5-Milestone Calculation Engine**:
    1. *Book by*: Event minus 28 days (peak season) or 10 days; automatically flags urgent state with terracotta accent if today or earlier.
    2. *Arrives*: Event minus 2 days.
    3. *Your event*: Selected event date with gold halo circle.
    4. *Collected*: End of rental window.
    5. *Deposit back by*: Collected + 1 day + 5 business days (skips Saturdays and Sundays).
  * Contextual status notes for close dates, urgency, and peak wedding season months.
  * Golden timeline connector line, 9px window band, and explanatory footnote.

### 7. Question List & Sticky Reading Pane (`D1–D6`)
* **Split Layout Grid (`D1`)**:
  * 2-column desktop layout (`0.92fr` list / `1.08fr` reading pane) with 60px gap.
* **Question Rows (`D2`)**:
  * Active item indicator with cream background, 2px gold left bar, gold chevron, and applies-to tag in shared moments.
  * Mobile/Tablet Accordion mode (≤900px): expands answer inline beneath the tapped row with 90° rotating chevron.
* **Sticky Reading Pane (`D3, D4`)**:
  * Sticky right pane (`138px` desktop, `84px` iPad) with 8px smooth fade-up animation on question change.
  * Section kicker with 22px gold rule.
  * Multi-paragraph formatted answers with gold bullet dots and cross-links.
* **Next Question Navigation (`D5`)**:
  * Serif link automatically navigating to the subsequent question within the active section.
* **Feedback Row & Deep Link Copy (`D6`)**:
  * *"Did this help?"* interactive voting:
    * `Yes` → Displays sage green confirmation: *"Thank you, that is lovely to hear."*
    * `Not quite` → Displays cream box with gold bar: *"Sorry this didn’t cover it. Ask us and a real person will reply."* + direct WhatsApp escalation CTA.
  * *"Copy link"* button with chain icon: copies `#<question-id>` URL to clipboard and triggers confirmation toast.

### 8. Policies Line & Still Wondering Band (`E1, F1–F3`)
* **Policies Summary Line (`E1`)**:
  * *"The full policies"* heading with 5 direct policy links (*Deposit Policy*, *Refund & Cancellation Policy*, *Care, Cleaning & Damage Policy*, *Terms & Conditions*, *Privacy Policy*).
  * Dynamic admin-controlled last reviewed date line.
* **Still Wondering Support Band (`F1–F3`)**:
  * Full-width charcoal band with 420px gold quote mark watermark (`“`).
  * **Left Message Column (`F2`)**: 32px gold eyebrow rule, heading *"Still wondering about something?"*, closing note, team sign-off, green WhatsApp button, and outlined email button.
  * **Right Contact Channels (`F3`)**: 3 channel cards for WhatsApp (*START A CHAT*), Email (*SEND AN EMAIL*), and My Account (*GO TO MY ACCOUNT*).

### 9. Internal Review Mode & Deep Linking (`D7, 10.1, 10.9`)
* **Deep Linking Engine**:
  * URL hash `#<question-id>` opens and scrolls to specific question.
  * Query parameters: `?m=<moment-id>`, `?for=rent`, `?for=pre`.
* **Internal Review Toolbar (`?review=1`)**:
  * Floating bottom toolbar displaying total answers (120), open decisions (2), and figures awaiting confirmation (2).
  * `"SHOW DECISIONS ONLY"` toggle filtering the question list to open decision items (`A109` and `A117`) with terracotta tags and internal review notes.
