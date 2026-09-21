import type { PageId } from '@application/navigation/navigation'
import type { Division } from '@domain/studio/models'
import { ScrollScene } from '@shared/ui/ScrollScene'
import { ContactCta } from '@features/home/HomeSections'

type RrssPageProps = { division: Division; onNavigate: (id: PageId) => void }

const processSteps = [
  { title: 'Entender', body: 'Escuchamos a la marca, su audiencia y sus objetivos para definir qué necesita comunicar y por qué.' },
  { title: 'Crear', body: 'Convertimos la estrategia en ideas, guiones y propuestas visuales con identidad propia.' },
  { title: 'Producir', body: 'Rodamos y construimos cada pieza con procesos claros y estándares técnicos consistentes.' },
  { title: 'Finalizar', body: 'Editamos, revisamos y entregamos piezas listas para publicar y medir resultados.' },
]

// Contenido provisional: ajustar servicios y proyectos reales de N5 RRSS.
const services = ['Estrategia de contenido', 'Producción audiovisual', 'Campañas publicitarias', 'Contenido para redes sociales', 'Fotografía', 'Postproducción']

const selectedWork = [
  { title: 'Campaña de marca', category: 'Publicidad', image: '/images/rrss.webp' },
  { title: 'Serie de contenido', category: 'Redes sociales', image: '/images/hero.webp' },
  { title: 'Video institucional', category: 'Audiovisual', image: '/images/objects/camera.webp' },
]

export function RrssPage({ division, onNavigate }: RrssPageProps) {
  return (
    <>
      <section id="rrss-que-hacemos" className="rrss-intro section-dark route-page" aria-labelledby="rrss-title">
        <ScrollScene />
        <div className="page-shell">
          <div className="section-intro reveal reveal-left"><p className="eyebrow">{division.name}</p><p className="section-index">Qué hacemos</p></div>
          <div className="rrss-intro-grid">
            <h2 id="rrss-title" className="display reveal reveal-left">Comunicar con<br /><em>claridad.</em></h2>
            <div className="lead-copy reveal reveal-right">{division.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
        </div>
      </section>

      <section id="rrss-proceso" className="rrss-process section-light" aria-labelledby="rrss-process-title">
        <div className="page-shell">
          <div className="section-intro reveal reveal-left"><p className="eyebrow">Proceso</p><p className="section-index">Cómo trabajamos</p></div>
          <h2 id="rrss-process-title" className="rrss-section-title reveal reveal-left">De la idea a la pieza final,<br /><em>en cuatro pasos.</em></h2>
          <ol className="process-steps">
            {processSteps.map((step, index) => (
              <li key={step.title} className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="rrss-servicios" className="rrss-services section-dark" aria-labelledby="rrss-services-title">
        <div className="page-shell">
          <div className="section-intro reveal reveal-left"><p className="eyebrow">Servicios</p><p className="section-index">Lo que ofrecemos</p></div>
          <h2 id="rrss-services-title" className="rrss-section-title reveal reveal-left">Servicios</h2>
          <ul className="services-list reveal reveal-right">{services.map((service) => <li key={service}>{service}</li>)}</ul>
        </div>
      </section>

      <section id="rrss-selected-work" className="featured-work section-dark" aria-labelledby="rrss-work-title">
        <div className="page-shell">
          <div className="section-intro reveal reveal-left"><p className="eyebrow">Selected Work</p><p className="section-index">Proyectos de {division.name}</p></div>
          <div className="featured-head">
            <h2 id="rrss-work-title" className="display reveal reveal-left">Trabajo<br /><em>seleccionado.</em></h2>
            <a href="/work" className="text-link reveal reveal-right" onClick={(e) => { e.preventDefault(); onNavigate('work') }}>Ver todos los proyectos →</a>
          </div>
          <div className="featured-grid">
            {selectedWork.map((project, index) => (
              <a key={project.title} href="/work" className={`featured-card reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} onClick={(e) => { e.preventDefault(); onNavigate('work') }}>
                <div className="featured-card-image"><img src={project.image} alt="" loading="lazy" /></div>
                <div className="featured-card-meta"><span>{project.category}</span><span>{division.name}</span></div>
                <h3>{project.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ContactCta onNavigate={onNavigate} />
    </>
  )
}
