/**
 * House of Kaira: Shipping Policy Scroll & Navigation Engine
 * Section 5.4, 5.7 & 5.8 of Build Specification v2 (hok_shipping_policy_v3)
 */

export function getHeaderHeight() {
  const isMobile = window.innerWidth <= 1199;
  return isMobile ? 61 : 114;
}

export function getSectionBarHeight() {
  const bar = document.querySelector(".secbar");
  return bar ? bar.offsetHeight : 52;
}

/**
 * Calculates top offset: header height + section bar height + 12px
 */
export function getScrollOffset(targetId) {
  const headerHeight = getHeaderHeight();
  const barHeight = getSectionBarHeight();

  // If jumping to the rental window card (Section 5.2 & D5)
  if (targetId === "card:window" || targetId === "rental-window") {
    return headerHeight + 12;
  }

  // Default offset for questions and sections
  return headerHeight + barHeight + 12;
}

/**
 * Smoothly scrolls to target element by ID or selector
 */
export function scrollToTarget(target) {
  if (!target) return;
  const cleanId = target.replace(/^#/, "");
  const el = document.getElementById(cleanId) || document.querySelector(`[data-anchor="${cleanId}"]`);

  if (!el) return;

  const offset = getScrollOffset(cleanId);
  const elementRect = el.getBoundingClientRect();
  const absoluteTop = window.pageYOffset + elementRect.top;
  const targetScrollTop = Math.max(0, absoluteTop-offset);

  window.scrollTo({
    top: targetScrollTop,
    behavior: "smooth"
  });
}

/**
 * Triggers 2.4s gold pale jump highlight (Section 5.4 & Appendix A)
 */
export function triggerJumpHighlight(element) {
  if (!element) return;
  element.classList.remove("flash");
  // Force reflow
  void element.offsetWidth;
  element.classList.add("flash");
  setTimeout(() => {
    element.classList.remove("flash");
  }, 2400);
}
