import FadeIn from './FadeIn'

const services = [
  {
    number: '01',
    title: 'AI Systems',
    description:
      'Building autonomous AI agents and intelligent systems that think, act, automate, and evolve. Connecting disparate intelligence into unified, responsive ecosystems.',
  },
  {
    number: '02',
    title: 'Visual Design',
    description:
      'Cinematic grading with a proprietary visual language — the 001 Code. Crafting atmospheric, minimal designs with attention to color, lighting, and spatial harmony.',
  },
  {
    number: '03',
    title: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences with cinematic polish.',
  },
  {
    number: '04',
    title: 'Brand Identity',
    description:
      'Algorithmic generation of cohesive visual identities — from logos to full brand systems — aligned with a core narrative and audience psychology.',
  },
  {
    number: '05',
    title: 'Frontend Engineering',
    description:
      'Designing and engineering modern, immersive websites with clean architecture, creative technology, and user experience at the forefront.',
  },
]

const ServicesSection = () => {
  return (
    <section
      className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Services
      </h2>
      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={30}>
            <div className="flex gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] last:border-b-0">
              <span
                className="text-[#0C0C0C] font-black flex-shrink-0 leading-none"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col justify-center">
                <h3
                  className="text-[#0C0C0C] font-medium uppercase leading-tight"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl opacity-60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
