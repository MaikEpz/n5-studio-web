import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 95 fotogramas (de 000 a 094, descartando los últimos 7)
const TOTAL_FRAMES = 95

function getFrameUrl(index: number): string {
  const paddedIndex = String(index).padStart(3, '0')
  return `/video/Quiero_un_video_para_una_web__${paddedIndex}.webp`
}

interface HeroVideoSequenceProps {
  triggerSelector?: string
  className?: string
}

export function HeroVideoSequence({
  triggerSelector = '#inicio',
  className = 'hero-sequence-canvas',
}: HeroVideoSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null))
  const isLoadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false))
  const animFrameIdRef = useRef<number | null>(null)
  const isVisibleRef = useRef(true)

  // Medidas cacheadas para evitar forzar reflow (getBoundingClientRect) en cada tick de scroll
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // alpha: false indica a la GPU que el canvas es opaco, ahorrando cálculo de composición y mejorando el framerate
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!ctx) return

    let isDisposed = false
    const images = imagesRef.current
    const isLoaded = isLoadedRef.current

    // Actualizar dimensiones sin forzar reflow en cada scroll
    const updateDimensions = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dimensionsRef.current = {
        width: rect.width,
        height: rect.height,
        dpr,
      }

      const targetWidth = Math.round(rect.width * dpr)
      const targetHeight = Math.round(rect.height * dpr)

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth
        canvas.height = targetHeight
      }
    }

    updateDimensions()

    const render = () => {
      if (isDisposed || !canvas || !isVisibleRef.current) return

      const targetIndex = currentFrameRef.current
      let imgToDraw = isLoaded[targetIndex] ? images[targetIndex] : null

      // Fallback dinámico ultra-rápido al fotograma listo más próximo
      if (!imgToDraw || !imgToDraw.naturalWidth) {
        let bestDistance = Infinity
        let bestIndex = -1
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (isLoaded[i] && images[i]?.naturalWidth) {
            const distance = Math.abs(i - targetIndex)
            if (distance < bestDistance) {
              bestDistance = distance
              bestIndex = i
            }
          }
        }
        if (bestIndex !== -1) {
          imgToDraw = images[bestIndex]
        }
      }

      if (!imgToDraw || !imgToDraw.naturalWidth) return

      const { width: w, height: h, dpr } = dimensionsRef.current
      if (w === 0 || h === 0) return

      ctx.save()
      ctx.scale(dpr, dpr)

      // Cálculo de encuadre cover sin distorsión
      const imgRatio = imgToDraw.naturalWidth / imgToDraw.naturalHeight
      const canvasRatio = w / h

      let drawW = w
      let drawH = h
      let offsetX = 0
      let offsetY = 0

      if (canvasRatio > imgRatio) {
        drawH = w / imgRatio
        offsetY = (h - drawH) / 2
      } else {
        drawW = h * imgRatio
        offsetX = (w - drawW) / 2
      }

      ctx.drawImage(imgToDraw, offsetX, offsetY, drawW, drawH)
      ctx.restore()
    }

    const queueRender = () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      animFrameIdRef.current = requestAnimationFrame(render)
    }

    const setFrame = (frameIndex: number) => {
      const clamped = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameIndex))
      if (clamped !== currentFrameRef.current) {
        currentFrameRef.current = clamped
        queueRender()
      }
    }

    // Carga y decodificación en hilo secundario mediante img.decode() para eliminar jank
    const loadSingleImage = async (index: number) => {
      const img = new Image()
      img.src = getFrameUrl(index)

      try {
        // img.decode() procesa la descompresión del WebP en segundo plano antes de pintar
        if ('decode' in img) {
          await img.decode()
        }
      } catch {
        // Fallback si el navegador no soporta decode() o la promesa rechaza
      }

      if (isDisposed) return
      isLoaded[index] = true
      images[index] = img

      if (currentFrameRef.current === index || index === 0) {
        queueRender()
      }
    }

    // 1. Cargar fotograma 0 inmediatamente
    loadSingleImage(0)

    // 2. Precargar el resto progresivamente con prioridad en los primeros fotogramas
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      loadSingleImage(i)
    }

    // Observer de redimensionamiento: recalcula dimensiones cacheadas
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
      queueRender()
    })
    resizeObserver.observe(canvas)

    // IntersectionObserver: detiene el render si la sección no está en pantalla, liberando CPU y GPU al 100%
    const intersectionObserver = new IntersectionObserver((entries) => {
      const [entry] = entries
      isVisibleRef.current = entry.isIntersecting
      if (entry.isIntersecting) {
        queueRender()
      }
    }, { rootMargin: '100px' })
    intersectionObserver.observe(canvas)

    // Mecanismo 1: GSAP Tween con ScrollTrigger scrub
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tween: gsap.core.Tween | null = null

    if (!reduceMotion) {
      const frameState = { frame: 0 }
      tween = gsap.to(frameState, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerSelector,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const nextFrame = Math.round(self.progress * (TOTAL_FRAMES - 1))
            setFrame(nextFrame)
          },
        },
        onUpdate: () => {
          const nextFrame = Math.round(frameState.frame)
          setFrame(nextFrame)
        },
      })
    }

    // Mecanismo 2: Listener nativo pasivo de scroll
    const handleNativeScroll = () => {
      if (reduceMotion || !isVisibleRef.current) return
      const trigger = document.querySelector(triggerSelector) as HTMLElement | null
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const maxScroll = trigger.offsetHeight - window.innerHeight
      if (maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, -rect.top / maxScroll))
        const nextFrame = Math.round(progress * (TOTAL_FRAMES - 1))
        setFrame(nextFrame)
      }
    }

    window.addEventListener('scroll', handleNativeScroll, { passive: true })

    queueRender()

    return () => {
      isDisposed = true
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('scroll', handleNativeScroll)
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }
  }, [triggerSelector])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Secuencia cinematográfica nocturna observada a través del diafragma de una lente de cámara"
    />
  )
}
