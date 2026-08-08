import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  maxDistance?: number
}

export function MagneticButton({
  children,
  className,
  strength = 0.8,
  maxDistance = 100,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const reducedMotion = useReducedMotion()

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return

    const { width, height, left, top } = ref.current.getBoundingClientRect()
    const { clientX, clientY } = e

    let x = (clientX - (left + width / 2)) * strength
    let y = (clientY - (top + height / 2)) * strength

    const distance = Math.hypot(x, y)
    if (distance > maxDistance) {
      const scale = maxDistance / distance
      x *= scale
      y *= scale
    }

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const hasMoved = position.x !== 0 || position.y !== 0

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'pointer-events-auto cursor-pointer rounded-lg border border-dashed transition-colors duration-150 [--show-color:#3b82f6]',
        className
      )}
      style={{
        borderColor: hasMoved ? 'var(--show-color)' : 'transparent',
        backgroundColor: hasMoved
          ? 'color-mix(in srgb, var(--show-color) 20%, transparent)'
          : 'transparent',
      }}
    >
      <motion.div
        ref={ref}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
