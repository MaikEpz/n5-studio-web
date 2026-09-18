import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

// Exact SVG path of the N5 emblem from BrandLogo.tsx
const N5_SVG_PATH =
  'M6150 4208 c0 -6 -40 -93 -89 -192 -147 -298 -256 -466 -318 -492 -46 -20 -406 -34 -860 -34 l-381 0 -87 -92 c-151 -160 -276 -341 -379 -547 -37 -72 -43 -92 -29 -86 158 64 520 164 672 186 102 14 293 7 376 -15 191 -51 347 -177 428 -347 74 -155 103 -318 94 -529 -13 -306 -115 -588 -296 -825 -284 -369 -675 -631 -1167 -780 -206 -63 -362 -87 -595 -92 -238 -6 -334 7 -432 59 -115 62 -159 153 -165 350 -5 144 9 211 60 291 84 131 322 279 544 338 101 27 289 33 289 9 0 -16 -12 -22 -216 -119 -69 -33 -142 -75 -163 -94 -43 -41 -48 -79 -13 -101 65 -43 295 -45 491 -5 437 88 967 402 1248 739 44 52 96 128 116 169 68 138 46 252 -62 325 -86 58 -147 71 -341 71 -225 -1 -341 -22 -730 -136 -206 -60 -276 -69 -322 -40 -57 36 -189 328 -208 461 -9 64 45 224 145 425 154 311 371 606 711 967 l129 137 543 -5 c298 -3 619 -1 712 4 257 14 295 14 295 0z M2898 3589 c3 -25 0 -27 -55 -33 -157 -18 -264 -123 -311 -303 -15 -62 -17 -130 -15 -718 1 -357 4 -971 8 -1363 l7 -713 -47 3 -48 3 -876 1342 c-482 738 -880 1345 -884 1349 -8 8 1 -1415 13 -1916 9 -394 16 -454 61 -542 49 -95 144 -167 244 -183 81 -13 85 -14 85 -39 0 -22 -5 -23 -77 -30 -42 -3 -235 -6 -430 -6 l-353 0 0 29 c0 27 2 28 58 34 167 17 283 146 312 345 12 82 12 1210 0 1847 -6 346 -12 476 -23 526 -40 175 -143 285 -288 304 -83 12 -89 14 -89 39 0 23 1 23 152 29 83 4 246 7 362 7 l211 0 760 -1181 760 -1181 3 201 c1 111 -2 542 -7 958 -11 818 -13 850 -66 959 -31 63 -90 126 -143 153 -22 11 -73 26 -113 34 -69 12 -74 15 -77 40 l-3 27 318 3 c175 1 370 2 433 2 l115 0 3 -26z'

export type ModelTargetState = {
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  scale: number
}

// Keyframe targets corresponding to the 3 divisions:
// Division 0 (RRSS): Model on Right, front-three-quarters angle angled slightly toward the left text
// Division 1 (Cine): Model on Left, dramatic low-angle cinematic perspective angled toward the right text
// Division 2 (Labs): Model on Right, dynamic isometric tech perspective angled toward the left text
export const DIVISION_TARGETS: readonly ModelTargetState[] = [
  {
    x: 1.85,
    y: 0.0,
    z: 0.1,
    rotX: 0.05,
    rotY: -0.32,
    rotZ: -0.02,
    scale: 1.0,
  },
  {
    x: -1.85,
    y: 0.06,
    z: 0.15,
    rotX: -0.14,
    rotY: 0.35,
    rotZ: 0.03,
    scale: 1.05,
  },
  {
    x: 1.85,
    y: -0.02,
    z: 0.12,
    rotX: 0.2,
    rotY: -0.45,
    rotZ: -0.05,
    scale: 1.0,
  },
] as const

export type N5ModelCanvasProps = {
  progress: number // Continuous 0 to 1 across the division section
  className?: string
}

