import type { PageId } from '@application/navigation/navigation'
import type { Division } from '@domain/studio/models'
import { ContactCta } from '@features/home/HomeSections'
import { ColumnsSection, DivisionIntro, WorkShowcase } from '@features/division-pages/DivisionSections'

type LabsPageProps = { division: Division; onNavigate: (id: PageId) => void }

// Estructura según la arquitectura de Miro: Qué hacemos, VR / MR, 3D, Apps, Interactive, Selected Work y CTA.
// Contenido provisional: textos y proyectos deben reemplazarse por los reales de N5 Labs.
const areas = [
  { title: 'VR / MR', body: 'Experiencias de realidad virtual y mixta que llevan a las personas a espacios que todavía no existen.' },
  { title: '3D', body: 'Modelado, visualización y animación de objetos y escenarios con precisión y carácter.' },
  { title: 'Apps', body: 'Aplicaciones web y móviles y software a medida, con inteligencia artificial cuando aporta valor.' },
  { title: 'Interactive', body: 'Instalaciones y experiencias donde la tecnología responde a las personas.' },
]

const selectedWork = [
  { title: 'Recorrido inmersivo', category: 'VR / MR', meta: 'N5 Labs', image: '/images/labs.webp' },
  { title: 'Pieza 3D interactiva', category: '3D', meta: 'N5 Labs', image: '/images/objects/prism.webp' },
  { title: 'Instalación interactiva', category: 'Interactive', meta: 'N5 Labs', image: '/images/objects/lenses.webp' },
]

export function LabsPage({ division, onNavigate }: LabsPageProps) {
  return (
    <>
      <DivisionIntro
        id="labs-que-hacemos"
        eyebrow={division.name}
        index="Qué hacemos"
        title={<>Nuevas formas<br /><em>de interactuar.</em></>}
        paragraphs={division.intro}
      />
      <ColumnsSection
        id="labs-areas"
        eyebrow="Qué desarrollamos"
        index="Cuatro áreas"
        title={<>Tecnología al servicio<br /><em>de la experiencia.</em></>}
        items={areas}
      />
      <WorkShowcase
        id="labs-selected-work"
        eyebrow="Selected Work"
        index={`Proyectos de ${division.name}`}
        title={<>Trabajo<br /><em>seleccionado.</em></>}
        items={selectedWork}
        onNavigate={onNavigate}
      />
      <ContactCta onNavigate={onNavigate} />
    </>
  )
}
