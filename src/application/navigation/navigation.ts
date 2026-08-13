export const sectionIds = ['inicio', 'n5', 'filosofia', 'divisiones', 'manifiesto'] as const
export type SectionId = typeof sectionIds[number]

export const navigationItems: readonly { id: SectionId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' }, { id: 'n5', label: 'N5' },
  { id: 'filosofia', label: 'Filosofía' }, { id: 'divisiones', label: 'Divisiones' },
  { id: 'manifiesto', label: 'Manifiesto' },
]