function interpolateTarget(progress: number, isMobile: boolean): ModelTargetState {
  let from = DIVISION_TARGETS[0]
  let to = DIVISION_TARGETS[0]
  let t = 0

  if (progress <= 0.33) {
    from = DIVISION_TARGETS[0]
    to = DIVISION_TARGETS[0]
    t = 0
  } else if (progress < 0.55) {
    from = DIVISION_TARGETS[0]
    to = DIVISION_TARGETS[1]
    t = (progress - 0.33) / (0.55 - 0.33)
  } else if (progress <= 0.75) {
    from = DIVISION_TARGETS[1]
    to = DIVISION_TARGETS[1]
    t = 0
  } else if (progress < 0.92) {
    from = DIVISION_TARGETS[1]
    to = DIVISION_TARGETS[2]
    t = (progress - 0.75) / (0.92 - 0.75)
  } else {
    from = DIVISION_TARGETS[2]
    to = DIVISION_TARGETS[2]
    t = 0
  }

  // Smooth Hermite easing for transitions
  const ease = t * t * (3 - 2 * t)

  const multX = isMobile ? 0.25 : 1
  const multScale = isMobile ? 0.62 : 1

  return {
    x: (from.x + (to.x - from.x) * ease) * multX,
    y: from.y + (to.y - from.y) * ease,
    z: from.z + (to.z - from.z) * ease,
    rotX: from.rotX + (to.rotX - from.rotX) * ease,
    rotY: from.rotY + (to.rotY - from.rotY) * ease,
    rotZ: from.rotZ + (to.rotZ - from.rotZ) * ease,
    scale: (from.scale + (to.scale - from.scale) * ease) * multScale,
  }
}

