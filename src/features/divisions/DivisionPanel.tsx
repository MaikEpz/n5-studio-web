import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Division } from '@domain/studio/models'

gsap.registerPlugin(ScrollTrigger)

export function DivisionPanel({ divisions }: { divisions: readonly Division[] }) {
  const [activeIndex, setActiveIndex] = useState(() => {
    const requested = window.location.hash.slice(1)
    const index = divisions.findIndex((division) => division.id === requested)
    return index < 0 ? 0 : index
  })
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)
  const root = useRef<HTMLElement>(null)
  const active = divisions[activeIndex]
  const previous = previousIndex === null ? null : divisions[previousIndex]

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      const selector = root.current?.querySelector<HTMLElement>('.division-selector')
      const copyStack = root.current?.querySelector<HTMLElement>('.division-copy-stack')
      const stage = root.current?.querySelector<HTMLElement>('.division-stage')
      const selectedButton = root.current?.querySelector<HTMLButtonElement>('.division-selector button.active')
      const selectedMark = selectedButton?.querySelector<HTMLSpanElement>('span')
      if (!selector || !copyStack || !stage || !selectedButton || !selectedMark) return

      gsap.fromTo(selector,
        { xPercent: -18, clipPath: 'inset(0 18% 0 0)' },
        {
          xPercent: 0,
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: selector, start: 'top 100%', end: 'top 42%', scrub: 0.75 },
        })

      gsap.fromTo(copyStack,
        { yPercent: 16, clipPath: 'inset(24% 0 0 0)' },
        {
          yPercent: 0,
          clipPath: 'inset(0% 0 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: copyStack, start: 'top 98%', end: 'top 28%', scrub: 0.8 },
        })

      const imageTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top 98%',
          end: 'top 16%',
          scrub: 0.9,
        },
      })

      imageTimeline
        .fromTo(stage,
          { xPercent: 18, clipPath: 'inset(0 0 0 100%)' },
          { xPercent: 0, clipPath: 'inset(0 0 0 0%)', duration: 0.7, ease: 'none' }, 0)
        .fromTo('.division-image-new',
          { xPercent: 14, yPercent: -5, scale: 1.3 },
          { xPercent: 0, yPercent: 0, scale: 1, duration: 1, ease: 'none' }, 0)
        .fromTo('.stage-grid',
          { xPercent: 18, opacity: 0 },
          { xPercent: 0, opacity: 0.08, duration: 0.4, ease: 'none' }, 0.48)
        .fromTo('.stage-label, .image-index',
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.28, ease: 'none' }, 0.7)

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: selector,
          start: 'top 98%',
          end: 'top 18%',
          scrub: 0.75,
        },
      })

      timeline
        .fromTo('.division-selector > p',
          { x: -48, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.38, ease: 'none' }, 0)
        .fromTo(selectedButton,
          { x: -58, clipPath: 'inset(0 100% 0 0)' },
          { x: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.72, ease: 'none' }, 0.16)
        .fromTo(selectedMark,
          { scale: 0, rotate: -120 },
          { scale: 1, rotate: 0, duration: 0.24, ease: 'none' }, 0.57)
        .fromTo('.division-selector-title span',
          { x: -88, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.46, ease: 'none' }, 0.34)
        .fromTo('.division-selector-title em',
          { x: 88, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'none' }, 0.4)

      const copyTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: copyStack,
          start: 'top 96%',
          end: 'top 10%',
          scrub: 0.85,
        },
      })

      copyTimeline
        .fromTo('.division-copy-new .division-overline',
          { x: -92, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.38, ease: 'none' }, 0.04)
        .fromTo('.division-copy-new .division-number',
          { x: -72, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.36, ease: 'none' }, 0.14)
        .fromTo('.division-copy-new .division-name',
          { x: 145, opacity: 0, filter: 'blur(9px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.58, ease: 'none' }, 0.18)
        .fromTo('.division-copy-new .division-intro p:nth-child(odd)',
          { x: -125, opacity: 0, filter: 'blur(7px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.48, ease: 'none' }, 0.38)
        .fromTo('.division-copy-new .division-intro p:nth-child(even)',
          { x: 125, opacity: 0, filter: 'blur(7px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.48, ease: 'none' }, 0.48)
        .fromTo('.division-copy-new .tag-list span:nth-child(odd)',
          { x: -58, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.055, duration: 0.32, ease: 'none' }, 0.62)
        .fromTo('.division-copy-new .tag-list span:nth-child(even)',
          { x: 58, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.055, duration: 0.32, ease: 'none' }, 0.68)
        .fromTo('.division-copy-new .division-details',
          { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
          { scaleX: 1, opacity: 1, duration: 0.42, ease: 'none' }, 0.84)
    }, root)

    return () => context.revert()
  }, [])

  useLayoutEffect(() => {
    if (previousIndex === null || !root.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) { setPreviousIndex(null); setAnimating(false); return }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => { setPreviousIndex(null); setAnimating(false) },
      })
      timeline
        .fromTo('.division-image-old', { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, clipPath: 'inset(0%)' }, { xPercent: -105, yPercent: 4, rotate: -5, scale: .88, clipPath: 'inset(4%)', duration: .85 }, 0)
        .fromTo('.division-image-new', { xPercent: 115, yPercent: -4, rotate: 4, scale: .9, clipPath: 'inset(6%)' }, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, clipPath: 'inset(0%)', duration: .9 }, .05)
        .fromTo('.division-copy-old', { xPercent: 0, opacity: 1 }, { xPercent: 75, opacity: 0, duration: .48 }, 0)
        .fromTo('.division-copy-new', { xPercent: 42, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .62 }, .32)
        .fromTo('.division-copy-new .tag-list span', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .035, duration: .35 }, .55)
    }, root)
    return () => context.revert()
  }, [previousIndex])

  const selectDivision = (index: number) => {
    if (index === activeIndex || animating) return
    setAnimating(true)
    setPreviousIndex(activeIndex)
    setActiveIndex(index)
    history.replaceState(null, '', `#${divisions[index].id}`)
  }

  const renderCopy = (division: Division, state: 'old' | 'new') => (
    <div className={`division-copy division-copy-${state}`} aria-hidden={state === 'old' ? 'true' : undefined}>
      <div className="division-copy-main">
        <p className="division-overline">N5 / {division.label}</p>
        <h3><span className="division-number">{division.number}</span><strong className="division-name">{division.name}</strong></h3>
        <div className="division-intro">{division.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        {division.capabilities && <div className="tag-list" aria-label="Capacidades">{division.capabilities.map((item) => <span key={item}>{item}</span>)}</div>}
        {division.outcomes && <div className="tag-list outcomes-tags" aria-label="Desarrollo progresivo">{division.outcomes.map((item) => <span key={item}>{item}</span>)}</div>}
      </div>
      <details className="division-details">
        <summary><span>Explorar la división</span><i aria-hidden="true" /></summary>
        <div className="division-detail-body">
          <div><small>Misión</small><p>{division.mission}</p></div>
          <div><small>Objetivo</small><p>{division.objective}</p></div>
          <div><small>Indicadores importantes</small><ul>{division.indicators.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </details>
    </div>
  )

  return (
    <article className="division-panel" id="division-selector" ref={root} aria-live="polite">
      {divisions.map((division) => <span className="division-anchor" id={division.id} key={division.id} aria-hidden="true" />)}
      <div className="division-layout">
        <aside className="division-selector" aria-label="Divisiones de N5">
          <p>Divisiones</p>
          <nav>
            {divisions.map((division, index) => (
              <button key={division.id} type="button" onClick={() => selectDivision(index)} className={index === activeIndex ? 'active' : undefined} aria-pressed={index === activeIndex} disabled={animating}>
                <span aria-hidden="true">✦</span>{division.name}
              </button>
            ))}
          </nav>
          <h2 id="divisions-title" className="division-selector-title"><span>Tres maneras de</span><em>hacer que una<br />idea viva.</em></h2>
          <small>{active.number} / 03</small>
        </aside>

        <div className="division-copy-stack">
          {previous && renderCopy(previous, 'old')}
          {renderCopy(active, 'new')}
        </div>

        <div className="division-stage">
          <div className="division-image-stack">
            {previous && <img className="division-image division-image-old" src={previous.image} alt="" width="1680" height="944" />}
            <img className="division-image division-image-new" src={active.image} alt={active.alt} width="1680" height="944" decoding="async" />
          </div>
          <div className="stage-grid" aria-hidden="true" />
          <p className="stage-label">N5 Studio — {active.label}</p>
          <span className="image-index">{active.number} / 03</span>
        </div>
      </div>
    </article>
  )
}
