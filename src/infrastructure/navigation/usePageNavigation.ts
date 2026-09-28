import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { navigationItems, pageFromPathname, type PageId } from '@application/navigation/navigation'
import { isInsideLongSection, nearestSectionRest } from './sectionFocus'

export function usePageNavigation(enabled = true, refreshKey = 0) {
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

  useEffect(() => {
    const lenis = lenisRef.current
    if (!enabled || !lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 900) return

    let idleTimer: number | undefined
    let wheelPending = false
    let snapping = false
    const clearIdle = () => {
      if (idleTimer !== undefined) window.clearTimeout(idleTimer)
      idleTimer = undefined
    }
    const interrupt = () => {
      wheelPending = false
      clearIdle()
      if (snapping) {
        snapping = false
        lenis.scrollTo(lenis.scroll, { immediate: true })
      }
    }
    const settle = () => {
      idleTimer = undefined
      if (!wheelPending || snapping || window.innerWidth <= 900) return
      if (Math.abs(lenis.targetScroll - lenis.scroll) > 2 || Math.abs(lenis.velocity) > 0.15) {
        idleTimer = window.setTimeout(settle, 100)
        return
      }
      wheelPending = false

      const viewportHeight = window.innerHeight
      const sections = Array.from(document.querySelectorAll<HTMLElement>('#contenido > section')).map((element) => ({
        element,
        top: element.getBoundingClientRect().top + window.scrollY,
        height: element.offsetHeight,
      }))
      const scroll = lenis.scroll
      if (isInsideLongSection(scroll, viewportHeight, sections)) return

      const editorial = sections.filter(({ element, height }) =>
        height <= viewportHeight + 1 &&
        !element.matches('.hero, .divisions, .division-sequence, .contact-page, .work-index, .has-footer') &&
        !element.querySelector('input, textarea, select, [contenteditable]'),
      )
      const target = nearestSectionRest(scroll, viewportHeight, editorial, lenis.limit)
      if (target === null) return

      snapping = true
      lenis.scrollTo(target, {
        duration: 0.65,
        easing: (t) => 1 - (1 - t) ** 3,
        onComplete: () => { snapping = false },
      })
    }
    const onWheel = (event: WheelEvent) => {
      interrupt()
      if (event.ctrlKey || event.defaultPrevented || (event.target instanceof Element && event.target.closest('[data-lenis-prevent], input, textarea, select, [contenteditable]'))) return
      wheelPending = true
      idleTimer = window.setTimeout(settle, 180)
    }
    const onScroll = () => {
      if (!wheelPending || snapping) return
      clearIdle()
      idleTimer = window.setTimeout(settle, 180)
    }

    const unsubscribe = lenis.on('scroll', onScroll)
    window.addEventListener('wheel', onWheel, { passive: true, capture: true })
    window.addEventListener('pointerdown', interrupt, { capture: true })
    window.addEventListener('touchstart', interrupt, { passive: true })
    window.addEventListener('keydown', interrupt)
    window.addEventListener('resize', interrupt)
    return () => {
      interrupt()
      unsubscribe()
      window.removeEventListener('wheel', onWheel, true)
      window.removeEventListener('pointerdown', interrupt, true)
      window.removeEventListener('touchstart', interrupt)
      window.removeEventListener('keydown', interrupt)
      window.removeEventListener('resize', interrupt)
    }
  }, [active, enabled, refreshKey])

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
