import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  isGreen: boolean;
  flareTime: number;
  flareDuration: number;
  nextFlare: number;
}

export const Constellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let time = 0;
    let isVisible = true;

    const CONNECTION_DIST = 140;
    const STAR_COUNT_FACTOR = window.innerWidth < 768 ? 0 : 0.00008;
    const CELL_SIZE = CONNECTION_DIST;

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const createStar = (): Star => ({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.1, 0.1),
      baseRadius: rand(0.8, 1.8),
      baseAlpha: rand(0.08, 0.3),
      alpha: 0,
      pulseSpeed: rand(0.3, 1.2),
      pulsePhase: rand(0, Math.PI * 2),
      isGreen: Math.random() < 0.2,
      flareTime: -1,
      flareDuration: rand(0.6, 1.5),
      nextFlare: rand(3, 15),
    });

    const resize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        stars = [];
        return;
      }

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.round(w * h * STAR_COUNT_FACTOR), 40);
      if (stars.length === 0) {
        stars = Array.from({ length: count }, createStar);
      } else {
        while (stars.length < count) stars.push(createStar());
        while (stars.length > count) stars.pop();
      }
    };

    // Spatial hash grid for O(n*k) connection checks instead of O(n²)
    let gridCols = 0;
    let gridRows = 0;
    let grid: number[][] = [];

    const buildGrid = () => {
      gridCols = Math.ceil(w / CELL_SIZE) || 1;
      gridRows = Math.ceil(h / CELL_SIZE) || 1;
      grid = new Array(gridCols * gridRows);
      for (let i = 0; i < grid.length; i++) grid[i] = [];
      for (let i = 0; i < stars.length; i++) {
        const col = Math.min(Math.floor(stars[i].x / CELL_SIZE), gridCols - 1);
        const row = Math.min(Math.floor(stars[i].y / CELL_SIZE), gridRows - 1);
        if (col >= 0 && row >= 0) {
          grid[row * gridCols + col].push(i);
        }
      }
    };

    let lastTime = performance.now();
    const frameInterval = 33; // Lock all to 30fps

    const draw = (now: number) => {
      if (!isVisible || stars.length === 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const elapsed = now - lastTime;
      if (elapsed < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      lastTime = now - (elapsed % frameInterval);
      const dt = elapsed / 1000;
      time += dt;
      ctx.clearRect(0, 0, w, h);

      // Update stars
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < -10) star.x = w + 10;
        if (star.x > w + 10) star.x = -10;
        if (star.y < -10) star.y = h + 10;
        if (star.y > h + 10) star.y = -10;

        const pulse = Math.sin(time * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
        star.alpha = star.baseAlpha * (0.4 + pulse * 0.6);

        star.nextFlare -= dt;
        if (star.nextFlare <= 0 && star.flareTime < 0) {
          star.flareTime = 0;
          star.nextFlare = rand(5, 20);
        }
        if (star.flareTime >= 0) {
          star.flareTime += dt;
          const progress = star.flareTime / star.flareDuration;
          if (progress >= 1) {
            star.flareTime = -1;
          } else {
            const flareIntensity = progress < 0.3
              ? progress / 0.3
              : 1 - ((progress - 0.3) / 0.7);
            star.alpha = Math.min(1, star.alpha + flareIntensity * 0.8);
          }
        }
      }

      // Build spatial grid
      buildGrid();

      // Draw connections using grid (check only neighboring cells)
      ctx.lineWidth = 0.5;
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const cellIdx = row * gridCols + col;
          const cell = grid[cellIdx];
          if (cell.length === 0) continue;

          // Check current cell + right + bottom + bottom-right + bottom-left neighbors
          const neighbors = [
            cellIdx, // self
            col + 1 < gridCols ? cellIdx + 1 : -1, // right
            row + 1 < gridRows ? cellIdx + gridCols : -1, // bottom
            col + 1 < gridCols && row + 1 < gridRows ? cellIdx + gridCols + 1 : -1, // bottom-right
            col - 1 >= 0 && row + 1 < gridRows ? cellIdx + gridCols - 1 : -1, // bottom-left
          ];

          for (const ni of neighbors) {
            if (ni < 0) continue;
            const neighborCell = grid[ni];
            const isSelf = ni === cellIdx;

            for (let a = 0; a < cell.length; a++) {
              const startB = isSelf ? a + 1 : 0;
              for (let b = startB; b < neighborCell.length; b++) {
                const si = cell[a];
                const sj = neighborCell[b];
                const dx = stars[si].x - stars[sj].x;
                const dy = stars[si].y - stars[sj].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
                  const dist = Math.sqrt(distSq);
                  const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.08 * Math.min(stars[si].alpha, stars[sj].alpha) * 4;
                  const isGreenLine = stars[si].isGreen || stars[sj].isGreen;
                  ctx.strokeStyle = isGreenLine
                    ? `rgba(0, 168, 79, ${lineAlpha * 1.5})`
                    : `rgba(255, 255, 255, ${lineAlpha})`;
                  ctx.beginPath();
                  ctx.moveTo(stars[si].x, stars[si].y);
                  ctx.lineTo(stars[sj].x, stars[sj].y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      // Draw stars
      for (const star of stars) {
        // Compute draw radius (baseRadius + flare bonus, no mutation)
        let r = star.baseRadius;
        if (star.flareTime >= 0) {
          const progress = star.flareTime / star.flareDuration;
          const flareIntensity = progress < 0.3
            ? progress / 0.3
            : 1 - ((progress - 0.3) / 0.7);
          r += flareIntensity * 1.5;
        }

        if (star.isGreen) {
          if (star.alpha > 0.15) {
            const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r * 4);
            gradient.addColorStop(0, `rgba(0, 168, 79, ${star.alpha * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 168, 79, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(star.x, star.y, r * 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = `rgba(52, 210, 123, ${star.alpha})`;
        } else {
          if (star.flareTime >= 0) {
            const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r * 3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha * 0.2})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(star.x, star.y, r * 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };

    resize();
    // Defer first draw to not compete with first paint / LCP
    animationId = requestAnimationFrame((now) => {
      lastTime = now;
      animationId = requestAnimationFrame(draw);
    });
    window.addEventListener('resize', debouncedResize);

    // Pause canvas when not visible or tab inactive
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
};