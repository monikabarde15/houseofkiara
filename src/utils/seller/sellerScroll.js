/**
 * House of Kaira - Seller Guidelines Scroll & ScrollSpy Utilities
 * Section 5.5, 6.2 & 6.6 of Build Specification 1.0
 */

export function getHeaderHeight() {
  if (typeof window === "undefined") return 114;
  const headerElem = document.querySelector("header.header-main, header, .hok-header");
  if (headerElem) {
    const rect = headerElem.getBoundingClientRect();
    if (rect.height > 0) {
      return rect.height;
    }
  }
  return window.innerWidth <= 1199 ? 61 : 114;
}

export function getBarHeight() {
  if (typeof window === "undefined") return 52;
  const barElem = document.querySelector(".sg-bar");
  if (barElem) {
    const rect = barElem.getBoundingClientRect();
    if (rect.height > 0) {
      return rect.height;
    }
  }
  return 52;
}

/**
 * Smoothly scrolls to a chapter section, placing its top directly below the sticky section bar.
 */
export function scrollToChapter(chapterId) {
  if (typeof window === "undefined" || !chapterId) return;

  const target = document.getElementById(`ch-${chapterId}`);
  if (!target) return;

  const headerH = getHeaderHeight();
  const barH = getBarHeight();
  const totalOffset = headerH + barH;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - totalOffset;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: "smooth"
  });

  window.history.pushState(null, "", `#ch-${chapterId}`);
}

/**
 * Smoothly scrolls to a question row, placing it 12px below the sticky section bar.
 */
export function scrollToQuestion(questionId) {
  if (typeof window === "undefined" || !questionId) return;

  const target = document.getElementById(`q-${questionId}`);
  if (!target) return;

  const headerH = getHeaderHeight();
  const barH = getBarHeight();
  const totalOffset = headerH + barH + 12;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - totalOffset;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: "smooth"
  });

  // Flash landed animation
  target.classList.remove("landed");
  void target.offsetWidth;
  target.classList.add("landed");
  setTimeout(() => target.classList.remove("landed"), 1700);

  window.history.pushState(null, "", `#q-${questionId}`);
}

/**
 * Determines which chapter is active based on the trigger line 40px below the sticky bar bottom.
 */
export function determineActiveChapter(chapters = []) {
  if (typeof window === "undefined" || chapters.length === 0) return "ways";

  const headerH = getHeaderHeight();
  const barH = getBarHeight();
  const triggerLine = headerH + barH + 40;

  let currentActive = chapters[0].id;

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const el = document.getElementById(`ch-${ch.id}`);
    if (el) {
      const top = el.getBoundingClientRect().top;
      if (top <= triggerLine) {
        currentActive = ch.id;
      }
    }
  }

  return currentActive;
}
