import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigation } from '@features/navigation/Navigation'
import { DivisionPanel } from '@features/divisions/DivisionPanel'
import { Clients, ContactCta, FeaturedWork } from '@features/home/HomeSections'
import { RrssPage } from '@features/rrss/RrssPage'
import { CinematicOverlay } from '../../components/CinematicOverlay'
import { ScrollScene } from '@shared/ui/ScrollScene'
import { BrandLogo } from '@shared/ui/BrandLogo'
import { usePageNavigation } from '@infrastructure/navigation/usePageNavigation'
import { useStudioContent } from '@features/studio/useStudioContent'
import { HeroVideoSequence } from '@features/studio/HeroVideoSequence'
import { LoadingScreen } from '@shared/ui/LoadingScreen'
import { dependencies } from '@app/dependencies'

gsap.registerPlugin(ScrollTrigger)

// Secciones definidas en la arquitectura web de Miro, pendientes de diseño.
const plannedPages = {
  work: { eyebrow: 'Work', title: 'Proyectos', sections: ['Todos los proyectos', 'Commercial / RRSS', 'Film / Cine', 'Experiences / Labs'] },
  cine: { eyebrow: 'N5 Cine', title: 'Cine', sections: ['Filosofía', 'Documentales', 'Cortometrajes', 'Largometrajes', 'Cine para redes', 'En desarrollo'] },
  labs: { eyebrow: 'N5 Labs', title: 'Experiencias', sections: ['Qué hacemos', 'VR / MR', '3D', 'Apps', 'Interactive', 'Selected Work'] },
  contacto: { eyebrow: 'Contacto', title: 'Iniciar proyecto', sections: ['Tipo de producción', 'Descripción del proyecto', 'Iniciar proyecto'] },
} as const

