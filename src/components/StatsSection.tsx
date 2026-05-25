import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useState, useEffect } from 'react'

const stats = [
  { label: 'Projects Built', target: 50 },
  { label: 'Core Skills', target: 14 },
  { label: 'Tools Mastered', target: 7 },
]

const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
      else setCount(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, target])

  return <span ref={ref}>{count}</span>
}

const StatsSection = () => {
  return (
    <section className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pb-20 sm:pb-24 md:pb-32">
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="flex-1 border border-[#D7E2EA]/20 bg-[#0C0C0C] rounded-2xl px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '50px', amount: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D7E2EA]/40 to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#D7E2EA]/[0.03] to-transparent pointer-events-none" />
            <span
              className="hero-heading font-black block leading-none mb-3"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 4.2rem)' }}
            >
              <Counter target={stat.target} />
            </span>
            <span className="text-[#D7E2EA]/40 font-light uppercase tracking-[0.3em] text-xs sm:text-sm">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default StatsSection
