// Tiempos compartidos de la escena de Divisiones (progreso 0–1 del tramo fijo).
// Textos y modelo 3D usan los mismos tramos para cambiar a la vez.
// Reposos: RRSS 0–0.18 (además se ve mientras la sección entra), segunda 0.34–0.60, tercera 0.76–1.
export const DIVISION_SCROLL_LENGTH = '+=380%'
export const DIVISION_TRANSITIONS = [
  { start: 0.18, end: 0.34 },
  { start: 0.6, end: 0.76 },
] as const
// Parte de cada cambio que ocupa la salida del texto anterior y la entrada del siguiente.
export const DIVISION_TEXT_PHASE = 0.1
