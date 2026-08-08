import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export interface TestimonialItem {
  name: string;
  role: string | null;
  quote: string;
}

interface PerspectiveCarouselProps {
  testimonials: TestimonialItem[];
}

const cardGradients = [
  'from-violet-950/80 via-purple-950/60 to-black/90 border-violet-500/30 text-violet-100',
  'from-indigo-950/80 via-blue-950/60 to-black/90 border-indigo-500/30 text-indigo-100',
  'from-fuchsia-950/80 via-pink-950/60 to-black/90 border-fuchsia-500/30 text-fuchsia-100',
  'from-emerald-950/80 via-teal-950/60 to-black/90 border-emerald-500/30 text-emerald-100',
  'from-amber-950/80 via-orange-950/60 to-black/90 border-amber-500/30 text-amber-100',
];

export function PerspectiveCarousel({ testimonials }: PerspectiveCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4 overflow-hidden">
      {/* 3D Perspective Stage */}
      <div className="relative flex items-center justify-center min-h-[440px] perspective-[1000px] transform-gpu">
        <div className="relative w-full max-w-4xl h-[380px] flex items-center justify-center">
          {testimonials.map((item, index) => {
            // Calculate relative offset from active index
            let offset = index - activeIndex;
            if (offset < -Math.floor(testimonials.length / 2)) {
              offset += testimonials.length;
            } else if (offset > Math.floor(testimonials.length / 2)) {
              offset -= testimonials.length;
            }

            const isActive = offset === 0;
            const isLeft = offset === -1 || (activeIndex === 0 && index === testimonials.length - 1);
            const isRight = offset === 1 || (activeIndex === testimonials.length - 1 && index === 0);

            // Only render visible cards in 3D arc (active, left, right)
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            // 3D Perspective transform styles
            const xTranslate = offset * 220; // horizontal spacing in px
            const zTranslate = isActive ? 0 : -140; // 3D depth shift
            const rotateY = offset * -28; // 3D perspective rotation
            const scale = isActive ? 1.05 : 0.82;
            const opacity = isActive ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.2;
            const zIndex = 30 - Math.abs(offset) * 10;

            return (
              <motion.div
                key={item.name}
                initial={false}
                animate={{
                  x: xTranslate,
                  z: zTranslate,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 28,
                  mass: 0.8,
                }}
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'absolute w-[300px] sm:w-[380px] min-h-[340px] rounded-3xl border p-6 sm:p-7 flex flex-col justify-between cursor-pointer backdrop-blur-xl shadow-2xl transition-shadow duration-300',
                  cardGradients[index % cardGradients.length],
                  isActive
                    ? 'border-primary/50 shadow-primary/20 ring-1 ring-primary/30'
                    : 'border-white/10 hover:border-white/30'
                )}
              >
                {/* Header: Feedback by [Name] */}
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-mono tracking-wider uppercase text-white/90 border border-white/15">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      Feedback
                    </span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                  </div>

                  {/* Title as "Feedback by Name" */}
                  <div className="mt-4">
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                      Feedback by <span className="gradient-text">{item.name}</span>
                    </h3>
                    <p className="mt-1 text-xs text-white/70 font-medium truncate">
                      {item.role ?? 'ABTalks Community Member'}
                    </p>
                  </div>

                  {/* Quote Body (says inside) */}
                  <div className="mt-4 relative">
                    <Quote className="absolute -left-1 -top-1 h-5 w-5 text-primary/30" />
                    <p className="pl-5 text-xs sm:text-sm leading-relaxed text-white/95 line-clamp-4 font-normal">
                      “{item.quote}”
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 border-t border-white/10 pt-3.5 flex items-center justify-between text-xs font-mono text-white/60">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Alumni
                  </span>
                  <span>60 Days Challenge</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Perspective Controls & Dots */}
      <div className="mt-8 flex flex-col items-center gap-4 relative z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label="Previous card"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-primary/50 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/70 backdrop-blur-md text-xs font-mono text-zinc-400">
            <span className="text-white font-bold">{activeIndex + 1}</span> / {testimonials.length}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next card"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-primary/50 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex items-center gap-1.5">
          {testimonials.map((t, idx) => (
            <button
              key={t.name}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to feedback by ${t.name}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                idx === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
