import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// El Home utiliza los primeros 95 fotogramas de su secuencia original.
const HOME_FRAME_COUNT = 95

function getHomeFrameUrl(index: number): string {
  const paddedIndex = String(index).padStart(3, '0')
  return `/video/Quiero_un_video_para_una_web__${paddedIndex}.webp`
}

interface ScrollFrameSequenceProps {
  triggerSelector?: string
  className?: string
  frameCount?: number
  frameUrl?: (index: number) => string
  ariaLabel?: string
  onFrameChange?: (index: number) => void
}

export function ScrollFrameSequence({
  triggerSelector = '#inicio',
  className = 'hero-sequence-canvas',
  frameCount = HOME_FRAME_COUNT,
  frameUrl = getHomeFrameUrl,
  ariaLabel = 'Secuencia cinematográfica nocturna observada a través del diafragma de una lente de cámara',
  onFrameChange,
}: ScrollFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null))
  const isLoadedRef = useRef<boolean[]>(new Array(frameCount).fill(false))
  const animFrameIdRef = useRef<number | null>(null)
  const isVisibleRef = useRef(true)

  // Medidas de layout sin transformaciones para mantener nítido el canvas durante el zoom.
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dimensionsRef.current = {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        dpr,
      }

      const targetWidth = Math.round(canvas.clientWidth * dpr)
      const targetHeight = Math.round(canvas.clientHeight * dpr)

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
        for (let i = 0; i < frameCount; i++) {
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

    // Reproducción fluida: el scroll solo fija el fotograma objetivo y un bucle de animación
    // avanza hacia él pasando por todos los fotogramas intermedios, con una velocidad máxima.
    // Con scroll rápido el video "se pone al día" reproduciéndose en vez de saltar.
    let targetFrame = 0
    let playhead = 0
    let playbackId: number | null = null
    const MAX_FRAMES_PER_TICK = 1.2 // ≈ 72 fps de reproducción máxima a 60 Hz
    const EASING = 0.2

    const tick = () => {
      playbackId = null
      if (isDisposed) return
      const distance = targetFrame - playhead
      if (Math.abs(distance) < 0.01) {
        playhead = targetFrame
      } else {
        const eased = distance * EASING
        const minStep = Math.min(Math.abs(distance), 0.12) * Math.sign(distance)
        const step = Math.abs(eased) < Math.abs(minStep) ? minStep : eased
        playhead += Math.max(-MAX_FRAMES_PER_TICK, Math.min(MAX_FRAMES_PER_TICK, step))
      }
      const frame = Math.min(frameCount - 1, Math.max(0, Math.round(playhead)))
      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame
        onFrameChange?.(frame)
        render()
      }
      if (playhead !== targetFrame) playbackId = requestAnimationFrame(tick)
    }

    const setTargetFrame = (frame: number) => {
      targetFrame = Math.min(frameCount - 1, Math.max(0, frame))
      if (playbackId === null) playbackId = requestAnimationFrame(tick)
    }

    // Carga y decodificación en hilo secundario mediante img.decode() para eliminar jank
    const loadSingleImage = async (index: number) => {
      const img = new Image()
      img.src = frameUrl(index)

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

    // Mostrar el primer fotograma de inmediato y limitar las descargas simultáneas.
    void loadSingleImage(0)
    let nextFrame = 1
    let activeLoads = 0
    const loadNext = () => {
      while (!isDisposed && activeLoads < 6 && nextFrame < frameCount) {
        const index = nextFrame++
        activeLoads++
        void loadSingleImage(index).finally(() => {
          activeLoads--
          loadNext()
        })
      }
    }
    loadNext()

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

    // Un solo mecanismo: el progreso exacto de la sección marca el fotograma objetivo.
    // El suavizado lo hace el bucle de reproducción, no GSAP.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrollTrigger = reduceMotion ? null : ScrollTrigger.create({
      trigger: triggerSelector,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setTargetFrame(self.progress * (frameCount - 1)),
    })
    // Si la página se abre ya desplazada, se muestra directamente el fotograma de esa posición.
    if (scrollTrigger) {
      targetFrame = playhead = scrollTrigger.progress * (frameCount - 1)
      currentFrameRef.current = Math.round(playhead)
    }
    onFrameChange?.(currentFrameRef.current)

    queueRender()

    return () => {
      isDisposed = true
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      if (playbackId !== null) cancelAnimationFrame(playbackId)
      scrollTrigger?.kill()
    }
  }, [triggerSelector, frameCount, frameUrl, onFrameChange])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
    />
  )
}