export function N5ModelCanvas({ progress, className = '' }: N5ModelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    progress: 0,
    target: { ...DIVISION_TARGETS[0] },
    current: { ...DIVISION_TARGETS[0] },
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
  })

  useEffect(() => {
    stateRef.current.progress = progress
  }, [progress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth <= 900
    const initialTarget = interpolateTarget(stateRef.current.progress, isMobile)
    stateRef.current.target = initialTarget
    stateRef.current.current = { ...initialTarget }

    // Scene, Camera & Renderer
    const scene = new THREE.Scene()
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100)
    camera.position.set(0, 0, 7.8)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    container.appendChild(renderer.domElement)

    // Build 3D Mesh from SVG Path
    const svgMarkup = `
      <svg viewBox="9 24 616 406" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 456) scale(0.1, -0.1)">
          <path d="${N5_SVG_PATH}" />
        </g>
      </svg>
    `
    const loader = new SVGLoader()
    const svgData = loader.parse(svgMarkup)
    const shapes = svgData.paths.flatMap((p) => SVGLoader.createShapes(p))

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 28,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 3,
      bevelThickness: 3,
      curveSegments: 24,
    }

    const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings)
    geometry.center()

    // Calculate dimensions
    geometry.computeBoundingBox()
    const bbox = geometry.boundingBox!
    const heightSpan = bbox.max.y - bbox.min.y
    const targetSpan = 2.45
    const baseScale = targetSpan / (heightSpan || 1)

    // Invert Y (-baseScale) so SVG Y-down becomes Three.js Y-up (right-side up!)
    // Keep X positive (+baseScale) so "N" is on the left and "5" is on the right!
    geometry.scale(baseScale, -baseScale, baseScale)

    // Reverse triangle index winding because Y scale is negative (inverts triangle orientation)
    const index = geometry.getIndex()
    if (index) {
      const array = index.array
      for (let i = 0; i < array.length; i += 3) {
        const tmp = array[i]
        array[i] = array[i + 1]
        array[i + 1] = tmp
      }
      index.needsUpdate = true
    }
    geometry.computeVertexNormals()

    // Studio Satin Titanium with subtle Violet/Purple Sheen
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#322d3d'),
      emissive: new THREE.Color('#220530'),
      emissiveIntensity: 0.12,
      roughness: 0.32,
      metalness: 0.78,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
      reflectivity: 0.95,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    const modelGroup = new THREE.Group()
    modelGroup.add(mesh)
    scene.add(modelGroup)

    // Studio Lighting Setup
    // Front Key Light (illuminates front face so logo letters are clearly legible)
    const frontLight = new THREE.DirectionalLight('#ffffff', 3.6)
    frontLight.position.set(0, 3, 9)
    scene.add(frontLight)

    // Top Right Studio Key
    const keyLight = new THREE.DirectionalLight('#ede6ff', 2.8)
    keyLight.position.set(6, 7, 7)
    scene.add(keyLight)

    // Soft Cool Fill Light
    const fillLight = new THREE.DirectionalLight('#7a88a8', 1.8)
    fillLight.position.set(-6, -2, 5)
    scene.add(fillLight)

    // Signature N5 Purple Rim Lights (#9318c4 / #b824eb)
    const purpleRimLight1 = new THREE.PointLight('#b824eb', 22, 35, 1.2)
    purpleRimLight1.position.set(4, -2, 3)
    scene.add(purpleRimLight1)

    const purpleRimLight2 = new THREE.PointLight('#9318c4', 16, 35, 1.2)
    purpleRimLight2.position.set(-4, 3, 2)
    scene.add(purpleRimLight2)

    const backRimLight = new THREE.DirectionalLight('#8a1cb5', 1.8)
    backRimLight.position.set(0, -4, -3)
    scene.add(backRimLight)

    const ambientLight = new THREE.AmbientLight('#221f2b', 1.9)
    scene.add(ambientLight)

    // Subtle horizontal hover parallax (only when pointer is inside container)
    // Vertical tilt/pitch (rotX / y) is intentionally excluded so the logo adheres
    // faithfully to the scroll-designed angles and does not look up or down with cursor.
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      // Check if cursor is actually within the container bounds
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        stateRef.current.targetMouse = { x: 0, y: 0 }
        return
      }

      const rawX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const x = Math.max(-1, Math.min(1, rawX))
      stateRef.current.targetMouse = { x, y: 0 }
    }

    const handlePointerLeave = () => {
      stateRef.current.targetMouse = { x: 0, y: 0 }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    container.addEventListener('pointerleave', handlePointerLeave)

    // Resize handling
    let resizeTimer: number | null = null
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(handleResize, 60)
    })
    resizeObserver.observe(container)

    // Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()
      const mobile = window.innerWidth <= 900

      // Update target based on latest scroll progress
      const nextTarget = interpolateTarget(stateRef.current.progress, mobile)
      stateRef.current.target = nextTarget

      // Lerp mouse
      const mouse = stateRef.current.mouse
      const targetMouse = stateRef.current.targetMouse
      mouse.x += (targetMouse.x - mouse.x) * 0.05
      mouse.y += (targetMouse.y - mouse.y) * 0.05

      // Subtle organic breathing float
      const floatY = Math.sin(elapsedTime * 1.5) * 0.04
      const floatRotY = Math.cos(elapsedTime * 1.2) * 0.025

      // Smooth interpolation towards targets
      const current = stateRef.current.current
      const target = stateRef.current.target
      const lerpFactor = 0.08

      current.x += (target.x - current.x) * lerpFactor
      current.y += (target.y - current.y) * lerpFactor
      current.z += (target.z - current.z) * lerpFactor
      current.rotX += (target.rotX - current.rotX) * lerpFactor
      current.rotY += (target.rotY - current.rotY) * lerpFactor
      current.rotZ += (target.rotZ - current.rotZ) * lerpFactor
      current.scale += (target.scale - current.scale) * lerpFactor

      // Apply to 3D model
      // Note: rotation.x strictly follows current.rotX so the logo maintains its exact
      // cinematic scroll orientation without tilting up or down based on cursor position.
      modelGroup.position.x = current.x + mouse.x * 0.12
      modelGroup.position.y = current.y + floatY
      modelGroup.position.z = current.z

      modelGroup.rotation.x = current.rotX
      modelGroup.rotation.y = current.rotY + floatRotY + mouse.x * 0.08
      modelGroup.rotation.z = current.rotZ

      modelGroup.scale.setScalar(current.scale)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      resizeObserver.disconnect()
      if (resizeTimer) clearTimeout(resizeTimer)

      // Clean up Three.js resources
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`n5-model-canvas-container ${className}`.trim()}
      aria-hidden="true"
    />
  )
}
