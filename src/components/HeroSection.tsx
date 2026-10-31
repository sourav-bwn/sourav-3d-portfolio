import { motion } from 'framer-motion'
import ContactButton from './ContactButton'
import Magnet from './Magnet'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col overflow-x-clip">
      <motion.nav
        className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>

      <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
        <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
          <motion.h1
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Hi, i&apos;m Sourav
          </motion.h1>
        </div>

        <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10">
          <motion.p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            an architect of futures, one foot in creativity, one in engineering
          </motion.p>
          <motion.div
            className="relative z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ContactButton />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Magnet padding={150} strength={3} className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
            alt="Sourav portrait"
            className="w-full h-auto"
          />
        </Magnet>
      </motion.div>
    </section>
  )
}

export default HeroSection
