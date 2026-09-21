import { useLayoutEffect, useState } from 'react'
import type { PageId } from '@application/navigation/navigation'
import type { DivisionId } from '@domain/studio/models'
import { ScrollScene } from '@shared/ui/ScrollScene'
import { SiteFooter } from '@shared/ui/SiteFooter'
import { ContactCta } from '@features/home/HomeSections'
import { ColumnsSection, ListSection } from '@features/division-pages/DivisionSections'
import { projects, workFilters, type Project } from './projects'

type WorkPageProps = { onNavigate: (id: PageId) => void; onViewChange?: () => void }

const divisionName: Record<DivisionId, string> = { rrss: 'N5 RRSS', cine: 'N5 Cine', labs: 'N5 Labs' }

// Work según la arquitectura de Miro: Todos los proyectos (con filtros por división) y la plantilla de Case Study
// (Hero + ficha, El reto, La idea, La ejecución, Video / frames / BTS y Créditos).
export function WorkPage({ onNavigate, onViewChange }: WorkPageProps) {
  const [filter, setFilter] = useState<DivisionId | 'all'>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  // Al abrir o cerrar un Case Study cambia el contenido: se avisa para recalcular las animaciones de scroll.
  useLayoutEffect(() => {
    onViewChange?.()
  }, [selected, onViewChange])

  const open = (project: Project | null) => {
    setSelected(project)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (selected) return <CaseStudy key={selected.slug} project={selected} onBack={() => open(null)} onNavigate={onNavigate} />

  const visible = filter === 'all' ? projects : projects.filter((project) => project.division === filter)

  return (
    <section id="work" className="work-index section-dark route-page has-footer" aria-labelledby="work-title">
      <ScrollScene />
      <div className="page-shell">
        <div className="section-intro reveal reveal-left"><p className="eyebrow">Work</p><p className="section-index">Todos los proyectos</p></div>
        <div className="work-head">
          <h1 id="work-title" className="display reveal reveal-left">Todo nuestro<br /><em>trabajo.</em></h1>
          <nav className="work-filters reveal reveal-right" aria-label="Filtrar proyectos">
            {workFilters.map(({ id, label }) => (
              <button key={id} type="button" className={filter === id ? 'is-active' : undefined} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </nav>
        </div>
        <ul className="work-list">
          {visible.map((project) => (
            <li key={project.slug}>
              <button type="button" onClick={() => open(project)}>
                <span className="work-list-title">{project.title}</span>
                <span>{project.category}</span>
                <span>{divisionName[project.division]}</span>
                <span>{project.year}</span>
                <span className="work-list-cta" aria-hidden="true">Ver caso →</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <SiteFooter />
    </section>
  )
}

type CaseStudyProps = { project: Project; onBack: () => void; onNavigate: (id: PageId) => void }

function CaseStudy({ project, onBack, onNavigate }: CaseStudyProps) {
  const frameLabels = ['Video', 'Frame', 'Detrás de cámaras']
  return (
    <>
      <section id="caso" className="case-hero section-dark route-page" aria-labelledby="caso-title">
        <ScrollScene />
        <div className="page-shell">
          <div className="section-intro reveal reveal-left">
            <p className="eyebrow">Case study</p>
            <button type="button" className="section-index case-back" onClick={onBack}>← Todos los proyectos</button>
          </div>
          <div className="case-hero-grid">
            <div>
              <h1 id="caso-title" className="display reveal reveal-left">{project.title}</h1>
              <dl className="case-sheet reveal reveal-left">
                <div><dt>Cliente</dt><dd>{project.client}</dd></div>
                <div><dt>División</dt><dd>{divisionName[project.division]}</dd></div>
                <div><dt>Categoría</dt><dd>{project.category}</dd></div>
                <div><dt>Año</dt><dd>{project.year}</dd></div>
              </dl>
            </div>
            <figure className="case-hero-media reveal reveal-right"><img src={project.image} alt="" /></figure>
          </div>
        </div>
      </section>

      <ColumnsSection
        id="caso-historia"
        eyebrow="El proyecto"
        index="Reto, idea y ejecución"
        title={<>De la pregunta<br /><em>a la pieza.</em></>}
        items={[
          { title: 'El reto', body: project.challenge },
          { title: 'La idea', body: project.idea },
          { title: 'La ejecución', body: project.execution },
        ]}
      />

      <section id="caso-frames" className="featured-work section-dark" aria-labelledby="caso-frames-title">
        <div className="page-shell">
          <div className="section-intro reveal reveal-left"><p className="eyebrow">Video / frames / BTS</p><p className="section-index">El proyecto en imágenes</p></div>
          <div className="featured-head">
            <h2 id="caso-frames-title" className="display reveal reveal-left">Cuadro<br /><em>a cuadro.</em></h2>
          </div>
          <div className="featured-grid">
            {project.frames.map((frame, index) => (
              <figure key={`${frame}-${index}`} className={`featured-card reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                <div className="featured-card-image"><img src={frame} alt="" loading="lazy" /></div>
                <figcaption className="featured-card-meta"><span>{frameLabels[index] ?? 'Frame'}</span><span>{project.title}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <ListSection
        id="caso-creditos"
        theme="light"
        eyebrow="Créditos"
        index="Quienes lo hicieron posible"
        title={<>Créditos</>}
        items={project.credits}
      />

      <ContactCta onNavigate={onNavigate} />
    </>
  )
}
