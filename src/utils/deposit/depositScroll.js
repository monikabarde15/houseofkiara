/**
 * House of Kaira - Deposit Policy Scroll & Jump Utilities
 * Section 6.2 & 6.3 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

/**
 * Calculates current header + sticky section bar offset dynamically at runtime
 */
export const getStickyOffset = () => {
  if (typeof document === 'undefined') return 120;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767;
  let headerHeight = isMobile ? 58 : 112;

  if (isMobile) {
    const mobHeader = document.querySelector('.hok-mobile-header');
    if (mobHeader && mobHeader.offsetHeight > 0) {
      headerHeight = mobHeader.offsetHeight;
    }
  } else {
    const deskHeader =
      document.querySelector('.hok-header-desktop') ||
      document.querySelector('.hok-desktop-header') ||
      document.querySelector('header');
    if (deskHeader && deskHeader.offsetHeight > 0) {
      headerHeight = deskHeader.offsetHeight;
    }
  }

  // Find sticky section bar
  const secbar = document.querySelector('.secbar');
  const secbarHeight = secbar && secbar.offsetHeight > 0 ? secbar.offsetHeight : 50;

  // 12px below the bottom of the section bar per Section 6.2
  return headerHeight + secbarHeight + 12;
};

/**
 * Checks if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Smoothly scrolls to target element positioning it 12px below the section bar
 */
export const scrollToTarget = (targetElement, onComplete) => {
  if (!targetElement) return;

  const offset = getStickyOffset();
  const elementRect = targetElement.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const targetScrollY = Math.max(0, absoluteElementTop - offset);

  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
  window.scrollTo({ top: targetScrollY, behavior });

  if (onComplete) {
    if (behavior === 'auto') {
      onComplete();
    } else {
      setTimeout(onComplete, 400);
    }
  }
};

/**
 * Triggers the 2.4s jump highlight (.cq.flash / .flash) per Section 6.3
 */
export const triggerJumpHighlight = (element) => {
  if (!element) return;
  element.classList.remove('flash');
  // Force browser reflow to restart CSS animation
  void element.offsetWidth;
  element.classList.add('flash');

  setTimeout(() => {
    element.classList.remove('flash');
  }, 2450);
};

export default {
  getStickyOffset,
  prefersReducedMotion,
  scrollToTarget,
  triggerJumpHighlight
};
