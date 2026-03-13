import React, { useRef, useState, useEffect, Suspense, ComponentType } from 'react';

/**
 * LazySection — triggers a dynamic import only when the placeholder
 * enters (or is about to enter) the viewport.
 *
 * • Uses IntersectionObserver with a generous rootMargin so the chunk
 *   starts loading ~400px before the user scrolls to it.
 * • The fallback is a transparent div with min-height to prevent CLS.
 * • Once loaded, the component stays mounted permanently.
 * • Listens for a global "lazy-force-load" CustomEvent to allow
 *   anchor-link navigation to trigger loading without scrolling to bottom.
 */

// Global event name used by scroll-utils to force-load all lazy sections
export const LAZY_FORCE_LOAD_EVENT = 'lazy-force-load';

interface LazySectionProps {
  /** Factory that returns a promise resolving to the component */
  factory: () => Promise<{ default: ComponentType<object> }>;
  /** Minimum height of the placeholder (prevents CLS) */
  minHeight?: string;
  /** Extra rootMargin for earlier preloading */
  rootMargin?: string;
}

export function LazySection({
  factory,
  minHeight = '200px',
  rootMargin = '400px',
}: LazySectionProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [LazyComp, setLazyComp] = useState<React.LazyExoticComponent<ComponentType<object>> | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      setLazyComp(() => React.lazy(factory));
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
        }
      },
      { rootMargin: `${rootMargin} 0px ${rootMargin} 0px` }
    );

    observer.observe(el);

    // Listen for force-load events from anchor navigation
    const handleForceLoad = () => load();
    window.addEventListener(LAZY_FORCE_LOAD_EVENT, handleForceLoad);

    return () => {
      observer.disconnect();
      window.removeEventListener(LAZY_FORCE_LOAD_EVENT, handleForceLoad);
    };
  }, [factory, rootMargin]);

  if (!LazyComp) {
    return (
      <div
        ref={sentinelRef}
        style={{ minHeight }}
        aria-hidden="true"
      />
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ minHeight }} aria-hidden="true" />
      }
    >
      <LazyComp />
    </Suspense>
  );
}