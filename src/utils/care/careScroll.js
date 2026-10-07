/**
 * House of Kaira - Care Policy Smooth Scroll & Jump Highlight Utility
 * Sections 6.5 and 6.6 of Build Specification 2.0
 */

export function calculateScrollOffset() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 760;
  const header = document.querySelector('.hok-header-desktop') || document.querySelector('.hok-mobile-header');
  const secbar = document.querySelector('.secbar');

  const headerH = header ? header.getBoundingClientRect().height : (isMobile ? 58 : 114);
  const secbarH = secbar ? secbar.getBoundingClientRect().height : 48;

  // Header height + section bar height + 12px per specification 6.5
  return headerH + secbarH + 12;
}

export function scrollToTarget(targetId, options = {}) {
  const { smooth = true, flash = true } = options;
  if (!targetId || typeof document === 'undefined') return;

  const cleanId = targetId.startsWith('#') ? targetId.slice(1) : targetId;
  const element = document.getElementById(cleanId);
  if (!element) return;

  const offset = calculateScrollOffset();
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = Math.max(0, elementPosition - offset);

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({
    top: offsetPosition,
    behavior: (smooth && !prefersReducedMotion) ? 'smooth' : 'auto'
  });

  if (flash) {
    element.classList.remove('flash');
    void element.offsetWidth; // Force reflow to restart CSS animation
    element.classList.add('flash');
    setTimeout(() => {
      element.classList.remove('flash');
    }, 2400);
  }
}
