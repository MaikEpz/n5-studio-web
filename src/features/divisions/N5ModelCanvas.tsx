import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DIVISION_TRANSITIONS } from './divisionPhases'

const davidModelUrl = new URL('../../../david.glb', import.meta.url).href
const MODEL_VERTICAL_OFFSET = -0.5

export type CameraTargetState = {
  x: number
  y: number
  z: number
  modelX: number
  modelY: number
}

// Three camera angles with lateral model offsets opposite each division's text.
export const DIVISION_TARGETS: readonly CameraTargetState[] = [
  {
    x: -2.2,
    y: 0.25,
    z: 8.5,
    modelX: 1.75,
    modelY: 0,
  },
  {
    x: 2.3,
    y: -0.8,
    z: 7.2,
    modelX: -1.75,
    modelY: 0.08,
  },
  {
    x: 9.7,
    y: -0.6,
    z: 2.6,
    modelX: 1.85,
    modelY: -0.08,
  },
] as const

export type N5ModelCanvasProps = {
  progress: number // Continuous 0 to 1 across the division section
  className?: string
}

function interpolateTarget(progress: number, isMobile: boolean): CameraTargetState {
  let from = DIVISION_TARGETS[0]
  let to = DIVISION_TARGETS[0]
  let t = 0

  // Mismos tramos que los textos: la cámara orbita solo durante cada cambio.
  const [first, second] = DIVISION_TRANSITIONS
  if (progress <= first.start) {
    from = to = DIVISION_TARGETS[0]
  } else if (progress < first.end) {
    from = DIVISION_TARGETS[0]
    to = DIVISION_TARGETS[1]
    t = (progress - first.start) / (first.end - first.start)
  } else if (progress <= second.start) {
    from = to = DIVISION_TARGETS[1]
  } else if (progress < second.end) {
    from = DIVISION_TARGETS[1]
    to = DIVISION_TARGETS[2]
    t = (progress - second.start) / (second.end - second.start)
  } else {
    from = to = DIVISION_TARGETS[2]
  }

  // Smooth Hermite easing for transitions
  const ease = t * t * (3 - 2 * t)

  const multX = isMobile ? 0.25 : 1
  const multDistance = isMobile ? 1.62 : 1
  // Interpolate the orbit angle rather than cutting across it in Cartesian space.
  const fromAngle = Math.atan2(from.x, from.z)
  const toAngle = Math.atan2(to.x, to.z)
  const angle = fromAngle + (toAngle - fromAngle) * ease
  const radius = Math.hypot(from.x, from.z) + (Math.hypot(to.x, to.z) - Math.hypot(from.x, from.z)) * ease

  return {
    x: Math.sin(angle) * radius * multX,
    y: from.y + (to.y - from.y) * ease,
    z: Math.cos(angle) * radius * multDistance,
    modelX: (from.modelX + (to.modelX - from.modelX) * ease) * (isMobile ? 0.5 : 1),
    modelY: from.modelY + (to.modelY - from.modelY) * ease,
  }
}

