import { motion } from 'framer-motion'
import type { ReactNode, ElementType } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  as?: ElementType
}

const FadeIn = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, as }: FadeInProps) => {
  const Component = as ? motion.create(as) : motion.div

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  )
}

export default FadeIn
