import { useEffect, useRef, useState, type CSSProperties, type SVGProps } from 'react'

type ProcessStep = { title: string; body: string }
type Point = readonly [number, number]
type Shape = 'square' | 'circle' | 'diamond'
type LabelSide = 'below' | 'right' | 'left'
// `labelAt` coloca la etiqueta en el diagrama horizontal y `labelAtV` en el vertical (móvil).
type FlowNode = { id: string; label: string; phase: number; shape: Shape; x: number; y: number; icon: string; labelAt?: LabelSide; labelAtV: LabelSide }
// Una conexión se llena durante su fase: `delay` y `span` son fracciones de la duración del paso.
type FlowEdge = { phase: number; points: readonly Point[]; delay?: number; span?: number }

// Duración de cada fase del proceso y pausa con todo completo antes de reiniciar.
const STEP_MS = 2400
const COMPLETE_MS = 2200
// En móvil el diagrama se gira en vertical: el horizontal quedaría con etiquetas de 5px.
const VERTICAL_QUERY = '(max-width: 640px)'
const viewBoxes = { horizontal: '0 16 960 300', vertical: '-100 16 520 890' }

const icons = {
  brief: 'M9 7 17 12 9 17Z',
  listen: 'M5 6.5h14A1.5 1.5 0 0 1 20.5 8v7a1.5 1.5 0 0 1-1.5 1.5h-9l-4 3v-3H5A1.5 1.5 0 0 1 3.5 15V8A1.5 1.5 0 0 1 5 6.5Z',
  idea: 'M19.5 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0ZM9.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0ZM19.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0ZM9.2 10.8l5.6-3.6M9.2 13.2l5.6 3.6',
  shoot: 'M4 8.5h3l1.5-2h7l1.5 2h3v10H4ZM15 13.5a3 3 0 1 1-6 0 3 3 0 1 1 6 0Z',
  design: 'M12 4 3.5 8.5 12 13l8.5-4.5ZM3.5 12.5 12 17l8.5-4.5M3.5 16 12 20.5l8.5-4.5',
  edit: 'M4 6h16v12H4ZM4 10h16M8 6v4M12 6v4M16 6v4',
  review: 'M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6ZM14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0Z',
  deliver: 'M6.5 12.5 10 16l7.5-8',
}

// Fases: 0 Entender, 1 Crear, 2 Producir, 3 Finalizar y 4 entrega (todo completo).
const nodes: FlowNode[] = [
  { id: 'brief', label: 'Brief', phase: 0, shape: 'square', x: 60, y: 160, icon: icons.brief, labelAtV: 'right' },
  { id: 'listen', label: 'Escucha', phase: 0, shape: 'square', x: 200, y: 160, icon: icons.listen, labelAtV: 'right' },
  { id: 'idea', label: 'Idea', phase: 1, shape: 'circle', x: 350, y: 160, icon: icons.idea, labelAt: 'right', labelAtV: 'below' },
  { id: 'shoot', label: 'Rodaje', phase: 2, shape: 'square', x: 500, y: 70, icon: icons.shoot, labelAtV: 'left' },
  { id: 'design', label: 'Diseño', phase: 2, shape: 'circle', x: 500, y: 250, icon: icons.design, labelAtV: 'right' },
  { id: 'edit', label: 'Edición', phase: 3, shape: 'square', x: 650, y: 70, icon: icons.edit, labelAtV: 'left' },
  { id: 'review', label: 'Revisión', phase: 3, shape: 'diamond', x: 650, y: 250, icon: icons.review, labelAtV: 'right' },
  { id: 'deliver', label: 'Entrega', phase: 4, shape: 'circle', x: 820, y: 160, icon: icons.deliver, labelAt: 'right', labelAtV: 'below' },
]

const edges: FlowEdge[] = [
  { phase: 0, points: [[98, 160], [160, 160]], span: 0.45 },
  { phase: 0, points: [[238, 160], [304, 160]], delay: 0.5, span: 0.5 },
  { phase: 1, points: [[350, 116], [350, 70], [460, 70]] },
  { phase: 1, points: [[350, 204], [350, 250], [458, 250]] },
  { phase: 2, points: [[538, 70], [610, 70]] },
  { phase: 2, points: [[540, 250], [604, 250]] },
  { phase: 3, points: [[688, 70], [820, 70], [820, 116]] },
  { phase: 3, points: [[694, 250], [820, 250], [820, 204]] },
]

// El diagrama vertical es el horizontal con los ejes intercambiados.
const flip = ([x, y]: Point): Point => [y, x]

// Recorrido con esquinas redondeadas, como un diagrama de nodos.
function edgePath(points: readonly Point[], radius = 16) {
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i]
    const next = points[i + 1]
    if (!next) { d += ` L${x} ${y}`; break }
    const [px, py] = points[i - 1]
    const inX = Math.sign(x - px) * radius, inY = Math.sign(y - py) * radius
    const outX = Math.sign(next[0] - x) * radius, outY = Math.sign(next[1] - y) * radius
    d += ` L${x - inX} ${y - inY} Q${x} ${y} ${x + outX} ${y + outY}`
  }
  return d
}

