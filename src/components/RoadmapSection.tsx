import FadeIn from './FadeIn'

const roadmap = [
  { year: '2021', phase: 'First Contact', desc: 'Discovered the digital world and became obsessed with technology.' },
  { year: '2022', phase: 'Shadow Protocol', desc: 'Learned ethical hacking and cybersecurity systems.' },
  { year: '2023', phase: 'Code Awakening', desc: 'Started freelancing and building with code.' },
  { year: '2024', phase: 'Creator Expansion', desc: 'Expanded into software, web design, and animation.' },
  { year: '2025', phase: 'AI Ascension', desc: 'Entered the world of Artificial Intelligence.' },
  { year: '2026', phase: 'Intelligence Integration', desc: 'Integrated AI into futuristic digital experiences.' },
]

const RoadmapSection = () => {
  return (
    <section className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 text-center">
      <FadeIn delay={0} y={40}>
        <span className="text-[#D7E2EA]/50 font-light uppercase tracking-[0.3em] text-xs sm:text-sm block mb-2">
          ◈ The Chronicle
        </span>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight mb-16 sm:mb-20"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 120px)' }}
        >
          The Journey So Far
        </h2>
      </FadeIn>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D7E2EA]/30 to-transparent hidden md:block" />

        {roadmap.map((item, i) => (
          <FadeIn
            key={item.year}
            delay={i * 0.1}
            y={30}
            className={`relative flex items-start gap-6 md:gap-10 mb-10 last:mb-0 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } flex-row`}
          >
            <div className="hidden md:flex flex-1 justify-end">
              {i % 2 === 0 ? null : <div />}
            </div>

            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 mt-5">
              <div className="w-3 h-3 rounded-full bg-[#D7E2EA] shadow-[0_0_8px_#D7E2EA,0_0_20px_rgba(215,226,234,0.6)]" />
            </div>

            <div
              className="flex-1 max-w-[calc(100%-2rem)] md:max-w-[calc(50%-2.5rem)] border border-[#D7E2EA]/20 bg-[#0C0C0C] rounded-2xl px-5 sm:px-7 py-5 sm:py-6 text-left transition-all duration-300 hover:border-[#D7E2EA]/50 hover:shadow-lg hover:shadow-black/30"
            >
              <span
                className="hero-heading font-black block leading-none mb-1"
                style={{ fontSize: 'clamp(1rem, 3vw, 1.6rem)' }}
              >
                {item.year}
              </span>
              <span className="text-[#D7E2EA]/70 font-medium uppercase tracking-[0.2em] text-xs block mb-2">
                {item.phase}
              </span>
              <p className="text-[#D7E2EA]/50 font-light text-sm sm:text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

export default RoadmapSection
