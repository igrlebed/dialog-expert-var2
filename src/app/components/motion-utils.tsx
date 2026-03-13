import React, { useRef, useCallback, ReactNode } from 'react';
import { motion, useInView } from 'motion/react';

/* ── Easing presets (nk.studio-style) ── */
export const ease = {
  smooth: [0.16, 1, 0.3, 1] as const,
  dramatic: [0.76, 0, 0.24, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: 'spring' as const, stiffness: 100, damping: 20 },
};

/* ── SplitText — word-by-word reveal with clip-path mask ── */
export function SplitText({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.05,
  once = true,
  wordClassName = '',
  immediate = false,
}: {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  wordClassName?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  const words = children.split(' ');

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden leading-[1.15] align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            style={{ willChange: 'transform, opacity' }}
            initial={immediate
              ? { y: '100%', opacity: 1 }
              : { y: '110%', opacity: 0 }
            }
            animate={isInView
              ? { y: '0%', opacity: 1 }
              : immediate
                ? { y: '100%', opacity: 1 }
                : { y: '110%', opacity: 0 }
            }
            transition={{
              duration: immediate ? 0.8 : 1.0,
              delay: delay + i * staggerDelay,
              ease: ease.dramatic as any,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
}

/* ── ClipReveal — premium clip-path wipe reveal ── */
export function ClipReveal({
  children,
  className = '',
  delay = 0,
  duration = 1.2,
  direction = 'up',
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
}) {
  const clipMap = {
    up: { hidden: 'inset(100% 0 0 0)', visible: 'inset(0 0 0 0)' },
    down: { hidden: 'inset(0 0 100% 0)', visible: 'inset(0 0 0 0)' },
    left: { hidden: 'inset(0 100% 0 0)', visible: 'inset(0 0 0 0)' },
    right: { hidden: 'inset(0 0 0 100%)', visible: 'inset(0 0 0 0)' },
  };

  return (
    <motion.div
      className={className}
      initial={{ clipPath: clipMap[direction].hidden, opacity: 0 }}
      whileInView={{ clipPath: clipMap[direction].visible, opacity: 1 }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: ease.dramatic as any,
        opacity: { duration: 0.4, delay },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── BlurReveal — fade + blur + y shift on viewport entry ── */
export function BlurReveal({
  children,
  className = '',
  delay = 0,
  duration = 1.0,
  y = 60,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{
          duration,
          delay,
          ease: ease.out as any,
        }}
    >
      {children}
    </motion.div>
  );
}

/* ── StaggerContainer + StaggerItem — staggered children reveals ── */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.06,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
              duration: 0.9,
              ease: ease.out as any,
            },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── MagneticCard — 3D tilt + glow follow cursor + animated border ── */
export function MagneticCard({
  children,
  className = '',
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      const glow = glowRef.current;
      const border = borderRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.02,1.02,1.02)`;
      if (glow) {
        glow.style.background = `radial-gradient(500px circle at ${x * 100}% ${y * 100}%, rgba(0,168,79,0.15) 0%, transparent 50%)`;
      }
      if (border) {
        border.style.background = `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, rgba(0,168,79,0.4) 0%, transparent 50%)`;
      }
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    const glow = glowRef.current;
    const border = borderRef.current;
    if (el) el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1,1,1)';
    if (glow) glow.style.opacity = '0';
    if (border) border.style.opacity = '0';
  }, []);

  const handleMouseEnter = useCallback(() => {
    const glow = glowRef.current;
    const border = borderRef.current;
    if (glow) glow.style.opacity = '1';
    if (border) border.style.opacity = '1';
  }, []);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Animated border glow */}
      <div
        ref={borderRef}
        className="absolute -inset-px rounded-2xl pointer-events-none z-0"
        style={{ opacity: 0, transition: 'opacity 0.6s' }}
      />
      {/* Cursor-following inner glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{ opacity: 0, transition: 'opacity 0.6s' }}
      />
      {children}
    </div>
  );
}

/* ── FloatingElement — continuous floating animation ── */
export function FloatingElement({
  children,
  className = '',
  duration = 6,
  distance = 20,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── ScaleReveal — scale + fade on viewport entry ── */
export function ScaleReveal({
  children,
  className = '',
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.88, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration: 1.2,
        delay,
        ease: ease.out as any,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── TextShimmer — animated gradient shimmer across text ── */
export function TextShimmer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          mixBlendMode: 'overlay',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, repeatDelay: 5, ease: 'linear' }}
      />
    </span>
  );
}
