import type { PageId } from '@application/navigation/navigation'
import type { Division } from '@domain/studio/models'
import { ContactCta } from '@features/home/HomeSections'
import { ColumnsSection, DivisionSequenceIntro, WorkShowcase } from '@features/division-pages/DivisionSections'

type CinePageProps = { division: Division; onNavigate: (id: PageId) => void }

const getCineFrameUrl = (index: number) => `/video/cine/frame_${String(index + 35).padStart(3, '0')}.webp`

// Estructura según la arquitectura de Miro: Filosofía, Documentales, Cortometrajes, Largometrajes,
// Cine para redes, En desarrollo y CTA.
// Contenido provisional: textos y proyectos deben reemplazarse por los reales de N5 Cine.
const formats = [
  { title: 'Documentales', body: 'Personas, lugares y procesos reales contados con mirada cinematográfica.' },
  { title: 'Cortometrajes', body: 'Nuestro laboratorio narrativo para explorar lenguajes y construir una voz propia.' },
  { title: 'Largometrajes', body: 'Obras con propiedad intelectual propia, desde el guion hasta la distribución.' },
  { title: 'Cine para redes', body: 'La narrativa y la estética del cine en piezas breves y verticales para redes.' },
]

const inDevelopment = [
  { title: 'Proyecto en desarrollo 1', category: 'Largometraje', meta: 'Guion', image: '/images/cine.webp' },
  { title: 'Proyecto en desarrollo 2', category: 'Documental', meta: 'Preproducción', image: '/images/objects/camera.webp' },
  { title: 'Proyecto en desarrollo 3', category: 'Cortometraje', meta: 'Rodaje', image: '/images/objects/clapper.webp' },
]

export function CinePage({ division, onNavigate }: CinePageProps) {
  return (
    <>
      <DivisionSequenceIntro
        id="cine-filosofia"
        eyebrow={division.name}
        index="Filosofía"
        title={<>Historias que<br /><em>permanecen.</em></>}
        paragraphs={division.intro}
        frameCount={193}
        frameUrl={getCineFrameUrl}
        ariaLabel="Secuencia cinematográfica de una cámara fotográfica que se desmonta y se transforma"
        chapters={[
          { eyebrow: 'Documentales', title: <>La fuerza de<br /><em>lo real.</em></>, body: formats[0].body },
          { eyebrow: 'Cortometrajes', title: <>Historias con<br /><em>voz propia.</em></>, body: formats[1].body },
        ]}
      />
      <ColumnsSection
        id="cine-formatos"
        eyebrow="Formatos"
        index="Del documental a las redes"
        title={<>Cuatro maneras<br /><em>de contar.</em></>}
        items={formats}
      />
      <WorkShowcase
        id="cine-en-desarrollo"
        eyebrow="En desarrollo"
        index="Lo que estamos creando"
        title={<>Próximas<br /><em>historias.</em></>}
        items={inDevelopment}
        onNavigate={onNavigate}
      />
      <ContactCta onNavigate={onNavigate} />
    </>
  )
}
