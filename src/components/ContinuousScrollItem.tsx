import { useState, type ReactNode } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

interface ContinuousScrollItemProps {
  children: ReactNode;
  className?: string;
  amount?: number;
}

export function ContinuousScrollItem({
  children,
  className,
  amount = 0.25,
}: ContinuousScrollItemProps) {
  const { scrollY } = useScroll();
  const [direction, setDirection] = useState<'down' | 'up'>('down');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    if (diff > 1.5) {
      setDirection('down');
    } else if (diff < -1.5) {
      setDirection('up');
    }
  });

  const entryY = direction === 'down' ? -36 : 36;

  return (
    <motion.div
      initial={{ opacity: 0, y: entryY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
