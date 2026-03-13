import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ease } from './motion-utils';

const easeOut = ease.out as any;

/**
 * Minimal preloader — single pulsing dot → smooth dissolve into Hero.
 */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'fading' | 'done'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('fading'), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'fading') return;
    const timer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 300);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050a09]"
      animate={{ opacity: phase === 'fading' ? 0 : 1 }}
      transition={{ duration: 0.65, ease: easeOut }}
    >
      {/* Soft radial glow behind the dot */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(0,168,79,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Pulsing dot */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        {/* Core dot */}
        <motion.div
          className="w-3 h-3 rounded-full bg-[#00A84F]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            boxShadow: '0 0 12px rgba(0,168,79,0.5), 0 0 4px rgba(0,168,79,0.3)',
          }}
        />

        {/* Ping ring 1 */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#00A84F]/30"
          animate={{ scale: [1, 3.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* Ping ring 2 (offset) */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#00A84F]/20"
          animate={{ scale: [1, 4.5], opacity: [0.35, 0] }}
          transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  );
}