import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { PageId } from '@application/navigation/navigation'
import { ScrollScene } from '@shared/ui/ScrollScene'

export type ContactPageProps = {
  onNavigate?: (id: PageId) => void
  initialDivision?: 'rrss' | 'cine' | 'labs'
}

type DivisionKey = 'rrss' | 'cine' | 'labs'

const DIVISIONS: readonly {
  id: DivisionKey
  label: string
  bgImage: string
  tags: readonly string[]
}[] = [
  {
    id: 'rrss',
    label: 'RRSS',
    bgImage: '/images/contact/rrss.jpg',
    tags: ['Campañas', 'Audiovisual', 'Redes', 'Eventos', 'Foto & Color'],
  },
  {
    id: 'cine',
    label: 'Cine',
    bgImage: '/images/contact/cine.jpg',
    tags: ['Ficción', 'Documental', 'Cortometrajes', 'Desarrollo'],
  },
  {
    id: 'labs',
    label: 'Labs',
    bgImage: '/images/contact/labs.jpg',
    tags: ['WebGL / 3D', 'VR / AR', 'App', 'I+D'],
  },
]

export function ContactPage({ onNavigate, initialDivision = 'rrss' }: ContactPageProps) {
  const [division, setDivision] = useState<DivisionKey>(initialDivision)
  const [displayedDivision, setDisplayedDivision] = useState<DivisionKey>(initialDivision)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [error, setError] = useState('')

  const tabsBarRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const tagsRowRef = useRef<HTMLDivElement>(null)
  const isTransitioningRef = useRef(false)
  const directionRef = useRef<number>(1)
  const hasMountedRef = useRef(false)

  const activeDivision = DIVISIONS.find((d) => d.id === division) ?? DIVISIONS[0]
  const displayedDivisionData = DIVISIONS.find((d) => d.id === displayedDivision) ?? DIVISIONS[0]

  // Slide tab indicator smoothly with GSAP
  useLayoutEffect(() => {
    if (!tabsBarRef.current || !indicatorRef.current) return
    const activeBtn = tabsBarRef.current.querySelector<HTMLButtonElement>(`button[data-tab-id="${division}"]`)
    if (!activeBtn) return

    gsap.to(indicatorRef.current, {
      x: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
      duration: 0.32,
      ease: 'power3.out',
    })
  }, [division])

  // Lateral entrance animation when displayedDivision updates
  useLayoutEffect(() => {
    if (!tagsRowRef.current) return
    const chips = tagsRowRef.current.querySelectorAll('.contact-tag')
    if (!chips.length) return

    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      gsap.fromTo(
        chips,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' }
      )
      return
    }

    const dir = directionRef.current
    gsap.fromTo(
      chips,
      {
        x: dir * 65,
        opacity: 0,
        filter: 'blur(6px)',
      },
      {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.36,
        stagger: 0.028,
        ease: 'power3.out',
        onComplete: () => {
          isTransitioningRef.current = false
        },
      }
    )
  }, [displayedDivision])

  const handleDivisionChange = (newDivision: DivisionKey) => {
    if (newDivision === division || isTransitioningRef.current) return

    const oldIndex = DIVISIONS.findIndex((d) => d.id === division)
    const newIndex = DIVISIONS.findIndex((d) => d.id === newDivision)
    const dir = newIndex > oldIndex ? 1 : -1
    directionRef.current = dir
    isTransitioningRef.current = true

    setDivision(newDivision)
    setSelectedTags([])

    // Lateral exit: current labels sweep to the side and disappear
    if (tagsRowRef.current) {
      const currentChips = tagsRowRef.current.querySelectorAll('.contact-tag')
      gsap.to(currentChips, {
        x: -dir * 55,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.2,
        stagger: 0.015,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayedDivision(newDivision)
        },
      })
    } else {
      setDisplayedDivision(newDivision)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Ingresa tu nombre.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    if (!formData.message.trim()) {
      setError('Cuéntanos sobre tu proyecto.')
      return
    }
    setError('')
    setStatus('sending')

    try {
      const response = await fetch('https://formsubmit.co/ajax/53f53e628df69e2ee820ee11f60159a0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          Nombre: formData.name,
          Email: formData.email,
          División: `N5 ${activeDivision.label}`,
          Especialidades: selectedTags.length > 0 ? selectedTags.join(', ') : 'General',
          Mensaje: formData.message,
          _subject: `Nuevo proyecto N5: ${activeDivision.label} - ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })

      const data = await response.json()
      if (response.ok || data.success === 'true' || data.message?.toLowerCase().includes('activation')) {
        setStatus('success')
      } else {
        throw new Error(data.message || 'Error al enviar')
      }
    } catch {
      // Fallback: abrir cliente de correo con los datos redactados
      const mailtoUrl = `mailto:produccion@n5.studio?subject=${encodeURIComponent(
        `Propuesta N5 ${activeDivision.label} - ${formData.name}`
      )}&body=${encodeURIComponent(
        `Hola N5,\n\nNombre: ${formData.name}\nEmail: ${formData.email}\nDivisión: N5 ${activeDivision.label}\nEspecialidades: ${selectedTags.join(', ')}\n\nMensaje:\n${formData.message}`
      )}`
      window.location.href = mailtoUrl
      setStatus('success')
    }
  }

  const nameSnippet = formData.name.trim() ? ` Mi nombre es ${formData.name.trim()}.` : ''
  const messageSnippet = formData.message.trim() ? ` Mensaje: "${formData.message.trim()}"` : ''
  const tagsSnippet = selectedTags.length > 0 ? ` (${selectedTags.join(', ')})` : ''

  const waUrl = `https://wa.me/593995237461?text=${encodeURIComponent(
    `Hola N5, me interesa iniciar un proyecto con N5 ${activeDivision.label}${tagsSnippet}.${nameSnippet}${messageSnippet}`
  )}`

  return (
    <section className="contact-page section-dark route-page" aria-labelledby="contact-title">
      {/* Dynamic Atmospheric Background Images per Division */}
      <div className="contact-bg-container" aria-hidden="true">
        {DIVISIONS.map(({ id, bgImage, label }) => (
          <img
            key={id}
            src={bgImage}
            alt={`Fondo N5 ${label}`}
            className={`contact-bg-image ${division === id ? 'is-active' : ''}`}
            loading="eager"
          />
        ))}
        <div className="contact-bg-vignette" />
      </div>

      <ScrollScene label="Contacto" />

      <div className="page-shell contact-shell">
        {status === 'success' ? (
          <div className="contact-minimal-success reveal">
            <h1 className="display contact-minimal-title">Mensaje enviado.</h1>
            <p className="contact-success-lead">
              Gracias, <strong>{formData.name}</strong>. Hemos recibido tu propuesta para N5 {activeDivision.label} en <code>produccion@n5.studio</code> y te responderemos a la brevedad.
            </p>
            <div className="contact-minimal-actions">
              <button
                type="button"
                className="cta-button"
                onClick={() => {
                  setFormData({ name: '', email: '', message: '' })
                  setSelectedTags([])
                  setStatus('idle')
                }}
              >
                Nuevo mensaje
              </button>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="cta-button cta-button-secondary">
                O continuar en WhatsApp ↗
              </a>
              {onNavigate && (
                <button type="button" className="text-link" onClick={() => onNavigate('home')}>
                  Volver al inicio →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="contact-centered-layout">
            <div className="contact-centered-head reveal">
              <h1 id="contact-title" className="display contact-minimal-title">
                Hablemos de<br />
                <em>tu idea.</em>
              </h1>
            </div>

            {/* Streamlined Minimalist Form with Dual Actions */}
            <form onSubmit={handleSubmit} className="contact-minimal-form reveal" noValidate>
              {/* 3-Division minimal tabs with sliding indicator */}
              <div ref={tabsBarRef} className="contact-division-bar" role="tablist" aria-label="Seleccionar división">
                <span ref={indicatorRef} className="contact-tab-slider" aria-hidden="true" />
                {DIVISIONS.map(({ id, label }) => {
                  const isActive = division === id
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      data-tab-id={id}
                      aria-selected={isActive}
                      className={`contact-division-tab ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleDivisionChange(id)}
                    >
                      N5 {label}
                    </button>
                  )
                })}
              </div>

              {/* Minimal tags for the active division with lateral entrance and exit */}
              <div className="contact-tags-viewport">
                <div ref={tagsRowRef} className="contact-tags-row" aria-label="Especialidades">
                  {displayedDivisionData.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`contact-tag ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={isSelected}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Minimalist Underline Inputs */}
              <div className="contact-inputs">
                <div className="contact-line-field">
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="contact-bare-input"
                  />
                </div>

                <div className="contact-line-field">
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Correo electrónico"
                    className="contact-bare-input"
                  />
                </div>

                <div className="contact-line-field">
                  <textarea
                    id="c-message"
                    required
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos brevemente sobre tu proyecto..."
                    className="contact-bare-input contact-bare-textarea"
                  />
                </div>
              </div>

              {error && <p className="contact-minimal-error">{error}</p>}

              {/* Dual Action: Enviar por Correo o por WhatsApp */}
              <div className="contact-dual-actions">
                <button type="submit" disabled={status === 'sending'} className="cta-button contact-send-btn">
                  {status === 'sending' ? 'Enviando...' : 'Enviar por Correo →'}
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button cta-button-secondary contact-wa-btn"
                >
                  Enviar por WhatsApp ↗
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
