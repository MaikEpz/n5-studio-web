import type { Division, Principle } from '@domain/studio/models'

export type { Division, Principle } from '@domain/studio/models'

export const valueTypes = [
  'Comercial', 'Educativo', 'Técnico', 'Cultural',
  'Artístico', 'Emocional', 'Social', 'Entretenimiento',
]

export const creativeSystem = [
  'Procesos claros', 'Personas preparadas', 'Responsabilidades definidas',
  'Comunicación efectiva', 'Criterios de calidad', 'Formación continua',
]

export const principles: Principle[] = [
  {
    title: 'Reputación',
    body: ['La reputación es uno de los activos más importantes de N5. Cada proyecto representa lo que somos.'],
    bullets: ['Calidad', 'Cumplimiento', 'Comunicación clara', 'Transparencia', 'Responsabilidad sobre las entregas', 'Respeto hacia clientes y colaboradores'],
  },
  {
    title: 'Calidad',
    body: ['No buscamos únicamente que algo esté terminado. Debe cumplir un estándar creativo y técnico coherente con N5 y con el nivel del proyecto contratado.', 'La calidad debe ser consistente y progresivamente menos dependiente de una sola persona.'],
  },
  {
    title: 'Procesos que generan libertad',
    body: ['Los procesos no existen para burocratizar. Reducen errores, evitan improvisaciones innecesarias y dejan espacio para las decisiones donde realmente aportamos valor.', 'Documentamos aquello que se repite. Cada proceso documentado fortalece la empresa.'],
  },
  {
    title: 'Formación constante',
    body: ['N5 funciona también como una escuela práctica. Compartimos conocimiento técnico, creativo y profesional para desarrollar nuevas capacidades.', 'El objetivo no es crear dependencia hacia quien enseña. Es multiplicar conocimiento.'],
    path: ['Observar', 'Ejecutar acompañado', 'Ejecutar con supervisión', 'Trabajar con autonomía', 'Enseñar a otra persona'],
  },
  {
    title: 'Aprendizaje con propósito',
    body: ['Aprender dentro de N5 implica responsabilidad. El estudio brinda conocimiento, herramientas, experiencias reales y acompañamiento.', 'Cuando una persona desarrolla capacidad para producir resultados, puede asumir responsabilidades profesionales y oportunidades de trabajo remunerado. El conocimiento entregado debe valorarse y utilizarse responsablemente.'],
  },
  {
    title: 'Respeto por N5',
    body: ['Buscamos respeto por lo que N5 representa, no solamente por su nombre: por lo aprendido, las experiencias compartidas, las oportunidades recibidas, el crecimiento profesional y la calidad de lo construido juntos.', 'Una persona puede desarrollar proyectos propios o continuar fuera de N5. Queremos una cultura donde ese crecimiento no destruya la confianza construida.'],
  },
  {
    title: 'Innovación',
    body: ['La tecnología, la inteligencia artificial, las nuevas herramientas audiovisuales y las nuevas formas narrativas son parte natural de nuestra evolución.', 'No innovamos por utilizar tecnología nueva. Innovamos cuando una herramienta nos permite contar, producir o resolver algo mejor.'],
  },
  {
    title: 'Autonomía con criterio',
    body: ['No buscamos personas que únicamente obedezcan instrucciones. Buscamos colaboradores que aprendan nuestros estándares y crezcan con criterio.'],
    bullets: ['Identificar problemas', 'Proponer soluciones', 'Tomar decisiones dentro de su responsabilidad', 'Mejorar procesos', 'Enseñar a otros'],
  },
]

export const divisions: Division[] = [
  {
    id: 'rrss', number: '01', name: 'N5 RRSS', label: 'Comunicación', image: '/images/rrss.webp',
    alt: 'Composición editorial de vidrio, papel y cobre iluminada como un set audiovisual',
    intro: ['La división enfocada en comunicación, publicidad y producción audiovisual para marcas, empresas y organizaciones.', 'No se limita a producir contenido: convierte objetivos comerciales y comunicacionales en piezas estratégicas y visualmente sólidas.'],
    mission: 'Ayudar a empresas y marcas a crecer mediante estrategias y producciones audiovisuales que comuniquen con claridad, generen confianza y produzcan resultados.',
    objective: 'Convertirse en un aliado creativo para organizaciones que buscan diferenciarse mediante contenido audiovisual de alta calidad acompañado por procesos profesionales.',
    indicators: ['Clientes recurrentes', 'Entregas puntuales', 'Rentabilidad', 'Calidad consistente', 'Satisfacción del cliente', 'Recomendaciones', 'Capacidad del equipo', 'Reducción del trabajo operativo dependiente de Dirección'],
  },
  {
    id: 'labs', number: '02', name: 'N5 Labs', label: 'Innovación', image: '/images/labs.webp',
    alt: 'Instalación tecnológica de prismas, retículas de luz y un portal de cobre',
    intro: ['La división de innovación y desarrollo tecnológico. Investiga, prototipa y construye nuevas formas de interacción.'],
    capabilities: ['Realidad virtual', 'Experiencias inmersivas', 'Aplicaciones web y móviles', 'Software', 'Inteligencia artificial', 'Tecnologías interactivas', 'Investigación y prototipado'],
    mission: 'Investigar, desarrollar e implementar experiencias tecnológicas que combinen creatividad, software, inteligencia artificial y narrativa para crear nuevas formas de interacción.',
    objective: 'Construir una unidad capaz de desarrollar y comercializar productos y experiencias tecnológicas innovadoras, posicionando a N5 como referente en experiencias inmersivas y nuevas tecnologías.',
    indicators: ['Productos desarrollados', 'Prototipos comercializables', 'Proyectos tecnológicos contratados', 'Facturación por innovación', 'Propiedad intelectual', 'Investigación y desarrollo', 'Capacidad técnica del equipo'],
  },
  {
    id: 'cine', number: '03', name: 'N5 Cine', label: 'Narrativa', image: '/images/cine.webp',
    alt: 'Escenario cinematográfico con tiras de película, proyección y paisaje escultórico',
    intro: ['La división dedicada a la creación cinematográfica y al desarrollo de propiedad intelectual audiovisual.', 'Es el espacio donde N5 construye una voz artística propia.'],
    mission: 'Crear obras cinematográficas con identidad narrativa propia que emocionen, cuestionen e inspiren, desarrollando historias capaces de trascender el tiempo.',
    objective: 'Desarrollar progresivamente una práctica cinematográfica propia y posicionar a N5 y a sus directores por su capacidad narrativa y cinematográfica.',
    outcomes: ['Ejercicios cinematográficos', 'Sketches', 'Piezas narrativas', 'Cortometrajes', 'Documentales', 'Largometrajes', 'Proyectos de autor'],
    indicators: ['Obras terminadas', 'Propiedad intelectual desarrollada', 'Portafolio cinematográfico', 'Selecciones en festivales', 'Distribución', 'Premios y reconocimientos', 'Colaboraciones', 'Desarrollo de audiencia', 'Posicionamiento de dirección'],
  },
]

export const directionFocus = [
  'Visión', 'Dirección creativa', 'Narrativa', 'Desarrollo de proyectos',
  'Relaciones estratégicas', 'Decisiones importantes', 'Nuevas oportunidades',
]

export const manifesto = [
  'Creemos en las personas.',
  'Creemos en la formación.',
  'Creemos en los procesos.',
  'Creemos en el criterio.',
  'Creemos en la creatividad acompañada de estructura.',
]
