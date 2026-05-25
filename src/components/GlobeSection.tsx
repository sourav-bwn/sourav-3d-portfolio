import { useEffect, useRef, useState } from 'react'

interface Skill {
  l: string
  tag: string
  c: string
  lat: number
  lon: number
  d: string
}

const SK: Skill[] = [
  { l: 'AI Systems', tag: 'BUILDER', c: '#00D4FF', lat: 45, lon: 0, d: 'Autonomous agents, intelligent systems that think, act and evolve.' },
  { l: 'Visual Design', tag: 'ARTIST', c: '#FF6B9D', lat: 20, lon: 60, d: 'Aesthetics, atmosphere, interface beauty.' },
  { l: 'Creative Tech', tag: 'HYBRID', c: '#7B61FF', lat: -20, lon: 120, d: 'Blurring the boundary between software and personality.' },
  { l: 'Motion Design', tag: 'ARTIST', c: '#FFB347', lat: 55, lon: -80, d: 'Everything should breathe, pulse, feel alive.' },
  { l: '001 Code', tag: 'VISION', c: '#00FF9F', lat: -40, lon: -60, d: 'Proprietary cinematic grading born because no preset matched the mood.' },
  { l: 'Frontend Arch', tag: 'BUILDER', c: '#00D4FF', lat: 10, lon: -140, d: 'Immersive operating systems masquerading as websites.' },
  { l: 'Storytelling', tag: 'CREATOR', c: '#FF6B9D', lat: -55, lon: 40, d: 'Audience psychology, brand identity — intelligence needs aesthetic gravity.' },
  { l: 'Prompt Eng.', tag: 'AI', c: '#7B61FF', lat: 70, lon: 150, d: 'Talking to machines like they understand the future being built.' },
  { l: 'Brand Identity', tag: 'CREATOR', c: '#FFB347', lat: -10, lon: -30, d: 'Creating something distinctive enough that people remember it.' },
  { l: 'Systems Think.', tag: 'BUILDER', c: '#00FF9F', lat: 35, lon: -170, d: 'A website becomes an OS. An assistant becomes an entity.' },
  { l: 'Cinematic Eye', tag: 'ARTIST', c: '#FF6B9D', lat: -30, lon: 170, d: 'Color tones, compositions — noticing what others walk past.' },
  { l: 'Future Vision', tag: 'VISION', c: '#00D4FF', lat: 75, lon: -30, d: 'Standing ahead of the present, imagining ecosystems that do not exist.' },
]

interface Vec3 { x: number; y: number; z: number }

function ll3(lat: number, lon: number, r: number): Vec3 {
  const p = (90 - lat) * Math.PI / 180
  const t = (lon + 180) * Math.PI / 180
  return { x: -r * Math.sin(p) * Math.cos(t), y: r * Math.cos(p), z: r * Math.sin(p) * Math.sin(t) }
}

function rot(p: Vec3, rX: number, rY: number): Vec3 {
  const x1 = p.x * Math.cos(rY) + p.z * Math.sin(rY)
  const z1 = -p.x * Math.sin(rY) + p.z * Math.cos(rY)
  const y2 = p.y * Math.cos(rX) - z1 * Math.sin(rX)
  const z2 = p.y * Math.sin(rX) + z1 * Math.cos(rX)
  return { x: x1, y: y2, z: z2 }
}

