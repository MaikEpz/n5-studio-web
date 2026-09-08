export const pageIds = ['n5', 'filosofia', 'academia', 'manifiesto'] as const
export type PageId = typeof pageIds[number]

export const navigationItems: readonly { id: PageId; label: string; path: string }[] = [
  { id: 'n5', label: 'N5', path: '/' },
  { id: 'filosofia', label: 'Filosofía', path: '/filosofia' },
  { id: 'academia', label: 'Academia', path: '/academia' },
  { id: 'manifiesto', label: 'Manifiesto', path: '/manifiesto' },
]

export function pageFromPathname(pathname: string): PageId {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  if (normalized === '/divisiones') return 'academia'
  return navigationItems.find(({ path }) => path === normalized)?.id ?? 'n5'
}
