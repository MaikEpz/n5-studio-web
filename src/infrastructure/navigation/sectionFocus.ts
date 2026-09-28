export type SectionBounds = { top: number; height: number }

export function isInsideLongSection(scroll: number, viewportHeight: number, sections: readonly SectionBounds[]): boolean {
  return sections.some(({ top, height }) =>
    height > viewportHeight + 1 && scroll >= top && scroll <= top + height - viewportHeight,
  )
}

export function nearestSectionRest(
  scroll: number,
  viewportHeight: number,
  sections: readonly SectionBounds[],
  maxScroll: number,
  threshold = Math.min(viewportHeight * 0.18, 180),
): number | null {
  let nearest: number | null = null
  let distanceToNearest = threshold

  for (const { top, height } of sections) {
    if (height > viewportHeight + 1) continue
    const target = Math.max(0, Math.min(maxScroll, top - (viewportHeight - height) / 2))
    const distance = Math.abs(target - scroll)
    if (distance < 8 || distance >= distanceToNearest) continue
    nearest = target
    distanceToNearest = distance
  }

  return nearest
}
