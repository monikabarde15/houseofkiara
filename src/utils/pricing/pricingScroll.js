// src/utils/pricing/pricingScroll.js
// Smooth scroll offset calculation and 2.4s target flash animation

export function getStickyOffset() {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1199;
  const headerHeight = isMobile ? 61 : 114;
  const sectionBarHeight = 52;
  const buffer = 12;
  return headerHeight + sectionBarHeight + buffer;
}

export function scrollToPricingTarget(targetId, options = {}) {
  if (typeof window === "undefined" || !targetId) return;

  const { flash = true, behavior = "smooth" } = options;
  const element = document.getElementById(targetId);

  if (!element) return;

  const offset = getStickyOffset();
  const rect = element.getBoundingClientRect();
  const absoluteTop = window.pageYOffset + rect.top + (-offset);

  window.scrollTo({
    top: Math.max(0, absoluteTop),
    behavior,
  });

  if (flash) {
    element.classList.remove("pf-flash-target");
    // Trigger reflow to restart animation if already applied
    void element.offsetWidth;
    element.classList.add("pf-flash-target");

    setTimeout(() => {
      element.classList.remove("pf-flash-target");
    }, 2400);
  }
}
