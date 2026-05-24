import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

const Char = ({
  char,
  i,
  total,
  scrollYProgress,
}: {
  char: string
  i: number
  total: number
  scrollYProgress: MotionValue<number>
}) => {
  const start = i / total
  const end = (i + 1) / total
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1])

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}

const AnimatedText = ({ text, className, style }: AnimatedTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const characters = useMemo(() => text.split(''), [text])

  return (
    <p ref={ref} className={className} style={style}>
      {characters.map((char, i) => (
        <Char
          key={`${char}-${i}`}
          char={char}
          i={i}
          total={characters.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  )
}

export default AnimatedText
