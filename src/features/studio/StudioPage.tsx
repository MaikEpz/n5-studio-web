import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigation } from '@features/navigation/Navigation'
import { DivisionPanel } from '@features/divisions/DivisionPanel'
import { Clients, ClientStrip, ContactCta, FeaturedWork } from '@features/home/HomeSections'
import { RrssPage } from '@features/rrss/RrssPage'
import { LabsPage } from '@features/labs/LabsPage'
import { CinePage } from '@features/cine/CinePage'
import { WorkPage } from '@features/work/WorkPage'
import { StudioHistory } from '@features/studio/StudioHistory'
import { StudioTeam } from '@features/studio/StudioPeople'
import { CinematicOverlay } from '../../components/CinematicOverlay'
import { ScrollScene } from '@shared/ui/ScrollScene'
import { SiteFooter } from '@shared/ui/SiteFooter'
import { usePageNavigation } from '@infrastructure/navigation/usePageNavigation'
import { useStudioContent } from '@features/studio/useStudioContent'
import { ScrollFrameSequence } from '@shared/ui/ScrollFrameSequence'
import { BrandLogo } from '@shared/ui/BrandLogo'
import { dependencies } from '@app/dependencies'
import { ContactPage } from '@features/contact/ContactPage'

gsap.registerPlugin(ScrollTrigger)

function ManifestoBelief({ lines }: { lines: readonly string[] }) {
  const phrases = lines.map((line) => line.replace(/^Creemos en\s+/i, ''))
  const [index, setIndex] = useState(0)
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (phrases.length < 2) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const interval = window.setInterval(() => {
      const value = valueRef.current
      if (!value) return

      const showNext = () => {
        setIndex((current) => (current + 1) % phrases.length)
        if (reduceMotion) return
        requestAnimationFrame(() => {
          if (!valueRef.current) return
          gsap.fromTo(valueRef.current,
            { y: 18, opacity: 0, filter: 'blur(6px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out', overwrite: true },
          )
        })
      }

      if (reduceMotion) showNext()
      else gsap.to(value, {
        y: -18,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.32,
        ease: 'power2.in',
        overwrite: true,
        onComplete: showNext,
      })
    }, 2800)

    return () => {
      window.clearInterval(interval)
      if (valueRef.current) gsap.killTweensOf(valueRef.current)
    }
  }, [phrases.length])

  if (!phrases.length) return null
  return (
    <p className="manifesto-belief reveal reveal-right" aria-live="polite">
      <span className="manifesto-belief-prefix">Creemos en</span>
      <span className="manifesto-belief-value" ref={valueRef}>{phrases[index]}</span>
    </p>
  )
}

