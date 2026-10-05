import { useEffect, useRef, useState, type CSSProperties } from 'react'
import '../styles/field-direction-lab.css'

type PointerState = { x: number; y: number; active: boolean }
type StudyName = 'mesh' | 'contour' | 'axonometric' | 'flow'

interface Study {
  name: StudyName
  number: string
  title: string
  note: string
  accent: string
}

interface CanvasStudy {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  rect: DOMRect
  width: number
  height: number
  study: Study
}

const studies: Study[] = [
  { name: 'mesh', number: '01', title: 'Tension field', note: 'A calm grid that yields around the pointer.', accent: '#c8f958' },
  { name: 'contour', number: '02', title: 'Contour map', note: 'Topographic lines with a soft local swell.', accent: '#82b1ff' },
  { name: 'axonometric', number: '03', title: 'Spatial lattice', note: 'An architectural plane that shifts its depth.', accent: '#ffb86c' },
  { name: 'flow', number: '04', title: 'Signal routes', note: 'Directional paths carrying one moving signal.', accent: '#d4a5e0' },
]

function radialDisplacement(distance: number, radius: number, weight: number, maximum: number) {
  if (!weight || distance >= radius) return 0
  const unit = distance / radius
  return maximum * 6.75 * unit * (1 - unit) ** 2 * weight
}

function paintMesh(ctx: CanvasRenderingContext2D, width: number, height: number, px: number, py: number, weight: number, time: number, accent: string) {
  const stepX = width / 11
  const stepY = height / 8
  const radius = Math.min(width, height) * 0.78
  const maximum = Math.min(22, stepX * 0.3, stepY * 0.3)
  const point = (x: number, y: number) => {
    const dx = x - px
    const dy = y - py
    const distance = Math.hypot(dx, dy)
    const displacement = radialDisplacement(distance, radius, weight, maximum)
    const ambient = Math.sin(x * 0.012 + y * 0.007 + time * 0.00018) * 1.1
    return {
      x: x + (distance ? dx / distance : 0) * displacement,
      y: y + (distance ? dy / distance : 0) * displacement + ambient,
    }
  }

  ctx.lineWidth = 0.7
  ctx.strokeStyle = `${accent}72`
  for (let row = -1; row <= 8; row += 1) {
    ctx.beginPath()
    for (let segment = 0; segment <= 36; segment += 1) {
      const x = segment / 36 * width
      const vertex = point(x, row * stepY)
      if (segment === 0) ctx.moveTo(vertex.x, vertex.y)
      else ctx.lineTo(vertex.x, vertex.y)
    }
    ctx.stroke()
  }
  for (let column = -1; column <= 11; column += 1) {
    ctx.beginPath()
    for (let segment = 0; segment <= 32; segment += 1) {
      const y = segment / 32 * height
      const vertex = point(column * stepX, y)
      if (segment === 0) ctx.moveTo(vertex.x, vertex.y)
      else ctx.lineTo(vertex.x, vertex.y)
    }
    ctx.stroke()
  }
}

function paintContours(ctx: CanvasRenderingContext2D, width: number, height: number, px: number, py: number, weight: number, time: number, accent: string) {
  const centerX = width * 0.52 + (px - width * 0.52) * 0.06 * weight
  const centerY = height * 0.51 + (py - height * 0.51) * 0.06 * weight
  const radius = Math.min(width, height) * 0.72
  const maximumSwell = Math.min(6, Math.min(width, height) * 0.012)
  ctx.lineWidth = 0.8
  for (let ring = 0; ring < 16; ring += 1) {
    const baseX = 28 + ring * Math.min(width, height) * 0.048
    const baseY = 20 + ring * Math.min(width, height) * 0.036
    ctx.beginPath()
    for (let step = 0; step <= 110; step += 1) {
      const angle = step / 110 * Math.PI * 2
      const x = centerX + Math.cos(angle) * baseX
      const y = centerY + Math.sin(angle) * baseY
      const distance = Math.hypot(x - px, y - py)
      const swell = Math.exp(-(distance * distance) / (2 * (radius * 0.16) ** 2)) * maximumSwell * weight
      const relief = Math.sin(angle * 2 + ring * 0.25 + time * 0.00016) * (0.5 + swell * 0.3)
      const contourX = x + Math.cos(angle) * relief
      const contourY = y + Math.sin(angle) * relief
      if (step === 0) ctx.moveTo(contourX, contourY)
      else ctx.lineTo(contourX, contourY)
    }
    ctx.closePath()
    ctx.strokeStyle = `${accent}${ring % 4 === 0 ? '78' : '50'}`
    ctx.stroke()
  }
}

