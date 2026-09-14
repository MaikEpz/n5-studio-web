import { useEffect, useRef, useState } from 'react'
import { BrandLogo } from '@shared/ui/BrandLogo'
import { navigationItems, type PageId } from '@application/navigation/navigation'

type NavigationProps = {
  active: PageId
  scrolled: boolean
  onNavigate: (id: PageId) => void
}

export function Navigation({ active, scrolled, onNavigate }: NavigationProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: PageId) => {
    setOpen(false)
    onNavigate(id)
  }

  return (
    <header className={`site-header ${scrolled || open ? 'is-scrolled' : ''}`}>
      <a className="brand" href="/" onClick={(e) => { e.preventDefault(); go('n5') }} aria-label="N5 Studio, ir al inicio">
        <BrandLogo />
      </a>
      <nav className="desktop-nav" aria-label="Navegación principal">
        {navigationItems.map(({ id, label, path }) => (
          <a key={id} href={path} className={active === id ? 'active' : ''} aria-current={active === id ? 'page' : undefined} onClick={(e) => { e.preventDefault(); go(id) }}>{label}</a>
        ))}
      </nav>
      <button ref={buttonRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Navegación móvil">
          {navigationItems.map(({ id, label, path }, index) => (
            <a key={id} href={path} tabIndex={open ? 0 : -1} onClick={(e) => { e.preventDefault(); go(id) }}>
              <small>0{index + 1}</small><span>{label}</span>
            </a>
          ))}
        </nav>
        <p>Creatividad · Narrativa · Tecnología</p>
      </div>
    </header>
  )
}
