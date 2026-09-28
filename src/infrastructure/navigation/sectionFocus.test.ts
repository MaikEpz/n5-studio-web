import { describe, expect, it } from 'vitest'
import { isInsideLongSection, nearestSectionRest } from './sectionFocus'

describe('reposo magnético de secciones', () => {
  it('centra una sección que cabe en pantalla solo si el ajuste es corto', () => {
    const sections = [{ top: 1000, height: 620 }]
    expect(nearestSectionRest(880, 768, sections, 4000)).toBe(926)
    expect(nearestSectionRest(700, 768, sections, 4000)).toBeNull()
    expect(nearestSectionRest(924, 768, sections, 4000)).toBeNull()
  })

  it('ignora secciones largas y no interrumpe su recorrido interior', () => {
    const scene = { top: 1000, height: 3000 }
    expect(nearestSectionRest(1000, 768, [scene], 4000)).toBeNull()
    expect(isInsideLongSection(2000, 768, [scene])).toBe(true)
    expect(isInsideLongSection(3233, 768, [scene])).toBe(false)
  })

  it('elige el reposo más cercano entre dos secciones editoriales', () => {
    expect(nearestSectionRest(950, 768, [
      { top: 1000, height: 768 },
      { top: 850, height: 700 },
    ], 4000)).toBe(1000)
  })
})
