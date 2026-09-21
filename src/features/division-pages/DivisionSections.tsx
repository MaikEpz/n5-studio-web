import type { CSSProperties, ReactNode } from 'react'
import type { PageId } from '@application/navigation/navigation'
import { ScrollScene } from '@shared/ui/ScrollScene'

// Bloques de las páginas de división con el mismo estilo que N5 RRSS y Work:
// editorial y tipográfico, fondos alternos, rejillas de líneas finas e imágenes solo en tarjetas de proyecto.
// Reutilizan las clases de RRSS (rrss-intro, rrss-process, process-steps, featured-work).

type Theme = 'dark' | 'light'

export type DivisionIntroProps = {
  id: string
  theme?: Theme
  eyebrow: string
  index: string
  title: ReactNode
  paragraphs: readonly string[]
}

export function DivisionIntro({ id, theme = 'dark', eyebrow, index, title, paragraphs }: DivisionIntroProps) {
  return (
    <section id={id} className={`rrss-intro section-${theme} route-page`} aria-labelledby={`${id}-title`}>
      <ScrollScene />
      <div className="page-shell">
        <div className="section-intro reveal reveal-left"><p className="eyebrow">{eyebrow}</p><p className="section-index">{index}</p></div>
        <div className="rrss-intro-grid">
          <h2 id={`${id}-title`} className="display reveal reveal-left">{title}</h2>
          <div className="lead-copy reveal reveal-right">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </div>
    </section>
  )
}

export type ColumnItem = { title: string; body: string }

export type ColumnsSectionProps = {
  id: string
  theme?: Theme
  eyebrow: string
  index: string
  title: ReactNode
  items: readonly ColumnItem[]
}

// Una sección con los bloques del Miro en columnas, como el Proceso de RRSS.
export function ColumnsSection({ id, theme = 'light', eyebrow, index, title, items }: ColumnsSectionProps) {
  return (
    <section id={id} className={`rrss-process section-${theme}`} aria-labelledby={`${id}-title`}>
      <div className="page-shell">
        <div className="section-intro reveal reveal-left"><p className="eyebrow">{eyebrow}</p><p className="section-index">{index}</p></div>
        <h2 id={`${id}-title`} className="rrss-section-title reveal reveal-left">{title}</h2>
        <ol className="process-steps" style={{ '--cols': items.length } as CSSProperties}>
          {items.map((item, itemIndex) => (
            <li key={item.title} className={`reveal ${itemIndex % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export type ListSectionProps = {
  id: string
  theme?: Theme
  eyebrow: string
  index: string
  title: ReactNode
  items: readonly string[]
}

// Una sección con una lista en rejilla de líneas finas, como Servicios de RRSS.
export function ListSection({ id, theme = 'dark', eyebrow, index, title, items }: ListSectionProps) {
  return (
    <section id={id} className={`rrss-services section-${theme}`} aria-labelledby={`${id}-title`}>
      <div className="page-shell">
        <div className="section-intro reveal reveal-left"><p className="eyebrow">{eyebrow}</p><p className="section-index">{index}</p></div>
        <h2 id={`${id}-title`} className="rrss-section-title reveal reveal-left">{title}</h2>
        <ul className="services-list reveal reveal-right">{items.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </section>
  )
}

export type WorkItem = { title: string; category: string; meta: string; image: string }

export type WorkShowcaseProps = {
  id: string
  eyebrow: string
  index: string
  title: ReactNode
  items: readonly WorkItem[]
  onNavigate: (id: PageId) => void
  linkLabel?: string
}

// Selected Work / En desarrollo: tarjetas con el mismo diseño que Featured Work del Home y Selected Work de RRSS.
export function WorkShowcase({ id, eyebrow, index, title, items, onNavigate, linkLabel = 'Ver todos los proyectos →' }: WorkShowcaseProps) {
  return (
    <section id={id} className="featured-work section-dark" aria-labelledby={`${id}-title`}>
      <div className="page-shell">
        <div className="section-intro reveal reveal-left"><p className="eyebrow">{eyebrow}</p><p className="section-index">{index}</p></div>
        <div className="featured-head">
          <h2 id={`${id}-title`} className="display reveal reveal-left">{title}</h2>
          <a href="/work" className="text-link reveal reveal-right" onClick={(e) => { e.preventDefault(); onNavigate('work') }}>{linkLabel}</a>
        </div>
        <div className="featured-grid">
          {items.map((item, itemIndex) => (
            <a key={item.title} href="/work" className={`featured-card reveal ${itemIndex % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} onClick={(e) => { e.preventDefault(); onNavigate('work') }}>
              <div className="featured-card-image"><img src={item.image} alt="" loading="lazy" /></div>
              <div className="featured-card-meta"><span>{item.category}</span><span>{item.meta}</span></div>
              <h3>{item.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