export function N5ModelCanvas({ progress, className = '' }: N5ModelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    progress: 0,
    target: { ...DIVISION_TARGETS[0] },
    current: { ...DIVISION_TARGETS[0] },
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
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    let disposed = false
    const disposeModel = (model: THREE.Object3D) => {
      model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
    }

    // Center the original GLB first, then scale its parent around the scene origin.
    new GLTFLoader().load(davidModelUrl, (gltf) => {
      const model = gltf.scene
      if (disposed) {
        disposeModel(model)
        return
      }

      const bounds = new THREE.Box3().setFromObject(model)
      const size = bounds.getSize(new THREE.Vector3())
      const center = bounds.getCenter(new THREE.Vector3())
      model.position.sub(center)
      modelGroup.scale.setScalar(3.675 / (size.y || 1))
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true
          object.receiveShadow = true
        }
      })
      modelGroup.add(model)
    }, undefined, (error) => {
      console.error('No se pudo cargar el modelo 3D de David.', error)
    })

    // Studio Lighting Setup
    // Restrained key/fill contrast reveals David's sculptural detail without tinting its material.
    const frontLight = new THREE.DirectionalLight('#ffffff', 0.2)
    frontLight.position.set(0, 3, 9)
    scene.add(frontLight)

    // Top Right Studio Key
    const keyLight = new THREE.DirectionalLight('#f1f3f7', 0.18)
    keyLight.position.set(6, 7, 7)
    scene.add(keyLight)

    // Soft Cool Fill Light
    const fillLight = new THREE.DirectionalLight('#9aa7ba', 0.08)
    fillLight.position.set(-6, -2, 5)
    scene.add(fillLight)

    // Neutral rim lighting preserves the GLB's authored base color.
    const backRimLight = new THREE.DirectionalLight('#d9e0e8', 0.3)
    backRimLight.position.set(0, -4, -3)
    scene.add(backRimLight)

    const ambientLight = new THREE.AmbientLight('#15171b', 0.25)
    scene.add(ambientLight)

    // The studio ring stays at a constant offset from David as the camera orbits.
    const lightOffset = new THREE.Vector3(-1.5, 1.3, -1.6)
    const ledRing = new THREE.Group()
    ledRing.position.copy(lightOffset)
    ledRing.lookAt(modelGroup.position)
    ledRing.scale.setScalar(4.2)
    const housing = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.02125, 16, 64),
      new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0.65, roughness: 0.35 }),
    )
    const diodes = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.00875, 12, 64),
      new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
    )
    diodes.position.z = 0.02
    const backDiodes = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.00875, 12, 64),
      new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
    )
    backDiodes.position.z = -0.02
    // Soft Gaussian halo around the diode ring, depth-tested so David occludes it naturally.
    const ledHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          varying vec2 vPosition;
          void main() {
            vPosition = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vPosition;
          void main() {
            float distanceToRing = abs(length(vPosition) - 0.38);
            float closeGlow = exp(-pow(distanceToRing / 0.035, 2.0)) * 0.42;
            float wideGlow = exp(-pow(distanceToRing / 0.12, 2.0)) * 0.32;
            float glow = closeGlow + wideGlow;
            if (glow < 0.002) discard;
            gl_FragColor = vec4(0.95, 0.97, 1.0, glow);
          }
        `,
      }),
    )
    ledHalo.position.z = 0.03
    ledRing.add(housing, diodes, backDiodes, ledHalo)
    scene.add(ledRing)

    // Keep the original sculptural lighting; the visible LED is a separate scene element.
    const accentLight = new THREE.SpotLight('#ffffff', 12, 30, Math.PI / 5, 0.45, 1.2)
    accentLight.position.set(-5, 5, 4)
    accentLight.target = modelGroup
    accentLight.castShadow = true
    accentLight.shadow.mapSize.set(2048, 2048)
    accentLight.shadow.camera.near = 0.5
    accentLight.shadow.camera.far = 18
    accentLight.shadow.bias = -0.0001
    accentLight.shadow.normalBias = 0.006
    scene.add(accentLight)

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
    const focus = new THREE.Vector3(0, 0, 0)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const mobile = window.innerWidth <= 900

      // Update target based on latest scroll progress
      const nextTarget = interpolateTarget(stateRef.current.progress, mobile)
      stateRef.current.target = nextTarget

      // Orbit around the scene center while David shifts subtly between compositions.
      const current = stateRef.current.current
      const target = stateRef.current.target
      const lerpFactor = 0.08

      current.x += (target.x - current.x) * lerpFactor
      current.y += (target.y - current.y) * lerpFactor
      current.z += (target.z - current.z) * lerpFactor
      current.modelX += (target.modelX - current.modelX) * lerpFactor
      current.modelY += (target.modelY - current.modelY) * lerpFactor
      modelGroup.position.set(current.modelX, current.modelY + MODEL_VERTICAL_OFFSET, 0)
      ledRing.position.copy(modelGroup.position).add(lightOffset)
      ledRing.lookAt(modelGroup.position)
      camera.position.set(current.x, current.y, current.z)
      camera.lookAt(focus)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      if (resizeTimer) clearTimeout(resizeTimer)

      // Clean up Three.js resources
      disposeModel(modelGroup)
      disposeModel(ledRing)
      accentLight.shadow.dispose()
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
