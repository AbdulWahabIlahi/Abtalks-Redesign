import { useEffect } from 'react'
import {
  motion,
  stagger,
  useAnimate,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { cn } from '../lib/utils'

interface TextGenerateEffectProps {
  words: string
  className?: string
  filter?: boolean
  duration?: number
  highlightWords?: string[]
}

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 2,
  highlightWords = [],
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate()
  const inView = useInView(scope, { once: true, margin: '-60px' })
  const reducedMotion = useReducedMotion()
  const wordsArray = words.split(' ')

  useEffect(() => {
    if (!inView || reducedMotion) return
    animate(
      'span',
      filter ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 1 },
      {
        duration: duration ? 1 / duration : 1,
        delay: stagger(0.3),
      }
    )
  }, [inView, filter, duration, reducedMotion, animate])

  return (
    <motion.span ref={scope} className={cn('text-white', className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          className={cn(
            'inline-block',
            highlightWords.includes(word) && 'gradient-text',
            !reducedMotion && 'opacity-0'
          )}
          style={{ filter: filter && !reducedMotion ? 'blur(10px)' : 'none' }}
        >
          {word}
          {idx < wordsArray.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  )
}
