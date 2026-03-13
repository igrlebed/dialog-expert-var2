import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LazySection } from "./components/LazySection";
import { SmoothScrollProvider } from "./components/SmoothScroll";
import { Preloader } from "./components/Preloader";

/* ── Lazy factories (stable refs — defined outside component) ── */
const lazyPainPoints = () => import("./components/PainPoints");
const lazyStages = () => import("./components/Stages");
const lazyCases = () => import("./components/Cases");
const lazyIncluded = () => import("./components/Included");
const lazySocialProof = () =>
  import("./components/SocialProof");
const lazyLeadForm = () => import("./components/LeadForm");
const lazyFooter = () => import("./components/Footer");

/* ── Cursor Glow — desktop only, zero re-renders ── */
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Step 1: detect touch device on mount
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) setIsDesktop(true);
  }, []);

  // Step 2: attach mouse listeners AFTER the glow div renders (isDesktop triggers re-render)
  useEffect(() => {
    if (!isDesktop) return;
    const el = glowRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`;
      el.style.opacity = "1";
    };

    const handleLeave = () => {
      el.style.opacity = "0";
    };
    const handleEnter = () => {
      el.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [isDesktop]);

  // Don't render the glow div at all on touch devices — saves DOM + GPU filter cost
  if (!isDesktop) return null;

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[9999] will-change-transform"
      style={{
        width: 400,
        height: 400,
        opacity: 0,
        transition: "opacity 0.5s",
        background:
          "radial-gradient(circle, rgba(0,168,79,0.04) 0%, transparent 60%)",
        filter: "blur(30px)",
      }}
    />
  );
}

/* ── Scroll Progress Bar ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #00A84F 0%, #34D27B 100%)",
        boxShadow: "0 0 10px rgba(0,168,79,0.5)",
      }}
    />
  );
}

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock scroll while preloader is active
  useEffect(() => {
    if (!preloaderDone) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [preloaderDone]);

  return (
    <SmoothScrollProvider
      lerp={0.08}
      wheelMultiplier={0.9}
      duration={1200}
    >
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}
      <div
        ref={containerRef}
        className="relative min-h-screen bg-[#050a09] font-['Onest',sans-serif] text-white/80 selection:bg-[#00A84F]/20 selection:text-white antialiased"
      >
        <CursorGlow />
        <ScrollProgress />
        <Header />
        <main>
          {/* Critical above-the-fold — loaded eagerly */}
          <Hero ready={preloaderDone} />

          {/* Below-the-fold — lazy-loaded on viewport approach */}
          <LazySection
            factory={lazyPainPoints}
            minHeight="600px"
            rootMargin="600px"
          />
          <LazySection factory={lazyStages} minHeight="400px" />
          <LazySection factory={lazyCases} minHeight="500px" />
          <LazySection
            factory={lazyIncluded}
            minHeight="500px"
          />
          <LazySection
            factory={lazySocialProof}
            minHeight="500px"
          />
          <LazySection
            factory={lazyLeadForm}
            minHeight="500px"
          />
        </main>
        <LazySection factory={lazyFooter} minHeight="200px" />
      </div>
    </SmoothScrollProvider>
  );
}