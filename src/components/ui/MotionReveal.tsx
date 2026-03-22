import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

interface MotionRevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  distance?: number
}

export function MotionReveal({
  children,
  delay = 0,
  distance = 34,
  transition,
  ...props
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={reduceMotion ? undefined : { once: true, amount: 0.24 }}
      transition={{
        duration: 0.82,
        ease: [0.22, 1, 0.36, 1],
        delay,
        ...transition,
      }}
    >
      {children}
    </motion.div>
  )
}