function paintAxonometric(ctx: CanvasRenderingContext2D, width: number, height: number, px: number, py: number, weight: number, accent: string) {
  const horizonX = width * 0.5 + (px - width * 0.5) * 0.08 * weight
  const horizonY = height * 0.34 + (py - height * 0.34) * 0.05 * weight
  ctx.lineWidth = 0.7
  ctx.strokeStyle = `${accent}70`
  for (let index = -8; index <= 8; index += 1) {
    const bottomX = width * 0.5 + index * width * 0.11
    ctx.beginPath()
    ctx.moveTo(horizonX, horizonY)
    ctx.lineTo(bottomX, height * 1.08)
    ctx.stroke()
  }
  for (let row = 1; row <= 13; row += 1) {
    const depth = row / 13
    const y = horizonY + (height * 1.08 - horizonY) * depth * depth
    const spread = width * depth * 0.82
    ctx.beginPath()
    ctx.moveTo(horizonX - spread, y)
    ctx.lineTo(horizonX + spread, y)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(0, horizonY)
  ctx.lineTo(width, horizonY)
  ctx.strokeStyle = `${accent}a0`
  ctx.stroke()
}

function paintFlow(ctx: CanvasRenderingContext2D, width: number, height: number, px: number, py: number, weight: number, time: number, accent: string) {
  const radius = Math.min(width, height) * 0.7
  const maximum = Math.min(18, height * 0.13 * 0.22)
  const paths = 7
  for (let route = 0; route < paths; route += 1) {
    const baseY = height * (0.12 + route * 0.13)
    ctx.beginPath()
    for (let step = 0; step <= 70; step += 1) {
      const x = step / 70 * width
      const phase = x / width * Math.PI * 2.2 + route * 0.57 + time * 0.00016
      const naturalY = baseY + Math.sin(phase) * height * 0.045
      const dx = x - px
      const dy = naturalY - py
      const distance = Math.hypot(dx, dy)
      const bend = radialDisplacement(distance, radius, weight, maximum) * (distance ? dy / distance : 0)
      const y = naturalY + bend
      if (step === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.lineWidth = route === 3 ? 1.25 : 0.7
    ctx.strokeStyle = route === 3 ? `${accent}bc` : `${accent}55`
    ctx.setLineDash(route === 3 ? [9, 12] : [])
    ctx.lineDashOffset = route === 3 ? -time * 0.012 : 0
    ctx.stroke()
  }
  ctx.setLineDash([])
}

function paintStudy(entry: CanvasStudy, pointer: PointerState, weight: number, time: number) {
  const { context: ctx, width, height, study, rect } = entry
  if (!width || !height) return
  ctx.clearRect(0, 0, width, height)
  const px = pointer.x - rect.left
  const py = pointer.y - rect.top
  if (study.name === 'mesh') paintMesh(ctx, width, height, px, py, weight, time, study.accent)
  if (study.name === 'contour') paintContours(ctx, width, height, px, py, weight, time, study.accent)
  if (study.name === 'axonometric') paintAxonometric(ctx, width, height, px, py, weight, study.accent)
  if (study.name === 'flow') paintFlow(ctx, width, height, px, py, weight, time, study.accent)
}

export function FieldDirectionLab() {
  const rootRef = useRef<HTMLElement | null>(null)
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([])
  const expandedRef = useRef<number | null>(null)
  const [expandedStudy, setExpandedStudy] = useState<number | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer: PointerState = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false }
    const entries: CanvasStudy[] = []
    let pointerWeight = 0
    let targetPointerX = pointer.x
    let targetPointerY = pointer.y
    let frame = 0
    let timer = 0
    let previousFrame = 0

    const resize = () => {
      canvasRefs.current.forEach((canvas, index) => {
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
        canvas.width = Math.round(rect.width * ratio)
        canvas.height = Math.round(rect.height * ratio)
        const context = canvas.getContext('2d', { alpha: true })
        if (!context) return
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
        entries[index] = { canvas, context, rect, width: rect.width, height: rect.height, study: studies[index] }
      })
      if (reducedMotion) entries.forEach((entry) => paintStudy(entry, pointer, 0, 0))
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reducedMotion) return
      targetPointerX = event.clientX
      targetPointerY = event.clientY
      pointer.active = true
    }
    const handlePointerLeave = () => { pointer.active = false }

    const render = (timestamp: number) => {
      frame = 0
      const elapsed = previousFrame ? Math.min(timestamp - previousFrame, 50) : 0
      previousFrame = timestamp
      const mix = reducedMotion ? 1 : 1 - Math.exp(-0.012 * elapsed)
      pointer.x += (targetPointerX - pointer.x) * mix
      pointer.y += (targetPointerY - pointer.y) * mix
      pointerWeight += ((pointer.active && !reducedMotion ? 1 : 0) - pointerWeight) * mix
      const selected = expandedRef.current
      entries.forEach((entry, index) => {
        if (selected !== null && index !== selected) return
        entry.rect = entry.canvas.getBoundingClientRect()
        paintStudy(entry, pointer, pointerWeight, reducedMotion ? 0 : timestamp)
      })
      if (!reducedMotion && document.visibilityState === 'visible') {
        timer = window.setTimeout(() => {
          timer = 0
          frame = requestAnimationFrame(render)
        }, 1000 / 30)
      }
    }

    const start = () => {
      if (!frame && !timer) frame = requestAnimationFrame(render)
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      if (timer) window.clearTimeout(timer)
      frame = 0
      timer = 0
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        previousFrame = 0
        resize()
        start()
      } else stop()
    }

    resize()
    root.addEventListener('pointermove', handlePointerMove, { passive: true })
    root.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', handleVisibility)
    const observer = new ResizeObserver(resize)
    canvasRefs.current.forEach((canvas) => { if (canvas?.parentElement) observer.observe(canvas.parentElement) })
    start()

    return () => {
      stop()
      observer.disconnect()
      root.removeEventListener('pointermove', handlePointerMove)
      root.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const setExpanded = (index: number | null) => {
    expandedRef.current = index
    setExpandedStudy(index)
  }

  return (
    <main className="field-lab" ref={rootRef}>
      <header className="field-lab__header">
        <a className="field-lab__back" href="/">← Portfolio</a>
        <div className="field-lab__heading">
          <p>Atmosphere studies / 01—04</p>
          <h1>Four ways to make the page feel alive.</h1>
        </div>
        {expandedStudy !== null ? (
          <button className="field-lab__compare" type="button" onClick={() => setExpanded(null)}>
            ← Compare all four
          </button>
        ) : (
          <span className="field-lab__hint">Move through each / select to expand</span>
        )}
      </header>

      <div className={`field-lab__grid${expandedStudy !== null ? ' field-lab__grid--expanded' : ''}`}>
        {studies.map((study, index) => (
          <button
            key={study.name}
            className={`field-study field-study--${study.name}`}
            type="button"
            aria-pressed={expandedStudy === index}
            aria-label={`${expandedStudy === index ? 'Collapse' : 'Expand'} ${study.title} background study`}
            onClick={() => setExpanded(expandedStudy === index ? null : index)}
            style={{ '--study-accent': study.accent } as CSSProperties}
          >
            <canvas ref={(node) => { canvasRefs.current[index] = node }} className="field-study__canvas" aria-hidden="true" />
            <span className="field-study__caption">
              <span className="field-study__number">{study.number} /</span>
              <span className="field-study__title">{study.title}</span>
              <span className="field-study__note">{study.note}</span>
            </span>
            <span className="field-study__expand" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <p className="field-lab__motion-note">Pointer response is disabled when reduced motion is enabled.</p>
    </main>
  )
}
