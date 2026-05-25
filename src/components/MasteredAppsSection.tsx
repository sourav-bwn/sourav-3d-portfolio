import FadeIn from './FadeIn'

const apps = [
  { name: 'Photoshop', icon: '🎨' },
  { name: 'Illustrator', icon: '✒️' },
  { name: 'Premiere Pro', icon: '🎬' },
  { name: 'After Effects', icon: '✨' },
  { name: 'Lightroom', icon: '📷' },
  { name: 'Figma', icon: '🔷' },
  { name: 'Canva', icon: '🖼️' },
  { name: 'CapCut', icon: '✂️' },
  { name: 'PicsArt', icon: '🌈' },
]

const MasteredAppsSection = () => {
  return (
    <section className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pb-20 sm:pb-24 md:pb-32 text-center">
      <FadeIn delay={0} y={40}>
        <span className="text-[#D7E2EA]/50 font-light uppercase tracking-[0.3em] text-xs sm:text-sm block mb-2">
          ◈ The Toolset
        </span>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 8vw, 80px)' }}
        >
          Softwares I Master
        </h2>
        <p className="text-[#D7E2EA]/35 font-light text-sm sm:text-base mb-10 sm:mb-12">
          Not just familiar — deeply fluent in every one of these.
        </p>
      </FadeIn>
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-[500px] mx-auto">
        {apps.map((app, i) => (
          <FadeIn key={app.name} delay={i * 0.06} y={20} duration={0.5}>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0C0C0C] border border-[#D7E2EA]/15 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-black/50">
                {app.icon}
              </div>
              <span className="text-[#D7E2EA]/35 text-[10px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 group-hover:text-[#D7E2EA]/80">
                {app.name}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

export default MasteredAppsSection
