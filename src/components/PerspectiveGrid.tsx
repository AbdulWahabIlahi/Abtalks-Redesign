import { useEffect, useState, useMemo } from 'react';
import { cn } from '../lib/utils';

interface PerspectiveGridProps {
  /** Additional CSS classes for the grid container */
  className?: string;
  /** Number of tiles per row/column (default: 18 for 60fps performance) */
  gridSize?: number;
  /** Whether to show the gradient overlay (default: true) */
  showOverlay?: boolean;
  /** Fade radius percentage for the gradient overlay (default: 80) */
  fadeRadius?: number;
}

export function PerspectiveGrid({
  className,
  gridSize = 18,
  showOverlay = true,
  fadeRadius = 80,
}: PerspectiveGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tiles = useMemo(() => Array.from({ length: gridSize * gridSize }), [gridSize]);

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden bg-background transition-colors duration-300 pointer-events-none transform-gpu',
        className
      )}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <div
        className="absolute w-[70rem] sm:w-[85rem] aspect-square grid origin-center pointer-events-auto transform-gpu"
        style={{
          left: '50%',
          top: '50%',
          transform:
            'translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(1.8)',
          transformStyle: 'preserve-3d',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          willChange: 'transform',
        }}
      >
        {/* Vibrant 3D Perspective Grid Tiles */}
        {mounted &&
          tiles.map((_, i) => (
            <div
              key={i}
              className="tile min-h-[1px] min-w-[1px] border border-violet-500/20 dark:border-white/10 bg-transparent transition-all duration-500 hover:bg-violet-600/40 dark:hover:bg-primary/40 hover:shadow-[0_0_16px_rgba(124,58,237,0.6)] hover:duration-0 transform-gpu"
              style={{ willChange: 'background-color, box-shadow' }}
            />
          ))}
      </div>

      {/* Radial Gradient Mask (Overlay) */}
      {showOverlay && (
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-colors duration-300"
          style={{
            background: `radial-gradient(circle at center, transparent 20%, rgb(var(--background)) ${fadeRadius}%)`,
          }}
        />
      )}
    </div>
  );
}

export default PerspectiveGrid;