// Punta de flecha orientada según el último tramo.
function arrowHead(points: readonly Point[]) {
  const [x, y] = points[points.length - 1]
  const [px, py] = points[points.length - 2]
  const dx = Math.sign(x - px), dy = Math.sign(y - py)
  const size = 7
  return `M${x - dx * size - dy * size} ${y - dy * size - dx * size} L${x} ${y} L${x - dx * size + dy * size} ${y - dy * size + dx * size}`
}

// Distancia del centro al borde del nodo; la etiqueta se coloca a partir de ella.
const nodeRadius = (node: FlowNode) => (node.shape === 'square' ? 34 : node.shape === 'diamond' || node.id === 'idea' ? 42 : 38)

function NodeShape({ node, x, y }: { node: FlowNode; x: number; y: number }) {
  if (node.shape === 'circle') return <circle className="rrss-node-shape" cx={x} cy={y} r={nodeRadius(node)} />
  if (node.shape === 'diamond') return <path className="rrss-node-shape" d={`M${x} ${y - 42}L${x + 42} ${y}L${x} ${y + 42}L${x - 42} ${y}Z`} />
  return <rect className="rrss-node-shape" x={x - 34} y={y - 34} width={68} height={68} rx={14} />
}

// Proceso como diagrama de nodos. Al entrar en pantalla se recorre fase a fase: los nodos de la fase
// activa se rellenan en morado y sus conexiones se trazan en negro.
export function ProcessFlow({ steps }: { steps: readonly ProcessStep[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(-1)
  const [reduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [vertical, setVertical] = useState(() => typeof window !== 'undefined' && window.matchMedia(VERTICAL_QUERY).matches)
  const complete = steps.length

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduceMotion) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    const query = window.matchMedia(VERTICAL_QUERY)
    const update = () => setVertical(query.matches)
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    if (!inView) { setActive(-1); return }
    const delay = active < 0 ? 350 : active >= complete ? COMPLETE_MS : STEP_MS
    // Tras completar se pasa por -1 (todo pendiente) para que las conexiones se borren y vuelvan a trazarse.
    const timer = window.setTimeout(() => setActive((current) => (current >= complete ? -1 : current + 1)), delay)
    return () => window.clearTimeout(timer)
  }, [inView, active, complete, reduceMotion])

  const current = reduceMotion ? complete : active
  const stateOf = (phase: number) => (phase < current ? 'done' : phase === current ? 'active' : 'pending')

  return (
    <div ref={rootRef} className="rrss-flow">
      <svg className={`rrss-flow-diagram${vertical ? ' is-vertical' : ''} reveal reveal-left`} viewBox={viewBoxes[vertical ? 'vertical' : 'horizontal']} role="img" aria-label={`Proceso: ${steps.map((step) => step.title).join(', ')}`}>
        {edges.map((edge) => {
          const state = stateOf(edge.phase)
          const points = vertical ? edge.points.map(flip) : edge.points
          const d = edgePath(points)
          const style = { '--edge-ms': `${STEP_MS * (edge.span ?? 1)}ms`, '--edge-delay': `${STEP_MS * (edge.delay ?? 0)}ms` } as CSSProperties
          return (
            <g key={d} className={`rrss-edge is-${state}`} style={style}>
              <path className="rrss-edge-track" d={d} />
              <path className="rrss-edge-progress" d={d} pathLength={1} />
              <path className="rrss-edge-head" d={arrowHead(points)} />
            </g>
          )
        })}

        {nodes.map((node) => {
          const [x, y] = vertical ? flip([node.x, node.y]) : [node.x, node.y]
          const side = vertical ? node.labelAtV : node.labelAt ?? 'below'
          const offset = nodeRadius(node)
          const label: SVGProps<SVGTextElement> = side === 'below'
            ? { x, y: y + offset + 20, textAnchor: 'middle' }
            : { x: side === 'right' ? x + offset + 12 : x - offset - 12, y: y + 4, textAnchor: side === 'right' ? 'start' : 'end' }
          return (
            <g key={node.id} className={`rrss-node is-${stateOf(node.phase)}`}>
              <g className="rrss-node-body">
                <NodeShape node={node} x={x} y={y} />
                <path className="rrss-node-icon" d={node.icon} transform={`translate(${x - 12} ${y - 12})`} />
              </g>
              <text className="rrss-node-label" {...label}>{node.label}</text>
            </g>
          )
        })}
      </svg>

      <ol className="rrss-flow-steps">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`is-${stateOf(index)} reveal reveal-right`}
            aria-current={index === current ? 'step' : undefined}
          >
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
