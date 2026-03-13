import type { LucideIcon } from 'lucide-react';

/**
 * Reusable glass-morphism icon orb.
 * Requires an SVG gradient def with `id={gradientId}` somewhere in the DOM.
 * The default gradient id matches the one in Cases.tsx / SocialProof.tsx.
 */
export const GlassIcon = ({
  icon: Icon,
  gradientId = 'glass-icon-grad',
  size = 40,
  iconSize = 18,
}: {
  icon: LucideIcon;
  gradientId?: string;
  size?: number;
  iconSize?: number;
}) => (
  <div
    className="relative shrink-0 group-hover:scale-110 transition-transform duration-500"
    style={{ width: size, height: size }}
  >
    {/* Glow ring */}
    <div
      className="absolute -inset-1.5 rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500"
      style={{
        background:
          'radial-gradient(circle, rgba(0,168,79,0.25) 0%, transparent 70%)',
        filter: 'blur(6px)',
      }}
    />
    {/* Glass body */}
    <div
      className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(0,168,79,0.06) 50%, rgba(0,0,0,0.2) 100%)',
        boxShadow: `
          inset 0 1px 1px rgba(255,255,255,0.15),
          inset 0 -2px 4px rgba(0,0,0,0.3),
          0 0 12px rgba(0,168,79,0.15),
          0 3px 8px rgba(0,0,0,0.4)
        `,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Top highlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[45%] rounded-full pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
        }}
      />
      <Icon
        className="relative z-10"
        style={{
          width: iconSize,
          height: iconSize,
          stroke: `url(#${gradientId})`,
        }}
        strokeWidth={1.6}
      />
    </div>
  </div>
);

/** Hidden SVG that defines the gradient used by GlassIcon stroke. */
export const GlassIconGradientDef = ({
  id = 'glass-icon-grad',
}: {
  id?: string;
}) => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00A84F" />
        <stop offset="100%" stopColor="#34D27B" />
      </linearGradient>
    </defs>
  </svg>
);
