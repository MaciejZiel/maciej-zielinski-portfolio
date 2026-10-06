import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { useState } from 'react'

interface MotionRevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  distance?: number
  disableMotion?: boolean
}

export function MotionReveal({
  children,
  delay = 0,
  distance = 34,
  disableMotion = false,
  transition,
  className,
  ...props
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion() || disableMotion
  const [revealed, setRevealed] = useState(Boolean(reduceMotion))

  return (
    <motion.div
      {...props}
      className={`motion-reveal${className ? ` ${className}` : ''}`}
      data-revealed={revealed}
      initial={reduceMotion ? false : { opacity: 1, y: distance }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={reduceMotion ? undefined : { once: true, amount: 0.1 }}
      onViewportEnter={() => setRevealed(true)}
      transition={{
        duration: 0.94,
        ease: [0.22, 1, 0.36, 1],
        delay,
        ...transition,
      }}
    >
      {children}
    </motion.div>
  )
}
