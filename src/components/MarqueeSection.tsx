import { useEffect, useRef, useState, useCallback } from 'react'

const row1Images = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
]

const row2Images = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

const triple = <T,>(arr: T[]): T[] => [...arr, ...arr, ...arr]

const ImageTile = ({ src }: { src: string }) => (
  <div className="flex-shrink-0 w-[420px] h-[270px] rounded-2xl overflow-hidden">
    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
  </div>
)

const MarqueeSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(200)

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const val = (window.scrollY - rect.top + window.innerHeight) * 0.3
    setOffset(val)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const row1Offset = offset - 200
  const row2Offset = -(offset - 200)

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex gap-3 mb-3" style={{ transform: `translateX(${row1Offset}px)`, willChange: 'transform' }}>
        {triple(row1Images).map((src, i) => (
          <ImageTile key={`r1-${i}`} src={src} />
        ))}
      </div>
      <div className="flex gap-3" style={{ transform: `translateX(${row2Offset}px)`, willChange: 'transform' }}>
        {triple(row2Images).map((src, i) => (
          <ImageTile key={`r2-${i}`} src={src} />
        ))}
      </div>
    </section>
  )
}

export default MarqueeSection
