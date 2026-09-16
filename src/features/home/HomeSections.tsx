import type { PageId } from '@application/navigation/navigation'
import { ScrollScene } from '@shared/ui/ScrollScene'

type HomeSectionProps = { onNavigate: (id: PageId) => void }

// Contenido provisional: reemplazar con proyectos y clientes reales.
const featuredProjects = [
  { division: 'N5 RRSS', title: 'Campaña comercial', year: '2026', image: '/images/rrss.webp' },
  { division: 'N5 Cine', title: 'Cortometraje', year: '2026', image: '/images/cine.webp' },
  { division: 'N5 Labs', title: 'Experiencia interactiva', year: '2026', image: '/images/labs.webp' },
]

const clients: readonly { name: string; logo?: string; darken?: boolean }[] = [
  { name: 'Corporación Empresarial Eljuri', logo: '/images/clientes/eljuri.svg' },
  { name: 'Casa de la Cultura Núcleo del Azuay', logo: '/images/clientes/casa-de-la-cultura-cuenca.svg' },
  { name: 'Universidad de Cuenca', logo: '/images/clientes/universidad-de-cuenca.svg' },
  // darken: pasa a negro con CSS los logos blancos o a color, para que todos sean uniformes.
  { name: 'ETAPA EP', logo: '/images/clientes/etapa.png', darken: true },
  { name: 'Imagine Creative Studio', logo: '/images/clientes/imagine.png', darken: true },
  { name: 'Museo Alberto Mena Caamaño', logo: '/images/clientes/museo-mena-caamano.svg', darken: true },
  { name: 'Colineal', logo: '/images/clientes/colineal.svg' },
  { name: 'Cliente 8' },
]

export function FeaturedWork({ onNavigate }: HomeSectionProps) {
  return (
    <section id="featured-work" className="featured-work section-dark" aria-labelledby="featured-work-title">
      <ScrollScene label="Trabajo seleccionado" />
      <div className="page-shell">
        <div className="section-intro reveal reveal-left"><p className="eyebrow">Featured Work</p><p className="section-index">Proyectos destacados</p></div>
        <div className="featured-head">
          <h2 id="featured-work-title" className="display reveal reveal-left">Ideas que<br /><em>ya existen.</em></h2>
          <a href="/work" className="text-link reveal reveal-right" onClick={(e) => { e.preventDefault(); onNavigate('work') }}>Ver todos los proyectos →</a>
        </div>
        <div className="featured-grid">
          {featuredProjects.map((project, index) => (
            <a key={project.title} href="/work" className={`featured-card reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} onClick={(e) => { e.preventDefault(); onNavigate('work') }}>
              <div className="featured-card-image"><img src={project.image} alt="" loading="lazy" /></div>
              <div className="featured-card-meta"><span>{project.division}</span><span>{project.year}</span></div>
              <h3>{project.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Clients() {
  return (
    <section id="clientes" className="clients section-light" aria-labelledby="clients-title">
      <div className="page-shell">
        <div className="section-intro reveal reveal-left"><p className="eyebrow">Clientes</p><p className="section-index">Quienes confían en N5</p></div>
        <h2 id="clients-title" className="clients-title reveal reveal-left">Marcas, personas y comunidades<br /><em>con las que construimos.</em></h2>
        <ul className="clients-grid reveal reveal-right">
          {clients.map(({ name, logo, darken }) => (
            <li key={name} className={logo ? 'has-logo' : undefined}>
              {logo ? <img src={logo} alt={name} loading="lazy" className={darken ? 'logo-darken' : undefined} /> : name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ContactCta({ onNavigate }: HomeSectionProps) {
  return (
    <section id="cta-contacto" className="contact-cta section-dark" aria-labelledby="contact-cta-title">
      <div className="page-shell contact-cta-inner">
        <p className="eyebrow eyebrow-accent reveal reveal-left">Contacto</p>
        <h2 id="contact-cta-title" className="display reveal reveal-left">¿Tienes una idea?<br /><em>Hagámosla trascender.</em></h2>
        <a href="/contacto" className="cta-button reveal reveal-right" onClick={(e) => { e.preventDefault(); onNavigate('contacto') }}>Iniciar proyecto</a>
      </div>
    </section>
  )
}
