import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PageId } from '@application/navigation/navigation'
import type { Division } from '@domain/studio/models'
import { N5ModelCanvas } from './N5ModelCanvas'

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
        end: '+=280%',
        pin: pinWrapperRef.current,
        pinSpacing: true,
        scrub: reduceMotion ? false : 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress
          setScrollProgress(p)
          let idx = 0
          if (p >= 0.72) {
            idx = 2
          } else if (p >= 0.38) {
            idx = 1
          } else {
            idx = 0
          }
          setActiveIdx(idx)
        },
      })

      // Update hash or state on change if needed
      return () => {
        pinTrigger.kill()
      }
    }, root)

    return () => context.revert()
  }, [])

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

    let opacity = 0
    let factor = 0 // 0: resting in place, 1: fully hidden on its side
    let blur = 0
    let pointerEvents: 'auto' | 'none' = 'none'

    // Division 0 (RRSS, Left): 0.0 to 0.42
    if (index === 0) {
      if (scrollProgress <= 0.3) {
        opacity = 1
        factor = 0
        blur = 0
        pointerEvents = 'auto'
      } else if (scrollProgress <= 0.42) {
        // Exiting toward the left
        const f = ease((scrollProgress - 0.3) / 0.12)
        opacity = 1 - f
        factor = f
        blur = 8 * f
        pointerEvents = f < 0.5 ? 'auto' : 'none'
      } else {
        opacity = 0
        factor = 1
        pointerEvents = 'none'
      }
    }
    // Division 1 (Cine, Right): 0.32 to 0.76
    else if (index === 1) {
      if (scrollProgress < 0.32) {
        opacity = 0
        factor = 1
        blur = 8
        pointerEvents = 'none'
      } else if (scrollProgress <= 0.44) {
        // Entering from the right
        const f = ease((scrollProgress - 0.32) / 0.12)
        opacity = f
        factor = 1 - f
        blur = 8 * (1 - f)
        pointerEvents = f > 0.5 ? 'auto' : 'none'
      } else if (scrollProgress <= 0.64) {
        // In resting position
        opacity = 1
        factor = 0
        blur = 0
        pointerEvents = 'auto'
      } else if (scrollProgress <= 0.76) {
        // Exiting toward the right
        const f = ease((scrollProgress - 0.64) / 0.12)
        opacity = 1 - f
        factor = f
        blur = 8 * f
        pointerEvents = f < 0.5 ? 'auto' : 'none'
      } else {
        opacity = 0
        factor = 1
        pointerEvents = 'none'
      }
    }
    // Division 2 (Labs, Left): 0.66 to 1.0
    else if (index === 2) {
      if (scrollProgress < 0.66) {
        opacity = 0
        factor = 1
        blur = 8
        pointerEvents = 'none'
      } else if (scrollProgress <= 0.78) {
        // Entering from the left
        const f = ease((scrollProgress - 0.66) / 0.12)
        opacity = f
        factor = 1 - f
        blur = 8 * (1 - f)
        pointerEvents = f > 0.5 ? 'auto' : 'none'
      } else {
        // In resting position
        opacity = 1
        factor = 0
        blur = 0
        pointerEvents = 'auto'
      }
    }

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
              {divisions[0] && (
                <div
                  className="division-content-card division-card-0 reveal-left"
                  style={getDivisionStyle(0)}
                  aria-hidden={activeIdx !== 0}
                >
                  <p className="eyebrow division-card-eyebrow">N5 / {divisions[0].label}</p>
                  <h3 className="display division-card-title">
                    N5 <em>RRSS</em>
                  </h3>
                  <div className="lead-copy division-intro">
                    {divisions[0].intro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="division-action-row">
                    {onNavigate && (
                      <a
                        href={`/${divisions[0].id}`}
                        className="text-link"
                        onClick={(e) => {
                          e.preventDefault()
                          onNavigate(divisions[0].id as PageId)
                        }}
                      >
                        Explorar {divisions[0].name} →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {divisions[2] && (
                <div
                  className="division-content-card division-card-2 reveal-left"
                  style={getDivisionStyle(2)}
                  aria-hidden={activeIdx !== 2}
                >
                  <p className="eyebrow division-card-eyebrow">N5 / {divisions[2].label}</p>
                  <h3 className="display division-card-title">
                    N5 <em>Labs</em>
                  </h3>
                  <div className="lead-copy division-intro">
                    {divisions[2].intro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="division-action-row">
                    {onNavigate && (
                      <a
                        href={`/${divisions[2].id}`}
                        className="text-link"
                        onClick={(e) => {
                          e.preventDefault()
                          onNavigate(divisions[2].id as PageId)
                        }}
                      >
                        Explorar {divisions[2].name} →
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Content Area (Division 1) */}
            <div className="division-slot division-slot-right">
              {divisions[1] && (
                <div
                  className="division-content-card division-card-1 reveal-right"
                  style={getDivisionStyle(1)}
                  aria-hidden={activeIdx !== 1}
                >
                  <p className="eyebrow division-card-eyebrow">N5 / {divisions[1].label}</p>
                  <h3 className="display division-card-title">
                    N5 <em>Cine</em>
                  </h3>
                  <div className="lead-copy division-intro">
                    {divisions[1].intro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="division-action-row">
                    {onNavigate && (
                      <a
                        href={`/${divisions[1].id}`}
                        className="text-link"
                        onClick={(e) => {
                          e.preventDefault()
                          onNavigate(divisions[1].id as PageId)
                        }}
                      >
                        Explorar {divisions[1].name} →
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
