import FadeIn from './FadeIn'

const skills = [
  { name: 'Autonomous AI Agents', color: '#00D4FF' },
  { name: 'Visual Design', color: '#FF61D8' },
  { name: 'Creative Technology', color: '#FFB347' },
  { name: 'Motion Design', color: '#7B61FF' },
  { name: 'Cinematic Grading · 001', color: '#FCD34D' },
  { name: 'Frontend Engineering', color: '#00FFB2' },
  { name: 'AI Systems', color: '#61DDFF' },
  { name: 'Storytelling', color: '#F87171' },
  { name: 'Interface Architecture', color: '#A78BFA' },
  { name: 'Audience Psychology', color: '#34D399' },
  { name: 'Prompt Engineering', color: '#FB923C' },
  { name: 'Brand Identity', color: '#818CF8' },
  { name: 'Systems Thinking', color: '#2DD4BF' },
  { name: 'Future Vision', color: '#F472B6' },
]

const SkillsSection = () => {
  return (
    <section className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 text-center">
      <FadeIn delay={0} y={40}>
        <span className="text-[#D7E2EA]/50 font-light uppercase tracking-[0.3em] text-xs sm:text-sm block mb-2">
          ◈ The Architecture
        </span>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight mb-12 sm:mb-16"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 120px)' }}
        >
          Systems of Thought
        </h2>
      </FadeIn>
      <div className="flex flex-wrap justify-center gap-3 max-w-[860px] mx-auto">
        {skills.map((skill, i) => (
          <FadeIn key={skill.name} delay={i * 0.04} y={20} duration={0.5}>
            <span
              className="inline-block px-5 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-full border transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: `${skill.color}55`,
                color: skill.color,
                backgroundColor: `${skill.color}0C`,
                textShadow: `0 0 8px ${skill.color}55`,
                boxShadow: `0 0 10px ${skill.color}15, inset 0 0 8px ${skill.color}08`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = skill.color
                e.currentTarget.style.backgroundColor = `${skill.color}1A`
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.textShadow = `0 0 14px ${skill.color}`
                e.currentTarget.style.boxShadow = `0 0 22px ${skill.color}40, inset 0 0 14px ${skill.color}10`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${skill.color}55`
                e.currentTarget.style.backgroundColor = `${skill.color}0C`
                e.currentTarget.style.color = skill.color
                e.currentTarget.style.textShadow = `0 0 8px ${skill.color}55`
                e.currentTarget.style.boxShadow = `0 0 10px ${skill.color}15, inset 0 0 8px ${skill.color}08`
              }}
            >
              {skill.name}
            </span>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
