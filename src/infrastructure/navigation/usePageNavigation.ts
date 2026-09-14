import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { navigationItems, pageFromPathname, type PageId } from '@application/navigation/navigation'

export function usePageNavigation(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null)
  const [active, setActive] = useState<PageId>(() => pageFromPathname(window.location.pathname))
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(update); lenis.destroy(); lenisRef.current = null }
  }, [enabled])

  const navigate = useCallback((id: PageId, replace = false) => {
    const destination = navigationItems.find((item) => item.id === id)
    if (!destination) return
    history[replace ? 'replaceState' : 'pushState'](null, '', destination.path)
    setActive(id)
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 60)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [enabled])

  const scrollToId = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const offset = id === 'n5' ? 0 : -70
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset })
    else target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [])

  useEffect(() => {
    if (!enabled) return
    const onPop = () => {
      setActive(pageFromPathname(window.location.pathname))
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [enabled])

  return { active, scrolled, navigate, scrollToId }
}
