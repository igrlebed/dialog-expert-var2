/**
 * Shared scroll navigation utility.
 * Used by Header, Hero, and Footer for consistent anchor-link behavior.
 *
 * Handles lazy-loaded sections: if a target element isn't in the DOM yet
 * (because LazySection hasn't mounted it), we dispatch a force-load event
 * to trigger all pending lazy sections, then poll until the element appears.
 */

import { LAZY_FORCE_LOAD_EVENT } from './LazySection';

interface SmoothScrollLike {
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const HEADER_HEIGHT = 72;
const SCROLL_DURATION = 1200;

/**
 * Attempt to find and scroll to an element by id.
 * If not found (lazy section not yet loaded), force-load all lazy sections
 * then retry up to `maxRetries` times.
 */
export function scrollToSection(
  href: string,
  smoothScroll: SmoothScrollLike | null
) {
  if (href === '#') {
    if (smoothScroll) {
      smoothScroll.scrollTo(0, { duration: SCROLL_DURATION });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  const id = href.replace('#', '');
  if (!id) return;

  const doScroll = (el: HTMLElement) => {
    if (smoothScroll) {
      smoothScroll.scrollTo(el, { offset: -HEADER_HEIGHT, duration: SCROLL_DURATION });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const target = document.getElementById(id);
  if (target) {
    doScroll(target);
    return;
  }

  // Element not in DOM yet — force all LazySection instances to load
  window.dispatchEvent(new CustomEvent(LAZY_FORCE_LOAD_EVENT));

  // Poll for the element to appear after lazy loading completes
  let retries = 0;
  const maxRetries = 30; // ~3s total — allows time for chunk download + render
  const poll = () => {
    const el = document.getElementById(id);
    if (el) {
      // Small delay to let layout settle after lazy mount
      requestAnimationFrame(() => doScroll(el));
      return;
    }
    retries++;
    if (retries < maxRetries) {
      setTimeout(poll, 100);
    }
  };
  setTimeout(poll, 50);
}