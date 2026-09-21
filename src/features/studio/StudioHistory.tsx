import { ColumnsSection, DivisionIntro } from '@features/division-pages/DivisionSections'

// Historia N5 (sección de Studio en la arquitectura de Miro).
// Datos confirmados: fundada en Cuenca en 2018. El relato y los hitos posteriores son una narración
// provisional: confirmar años y detalles con N5 antes de publicar.
const milestones = [
  { title: '2018', body: 'El comienzo. Una cámara prestada, un computador y la convicción de que una buena historia puede abrir puertas.' },
  { title: '2019', body: 'Los primeros clientes. Negocios de Cuenca confían en N5 sus videos y sus redes. Ahí nace lo que hoy es N5 RRSS.' },
  { title: '2021', body: 'Un equipo. Llegan las primeras personas y, con ellas, procesos, formación y proyectos más ambiciosos.' },
  { title: 'Hoy', body: 'Tres divisiones. RRSS, Labs y Cine: un estudio que integra narrativa, producción audiovisual y tecnología.' },
]

export function StudioHistory() {
  return (
    <>
      <DivisionIntro
        id="historia"
        theme="light"
        eyebrow="Historia N5"
        index="Cuenca, 2018"
        title={<>Empezó con<br /><em>una cámara.</em></>}
        paragraphs={[
          'N5 nació en Cuenca en 2018, cuando un joven con una cámara prestada, muchas ideas y ningún cliente decidió que quería vivir de contar historias.',
          'Los primeros proyectos se hicieron con lo que había: noches de edición, amigos frente a la cámara y encargos pequeños tratados como si fueran grandes. Cada trabajo bien hecho abrió la puerta al siguiente.',
        ]}
      />
      <ColumnsSection
        id="historia-camino"
        theme="dark"
        eyebrow="El camino"
        index="De una idea a un estudio"
        title={<>Paso a paso,<br /><em>hasta aquí.</em></>}
        items={milestones}
      />
    </>
  )
}
