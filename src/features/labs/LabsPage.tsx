import type { PageId } from '@application/navigation/navigation'
import type { Division } from '@domain/studio/models'
import { ContactCta } from '@features/home/HomeSections'
import { ColumnsSection, DivisionSequenceIntro, WorkShowcase } from '@features/division-pages/DivisionSections'

type LabsPageProps = { division: Division; onNavigate: (id: PageId) => void }

const getLabsFrameUrl = (index: number) => `/video/labs/${String(index + 1).padStart(3, '0')}.webp`

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
      <DivisionSequenceIntro
        id="labs-que-hacemos"
        eyebrow={division.name}
        index="Qué hacemos"
        title={<>Nuevas formas<br /><em>de interactuar.</em></>}
        paragraphs={division.intro}
        frameCount={300}
        frameUrl={getLabsFrameUrl}
        ariaLabel="Secuencia de una manzana que se transforma en una red tecnológica interactiva"
        zoomFrames={60}
        chapters={[
          { eyebrow: areas[0].title, title: <>Entrar en<br /><em>otras realidades.</em></>, body: areas[0].body },
          { eyebrow: areas[1].title, title: <>Dar forma a<br /><em>lo posible.</em></>, body: areas[1].body },
          { eyebrow: areas[2].title, title: <>Ideas hechas<br /><em>software.</em></>, body: areas[2].body },
          { eyebrow: areas[3].title, title: <>La tecnología<br /><em>responde.</em></>, body: areas[3].body },
        ]}
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