export function StudioPage() {
  const root = useRef<HTMLDivElement>(null)
  const contentState = useStudioContent(dependencies.studioContentRepository)
  const { active, scrolled, navigate, scrollToId } = usePageNavigation(contentState.status === 'success')

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !root.current) return
    const context = gsap.context(() => {
      if (root.current?.querySelector('#inicio')) {
        gsap.from('.hero-title .line span, .hero-foot > *', { yPercent: 110, opacity: 0, duration: 1.35, stagger: 0.1, ease: 'power4.out', delay: 0.15 })
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
          .to('.hero-orbit', {
            rotate: 85,
            scale: 0.65,
            opacity: 0,
            duration: 0.35,
            ease: 'power1.in',
          }, 0)
          .to('.hero-title .line:nth-child(1)', {
            xPercent: 120,
            yPercent: -10,
            rotateY: -15,
            scale: 0.85,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.38,
            ease: 'power2.in',
          }, 0.02)
          .to('.hero-title .line:nth-child(2)', {
            xPercent: -120,
            yPercent: 10,
            rotateY: 15,
            scale: 0.85,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.42,
            ease: 'power2.in',
          }, 0.05)
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
      const middleSections = mainSections.length > 2 ? mainSections.slice(1, -1) : []

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
      if (root.current?.querySelector('.ecosystem')) {
        gsap.to('.ecosystem-orbit.one', { rotate: 140, ease: 'none', scrollTrigger: { trigger: '.ecosystem', start: 'top bottom', end: 'bottom top', scrub: 1 } })
        gsap.to('.ecosystem-orbit.two', { rotate: -90, ease: 'none', scrollTrigger: { trigger: '.ecosystem', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      }
      gsap.utils.toArray<HTMLElement>('.division-stage-frame').forEach((frame) => {
        const panel = frame.closest('.division-panel') as HTMLElement
        const image = frame.querySelector('img')
        gsap.fromTo(frame,
          { scale: 1.08 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top top', scrub: .2 } },
        )
        if (image) gsap.fromTo(image, { scale: 1.22, yPercent: -4 }, { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: .2 } })
      })
      // Los efectos de fondo son fijos: deben aparecer y desaparecer dentro de su sección para no quedar sobre las siguientes.
      if (root.current?.querySelector('#n5')) {
        gsap.timeline({ scrollTrigger: { trigger: '#n5', start: 'top bottom', end: 'bottom top', scrub: .25 } })
          .fromTo('.cinematic-reticle', { scale: 1.8, opacity: 0 }, { scale: 1, opacity: .28, ease: 'none', duration: .5 }, 0)
          .to('.cinematic-reticle', { scale: .6, opacity: 0, ease: 'none', duration: .5 }, .5)
      }
      if (root.current?.querySelector('#divisiones')) {
        gsap.timeline({ scrollTrigger: { trigger: '#divisiones', start: 'top bottom', end: 'bottom top', scrub: .2 } })
          .fromTo('.cinematic-film-rail', { xPercent: 110, rotate: -8, opacity: 0 }, { xPercent: -5, rotate: -1, opacity: .34, ease: 'none', duration: .5 }, 0)
          .to('.cinematic-film-rail', { xPercent: -120, rotate: 6, opacity: 0, ease: 'none', duration: .5 }, .5)
      }
      gsap.utils.toArray<HTMLElement>('.scroll-scene').forEach((scene) => {
        if (middleSections.some((sec) => sec.contains(scene))) return
        gsap.fromTo(scene, { opacity: 0, scale: 1.12 }, { opacity: .5, scale: 1, ease: 'none', scrollTrigger: { trigger: scene.parentElement, start: 'top bottom', end: 'top 30%', scrub: .25 } })
      })
    }, root)
    return () => context.revert()
  }, [contentState.status, active])

  if (contentState.status === 'idle' || contentState.status === 'loading') return <LoadingScreen />
  if (contentState.status === 'error') return <div className="app-status" role="alert">No fue posible cargar el contenido de N5.</div>
  const { creativeSystem, directionFocus, divisions, manifesto, principles, valueTypes } = contentState.data
  const rrssDivision = divisions.find((division) => division.id === 'rrss')

  return (
    <div ref={root}>
      <Navigation active={active} scrolled={scrolled} onNavigate={navigate} />
      <CinematicOverlay />
      <main id="contenido">
        {active === 'home' && <>
          <section id="inicio" className="hero section-dark" aria-labelledby="hero-title">
            <ScrollScene label="Origen de una idea" />
            <div className="hero-sticky">
              <div className="hero-image">
                <HeroVideoSequence triggerSelector="#inicio" />
              </div>
              <div className="hero-shade" /><div className="noise" aria-hidden="true" />
              <div className="hero-orbit" aria-hidden="true" />
              <div className="hero-progress" aria-hidden="true"><span /></div>
              <div className="hero-white-fade" aria-hidden="true" />
              <div className="hero-content page-shell">
                <h1 id="hero-title" className="hero-title">
                  <span className="line inset-left"><span>Ideas que</span></span>
                  <span className="line inset-right"><span>transcienden</span></span>
                </h1>
                <div className="hero-foot">
                  <p>Narrativa, producción audiovisual,<br />tecnología e innovación.</p>
                  <button
                    onClick={() => scrollToId('n5')}
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
                  <p className="hero-count">Tres unidades.<br />Una visión.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="n5" className="identity section-light" aria-labelledby="identity-title">
            <ScrollScene label="Identidad del estudio" />
            <div className="page-shell">
              <div className="section-intro reveal reveal-left"><p className="eyebrow">Qué es N5</p><p className="section-index">Manifiesto</p></div>
              <div className="identity-grid">
                <h2 id="identity-title" className="display reveal reveal-left">Un estudio.<br /><em>Tres fuerzas.</em></h2>
                <div className="lead-copy reveal reveal-right">
                  <p>N5 integra <strong>narrativa, producción audiovisual, tecnología e innovación</strong> para transformar ideas en experiencias.</p>
                  <p>No se limita a una sola disciplina. Sus tres unidades responden a necesidades diferentes, conectadas por una misma filosofía: crear proyectos con identidad y valor.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="divisiones" className="divisions section-light" aria-labelledby="divisions-title">
            <ScrollScene label="Tres especialidades" />
            <div className="division-list"><DivisionPanel divisions={divisions} /></div>
          </section>

          <FeaturedWork onNavigate={navigate} />
          <Clients />
          <ContactCta onNavigate={navigate} />

        </>}

        {active === 'rrss' && rrssDivision && <RrssPage division={rrssDivision} onNavigate={navigate} />}

        {active in plannedPages && (() => {
          const page = plannedPages[active as keyof typeof plannedPages]
          return (
            <section key={active} className="planned-page section-dark route-page" aria-labelledby="planned-title">
              <div className="page-shell">
                <div className="section-intro reveal reveal-left"><p className="eyebrow">{page.eyebrow}</p><p className="section-index">En construcción</p></div>
                <h2 id="planned-title" className="display reveal reveal-left">{page.title}</h2>
                <ol className="planned-list reveal reveal-right">{page.sections.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
              </div>
            </section>
          )
        })()}

        {active === 'studio' && <>
          <section id="filosofia" className="philosophy section-dark route-page" aria-labelledby="philosophy-title">
          <ScrollScene label="Propósito y visión" />
          <div className="page-shell">
            <div className="section-intro reveal reveal-left"><p className="eyebrow">Nuestro propósito</p><p className="section-index">Historias, experiencias y valor</p></div>
            <div className="purpose-compact">
              <div className="purpose-compact-head reveal reveal-left">
                <h3>Historias, experiencias y soluciones creativas que aporten valor.</h3>
              </div>
              <div className="purpose-compact-body reveal reveal-right">
                <p>Existimos para transformar ideas y aportar valor a personas, marcas y comunidades.</p>
                <p>Un proyecto publicitario puede ayudar a comunicar mejor. Una experiencia tecnológica puede resolver una necesidad. Una película puede generar reflexión, emoción o memoria.</p>
              </div>
            </div>
          </div>
          <div className="marquee" aria-label="Formas de valor"><div>{[...valueTypes, ...valueTypes].map((value, i) => <span key={`${value}-${i}`}>{value}<i>✦</i></span>)}</div></div>

          <div className="page-shell">
            <div className="vision">
              <p className="eyebrow reveal reveal-left">Visión</p>
              <blockquote className="reveal reveal-left">Construir un estudio creativo referente en Latinoamérica por su capacidad de integrar narrativa, producción audiovisual, tecnología e innovación.</blockquote>
              <p className="reveal reveal-right">Desarrollamos proyectos con altos estándares creativos y técnicos mediante equipos preparados y procesos sólidos. N5 debe producir proyectos extraordinarios sin depender permanentemente de una sola persona.</p>
            </div>
            <div className="section-intro reveal reveal-left"><p className="eyebrow">Filosofía N5</p><p className="section-index">La creatividad necesita estructura</p></div>
            <div className="philosophy-head">
              <h2 id="philosophy-title" className="display reveal reveal-left">La estructura no limita.<br /><em>Libera el talento.</em></h2>
              <p className="reveal reveal-right">Las mejores ideas alcanzan su potencial cuando hay procesos claros, personas preparadas y criterios compartidos. Construimos equipos capaces de aportar su talento dentro de un sistema.</p>
            </div>
            <ol className="system-list">{creativeSystem.map((item, index) => <li className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
            <div className="principles-grid">
              {principles.map((principle, index) => (
                <article className={`principle-card reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} key={principle.title}>
                  <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{principle.title}</h3>
                  {principle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {principle.bullets && <ul>{principle.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                  {principle.path && <ol className="learning-path">{principle.path.map((step) => <li key={step}>{step}</li>)}</ol>}
                </article>
              ))}
            </div>
            <div className="operating-principle">
              <div className="reveal reveal-left">
                <p className="eyebrow">Principio operativo central</p>
                <h3>El director no debe realizar una tarea únicamente porque puede hacerla mejor.</h3>
                <p>Debe intervenir donde su criterio aporte un valor que el sistema todavía no pueda replicar. Transferir tareas ejecutivas permite que Dirección se concentre en:</p>
              </div>
              <div className="focus-list reveal reveal-right">{directionFocus.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          </div>
          </section>

          <section className="ecosystem section-dark" aria-labelledby="ecosystem-title">
            <ScrollScene label="Inteligencia compartida" />
            <div className="ecosystem-orbit one" aria-hidden="true" /><div className="ecosystem-orbit two" aria-hidden="true" />
            <div className="page-shell ecosystem-inner">
              <p className="eyebrow eyebrow-accent reveal reveal-left">El ecosistema creativo</p>
              <h2 id="ecosystem-title" className="display reveal reveal-left">Diferentes capacidades.<br /><em>Una inteligencia compartida.</em></h2>
              <div className="ecosystem-map">
                <article className="reveal reveal-left"><span>RRSS</span><h3>Capacidad audiovisual</h3><p>Genera experiencia comercial, flujo de proyectos y capacidad de producción.</p></article>
                <article className="reveal"><span>Labs</span><h3>Innovación tecnológica</h3><p>Desarrolla herramientas, productos y nuevas posibilidades de interacción.</p></article>
                <article className="reveal reveal-right"><span>Cine</span><h3>Voz narrativa</h3><p>Construye dirección, propiedad intelectual y una sensibilidad cinematográfica propia.</p></article>
              </div>
              <p className="ecosystem-note reveal reveal-right">El conocimiento de una división fortalece a las demás. La IA atraviesa las tres; el cine eleva la publicidad; la tecnología abre nuevas formas de narrativa y producción.</p>
            </div>
          </section>
        </>}

        {active === 'studio' && <section id="academia" className="academy philosophy section-dark route-page" aria-labelledby="academy-title">
          <ScrollScene label="Formación y crecimiento" />
          <div className="page-shell">
            <div className="section-intro reveal reveal-left"><p className="eyebrow">Academia N5</p><p className="section-index">Formación continua</p></div>
            <div className="philosophy-head">
              <h2 id="academy-title" className="display reveal reveal-left">Conocimiento que se transforma<br /><em>en capacidad.</em></h2>
              <p className="reveal reveal-right">N5 funciona también como una escuela práctica. Compartimos conocimiento técnico, creativo y profesional para desarrollar nuevas capacidades.</p>
            </div>
            <div className="operating-principle">
              <div className="reveal reveal-left">
                <p className="eyebrow">Aprender haciendo</p>
                <h3>El objetivo no es crear dependencia hacia quien enseña. Es multiplicar conocimiento.</h3>
              </div>
              <div className="focus-list reveal reveal-right">
                {['Observar', 'Ejecutar acompañado', 'Ejecutar con supervisión', 'Trabajar con autonomía', 'Enseñar a otra persona'].map((step) => <span key={step}>{step}</span>)}
              </div>
            </div>
          </div>
        </section>}

        {active === 'studio' && <section id="manifiesto" className="manifesto section-dark route-page" aria-labelledby="manifesto-title">
          <ScrollScene label="Lo que permanece" />
          <div className="page-shell manifesto-inner">
            <p className="eyebrow eyebrow-accent reveal reveal-left">Manifiesto N5</p>
            <h2 id="manifesto-title" className="manifesto-lead reveal reveal-left">No buscamos ser la empresa que más proyectos produce.</h2>
            <p className="manifesto-answer reveal reveal-right">Buscamos construir una organización capaz de producir <em>grandes proyectos</em> de manera consistente.</p>
            <div className="manifesto-lines">{manifesto.map((line, index) => <p className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} key={line}><span>0{index + 1}</span>{line}</p>)}</div>
            <div className="manifesto-close">
              <p className="reveal reveal-right">Queremos que el conocimiento se transforme en capacidad, la capacidad en oportunidades y las oportunidades en proyectos que valga la pena recordar.</p>
              <h3 className="reveal reveal-left">Transformamos ideas en experiencias que trascienden.</h3>
            </div>
          </div>
          <footer className="footer page-shell"><a href="/" onClick={(e) => { e.preventDefault(); navigate('home') }} className="footer-brand" aria-label="N5 Studio, volver al inicio"><BrandLogo full /></a><p>Estudio creativo<br />Latinoamérica</p><button onClick={() => navigate('home')}>Volver al inicio ↑</button><p className="copyright">© {new Date().getFullYear()} N5 Studio</p></footer>
        </section>}
      </main>
    </div>
  )
}
