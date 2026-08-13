import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sectionIds, type SectionId } from '@application/navigation/navigation'

export function usePageNavigation(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null)
  const [active, setActive] = useState<SectionId>('inicio')
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

  const navigate = useCallback((id: string, replace = false) => {
    const target = document.getElementById(id)
    if (!target) return
    history[replace ? 'replaceState' : 'pushState'](null, '', `#${id}`)
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -70 })
    else target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [])

  useEffect(() => {
    if (!enabled) return
    const targets = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 60)
      const activationLine = window.innerHeight * 0.36
      let current = targets[0]
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= activationLine) current = target
        else break
      }
      if (current && sectionIds.includes(current.id as SectionId)) setActive(current.id as SectionId)
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

  useEffect(() => {
    if (!enabled) return
    const onPop = () => document.getElementById(location.hash.slice(1) || 'inicio')?.scrollIntoView()
    window.addEventListener('popstate', onPop)
    if (location.hash) window.setTimeout(onPop, 100)
    return () => window.removeEventListener('popstate', onPop)
  }, [enabled])

  return { active, scrolled, navigate }
}
