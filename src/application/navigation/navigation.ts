export const pageIds = ['home', 'work', 'rrss', 'cine', 'labs', 'studio', 'contacto'] as const
export type PageId = typeof pageIds[number]

export type NavigationItem = { id: PageId; label: string; path: string; cta?: boolean }

export const navigationItems: readonly NavigationItem[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'work', label: 'Work', path: '/work' },
  { id: 'rrss', label: 'N5 RRSS', path: '/rrss' },
  { id: 'cine', label: 'N5 Cine', path: '/cine' },
  { id: 'labs', label: 'N5 Labs', path: '/labs' },
  { id: 'studio', label: 'Studio', path: '/studio' },
  { id: 'contacto', label: 'Contacto', path: '/contacto', cta: true },
]

const legacyPaths: Record<string, PageId> = {
  '/filosofia': 'studio',
  '/academia': 'studio',
  '/manifiesto': 'studio',
  '/divisiones': 'home',
}

export function pageFromPathname(pathname: string): PageId {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return legacyPaths[normalized] ?? navigationItems.find(({ path }) => path === normalized)?.id ?? 'home'
}
