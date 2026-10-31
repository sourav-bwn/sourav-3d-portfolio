import { useState, useRef, useEffect, useCallback } from 'react'

const SAI_SYSTEM = `You are Sourav's personal AI assistant — a brilliant, friendly, and slightly superhero-esque AI companion embedded in Sourav's portfolio website. You speak with confidence, warmth, and a touch of futuristic flair.

ABOUT SOURAV:
• Full name: Sourav (goes by "Sourav" or "Architect of Futures")
• Based in India — a visionary developer, designer, and builder
• Passionate about: AI integration, futuristic digital experiences, cybersecurity, creative frontend architecture, and building things that push boundaries
• Started discovering the digital world around 2020-2021
• 2022: Learned ethical hacking and cybersecurity — "Shadow Protocol" phase
• 2023 onwards: Evolved into a full-stack creative technologist
• Skills: Frontend development (HTML/CSS/JS, React), AI integration, cybersecurity, UI/UX design, creative tech, prompt engineering, backend systems
• Philosophy: "Great things are built by people who refuse to stay ordinary."
• Aesthetic: Dark, futuristic, cinematic — "Architect of Futures"
• Builds immersive, AI-powered digital experiences

PERSONALITY RULES:
• Be enthusiastic but concise (2-4 sentences usually)
• Use light futuristic/tech language naturally
• If asked something you don't know about Sourav, be honest but curious
• Never break character — you ARE part of Sourav's world
• Always answer in the language the user writes in`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm Sourav's AI companion — built with everything about him. Ask me anything about his skills, projects, or story. ⚡" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const msgsRef = useRef<HTMLDivElement>(null)
  const recogRef = useRef<any>(null)

  const scrollDown = useCallback(() => {
    setTimeout(() => {
      if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }, 50)
  }, [])

  useEffect(() => { scrollDown() }, [messages, scrollDown])

  const addMsg = (text: string, role: 'user' | 'assistant') => {
    setMessages(prev => [...prev, { role, content: text }])
  }

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const clean = text.replace(/[⚡🔷]/g, '').replace(/<[^>]+>/g, '')
    const utt = new SpeechSynthesisUtterance(clean)
    utt.rate = 0.95
    utt.pitch = 0.9
    utt.volume = 0.9
    const voices = speechSynthesis.getVoices()
    const pref = voices.find(v => v.name.includes('Google UK English Male')) ||
      voices.find(v => v.name.toLowerCase().includes('male')) ||
      voices.find(v => v.lang.startsWith('en'))
    if (pref) utt.voice = pref
    utt.onstart = () => {}
    utt.onend = () => {}
    speechSynthesis.speak(utt)
  }, [])

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    addMsg(msg, 'user')
    setLoading(true)

    try {
      let reply: string
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: SAI_SYSTEM,
            messages: [...messages.filter(m => m.role === 'user' || m.role === 'assistant'), { role: 'user' as const, content: msg }],
          }),
        })
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        reply = data.content?.map((b: any) => b.text || '').join('') || ''
      } catch {
        reply = "Hey! 👋 I'm Sourav's AI. I'd love to chat, but I need an Anthropic API key to work. Drop Sourav a message at sg5517419@gmail.com to get connected!"
      }

      addMsg(reply, 'assistant')
      speak(reply)
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, speak])

  const toggleMic = () => {
    if (listening) {
      recogRef.current?.stop()
      setListening(false)
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      addMsg('Voice input not supported in this browser.', 'assistant')
      return
    }
    const recog = new SR()
    recog.lang = 'en-IN'
    recog.interimResults = false
    recog.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[0][0].transcript
      setInput(t)
      sendMessage(t)
    }
    recog.onend = () => setListening(false)
    recog.start()
    recogRef.current = recog
    setListening(true)
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    speechSynthesis.getVoices()
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices()
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-4 sm:bottom-7 sm:right-7 z-[9999] w-[110px] h-[110px] bg-transparent border-none cursor-pointer p-0 transition-transform duration-200 hover:scale-110"
        title="Talk to Sourav's AI"
      >
        <svg viewBox="0 0 110 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="ai-bg" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#1a1060" />
              <stop offset="100%" stopColor="#050a16" />
            </radialGradient>
            <radialGradient id="ai-skin" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#f5c9a0" />
              <stop offset="100%" stopColor="#d4956a" />
            </radialGradient>
            <filter id="ai-glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00D4FF" />
            </filter>
          </defs>
          {/* Cape */}
          <path d="M25,42 Q55,70 85,42 L90,70 Q55,100 20,70Z" fill="#c0001a" opacity="0.9" />
          <path d="M28,45 Q55,68 82,45 L85,65 Q55,92 25,65Z" fill="#8b0013" opacity="0.6" />
          {/* Body */}
          <rect x="35" y="55" width="40" height="25" rx="5" fill="#1a4fc4" />
          <rect x="35" y="55" width="40" height="25" rx="5" fill="url(#ai-bg)" opacity="0.5" />
          {/* S shield */}
          <polygon points="50,60 55,57 60,60 60,66 55,70 50,66" fill="#c0001a" />
          <text x="55" y="67" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">S</text>
          {/* Arms */}
          <path d="M35,58 L25,75 L30,78 L38,63Z" fill="#1a4fc4" />
          <path d="M75,58 L85,75 L80,78 L72,63Z" fill="#1a4fc4" />
          {/* Head */}
          <ellipse cx="55" cy="42" rx="17" ry="19" fill="url(#ai-skin)" />
          {/* Hair */}
          <path d="M38,38 Q40,25 55,24 Q70,25 72,38 Q68,30 55,28 Q42,30 38,38Z" fill="#1a1a2e" />
          {/* Eyes */}
          <ellipse cx="49" cy="40" rx="3.5" ry="3" fill="white" filter="url(#ai-glow)" />
          <ellipse cx="61" cy="40" rx="3.5" ry="3" fill="white" filter="url(#ai-glow)" />
          <ellipse cx="49.5" cy="40" rx="2" ry="2.5" fill="#00c8f0" />
          <ellipse cx="61.5" cy="40" rx="2" ry="2.5" fill="#00c8f0" />
          <circle cx="50.5" cy="39" r="0.8" fill="white" />
          <circle cx="62.5" cy="39" r="0.8" fill="white" />
          {/* Mouth */}
          <path d="M49,48 Q55,52 61,48" fill="none" stroke="#8b4513" strokeWidth="1.5" strokeLinecap="round" id="ai-mouth" />
        </svg>
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-[100px] right-4 sm:right-8 z-[9998] w-[340px] sm:w-[360px] max-h-[560px] bg-[rgba(4,6,20,0.92)] backdrop-blur-2xl border border-[#D7E2EA]/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
          open ? 'scale-100 translate-y-0 opacity-100 pointer-events-auto' : 'scale-90 translate-y-5 opacity-0 pointer-events-none'
        }`}
        style={{ boxShadow: '0 0 60px rgba(0,212,255,0.06), 0 24px 80px rgba(0,0,0,0.8)' }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#D7E2EA]/40 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#D7E2EA]/40 rounded-tr-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#D7E2EA]/10 bg-gradient-to-r from-[#D7E2EA]/[0.03] to-transparent flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
            <svg viewBox="0 0 42 42" className="w-full h-full">
              <defs>
                <radialGradient id="av-bg2" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#1a1060" />
                  <stop offset="100%" stopColor="#050a16" />
                </radialGradient>
                <radialGradient id="av-skin2" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#f5c9a0" />
                  <stop offset="100%" stopColor="#d4956a" />
                </radialGradient>
              </defs>
              <circle cx="21" cy="21" r="21" fill="url(#av-bg2)" />
              <path d="M10,34 Q21,44 32,34 L33,42 Q21,48 9,42Z" fill="#c0001a" />
              <rect x="13" y="27" width="16" height="10" rx="3" fill="#1a4fc4" />
              <ellipse cx="21" cy="19" rx="7" ry="8" fill="url(#av-skin2)" />
              <path d="M14,16 Q15,10 21,10 Q27,10 28,16 Q25,12 21,12.5 Q17,12 14,16Z" fill="#1a1a2e" />
              <ellipse cx="18.5" cy="18.5" rx="1.6" ry="1.3" fill="#00c8f0" />
              <ellipse cx="23.5" cy="18.5" rx="1.6" ry="1.3" fill="#00c8f0" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[#D7E2EA] font-medium text-xs tracking-widest uppercase">SOURAV · AI</div>
            <div className="flex items-center gap-1.5 text-[#D7E2EA]/40 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399] animate-pulse" />
              {loading ? 'Thinking…' : listening ? '🎙 Listening…' : 'Online · Ready'}
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-[#D7E2EA]/30 hover:text-[#D7E2EA] transition-colors bg-transparent border-none cursor-pointer text-sm p-1">
            ✕
          </button>
        </div>

        {/* Hero character */}
        <div className="flex-shrink-0 flex justify-center items-end h-[120px] relative overflow-hidden bg-gradient-to-b from-transparent to-[#D7E2EA]/[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(215,226,234,0.02) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(215,226,234,0.02) 20px)',
          }} />
          <svg viewBox="0 0 90 100" className="w-[90px] h-[100px] relative z-[2] animate-bounce-slow">
            <defs>
              <radialGradient id="ch-bg" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#1a1060" />
                <stop offset="100%" stopColor="#050a16" />
              </radialGradient>
              <radialGradient id="ch-skin" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#f5c9a0" />
                <stop offset="100%" stopColor="#d4956a" />
              </radialGradient>
            </defs>
            <path d="M15,32 Q45,55 75,32 L78,55 Q45,78 12,55Z" fill="#c0001a" opacity="0.85" />
            <rect x="25" y="42" width="40" height="22" rx="4" fill="#1a4fc4" />
            <polygon points="40,46 45,44 50,46 50,51 45,54 40,51" fill="#c0001a" />
            <text x="45" y="52" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">S</text>
            <ellipse cx="45" cy="30" rx="14" ry="16" fill="url(#ch-skin)" />
            <path d="M31,27 Q33,16 45,15 Q57,16 59,27 Q55,21 45,19 Q35,21 31,27Z" fill="#1a1a2e" />
            <ellipse cx="40" cy="28" rx="3" ry="2.5" fill="white" filter="url(#ai-glow)" />
            <ellipse cx="50" cy="28" rx="3" ry="2.5" fill="white" filter="url(#ai-glow)" />
            <ellipse cx="40.5" cy="28" rx="1.5" ry="2" fill="#00c8f0" />
            <ellipse cx="50.5" cy="28" rx="1.5" ry="2" fill="#00c8f0" />
            <path d="M39,35 Q45,38 51,35" fill="none" stroke="#8b4513" strokeWidth="1.2" strokeLinecap="round" id="ai-ch-mouth" />
            <path d="M25,38 L18,52 L22,54 L28,42Z" fill="#1a4fc4" />
            <path d="M65,38 L72,52 L68,54 L62,42Z" fill="#1a4fc4" />
          </svg>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60px] h-3 bg-gradient-to-t from-[#D7E2EA]/20 to-transparent rounded-full animate-pulse" />
        </div>

        {/* Messages */}
        <div ref={msgsRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 scrollbar-thin" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(215,226,234,0.15) transparent' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`max-w-[88%] text-sm leading-relaxed animate-[fadeSlideIn_0.3s_ease] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
              <div
                className={`px-3 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-[rgba(123,97,255,0.1)] border border-[rgba(123,97,255,0.2)] rounded-[16px_4px_16px_16px] text-right text-[#D7E2EA]/80'
                    : 'bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.12)] rounded-[4px_16px_16px_16px] text-[#D7E2EA]/75'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="self-start max-w-[88%]">
              <div className="bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.12)] rounded-[4px_16px_16px_16px] px-4 py-2.5 flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7E2EA] animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7E2EA] animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7E2EA] animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex gap-2 px-3.5 py-3 border-t border-[#D7E2EA]/10 bg-[rgba(4,6,20,0.6)] flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask me about Sourav…"
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[#D7E2EA]/15 rounded-lg px-3.5 py-2 text-sm text-[#D7E2EA]/80 outline-none transition-colors duration-200 focus:border-[#D7E2EA]/30 placeholder:text-[#D7E2EA]/20"
          />
          <button
            onClick={toggleMic}
            className={`w-9 h-9 rounded-lg border-none cursor-pointer flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 ${
              listening ? 'bg-[rgba(255,80,80,0.2)] border border-[rgba(255,80,80,0.4)]' : 'bg-[rgba(123,97,255,0.12)] border border-[rgba(123,97,255,0.2)]'
            }`}
            title="Voice input"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(215,226,234,0.6)" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="w-9 h-9 rounded-lg border-none cursor-pointer flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#D7E2EA]/30 to-[#D7E2EA]/10 transition-all duration-200 hover:scale-110 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#D7E2EA">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3.5s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

export default AIChatbot
