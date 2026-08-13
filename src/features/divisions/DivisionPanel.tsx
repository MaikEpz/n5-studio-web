import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { Division } from '@domain/studio/models'

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
      <p className="division-overline">N5 / {division.label}</p>
      <h3><span>{division.number}</span>{division.name}</h3>
      <div className="division-intro">{division.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {division.capabilities && <div className="tag-list" aria-label="Capacidades">{division.capabilities.map((item) => <span key={item}>{item}</span>)}</div>}
      {division.outcomes && <div className="tag-list outcomes-tags" aria-label="Desarrollo progresivo">{division.outcomes.map((item) => <span key={item}>{item}</span>)}</div>}
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
