import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export interface TestimonialItem {
  name: string;
  role: string | null;
  quote: string;
}

const bookGradients = [
  'from-violet-900 via-indigo-900 to-black border-violet-500/40 text-violet-200',
  'from-purple-900 via-pink-900 to-black border-purple-500/40 text-purple-200',
  'from-blue-900 via-indigo-950 to-black border-blue-500/40 text-blue-200',
  'from-emerald-950 via-teal-900 to-black border-emerald-500/40 text-emerald-200',
  'from-amber-950 via-rose-950 to-black border-amber-500/40 text-amber-200',
];

interface BooksShowcaseProps {
  testimonials: TestimonialItem[];
}

export function BooksShowcase({ testimonials }: BooksShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const active = testimonials[activeIndex];

  const handleNext = () => {
    setIsOpen(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIsOpen(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8">
      {/* 3D Stage Container */}
      <div className="relative flex flex-col items-center justify-center min-h-[460px] perspective-[1200px]">
        {/* Book Deck Stack */}
        <div className="relative w-full max-w-md h-[360px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex + (isOpen ? '-open' : '-closed')}
              initial={{ opacity: 0, rotateY: -25, scale: 0.85, z: -100 }}
              animate={{ opacity: 1, rotateY: isOpen ? 180 : 0, scale: 1, z: 0 }}
              exit={{ opacity: 0, rotateY: 25, scale: 0.85, z: -100 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[320px] sm:w-[350px] h-[340px] cursor-pointer preserve-3d group"
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* BOOK COVER (Front) */}
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl border p-6 flex flex-col justify-between shadow-2xl backface-hidden bg-gradient-to-br transition-all duration-300 group-hover:shadow-purple-500/20 group-hover:border-primary/60',
                  bookGradients[activeIndex % bookGradients.length]
                )}
                style={{
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8), -8px 0 16px -4px rgba(255,255,255,0.08) inset',
                }}
              >
                {/* 3D Book Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-white/10 rounded-l-2xl border-r border-white/15" />

                <div className="pl-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase text-white/80 border border-white/15">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      Feedback Book
                    </span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                  </div>

                  {/* Title as "Feedback by [Name]" */}
                  <div className="mt-8">
                    <p className="text-xs uppercase tracking-widest text-white/60 font-mono">Title</p>
                    <h3 className="font-heading text-2xl font-extrabold text-white tracking-tight leading-tight mt-1">
                      Feedback by <span className="gradient-text">{active.name}</span>
                    </h3>
                    <p className="mt-2 text-xs text-white/70 font-medium">
                      {active.role ?? 'ABTalks Builder & Community Member'}
                    </p>
                  </div>
                </div>

                <div className="pl-3 border-t border-white/15 pt-4 flex items-center justify-between">
                  <span className="text-xs text-white/60 font-mono flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Click to open &amp; read inside
                  </span>
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    {isOpen ? 'Close ✕' : 'Open →'}
                  </span>
                </div>
              </div>

              {/* BOOK INSIDE (Back Page - Revealed on Click) */}
              <div
                className="absolute inset-0 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between shadow-2xl rotate-y-180 backface-hidden"
                style={{
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.9), 8px 0 16px -4px rgba(255,255,255,0.05) inset',
                }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Quote className="h-5 w-5 text-primary" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                        {active.name} Says Inside:
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      Verified Review
                    </span>
                  </div>

                  <blockquote className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-200 italic">
                    “{active.quote}”
                  </blockquote>
                </div>

                <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    60-Day Challenge Alumni
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    Click to close ✕
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation & Counter */}
        <div className="mt-6 flex items-center gap-4 z-20">
          <button
            onClick={handlePrev}
            aria-label="Previous feedback book"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-primary/50 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-md text-xs font-mono text-zinc-400">
            <span className="text-white font-bold">{activeIndex + 1}</span>
            <span>/</span>
            <span>{testimonials.length}</span>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next feedback book"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-primary/50 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Selector Dots */}
        <div className="mt-4 flex items-center gap-1.5">
          {testimonials.map((t, idx) => (
            <button
              key={t.name}
              onClick={() => {
                setIsOpen(false);
                setActiveIndex(idx);
              }}
              aria-label={`Select feedback by ${t.name}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                idx === activeIndex
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-zinc-800 hover:bg-zinc-700'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
