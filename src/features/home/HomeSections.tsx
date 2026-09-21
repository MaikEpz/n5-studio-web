import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PageId } from '@application/navigation/navigation'
import { ScrollScene } from '@shared/ui/ScrollScene'
import { SiteFooter } from '@shared/ui/SiteFooter'

gsap.registerPlugin(ScrollTrigger)

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
  { name: 'GAD Parroquial de Baños', logo: '/images/clientes/gad-banos.png', darken: true },
]

export function ClientStrip() {
  return (
    <div className="hero-clients" aria-label="Nuestros clientes">
      <div className="hero-clients-viewport">
        <div className="hero-clients-track">
          {[0, 1].map((copy) => (
            <ul className="hero-clients-list" key={copy} aria-hidden={copy === 1 || undefined}>
              {clients.map(({ name, logo }) => (
                <li key={`${copy}-${name}`} className="hero-client-logo">
                  {logo ? <img src={logo} alt={copy === 0 ? name : ''} /> : <span>{name}</span>}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FeaturedWork({ onNavigate }: HomeSectionProps) {
  return (
    <section id="featured-work" className="featured-work section-dark" aria-labelledby="featured-work-title">
      <ScrollScene />
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

export function Clients({ footer = false, theme = 'light' }: { footer?: boolean; theme?: 'light' | 'dark' }) {
  return (
    <section id="clientes" className={`clients section-${theme}${footer ? ' has-footer' : ''}`} aria-labelledby="clients-title">
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
      {footer && <SiteFooter />}
    </section>
  )
}

export function ContactCta({ onNavigate }: HomeSectionProps) {
  const root = useRef<HTMLElement>(null)

  // Entrada con scroll: termina cuando la sección llena la pantalla (su punto de reposo, ver CLAUDE.md).
  useLayoutEffect(() => {
    const section = root.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const isMobile = window.matchMedia('(max-width: 900px)').matches
    const side = isMobile ? 90 : 190
    const rotY = isMobile ? 0 : 10
    const context = gsap.context(() => {
      const rings = gsap.utils.toArray<SVGCircleElement>('.cta-ring circle')
      rings.forEach((ring) => {
        const length = ring.getTotalLength()
        gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length })
      })
      gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: section, start: 'top 85%', end: 'clamp(top top)', scrub: 0.6 },
      })
        // Entrada lateral, como el resto del sitio: izquierda y derecha alternadas, con desenfoque.
        .fromTo('.contact-cta .eyebrow', { x: -side, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.35 }, 0)
        .fromTo('.cta-line:nth-child(1)', { x: -side, z: 90, rotateY: rotY, opacity: 0, filter: 'blur(10px)' }, { x: 0, z: 0, rotateY: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55 }, 0.05)
        .fromTo('.cta-line:nth-child(2)', { x: side, z: 90, rotateY: -rotY, opacity: 0, filter: 'blur(10px)' }, { x: 0, z: 0, rotateY: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55 }, 0.15)
        .fromTo('.cta-support .cta-button', { x: -side, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.4 }, 0.45)
        .to(rings, { strokeDashoffset: 0, duration: 0.8, stagger: 0.1, ease: 'power1.inOut' }, 0)
        .fromTo('.cta-ring', { rotate: -70, scale: 0.9 }, { rotate: 0, scale: 1, duration: 1, ease: 'none' }, 0)
        .fromTo('.site-footer', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7)
    }, section)
    return () => context.revert()
  }, [])

  return (
    <section id="cta-contacto" ref={root} className="contact-cta section-dark" aria-labelledby="contact-cta-title">
      <svg className="cta-ring" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="196" />
        <circle cx="200" cy="200" r="150" />
        <circle className="cta-ring-accent" cx="200" cy="200" r="104" />
      </svg>
      <div className="page-shell contact-cta-inner">
        <p className="eyebrow eyebrow-accent">Contacto</p>
        <h2 id="contact-cta-title" className="display contact-cta-title">
          <span className="cta-line"><span>¿Tienes una idea?</span></span>
          <span className="cta-line"><em>Hagámosla trascender.</em></span>
        </h2>
        <div className="cta-support">
          <a href="/contacto" className="cta-button" onClick={(e) => { e.preventDefault(); onNavigate('contacto') }}>Iniciar proyecto</a>
        </div>
      </div>
      <SiteFooter />
    </section>
  )
}
