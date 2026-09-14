import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigation } from '@features/navigation/Navigation'
import { DivisionPanel } from '@features/divisions/DivisionPanel'
import { CinematicOverlay } from '../../components/CinematicOverlay'
import { ScrollScene } from '@shared/ui/ScrollScene'
import { BrandLogo } from '@shared/ui/BrandLogo'
import { usePageNavigation } from '@infrastructure/navigation/usePageNavigation'
import { useStudioContent } from '@features/studio/useStudioContent'
import { HeroVideoSequence } from '@features/studio/HeroVideoSequence'
import { LoadingScreen } from '@shared/ui/LoadingScreen'
import { dependencies } from '@app/dependencies'

gsap.registerPlugin(ScrollTrigger)

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
            yPercent: 0,
            rotateY: 15,
            scale: 0.85,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.40,
            ease: 'power2.in',
          }, 0.04)
          .to('.hero-title .line:nth-child(3)', {
            xPercent: 120,
            yPercent: 10,
            rotateY: -15,
            scale: 0.85,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.42,
            ease: 'power2.in',
          }, 0.06)
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

      middleSections.forEach((section) => {
        const leftElements = section.querySelectorAll<HTMLElement>('.reveal-left')
        const rightElements = section.querySelectorAll<HTMLElement>('.reveal-right')
        const otherElements = Array.from(section.querySelectorAll<HTMLElement>('.reveal')).filter(
          (el) => !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right'),
        )
        const sceneBadge = section.querySelector<HTMLElement>('.scroll-scene')
        const isMobile = window.matchMedia('(max-width: 900px)').matches
        const xOffset = isMobile ? 90 : 190
        const yOffset = isMobile ? 25 : 40
        const rotY = isMobile ? 0 : 10

        const isFirstAfterHero = section.id === 'n5'
        const sectionTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: isFirstAfterHero ? 'top 96%' : 'top 72%',
            end: 'bottom 28%',
            scrub: 0.5,
          },
        })

        // Phase 1: Entrance from sides when scrolling down into section (or exit when scrolling up into hero)
        if (leftElements.length > 0) {
          sectionTimeline.fromTo(leftElements,
            { x: -xOffset, y: yOffset, z: 90, rotateY: rotY, opacity: 0, filter: 'blur(10px)' },
            { x: 0, y: 0, z: 0, rotateY: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.out', duration: 0.38, stagger: 0.04 },
            0,
          )
        }
        if (rightElements.length > 0) {
          sectionTimeline.fromTo(rightElements,
            { x: xOffset, y: yOffset, z: 90, rotateY: -rotY, opacity: 0, filter: 'blur(10px)' },
            { x: 0, y: 0, z: 0, rotateY: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.out', duration: 0.38 },
            0,
          )
        }
        if (otherElements.length > 0) {
          sectionTimeline.fromTo(otherElements,
            { y: yOffset * 1.5, opacity: 0, filter: 'blur(10px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.out', duration: 0.38 },
            0,
          )
        }
        if (sceneBadge) {
          sectionTimeline.fromTo(sceneBadge,
            { opacity: 0, scale: 1.12 },
            { opacity: 0.5, scale: 1, ease: 'power1.out', duration: 0.3 },
            0,
          )
        }

        // Phase 2: Hold (0.38 -> 0.62) - centered and fully readable

        // Phase 3: Exit to sides when continuing down (or entrance from sides when scrolling up from below)
        if (leftElements.length > 0) {
          sectionTimeline.to(leftElements,
            { x: -xOffset, y: -yOffset, z: 90, rotateY: rotY, opacity: 0, filter: 'blur(10px)', ease: 'power1.in', duration: 0.38, stagger: 0.03 },
            0.62,
          )
        }
        if (rightElements.length > 0) {
          sectionTimeline.to(rightElements,
            { x: xOffset, y: -yOffset, z: 90, rotateY: -rotY, opacity: 0, filter: 'blur(10px)', ease: 'power1.in', duration: 0.38 },
            0.62,
          )
        }
        if (otherElements.length > 0) {
          sectionTimeline.to(otherElements,
            { y: -yOffset * 1.5, opacity: 0, filter: 'blur(10px)', ease: 'power1.in', duration: 0.38 },
            0.62,
          )
        }
        if (sceneBadge) {
          sectionTimeline.to(sceneBadge,
            { opacity: 0, scale: 0.92, ease: 'power1.in', duration: 0.28 },
            0.66,
          )
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
              end: 'top 68%',
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
      if (root.current?.querySelector('#n5')) gsap.fromTo('.cinematic-reticle', { scale: 1.8, opacity: 0 }, { scale: .72, opacity: .28, ease: 'none', scrollTrigger: { trigger: '#n5', start: 'top bottom', end: 'bottom top', scrub: .25 } })
      if (root.current?.querySelector('#labs')) gsap.fromTo('.cinematic-beam', { xPercent: -130, opacity: 0 }, { xPercent: 145, opacity: .3, ease: 'none', scrollTrigger: { trigger: '#labs', start: 'top bottom', end: 'bottom top', scrub: .2 } })
      if (root.current?.querySelector('#cine')) gsap.fromTo('.cinematic-film-rail', { xPercent: 110, rotate: -8, opacity: 0 }, { xPercent: -120, rotate: 6, opacity: .34, ease: 'none', scrollTrigger: { trigger: '#cine', start: 'top bottom', endTrigger: '.ecosystem', end: 'top center', scrub: .2 } })
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

  return (
    <div ref={root}>
      <Navigation active={active} scrolled={scrolled} onNavigate={navigate} />
      <CinematicOverlay />
      <main id="contenido">
        {active === 'n5' && <>
          <section id="inicio" className="hero section-dark" aria-labelledby="hero-title">
            <ScrollScene code="00 / 08" label="Origen de una idea" />
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
                  <span className="line"><span>Transformamos ideas</span></span>
                  <span className="line italic"><span>en experiencias</span></span>
                  <span className="line right"><span>que trascienden.</span></span>
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
            <ScrollScene code="01 / 08" label="Identidad del estudio" />
            <div className="page-shell">
              <div className="section-intro reveal reveal-left"><p className="eyebrow">01 — Qué es N5</p><p className="section-index">Identidad</p></div>
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
            <ScrollScene code="06 / 08" label="Tres especialidades" />
            <div className="division-list"><DivisionPanel divisions={divisions} /></div>
          </section>

        </>}

        {active === 'filosofia' && <>
          <section id="filosofia" className="philosophy section-dark route-page" aria-labelledby="philosophy-title">
          <ScrollScene code="02 / 08" label="Propósito y visión" />
          <div className="page-shell">
            <div className="section-intro reveal reveal-left"><p className="eyebrow">02 — Nuestro propósito</p><p className="section-index">Historias, experiencias y valor</p></div>
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
              <p className="eyebrow reveal reveal-left">03 — Visión</p>
              <blockquote className="reveal reveal-left">Construir un estudio creativo referente en Latinoamérica por su capacidad de integrar narrativa, producción audiovisual, tecnología e innovación.</blockquote>
              <p className="reveal reveal-right">Desarrollamos proyectos con altos estándares creativos y técnicos mediante equipos preparados y procesos sólidos. N5 debe producir proyectos extraordinarios sin depender permanentemente de una sola persona.</p>
            </div>
            <div className="section-intro reveal reveal-left"><p className="eyebrow">04 — Filosofía N5</p><p className="section-index">La creatividad necesita estructura</p></div>
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
                <p className="eyebrow">05 — Principio operativo central</p>
                <h3>El director no debe realizar una tarea únicamente porque puede hacerla mejor.</h3>
                <p>Debe intervenir donde su criterio aporte un valor que el sistema todavía no pueda replicar. Transferir tareas ejecutivas permite que Dirección se concentre en:</p>
              </div>
              <div className="focus-list reveal reveal-right">{directionFocus.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          </div>
          </section>

          <section className="ecosystem section-dark" aria-labelledby="ecosystem-title">
            <ScrollScene code="07 / 08" label="Inteligencia compartida" />
            <div className="ecosystem-orbit one" aria-hidden="true" /><div className="ecosystem-orbit two" aria-hidden="true" />
            <div className="page-shell ecosystem-inner">
              <p className="eyebrow reveal reveal-left">07 — El ecosistema creativo</p>
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

        {active === 'academia' && <section id="academia" className="academy philosophy section-dark route-page" aria-labelledby="academy-title">
          <ScrollScene code="01 / 01" label="Formación y crecimiento" />
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

        {active === 'manifiesto' && <section id="manifiesto" className="manifesto section-brand route-page" aria-labelledby="manifesto-title">
          <ScrollScene code="08 / 08" label="Lo que permanece" />
          <div className="page-shell manifesto-inner">
            <p className="eyebrow reveal reveal-left">08 — Manifiesto N5</p>
            <h2 id="manifesto-title" className="manifesto-lead reveal reveal-left">No buscamos ser la empresa que más proyectos produce.</h2>
            <p className="manifesto-answer reveal reveal-right">Buscamos construir una organización capaz de producir <em>grandes proyectos</em> de manera consistente.</p>
            <div className="manifesto-lines">{manifesto.map((line, index) => <p className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} key={line}><span>0{index + 1}</span>{line}</p>)}</div>
            <div className="manifesto-close">
              <p className="reveal reveal-right">Queremos que el conocimiento se transforme en capacidad, la capacidad en oportunidades y las oportunidades en proyectos que valga la pena recordar.</p>
              <h3 className="reveal reveal-left">Transformamos ideas en experiencias que trascienden.</h3>
            </div>
          </div>
          <footer className="footer page-shell"><a href="/" onClick={(e) => { e.preventDefault(); navigate('n5') }} className="footer-brand" aria-label="N5 Studio, volver al inicio"><BrandLogo full /></a><p>Estudio creativo<br />Latinoamérica</p><button onClick={() => navigate('n5')}>Volver al inicio ↑</button><p className="copyright">© {new Date().getFullYear()} N5 Studio</p></footer>
        </section>}
      </main>
    </div>
  )
}
