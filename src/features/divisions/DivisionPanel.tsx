import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PageId } from '@application/navigation/navigation'
import type { Division } from '@domain/studio/models'
import { N5ModelCanvas } from './N5ModelCanvas'
import { DIVISION_SCROLL_LENGTH, DIVISION_TEXT_PHASE, DIVISION_TRANSITIONS } from './divisionPhases'

gsap.registerPlugin(ScrollTrigger)

export type DivisionPanelProps = {
  divisions: readonly Division[]
  onNavigate?: (id: PageId) => void
}

export function DivisionPanel({ divisions, onNavigate }: DivisionPanelProps) {
  const root = useRef<HTMLElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)

  useLayoutEffect(() => {
    if (!root.current || !pinWrapperRef.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const context = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: DIVISION_SCROLL_LENGTH,
        pin: pinWrapperRef.current,
        pinSpacing: true,
        scrub: reduceMotion ? false : 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress
          setScrollProgress(p)
          // Activa la división cuyo cambio ya pasó la mitad.
          setActiveIdx(DIVISION_TRANSITIONS.filter(({ start, end }) => p >= (start + end) / 2).length)
        },
      })

      // Update hash or state on change if needed
      return () => {
        pinTrigger.kill()
      }
    }, root)

    return () => context.revert()
  }, [])

  // Orden de la escena según la arquitectura de Miro: RRSS → Cine → Labs.
  const ordered = (['rrss', 'cine', 'labs'] as const)
    .map((id) => divisions.find((division) => division.id === id))
    .filter((division): division is Division => Boolean(division))
  const shortName = (division: Division) => division.name.replace('N5 ', '')

  // Calculate opacity and transform for each division block based on scrollProgress
  // Uses the same lateral entrance/exit pattern (translateX, rotateY, z) as the rest of the site
  const getDivisionStyle = (index: number) => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900
    const xDist = reduceMotion ? 0 : (isMobile ? 60 : 120)
    const rotDeg = reduceMotion ? 0 : (isMobile ? 0 : 8)
    const zDist = reduceMotion ? 0 : (isMobile ? 0 : 90)

    // Side of the card: -1 for left (RRSS, Labs), 1 for right (Cine)
    const side = index === 1 ? 1 : -1

    // Smooth Hermite easing curve for natural entrance and exit
    const ease = (t: number) => t * t * (3 - 2 * t)

    // Entrada: final del cambio anterior. Salida: inicio del cambio siguiente. Entre ambas, reposo.
    const enter = index > 0 ? DIVISION_TRANSITIONS[index - 1] : null
    const exit = index < DIVISION_TRANSITIONS.length ? DIVISION_TRANSITIONS[index] : null
    let hidden = 0 // 0: en su sitio, 1: oculta a su lado
    if (enter && scrollProgress < enter.end) {
      hidden = scrollProgress <= enter.end - DIVISION_TEXT_PHASE ? 1 : 1 - ease((scrollProgress - (enter.end - DIVISION_TEXT_PHASE)) / DIVISION_TEXT_PHASE)
    } else if (exit && scrollProgress > exit.start) {
      hidden = scrollProgress >= exit.start + DIVISION_TEXT_PHASE ? 1 : ease((scrollProgress - exit.start) / DIVISION_TEXT_PHASE)
    }
    const opacity = 1 - hidden
    const factor = hidden
    const blur = 8 * hidden
    const pointerEvents: 'auto' | 'none' = hidden < 0.5 ? 'auto' : 'none'

    const x = side * xDist * factor
    const rotY = -side * rotDeg * factor
    const z = zDist * factor

    return {
      opacity,
      transform: `translate3d(${x.toFixed(2)}px, 0px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg)`,
      filter: blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none',
      pointerEvents,
      transition: 'opacity 0.2s ease-out, filter 0.2s ease-out',
    }
  }

  return (
    <article className="division-panel division-panel-3d" id="division-selector" ref={root} aria-live="polite">
      {divisions.map((division) => (
        <span className="division-anchor" id={division.id} key={division.id} aria-hidden="true" />
      ))}

      <div className="division-pin-container" ref={pinWrapperRef}>
        {/* Top Section Header aligned to page-shell */}
        <div className="division-header-shell page-shell">
          <div className="section-intro">
            <p className="eyebrow eyebrow-accent">Divisiones</p>
            <p className="section-index">Tres especialidades</p>
          </div>
        </div>

        {/* 3D WebGL Canvas Layer */}
        <div className="division-3d-stage">
          <N5ModelCanvas progress={scrollProgress} />
        </div>

        {/* Bilateral Content Overlay aligned to page-shell */}
        <div className="division-slots-shell page-shell">
          <div className="division-slots-grid">
            {/* Left Content Area (Division 0 and Division 2) */}
            <div className="division-slot division-slot-left">
              {ordered[0] && (
                <div
                  className="division-content-card division-card-0 reveal-left"
                  style={getDivisionStyle(0)}
                  aria-hidden={activeIdx !== 0}
                >
                  <p className="eyebrow division-card-eyebrow">N5 / {ordered[0].label}</p>
                  <h3 className="display division-card-title">
                    N5 <em>{shortName(ordered[0])}</em>
                  </h3>
                  <div className="lead-copy division-intro">
                    {ordered[0].intro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="division-action-row">
                    {onNavigate && (
                      <a
                        href={`/${ordered[0].id}`}
                        className="text-link"
                        onClick={(e) => {
                          e.preventDefault()
                          onNavigate(ordered[0].id as PageId)
                        }}
                      >
                        Explorar {ordered[0].name} →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {ordered[2] && (
                <div
                  className="division-content-card division-card-2 reveal-left"
                  style={getDivisionStyle(2)}
                  aria-hidden={activeIdx !== 2}
                >
                  <p className="eyebrow division-card-eyebrow">N5 / {ordered[2].label}</p>
                  <h3 className="display division-card-title">
                    N5 <em>{shortName(ordered[2])}</em>
                  </h3>
                  <div className="lead-copy division-intro">
                    {ordered[2].intro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="division-action-row">
                    {onNavigate && (
                      <a
                        href={`/${ordered[2].id}`}
                        className="text-link"
                        onClick={(e) => {
                          e.preventDefault()
                          onNavigate(ordered[2].id as PageId)
                        }}
                      >
                        Explorar {ordered[2].name} →
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Content Area (Division 1) */}
            <div className="division-slot division-slot-right">
              {ordered[1] && (
                <div
                  className="division-content-card division-card-1 reveal-right"
                  style={getDivisionStyle(1)}
                  aria-hidden={activeIdx !== 1}
                >
                  <p className="eyebrow division-card-eyebrow">N5 / {ordered[1].label}</p>
                  <h3 className="display division-card-title">
                    N5 <em>{shortName(ordered[1])}</em>
                  </h3>
                  <div className="lead-copy division-intro">
                    {ordered[1].intro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="division-action-row">
                    {onNavigate && (
                      <a
                        href={`/${ordered[1].id}`}
                        className="text-link"
                        onClick={(e) => {
                          e.preventDefault()
                          onNavigate(ordered[1].id as PageId)
                        }}
                      >
                        Explorar {ordered[1].name} →
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
