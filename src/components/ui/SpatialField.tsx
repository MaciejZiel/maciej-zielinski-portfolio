import { useEffect, useRef, type RefObject } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

interface PointerTarget {
  x: number
  y: number
  active: boolean
}

interface FieldScene {
  rgb: [number, number, number]
  bend: number
  flow: number
  perspective: number
  skew: number
  converge: number
  routes: number
}

const scenes: Record<string, FieldScene> = {
  top: { rgb: [194, 225, 126], bend: 0.42, flow: 0.12, perspective: 0.16, skew: 0.06, converge: 0, routes: 0 },
  about: { rgb: [194, 225, 126], bend: 0.42, flow: 0.12, perspective: 0.16, skew: 0.06, converge: 0, routes: 0 },
  steel: { rgb: [123, 228, 184], bend: 0.36, flow: 0.22, perspective: 0.18, skew: 0.1, converge: 0, routes: 0.12 },
  signal: { rgb: [255, 184, 108], bend: 0.68, flow: 1, perspective: 0.08, skew: -0.08, converge: 0, routes: 0 },
  vision: { rgb: [130, 177, 255], bend: 1.15, flow: 0.24, perspective: 1, skew: 0.42, converge: 0, routes: 0 },
  flights: { rgb: [113, 198, 218], bend: 0.58, flow: 0.38, perspective: 0.3, skew: 0.08, converge: 0, routes: 0.92 },
  track: { rgb: [212, 165, 224], bend: 0.82, flow: 0.68, perspective: 0.42, skew: 0.68, converge: 0, routes: 0 },
  skills: { rgb: [194, 225, 126], bend: 0.42, flow: 0.12, perspective: 0.16, skew: 0.06, converge: 0, routes: 0 },
  contact: { rgb: [194, 225, 126], bend: 0.3, flow: 0.04, perspective: 0.12, skew: 0.02, converge: 0.26, routes: 0 },
}

