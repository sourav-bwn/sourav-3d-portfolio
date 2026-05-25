import HeroSection from './components/HeroSection'
import GlobeSection from './components/GlobeSection'
import MarqueeSection from './components/MarqueeSection'
import AboutSection from './components/AboutSection'
import SkillsSection from './components/SkillsSection'
import StatsSection from './components/StatsSection'
import MasteredAppsSection from './components/MasteredAppsSection'
import ServicesSection from './components/ServicesSection'
import ProjectsSection from './components/ProjectsSection'
import RoadmapSection from './components/RoadmapSection'
import ContactSection from './components/ContactSection'
import AIChatbot from './components/AIChatbot'

function App() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <HeroSection />
      <GlobeSection />
      <MarqueeSection />
      <AboutSection />
      <SkillsSection />
      <StatsSection />
      <MasteredAppsSection />
      <ServicesSection />
      <ProjectsSection />
      <RoadmapSection />
      <ContactSection />
      <AIChatbot />
    </div>
  )
}

export default App
