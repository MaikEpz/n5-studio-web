import type { DivisionId } from '@domain/studio/models'

// Proyectos de Work. CONTENIDO PROVISIONAL: títulos, clientes, textos, imágenes y créditos
// deben reemplazarse por los proyectos reales de N5.
export type Project = {
  slug: string
  title: string
  division: DivisionId
  category: string
  year: string
  client: string
  image: string
  frames: readonly string[]
  challenge: string
  idea: string
  execution: string
  credits: readonly string[]
}

export const workFilters: readonly { id: DivisionId | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'rrss', label: 'Commercial / RRSS' },
  { id: 'cine', label: 'Film / Cine' },
  { id: 'labs', label: 'Experiences / Labs' },
]

const pending = 'Cliente por confirmar'

export const projects: readonly Project[] = [
  {
    slug: 'campana-de-marca', title: 'Campaña de marca', division: 'rrss', category: 'Publicidad', year: '2026', client: pending,
    image: '/images/rrss.webp', frames: ['/images/rrss.webp', '/images/hero.webp', '/images/objects/camera.webp'],
    challenge: 'Una marca con buen producto y poca presencia necesitaba que su público la reconociera y la recordara.',
    idea: 'Contar la marca desde las personas que la usan, con una estética cinematográfica y un mensaje simple.',
    execution: 'Una pieza principal y sus adaptaciones para redes, producidas en dos jornadas de rodaje.',
    credits: ['Dirección — N5 Studio', 'Producción — N5 RRSS', 'Fotografía — N5 RRSS', 'Postproducción — N5 RRSS'],
  },
  {
    slug: 'serie-de-contenido', title: 'Serie de contenido', division: 'rrss', category: 'Redes sociales', year: '2026', client: pending,
    image: '/images/hero.webp', frames: ['/images/hero.webp', '/images/rrss.webp', '/images/objects/lenses.webp'],
    challenge: 'Mantener una comunicación constante en redes sin perder calidad ni identidad.',
    idea: 'Una serie con formato fijo y personajes reconocibles, pensada para publicarse semana a semana.',
    execution: 'Guiones por temporada, rodaje por bloques y un sistema de edición que agiliza cada entrega.',
    credits: ['Estrategia — N5 RRSS', 'Producción — N5 RRSS', 'Edición — N5 RRSS'],
  },
  {
    slug: 'video-institucional', title: 'Video institucional', division: 'rrss', category: 'Audiovisual', year: '2025', client: pending,
    image: '/images/objects/camera.webp', frames: ['/images/objects/camera.webp', '/images/rrss.webp', '/images/hero.webp'],
    challenge: 'Explicar qué hace una organización y por qué importa, en pocos minutos y sin perder a la audiencia.',
    idea: 'Una historia narrada por sus protagonistas, con el trabajo diario como escenario.',
    execution: 'Entrevistas, registro en locaciones reales y una edición con ritmo documental.',
    credits: ['Dirección — N5 Studio', 'Producción — N5 RRSS', 'Postproducción — N5 RRSS'],
  },
  {
    slug: 'cortometraje', title: 'Cortometraje', division: 'cine', category: 'Ficción', year: '2025', client: 'Producción propia',
    image: '/images/cine.webp', frames: ['/images/cine.webp', '/images/objects/clapper.webp', '/images/objects/projector.webp'],
    challenge: 'Contar una historia completa en pocos minutos y con recursos limitados.',
    idea: 'Una situación sencilla llevada al límite, con una puesta en escena que dice más que los diálogos.',
    execution: 'Rodaje en una noche, iluminación práctica y una mezcla de sonido cuidada al detalle.',
    credits: ['Dirección — N5 Cine', 'Guion — N5 Cine', 'Fotografía — N5 Cine', 'Montaje — N5 Cine'],
  },
  {
    slug: 'documental', title: 'Documental', division: 'cine', category: 'Documental', year: '2024', client: 'Producción propia',
    image: '/images/objects/projector.webp', frames: ['/images/objects/projector.webp', '/images/cine.webp', '/images/objects/camera.webp'],
    challenge: 'Retratar una realidad cercana sin caer en lo evidente.',
    idea: 'Observar antes que explicar: dejar que las personas y los lugares cuenten la historia.',
    execution: 'Semanas de registro, entrevistas largas y un montaje construido desde el material.',
    credits: ['Dirección — N5 Cine', 'Investigación — N5 Cine', 'Montaje — N5 Cine'],
  },
  {
    slug: 'cine-para-redes', title: 'Pieza para redes', division: 'cine', category: 'Cine para redes', year: '2026', client: pending,
    image: '/images/objects/clapper.webp', frames: ['/images/objects/clapper.webp', '/images/cine.webp', '/images/hero.webp'],
    challenge: 'Llevar el lenguaje del cine a un formato vertical y breve.',
    idea: 'Una micro historia con principio, conflicto y final en menos de un minuto.',
    execution: 'Encuadres pensados para el móvil, rodaje ágil y una edición al ritmo de la plataforma.',
    credits: ['Dirección — N5 Cine', 'Producción — N5 Cine', 'Edición — N5 Cine'],
  },
  {
    slug: 'recorrido-inmersivo', title: 'Recorrido inmersivo', division: 'labs', category: 'VR / MR', year: '2026', client: pending,
    image: '/images/labs.webp', frames: ['/images/labs.webp', '/images/objects/prism.webp', '/images/objects/lenses.webp'],
    challenge: 'Mostrar un espacio que todavía no existe de forma que las personas pudieran recorrerlo.',
    idea: 'Una experiencia de realidad virtual guiada, con momentos de descubrimiento a lo largo del recorrido.',
    execution: 'Modelado del espacio, optimización para visores y pruebas con usuarios reales.',
    credits: ['Dirección — N5 Labs', 'Desarrollo — N5 Labs', 'Modelado 3D — N5 Labs'],
  },
  {
    slug: 'pieza-3d-interactiva', title: 'Pieza 3D interactiva', division: 'labs', category: '3D', year: '2025', client: pending,
    image: '/images/objects/prism.webp', frames: ['/images/objects/prism.webp', '/images/labs.webp', '/images/objects/lenses.webp'],
    challenge: 'Presentar un producto con un nivel de detalle imposible de lograr solo con fotografía.',
    idea: 'Un modelo 3D que el usuario puede girar, explorar y descubrir por partes.',
    execution: 'Modelado, texturizado y una experiencia web ligera que funciona en cualquier dispositivo.',
    credits: ['Modelado 3D — N5 Labs', 'Desarrollo web — N5 Labs'],
  },
  {
    slug: 'instalacion-interactiva', title: 'Instalación interactiva', division: 'labs', category: 'Interactive', year: '2025', client: pending,
    image: '/images/objects/lenses.webp', frames: ['/images/objects/lenses.webp', '/images/labs.webp', '/images/objects/prism.webp'],
    challenge: 'Convertir la visita a un espacio en una experiencia que el público quisiera compartir.',
    idea: 'Una instalación que responde al movimiento de las personas con luz, sonido e imagen.',
    execution: 'Sensores, programación en tiempo real y montaje en sitio.',
    credits: ['Dirección — N5 Labs', 'Programación — N5 Labs', 'Producción — N5 Labs'],
  },
]
