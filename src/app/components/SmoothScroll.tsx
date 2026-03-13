import { useEffect, useRef, useState, createContext, useContext, useCallback, type ReactNode } from 'react';

/**
 * Lightweight Lenis-like smooth scroll engine.
 * Uses lerp interpolation on wheel events + requestAnimationFrame
 * for buttery-smooth scrolling with momentum.
 */

interface SmoothScrollInstance {
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; duration?: number }) => void;
  destroy: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollInstance | null>(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Lerp factor 0–1, lower = smoother (default 0.08) */
  lerp?: number;
  /** Wheel multiplier (default 1) */
  wheelMultiplier?: number;
  /** Duration for scrollTo in ms (default 1200) */
  duration?: number;
}

export function SmoothScrollProvider({
  children,
  lerp: lerpFactor = 0.08,
  wheelMultiplier = 1,
  duration: defaultDuration = 1200,
}: SmoothScrollProviderProps) {
  const [instance, setInstance] = useState<SmoothScrollInstance | null>(null);
  const instanceRef = useRef<SmoothScrollInstance | null>(null);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const touchStartYRef = useRef(0);
  const isAnimatingToRef = useRef(false);
  const animStartRef = useRef(0);
  const animFromRef = useRef(0);
  const animToRef = useRef(0);
  const animDurationRef = useRef(0);

  const getMaxScroll = useCallback(() => {
    return document.documentElement.scrollHeight - window.innerHeight;
  }, []);

  const clamp = useCallback((val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
  }, []);

  // Easing: easeInOutCubic
  const ease = useCallback((t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  const animate = useCallback(() => {
    if (isAnimatingToRef.current) {
      // Programmatic scrollTo animation
      const elapsed = performance.now() - animStartRef.current;
      const progress = clamp(elapsed / animDurationRef.current, 0, 1);
      const easedProgress = ease(progress);
      const value = animFromRef.current + (animToRef.current - animFromRef.current) * easedProgress;

      window.scrollTo(0, value);
      currentScrollRef.current = value;
      targetScrollRef.current = value;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingToRef.current = false;
        isRunningRef.current = false;
      }
      return;
    }

    // Lerp-based smooth scroll
    const diff = targetScrollRef.current - currentScrollRef.current;

    if (Math.abs(diff) < 0.5) {
      currentScrollRef.current = targetScrollRef.current;
      window.scrollTo(0, currentScrollRef.current);
      isRunningRef.current = false;
      return;
    }

    currentScrollRef.current += diff * lerpFactor;
    window.scrollTo(0, currentScrollRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [lerpFactor, clamp, ease]);

  const startAnimation = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    // Detect touch-only devices and skip smooth scroll
    const isTouchOnly = 'ontouchstart' in window && navigator.maxTouchPoints > 0 && !window.matchMedia('(pointer: fine)').matches;

    currentScrollRef.current = window.scrollY;
    targetScrollRef.current = window.scrollY;

    const handleWheel = (e: WheelEvent) => {
      if (isTouchOnly) return;

      // Don't intercept scroll when body overflow is hidden (e.g. modal open)
      if (document.body.style.overflow === 'hidden') return;

      e.preventDefault();

      // If animating to a target, cancel it
      isAnimatingToRef.current = false;

      const delta = e.deltaY * wheelMultiplier;
      targetScrollRef.current = clamp(
        targetScrollRef.current + delta,
        0,
        getMaxScroll()
      );
      startAnimation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      // Sync with actual scroll position on touch start
      currentScrollRef.current = window.scrollY;
      targetScrollRef.current = window.scrollY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTouchOnly) return;
      const keys: Record<string, number> = {
        ArrowDown: 100,
        ArrowUp: -100,
        PageDown: window.innerHeight,
        PageUp: -window.innerHeight,
        Home: -Infinity,
        End: Infinity,
        ' ': e.shiftKey ? -window.innerHeight : window.innerHeight,
      };

      const delta = keys[e.key];
      if (delta !== undefined) {
        e.preventDefault();
        isAnimatingToRef.current = false;

        if (delta === -Infinity) {
          targetScrollRef.current = 0;
        } else if (delta === Infinity) {
          targetScrollRef.current = getMaxScroll();
        } else {
          targetScrollRef.current = clamp(
            targetScrollRef.current + delta,
            0,
            getMaxScroll()
          );
        }
        startAnimation();
      }
    };

    // Keep synced when browser scrolls natively (e.g. touch, find-in-page)
    const handleScroll = () => {
      if (!isRunningRef.current) {
        currentScrollRef.current = window.scrollY;
        targetScrollRef.current = window.scrollY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);

    // Disable CSS scroll-behavior to avoid conflicts
    document.documentElement.style.scrollBehavior = 'auto';

    const scrollToFn: SmoothScrollInstance['scrollTo'] = (target, options = {}) => {
      const { offset = 0, duration = defaultDuration } = options;
      let targetY: number;

      if (typeof target === 'number') {
        targetY = target;
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (!el) return;
        targetY = el.getBoundingClientRect().top + window.scrollY + offset;
      } else {
        targetY = target.getBoundingClientRect().top + window.scrollY + offset;
      }

      targetY = clamp(targetY, 0, getMaxScroll());

      isAnimatingToRef.current = true;
      animStartRef.current = performance.now();
      animFromRef.current = currentScrollRef.current;
      animToRef.current = targetY;
      animDurationRef.current = duration;
      startAnimation();
    };

    const inst: SmoothScrollInstance = {
      scrollTo: scrollToFn,
      destroy: () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', handleScroll);
        document.documentElement.style.scrollBehavior = '';
      },
    };

    instanceRef.current = inst;
    setInstance(inst);

    return () => {
      instanceRef.current?.destroy();
      setInstance(null);
    };
  }, [wheelMultiplier, defaultDuration, clamp, getMaxScroll, startAnimation]);

  return (
    <SmoothScrollContext.Provider value={instance}>
      {children}
    </SmoothScrollContext.Provider>
  );
}