const MESH_PTS = [
  { lat: 54, lon: 10 }, { lat: 48, lon: 2 }, { lat: 52, lon: 21 }, { lat: 41, lon: 29 },
  { lat: 60, lon: 25 }, { lat: 55, lon: -3 }, { lat: 46, lon: 14 }, { lat: 44, lon: 26 },
  { lat: 14, lon: 8 }, { lat: 6, lon: 3 }, { lat: -1, lon: 37 }, { lat: 15, lon: 32 },
  { lat: -26, lon: 28 }, { lat: 5, lon: 22 }, { lat: 30, lon: 31 }, { lat: -14, lon: 17 },
  { lat: 35, lon: 51 }, { lat: 24, lon: 46 }, { lat: 39, lon: 35 }, { lat: 55, lon: 37 },
  { lat: 28, lon: 77 }, { lat: 23, lon: 113 }, { lat: 35, lon: 139 }, { lat: 37, lon: 127 },
  { lat: 13, lon: 100 }, { lat: 1, lon: 104 }, { lat: 40, lon: 116 }, { lat: 60, lon: 90 },
  { lat: 55, lon: 60 }, { lat: 43, lon: 77 }, { lat: 18, lon: 73 }, { lat: 31, lon: 121 },
  { lat: 40, lon: -74 }, { lat: 34, lon: -118 }, { lat: 51, lon: -114 }, { lat: 19, lon: -99 },
  { lat: -23, lon: -43 }, { lat: -34, lon: -58 }, { lat: -33, lon: -70 }, { lat: 10, lon: -67 },
  { lat: 45, lon: -80 }, { lat: 30, lon: -90 }, { lat: 25, lon: -80 }, { lat: 4, lon: -74 },
  { lat: -33, lon: 151 }, { lat: -27, lon: 133 }, { lat: -36, lon: 175 },
  { lat: 65, lon: 14 }, { lat: 62, lon: 130 }, { lat: 70, lon: -25 }, { lat: -10, lon: -75 },
  { lat: 20, lon: 78 }, { lat: 45, lon: 13 }, { lat: 38, lon: 15 }, { lat: 33, lon: 44 },
]

const GlobeSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const stateRef = useRef({
    rX: 0.22,
    rY: 0,
    vX: 0,
    vY: 0.0004,
    dragging: false,
    lx: 0,
    ly: 0,
    gmx: -999,
    gmy: -999,
    hov: null as Skill | null,
    hovSx: 0,
    hovSy: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = stateRef.current
    let animId: number
    let W = 0, H = 0, CX = 0, CY = 0, R = 0

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      W = rect.width
      H = rect.height
      const dpr = window.devicePixelRatio || 1
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.scale(dpr, dpr)
      CX = W / 2
      CY = H / 2
      R = Math.min(W, H) * 0.38
    }
    resize()
    window.addEventListener('resize', resize)

    const inGlobe = (px: number, py: number) => Math.sqrt((px - CX) ** 2 + (py - CY) ** 2) <= R

    const draw = () => {
      const now = Date.now()
      ctx.clearRect(0, 0, W, H)

      // background
      ctx.fillStyle = '#0C0C0C'
      ctx.fillRect(0, 0, W, H)

      // sphere gradient
      const sph = ctx.createRadialGradient(CX - R * 0.2, CY - R * 0.2, R * 0.05, CX, CY, R)
      sph.addColorStop(0, 'rgba(12,16,32,1)')
      sph.addColorStop(0.6, 'rgba(6,8,16,1)')
      sph.addColorStop(1, 'rgba(0,0,4,1)')
      ctx.beginPath()
      ctx.arc(CX, CY, R, 0, Math.PI * 2)
      ctx.fillStyle = sph
      ctx.fill()

      // project points
      const skPos = SK.map(sk => {
        const r = rot(ll3(sk.lat, sk.lon, R), state.rX, state.rY)
        const alpha = Math.max(0, (r.z + R) / (2 * R))
        return { ...sk, sx: CX + r.x, sy: CY - r.y, alpha, vis: r.z > -R * 0.06, z: r.z }
      })
      const mPos = MESH_PTS.map(m => {
        const r = rot(ll3(m.lat, m.lon, R), state.rX, state.rY)
        const alpha = Math.max(0, (r.z + R) / (2 * R))
        return { sx: CX + r.x, sy: CY - r.y, alpha, vis: r.z > -R * 0.06, z: r.z }
      })

      // connections
      for (let i = 0; i < SK.length; i++) {
        for (let j = i + 1; j < SK.length; j++) {
          const a = skPos[i], b = skPos[j]
          if (!a.vis || !b.vis) continue
          const d = Math.sqrt((a.lat - b.lat) ** 2 + (a.lon - b.lon) ** 2)
          if (d >= 100) continue
          const al = Math.min(a.alpha, b.alpha) * 0.45
          ctx.strokeStyle = `rgba(200,210,255,${al})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.stroke()
        }
      }

      // mesh points to skill connections
      mPos.forEach((m, mi) => {
        let best = -1, bd = 999
        SK.forEach((sk, si) => {
          const d2 = Math.sqrt((MESH_PTS[mi].lat - sk.lat) ** 2 + (MESH_PTS[mi].lon - sk.lon) ** 2)
          if (d2 < bd) { bd = d2; best = si }
        })
        if (best >= 0 && bd < 90) {
          const s = skPos[best]
          if (m.vis && s.vis) {
            const al = Math.min(m.alpha, s.alpha) * 0.25
            ctx.strokeStyle = `rgba(160,170,220,${al})`
            ctx.lineWidth = 0.35
            ctx.beginPath()
            ctx.moveTo(m.sx, m.sy)
            ctx.lineTo(s.sx, s.sy)
            ctx.stroke()
          }
        }
      })

      // mesh dots
      mPos.forEach(m => {
        if (!m.vis) return
        ctx.beginPath()
        ctx.arc(m.sx, m.sy, 1.5, 0, Math.PI * 2)
        ctx.shadowColor = 'rgba(180,190,255,0.6)'
        ctx.shadowBlur = 4
        ctx.fillStyle = `rgba(200,210,255,${m.alpha * 0.65})`
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // rim glow
      const rim = ctx.createRadialGradient(CX, CY, R * 0.80, CX, CY, R * 1.02)
      rim.addColorStop(0, 'rgba(0,0,0,0)')
      rim.addColorStop(0.65, 'rgba(80,100,255,0.04)')
      rim.addColorStop(0.88, 'rgba(100,120,255,0.18)')
      rim.addColorStop(1, 'rgba(140,160,255,0.05)')
      ctx.beginPath()
      ctx.arc(CX, CY, R * 1.02, 0, Math.PI * 2)
      ctx.fillStyle = rim
      ctx.fill()

      // skill pulse rings and labels
      state.hov = null
      const t = (now % 2600) / 2600
      const t2 = ((now + 1300) % 2600) / 2600

      skPos.forEach((s) => {
        if (!s.vis) return
        const { alpha, sx, sy } = s
        const isH = inGlobe(state.gmx, state.gmy) && Math.sqrt((state.gmx - sx) ** 2 + (state.gmy - sy) ** 2) < 20
        if (isH) {
          state.hov = s as Skill
          state.hovSx = sx
          state.hovSy = sy
        }

        const pr = 8 + t * 20, pa = alpha * (1 - t) * 0.6
        ctx.beginPath()
        ctx.arc(sx, sy, pr, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,40,60,${pa})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        const pr2 = 6 + t2 * 14, pa2 = alpha * (1 - t2) * 0.35
        ctx.beginPath()
        ctx.arc(sx, sy, pr2, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,80,100,${pa2})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        const nr = isH ? 11 : 7
        ctx.shadowColor = 'rgba(255,0,30,1)'
        ctx.shadowBlur = isH ? 30 : 16
        ctx.beginPath()
        ctx.arc(sx, sy, nr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,0,30,${alpha})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(sx, sy, nr * 0.38, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,200,210,${alpha * 0.95})`
        ctx.fill()
        ctx.shadowBlur = 0

        if (alpha > 0.25) {
          ctx.font = `${isH ? '700' : '500'} ${isH ? '9' : '8'}px Kanit,sans-serif`
          ctx.fillStyle = `rgba(230,220,255,${alpha * (isH ? 1 : 0.55)})`
          ctx.textAlign = 'center'
          if (isH) { ctx.shadowColor = 'rgba(255,60,80,0.6)'; ctx.shadowBlur = 6 }
          ctx.fillText(s.l, sx, sy - 16)
          ctx.shadowBlur = 0
        }
      })

      // tooltip
      if (state.hov) {
        setHoveredSkill(state.hov)
        const wrapRect = wrap.getBoundingClientRect()
        const scrollX = window.scrollX || 0
        const scrollY = window.scrollY || 0
        let tx = wrapRect.left + state.hovSx + 25 + scrollX
        let ty = wrapRect.top + state.hovSy - 25 + scrollY
        if (tx + 220 > window.innerWidth) tx = wrapRect.left + state.hovSx - 220 + scrollX
        if (ty < 50) ty = wrapRect.top + state.hovSy + 15 + scrollY
        setTooltipPos({ x: tx, y: ty })
        canvas.style.cursor = 'pointer'
      } else {
        setHoveredSkill(null)
        canvas.style.cursor = 'grab'
      }
    }

    const loop = () => {
      if (!state.dragging) {
        state.rY += state.vY
        state.rX += state.vX
        state.vX *= 0.93
        state.vY = state.vY * 0.997 + 0.00025
        state.rX = Math.max(-0.88, Math.min(0.88, state.rX))
      }
      draw()
      animId = requestAnimationFrame(loop)
    }
    loop()

    // mouse
    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      if (!inGlobe(mx, my)) return
      state.dragging = true
      state.lx = e.clientX
      state.ly = e.clientY
      state.vX = 0
      state.vY = 0
    }
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      state.gmx = e.clientX - rect.left
      state.gmy = e.clientY - rect.top
      if (!state.dragging) return
      const dx = e.clientX - state.lx, dy = e.clientY - state.ly
      state.vY = dx * 0.003
      state.vX = -dy * 0.003
      state.rY += dx * 0.003
      state.rX -= dy * 0.003
      state.rX = Math.max(-0.88, Math.min(0.88, state.rX))
      state.lx = e.clientX
      state.ly = e.clientY
    }
    const onMouseUp = () => { state.dragging = false }

    // touch
    const onTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const tx = e.touches[0].clientX - rect.left, ty = e.touches[0].clientY - rect.top
      if (!inGlobe(tx, ty)) return
      state.dragging = true
      state.lx = e.touches[0].clientX
      state.ly = e.touches[0].clientY
      state.vX = 0
      state.vY = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!state.dragging) return
      const dx = e.touches[0].clientX - state.lx, dy = e.touches[0].clientY - state.ly
      state.vY = dx * 0.003
      state.vX = -dy * 0.003
      state.rY += dx * 0.003
      state.rX -= dy * 0.003
      state.rX = Math.max(-0.88, Math.min(0.88, state.rX))
      state.lx = e.touches[0].clientX
      state.ly = e.touches[0].clientY
      const rect = canvas.getBoundingClientRect()
      state.gmx = state.lx - rect.left
      state.gmy = state.ly - rect.top
    }
    const onTouchEnd = () => { state.dragging = false }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-10 sm:py-14 md:py-20">
      <div className="flex justify-center items-start gap-6 sm:gap-12 max-w-6xl mx-auto relative">
        {/* Key Skills sidebar */}
        <div className="hidden md:flex flex-col items-end gap-3 w-[140px] lg:w-[180px] pt-4">
          <span className="text-[#D7E2EA]/70 font-light uppercase tracking-[0.35em] text-xs text-right mb-1">
            ◈ KEY SKILLS
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-[#D7E2EA]/50 to-transparent mb-3 self-end" />
          {SK.map((sk, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 opacity-30 transition-all duration-300 hover:opacity-100 hover:-translate-x-0.5 cursor-pointer"
              onMouseEnter={() => {
                const el = document.getElementById(`ks-dot-${i}`)
                if (el) el.style.opacity = '1'
              }}
              onMouseLeave={() => {
                const el = document.getElementById(`ks-dot-${i}`)
                if (el) el.style.opacity = '0.3'
              }}
            >
              <div
                id={`ks-dot-${i}`}
                className="w-1 h-1 rounded-full flex-shrink-0 transition-opacity"
                style={{ backgroundColor: sk.c, boxShadow: `0 0 4px ${sk.c}`, opacity: 0.3 }}
              />
              <span className="text-[#D7E2EA]/60 font-light text-[10px] lg:text-xs tracking-[0.2em] whitespace-nowrap uppercase">
                {sk.l}
              </span>
            </div>
          ))}
        </div>

        {/* Globe */}
        <div ref={wrapRef} className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] flex-shrink-0 relative touch-none">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Right spacer */}
        <div className="hidden md:block w-[140px] lg:w-[180px] flex-shrink-0" />
      </div>

      {/* Tooltip */}
      {hoveredSkill && (
        <div
          className="fixed z-50 bg-[rgba(2,4,8,0.96)] border border-[#D7E2EA]/40 rounded-xl px-4 py-3 max-w-[200px] pointer-events-none backdrop-blur-md"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="text-[#D7E2EA]/60 text-[10px] uppercase tracking-[0.25em] mb-0.5" style={{ color: hoveredSkill.c }}>
            ◈ {hoveredSkill.tag}
          </div>
          <div className="text-[#D7E2EA] font-medium text-xs sm:text-sm mb-1">{hoveredSkill.l}</div>
          <div className="text-[#D7E2EA]/50 text-[11px] leading-relaxed">{hoveredSkill.d}</div>
        </div>
      )}
    </section>
  )
}

export default GlobeSection