export function SpatialField({
  chapter,
  pointerTarget,
  reduceMotion,
  pageVisible,
  scrollYProgress,
}: {
  chapter: string
  pointerTarget: RefObject<PointerTarget>
  reduceMotion: boolean
  pageVisible: boolean
  scrollYProgress: MotionValue<number>
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scrollRef = useRef(0)
  const sceneRef = useRef<FieldScene>({ ...scenes.top, rgb: [...scenes.top.rgb] })
  const elapsedRef = useRef(0)
  const hasWokenRef = useRef(false)

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    scrollRef.current = progress
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let frame = 0
    let previousFrame = 0
    const wakeStartedAt = performance.now()
    let pointerX = -1000
    let pointerY = -1000
    let pointerWeight = 0
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (timestamp: number) => {
      if (width === 0 || height === 0) return
      const elapsed = previousFrame === 0 ? 0 : Math.min(timestamp - previousFrame, 50)
      previousFrame = timestamp
      elapsedRef.current += reduceMotion || !pageVisible ? 0 : elapsed
      const scene = sceneRef.current
      const targetScene = scenes[chapter] ?? scenes.top
      const sceneMix = reduceMotion ? 1 : 1 - Math.exp(-0.0019 * elapsed)
      scene.rgb = scene.rgb.map((channel, index) => channel + (targetScene.rgb[index] - channel) * sceneMix) as FieldScene['rgb']
      scene.bend += (targetScene.bend - scene.bend) * sceneMix
      scene.flow += (targetScene.flow - scene.flow) * sceneMix
      scene.perspective += (targetScene.perspective - scene.perspective) * sceneMix
      scene.skew += (targetScene.skew - scene.skew) * sceneMix
      scene.converge += (targetScene.converge - scene.converge) * sceneMix
      scene.routes += (targetScene.routes - scene.routes) * sceneMix

      const pointer = pointerTarget.current
      const pointerMix = reduceMotion ? 0 : 1 - Math.exp(-0.012 * elapsed)
      pointerX += ((pointer.active ? pointer.x : -1000) - pointerX) * pointerMix
      pointerY += ((pointer.active ? pointer.y : -1000) - pointerY) * pointerMix
      pointerWeight += ((pointer.active && !reduceMotion ? 1 : 0) - pointerWeight) * pointerMix

      const progress = reduceMotion ? 0 : scrollRef.current
      const wakeProgress = reduceMotion || !pageVisible || hasWokenRef.current
        ? 1
        : Math.min(1, Math.max(0, (timestamp - wakeStartedAt) / 1180))
      if (wakeProgress === 1) hasWokenRef.current = true
      const centerX = width * 0.5
      const centerY = height * 0.5
      const scale = 1 + (progress - 0.35) * 0.036
      const stepX = width <= 760 ? 128 : 94
      const stepY = width <= 760 ? 116 : 88
      const columns = Math.ceil(width / stepX) + 3
      const rows = Math.ceil(height / stepY) + 3
      const originX = (width - (columns - 1) * stepX) / 2 - stepX
      const originY = (height - (rows - 1) * stepY) / 2 - stepY
      const radius = Math.min(520, width * 0.42)
      const time = elapsedRef.current
      const phase = time * 0.00022
      const color = scene.rgb.map((channel) => Math.round(channel)).join(',')
      const pointAt = (column: number, row: number) => {
        const baseX = originX + column * stepX
        const baseY = originY + row * stepY
        const centeredY = baseY - centerY
        const ambient = reduceMotion || !pageVisible ? 0 : 3.6 * (1 - scene.converge * 0.8)
        const wave = Math.sin(baseX * 0.004 + phase + baseY * 0.002) * ambient
        const audioBend = Math.sin(baseX * 0.004 + baseY * 0.006 - phase * 1.3) * scene.flow * 14
        const pointerDX = baseX - pointerX
        const pointerDY = baseY - pointerY
        const distance = Math.hypot(pointerDX, pointerDY)
        const falloff = pointerWeight * Math.pow(Math.max(0, 1 - distance / radius), 1.8)
        const inverseDistance = 1 / Math.max(distance, 1)

        const x = centerX + (baseX - centerX) * scale + centeredY * (progress * 0.012 + scene.skew * 0.075) + wave - pointerDX * inverseDistance * falloff * 68 * scene.bend
        const y = centerY + centeredY * (scale + (centeredY / centerY) * scene.perspective * 0.09) + Math.cos(baseX * 0.004 - phase) * ambient * 0.65 + audioBend - pointerDY * inverseDistance * falloff * 68 * scene.bend
        const focusX = width * 0.39
        const focusY = height * 0.36
        const converge = scene.converge * Math.max(0, Math.min(1, (progress - 0.78) / 0.22))

        return {
          x: x + (focusX - x) * converge,
          y: y + (focusY - y) * converge,
        }
      }

      context.clearRect(0, 0, width, height)
      context.lineWidth = 0.7
      for (let row = 0; row < rows; row += 1) {
        context.beginPath()
        for (let column = 0; column < columns; column += 1) {
          const point = pointAt(column, row)
          if (column === 0) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        const majorLine = row % 4 === 0
        context.lineWidth = majorLine ? 0.9 : 0.55
        context.strokeStyle = `rgba(${color},${(majorLine ? 0.105 : 0.045) * wakeProgress})`
        context.stroke()
      }
      for (let column = 0; column < columns; column += 1) {
        context.beginPath()
        for (let row = 0; row < rows; row += 1) {
          const point = pointAt(column, row)
          if (row === 0) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        const majorLine = column % 4 === 0
        context.lineWidth = majorLine ? 0.9 : 0.55
        context.strokeStyle = `rgba(${color},${(majorLine ? 0.105 : 0.045) * wakeProgress})`
        context.stroke()
      }

      // Slow, flowing contours add a second sense of depth to the rigid lattice.
      const contourCount = width <= 760 ? 7 : 11
      const contourAmplitude = (12 + scene.bend * 18 + scene.flow * 38) * (width <= 760 ? 0.72 : 1)
      let centerContour: Path2D | null = null
      for (let lane = 0; lane < contourCount; lane += 1) {
        const laneProgress = lane / (contourCount - 1)
        const baseY = height * (0.12 + laneProgress * 0.76)
        const phaseOffset = lane * 0.58
        const centerLane = lane === Math.floor(contourCount / 2)
        const path = centerLane ? new Path2D() : null
        if (!path) context.beginPath()
        for (let sample = 0; sample <= 72; sample += 1) {
          const progressX = sample / 72
          const x = progressX * width
          const wave = Math.sin(progressX * Math.PI * 3 + phase + phaseOffset) * contourAmplitude
            + Math.sin(progressX * Math.PI * 1.1 - phase * 0.72 + phaseOffset * 1.7) * contourAmplitude * 0.42
          const pointerDX = x - pointerX
          const pointerDY = baseY - pointerY
          const pointerDistance = Math.hypot(pointerDX, pointerDY)
          const pointerFalloff = pointerWeight * Math.pow(Math.max(0, 1 - pointerDistance / (radius * 0.72)), 2)
          const pointerWarp = pointerFalloff * Math.sign(pointerDY || 1) * 34 * scene.bend
          const y = baseY + wave + pointerWarp
          if (path) {
            if (sample === 0) path.moveTo(x, y)
            else path.lineTo(x, y)
          } else if (sample === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.lineWidth = centerLane ? 1.05 : 0.65
        context.strokeStyle = `rgba(${color},${(centerLane ? 0.34 + scene.flow * 0.1 : 0.105 + scene.flow * 0.055) * wakeProgress})`
        if (path) {
          context.stroke(path)
          centerContour = path
        } else context.stroke()
      }

      // A single moving signal gives the field a sense of direction without UI clutter.
      if (centerContour && !reduceMotion) {
        context.beginPath()
        context.setLineDash([2, 18])
        context.lineDashOffset = -time * 0.014
        context.lineWidth = 1.1
        context.strokeStyle = `rgba(${color},${(0.22 + scene.flow * 0.1) * wakeProgress})`
        context.stroke(centerContour)
        context.setLineDash([])
      }

      // Project atmospheres crossfade through the existing scene interpolation.
      if (scene.perspective > 0.08) {
        const horizonX = width * (0.5 + scene.skew * 0.06)
        const horizonY = height * 0.28
        context.lineWidth = 0.7
        context.strokeStyle = `rgba(${color},${(0.035 + scene.perspective * 0.09) * wakeProgress})`
        for (let ray = -7; ray <= 7; ray += 1) {
          context.beginPath()
          context.moveTo(horizonX, horizonY)
          context.lineTo(width * 0.5 + ray * width * 0.115, height * 1.04)
          context.stroke()
        }
        for (let row = 1; row <= 8; row += 1) {
          const depth = row / 8
          const y = horizonY + (height * 1.04 - horizonY) * depth * depth
          const spread = width * depth * 0.56
          context.beginPath()
          context.moveTo(horizonX - spread, y)
          context.quadraticCurveTo(horizonX, y - 12 * scene.perspective, horizonX + spread, y)
          context.stroke()
        }
      }

      if (scene.skew > 0.18) {
        context.lineWidth = 0.75
        context.strokeStyle = `rgba(${color},${(0.025 + scene.skew * 0.11) * wakeProgress})`
        const centerX = width * 0.52
        const centerY = height * 0.54
        for (let lane = 0; lane < 3; lane += 1) {
          const radiusX = Math.min(width * 0.44, height * 0.82) * (0.48 + lane * 0.2)
          const radiusY = height * (0.18 + lane * 0.1)
          context.beginPath()
          for (let sample = 0; sample <= 96; sample += 1) {
            const angle = sample / 96 * Math.PI * 2
            const contour = 1 + Math.sin(angle * 3 + phase + lane * 0.35) * 0.045
            const x = centerX + Math.cos(angle) * radiusX * contour
            const y = centerY + Math.sin(angle) * radiusY * contour
            if (sample === 0) context.moveTo(x, y)
            else context.lineTo(x, y)
          }
          context.closePath()
          context.stroke()
        }
      }

      if (scene.routes > 0.015) {
        const hubX = width * (0.51 + (pointerX - width * 0.51) * 0.025 * pointerWeight)
        const hubY = height * (0.49 + (pointerY - height * 0.49) * 0.08 * pointerWeight)
        let centralRoute: Path2D | null = null
        for (let route = 0; route < 3; route += 1) {
          const offset = route - 1
          const sourceY = height * (0.24 + route * 0.26)
          const destinationY = height * (0.27 + ((route + 1) % 3) * 0.23)
          const central = route === 1
          const path = central ? new Path2D() : null
          if (path) {
            path.moveTo(-width * 0.06, sourceY)
            path.bezierCurveTo(width * 0.2, sourceY, width * 0.31, hubY + offset * 30, hubX, hubY + offset * 12)
            path.bezierCurveTo(width * 0.7, hubY + offset * 12, width * 0.79, destinationY, width * 1.06, destinationY)
          } else {
            context.beginPath()
            context.moveTo(-width * 0.06, sourceY)
            context.bezierCurveTo(width * 0.2, sourceY, width * 0.31, hubY + offset * 30, hubX, hubY + offset * 12)
            context.bezierCurveTo(width * 0.7, hubY + offset * 12, width * 0.79, destinationY, width * 1.06, destinationY)
          }
          context.lineWidth = route === 1 ? 1.15 : 0.7
          context.strokeStyle = `rgba(${color},${(route === 1 ? 0.3 : 0.12) * scene.routes * wakeProgress})`
          if (path) {
            context.stroke(path)
            centralRoute = path
          } else context.stroke()
        }
        if (centralRoute && !reduceMotion) {
          context.beginPath()
          context.setLineDash([2, 16])
          context.lineDashOffset = -time * 0.018
          context.lineWidth = 1.15
          context.strokeStyle = `rgba(${color},${0.38 * scene.routes * wakeProgress})`
          context.stroke(centralRoute)
          context.setLineDash([])
        }
      }
    }

    const handleResize = () => {
      resize()
      if (reduceMotion || !pageVisible) draw(0)
    }

    handleResize()
    if (!reduceMotion && pageVisible) {
      const animate = (timestamp: number) => {
        frame = requestAnimationFrame(animate)
        if (timestamp - previousFrame < 1000 / 30) return
        draw(timestamp)
      }
      frame = requestAnimationFrame(animate)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [chapter, pageVisible, pointerTarget, reduceMotion])

  return <canvas className="spatial-field" ref={canvasRef} aria-hidden="true" />
}