export function StudioPage() {
  const root = useRef<HTMLDivElement>(null)
  // Sube cuando una página cambia de vista sin cambiar de ruta (p. ej. abrir un Case Study) para rehacer las animaciones.
  const [viewVersion, setViewVersion] = useState(0)
  const refreshAnimations = useCallback(() => setViewVersion((version) => version + 1), [])
  const contentState = useStudioContent(dependencies.studioContentRepository)
  const { active, scrolled, navigate, scrollToId } = usePageNavigation(contentState.status === 'success', viewVersion)

  useEffect(() => {
    if (contentState.status === 'idle' || contentState.status === 'loading') return
    const preloader = document.getElementById('initial-preloader')
    if (!preloader) return
    preloader.classList.add('is-hidden')
    const timeout = window.setTimeout(() => preloader.remove(), 400)
    return () => window.clearTimeout(timeout)
  }, [contentState.status])

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !root.current) return
    const context = gsap.context(() => {
      if (root.current?.querySelector('#inicio')) {
        gsap.timeline({ delay: 0.15 })
          .fromTo('.hero-brand-block', {
            xPercent: -120,
            yPercent: -10,
            rotateY: 15,
            scale: 0.85,
            opacity: 0,
            filter: 'blur(10px)',
          }, {
            xPercent: 0,
            yPercent: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power4.out',
          }, 0)
          .fromTo('.hero-intro', {
            xPercent: 35,
            opacity: 0,
          }, {
            xPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
          }, 0.16)
          .fromTo('.hero-foot', {
            yPercent: 50,
            opacity: 0,
          }, {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          }, 0.28)
        gsap.fromTo('.hero-image',
          { scale: 1.32, clipPath: 'inset(0% 0% 0% 0%)' },
          { scale: 0.76, clipPath: 'inset(3% 3% 3% 3%)', ease: 'none', scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom bottom', scrub: 1 } },
        )
        gsap.fromTo('.hero-image canvas, .hero-image img',
          { scale: 1.12 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom bottom', scrub: 1 } },
        )
        const heroTextTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '#inicio',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.1,
            invalidateOnRefresh: true,
          },
        })
        heroTextTimeline
          .to('.hero-foot', {
            yPercent: 50,
            opacity: 0,
            duration: 0.22,
            ease: 'power1.out',
          }, 0)
          .to('.hero-intro', {
            xPercent: 35,
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
          }, 0)
          .to('.hero-brand-block', {
            xPercent: -120,
            yPercent: -10,
            rotateY: 15,
            scale: 0.85,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.38,
            ease: 'power2.in',
          }, 0.02)
          .fromTo('.hero-white-fade', {
            opacity: 0,
          }, {
            opacity: 1,
            duration: 0.14,
            ease: 'power2.inOut',
          }, 0.85)
          .to('.hero-progress', {
            opacity: 0,
            duration: 0.12,
            ease: 'power1.in',
          }, 0.85)
        gsap.fromTo('.hero-progress span', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom bottom', scrub: true } })
      }
      const mainSections = gsap.utils.toArray<HTMLElement>('#contenido > section, #contenido > div > section')
      // Todas las secciones salvo la última tienen entrada y salida con punto de reposo (CLAUDE.md).
      // La primera ya está en reposo al cargar, así que solo anima su salida al bajar.
      const middleSections = mainSections.length > 1 ? mainSections.slice(0, -1) : []

      const isMobile = window.matchMedia('(max-width: 900px)').matches
      const xOffset = isMobile ? 90 : 190
      const yOffset = isMobile ? 25 : 40
      const rotY = isMobile ? 0 : 10

      // Punto de reposo (ver CLAUDE.md): cada sección tiene un tramo de scroll en el que se ve completa
      // y ningún elemento está entrando ni saliendo. Las entradas terminan antes y las salidas empiezan después.
      const vh = innerHeight
      const minPhase = vh * 0.25
      const plans = middleSections.map((section) => {
        const rect = section.getBoundingClientRect()
        const top = rect.top + scrollY
        const overflow = section.offsetHeight - vh
        const restStart = top + Math.min(0, overflow)
        const restEnd = top + Math.max(0, overflow)
        const fits = overflow <= 0
        const elements = [...section.querySelectorAll<HTMLElement>('.reveal')].map((element) => {
          const box = element.getBoundingClientRect()
          const elTop = box.top + scrollY
          const elBottom = box.bottom + scrollY
          const enterEnd = fits ? Math.min(restStart, elTop - vh * 0.6) : elTop - vh * 0.6
          const exitStart = fits ? Math.max(restEnd, elBottom - vh * 0.4) : elBottom - vh * 0.4
          return {
            element,
            enterStart: Math.min(elTop - vh, enterEnd - minPhase),
            enterEnd,
            exitStart,
            exitEnd: Math.max(elBottom, exitStart + minPhase),
          }
        })
        return { section, restStart, restEnd, elements }
      })

      plans.forEach(({ section, restStart, restEnd, elements }) => {
        elements.forEach(({ element, enterStart, enterEnd, exitStart, exitEnd }) => {
          const side = element.classList.contains('reveal-left') ? -1 : element.classList.contains('reveal-right') ? 1 : 0
          const hidden = (direction: 1 | -1) => side === 0
            ? { x: 0, y: direction * yOffset * 1.5, z: 0, rotateY: 0, opacity: 0, filter: 'blur(8px)' }
            : { x: side * xOffset, y: direction * yOffset, z: 90, rotateY: -side * rotY, opacity: 0, filter: 'blur(8px)' }
          // La línea de tiempo usa píxeles de scroll como unidad de duración.
          gsap.timeline({ scrollTrigger: { trigger: section, start: enterStart, end: exitEnd, scrub: 0.5 } })
            .fromTo(element, hidden(1), { x: 0, y: 0, z: 0, rotateY: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.out', duration: enterEnd - enterStart }, 0)
            .to(element, { ...hidden(-1), ease: 'power1.in', duration: exitEnd - exitStart }, exitStart - enterStart)
        })

        const sceneBadge = section.querySelector<HTMLElement>('.scroll-scene')
        if (sceneBadge) {
          const start = restStart - minPhase
          const end = restEnd + minPhase
          gsap.timeline({ scrollTrigger: { trigger: section, start, end, scrub: 0.5 } })
            .fromTo(sceneBadge, { opacity: 0, scale: 1.12 }, { opacity: 0.5, scale: 1, ease: 'power1.out', duration: minPhase }, 0)
            .to(sceneBadge, { opacity: 0, scale: 0.92, ease: 'power1.in', duration: minPhase }, restEnd - start)
        }
      })

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element, index) => {
        if (middleSections.some((sec) => sec.contains(element))) return
        // En la primera sección, lo que ya está en pantalla al cargar se muestra completo (es su punto de reposo).
        if (mainSections[0]?.contains(element) && element.getBoundingClientRect().top < window.innerHeight) return
        const isRight = element.classList.contains('reveal-right') ||
          (!element.classList.contains('reveal-left') && (
            index % 2 === 1 ||
            element.matches(':nth-child(even)')
          ))
        const isMobile = window.matchMedia('(max-width: 900px)').matches
        const xOffset = isMobile ? (isRight ? 60 : -60) : (isRight ? 120 : -120)
        const rotY = isMobile ? 0 : (isRight ? -8 : 8)

        gsap.fromTo(element,
          { x: xOffset, z: 90, rotateY: rotY, opacity: 0, filter: 'blur(7px)' },
          {
            x: 0,
            z: 0,
            rotateY: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top 98%',
              end: 'clamp(top 68%)',
              scrub: 0.55,
            },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('.image-reveal').forEach((element) => {
        const image = element.querySelector('img')
        gsap.fromTo(element, { clipPath: 'inset(12% 0 12% 0)' }, { clipPath: 'inset(0% 0 0% 0)', ease: 'none', scrollTrigger: { trigger: element, start: 'top 90%', end: 'center 55%', scrub: 0.8 } })
        if (image) gsap.fromTo(image, { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: element, start: 'top 95%', end: 'bottom 20%', scrub: 1 } })
      })
      gsap.utils.toArray<HTMLElement>('.division-stage-frame').forEach((frame) => {
        const panel = frame.closest('.division-panel') as HTMLElement
        const image = frame.querySelector('img')
        gsap.fromTo(frame,
          { scale: 1.08 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top top', scrub: .2 } },
        )
        if (image) gsap.fromTo(image, { scale: 1.22, yPercent: -4 }, { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: .2 } })
      })
      gsap.utils.toArray<HTMLElement>('.scroll-scene').forEach((scene) => {
        if (middleSections.some((sec) => sec.contains(scene))) return
        gsap.fromTo(scene, { opacity: 0, scale: 1.12 }, { opacity: .5, scale: 1, ease: 'none', scrollTrigger: { trigger: scene.parentElement, start: 'top bottom', end: 'top 30%', scrub: .25 } })
      })
    }, root)
    return () => context.revert()
  }, [contentState.status, active, viewVersion])

  if (contentState.status === 'idle' || contentState.status === 'loading') return null
  if (contentState.status === 'error') return <div className="app-status" role="alert">No fue posible cargar el contenido de N5.</div>
  const { creativeSystem, divisions, manifesto } = contentState.data
  const rrssDivision = divisions.find((division) => division.id === 'rrss')
  const labsDivision = divisions.find((division) => division.id === 'labs')
  const cineDivision = divisions.find((division) => division.id === 'cine')

  return (
    <div ref={root}>
      <Navigation active={active} scrolled={scrolled} onNavigate={navigate} />
      <CinematicOverlay />
      <main id="contenido">
        {active === 'home' && <>
          <section id="inicio" className="hero section-dark" aria-labelledby="hero-title">
            <ScrollScene />
            <div className="hero-sticky">
              <div className="hero-image">
                <ScrollFrameSequence triggerSelector="#inicio" />
              </div>
              <div className="hero-shade" /><div className="noise" aria-hidden="true" />
              <div className="hero-progress" aria-hidden="true"><span /></div>
              <div className="hero-white-fade" aria-hidden="true" />
              <div className="hero-content page-shell">
                <div className="hero-lockup">
                  <div className="hero-brand-block">
                    <h1 id="hero-title" className="hero-title" aria-label="N5 Studio">
                      <span className="line">
                        <span className="hero-title-n5"><BrandLogo /></span>
                        <span className="hero-title-studio">Studio</span>
                      </span>
                    </h1>
                    <p className="hero-count">Tres unidades, una visión.</p>
                  </div>
                  <p className="hero-intro">N5 integra <span className="hero-intro-emphasis"><strong>narrativa</strong>, producción audiovisual, <strong>tecnología</strong> e innovación</span> para transformar ideas en experiencias.</p>
                </div>
                <div className="hero-foot">
                  <ClientStrip />
                  <button
                    onClick={() => scrollToId('divisiones')}
                    className="scroll-cue"
                    aria-label="Desplazarse hacia abajo"
                  >
                    <svg
                      className="scroll-arrow"
                      viewBox="0 0 24 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 3L12 13L22 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="divisiones" className="divisions section-dark" aria-labelledby="divisions-title">
            <ScrollScene />
            <div className="division-list"><DivisionPanel divisions={divisions} onNavigate={navigate} /></div>
          </section>

          <FeaturedWork onNavigate={navigate} />
          <ContactCta onNavigate={navigate} />

        </>}

        {active === 'rrss' && rrssDivision && <RrssPage division={rrssDivision} onNavigate={navigate} />}
        {active === 'work' && <WorkPage onNavigate={navigate} onViewChange={refreshAnimations} />}
        {active === 'labs' && labsDivision && <LabsPage division={labsDivision} onNavigate={navigate} />}
        {active === 'cine' && cineDivision && <CinePage division={cineDivision} onNavigate={navigate} />}

        {active === 'contacto' && <ContactPage onNavigate={navigate} />}

        {active === 'studio' && <>
          <section id="manifiesto" className="manifesto section-dark route-page" aria-labelledby="manifesto-title">
          <ScrollScene />
          <div className="page-shell manifesto-inner">
            <p className="eyebrow eyebrow-accent reveal reveal-left">Manifiesto N5</p>
            <div className="manifesto-grid">
              <div>
                <h2 id="manifesto-title" className="manifesto-lead reveal reveal-left">No buscamos producir más.</h2>
                <p className="manifesto-answer reveal reveal-left">Buscamos crear <em>grandes proyectos</em> de forma consistente.</p>
              </div>
              <ManifestoBelief lines={manifesto} />
            </div>
          </div>
        </section>

          <StudioHistory />
          <StudioTeam />

          <section id="filosofia" className="philosophy section-light route-page" aria-labelledby="philosophy-title">
          <ScrollScene />
          <div className="page-shell">
            <div className="section-intro reveal reveal-left"><p className="eyebrow">Filosofía N5</p><p className="section-index">La creatividad necesita estructura</p></div>
            <div className="philosophy-head">
              <h2 id="philosophy-title" className="display reveal reveal-left">La estructura no limita.<br /><em>Libera el talento.</em></h2>
              <p className="reveal reveal-right">Las mejores ideas alcanzan su potencial cuando hay procesos claros, personas preparadas y criterios compartidos. Construimos equipos capaces de aportar su talento dentro de un sistema.</p>
            </div>
            <ol className="system-list">{creativeSystem.map((item, index) => <li className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} key={item}>{item}</li>)}</ol>
          </div>
          </section>

          <Clients footer theme="dark" />
        </>}
      </main>
    </div>
  )
}
