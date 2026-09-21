import { DivisionIntro } from '@features/division-pages/DivisionSections'

// Historia N5 (sección de Studio en la arquitectura de Miro).
// Dato confirmado: fundada en Cuenca en 2018. El relato es provisional:
// confirmar sus detalles con N5 antes de publicar.

export function StudioHistory() {
  return (
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
  )
}
