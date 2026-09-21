import { DivisionIntro, ListSection } from '@features/division-pages/DivisionSections'

// Director y Equipo (secciones de Studio en la arquitectura de Miro).
// Contenido provisional: faltan nombre, foto y biografía real del director, y las personas del equipo.
// Mientras tanto se presentan sin inventar nombres: el director por su historia y el equipo por áreas.

export function StudioDirector() {
  return (
    <DivisionIntro
      id="director"
      theme="light"
      eyebrow="Director"
      index="Fundador y director creativo"
      title={<>La mirada<br /><em>detrás de N5.</em></>}
      paragraphs={[
        'Empezó detrás de la cámara y nunca dejó de estar ahí. Hoy su trabajo es cuidar la mirada de N5: que cada proyecto tenga una idea clara, una ejecución cuidada y una razón para existir.',
        'Dirige la visión creativa del estudio y forma al equipo para que el criterio no dependa de una sola persona, sino de un sistema que crece con cada proyecto.',
      ]}
    />
  )
}

const teamAreas = ['Dirección creativa', 'Producción', 'Dirección de fotografía', 'Postproducción', 'Desarrollo y tecnología', 'Estrategia y comunicación']

export function StudioTeam() {
  return (
    <ListSection
      id="equipo"
      theme="dark"
      eyebrow="Equipo"
      index="Personas antes que cargos"
      title={<>Talento que se<br /><em>forma haciendo.</em></>}
      items={teamAreas}
    />
  )
}
